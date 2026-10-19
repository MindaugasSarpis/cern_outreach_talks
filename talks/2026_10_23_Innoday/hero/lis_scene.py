"""The close's clip: the end of a SciFi module with its light injection system,
and a laser engraving the Lithuanian flag on the cold box (owner, 19 Oct:
"photorealistic 3D rendering of SciFi light injection system, then "laser"
inscribe Lithuanian flag on it"; "LIS coldbox with the flag").

Run inside Blender (4.5 LTS), headless, through the render slot:

  pnpm run -s talk render -- ~/talks/.cache/blender/blender-4.5.14-linux-x64/blender \\
      -b --factory-startup --python talks/2026_10_23_Innoday/hero/lis_scene.py -- \\
      --out /tmp/lis/frame_ [--frames 1-250 | --still 120,200,250] [--samples 128] \\
      [--res 1920x1080] [--depth /tmp/lis/] [--meta lis.json] [--save scene.blend]

Until the owner's CAD arrives, the module end is drawn here after the SciFi
drawing the owner sent on 19 Oct ("Can use this for now to mimic the Light
Injection system pcb"): four fibre mats side by side, the cold box over the mats'
ends (four blocks, numbered 4 in the drawing) with a copper strip along it, the
clip rail and the SiPMs' Kapton flex cables leaving over the edge, and two light
injection boards (3) on the mats, each with two optical connectors, its flex
strip and the fibres that feed it. --model swaps in a mesh (glTF, STL, OBJ) of
the CAD: kept under ~/talks/.cache/, never in git (the repo and Pages are
public); only renders are committed.

The flag is on the third cold-box block's top face (--block). --meta writes the
camera of the last frame (position, aim, vertical fov) as JSON and --depth that
frame's depth as EXR, so the stage can take the last frame over as grains in
depth at the same view.

Units are metres: x across the module (the cold box's length), y along the
fibres (into the module; the cold box at y < 0), z up from the mats' top.
"""
import argparse
import json
import math
import sys

import bpy
from mathutils import Vector

FPS = 25
# the Lithuanian flag, top to bottom (#FDB913, #006A44, #C1272D), in linear light
FLAG = [(0.982, 0.470, 0.007, 1.0), (0.0, 0.144, 0.058, 1.0), (0.533, 0.020, 0.026, 1.0)]
# the timeline, in frames at 25 fps: drift in over the boards, engrave the flag, cool, hold
T_ENGRAVE = (55, 190)      # 2.2-7.6 s: the laser writes the flag line by line, top to bottom
T_COOL = 30                # a mark cools from white heat to its colour in about 1.2 s
T_END = 250                # 10 s; the last 0.6 s hold still for the stage to take over
ROWS = 36                  # raster lines over the flag's height

MAT_W, GAP = 0.1305, 0.002     # a fibre mat's width (13 cm) and the slot between two
X0 = -2 * MAT_W - 1.5 * GAP    # the module's first mat's edge: four mats, 0.53 m
BOX_Y = (-0.058, -0.004)       # the cold box over the mats' ends
BOX_Z, STEP_Z = 0.016, 0.019   # its top; the raised strip along its outer edge
FLAG_W = 0.044                 # the flag: 44 mm by 26.4 mm, on block 3
FLAG_C = (-0.022,)             # its centre's y on the block


def args():
    a = argparse.ArgumentParser()
    a.add_argument('--model')
    a.add_argument('--out', default='/tmp/lis/frame_')
    a.add_argument('--frames', default=None, help='a-b')
    a.add_argument('--still', default=None, help='frames, comma separated')
    a.add_argument('--samples', type=int, default=128)
    a.add_argument('--res', default='1920x1080')
    a.add_argument('--block', type=int, default=2, help='which cold-box block carries the flag (0-3)')
    a.add_argument('--exposure', type=float, default=0.0)
    a.add_argument('--depth', help='a directory: the stills\' depth as EXR')
    a.add_argument('--meta')
    a.add_argument('--save')
    return a.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.fps = FPS
    sc.frame_start, sc.frame_end = 1, T_END
    return sc


# ---- materials ---------------------------------------------------------------------------
def pbr(name, base, metallic=0.0, rough=0.5, **extra):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*base, 1)
    b.inputs['Metallic'].default_value = metallic
    b.inputs['Roughness'].default_value = rough
    for k, v in extra.items():
        b.inputs[k].default_value = v
    return m


