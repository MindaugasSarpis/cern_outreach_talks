"""LHCb's real geometry as grains (copied from MasterTalk, talk/mastertalk ee3e2b8, as it was: its
station 4, setup/route.js; here Innoday's close, setup/detector.js, `detector`).

  blender -b --factory-startup --python hero/bake_grains.py -- LHCb_light-draco.glb public/data/lhcb-grains.bin

Samples points over the surfaces of each sub-detector of HSF Phoenix's LHCb.glb
(LHCb's DD4hep geometry, GPL-3.0, (c) CERN for the benefit of the LHCb
Collaboration; Phoenix Apache-2.0), a fixed budget each, spread by area.
Output: little-endian Int16 records [x, y, z, part] in mm, LHCb's frame (z along
the beam, y up); part indexes PARTS below. Seeded: the same file each run.
"""
import random
import struct
import sys

import bpy

# part: (name, the exact names of its ancestors in the .glb, grains)
PARTS = [
    ('velo', ('lvVP_2.002', 'lvVP_2.006', 'lvVP_2.005', 'lvVP_2.009'), 14000),
    ('pipe', ('lvVP_2', 'lvUX85InMagnet_1', 'lvUX85Downstream_5', 'lvUX85BakeoutAfterMagnet_2', 'lvT_0'), 4000),
    ('rich1', ('lvRich1Master_1.003', 'lvRich1Master_1.004', 'lvRich1Master_1.005', 'lvRich1Master_1.002'), 6000),
    ('ut', ('lvUT_3.001', 'lvUT_3.002', 'lvUT_3.003', 'lvUT_3.004'), 6000),
    ('magnet', ('MagnetEnvelope_0.001',), 12000),
    ('scifi', ('lvT_0.002', 'lvT_0.003', 'lvT_0.004', 'lvT_0.005', 'lvT_0.007', 'lvT_0.008', 'lvT_0.009', 'lvT_0.010',
               'lvT_0.012', 'lvT_0.013', 'lvT_0.014', 'lvT_0.015'), 15000),
    ('rich2', ('lvRich2Master_1.001', 'lvRich2Master_1.004', 'lvRich2Master_1.005'), 6000),
    ('ecal', ('lvEcal_3.004', 'lvEcal_3.003', 'lvEcal_3.002', 'lvEcal_3.001'), 7000),
    ('hcal', ('lvHcal_4.001', 'lvHcal_4.002', 'lvHcal_4.003', 'lvHcal_4.004'), 7000),
    ('muon', ('lvMuon_2.001', 'lvMuon_2.003', 'lvMuon_2.005', 'lvMuon_2.007'), 16000),
]


def part_of(o):
    a = o
    while a is not None:
        for i, (_, pre, _n) in enumerate(PARTS):
            if a.name in pre:
                return i
        a = a.parent
    return None


def tri_samples(o, mats):
    me = o.data
    me.calc_loop_triangles()
    M = o.matrix_world
    v = [M @ x.co for x in me.vertices]
    out = []
    for t in me.loop_triangles:
        a, b, c = (v[i] for i in t.vertices)
        out.append((a, b, c, (b - a).cross(c - a).length / 2))
    return out


def main():
    glb, dst = sys.argv[-2], sys.argv[-1]
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=glb)
    rnd = random.Random(7)
    tris = [[] for _ in PARTS]
    for o in bpy.data.objects:
        if o.type != 'MESH':
            continue
        p = part_of(o)
        if p is not None:
            tris[p] += tri_samples(o, None)
    recs = bytearray()
    for i, (name, _, n) in enumerate(PARTS):
        T = tris[i]
        total = sum(t[3] for t in T)
        if not T or total <= 0:
            print('empty part', name)
            continue
        # cumulative areas, then n draws by area
        cum, s = [], 0.0
        for t in T:
            s += t[3]
            cum.append(s)
        import bisect
        for _ in range(n):
            a, b, c, _ar = T[min(bisect.bisect_left(cum, rnd.random() * s), len(T) - 1)]
            u, w = rnd.random(), rnd.random()
            if u + w > 1:
                u, w = 1 - u, 1 - w
            q = a + (b - a) * u + (c - a) * w
            # Blender (glTF import, mm) -> LHCb: x = X, y = Z, z = -Y
            recs += struct.pack('<4h', round(q.x), round(q.z), round(-q.y), i)
        print(name, len(T), 'triangles', n, 'grains')
    open(dst, 'wb').write(recs)
    print('wrote', dst, len(recs), 'bytes')


main()
