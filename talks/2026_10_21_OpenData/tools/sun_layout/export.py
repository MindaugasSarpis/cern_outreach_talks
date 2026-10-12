"""Put an anneal's result in place: the sun's axis, squash and items' `at` in space.json,
and the slide's target and distance in deck.md (the rest of both as they were).

  python3 export.py result.json [--name vilnius]"""
import argparse, json
import numpy as np
from layout import Sun

a = argparse.ArgumentParser()
a.add_argument('run'); a.add_argument('--name', default='vilnius')
args = a.parse_args()
r = json.load(open(args.run))
sun = Sun(args.name)
assert len(r['E']) == len(sun.o['items']), f"{len(r['E'])} ends in {args.run}, {len(sun.o['items'])} items in space.json"
line = sun.write(np.array(r['E']), r['g'])
print(f'space.json: {args.name} laid out; deck.md, line {sun.pose_line + 1}: {line}')
