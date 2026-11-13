"""Trasforma le clip di da-fornire/clip/ in fotogrammi WebP per il sito.

Uso: uv run --no-project python -I tools/build_frames.py [clip-1 ...]
Legge tools/clips.json. Per ogni clip scrive:
  sito/public/sequences/<clip>/desktop/0001.webp ...
  sito/public/sequences/<clip>/mobile/0001.webp ...
  sito/public/sequences/<clip>/manifest.json   (numero di fotogrammi, dimensioni, peso)
Il sito legge il manifest: se manca, usa l'immagine di riserva.
Con "key": true il fondo crema diventa trasparente (colore letto dal centro del primo fotogramma).
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CLIPS = ROOT / "da-fornire" / "clip"
OUT = ROOT / "sito" / "public" / "sequences"
CONFIG = json.loads((ROOT / "tools" / "clips.json").read_text(encoding="utf-8"))


def run(args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
         "-of", "csv=p=0", str(path)], check=True, capture_output=True, text=True).stdout.strip()
    w, h = out.split(",")[:2]
    return int(w), int(h)


def centre_colour(path, frame):
    """Colore del pixel al centro del fotogramma indicato, come 0xRRGGBB."""
    w, h = probe(path)
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-vf",
         f"select='eq(n\\,{frame})',crop=8:8:{w // 2}:{h // 2},scale=1:1", "-frames:v", "1",
         "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], check=True, capture_output=True).stdout
    return "0x%02X%02X%02X" % tuple(raw[:3])


def build(name, cfg):
    src = CLIPS / f"{name}.mp4"
    if not src.exists():
        print(f"{name}: manca {src.name}, salto")
        return
    w, h = probe(src)
    first, last = cfg["first"], cfg["last"]
    manifest = {"clip": name, "source": [w, h], "first": first, "last": last, "keyed": bool(cfg.get("key"))}
    dest = OUT / name
    if dest.exists():
        shutil.rmtree(dest)
    for variant in ("desktop", "mobile"):
        v = cfg[variant]
        d = dest / variant
        d.mkdir(parents=True)
        width = min(v["width"], w)
        filters = [f"select='between(n\\,{first}\\,{last})*not(mod(n-{first}\\,{v['step']}))'",
                   f"scale={width}:-2:flags=lanczos"]
        if cfg.get("key"):
            filters += [f"colorkey={centre_colour(src, first)}:0.20:0.10", "format=yuva420p"]
        run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-an", "-vf", ",".join(filters),
             "-fps_mode", "vfr", "-c:v", "libwebp", "-quality", str(v["quality"]), "-compression_level", "5",
             str(d / "%04d.webp")])
        files = sorted(d.glob("*.webp"))
        kb = sum(f.stat().st_size for f in files) // 1024
        manifest[variant] = {"frames": len(files), "width": width, "height": round(h * width / w / 2) * 2, "kb": kb}
        print(f"{name} {variant}: {len(files)} fotogrammi, {kb} KB")
    (dest / "manifest.json").write_text(json.dumps(manifest, indent=1), encoding="utf-8")


if __name__ == "__main__":
    wanted = sys.argv[1:] or [k for k in CONFIG if not k.startswith("_")]
    for clip in wanted:
        build(clip, CONFIG[clip])
