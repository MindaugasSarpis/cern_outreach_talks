"""The hero shots' scene: LHCb's real Run 3 geometry and this talk's own collision.

Run inside Blender (4.5 LTS), headless:

  blender -b --factory-startup --python hero/build_scene.py -- \
      --glb LHCb_light-draco.glb --event setup/data/event-lb.json \
      --shot crossing --t 9 --out still.png [--samples 128] [--res 1920x1080] [--save scene.blend]

Geometry: HSF Phoenix's LHCb.glb, built from LHCb's DD4hep description
(gitlab.cern.ch/lhcb/Detector, GPL-3.0, (c) CERN for the benefit of the LHCb
Collaboration; Phoenix Apache-2.0). Units mm; the importer puts LHCb's z (the
beam) on Blender's -Y and LHCb's y (up) on +Z, so a point (x, y, z) in mm is
Blender (x, -z, y) / 1000 once the import is scaled to metres.

The tracks are the event's own (CERN Open Data record 28040, CC0): each track
through its stored states, cubic between them (x and y with their slopes, so
the magnet's bend is the measured one), straight past the last. A track
reaches a point at its light time: at --t ns every track is drawn up to the
distance light has covered since the crossing.
"""
import argparse
import json
import math
import sys

import bpy
from mathutils import Vector

C_MM_PER_NS = 299.792458

# what each shot hides (envelopes and tanks that would wall the camera in) and where it stands
SHOTS = {
    # station 3: the crossing, the VELO's two halves round the beam, the tracks leaving through them
    'crossing': {
        # the near (right, x < 0) half cut away: the camera looks across the beam at the far half's modules
        # (RICH1's mirrors and the UT box behind it would only catch light as grey walls)
        'cam': (-330.0, 300.0, -260.0), 'look': (40.0, -25.0, 250.0), 'lens': 35, 'focus': (0.67, 0.11, 26.9),
        'fstop': 2.0, 'clip': (0.005, 60.0), 'haze': 0.008, 'fill': 1.0, 'fill_at': (260.0, 380.0, 750.0),
        'glow': 0.5, 'hide_cols': ('VP > Right', 'VP > Tank', 'Rich1', 'UT > Box'),
    },
    # the whole spectrometer from the side, the tracks reaching M5
    'side': {
        'cam': (-15500.0, 3200.0, 7600.0), 'look': (0.0, 0.0, 8800.0), 'lens': 35, 'focus': (0.0, 0.0, 8000.0),
        'fstop': 11.0, 'clip': (0.1, 200.0), 'haze': 0.004, 'fill': 4e5, 'glow': 60.0,
    },
}
# lvVP_2.001 the VELO's vacuum tank; lvVP_2.003 / .007 the two RF boxes (foil) that would hide the modules
HIDE = ('MagnetEnvelope', 'lvVP_2.001', 'lvVP_2.003', 'lvVP_2.007', 'lvNeutronShielding', 'lvRich1Master_1.001', 'lvRich2Master_1.003',
        'lvUX85SupportsInMagnet', 'lvUX85SupportsDownstream')

TONE = (0.612, 0.769, 1.0)      # #9cc4ff, the deck's light blue
MUON = (0.81, 0.886, 1.0)       # #cfe2ff
HOT = (1.0, 1.0, 1.0)           # the candidate's four tracks
# what the emitters are fed: AgX desaturates bright light towards white, so a deeper blue in
# reads as the deck's #9cc4ff / #cfe2ff out
TONE_IN = (0.30, 0.55, 1.0)
MUON_IN = (0.45, 0.66, 1.0)


def args():
    a = argparse.ArgumentParser()
    a.add_argument('--glb', required=True)
    a.add_argument('--event', required=True)
    a.add_argument('--shot', default='crossing', choices=sorted(SHOTS))
    a.add_argument('--t', type=float, default=9.0, help='ns since the crossing')
    a.add_argument('--out')
    a.add_argument('--samples', type=int, default=128)
    a.add_argument('--res', default='1920x1080')
    a.add_argument('--save')
    return a.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])


def bl(p):
    """LHCb mm -> Blender m."""
    x, y, z = p
    return Vector((x / 1000.0, -z / 1000.0, y / 1000.0))