def grain(m, scale, lo, hi, into='Roughness', bump=0.0):
    """A fine noise in a material's roughness (a blasted or moulded surface's grain)."""
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    tex = nt.nodes.new('ShaderNodeTexNoise')
    tex.inputs['Scale'].default_value = scale
    tex.inputs['Detail'].default_value = 3.0
    r = nt.nodes.new('ShaderNodeMapRange')
    r.inputs['To Min'].default_value, r.inputs['To Max'].default_value = lo, hi
    nt.links.new(tex.outputs['Fac'], r.inputs['Value'])
    nt.links.new(r.outputs['Result'], b.inputs[into])
    if bump:
        bn = nt.nodes.new('ShaderNodeBump')
        bn.inputs['Strength'].default_value = bump
        bn.inputs['Distance'].default_value = 0.0002
        nt.links.new(tex.outputs['Fac'], bn.inputs['Height'])
        nt.links.new(bn.outputs['Normal'], b.inputs['Normal'])
    return m


def mats():
    M = {}
    # the cold box: dark anodised aluminium, bead-blasted
    M['box'] = grain(pbr('coldbox', (0.055, 0.058, 0.064), 0.85, 0.36), 2400, 0.30, 0.42, bump=0.08)
    # the mats under black foil, the fibres' direction in a faint anisotropic sheen
    M['mat'] = pbr('mat', (0.018, 0.02, 0.022), 0.0, 0.42, **{'Anisotropic': 0.6, 'Coat Weight': 0.3, 'Coat Roughness': 0.2})
    M['slot'] = pbr('slot', (0.004, 0.004, 0.004), 0.0, 0.8)
    M['copper'] = pbr('copper', (0.93, 0.55, 0.36), 1.0, 0.28)
    M['rail'] = grain(pbr('peek', (0.62, 0.58, 0.50), 0.0, 0.48, **{'Subsurface Weight': 0.15}), 900, 0.42, 0.55)
    M['kapton'] = pbr('kapton', (0.62, 0.25, 0.045), 0.0, 0.18, **{'Coat Weight': 0.6, 'Coat Roughness': 0.08,
                                                                    'Transmission Weight': 0.15})
    M['stiff'] = pbr('fr4', (0.70, 0.60, 0.40), 0.0, 0.55)
    M['pcb'] = pbr('soldermask', (0.008, 0.055, 0.03), 0.0, 0.3, **{'Coat Weight': 0.7, 'Coat Roughness': 0.12})
    M['gold'] = pbr('gold', (1.0, 0.77, 0.34), 1.0, 0.22)
    M['chip'] = pbr('epoxy', (0.015, 0.015, 0.016), 0.0, 0.55)
    M['steel'] = pbr('steel', (0.62, 0.62, 0.63), 1.0, 0.2)
    M['boot'] = pbr('boot', (0.02, 0.02, 0.022), 0.0, 0.6)
    M['fibre'] = pbr('jacket', (0.22, 0.48, 0.85), 0.0, 0.38, **{'Coat Weight': 0.3})
    M['lisflex'] = pbr('lisflex', (0.09, 0.32, 0.17), 0.0, 0.25, **{'Coat Weight': 0.5, 'Transmission Weight': 0.2})
    M['wall'] = grain(pbr('wall', (0.55, 0.56, 0.58), 1.0, 0.33, **{'Anisotropic': 0.5}), 600, 0.28, 0.38)
    M['cap'] = pbr('passive', (0.42, 0.33, 0.22), 0.0, 0.5)
    return M


