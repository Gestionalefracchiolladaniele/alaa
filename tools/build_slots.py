"""Crea le immagini degli slot a partire dal manifesto sito/src/data/slots.json.

Uso: uv run --with pillow python -I tools/build_slots.py [id ...]
Per ogni slot:
  1. se esiste originali/<id>.<est> (jpg, jpeg, png, webp, tif), usa quello (solo ridimensionato se enorme);
  2. altrimenti ritaglia la pagina `page` (tools/_cache/pages, da extract_pages.py) nel riquadro `crop`
     (pixel nativi) e lo ingrandisce 2x con Lanczos + leggera nitidezza;
  3. scrive sito/src/assets/slots/<id>.jpg (o .png se l'originale e' PNG con trasparenza).
Scrive anche sito/src/data/slots-report.json con dimensioni e provenienza di ogni slot.

Ingrandimento: Real-ESRGAN (ncnn-vulkan) e' stato provato in F1 su creo-sharjah-hero e ha superato
i 3 minuti per una sola immagine su questo PC: si usa Lanczos 2x (vedi piano/AVANZAMENTO.md).
"""
from pathlib import Path
import json
import sys
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / "tools" / "_cache" / "pages"
ORIG = ROOT / "originali"
MANIFEST = ROOT / "sito" / "src" / "data" / "slots.json"
OUT = ROOT / "sito" / "src" / "assets" / "slots"
REPORT = ROOT / "sito" / "src" / "data" / "slots-report.json"

SCALE = 2          # ingrandimento dei ritagli dal PDF
MAX_SIDE = 2400    # lato massimo per qualsiasi immagine (anche gli originali)
QUALITY = 88


def find_original(slot_id: str):
    for ext in ("jpg", "jpeg", "png", "webp", "tif", "tiff"):
        p = ORIG / f"{slot_id}.{ext}"
        if p.exists():
            return p
    return None


def fit(im: Image.Image) -> Image.Image:
    w, h = im.size
    k = MAX_SIDE / max(w, h)
    if k < 1:
        im = im.resize((round(w * k), round(h * k)), Image.LANCZOS)
    return im


def main() -> None:
    only = set(sys.argv[1:])
    slots = json.loads(MANIFEST.read_text(encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)
    pages = {}
    report = {}
    for s in slots:
        sid = s["id"]
        if only and sid not in only:
            continue
        orig = find_original(sid)
        if orig:
            im = Image.open(orig)
            has_alpha = im.mode in ("RGBA", "LA") or "transparency" in im.info
            im = fit(im.convert("RGBA" if has_alpha else "RGB"))
            source = f"originali/{orig.name}"
        else:
            n = s["page"]
            if n not in pages:
                pages[n] = Image.open(next(PAGES.glob(f"p{n:02d}.*"))).convert("RGB")
            x0, y0, x1, y1 = s["crop"]
            im = pages[n].crop((x0, y0, x1, y1))
            im = im.resize((im.width * SCALE, im.height * SCALE), Image.LANCZOS)
            im = im.filter(ImageFilter.UnsharpMask(radius=1.4, percent=55, threshold=2))
            im = fit(im)
            has_alpha = False
            source = f"pdf p{n} {s['crop']}"
        for old in OUT.glob(f"{sid}.*"):
            old.unlink()
        if has_alpha:
            path = OUT / f"{sid}.png"
            im.save(path, optimize=True)
        else:
            path = OUT / f"{sid}.jpg"
            im.save(path, quality=QUALITY, optimize=True, progressive=True)
        report[sid] = {"file": path.name, "width": im.width, "height": im.height, "source": source,
                       "original": bool(orig)}
    if not only:
        REPORT.write_text(json.dumps(report, indent=1), encoding="utf-8")
        missing = sum(1 for r in report.values() if not r["original"])
        print(f"{len(report)} slot scritti; {missing} ancora ritagliati dal PDF")
    else:
        print(f"{len(report)} slot aggiornati (report non riscritto)")


if __name__ == "__main__":
    main()
