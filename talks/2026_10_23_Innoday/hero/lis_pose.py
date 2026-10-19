"""The stage pose of the light injection clip's last view, for the deck's
frontmatter: the clip slide's `space` and path[0] on „Ačiū“ (setup/LisTakeover.vue).

  python3 talks/2026_10_23_Innoday/hero/lis_pose.py talks/2026_10_23_Innoday/setup/data/lis.json \\
      [--anchor 3.975,-476.94,0.96] [--d0 2.4]

The clip's camera stood META.flagDist metres from the flag; the stage's stands d0
units from the anchor (the flag's place in LHCb) on the same line, so the grains
start at d0 / flagDist units a metre. Pose: position = at + dist (sin yaw cos pitch,
sin pitch, cos yaw cos pitch), as slidev-addon-stage places its camera.
"""
import argparse
import json
import math

a = argparse.ArgumentParser()
a.add_argument('meta')
a.add_argument('--anchor', default='3.975,-476.94,0.96')
a.add_argument('--d0', type=float, default=2.4)
x = a.parse_args()
m = json.load(open(x.meta))
A = [float(v) for v in x.anchor.split(',')]
s0 = x.d0 / m['flagDist']
cam = [A[i] + s0 * m['origin'][i] for i in range(3)]
at = [A[i] + s0 * m['aim'][i] for i in range(3)]
d = [cam[i] - at[i] for i in range(3)]
dist = math.sqrt(sum(v * v for v in d))
yaw = math.degrees(math.atan2(d[0], d[2]))
pitch = math.degrees(math.asin(d[1] / dist))
r = lambda v, n=3: round(v, n)
print(f'{{ at: [{r(at[0])}, {r(at[1])}, {r(at[2])}], dist: {r(dist)}, yaw: {r(yaw, 2)}, pitch: {r(pitch, 2)} }}')
print(f'# scale at the start: {s0:.2f} units a metre; camera at {[r(v) for v in cam]}')
