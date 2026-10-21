"""The globe for Innoday's slide 11 (setup/globe.js), from Natural Earth (public domain,
v5.1.2 GeoJSON from github.com/nvkelso/natural-earth-vector) and a list of LHCb institutes.

    python3 -I globe_map.py <dir with ne_50m_coastline, ne_110m_land .geojson> <institutes.json> <out.json>

coast: Natural Earth 1:50m coastlines, simplified (Douglas-Peucker, 0.08 deg), as flat
[lon, lat, lon, lat, ...] in tenths of a degree. land: points spread evenly over the land
of Natural Earth 1:110m (seeded), the continents' faint fill, in tenths of a degree.
inst: the institutes' places [lon, lat] in hundredths of a degree, `v` 1 for Vilnius;
several institutes in one city share a place (`n` how many, `i` their names and cities).
"""
import json, math, random, sys


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


def polys(geom):
    return [geom['coordinates']] if geom['type'] == 'Polygon' else geom['coordinates']


def pip(x, y, ring):
    c = False
    for i in range(len(ring)):
        (x1, y1), (x2, y2) = ring[i - 1], ring[i]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: c = not c
    return c


def main(src, inst_path, dst):
    rd = lambda n: json.load(open(f'{src}/{n}.geojson', encoding='utf-8'))['features']
    coast = []
    nv = 0
    for f in rd('ne_50m_coastline'):
        for line in lines_of(f['geometry']):
            pts = dp([tuple(p[:2]) for p in line], 0.08)
            if len(pts) < 2: continue
            nv += len(pts)
            coast.append([round(v * 10) for p in pts for v in p])
    # the land's fill: points even over the sphere, kept where they fall on land
    rings = []
    for f in rd('ne_110m_land'):
        for poly in polys(f['geometry']):
            r = poly[0]
            xs, ys = [p[0] for p in r], [p[1] for p in r]
            rings.append((min(xs), max(xs), min(ys), max(ys), r))
    rng = random.Random(11)
    land = []
    while len(land) < 9000 * 2:
        z = rng.uniform(-1, 1); lon = rng.uniform(-180, 180); lat = math.degrees(math.asin(z))
        for x0, x1, y0, y1, r in rings:
            if x0 <= lon <= x1 and y0 <= lat <= y1 and pip(lon, lat, r):
                land += [round(lon * 10), round(lat * 10)]
                break
    d = json.load(open(inst_path, encoding='utf-8'))
    places = {}
    for i in d['institutes']:
        key = (round(i['lon'], 1), round(i['lat'], 1))
        p = places.setdefault(key, {'p': [round(i['lon'] * 100), round(i['lat'] * 100)], 'n': 0, 'c': i.get('iso3') or i.get('country')})
        p['n'] += 1
        p.setdefault('i', []).append(i['name'] + ', ' + i['city'])
        if 'vilnius' in (i.get('city') or '').lower(): p['v'] = 1
    inst = sorted(places.values(), key=lambda p: -p['n'])
    out = {
        'about': 'coast: Natural Earth 1:50m coastlines v5.1.2; land: points on Natural Earth 1:110m land '
                 '(both public domain); tenths of a degree, [lon, lat]. inst: LHCb institutes\' cities, '
                 'hundredths of a degree, n institutes at a place, v Vilnius. Institutes: ' + d.get('source', '?')
                 + ' (retrieved ' + d.get('retrieved', '?') + '); ' + d.get('geocoding', ''),
        'coast': coast, 'land': land, 'inst': inst,
        'count': {'institutes': len(d['institutes']), 'places': len(inst),
                  'countries': len({i.get('iso3') or i.get('country') for i in d['institutes']})},
    }
    s = json.dumps(out, separators=(',', ':'), ensure_ascii=False)
    open(dst, 'w', encoding='utf-8').write(s)
    print(f'{dst}: {len(s)} bytes, {len(coast)} coast lines, {nv} vertices, {len(land) // 2} land points, '
          f'{len(inst)} places, count {out["count"]}')


if __name__ == '__main__':
    main(*sys.argv[1:4])