def engraved(m0, face, t0, t1, cool):
    """The flag block's material: the cold box's, and where the laser has passed the
    flag's colour (colour marking: a thin oxide whose colour the laser sets), white hot
    when fresh, cooling to its colour. A point's raster time comes from its position,
    so the same nodes give the engraving at any frame (the frame comes in through a
    driver on a value node)."""
    cx, cy, w = face
    h = w * 3 / 5
    m = m0.copy()
    m.name = 'engraved'
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    L = nt.links.new
    geo = nt.nodes.new('ShaderNodeNewGeometry')
    xyz = nt.nodes.new('ShaderNodeSeparateXYZ')
    L(geo.outputs['Position'], xyz.inputs[0])

    def op(kind, a, b_=None, clamp=False):
        n = nt.nodes.new('ShaderNodeMath')
        n.operation = kind
        n.use_clamp = clamp
        for i, v in enumerate((a, b_)):
            if v is None:
                continue
            if isinstance(v, (int, float)):
                n.inputs[i].default_value = v
            else:
                L(v, n.inputs[i])
        return n.outputs[0]

    # u, v in the flag (0..1; v = 0 along the top stripe's top edge, the +y side)
    u = op('DIVIDE', op('SUBTRACT', xyz.outputs['X'], cx - w / 2), w)
    v = op('DIVIDE', op('SUBTRACT', cy + h / 2, xyz.outputs['Y']), h)
    on_top = op('GREATER_THAN', xyz.outputs['Z'], BOX_Z - 0.0005)
    inside = op('MULTIPLY', on_top, op('MULTIPLY',
                op('MULTIPLY', op('GREATER_THAN', u, 0.0), op('LESS_THAN', u, 1.0)),
                op('MULTIPLY', op('GREATER_THAN', v, 0.0), op('LESS_THAN', v, 1.0))))
    # raster: line k = floor(v * ROWS), left to right on even lines, back on odd ones
    k = op('FLOOR', op('MULTIPLY', v, ROWS))
    odd = op('MODULO', k, 2.0)
    along = op('ADD', op('MULTIPLY', odd, op('SUBTRACT', 1.0, u)), op('MULTIPLY', op('SUBTRACT', 1.0, odd), u))
    when = op('ADD', t0, op('MULTIPLY', op('DIVIDE', op('ADD', k, along), ROWS), t1 - t0))
    frame = nt.nodes.new('ShaderNodeValue')
    frame.label = 'frame'
    fc = frame.outputs[0].driver_add('default_value')
    fc.driver.expression = 'frame'
    since = op('SUBTRACT', frame.outputs[0], when)
    done = op('MULTIPLY', op('GREATER_THAN', since, 0.0), inside)
    heat = op('MULTIPLY', done, op('EXPONENT', op('DIVIDE', op('MULTIPLY', since, -1.0), cool / 3.0)))
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.interpolation = 'CONSTANT'
    els = ramp.color_ramp.elements
    els[0].position, els[0].color = 0.0, FLAG[0]
    els[1].position, els[1].color = 1 / 3, FLAG[1]
    els.new(2 / 3).color = FLAG[2]
    L(v, ramp.inputs['Fac'])
    mix = nt.nodes.new('ShaderNodeMix')
    mix.data_type = 'RGBA'
    mix.inputs['A'].default_value = b.inputs['Base Color'].default_value
    L(done, mix.inputs['Factor'])
    L(ramp.outputs['Color'], mix.inputs['B'])
    L(mix.outputs['Result'], b.inputs['Base Color'])
    # the oxide is a dielectric film: the marks lose the metal's mirror and go satin
    L(op('SUBTRACT', 0.85, op('MULTIPLY', done, 0.85)), b.inputs['Metallic'])
    rough = b.inputs['Roughness'].links[0].from_socket if b.inputs['Roughness'].is_linked else None
    rmix = nt.nodes.new('ShaderNodeMix')
    rmix.data_type = 'FLOAT'
    if rough:
        L(rough, rmix.inputs['A'])
    else:
        rmix.inputs['A'].default_value = 0.36
    rmix.inputs['B'].default_value = 0.46
    L(done, rmix.inputs['Factor'])
    L(rmix.outputs['Result'], b.inputs['Roughness'])
    hot = nt.nodes.new('ShaderNodeBlackbody')
    L(op('ADD', 1000.0, op('MULTIPLY', heat, 3200.0)), hot.inputs['Temperature'])
    L(hot.outputs['Color'], b.inputs['Emission Color'])
    L(op('MULTIPLY', op('POWER', heat, 2.0), 14.0), b.inputs['Emission Strength'])
    return m


# ---- geometry ----------------------------------------------------------------------------
def smooth(o, angle=0.6):
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    try:
        bpy.ops.object.shade_smooth_by_angle(angle=angle)
    except Exception:
        pass
    o.select_set(False)


