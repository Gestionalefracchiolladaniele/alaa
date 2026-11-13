"""Padiglione del Kyrenia Waterfront Art Centre (portfolio p14).

Ricostruzione dalla vista principale, dall'assonometria esplosa e dai prospetti
della tavola: è uno studio 3D in stile plastico, non il progetto esecutivo.
La scala è stimata (lunghezza 24 m).

Forma: un guscio allungato che tocca terra a entrambe le estremità, con il
colmo spostato verso un lato. Ogni sezione trasversale è mezza ellisse; l'asse
in pianta è leggermente curvo (pianta a fagiolo).
L'apertura è SUL FIANCO lungo e ne occupa solo una parte: un taglio ad arco nel
guscio, con la vetrata arretrata all'interno, come nella vista principale.

Strati, dall'esterno all'interno (nomi dell'assonometria di p14):
  layer-skin       Timber Slat Skin
  layer-membrane   Waterproof Membrane
  (Air Cavity: è lo spazio tra membrana e doghe, non ha geometria)
  layer-ribs       Curved Ribs (+ trave di bordo dell'apertura)
  layer-glazing    vetrata (+ layer-glazing-frame)
  layer-base       Base / Plinth
"""
import math
import os
import sys

import bmesh
import bpy
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import Builder  # noqa: E402

L = 24.0                 # lunghezza
H_MAX = 6.5              # altezza al colmo
W_MAX = 5.0              # semi-larghezza massima
PEAK = 0.50              # posizione del colmo lungo la lunghezza (0..1): al centro
BEND = 1.5               # curvatura dell'asse in pianta
OPEN_T = (0.54, 0.94)    # tratto di fianco occupato dall'apertura
OPEN_ANGLE = math.radians(50)   # quanto sale l'apertura sul fianco, al centro
T0 = 0.08               # il guscio parte tronco: piccola apertura ad arco in testa, sul lato corto
RIB_DEPTH = 0.26
MEMBRANE_OFF = 0.30
SKIN_OFF = (0.42, 0.47)
GLASS_SETBACK = 0.9      # arretramento della vetrata rispetto al bordo


def section(t):
    """Centro, semi-larghezza e altezza della sezione al parametro t (0..1)."""
    t = min(1.0, max(0.0, t))
    if t < PEAK:      # testa: sale piano, bassa e schiacciata verso terra
        s = math.sin(math.pi / 2 * t / PEAK)
        ew, eh = s ** 0.75, s ** 1.0
    else:             # coda: scende più ripida, dove sta la grande apertura
        s = max(0.0, math.cos(math.pi / 2 * (t - PEAK) / (1 - PEAK)))
        ew, eh = s ** 0.6, s ** 0.6
    return L * t, BEND * math.sin(math.pi * t), W_MAX * ew, H_MAX * eh


def opening(t):
    """Ampiezza angolare dell'apertura alla sezione t (0 fuori dalle aperture)."""
    for (t0, t1), angle in ((OPEN_T, OPEN_ANGLE),):
        if t0 < t < t1:
            u = (t - (t0 + t1) / 2) / ((t1 - t0) / 2)
            return angle * math.sqrt(1 - u * u)
    return 0.0


def pt(t, th, d=0.0, dx=0.0):
    """Punto sull'arco della sezione t all'angolo th, spostato di d lungo la normale.
    th = 0 è il piede del FRONTE (verso -y, dove sta l'apertura), th = pi il piede del retro."""
    x, yc, a, h = section(t)
    ny, nz = h * math.cos(th), a * math.sin(th)
    n = math.hypot(ny, nz) or 1.0
    return Vector((x + dx, yc - (a * math.cos(th) + d * ny / n), h * math.sin(th) + d * nz / n))


def linspace(a, b, n):
    return [a + (b - a) * i / (n - 1) for i in range(n)]


b = Builder()
b.material("slats", "#c98a4b", rough=0.55)
b.material("membrane", "#f4efe6", rough=0.8)
b.material("glulam", "#e2c08c", rough=0.5)
b.material("stone", "#cdbfa8", rough=0.85)
b.material("glass", "#9fc4cf", rough=0.05, alpha=0.30)
b.material("frame", "#3a2c22", rough=0.5)

# L'apertura toglie al guscio gli angoli da 0 a opening(t).


def tube(part, rings):
    bm = b.raw(part)
    vr = [[bm.verts.new(p) for p in ring] for ring in rings]
    for r0, r1 in zip(vr, vr[1:]):
        for k in range(len(r0)):
            bm.faces.new((r0[k], r0[(k + 1) % len(r0)], r1[(k + 1) % len(r0)], r1[k]))
    bm.faces.new(vr[0])
    bm.faces.new(vr[-1][::-1])


def arc(part, t, width_x, d0, d1, seg=22):
    """Un arco a sezione rettangolare (nervatura o doga), interrotto dall'apertura."""
    start = opening(t)
    rings = []
    for i in range(seg + 1):
        th = start + (math.pi - start) * i / seg
        rings.append([pt(t, th, d, dx) for d, dx in
                      ((d0, -width_x / 2), (d0, width_x / 2), (d1, width_x / 2), (d1, -width_x / 2))])
    tube(part, rings)


