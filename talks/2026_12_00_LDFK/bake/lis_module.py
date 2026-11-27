# Bakes public/data/lis-module.bin: the end of a SciFi module as grains, for the stage's
# `detector` builder (slide „Šviesos įvedimo sistema modulio gale“, station `lis`).
#
# The source is the module's CAD assembly as a STEP file (the owner's, 27 Nov 2026; it is not in
# this repository and is not to be added to it). FreeCAD reads it with the part names, each
# solid's surface is tessellated, and points are scattered over the triangles, more or fewer per
# mm2 by the kind of part. A point carries the group of its part in the builder's fourth field:
#
#   0 velo    fibre mats 1 and 3              4 magnet  cooling bars, thermal straps, lines
#   1 pipe    honeycomb panels, end pieces    5 scifi   the light injection block (LEDs, sockets)
#   2 rich1   the cold box                    6 rich2   fibre mats 2 and 4 (a second shade, so the
#   3 ut      flex circuits, connectors,                four mats can be told apart)
#             the electronics box             7 ecal    the light injection fibres across the mats
#
# (the names are the builder's part slots, `parts` in space.json sets their colours). Screws and
# washers are left out. The mats and panels run 2,2 m from the box: only the last metre is kept,
# thinning out over its far half. The file is little-endian Int16 [x, y, z, group] in mm, in the
# builder's frame (z along the module, 0 at the plane of the light sensors; y across it; x through
# its thickness), shuffled.
#
#   STEP_IN=/path/to/module.stp /Applications/FreeCAD.app/Contents/Resources/bin/freecadcmd bake/lis_module.py
#
# from the talk's directory; about a minute, 1,2 MB (the seed is fixed, so a re-run gives the same
# file from the same STEP).
import os, re, random, struct
import FreeCAD, Import

SRC = os.environ['STEP_IN']
OUT = os.environ.get('BIN_OUT', 'public/data/lis-module.bin')

# first match wins, on 'part/parent': [pattern, points per mm2, group]
RULES = [
    (r'PROLONGEMENT FIBRE INJ', 3.0, 7),
    (r'INJ|LED_|DOUILLE|^FIls', 0.6, 5),
    (r'^COMPOUND(002)?(/|$)', 0.03, 0),
    (r'^COMPOUND00[13](/|$)', 0.03, 6),
    (r'MODULE FIBRE_009', 0.002, 1),
    (r'MODULE FIBRE', 0.02, 1),
    (r'ProtColdBox|CryoBox|Indium|VAT_|Espaceur|Glue|MOULE', 0.05, 2),
    (r'ElectronicBox', 0.03, 3),
    (r'flex|Extender|^EP_|CERAMIC|SIPM|Connect|Flex', 0.05, 3),
    (r'Cooling|Thermal|Copper|TUBE|Swagelok|Raccord|Jonction|RESSORT', 0.06, 4),
    (r'BARRETTE', 0.03, 1),
]
Z0, Y0 = 150.0, -55.0        # the sensor plane and the module's middle, in the CAD's mm
CUT, FADE = -1000.0, 500.0   # keep z > CUT; thin out over the first FADE mm


def labels(o):
    """The object's label, then its parents'."""
    out, p = [o.Label], o
    while True:
        up = [q for q in p.InList if q.isDerivedFrom('App::Part') or q.isDerivedFrom('App::DocumentObjectGroup')
              or q.isDerivedFrom('App::Link')]
        if not up:
            return out
        p = up[0]
        out.append(p.Label)


def rule(two):
    for pat, dens, group in RULES:
        if re.search(pat, two, re.I):
            return dens, group
    return 0.0, 9


doc = FreeCAD.newDocument('m')
Import.insert(SRC, 'm')
doc.recompute()
random.seed(7)
rows = []
for o in doc.Objects:
    if not o.isDerivedFrom('Part::Feature') or o.Shape.isNull() or not o.Shape.Faces:
        continue
    dens, group = rule('/'.join(labels(o)[:2]))
    if dens <= 0:
        continue
    verts, tris = o.Shape.tessellate(1.5)
    m = o.getGlobalPlacement().multiply(o.Placement.inverse())   # the shape already carries o.Placement
    V = [m.multVec(v) for v in verts]
    for a, b, c in tris:
        A, B, C = V[a], V[b], V[c]
        n = (B - A).cross(C - A).Length * 0.5 * dens
        for _ in range(int(n) + (1 if random.random() < n - int(n) else 0)):
            u, v = random.random(), random.random()
            if u + v > 1:
                u, v = 1 - u, 1 - v
            P = A + (B - A) * u + (C - A) * v
            if random.random() < min(1.0, max(0.0, (P.z - CUT) / FADE)):
                rows.append((round(P.x), round(P.y - Y0), round(P.z - Z0), group))
random.shuffle(rows)
with open(OUT, 'wb') as f:
    for r in rows:
        f.write(struct.pack('<4h', *r))
print(len(rows), 'grains ->', OUT)