def box(name, x0, x1, y0, y1, z0, z1, mat, bevel=0.0004):
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.object
    o.name = name
    o.scale = (x1 - x0, y1 - y0, z1 - z0)
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(mat)
    if bevel:
        bevel_(o, bevel)
    return o


def bevel_(o, w, seg=3):
    m = o.modifiers.new('bevel', 'BEVEL')
    m.width, m.segments, m.limit_method = w, seg, 'ANGLE'
    m.harden_normals = True
    smooth(o)


def cyl(name, at, axis, r, length, mat, verts=32):
    axis = Vector(axis).normalized()
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=length, vertices=verts, location=at)
    o = bpy.context.object
    o.name = name
    o.rotation_euler = axis.to_track_quat('Z', 'Y').to_euler()
    o.data.materials.append(mat)
    smooth(o)
    return o


def cut(target, cutter):
    cutter.hide_render = True
    cutter.display_type = 'WIRE'
    m = target.modifiers.new('cut', 'BOOLEAN')
    m.object, m.operation, m.solver = cutter, 'DIFFERENCE', 'EXACT'


def countersunk(target, x, y, ztop, r):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=0.05, vertices=32, location=(x, y, ztop - 0.02))
    cut(target, bpy.context.object)
    bpy.ops.mesh.primitive_cone_add(radius1=r, radius2=r * 2.1, depth=r * 1.1, vertices=32, location=(x, y, ztop - r * 0.55 + 0.0001))
    cut(target, bpy.context.object)


def sheet(name, pts, width, thick, mat, x):
    """A flex cable: a strip of `width` along a path in the yz plane at x, `thick` thick."""
    me = bpy.data.meshes.new(name)
    vs, fs = [], []
    for i, (y, z) in enumerate(pts):
        vs += [(x - width / 2, y, z), (x + width / 2, y, z)]
        if i:
            a = 2 * i
            fs.append((a - 2, a - 1, a + 1, a))
    me.from_pydata(vs, [], fs)
    o = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(o)
    s = o.modifiers.new('thick', 'SOLIDIFY')
    s.thickness, s.offset = thick, 0
    o.data.materials.append(mat)
    smooth(o, 1.2)
    return o


def arc_path(y0, z0, segs):
    """Points along straight runs and quarter bends: segs = [('line', dy, dz) | ('bend', r, a0, a1)]."""
    pts = [(y0, z0)]
    y, z = y0, z0
    for s in segs:
        if s[0] == 'line':
            n = 6
            for i in range(1, n + 1):
                pts.append((y + s[1] * i / n, z + s[2] * i / n))
            y, z = pts[-1]
        else:
            _, r, a0, a1 = s
            cy, cz = y - r * math.cos(a0), z - r * math.sin(a0)
            n = 14
            for i in range(1, n + 1):
                a = a0 + (a1 - a0) * i / n
                pts.append((cy + r * math.cos(a), cz + r * math.sin(a)))
            y, z = pts[-1]
    return pts


def tube(name, pts, r, mat):
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth, cu.bevel_resolution = r, 6
    cu.use_fill_caps = True
    sp = cu.splines.new('BEZIER')
    sp.bezier_points.add(len(pts) - 1)
    for bp, p in zip(sp.bezier_points, pts):
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = 'AUTO'
    o = bpy.data.objects.new(name, cu)
    bpy.context.collection.objects.link(o)
    o.data.materials.append(mat)
    return o


