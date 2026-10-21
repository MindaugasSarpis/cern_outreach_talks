"""Europe for Innoday's Part III map (setup/europe.js), from Natural Earth 1:50m
(public domain, v5.1.2 GeoJSON from github.com/nvkelso/natural-earth-vector).

    python3 -I europe_map.py <dir with the three .geojson> <out.json>

Coastlines and international land boundaries (the disputed, indefinite and
line-of-control classes left out), cropped to lon -13..46, lat 29..72 (Iceland
out), in a Lambert azimuthal equal-area projection centred at 15 E 52 N, in
whole km, north up. Lithuania's outline separately; CERN (Meyrin) as a point;
thread ends: points inside each CERN Member and Associate Member State on the
map (cern-members-2026), drawn at random (seeded) inside its largest polygon:
a picture of flow, not data.
"""
import json, math, random, sys

LON0, LAT0, R = math.radians(15), math.radians(52), 6371.0
BOX = (-13.0, 29.0, 46.0, 72.0)

MEMBERS = 'AUT BEL BGR CZE DNK EST FIN FRA DEU GRC HUN ISR ITA NLD NOR POL PRT ROU SRB SVK SVN ESP SWE CHE GBR'.split()
ASSOC = 'HRV CYP IRL LVA LTU TUR UKR'.split()   # the Associate Member States on this map
CERN = (6.0550, 46.2340)
LT_ENDS = [(25.28, 54.69), (23.90, 54.90)]   # Vilnius, Kaunas


def proj(lon, lat):
    l, p = math.radians(lon) - LON0, math.radians(lat)
    k = math.sqrt(2 / (1 + math.sin(LAT0) * math.sin(p) + math.cos(LAT0) * math.cos(p) * math.cos(l)))
    x = R * k * math.cos(p) * math.sin(l)
    y = R * k * (math.cos(LAT0) * math.sin(p) - math.sin(LAT0) * math.cos(p) * math.cos(l))
    return x, y


def inside(p):
    return BOX[0] <= p[0] <= BOX[2] and BOX[1] <= p[1] <= BOX[3]


def crop(line):
    out, cur = [], []
    for p in line:
        if inside(p):
            cur.append(p)
        else:
            if len(cur) > 1: out.append(cur)
            cur = []
    if len(cur) > 1: out.append(cur)
    return out


def dp(pts, tol):
    if len(pts) < 3: return pts
    keep = [False] * len(pts); keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        (ax, ay), (bx, by) = pts[a], pts[b]
        dx, dy = bx - ax, by - ay; L = math.hypot(dx, dy) or 1e-9
        best, bi = -1, -1
        for i in range(a + 1, b):
            d = abs(dy * (pts[i][0] - ax) - dx * (pts[i][1] - ay)) / L
            if d > best: best, bi = d, i
        if best > tol:
            keep[bi] = True; stack += [(a, bi), (bi, b)]
    return [p for p, k in zip(pts, keep) if k]


def lines_of(geom):
    if geom['type'] == 'LineString': return [geom['coordinates']]
    if geom['type'] == 'MultiLineString': return geom['coordinates']
    return []


def flat(pts):
    return [v for p in pts for v in (round(p[0]), round(p[1]))]


def polylines(features, tol, keep=lambda f: True):
    out = []
    for f in features:
        if not keep(f): continue
        for line in lines_of(f['geometry']):
            for part in crop(line):
                pts = dp([proj(*p) for p in part], tol)
                if len(pts) > 1: out.append(flat(pts))
    return out


def polys(geom):
    return [geom['coordinates']] if geom['type'] == 'Polygon' else geom['coordinates']


def area(ring):
    return 0.5 * abs(sum(ring[i][0] * ring[i - 1][1] - ring[i - 1][0] * ring[i][1] for i in range(len(ring))))


def pip(x, y, ring):
    c = False
    for i in range(len(ring)):
        (x1, y1), (x2, y2) = ring[i - 1], ring[i]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: c = not c
    return c


def main(src, dst):
    rd = lambda n: json.load(open(f'{src}/{n}.geojson', encoding='utf-8'))['features']
    coast = polylines(rd('ne_50m_coastline'), 2.5)
    border = polylines(rd('ne_50m_admin_0_boundary_lines_land'), 2.5,
                       lambda f: f['properties'].get('FEATURECLA') == 'International boundary (verify)')
    rng = random.Random(23)
    ends, lt = [], None
    for f in rd('ne_50m_admin_0_countries'):
        code = f['properties']['ADM0_A3']
        if code not in MEMBERS and code not in ASSOC: continue
        rings = [[proj(*p) for p in poly[0]] for poly in polys(f['geometry']) if all(inside(p) for p in poly[0])]
        if not rings: continue
        main_ring = max(rings, key=area)
        if code == 'LTU':
            h = len(main_ring) // 2   # a closed ring: simplified as two halves
            lt = flat(dp(main_ring[:h + 1], 1.0)[:-1] + dp(main_ring[h:], 1.0))
            for p in LT_ENDS: ends.append({'c': code, 'm': 0, 'p': [round(v) for v in proj(*p)]})
            continue
        A = area(main_ring)
        k = max(1, min(4, round(math.sqrt(A) / 260)))
        xs, ys = [p[0] for p in main_ring], [p[1] for p in main_ring]
        got, tries = [], 0
        while len(got) < k and tries < 20000:
            tries += 1
            x, y = rng.uniform(min(xs), max(xs)), rng.uniform(min(ys), max(ys))
            if not pip(x, y, main_ring): continue
            # keep a margin from the coast/border (a point well inside)
            if any(math.hypot(x - px, y - py) < min(40, math.sqrt(A) / 8) for px, py in main_ring[::2]): continue
            if any(math.hypot(x - gx, y - gy) < 180 for gx, gy in got): continue
            got.append((x, y))
        for x, y in got: ends.append({'c': code, 'm': 1 if code in MEMBERS else 0, 'p': [round(x), round(y)]})
    cx, cy = proj(*CERN)
    out = {
        'about': 'Natural Earth 1:50m v5.1.2 (public domain): coastlines, international land boundaries, '
                 'Lithuania; LAEA 15E 52N, km, north up; ends: points in CERN Member (m 1) and Associate '
                 'Member (m 0) States, a picture of flow, not data',
        'cern': [round(cx), round(cy)],
        'coast': coast, 'border': border, 'lt': lt, 'ends': ends,
    }
    s = json.dumps(out, separators=(',', ':'))
    open(dst, 'w').write(s)
    nv = sum(len(l) for l in coast + border) // 2
    print(f'{dst}: {len(s)} bytes, {len(coast)} coast, {len(border)} border lines, {nv} vertices, '
          f'{len(ends)} ends, lt {len(lt) // 2} vertices')
    xs = [v for l in coast for v in l[0::2]]; ys = [v for l in coast for v in l[1::2]]
    print('extent km', min(xs), max(xs), min(ys), max(ys), 'cern', out['cern'])


if __name__ == '__main__':
    main(*sys.argv[1:3])