# ---- nervature curve, arcarecci, trave di bordo -----------------------------
RIBS = "layer-ribs:glulam"
for t in linspace(T0, 0.95, 16):
    arc(RIBS, t, 0.14, -RIB_DEPTH, 0.0)
stations = linspace(T0, 0.95, 31)
for deg in (30, 60, 90, 120, 150):
    th = math.radians(deg)
    run = []
    for t in stations + [None]:
        if t is not None and th > opening(t) + 0.06:
            _, _, a, h = section(t)
            dl = 0.05 / max(a, h, 0.5)
            run.append([pt(t, th + s * dl, d) for s, d in ((-1, 0.0), (1, 0.0), (1, 0.10), (-1, 0.10))])
        else:
            if len(run) > 1:
                tube(RIBS, run)
            run = []
# trave di bordo lungo il taglio dell'apertura
for (o0, o1), n_lip in ((OPEN_T, 40),):
    lip = []
    for t in linspace(o0 + 0.004, o1 - 0.004, n_lip):
        th = opening(t)
        lip.append([pt(t, th, d, dx) for d, dx in
                    ((-RIB_DEPTH, -0.09), (-RIB_DEPTH, 0.09), (SKIN_OFF[1], 0.09), (SKIN_OFF[1], -0.09))])
    tube(RIBS, lip)

# ---- membrana impermeabile --------------------------------------------------
bm = b.raw("layer-membrane:membrane")
SEG = 26
grid = []
for t in linspace(T0, 0.988, 46):
    start = opening(t)
    grid.append([bm.verts.new(pt(t, start + (math.pi - start) * j / SEG, MEMBRANE_OFF)) for j in range(SEG + 1)])
for g0, g1 in zip(grid, grid[1:]):
    for j in range(SEG):
        bm.faces.new((g0[j], g0[j + 1], g1[j + 1], g1[j]))

# ---- rivestimento in doghe di legno -----------------------------------------
for t in linspace(T0, 0.97, 66):
    arc("layer-skin:slats", t, 0.16, SKIN_OFF[0], SKIN_OFF[1], seg=18)

# ---- vetrata arretrata nell'apertura ----------------------------------------
def glass_line(t):
    """Piede e sommità della vetrata alla sezione t: parete verticale arretrata."""
    x, yc, a, h = section(t)
    edge = pt(t, opening(t), -RIB_DEPTH)
    y = edge.y + GLASS_SETBACK
    ai, hi = a - RIB_DEPTH, h - RIB_DEPTH
    top = hi * math.sqrt(max(0.0, 1 - ((y - yc) / ai) ** 2))
    return Vector((x, y, 0.0)), Vector((x, y, top))


gts = linspace(OPEN_T[0] + 0.02, OPEN_T[1] - 0.02, 28)
bm = b.raw("layer-glazing:glass")
cols = [[bm.verts.new(p) for p in glass_line(t)] for t in gts]
for c0, c1 in zip(cols, cols[1:]):
    bm.faces.new((c0[0], c1[0], c1[1], c0[1]))
FRAME = "layer-glazing-frame:frame"
for t in gts[::3]:
    foot, top = glass_line(t)
    if top.z > 0.4:
        b.box(FRAME, foot.x - 0.04, foot.x + 0.04, foot.y - 0.04, foot.y + 0.04, 0, top.z)
rail = [[glass_line(t)[0] + Vector((0, dy, z)) for dy, z in ((-0.04, 2.45), (0.04, 2.45), (0.04, 2.55), (-0.04, 2.55))]
        for t in gts if glass_line(t)[1].z > 2.7]
if len(rail) > 1:
    tube(FRAME, rail)

# ---- base / basamento -------------------------------------------------------
M = 1.4
ts = linspace(0.0, 1.0, 40)
outline = [(-M, section(0)[1])]
outline += [(section(t)[0], section(t)[1] + section(t)[2] + M) for t in ts]
outline += [(L + M, section(1)[1])]
outline += [(section(t)[0], section(t)[1] - section(t)[2] - M * 2.2) for t in reversed(ts)]   # più ampia sul fronte
bm = b.raw("layer-base:stone")
top = [bm.verts.new((x, y, 0.0)) for x, y in outline]
bot = [bm.verts.new((x, y, -0.45)) for x, y in outline]
f_top = bm.faces.new(top)
f_bot = bm.faces.new(bot[::-1])
n = len(outline)
for i in range(n):
    j = (i + 1) % n
    bm.faces.new((top[i], bot[i], bot[j], top[j]))
bmesh.ops.triangulate(bm, faces=[f_top, f_bot])

b.finish()
b.preview("kyrenia-pavilion", (L * 0.80, -34, 7.5), (L * 0.50, 0, 2.6), lens=36)
b.preview("kyrenia-pavilion-end", (-20, -15, 5.5), (L * 0.3, 0, 2.2), lens=36)
b.export("kyrenia-pavilion")

# anteprima esplosa: solo per controllo, il file esportato resta assemblato
for name, dz in (("layer-skin", 10.0), ("layer-membrane", 5.0), ("layer-base", -2.5)):
    bpy.data.objects[name].location.z = dz
b.preview("kyrenia-pavilion-exploded", (L * 0.85, -44, 15), (L * 0.5, 0, 5.0), lens=36, size=(960, 760))