def module_end(M, flag_block):
    xs = [X0 + i * (MAT_W + GAP) for i in range(4)]       # each mat's (and block's) left edge
    parts = {}
    # the module's skin and its four mats, running on into the distance
    box('panel', X0 - 0.004, xs[3] + MAT_W + 0.004, BOX_Y[0] - 0.02, 1.4, -0.022, -0.0016, M['slot'], 0)
    for i, x in enumerate(xs):
        box(f'mat{i}', x, x + MAT_W, BOX_Y[1], 1.4, -0.0016, 0.0, M['mat'], 0.0002)
    # the cold box: four blocks over the mats' ends, a raised strip along the outer edge,
    # countersunk screws
    for i, x in enumerate(xs):
        b = box(f'coldbox{i}', x + 0.0005, x + MAT_W - 0.0005, BOX_Y[0], BOX_Y[1], 0.0, BOX_Z, M['box'], 0)
        step = box(f'step{i}', x + 0.0005, x + MAT_W - 0.0005, BOX_Y[0], -0.042, BOX_Z - 0.001, STEP_Z, M['box'], 0.0006)
        for (fx, fy, r) in ((0.30, -0.012, 0.0016), (0.72, -0.050, 0.0016), (0.86, -0.031, 0.0026)):
            countersunk(b if fy > -0.042 else step, x + fx * MAT_W, fy, BOX_Z if fy > -0.042 else STEP_Z, r)
        bevel_(b, 0.0007)
        parts[f'block{i}'] = b
        for (fx, fy) in ((0.30, -0.012), (0.72, -0.050)):
            z = BOX_Z if fy > -0.042 else STEP_Z
            s = cyl('screw', (x + fx * MAT_W, fy, z - 0.0012), (0, 0, 1), 0.0029, 0.0017, M['steel'])
            hexs = cyl('hex', (x + fx * MAT_W, fy, z - 0.0003), (0, 0, 1), 0.0013, 0.0012, M['chip'], 6)
    # the copper strip along the inner edge
    box('copper', X0, xs[3] + MAT_W, BOX_Y[1] - 0.0012, BOX_Y[1] + 0.0022, 0.0, BOX_Z + 0.0004, M['copper'], 0.0003)
    # the clip rail along the outer edge, a clip per flex cable
    box('rail', X0, xs[3] + MAT_W, BOX_Y[0] - 0.014, BOX_Y[0], -0.012, 0.010, M['rail'], 0.0006)
    flex_x = []
    for x in xs:
        for f in (0.13, 0.38, 0.62, 0.87):
            flex_x.append(x + f * MAT_W)
    for j, fx in enumerate(flex_x):
        box('clip', fx - 0.009, fx + 0.009, BOX_Y[0] - 0.017, BOX_Y[0] - 0.006, 0.006, 0.0135, M['rail'], 0.0007)
        # the SiPM's flex cable leaves under the clip, over the edge and down to its connector
        reach = 0.030 if j % 2 else 0.060
        pts = arc_path(BOX_Y[0] - 0.004, 0.0035, [('line', -0.03, 0.0), ('bend', 0.010, math.pi / 2, math.pi),
                                                   ('line', 0.0, -0.022), ('bend', 0.010, math.pi, 1.5 * math.pi),
                                                   ('line', -reach, 0.0)])
        sheet(f'flex{j}', pts, 0.024, 0.00025, M['kapton'], fx)
        ey, ez = pts[-1]
        box('stiffener', fx - 0.0135, fx + 0.0135, ey - 0.026, ey + 0.001, ez - 0.0018, ez - 0.0002, M['stiff'], 0.0003)
        box('conn', fx - 0.011, fx + 0.011, ey - 0.020, ey - 0.006, ez - 0.0045, ez - 0.0018, M['chip'], 0.0003)
    # the side wall of the readout box, on the right
    box('wall', xs[3] + MAT_W + 0.006, xs[3] + MAT_W + 0.012, BOX_Y[0] - 0.02, 1.4, -0.022, 0.11, M['wall'], 0.0008)
    # two light injection boards on the mats, each with two optical connectors facing the
    # cold box, its flex strip running along the fibres, and its fibres
    for n, (bx, by) in enumerate(((xs[0] + 0.55 * MAT_W, 0.205), (xs[2] + 0.80 * MAT_W, 0.075))):
        box(f'lisflex{n}', bx - 0.006, bx + 0.006, by + 0.006, by + 0.135, 0.0, 0.0004, M['lisflex'], 0)
        box(f'lisT{n}', bx - 0.022, bx + 0.022, by + 0.128, by + 0.140, 0.0, 0.0004, M['lisflex'], 0)
        box(f'lis{n}', bx - 0.013, bx + 0.013, by - 0.011, by + 0.012, 0.0006, 0.0022, M['pcb'], 0.0003)
        for (cx, cy, w) in ((-0.004, 0.004, 0.0045), (0.005, 0.003, 0.0035), (0.0, -0.004, 0.003)):
            box('ic', bx + cx - w / 2, bx + cx + w / 2, by + cy - w / 2, by + cy + w / 2, 0.0022, 0.0031, M['chip'], 0.0002)
        for k in range(10):
            px, py = bx - 0.010 + (k % 5) * 0.005, by + (0.0095 if k < 5 else -0.0095)
            box('cap', px - 0.0005, px + 0.0005, py - 0.00025, py + 0.00025, 0.0022, 0.0027, M['cap'], 0.00005)
        box('pads', bx - 0.012, bx + 0.012, by + 0.0105, by + 0.0115, 0.0022, 0.00225, M['gold'], 0)
        for s in (-1, 1):
            cx = bx + s * 0.0055
            cyl('ferrule', (cx, by - 0.016, 0.0040), (0, 1, 0), 0.0021, 0.010, M['steel'])
            cyl('nut', (cx, by - 0.0115, 0.0040), (0, 1, 0), 0.0029, 0.002, M['steel'], 6)
            cyl('boot', (cx, by - 0.025, 0.0040), (0, 1, 0), 0.0016, 0.008, M['boot'])
            # the fibre: toward the cold box, then along it to the module's edge
            ey = 0.016 + 0.004 * (n * 2 + (s + 1) / 2)
            tube(f'fibre{n}', [(cx, by - 0.029, 0.004), (cx, by - 0.05, 0.0028), (cx - 0.02, ey + 0.01, 0.0026),
                               (cx - 0.07, ey, 0.0026), (X0 - 0.03, ey - 0.002, 0.003), (X0 - 0.07, ey - 0.03, -0.02)],
                 0.0011, M['fibre'])
    return parts


