"""Cucina CREO, Sharjah (portfolio p9): parete lineare.

Ricostruzione dalla vista frontale e dall'alzato della tavola: è uno studio 3D,
non il progetto esecutivo. Misure in metri, stimate dalle proporzioni
dell'immagine assumendo un'altezza di 2,40 m.

Assi: x lungo la parete, y profondità (il fronte guarda verso -y), z altezza.

Materiali che il configuratore del sito può cambiare:
  cabinet  ante laccate (originale: Matt Grey Lacquer)
  wood     frontali in legno (originale: Walnut Veneer)
  worktop  piano e schienale (originale: Dark Quartz)
  led      luci (accese / spente)
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import Builder  # noqa: E402

# ---- misure ---------------------------------------------------------------
H = 2.40                     # altezza totale
W_GLASS, W_CENTER, W_TALL = 1.04, 2.52, 1.04
X1 = W_GLASS                 # fine vetrine
X2 = X1 + W_CENTER           # fine blocco centrale
X3 = X2 + W_TALL             # fine colonne
D = 0.60                     # profondità basi e colonne
D_UP = 0.36                  # profondità pensili e nicchie alte
PLINTH = 0.08
Z_BASE = 0.76                # sommità dei frontali delle basi
Z_TOP0, Z_TOP1 = 0.80, 0.84  # piano di lavoro
Z_UP0, Z_UP1 = 1.49, 1.93    # pensili
Z_NICHE1 = 2.33              # sommità delle nicchie alte
GAP = 0.003                  # fuga tra i frontali
T = 0.020                    # spessore frontali
BEV = 0.0015

b = Builder()
b.material("cabinet", "#6f6a66", rough=0.55)
b.material("wood", "#6b4226", rough=0.45)
b.material("worktop", "#2e2b29", rough=0.30)
b.material("frame", "#151413", rough=0.40, metal=0.6)
b.material("glass", "#3a3430", rough=0.05, alpha=0.22)
b.material("led", "#ffc477", rough=0.5, emit=6.0)
b.material("niche", "#5b4a3b", rough=0.6)
b.material("interior", "#1c1917", rough=0.7)
b.material("appliance", "#0c0c0c", rough=0.15)
b.material("metal", "#b9b4ac", rough=0.35, metal=1.0)
b.material("ceramic", "#efe9df", rough=0.35)
b.material("floor", "#8b857d", rough=0.5)
b.material("wall", "#b3a698", rough=0.9)


def front(part, x0, x1, z0, z1, depth):
    """Un frontale (anta o cassetto) con la sua fuga."""
    b.box(part, x0 + GAP / 2, x1 - GAP / 2, -depth - T, -depth, z0 + GAP / 2, z1 - GAP / 2, bevel=BEV)


def carcass(x0, x1, z0, z1, depth):
    b.box("interior", x0, x1, -depth, 0, z0, z1)


# ---- ambiente -------------------------------------------------------------
b.box("floor", -6.0, X3 + 6.0, -7.0, 0, -0.02, 0)
b.box("wall", -6.0, X3 + 6.0, 0, 0.02, 0, 7.0)       # parete ampia: nessun bordo in vista

# ---- zoccolo --------------------------------------------------------------
b.box("interior", 0, X3, -D + 0.05, 0, 0, PLINTH)

# ---- 1. vetrine alte (0 → X1) ----------------------------------------------
FR = 0.035                                   # telaio in alluminio nero
b.box("interior", 0, X1, -0.02, 0, PLINTH, H)                # schiena
for x0, x1 in ((0, 0.02), (X1 - 0.02, X1)):                  # fianchi
    b.box("frame", x0, x1, -D, 0, PLINTH, H)
b.box("frame", 0, X1, -D, 0, PLINTH, PLINTH + 0.02)          # fondo
b.box("frame", 0, X1, -D, 0, H - 0.02, H)                    # cielo
mid = X1 / 2
for x0, x1 in ((0, mid), (mid, X1)):                         # due ante a telaio
    a0, a1 = x0 + GAP / 2, x1 - GAP / 2
    z0, z1 = PLINTH + GAP, H - GAP
    b.box("frame", a0, a0 + FR, -D - T, -D, z0, z1)
    b.box("frame", a1 - FR, a1, -D - T, -D, z0, z1)
    b.box("frame", a0 + FR, a1 - FR, -D - T, -D, z0, z0 + FR)
    b.box("frame", a0 + FR, a1 - FR, -D - T, -D, z1 - FR, z1)
    b.box("glass", a0 + FR, a1 - FR, -D - T * 0.6, -D - T * 0.4, z0 + FR, z1 - FR)
shelves = [0.50, 0.90, 1.30, 1.70, 2.08]
for i, z in enumerate(shelves):
    b.box("glass", 0.02, X1 - 0.02, -D + 0.03, -0.02, z, z + 0.008)
    b.box("led", 0.03, X1 - 0.03, -0.035, -0.022, z - 0.012, z - 0.004)   # striscia sotto il ripiano
b.box("led", 0.03, X1 - 0.03, -0.035, -0.022, H - 0.035, H - 0.027)
# stoviglie: pile di piatti in basso, bicchieri sopra
for x in (0.26, 0.78):
    for k in range(7):
        b.cyl("ceramic", x, -0.30, PLINTH + 0.02 + k * 0.012, PLINTH + 0.03 + k * 0.012, 0.125, 24)
    for k in range(5):
        b.cyl("ceramic", x, -0.30, shelves[0] + 0.008 + k * 0.012, shelves[0] + 0.018 + k * 0.012, 0.105, 24)
for z in shelves[1:4]:
    for x in (0.16, 0.30, 0.44, 0.66, 0.80, 0.94):
        b.cyl("glass", x, -0.28, z + 0.008, z + 0.13, 0.032, 12, r_top=0.038)

# ---- 2. blocco centrale (X1 → X2) ------------------------------------------
# basi
carcass(X1, X2, PLINTH, Z_TOP0, D)
b.box("interior", X1, X2, -D - 0.004, -D, Z_BASE, Z_TOP0)    # gola
xa, xb = X1 + 0.85, X1 + 1.73                                # cassetti | forno | anta
zm = (PLINTH + Z_BASE) / 2
front("wood", X1, xa, PLINTH + 0.005, zm, D)
front("wood", X1, xa, zm, Z_BASE, D)
front("wood", xa, xb, PLINTH + 0.005, 0.235, D)              # cassetto sotto il forno
front("wood", xb, X2, PLINTH + 0.005, Z_BASE, D)
# forno
b.box("appliance", xa + 0.01, xb - 0.01, -D - T, -D, 0.24, Z_BASE - 0.005, bevel=0.003)
b.box("glass", xa + 0.06, xb - 0.06, -D - T - 0.002, -D - T, 0.30, 0.62)
b.box("metal", xa + 0.08, xb - 0.08, -D - T - 0.03, -D - T - 0.018, 0.655, 0.667)   # maniglia
for x in (xa + 0.10, xb - 0.11):
    b.box("metal", x, x + 0.01, -D - T - 0.02, -D - T, 0.655, 0.667)
# piano di lavoro e schienale
b.box("worktop", X1, X2, -D - 0.02, 0, Z_TOP0, Z_TOP1, bevel=0.002)
b.box("worktop", X1, X2, -0.02, 0, Z_TOP1, Z_UP0)
b.box("appliance", X1 + 0.15, X1 + 0.75, -0.52, -0.10, Z_TOP1, Z_TOP1 + 0.004)      # piano cottura
# barra portaoggetti con due mensole
zr = 1.22
b.box("metal", X1 + 0.12, X1 + 1.80, -0.035, -0.02, zr, zr + 0.015)
for x0, x1 in ((X1 + 0.14, X1 + 0.55), (X1 + 0.95, X1 + 1.75)):
    b.box("frame", x0, x1, -0.14, -0.02, zr - 0.02, zr - 0.008)
for x in (X1 + 1.05, X1 + 1.20, X1 + 1.35, X1 + 1.55, X1 + 1.67):
    b.cyl("ceramic", x, -0.08, zr - 0.008, zr + 0.07, 0.03, 12)
# macchina del caffè
b.box("appliance", X2 - 0.42, X2 - 0.24, -0.38, -0.08, Z_TOP1, Z_TOP1 + 0.34, bevel=0.006)
b.cyl("metal", X2 - 0.33, -0.36, Z_TOP1 + 0.10, Z_TOP1 + 0.20, 0.03, 12)
# luce sotto i pensili
b.box("led", X1 + 0.03, X2 - 0.03, -D_UP + 0.03, -D_UP + 0.045, Z_UP0 - 0.008, Z_UP0 - 0.001)
# pensili: tre ante
carcass(X1, X2, Z_UP0, Z_UP1, D_UP)
ux = [X1, X1 + 0.95, X1 + 1.69, X2]
for x0, x1 in zip(ux, ux[1:]):
    front("cabinet", x0, x1, Z_UP0, Z_UP1, D_UP)
# nicchie alte illuminate: cinque vani
b.box("niche", X1, X2, -0.02, 0, Z_UP1, Z_NICHE1)            # schiena
b.box("cabinet", X1, X2, -D_UP - T, 0, Z_NICHE1, H)          # fascia superiore
b.box("cabinet", X1, X2, -D_UP - T, 0, Z_UP1, Z_UP1 + 0.02)  # base delle nicchie
n = 5
step = W_CENTER / n
for i in range(n + 1):
    x = X1 + i * step
    b.box("cabinet", max(X1, x - 0.01), min(X2, x + 0.01), -D_UP - T, 0, Z_UP1, Z_NICHE1)
for i in range(n):
    xc = X1 + (i + 0.5) * step
    b.box("led", xc - step / 2 + 0.03, xc + step / 2 - 0.03, -D_UP + 0.02, -D_UP + 0.035,
          Z_NICHE1 - 0.012, Z_NICHE1 - 0.004)
    if i % 2 == 0:                                           # vaso
        b.cyl("ceramic", xc, -0.18, Z_UP1 + 0.02, Z_UP1 + 0.16, 0.05, 16, r_top=0.035)
    else:                                                    # bottiglia
        b.cyl("glass", xc, -0.18, Z_UP1 + 0.02, Z_UP1 + 0.20, 0.035, 12)
        b.cyl("glass", xc, -0.18, Z_UP1 + 0.20, Z_UP1 + 0.27, 0.012, 12)

# ---- 3. colonne alte (X2 → X3) ----------------------------------------------
carcass(X2, X3, PLINTH, H, D)
b.box("interior", X2, X3, -D - 0.004, -D, 0.78, 0.82)        # gola orizzontale
xm = (X2 + X3) / 2
for x0, x1 in ((X2, xm), (xm, X3)):
    front("cabinet", x0, x1, PLINTH + 0.005, 0.78, D)
    front("cabinet", x0, x1, 0.82, H, D)
b.box("cabinet", X3, X3 + 0.02, -D - T, 0, PLINTH, H)        # fianco a vista

b.finish()
b.preview("creo-kitchen-front", (X3 / 2, -6.2, 1.25), (X3 / 2, 0, 1.2), lens=38)
b.preview("creo-kitchen-angle", (-1.6, -4.6, 1.7), (X3 / 2 - 0.2, 0, 1.15), lens=32)
b.export("creo-kitchen")
