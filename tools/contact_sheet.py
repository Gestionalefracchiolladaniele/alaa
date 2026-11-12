"""Foglio di controllo con tutti gli slot, per verificare i ritagli a colpo d'occhio.

Uso: uv run --with pillow python -I tools/contact_sheet.py [pagina ...]
Output: tools/_cache/contact/sheet-NN.jpg (un foglio ogni ~30 slot), con id e pagina sotto ogni miniatura.
Con dei numeri di pagina come argomenti, mostra solo gli slot di quelle pagine.
"""
from pathlib import Path
import json
import sys
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "sito" / "src" / "data" / "slots.json"
SLOTS = ROOT / "sito" / "src" / "assets" / "slots"
OUT = ROOT / "tools" / "_cache" / "contact"

CELL_W, CELL_H, LABEL = 300, 220, 30
COLS, ROWS = 6, 5


def main() -> None:
    pages = {int(a) for a in sys.argv[1:]}
    slots = [s for s in json.loads(MANIFEST.read_text(encoding="utf-8")) if not pages or s["page"] in pages]
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("sheet-*.jpg"):
        old.unlink()
    per = COLS * ROWS
    for k in range(0, len(slots), per):
        chunk = slots[k:k + per]
        rows = (len(chunk) + COLS - 1) // COLS
        sheet = Image.new("RGB", (COLS * CELL_W, rows * (CELL_H + LABEL)), (235, 228, 214))
        d = ImageDraw.Draw(sheet)
        for i, s in enumerate(chunk):
            f = next(SLOTS.glob(f"{s['id']}.*"), None)
            x, y = (i % COLS) * CELL_W, (i // COLS) * (CELL_H + LABEL)
            if f:
                im = Image.open(f).convert("RGB")
                im.thumbnail((CELL_W - 10, CELL_H - 10))
                sheet.paste(im, (x + (CELL_W - im.width) // 2, y + (CELL_H - im.height) // 2))
            else:
                d.text((x + 10, y + 10), "MANCA", fill=(160, 0, 0))
            d.text((x + 6, y + CELL_H + 4), f"{s['id']}  p{s['page']}", fill=(30, 20, 10))
        name = OUT / f"sheet-{k // per + 1:02d}.jpg"
        sheet.save(name, quality=82)
        print(name.relative_to(ROOT))


if __name__ == "__main__":
    main()
