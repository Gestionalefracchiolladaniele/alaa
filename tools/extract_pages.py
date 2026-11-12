"""Estrae le 30 immagini native del portfolio PDF (senza ricompressione).

Uso: uv run --with pymupdf python -I tools/extract_pages.py
Output: tools/_cache/pages/p01.jpg|png ... p30
"""
from pathlib import Path
import pymupdf as fitz

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "sorgenti" / "Arch. Alaa Attal portfolio .pdf"
OUT = ROOT / "tools" / "_cache" / "pages"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(PDF)
    for i, page in enumerate(doc, start=1):
        imgs = page.get_images(full=True)
        if not imgs:
            print(f"p{i:02d}: nessuna immagine")
            continue
        info = doc.extract_image(imgs[0][0])
        ext = info["ext"]
        if ext == "jpeg":
            ext = "jpg"
        for old in OUT.glob(f"p{i:02d}.*"):
            old.unlink()
        path = OUT / f"p{i:02d}.{ext}"
        path.write_bytes(info["image"])
        print(f"p{i:02d}: {info['width']}x{info['height']} {ext} ({len(imgs)} immagini sulla pagina)")


if __name__ == "__main__":
    main()
