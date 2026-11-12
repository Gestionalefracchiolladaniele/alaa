"""Campiona i colori dalle pagine del PDF e scrive sito/src/styles/tokens.css.

Uso: uv run --with pillow --with numpy python -I tools/sample_palette.py
Ogni campione e' un riquadro (pixel nativi) su una pagina estratta da extract_pages.py.
mode: "median" = mediana del riquadro; "mid" = mediana dei toni medi (35-75%); "dark" = mediana del 12% piu' scuro
(per prendere l'inchiostro di un titolo e non la carta); "light" = 12% piu' chiaro.
Scrive anche tools/_cache/palette.png per il controllo a vista.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / "tools" / "_cache" / "pages"
TOKENS = ROOT / "sito" / "src" / "styles" / "tokens.css"

# nome, pagina, (x0, y0, x1, y1), modo, descrizione
SAMPLES = [
    ("cream",        1, (620, 990, 760, 1060), "median", "carta crema della copertina"),
    ("cream-2",      4, (110, 170, 400, 200),  "median", "carta crema delle copertine di sezione"),
    ("cream-deep",   3, (60, 700, 300, 760),   "median", "carta crema piu' calda (p3)"),
    ("ink",          4, (90, 215, 640, 310),   "dark",   "inchiostro dei titoli (INTERIOR)"),
    ("ink-black",    1, (65, 80, 330, 170),    "dark",   "nero di PORT"),
    ("burgundy",     1, (335, 80, 560, 170),   "dark",   "bordeaux di FOLIO"),
    ("burgundy-2",   4, (95, 330, 590, 440),   "dark",   "bordeaux di DESIGN"),
    ("velvet",       30, (0, 0, 200, 120),     "median", "velluto bordeaux (angolo di p30)"),
    ("velvet-dark",  1, (40, 930, 300, 1060),  "p50",    "ombra del velluto (p1)"),
    ("velvet-light", 1, (40, 930, 300, 1060),  "p90",    "luce del velluto (p1)"),
    ("gold",         4, (915, 850, 965, 910),  "mid",    "disco di ottone (campioni materiali)"),
    ("gold-light",   4, (1148, 196, 1392, 216), "light",  "riflesso della cornice"),
    ("gold-book",    4, (1080, 760, 1310, 790), "light",  "scritta oro sui libri"),
    ("olive",        4, (1120, 450, 1240, 530), "median", "cuscino verde oliva"),
    ("olive-leaf",   4, (1180, 30, 1330, 140),  "p30",   "foglie d'ulivo (p4)"),
    ("leather",      4, (1050, 800, 1400, 830), "median", "dorso dei libri in pelle"),
    ("leather-dark", 4, (1050, 860, 1400, 870), "dark",   "ombra tra i libri"),
    ("line",         4, (24, 200, 40, 800),     "dark",   "filetto della cornice di pagina"),
    ("stone",        3, (500, 870, 700, 960),   "median", "pietra calda (p3)"),
]


def sample(img: np.ndarray, box, mode: str) -> np.ndarray:
    x0, y0, x1, y1 = box
    px = img[y0:y1, x0:x1].reshape(-1, 3).astype(float)
    if mode == "median":
        return np.median(px, axis=0)
    if mode == "mid":
        lum = px @ np.array([0.2126, 0.7152, 0.0722])
        lo, hi = np.percentile(lum, [35, 75])
        return np.median(px[(lum >= lo) & (lum <= hi)], axis=0)
    lum = px @ np.array([0.2126, 0.7152, 0.0722])
    if mode.startswith("p"):
        t = np.percentile(lum, int(mode[1:]))
        return np.median(px[np.abs(lum - t) < 8], axis=0)
    k = max(1, int(len(px) * 0.12))
    idx = np.argsort(lum)
    sel = idx[:k] if mode == "dark" else idx[-k:]
    return np.median(px[sel], axis=0)


def hexof(c) -> str:
    return "#%02x%02x%02x" % tuple(int(round(v)) for v in c)


def main() -> None:
    cache = {}
    out = []
    for name, page, box, mode, desc in SAMPLES:
        if page not in cache:
            f = next(PAGES.glob(f"p{page:02d}.*"))
            cache[page] = np.asarray(Image.open(f).convert("RGB"))
        out.append((name, hexof(sample(cache[page], box, mode)), page, desc))

    # foglio di controllo
    sw = Image.new("RGB", (900, 60 * len(out)), "white")
    d = ImageDraw.Draw(sw)
    for i, (name, hx, page, desc) in enumerate(out):
        d.rectangle([0, i * 60, 200, i * 60 + 58], fill=hx)
        d.text((215, i * 60 + 20), f"{name}  {hx}  p{page}  {desc}", fill="black")
    sw.save(ROOT / "tools" / "_cache" / "palette.png")
    (ROOT / "tools" / "_cache" / "palette.json").write_text(json.dumps(out, indent=1))
    for row in out:
        print(*row)
    write_tokens(out)


def write_tokens(out) -> None:
    lines = [
        "/* Generato da tools/sample_palette.py: colori campionati dalle pagine del PDF.",
        "   Non modificare i colori a mano: cambia i riquadri nello script e rilancialo. */",
        ":root {",
    ]
    for name, hx, page, desc in out:
        lines.append(f"  --c-{name}: {hx}; /* p{page} {desc} */")
    lines.append("}")
    lines.append(STATIC_TOKENS)
    TOKENS.parent.mkdir(parents=True, exist_ok=True)
    TOKENS.write_text(chr(10).join(lines) + chr(10), encoding="utf-8")


STATIC_TOKENS = """
:root {
  /* ruoli */
  --paper: var(--c-cream-2);
  --paper-warm: var(--c-cream);
  --paper-deep: var(--c-cream-deep);
  --ink: var(--c-ink);
  --ink-strong: var(--c-ink-black);
  --accent: var(--c-burgundy);
  --accent-soft: var(--c-burgundy-2);
  --gold: var(--c-gold);
  --gold-light: var(--c-gold-light);
  --rule: var(--c-line);

  /* font */
  --f-display: "Bodoni Moda", "Didot", "Bodoni 72", Georgia, serif;
  --f-text: "Cormorant Garamond", Garamond, Georgia, serif;
  --f-label: "Jost", "Futura", "Century Gothic", system-ui, sans-serif;
  --f-script: "Allura", "Snell Roundhand", cursive;

  /* scala tipografica */
  --t-hero: clamp(3.2rem, 9vw, 8.5rem);
  --t-h1: clamp(2.6rem, 6.5vw, 5.6rem);
  --t-h2: clamp(1.9rem, 3.6vw, 3rem);
  --t-h3: clamp(1.25rem, 2vw, 1.6rem);
  --t-body: clamp(1.1rem, 1.2vw, 1.3rem);
  --t-small: 0.95rem;
  --t-label: 0.78rem;
  --t-script: clamp(2rem, 4vw, 3.4rem);
  --track-label: 0.28em;

  /* spaziature */
  --s-1: 0.25rem; --s-2: 0.5rem; --s-3: 0.75rem; --s-4: 1rem; --s-5: 1.5rem;
  --s-6: 2rem; --s-7: 3rem; --s-8: 4.5rem; --s-9: 7rem;
  --gutter: clamp(1rem, 4vw, 3.5rem);
  --maxw: 1320px;

  /* raggi e ombre */
  --r-1: 2px; --r-2: 6px; --r-3: 14px; --r-round: 999px;
  --shadow-1: 0 1px 2px rgb(47 37 22 / 0.12), 0 2px 8px rgb(47 37 22 / 0.08);
  --shadow-2: 0 6px 18px rgb(47 37 22 / 0.16), 0 2px 4px rgb(47 37 22 / 0.1);
  --shadow-3: 0 18px 48px rgb(47 37 22 / 0.24);
  --shadow-frame: inset 0 0 0 1px rgb(255 240 200 / 0.35), 0 10px 26px rgb(47 37 22 / 0.3);
}
"""


if __name__ == "__main__":
    main()