def track_points(t):
    """[(x, y, z) mm, ...] along one track (the format's description is in the event JSON)."""
    typ, q, p, n = t[0], t[1], t[2], t[3]
    states = [tuple(t[4:9])]                                  # x0, y0, z0, tx0, ty0
    for k in range(n - 1):
        z, x, y, tx, ty = t[9 + 5 * k: 14 + 5 * k]
        states.append((x, y, z, tx, ty))
    muon, backward = t[9 + 5 * (n - 1)], t[10 + 5 * (n - 1)]
    states.sort(key=lambda s: s[2])
    if typ == 1:
        zend = -350.0 if backward else 780.0
    elif typ == 4:
        zend = 2700.0
    elif muon:
        zend = max(19000.0, states[-1][2])
    else:
        zend = 12520.0                                        # the ECAL's face
    pts = []
    if typ == 1 and backward:
        x, y, z, tx, ty = states[0]
        return [(x + tx * (zz - z), y + ty * (zz - z), zz) for zz in (z, zend)], bool(muon)
    for a, b in zip(states, states[1:]):
        x0, y0, z0, tx0, ty0 = a
        x1, y1, z1, tx1, ty1 = b
        h = z1 - z0
        if h <= 0:
            continue
        steps = max(2, int(h / 60.0))
        for i in range(steps):
            s = i / steps
            h00, h10, h01, h11 = 2*s**3 - 3*s**2 + 1, s**3 - 2*s**2 + s, -2*s**3 + 3*s**2, s**3 - s**2
            pts.append((h00*x0 + h10*h*tx0 + h01*x1 + h11*h*tx1,
                        h00*y0 + h10*h*ty0 + h01*y1 + h11*h*ty1, z0 + s*h))
    x, y, z, tx, ty = states[-1]
    pts.append((x, y, z))
    if zend > z:
        steps = max(1, int((zend - z) / 250.0))
        for i in range(1, steps + 1):
            zz = z + (zend - z) * i / steps
            pts.append((x + tx * (zz - z), y + ty * (zz - z), zz))
    return pts, bool(muon)


