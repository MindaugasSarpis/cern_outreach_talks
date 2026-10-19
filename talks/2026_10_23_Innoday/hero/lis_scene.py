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

The scene is built in the module's own frame, in metres: x across the module
(the cold box's length), y along the fibres (into the module; the cold box at
y < 0), z out of the mats' face. A root turns it upright as it stands in LHCb:
the readout end at the top (Blender +Z is the module's -y), the face toward the
camera (-Y). So the camera's up is the world's up, as in the stage, and the
lens's vertical field is the stage's 50 degrees: the last frame, with --meta's
depth (--depth: a ray per pixel at 480x270, as 16-bit depth in a PNG's red and
green), becomes grains in depth at the stage's own view.
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
# the marks' own faint glow at rest, per stripe: the flag's hues, brighter, so the view
# transform keeps them saturated and the flag is the brightest thing in the last frame
GLOW = [(1.0, 0.55, 0.0, 1.0), (0.0, 0.55, 0.20, 1.0), (1.0, 0.02, 0.03, 1.0)]
# the timeline, in frames at 25 fps: drift in over the boards, engrave the flag, cool, hold
T_ENGRAVE = (55, 190)      # 2.2-7.6 s: the laser writes the flag line by line, top to bottom
T_COOL = 45                # a mark cools from white heat to its colour in about 1.8 s
T_END = 250                # 10 s; the last 0.6 s hold still for the stage to take over
ROWS = 60                  # raster lines over the flag's height

MAT_W, GAP = 0.1305, 0.002     # a fibre mat's width (13 cm) and the slot between two
X0 = -2 * MAT_W - 1.5 * GAP    # the module's first mat's edge: four mats, 0.53 m
BOX_Y = (-0.058, -0.004)       # the cold box over the mats' ends
BOX_Z, STEP_Z = 0.016, 0.019   # its top; the raised strip along its outer edge
STEP_Y = -0.050                # the strip's inner edge
FLAG_W = 0.044                 # the flag: 44 mm by 26.4 mm, on block 3
FLAG_C = (-0.027,)             # its centre's y on the block, 10 mm clear of the copper and the strip
VFOV = 50.0                    # the stage's vertical field of view (slidev-addon-stage, space.js)
# the module's frame -> Blender: x -> -X, y -> -Z (down the module), z -> -Y (toward the camera)
UPRIGHT = ((-1, 0, 0), (0, 0, -1), (0, -1, 0))


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
    a.add_argument('--depth', help='a PNG: the last frame\'s depth (with --meta)')
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
    M['box'] = grain(pbr('coldbox', (0.045, 0.047, 0.052), 0.85, 0.42, **{'Anisotropic': 0.3}), 2400, 0.38, 0.48, bump=0.08)
    # the mats under black foil, the fibres' direction in a faint anisotropic sheen
    M['mat'] = pbr('mat', (0.008, 0.009, 0.010), 0.0, 0.5, **{'Anisotropic': 0.6, 'Coat Weight': 0.25, 'Coat Roughness': 0.25})
    M['slot'] = pbr('slot', (0.03, 0.03, 0.032), 0.8, 0.4)
    M['copper'] = pbr('copper', (0.80, 0.40, 0.22), 1.0, 0.36)
    M['rail'] = grain(pbr('peek', (0.62, 0.58, 0.50), 0.0, 0.48, **{'Subsurface Weight': 0.15}), 900, 0.42, 0.55)
    M['kapton'] = pbr('kapton', (0.62, 0.25, 0.045), 0.0, 0.18, **{'Coat Weight': 0.6, 'Coat Roughness': 0.08,
                                                                    'Transmission Weight': 0.15})
    M['stiff'] = pbr('fr4', (0.70, 0.60, 0.40), 0.0, 0.55)
    M['pcb'] = pbr('soldermask', (0.008, 0.055, 0.03), 0.0, 0.3, **{'Coat Weight': 0.7, 'Coat Roughness': 0.12})
    M['gold'] = pbr('gold', (1.0, 0.77, 0.34), 1.0, 0.22)
    M['chip'] = pbr('epoxy', (0.015, 0.015, 0.016), 0.0, 0.55)
    M['steel'] = pbr('steel', (0.50, 0.50, 0.51), 1.0, 0.34)
    M['boot'] = pbr('boot', (0.02, 0.02, 0.022), 0.0, 0.6)
    M['fibre'] = pbr('jacket', (0.22, 0.48, 0.85), 0.0, 0.38, **{'Coat Weight': 0.3})
    M['lisflex'] = pbr('lisflex', (0.09, 0.32, 0.17), 0.0, 0.25, **{'Coat Weight': 0.5, 'Transmission Weight': 0.2})
    M['wall'] = grain(pbr('wall', (0.30, 0.31, 0.33), 1.0, 0.5, **{'Anisotropic': 0.5}), 600, 0.45, 0.55)
    M['cap'] = pbr('passive', (0.42, 0.33, 0.22), 0.0, 0.5)
    return M


def engraved(m0, face, t0, t1, cool, centre):
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
    # the block's own coordinates, back in the module's frame (the root turns it upright)
    tc = nt.nodes.new('ShaderNodeTexCoord')
    off = nt.nodes.new('ShaderNodeVectorMath')
    off.operation = 'ADD'
    off.inputs[1].default_value = centre
    L(tc.outputs['Object'], off.inputs[0])
    xyz = nt.nodes.new('ShaderNodeSeparateXYZ')
    L(off.outputs[0], xyz.inputs[0])

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

    # u, v in the flag (0..1; v = 0 along the top stripe's top edge: the -y side, the
    # module's end, which is up as it stands)
    u = op('DIVIDE', op('SUBTRACT', xyz.outputs['X'], cx - w / 2), w)
    v = op('DIVIDE', op('SUBTRACT', xyz.outputs['Y'], cy - h / 2), h)
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
    # the oxide is a dielectric film: the marks lose the metal's mirror and go matte
    L(op('SUBTRACT', 0.9, op('MULTIPLY', done, 0.9)), b.inputs['Metallic'])
    rough = b.inputs['Roughness'].links[0].from_socket if b.inputs['Roughness'].is_linked else None
    rmix = nt.nodes.new('ShaderNodeMix')
    rmix.data_type = 'FLOAT'
    if rough:
        L(rough, rmix.inputs['A'])
    else:
        rmix.inputs['A'].default_value = 0.36
    rmix.inputs['B'].default_value = 0.7
    L(done, rmix.inputs['Factor'])
    L(rmix.outputs['Result'], b.inputs['Roughness'])
    # the raster's lines in relief, a hair deep
    lines = op('MULTIPLY', done, op('SINE', op('MULTIPLY', v, ROWS * 2 * math.pi)))
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.08
    bump.inputs['Distance'].default_value = 0.00004
    L(lines, bump.inputs['Height'])
    L(bump.outputs['Normal'], b.inputs['Normal'])
    # white heat when fresh; at rest the marks keep a faint glow of their own colour, so the
    # flag is the brightest thing in the last frame (the stage turns bright pixels to grains)
    hot = nt.nodes.new('ShaderNodeBlackbody')
    L(op('ADD', 1000.0, op('MULTIPLY', heat, 3200.0)), hot.inputs['Temperature'])
    hot_k = op('POWER', heat, 2.0)
    glow = nt.nodes.new('ShaderNodeValToRGB')
    glow.color_ramp.interpolation = 'CONSTANT'
    ge = glow.color_ramp.elements
    ge[0].position, ge[0].color = 0.0, GLOW[0]
    ge[1].position, ge[1].color = 1 / 3, GLOW[1]
    ge.new(2 / 3).color = GLOW[2]
    L(v, glow.inputs['Fac'])
    emc = nt.nodes.new('ShaderNodeMix')
    emc.data_type = 'RGBA'
    L(hot_k, emc.inputs['Factor'])
    L(glow.outputs['Color'], emc.inputs['A'])
    L(hot.outputs['Color'], emc.inputs['B'])
    L(emc.outputs['Result'], b.inputs['Emission Color'])
    L(op('ADD', op('MULTIPLY', hot_k, 14.0), op('MULTIPLY', done, 0.9)), b.inputs['Emission Strength'])
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
        b = box(f'coldbox{i}', x - GAP / 2 + 0.0002, x + MAT_W + GAP / 2 - 0.0002, BOX_Y[0], BOX_Y[1], 0.0, BOX_Z, M['box'], 0)
        step = box(f'step{i}', x - GAP / 2 + 0.0002, x + MAT_W + GAP / 2 - 0.0002, BOX_Y[0], STEP_Y, BOX_Z - 0.001, STEP_Z, M['box'], 0.0006)
        for (fx, fy, r) in ((0.12, -0.012, 0.0016), (0.72, -0.054, 0.0016), (0.90, -0.031, 0.0026)):
            countersunk(b if fy > STEP_Y else step, x + fx * MAT_W, fy, BOX_Z if fy > STEP_Y else STEP_Z, r)
        bevel_(b, 0.0007)
        parts[f'block{i}'] = b
        for (fx, fy) in ((0.12, -0.012), (0.72, -0.054)):
            z = BOX_Z if fy > STEP_Y else STEP_Z
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
            ey = 0.030 + 0.005 * (n * 2 + (s + 1) / 2)
            tube(f'fibre{n}', [(cx, by - 0.029, 0.004), (cx, by - 0.05, 0.0028), (cx - 0.02, ey + 0.01, 0.0026),
                               (cx - 0.07, ey, 0.0026), (X0 - 0.03, ey - 0.002, 0.003), (X0 - 0.12, ey + 0.02, -0.01), (X0 - 0.40, ey + 0.10, -0.03)],
                 0.0011, M['fibre'])
    return parts


def upright():
    """The root that stands the module up as it is in LHCb; everything is parented to it."""
    from mathutils import Matrix
    root = bpy.data.objects.new('upright', None)
    bpy.context.collection.objects.link(root)
    root.matrix_world = Matrix(UPRIGHT).to_4x4()
    for o in bpy.data.objects:
        if o is not root and o.parent is None:
            o.parent = root
    return root


# ---- light, camera, world -----------------------------------------------------------------
# (all in the module's frame: the root stands them up with it)
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
    # a light's -Z toward its aim, its Y along the module's -y (up, once stood up)
    o.rotation_euler = (Vector(aim) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    return o


def studio(sc, flag):
    w = bpy.data.worlds.new('dark')
    w.use_nodes = True
    w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.0, 0.0, 0.0, 1)
    sc.world = w
    fx, fy = flag[0], flag[1]
    # a product shot on a dark set: one large softbox above the module's end and out in
    # front, where the metal faces reflect it toward the camera (their sheen); a raking
    # light from above along the face; a cool rim (the deck's light blue) from the side;
    # almost no fill
    light('soft', 'AREA', (fx + 0.38, -0.22, 0.24), (fx, 0.02, 0.0), 6.0, (1.0, 0.97, 0.93), 0.5, 0.18)
    light('rake', 'AREA', (fx - 0.10, -0.40, 0.035), (fx, 0.10, 0.0), 2.2, (1.0, 0.95, 0.88), 0.3, 0.05)
    light('rim', 'AREA', (fx - 0.45, -0.05, 0.08), (fx, 0.0, 0.01), 2.2, (0.61, 0.77, 1.0), 0.4, 0.12)
    light('fill', 'AREA', (fx - 0.5, 0.35, 0.40), (fx, 0.0, 0.0), 0.15, (1.0, 0.88, 0.75), 0.5, 0.5)
    # one large, dim panel in front: a soft gradient in the satin metal, so it reads as metal
    light('panel', 'AREA', (fx - 0.15, 0.25, 0.55), (fx, -0.02, 0.0), 1.2, (0.95, 0.97, 1.0), 1.2, 1.2)


def camera(sc, flag):
    d = bpy.data.cameras.new('cam')
    d.sensor_fit = 'VERTICAL'
    d.angle_y = math.radians(VFOV)
    d.dof.use_dof = True
    d.dof.aperture_fstop = 8.0
    d.clip_start, d.clip_end = 0.003, 20
    o = bpy.data.objects.new('cam', d)
    bpy.context.collection.objects.link(o)
    sc.camera = o
    aim = bpy.data.objects.new('aim', None)
    bpy.context.collection.objects.link(aim)
    # the camera's up is the world's up (the module's -y once stood up)
    t = o.constraints.new('TRACK_TO')
    t.target, t.track_axis, t.up_axis = aim, 'TRACK_NEGATIVE_Z', 'UP_Y'
    d.dof.focus_object = aim
    fx, fy = flag[0], flag[1]
    # the module's end as the drawing shows it (all four blocks, the flex cables, both
    # boards), in to the third block as the laser starts, close on the flag while it
    # writes, then back a little so the board below shares the last frame
    keys = [(1, (fx - 0.16, 0.30, 0.44), (fx - 0.10, 0.03, 0.0)),
            (T_ENGRAVE[0] - 5, (fx - 0.03, 0.12, 0.16), (fx, fy + 0.01, BOX_Z)),
            (T_ENGRAVE[0] + 60, (fx, 0.022, 0.072), (fx, fy + 0.004, BOX_Z)),
            (T_ENGRAVE[1] + 15, (fx, 0.020, 0.070), (fx, fy + 0.004, BOX_Z)),
            (T_END - 15, (fx, 0.029, 0.093), (fx, fy + 0.012, BOX_Z)),
            (T_END, (fx, 0.029, 0.093), (fx, fy + 0.012, BOX_Z))]
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
    """The marking spot, keyed frame by frame along the raster the material uses (top line
    first, from the module's end down), and a spray of sparks. No beam: a marking laser's
    is infrared and invisible; the spot and the sparks show where it writes."""
    cx, cy, w = face
    h = w * 3 / 5
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.00028, segments=16, ring_count=8)
    spot = bpy.context.object
    spot.name = 'spot'
    spot.data.materials.append(emitter('spot', (1.0, 0.93, 0.82), 80))
    pl = bpy.data.lights.new('spotlight', 'POINT')
    pl.energy, pl.color, pl.shadow_soft_size = 0.08, (1.0, 0.78, 0.5), 0.0004
    plo = bpy.data.objects.new('spotlight', pl)
    bpy.context.collection.objects.link(plo)
    plo.parent = spot
    plo.location = (0, 0, 0.0015)
    for f in range(1, T_END + 1):
        on = t0 <= f <= t1
        p = (f - t0) / (t1 - t0) * ROWS if on else 0
        k = min(int(p), ROWS - 1)
        a = p - k
        uu = a if k % 2 == 0 else 1 - a
        vv = (k + 0.5) / ROWS
        x, y = cx - w / 2 + uu * w, cy - h / 2 + vv * h
        spot.location = (x, y, BOX_Z + 0.0002)
        spot.keyframe_insert('location', frame=f)
        for o in (spot, plo):
            o.hide_render = not on
            o.keyframe_insert('hide_render', frame=f)
    for o in (spot, plo):
        for fc in o.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = 'CONSTANT' if fc.data_path == 'hide_render' else 'LINEAR'
    sparks(spot, t0, t1)
    return spot