# ---- light, camera, world -----------------------------------------------------------------
def light(name, kind, loc, aim, energy, color=(1, 1, 1), size=1.0, size_y=None):
    d = bpy.data.lights.new(name, kind)
    d.energy = energy
    d.color = color
    if kind == 'AREA':
        d.shape = 'RECTANGLE'
        d.size, d.size_y = size, size_y or size / 4
    o = bpy.data.objects.new(name, d)
    bpy.context.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = (Vector(aim) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    return o


def studio(sc):
    w = bpy.data.worlds.new('dark')
    w.use_nodes = True
    w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.0006, 0.0008, 0.0012, 1)
    sc.world = w
    # a product shot's lights: a long softbox overhead and behind for the metal's sheen, a
    # cool rim (the deck's light blue) from the far side, a dim warm fill low on the left
    light('key', 'AREA', (0.02, 0.32, 0.55), (0.05, -0.03, 0.0), 16, (1.0, 0.97, 0.93), 0.9, 0.22)
    light('top', 'AREA', (-0.05, -0.25, 0.75), (0.05, 0.0, 0.0), 7, (1.0, 0.98, 0.95), 0.6, 0.6)
    light('rim', 'AREA', (0.30, 0.70, 0.12), (0.0, 0.0, 0.01), 9, (0.61, 0.77, 1.0), 0.6, 0.15)
    light('fill', 'AREA', (-0.60, -0.40, 0.10), (0.0, 0.0, 0.0), 1.2, (1.0, 0.85, 0.7), 0.5, 0.5)


def camera(sc, flag):
    d = bpy.data.cameras.new('cam')
    d.lens = 60
    d.dof.use_dof = True
    d.dof.aperture_fstop = 5.6
    d.clip_start, d.clip_end = 0.005, 20
    o = bpy.data.objects.new('cam', d)
    bpy.context.collection.objects.link(o)
    sc.camera = o
    aim = bpy.data.objects.new('aim', None)
    bpy.context.collection.objects.link(aim)
    t = o.constraints.new('TRACK_TO')
    t.target, t.track_axis, t.up_axis = aim, 'TRACK_NEGATIVE_Z', 'UP_Y'
    d.dof.focus_object = aim
    fx, fy = flag[0], flag[1]
    # over the clip rail and across the boards, then down onto the cold box and the flag
    keys = [(1, (fx - 0.40, -0.40, 0.27), (fx - 0.17, 0.10, 0.0)),
            (T_ENGRAVE[0], (fx - 0.17, -0.27, 0.19), (fx - 0.01, -0.005, 0.008)),
            (T_ENGRAVE[1] + T_COOL, (fx - 0.035, -0.215, 0.155), (fx, fy + 0.002, BOX_Z)),
            (T_END, (fx - 0.035, -0.215, 0.155), (fx, fy + 0.002, BOX_Z))]
    for f, p, a in keys:
        o.location = p
        aim.location = a
        o.keyframe_insert('location', frame=f)
        aim.keyframe_insert('location', frame=f)
    for ob in (o, aim):
        for fc in ob.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = 'BEZIER'
                kp.easing = 'EASE_IN_OUT'
    return o, aim