def emission(name, rgb, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    e = nt.nodes.new('ShaderNodeEmission')
    e.inputs['Color'].default_value = (*rgb, 1.0)
    e.inputs['Strength'].default_value = strength
    o = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(e.outputs[0], o.inputs['Surface'])
    return m


def metal(name, rgb, metallic, rough):
    """Cool dark metal: bright enough in albedo that the tracks' light reads on it."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*rgb, 1.0)
    b.inputs['Metallic'].default_value = metallic
    b.inputs['Roughness'].default_value = rough
    return m


SILICON = ('pvChip', 'pvSubstrate', 'pvHYB', 'pvSensor', 'pvAsic')


def build_tracks(ev, t_ns, glow=1.0):
    origin = ev['pvs'][0][:3]
    cand = ev.get('candidate') or {}
    hot = set(cand.get('mu', [])) | {cand.get('p'), cand.get('K')}
    mats = {'tone': emission('track', TONE_IN, 3.0), 'muon': emission('muon', MUON_IN, 4.5), 'hot': emission('hot', HOT, 16.0)}
    lamps = []                                           # (point mm, rgb, watts): the tracks light the metal round them
    reach = C_MM_PER_NS * t_ns
    col = bpy.data.collections.new('tracks')
    bpy.context.scene.collection.children.link(col)
    for i, t in enumerate(ev['tracks'][:ev['nGood']]):
        pts, muon = track_points(t)
        # light time from the crossing: the path from the vertex to the track's first point, then along it
        out, d = [], math.dist(origin, pts[0])
        if d > reach:
            continue
        out.append(pts[0])
        for a, b in zip(pts, pts[1:]):
            seg = math.dist(a, b)
            if d + seg >= reach:
                f = (reach - d) / seg
                out.append(tuple(a[k] + f * (b[k] - a[k]) for k in range(3)))
                break
            d += seg
            out.append(b)
        if len(out) < 2:
            continue
        cu = bpy.data.curves.new(f'track{i}', 'CURVE')
        cu.dimensions = '3D'
        cu.bevel_depth = 0.0011 if i in hot else 0.0006
        cu.bevel_resolution = 2
        sp = cu.splines.new('POLY')
        sp.points.add(len(out) - 1)
        for k, p in enumerate(out):
            sp.points[k].co = (*bl(p), 1.0)
        ob = bpy.data.objects.new(f'track{i}', cu)
        ob.data.materials.append(mats['hot'] if i in hot else mats['muon'] if muon else mats['tone'])
        ob.visible_shadow = False
        col.objects.link(ob)
        # small lamps along the track's first metre (where the VELO is), so its light falls on the modules
        acc, last = 0.0, None
        for a_, b_ in zip(out, out[1:]):
            if a_[2] > (900.0 if i in hot else 600.0):
                break
            acc += math.dist(a_, b_)
            if last is None or acc - last >= (80.0 if i in hot else 130.0):
                lamps.append((b_, HOT if i in hot else TONE_IN, 1.0 * glow if i in hot else 0.4 * glow))
                last = acc
    for k, (p, rgb, w) in enumerate(lamps):
        L = bpy.data.lights.new(f'tl{k}', 'POINT')
        L.energy, L.color, L.shadow_soft_size = w, rgb, 0.002
        lo = bpy.data.objects.new(f'tl{k}', L)
        lo.location = bl(p)
        lo.visible_camera = False
        col.objects.link(lo)
    # the crossing itself, a small hot point while it is fresh
    # the crossing itself: a hot point while it is fresh, an ember after, so the vertex stays readable
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.0018, location=bl(origin))
    bpy.context.object.data.materials.append(emission('vertex', HOT, max(10.0, 60.0 * (1 - t_ns / 3))))
    L = bpy.data.lights.new('pv', 'POINT')
    L.energy, L.color, L.shadow_soft_size = 1.5 * glow, TONE, 0.003
    lo = bpy.data.objects.new('pv', L)
    lo.location = bl(origin)
    lo.visible_camera = False
    col.objects.link(lo)


def look_at(ob, target):
    d = target - ob.location
    ob.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()


def main():
    a = args()
    shot = SHOTS[a.shot]
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=a.glb)
    # the importer files each part in its own collection and excludes all but the first from the
    # view layer (only BeamPipe > VPPipe rendered): include them all, HIDE picks what goes
    def include(lc):
        lc.exclude = False
        for c in lc.children:
            include(c)
    include(bpy.context.view_layer.layer_collection)
    root = [o for o in bpy.data.objects if o.parent is None]
    for o in root:
        o.scale = (0.001, 0.001, 0.001)
    det = metal('detector', (0.30, 0.33, 0.38), 0.6, 0.38)
    si = metal('silicon', (0.10, 0.12, 0.16), 0.6, 0.16)
    for o in bpy.data.objects:
        if o.type == 'MESH':
            o.data.materials.clear()
            o.data.materials.append(si if o.name.startswith(SILICON) else det)
    cut = shot.get('hide_cols', ())
    for o in bpy.data.objects:
        if any(o.name.startswith(h) for h in HIDE) or \
                any(c.name.startswith(cut) for c in o.users_collection if cut):
            for c in [o] + list(o.children_recursive):
                c.hide_render = True
                c.hide_viewport = True

    build_tracks(json.load(open(a.event)), a.t, shot['glow'])

    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam'))
    sc.collection.objects.link(cam)
    cam.location = bl(shot['cam'])
    look_at(cam, bl(shot['look']))
    cam.data.lens = shot['lens']
    cam.data.clip_start, cam.data.clip_end = shot['clip']
    cam.data.dof.use_dof = True
    cam.data.dof.focus_distance = (bl(shot['focus']) - cam.location).length
    cam.data.dof.aperture_fstop = shot['fstop']
    sc.camera = cam

    # a dim cool fill, so the metal reads where no track lights it
    fill = bpy.data.objects.new('fill', bpy.data.lights.new('fill', 'AREA'))
    fill.data.energy = shot['fill']
    fill.data.size = 2.0 if a.shot == 'crossing' else 20.0
    fill.data.color = (0.55, 0.68, 1.0)
    fill.visible_camera = False
    fill.location = bl(shot['fill_at']) if 'fill_at' in shot else cam.location + Vector((0, 0, 12))
    look_at(fill, bl(shot['look']))
    sc.collection.objects.link(fill)

    w = bpy.data.worlds.new('world')
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes['Background'].inputs['Color'].default_value = (0.0001, 0.0003, 0.001, 1.0)
    # haze: a thin scattering medium, so the tracks' glow hangs in the air
    if shot['haze'] > 0:
        v = nt.nodes.new('ShaderNodeVolumePrincipled')
        v.inputs['Color'].default_value = (0.8, 0.88, 1.0, 1.0)
        v.inputs['Density'].default_value = shot['haze']
        v.inputs['Anisotropy'].default_value = 0.6
        nt.links.new(v.outputs[0], nt.nodes['World Output'].inputs['Volume'])
    sc.world = w

    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = a.samples
    sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 4
    sc.cycles.transmission_bounces = 2
    sc.cycles.volume_bounces = 0
    sc.cycles.volume_step_rate = 4.0
    sc.cycles.blur_glossy = 1.0
    sc.cycles.sample_clamp_indirect = 8.0
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = 'AgX - Medium High Contrast'
    rx, ry = (int(v) for v in a.res.split('x'))
    sc.render.resolution_x, sc.render.resolution_y = rx, ry
    sc.render.film_transparent = False

    # bloom: the tracks glow into the air round them
    sc.use_nodes = True
    nt = sc.node_tree
    rl, comp = nt.nodes['Render Layers'], nt.nodes['Composite']
    g = nt.nodes.new('CompositorNodeGlare')
    g.glare_type = 'FOG_GLOW'
    g.quality = 'HIGH'
    # Blender 4.5 moved these from node properties to sockets
    g.inputs['Threshold'].default_value = 1.5
    g.inputs['Strength'].default_value = 0.3
    g.inputs['Size'].default_value = 0.7
    nt.links.new(rl.outputs['Image'], g.inputs['Image'])
    nt.links.new(g.outputs['Image'], comp.inputs['Image'])

    if a.save:
        bpy.ops.wm.save_as_mainfile(filepath=a.save)
    if a.out:
        sc.render.filepath = a.out
        bpy.ops.render.render(write_still=True)


main()