def sparks(spot, t0, t1):
    """Sparks thrown off the face and falling down it (the module stands upright)."""
    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.00008, subdivisions=1, location=(0, 0, -5))
    g = bpy.context.object
    g.name = 'spark'
    g.data.materials.append(emitter('spark', (1.0, 0.72, 0.42), 160))
    ps = spot.modifiers.new('sparks', 'PARTICLE_SYSTEM').particle_system
    s = ps.settings
    s.count = 900
    s.frame_start, s.frame_end = t0, t1
    s.lifetime, s.lifetime_random = 4, 0.5
    s.emit_from = 'VERT'
    s.normal_factor = 0.0
    s.object_align_factor = (0, 0, 0.35)
    s.factor_random = 0.22
    s.effector_weights.gravity = 1.0
    s.render_type = 'OBJECT'
    s.instance_object = g
    s.particle_size, s.size_random = 1.0, 0.6
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
    # the neutral product-render transform: it keeps the flag's hues where AgX greys them
    sc.view_settings.view_transform = 'Khronos PBR Neutral'
    sc.view_settings.look = 'None'
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
    g.threshold = 6.0
    g.size = 6
    nt.links.new(rl.outputs['Image'], g.inputs['Image'])
    nt.links.new(g.outputs['Image'], comp.inputs['Image'])