def emitter(name, color, strength, alpha=None):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.remove(nt.nodes['Principled BSDF'])
    em = nt.nodes.new('ShaderNodeEmission')
    em.inputs['Color'].default_value = (*color, 1)
    em.inputs['Strength'].default_value = strength
    out = em.outputs[0]
    if alpha is not None:
        tr = nt.nodes.new('ShaderNodeBsdfTransparent')
        mx = nt.nodes.new('ShaderNodeMixShader')
        mx.inputs['Fac'].default_value = alpha
        nt.links.new(tr.outputs[0], mx.inputs[1])
        nt.links.new(out, mx.inputs[2])
        out = mx.outputs[0]
    nt.links.new(out, nt.nodes['Material Output'].inputs['Surface'])
    return m


def laser(face, t0, t1):
    """The marking spot and its beam, keyed frame by frame along the raster the material
    uses, and a spray of sparks from the spot."""
    cx, cy, w = face
    h = w * 3 / 5
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.00035, segments=16, ring_count=8)
    spot = bpy.context.object
    spot.name = 'spot'
    spot.data.materials.append(emitter('spot', (1.0, 0.93, 0.82), 60))
    pl = bpy.data.lights.new('spotlight', 'POINT')
    pl.energy, pl.color, pl.shadow_soft_size = 0.25, (1.0, 0.78, 0.5), 0.0005
    plo = bpy.data.objects.new('spotlight', pl)
    bpy.context.collection.objects.link(plo)
    plo.parent = spot
    plo.location = (0, 0, 0.002)
    # the beam: a hair-thin, faint line from a head above (a marking laser is infrared and
    # invisible; the line is there so the room sees what writes the flag)
    head = Vector((cx + 0.02, cy + 0.06, 0.6))
    bpy.ops.mesh.primitive_cylinder_add(radius=0.00012, depth=1.0, vertices=8)
    beam = bpy.context.object
    beam.name = 'beam'
    beam.data.materials.append(emitter('beam', (0.78, 0.88, 1.0), 5, alpha=0.4))
    beam.visible_shadow = False
    for f in range(1, T_END + 1):
        on = t0 <= f <= t1
        p = (f - t0) / (t1 - t0) * ROWS if on else 0
        k = min(int(p), ROWS - 1)
        a = p - k
        uu = a if k % 2 == 0 else 1 - a
        vv = (k + 0.5) / ROWS
        x, y = cx - w / 2 + uu * w, cy + h / 2 - vv * h
        spot.location = (x, y, BOX_Z + 0.0002)
        foot = Vector((x, y, BOX_Z))
        beam.location = (foot + head) / 2
        beam.rotation_euler = (head - foot).to_track_quat('Z', 'Y').to_euler()
        beam.scale = (1, 1, (head - foot).length)
        for o, props in ((spot, ('location',)), (beam, ('location', 'rotation_euler', 'scale'))):
            for pr in props:
                o.keyframe_insert(pr, frame=f)
        for o in (spot, plo, beam):
            o.hide_render = not on
            o.keyframe_insert('hide_render', frame=f)
    for o in (spot, plo, beam):
        for fc in o.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = 'CONSTANT' if fc.data_path == 'hide_render' else 'LINEAR'
    sparks(spot, t0, t1)
    return spot


def sparks(spot, t0, t1):
    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.00011, subdivisions=1, location=(0, 0, -5))
    g = bpy.context.object
    g.name = 'spark'
    g.data.materials.append(emitter('spark', (1.0, 0.6, 0.25), 30))
    ps = spot.modifiers.new('sparks', 'PARTICLE_SYSTEM').particle_system
    s = ps.settings
    s.count = 1800
    s.frame_start, s.frame_end = t0, t1
    s.lifetime, s.lifetime_random = 6, 0.7
    s.emit_from = 'VERT'
    s.normal_factor = 0.03
    s.object_align_factor = (0, 0, 0.10)
    s.factor_random = 0.09
    s.effector_weights.gravity = 0.25
    s.render_type = 'OBJECT'
    s.instance_object = g
    s.particle_size, s.size_random = 1.0, 0.7
    spot.show_instancer_for_render = True


