"""Prepara i fotogrammi di partenza per le clip AI e il ritaglio del ciak.

Uso: uv run --with pillow --with numpy python -I tools/make_references.py
Input: tools/_cache/pages/ (da extract_pages.py)
Output: da-fornire/riferimenti/clip-N-start.png, sito/src/assets/ciak.png (+ copia in riferimenti)
Ogni ritaglio e' in pixel nativi della pagina; se non e' 16:9 lo si porta a 16:9 ritagliando, mai deformando.
Ingrandimento a 1920x1080 con Lanczos (le clip chiedono almeno 1920x1080 in ingresso).
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / "tools" / "_cache" / "pages"
OUT = ROOT / "da-fornire" / "riferimenti"
ASSETS = ROOT / "sito" / "src" / "assets"

# nome, pagina, riquadro (x0, y0, x1, y1) gia' in 16:9 o quasi
CLIPS = [
    ("clip-1-start", 1, (468, 172, 1448, 723)),   # pellicola + ulivo (senza titoli, senza ciak)
    ("clip-2-start", 3, (668, 120, 1448, 575)),   # arco con il mare
    ("clip-3-start", 30, (0, 0, 176, 99)),        # velluto bordeaux, angolo in alto a sinistra (solo velluto, molto ingrandito)
    ("clip-4-start", 12, (900, 250, 1448, 558)),  # parete crema con ombre di foglie e colonna di pietra
]

CIAK = (60, 522, 446, 888)


def page(n: int) -> Image.Image:
    return Image.open(next(PAGES.glob(f"p{n:02d}.*"))).convert("RGB")


def to_169(box):
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    target_h = round(w * 9 / 16)
    if target_h <= h:
        cy = (y0 + y1) / 2
        return (x0, round(cy - target_h / 2), x1, round(cy - target_h / 2) + target_h)
    target_w = round(h * 16 / 9)
    cx = (x0 + x1) / 2
    return (round(cx - target_w / 2), y0, round(cx - target_w / 2) + target_w, y1)


def hull(points):
    pts = sorted(set(points))
    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lower, upper = [], []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]


def ciak_cutout(img: Image.Image) -> Image.Image:
    """Ritaglio del ciak: maschera = inviluppo convesso dei pixel neri/grigi neutri (il ciak),
    esclusi velluto e pellicola che sono scuri ma rossastri."""
    from PIL import ImageDraw
    crop = img.crop(CIAK)
    a = np.asarray(crop).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    neutral_dark = (lum < 75) & (np.abs(r - b) < 22) & (np.abs(r - g) < 18)
    ys, xs = np.nonzero(neutral_dark)
    pts = list(zip(xs.tolist()[::3], ys.tolist()[::3]))
    poly = hull(pts)
    m = Image.new("L", crop.size, 0)
    ImageDraw.Draw(m).polygon(poly, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(0.7))
    out = crop.convert("RGBA")
    out.putalpha(m)
    return out.crop(out.getbbox())


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, n, box in CLIPS:
        b = to_169(box)
        im = page(n).crop(b).resize((1920, 1080), Image.LANCZOS)
        im.save(OUT / f"{name}.png", optimize=True)
        print(name, f"p{n}", b, f"{b[2]-b[0]}x{b[3]-b[1]} -> 1920x1080")
    c = ciak_cutout(page(1))
    ASSETS.mkdir(parents=True, exist_ok=True)
    c.save(ASSETS / "ciak.png", optimize=True)
    c.save(OUT / "ciak.png", optimize=True)
    print("ciak", CIAK, c.size)


if __name__ == "__main__":
    main()