# ---- the hand-over to the stage -------------------------------------------------------------
# Blender (X, Y, Z) -> the stage's frame (x along the beam, y up, z across): the module's face
# (Blender -Y) looks upstream (-x), its end (Blender +Z) is up (+y)
def to_stage(v):
    return [v[1], v[2], v[0]]


def handover(sc, cam, aim, face, meta, depth):
    """The last frame's camera and depth for the stage (setup/LisTakeover.vue): the camera's
    origin, right, up and forward, and the flag's centre, as vectors from the flag in the
    stage's frame (metres); and the planar depth of each of 480x270 pixels, by ray casts."""
    import struct
    import zlib
    sc.frame_set(T_END)
    dg = bpy.context.evaluated_depsgraph_get()
    mw = cam.matrix_world
    root = bpy.data.objects['upright']
    flag = root.matrix_world @ Vector((face[0], face[1], BOX_Z))
    O = mw.translation
    R = mw.to_3x3() @ Vector((1, 0, 0))
    U = mw.to_3x3() @ Vector((0, 1, 0))
    F = mw.to_3x3() @ Vector((0, 0, -1))
    rw, rh = sc.render.resolution_x, sc.render.resolution_y
    tanv = math.tan(math.radians(VFOV) / 2)
    aspect = rw / rh
    W, H = 480, 270
    zs = []
    for j in range(H):
        for i in range(W):
            nx = (i + 0.5) / W * 2 - 1
            ny = 1 - (j + 0.5) / H * 2
            d = (F + R * (nx * tanv * aspect) + U * (ny * tanv)).normalized()
            o0, z = O, 0.0
            for _ in range(6):   # through what never renders (the boolean cutters, the hidden laser)
                hit, loc, _n, _i, ob, _m = sc.ray_cast(dg, o0, d)
                if not hit:
                    break
                if not ob.hide_render:
                    z = (loc - O).dot(F)
                    break
                o0 = loc + d * 1e-5
            zs.append(z)
    lit = [z for z in zs if z > 0]
    z0, z1 = min(lit), max(lit)
    rows = []
    for j in range(H):
        row = bytearray([0])
        for i in range(W):
            z = zs[j * W + i]
            q = 0 if z <= 0 else 1 + int((z - z0) / (z1 - z0) * 65533)
            row += bytes((q >> 8, q & 255, 0))
        rows.append(bytes(row))
    raw = zlib.compress(b''.join(rows), 9)
    chunk = lambda t, d_: struct.pack('>I', len(d_)) + t + d_ + struct.pack('>I', zlib.crc32(t + d_) & 0xffffffff)
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', W, H, 8, 2, 0, 0, 0)) + chunk(b'IDAT', raw) + chunk(b'IEND', b'')
    open(depth, 'wb').write(png)
    rel = lambda v: to_stage(v - flag)
    json.dump({'origin': rel(O), 'right': to_stage(R), 'up': to_stage(U), 'forward': to_stage(F),
               'aim': rel(aim.matrix_world.translation), 'flagDist': (O - flag).length,
               'vfov': VFOV, 'aspect': aspect, 'depth': {'w': W, 'h': H, 'near': z0, 'far': z1, 'zero': 'no hit'},
               'frame': T_END, 'fps': FPS},
              open(meta, 'w'), indent=1)


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
    blk.data.materials.append(engraved(M['box'], face, *T_ENGRAVE, T_COOL, tuple(blk.location)))
    studio(sc, face)
    cam, aim = camera(sc, face)
    laser(face, *T_ENGRAVE)
    upright()
    render_setup(sc, a)
    if a.meta:
        handover(sc, cam, aim, face, a.meta, a.depth or a.meta.rsplit('.', 1)[0] + '.depth.png')
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
