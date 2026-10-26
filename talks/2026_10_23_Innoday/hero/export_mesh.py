"""LHCb's geometry as a light mesh for the close (setup/detector.js `mesh`): one .glb, each
sub-detector one decimated object named after its part, no Draco (the deck loads it with
three's GLTFLoader alone).

  blender -b --factory-startup --python hero/export_mesh.py -- LHCb_light-draco.glb public/data/lhcb-mesh.glb \
      [human_base_meshes_bundle.blend]

With the third path, a person for scale is added as the object `person` (owner, 20 Oct:
"It can be me, 183cm in height"; the flat cut-out in grains looked "weird" beside the
model): Blender's Human Base Meshes bundle v1.4.1 (CC0, blender.org/download/demo-files),
`GEO-body_male_realistic`, scaled to 1,83 m, turned to face the close's camera (LHCb's +x)
and standing on the floor at the muon wall's near foot, LHCb (6.6, -5.6, 16.5) m, where
the grain figure stood.

Owner, 20 Oct: "Doesn't have to be point cloud if that looks better". The parts and their
objects are hero/bake_grains.py's (the beam pipe left out: it is not drawn); RATIO keeps
each part's triangles to a few tens of thousands. Same source and licence as the grains
(LHCb's DD4hep geometry, GPL-3.0, (c) CERN for the benefit of the LHCb Collaboration,
through HSF Phoenix's glTF, Apache-2.0; public/data/lhcb-grains.NOTICE.txt). Blender 4.5
LTS and the source .glb live outside git (~/.cache/outreach_talks/).
"""
import sys

import bpy

sys.path.insert(0, __file__.rsplit('/', 1)[0])
from bake_grains import PARTS, part_of  # noqa: E402  (bake_grains runs main() only as a script)

PERSON = {'object': 'GEO-body_male_realistic', 'height': 1830.0, 'feet': (6600.0, -5600.0, 16500.0)}   # mm, LHCb's frame
RATIO = {'velo': 0.08, 'rich1': 0.3, 'scifi': 0.35, 'muon': 0.35}


def person(blend, coll):
    import math
    from mathutils import Matrix, Vector
    with bpy.data.libraries.load(blend) as (src, dst):
        dst.objects = [PERSON['object']]
    o = dst.objects[0]
    coll.objects.link(o)
    me = o.data.copy()   # the base mesh as authored: its subdivision left off (677 000 faces with it)
    me.transform(o.matrix_world)
    zs = [v.co.z for v in me.vertices]
    h = max(zs) - min(zs)
    xs, ys = [v.co.x for v in me.vertices], [v.co.y for v in me.vertices]
    c = Vector(((max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2, min(zs)))
    f = PERSON['feet']
    # LHCb (x, y, z) is Blender (X, -Z, Y)… i.e. x = X, y = Z, z = -Y; turned to face +X (the camera)
    M = (Matrix.Translation(Vector((f[0], -f[2], f[1]))) @ Matrix.Rotation(math.radians(90), 4, 'Z')
         @ Matrix.Scale(PERSON['height'] / h, 4) @ Matrix.Translation(-c))
    me.transform(M)
    p = bpy.data.objects.new('person', me)
    coll.objects.link(p)
    print('person', len(me.polygons), 'faces, from', round(h, 3), 'high')
    return p


def main():
    import bmesh
    args = sys.argv[sys.argv.index('--') + 1:]
    glb, dst = args[0], args[1]
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=glb)
    groups = {}
    for o in list(bpy.data.objects):
        if o.type != 'MESH':
            continue
        p = part_of(o)
        if p is None or PARTS[p][0] == 'pipe':
            continue
        groups.setdefault(PARTS[p][0], []).append(o)
    out = bpy.data.collections.new('lhcb')
    bpy.context.scene.collection.children.link(out)
    keep = []
    for name, objs in groups.items():
        # the part's meshes joined in world space, without the operators (some of the
        # imported objects are in no view layer)
        bm = bmesh.new()
        for o in objs:
            me = o.data.copy()
            me.transform(o.matrix_world)
            bm.from_mesh(me)
            bpy.data.meshes.remove(me)
        me = bpy.data.meshes.new(name)
        bm.to_mesh(me)
        bm.free()
        j = bpy.data.objects.new(name, me)
        out.objects.link(j)
        if name in RATIO:
            m = j.modifiers.new('decimate', 'DECIMATE')
            m.ratio = RATIO[name]
            dg = bpy.context.evaluated_depsgraph_get()
            dec = bpy.data.meshes.new_from_object(j.evaluated_get(dg))
            j.modifiers.remove(m)
            j.data = dec
        keep.append(j)
        print(name, len(j.data.polygons), 'faces')
    if len(args) > 2:
        keep.append(person(args[2], out))
    for o in list(bpy.data.objects):
        if o not in keep:
            bpy.data.objects.remove(o, do_unlink=True)
    bpy.ops.export_scene.gltf(filepath=dst, export_format='GLB', export_draco_mesh_compression_enable=False,
                              export_normals=True, export_materials='NONE', export_texcoords=False, use_selection=False)
    print('wrote', dst)

main()
