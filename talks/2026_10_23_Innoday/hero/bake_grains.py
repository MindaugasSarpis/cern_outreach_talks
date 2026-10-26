"""LHCb's real geometry as grains (copied from MasterTalk, talk/mastertalk ee3e2b8, as it was: its
station 4, setup/route.js; here Innoday's close, setup/detector.js, `detector`).

  blender -b --factory-startup --python hero/bake_grains.py -- LHCb_light-draco.glb public/data/lhcb-grains.bin [k] [edges shape.bin] [human.blend]

k multiplies every part's budget (Innoday, 20 Oct: 4.8, about 450 000 grains, so the
surfaces read solid: owner, "Point cloud can somehow be more solid"; MasterTalk's is 1).
With `edges` and a shape path (Innoday, 20 Oct, "a sharper, more solid form": 3.8 0.3),
each part also gets `edges` × its budget of grains along its feature edges (two faces
meeting at more than 30 degrees, or a rim), and the shape file gets 4 bytes a grain in
the .bin's order: the grain's face normal in LHCb's frame (x, y, z: round(127 n) + 128)
and 255 for an edge grain, 0 for a face grain (setup/detector.js `shape`). Blender 4.5
LTS and the .glb live outside git (~/.cache/outreach_talks/; Phoenix's LHCb.glb.zip).
With a sixth path (Blender's Human Base Meshes bundle v1.4.1, CC0), a person for scale
follows the parts as part 10, `person` (owner, 21 Oct: "let's get back to point cloud";
the hologram person of hero/export_mesh.py, same body and place, as grains: PERSON_GRAINS
over its surface and `edges` × that along its folds).

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

PERSON_GRAINS = 9000
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
        n = (b - a).cross(c - a)
        out.append((a, b, c, n.length / 2, n.normalized()))
    return out


def edge_samples(o, angle=30.0):
    """The mesh's feature edges in world space: (a, b, length, normal), the normal the
    mean of the faces that meet there."""
    import math
    me = o.data
    M = o.matrix_world
    R = M.to_3x3()
    v = [M @ x.co for x in me.vertices]
    faces = {}
    for f in me.polygons:
        n = (R @ f.normal).normalized()
        for k in f.edge_keys:
            faces.setdefault(k, []).append(n)
    cos = math.cos(math.radians(angle))
    out = []
    for (i, j), ns in faces.items():
        if len(ns) == 2 and ns[0].dot(ns[1]) > cos:
            continue
        a, b = v[i], v[j]
        L = (b - a).length
        if L <= 0:
            continue
        n = ns[0] + ns[1] if len(ns) == 2 else ns[0]
        out.append((a, b, L, n.normalized() if n.length > 1e-9 else ns[0]))
    return out


def main():
    args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[-2:]
    glb, dst = args[0], args[1]
    k = float(args[2]) if len(args) > 2 else 1.0
    ek = float(args[3]) if len(args) > 3 else 0.0
    shape_dst = args[4] if len(args) > 4 else None
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=glb)
    rnd = random.Random(7)
    tris = [[] for _ in PARTS]
    edges = [[] for _ in PARTS]
    for o in bpy.data.objects:
        if o.type != 'MESH':
            continue
        p = part_of(o)
        if p is not None:
            tris[p] += tri_samples(o, None)
            if ek > 0:
                edges[p] += edge_samples(o)
    recs = bytearray()
    shape = bytearray()

    def nbytes(n, e):
        # Blender -> LHCb as the points: (x, z, -y)
        return bytes(max(1, min(255, round(c * 127) + 128)) for c in (n.x, n.z, -n.y)) + bytes((e,))
    for i, (name, _, n) in enumerate(PARTS):
        n = round(n * k)
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
            a, b, c, _ar, nrm = T[min(bisect.bisect_left(cum, rnd.random() * s), len(T) - 1)]
            u, w = rnd.random(), rnd.random()
            if u + w > 1:
                u, w = 1 - u, 1 - w
            q = a + (b - a) * u + (c - a) * w
            # Blender (glTF import, mm) -> LHCb: x = X, y = Z, z = -Y
            recs += struct.pack('<4h', round(q.x), round(q.z), round(-q.y), i)
            shape += nbytes(nrm, 0)
        print(name, len(T), 'triangles', n, 'grains')
        E = edges[i]
        ne = round(n * ek) if E else 0
        if ne:
            ecum, es = [], 0.0
            for e in E:
                es += e[2]
                ecum.append(es)
            for _ in range(ne):
                a, b, _L, nrm = E[min(bisect.bisect_left(ecum, rnd.random() * es), len(E) - 1)]
                q = a + (b - a) * rnd.random()
                recs += struct.pack('<4h', round(q.x), round(q.z), round(-q.y), i)
                shape += nbytes(nrm, 255)
            print(name, len(E), 'feature edges', ne, 'edge grains')
    if len(args) > 5:
        recs, shape = person_grains(args[5], rnd, ek, recs, shape, nbytes)
    open(dst, 'wb').write(recs)
    print('wrote', dst, len(recs), 'bytes')
    if shape_dst:
        open(shape_dst, 'wb').write(shape)
        print('wrote', shape_dst, len(shape), 'bytes')


def person_grains(blend, rnd, ek, recs, shape, nbytes):
    """The person (hero/export_mesh.py's PERSON, the same transform) as part 10."""
    import bisect
    import math
    from mathutils import Matrix, Vector
    P = {'object': 'GEO-body_male_realistic', 'height': 1830.0, 'feet': (6600.0, -5600.0, 16500.0)}
    with bpy.data.libraries.load(blend) as (src, dst):
        dst.objects = [P['object']]
    o = dst.objects[0]
    me = o.data.copy()
    me.transform(o.matrix_world)
    zs = [v.co.z for v in me.vertices]
    xs, ys = [v.co.x for v in me.vertices], [v.co.y for v in me.vertices]
    h = max(zs) - min(zs)
    c = Vector(((max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2, min(zs)))
    f = P['feet']
    me.transform(Matrix.Translation(Vector((f[0], -f[2], f[1]))) @ Matrix.Rotation(math.radians(90), 4, 'Z')
                 @ Matrix.Scale(P['height'] / h, 4) @ Matrix.Translation(-c))
    ob = bpy.data.objects.new('person', me)
    bpy.context.scene.collection.objects.link(ob)
    T = tri_samples(ob, None)
    cum, s = [], 0.0
    for t in T:
        s += t[3]
        cum.append(s)
    for _ in range(PERSON_GRAINS):
        a, b, c3, _ar, nrm = T[min(bisect.bisect_left(cum, rnd.random() * s), len(T) - 1)]
        u, w = rnd.random(), rnd.random()
        if u + w > 1:
            u, w = 1 - u, 1 - w
        q = a + (b - a) * u + (c3 - a) * w
        recs += struct.pack('<4h', round(q.x), round(q.z), round(-q.y), 10)
        shape += nbytes(nrm, 0)
    E = edge_samples(ob, angle=40.0)
    ne = round(PERSON_GRAINS * ek) if E else 0
    if ne:
        ecum, es = [], 0.0
        for e in E:
            es += e[2]
            ecum.append(es)
        for _ in range(ne):
            a, b, _L, nrm = E[min(bisect.bisect_left(ecum, rnd.random() * es), len(E) - 1)]
            q = a + (b - a) * rnd.random()
            recs += struct.pack('<4h', round(q.x), round(q.z), round(-q.y), 10)
            shape += nbytes(nrm, 255)
    print('person', len(T), 'triangles,', round(h, 3), 'high:', PERSON_GRAINS, '+', ne, 'grains')
    return recs, shape


if __name__ == '__main__':
    main()