def render_setup(sc, a):
    sc.render.engine = 'CYCLES'
    cy = sc.cycles
    cy.device = 'CPU'
    cy.samples = a.samples
    cy.use_denoising = True
    cy.denoiser = 'OPENIMAGEDENOISE'
    cy.max_bounces, cy.glossy_bounces, cy.transmission_bounces = 8, 6, 6
    cy.caustics_reflective = cy.caustics_refractive = False
    w, h = (int(x) for x in a.res.split('x'))
    sc.render.resolution_x, sc.render.resolution_y = w, h
    sc.render.resolution_percentage = 100
    sc.render.use_motion_blur = True
    sc.render.motion_blur_shutter = 0.5
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = 'AgX - Base Contrast'
    sc.view_settings.exposure = a.exposure
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_depth = '8'
    sc.render.filepath = a.out
    # a soft glow round the spot and the white-hot marks only, as a lens shows them
    sc.use_nodes = True
    nt = sc.node_tree
    rl = nt.nodes['Render Layers']
    comp = nt.nodes['Composite']
    g = nt.nodes.new('CompositorNodeGlare')
    g.glare_type = 'FOG_GLOW'
    g.quality = 'HIGH'
    g.threshold = 4.0
    g.size = 6
    nt.links.new(rl.outputs['Image'], g.inputs['Image'])
    nt.links.new(g.outputs['Image'], comp.inputs['Image'])
    if a.depth:
        sc.view_layers[0].use_pass_z = True
        fo = nt.nodes.new('CompositorNodeOutputFile')
        fo.base_path = a.depth
        fo.format.file_format = 'OPEN_EXR'
        fo.format.color_depth = '32'
        fo.file_slots[0].path = 'depth_'
        nt.links.new(rl.outputs['Depth'], fo.inputs[0])


def main():
    a = args()
    sc = reset()
    M = mats()
    xs = [X0 + i * (MAT_W + GAP) for i in range(4)]
    face = (xs[a.block] + MAT_W / 2, FLAG_C[0], FLAG_W)
    if a.model:
        raise SystemExit('lis_scene: --model is for the owner\'s CAD, once it is here (not wired yet)')
    parts = module_end(M, a.block)
    blk = parts[f'block{a.block}']
    blk.data.materials.clear()
    blk.data.materials.append(engraved(M['box'], face, *T_ENGRAVE, T_COOL))
    studio(sc)
    cam, aim = camera(sc, face)
    laser(face, *T_ENGRAVE)
    render_setup(sc, a)
    if a.meta:
        sc.frame_set(T_END)
        d = cam.data
        vfov = 2 * math.atan(d.sensor_width / 2 / d.lens) * sc.render.resolution_y / sc.render.resolution_x
        mw = cam.matrix_world
        json.dump({'cam': list(mw.translation), 'aim': list(aim.matrix_world.translation),
                   'matrix': [list(r) for r in mw], 'vfov_deg': math.degrees(vfov), 'lens_mm': d.lens,
                   'sensor_mm': d.sensor_width, 'flag': face, 'fps': FPS, 'frames': T_END,
                   'res': [sc.render.resolution_x, sc.render.resolution_y]},
                  open(a.meta, 'w'), indent=1)
    if a.save:
        bpy.ops.wm.save_as_mainfile(filepath=a.save)
    if a.still:
        # step through the frames before each still, so the sparks' simulation has run up to it
        f = 1
        for want in sorted(int(x) for x in a.still.split(',')):
            while f < want:
                f += 1
                sc.frame_set(f)
            sc.frame_set(want)
            sc.render.filepath = f'{a.out}{want:04d}.png'
            bpy.ops.render.render(write_still=True)
    elif a.frames:
        f0, f1 = (int(x) for x in a.frames.split('-'))
        sc.frame_start, sc.frame_end = f0, f1
        bpy.ops.render.render(animation=True)


main()
