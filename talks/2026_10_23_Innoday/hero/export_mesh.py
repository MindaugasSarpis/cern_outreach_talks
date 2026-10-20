"""LHCb's geometry as a light mesh for the close (setup/detector.js `mesh`): one .glb, each
sub-detector one decimated object named after its part, no Draco (the deck loads it with
three's GLTFLoader alone).

  blender -b --factory-startup --python hero/export_mesh.py -- LHCb_light-draco.glb public/data/lhcb-mesh.glb

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

RATIO = {'velo': 0.08, 'rich1': 0.3, 'scifi': 0.35, 'muon': 0.35}


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
    for o in list(bpy.data.objects):
        if o not in keep:
            bpy.data.objects.remove(o, do_unlink=True)
    bpy.ops.export_scene.gltf(filepath=dst, export_format='GLB', export_draco_mesh_compression_enable=False,
                              export_normals=True, export_materials='NONE', export_texcoords=False, use_selection=False)
    print('wrote', dst)

main()
