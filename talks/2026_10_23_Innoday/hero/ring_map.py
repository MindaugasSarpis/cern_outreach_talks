"""The map under the close's last view („Ačiū“): `map` of the `ring` object `lhcRing` in
public/data/space.json (setup/emblems.js), public/data/ring_map.json, after CERN's FCC schematic (owner, 22 Oct:
"For the last one, can you use something like this? Now the SPS is weirdly connected
to lhc", with CERN's 2014 map of the LHC, the FCC's dashed ring, Lake Geneva, the Jura,
the Salève and the border).

    python3 -I ring_map.py <src dir> public/data/ring_map.json

<src dir> holds what was fetched on 22 Oct 2026:
  tun.json    OpenStreetMap (ODbL), Overpass `out geom`: relation 9512017 (the LHC),
              ways 66473762 (SPS), 174646428 (PS), 317804188 + 685422590 (TI 2),
              317804189 + 685422588 (TI 8), 317804190 (TT2/TT10), 685422598 (LHC
              insertion 8: LHCb)
  ridge.json  OpenStreetMap natural=ridge (the Salève, the Vuache, the Mandallaz, the Voirons)
  peaks.json  OpenStreetMap natural=peak in 46.1-46.5 N, 5.8-6.2 E (the Jura's crest)
  ne_10m_lakes.geojson, ne_10m_admin_0_boundary_lines_land.geojson,
  ne_10m_rivers_lake_centerlines.geojson   Natural Earth v5.1.2 (public domain)

Everything goes to km east and north of the LHC's centre (a circle fitted to the
tunnel; equirectangular at its latitude), which the builder turns so that Point 8
(LHCb) falls on the detector's vertex. The SPS, the PS and the transfer lines are the
tunnels' own lines, so they meet the LHC where they really do (TI 2 at Point 2, TI 8 at
Point 8), leaving the SPS along it. The FCC (90.7 km, cern-fcc-study) is a circle of
that length fitted to its eight surface sites (cern-fcc-sites: Ferney-Voltaire,
Présinge, Nangy, Éteaux, Charvonnex/Groisy, Cercier, Vulbens/Dingy-en-Vuache, Challex;
the sites at their communes' centres, so ±1 km): dashed, as CERN draws a proposed ring.
It prints the last view's pose (looking straight down with north up, the LHC and the
whole FCC in the 16:9 frame) and the LHCb logo's place over it.
"""
import json, math, random, sys

random.seed(22)
STATION = (0.0, -480.0, 0.0)   # the `thanks` station: Point 8 at its origin
R_UNITS = 20.0                 # the ring builder's `radius`: the LHC's in world units
FCC_C = 90.7                   # km (cern-fcc-study)
SITES = {   # the FCC's surface sites, at their communes (lat, lon)
    'PA': (46.256, 6.108), 'PB': (46.219, 6.256), 'PD': (46.150, 6.300), 'PF': (46.068, 6.288),
    'PG': (46.012, 6.170), 'PH': (46.019, 5.998), 'PJ': (46.110, 5.937), 'PL': (46.185, 5.977),
}
JURA = ['Crêt de Chenay', 'Crêt de la Goutte', "Crêt de l'Éguillon", 'Brie', 'Le Reculet', 'Crêt de la Neige',
        'Grand Crêt', 'Montoisey', 'Colomby de Gex', 'Grand Monrond', 'Petit Montrond', 'Le Turet', 'La Dôle']
RIDGES = ['Le Salève', 'Le Vuache', 'La Mandallaz', 'Les Voirons']
BOX = (-46.0, -42.0, 46.0, 16.0)   # km (x0, y0, x1, y1): what the last view can show
FOV, ASPECT = 50.0, 16 / 9


def fit_circle(pts):
    # algebraic (Kåsa) fit: x² + y² + D x + E y + F = 0
    n = len(pts)
    sx = sum(p[0] for p in pts); sy = sum(p[1] for p in pts)
    sxx = sum(p[0] ** 2 for p in pts); syy = sum(p[1] ** 2 for p in pts); sxy = sum(p[0] * p[1] for p in pts)
    sz = [p[0] ** 2 + p[1] ** 2 for p in pts]
    szx = sum(z * p[0] for z, p in zip(sz, pts)); szy = sum(z * p[1] for z, p in zip(sz, pts)); szs = sum(sz)
    A = [[sxx, sxy, sx], [sxy, syy, sy], [sx, sy, n]]
    b = [-szx, -szy, -szs]
    # Cramer
    det = lambda m: (m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
                     + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]))
    d = det(A)
    sol = []
    for i in range(3):
        m = [row[:] for row in A]
        for r in range(3): m[r][i] = b[r]
        sol.append(det(m) / d)
    D, E, F = sol
    cx, cy = -D / 2, -E / 2
    return cx, cy, math.sqrt(cx * cx + cy * cy - F)


def main(src, dst):
    tun = {e['id']: e for e in json.load(open(f'{src}/tun.json', encoding='utf-8'))['elements']}
    lhc = tun[9512017]
    ll = [(p['lat'], p['lon']) for m in lhc['members'] for p in m.get('geometry', [])]
    lat0 = sum(p[0] for p in ll) / len(ll); lon0 = sum(p[1] for p in ll) / len(ll)
    kx, ky = 111.32 * math.cos(math.radians(lat0)), 110.57
    xy0 = lambda lat, lon: ((lon - lon0) * kx, (lat - lat0) * ky)
    cx, cy, r = fit_circle([xy0(*p) for p in ll])
    km = lambda lat, lon: (round(xy0(lat, lon)[0] - cx, 3), round(xy0(lat, lon)[1] - cy, 3))
    p8 = tun[685422598]['geometry']; p8 = km(sum(p['lat'] for p in p8) / len(p8), sum(p['lon'] for p in p8) / len(p8))
    bearing = math.degrees(math.atan2(p8[1], p8[0]))
    print(f'# the LHC: r {r:.3f} km ({2 * math.pi * r:.2f} km round), Point 8 at {p8} km, bearing {bearing:.1f}°')
    way = lambda *ids: [km(p['lat'], p['lon']) for i in ids for p in tun[i]['geometry']]

    # the FCC: a circle of 90.7 km through its sites (least squares on the centre)
    sites = [km(*v) for v in SITES.values()]
    rf = FCC_C / (2 * math.pi)
    fx, fy = sum(p[0] for p in sites) / 8, sum(p[1] for p in sites) / 8
    for _ in range(4000):   # gradient steps on Σ(|p - c| - rf)²
        gx = gy = 0.0
        for p in sites:
            d = math.hypot(p[0] - fx, p[1] - fy); e = d - rf
            gx -= e * (p[0] - fx) / d; gy -= e * (p[1] - fy) / d
        fx -= 0.05 * gx; fy -= 0.05 * gy
    res = [math.hypot(p[0] - fx, p[1] - fy) - rf for p in sites]
    print(f'# the FCC: centre ({fx:.2f}, {fy:.2f}) km, r {rf:.3f}; the sites off it by {", ".join(f"{v:+.1f}" for v in res)} km')

    def inbox(p): return BOX[0] <= p[0] <= BOX[2] and BOX[1] <= p[1] <= BOX[3]

    def cut(line):
        # the runs of a line inside BOX
        out, cur = [], []
        for p in line:
            if inbox(p): cur.append(p)
            elif cur:
                if len(cur) > 1: out.append(cur)
                cur = []
        if len(cur) > 1: out.append(cur)
        return out

    def coords(g):
        t = g['type']
        if t in ('LineString',): return [g['coordinates']]
        if t in ('MultiLineString', 'Polygon'): return g['coordinates']
        if t == 'MultiPolygon': return [ring for poly in g['coordinates'] for ring in poly]
        return []

    def thin(line, step=0.25):
        # drop points closer than `step` km to the last kept (Natural Earth's are dense enough)
        out = [line[0]]
        for p in line[1:]:
            if math.hypot(p[0] - out[-1][0], p[1] - out[-1][1]) >= step: out.append(p)
        if out[-1] != line[-1]: out.append(line[-1])
        return out

    lake_poly = []
    for f in json.load(open(f'{src}/ne_10m_lakes.geojson', encoding='utf-8'))['features']:
        if f['properties'].get('name') == 'Lake Geneva':
            for ring in coords(f['geometry']):
                lake_poly.append(thin([km(lat, lon) for lon, lat in ring]))
    border = []
    for f in json.load(open(f'{src}/ne_10m_admin_0_boundary_lines_land.geojson', encoding='utf-8'))['features']:
        names = {f['properties'].get('ADM0_A3_L'), f['properties'].get('ADM0_A3_R')}
        if names == {'FRA', 'CHE'}:
            for line in coords(f['geometry']):
                border += cut(thin([km(lat, lon) for lon, lat in line]))
    rivers = []
    for f in json.load(open(f'{src}/ne_10m_rivers_lake_centerlines.geojson', encoding='utf-8'))['features']:
        if f['properties'].get('name') in ('Rhône', 'Rhne', 'Arve'):
            for line in coords(f['geometry']):
                rivers += cut(thin([km(lat, lon) for lon, lat in line]))
    ridges = []
    for e in json.load(open(f'{src}/ridge.json', encoding='utf-8'))['elements']:
        if e['tags'].get('name') in RIDGES:
            ridges.append([km(p['lat'], p['lon']) for p in e['geometry']])
    peaks = {e['tags'].get('name'): (e['lat'], e['lon']) for e in json.load(open(f'{src}/peaks.json', encoding='utf-8'))['elements']}
    ridges.append([km(*peaks[n]) for n in JURA])

    # (the grains' light goes as (colour × alpha)^2.2: an alpha of 0.3 is 7 % of the light)
    blue, pale, warm = '#9cc4ff', '#cfe2ff', '#ffb054'
    rings = [
        # the FCC: dashed, warm, as CERN's map draws it
        {'c': [round(fx, 3), round(fy, 3)], 'r': round(rf, 3), 'grains': 18000, 'alpha': 1.0, 'color': warm, 'dash': 72, 'width': 0.12},
    ]
    lines = [
        {'pts': way(66473762), 'grains': 3000, 'alpha': 0.75, 'color': pale, 'width': 0.03},   # the SPS
        {'pts': way(174646428), 'grains': 500, 'alpha': 0.7, 'color': pale, 'width': 0.01},    # the PS
        {'pts': way(317804188, 685422590), 'grains': 900, 'alpha': 0.5, 'color': pale, 'width': 0.02},   # TI 2 → Point 2
        {'pts': way(317804189, 685422588), 'grains': 900, 'alpha': 0.5, 'color': pale, 'width': 0.02},   # TI 8 → Point 8
        {'pts': way(317804190), 'grains': 300, 'alpha': 0.5, 'color': pale, 'width': 0.02},   # TT2/TT10: the PS → the SPS
    ]
    for l in border:
        lines.append({'pts': l, 'grains': max(120, int(len(l) * 90)), 'alpha': 0.75, 'color': '#d8dde6', 'width': 0.04, 'dash': max(4, int(len(l) * 1.6))})
    for l in rivers:
        lines.append({'pts': l, 'grains': max(120, int(len(l) * 70)), 'alpha': 0.8, 'color': '#6f9fe0', 'width': 0.05})
    for l in lake_poly:
        for run in cut(l):
            lines.append({'pts': run, 'grains': 4000, 'alpha': 1.0, 'color': '#7fb0ff', 'width': 0.06})
    for l in ridges:
        lines.append({'pts': l, 'grains': 5000, 'alpha': 0.7, 'color': '#6fae78', 'width': 0.6})
    fills = [{'pts': l, 'grains': 26000, 'alpha': 1.0, 'color': '#4f86da', 'box': list(BOX)} for l in lake_poly]

    # the last view: straight down (pitch 89), north up, framing the LHC and the whole FCC
    rot = math.radians(-bearing)
    u = R_UNITS / r

    def world(x, y):
        X = x * math.cos(rot) - y * math.sin(rot); Y = x * math.sin(rot) + y * math.cos(rot)
        return (STATION[0] + Y * u, STATION[1], STATION[2] + (-1) * (R_UNITS - X * u))

    north = [a - b for a, b in zip(world(0, 1), world(0, 0))]
    yaw = math.degrees(math.atan2(-north[0], -north[2]))   # the screen's up, seen from above, is away from the camera
    x0, x1 = min(-r, fx - rf), max(r, fx + rf)
    y0, y1 = min(-r, fy - rf), max(r, fy + rf)
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    half_h = max((y1 - y0) / 2, (x1 - x0) / 2 / ASPECT) * 1.08 * u
    dist = half_h / math.tan(math.radians(FOV / 2))
    at = world(mx, my)
    pitch = 89.0
    print(f'# the frame: {x1 - x0:.1f} × {y1 - y0:.1f} km, its middle ({mx:.2f}, {my:.2f}) km')
    pose = dict(at=[round(v, 3) for v in at], dist=round(dist, 2), yaw=round(yaw, 2), pitch=pitch)
    print('RING =', json.dumps(pose))
    # where Point 8 and the LHC's centre fall, for the camera's distance (the ring's `far`)
    cam = [a + dist * d for a, d in zip(at, (math.sin(math.radians(yaw)) * math.cos(math.radians(pitch)), math.sin(math.radians(pitch)),
                                              math.cos(math.radians(yaw)) * math.cos(math.radians(pitch))))]
    print(f'# the camera {math.dist(cam, STATION):.1f} units from Point 8')

    out = {'km': round(r, 3), 'p8': round(bearing, 2), 'rings': rings, 'lines': lines, 'fills': fills}
    open(dst, 'w', encoding='utf-8').write(json.dumps(out, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(f'# the ring\'s `far`: {math.dist(cam, STATION):.1f}')
    n = sum(l['grains'] for l in lines) + sum(f['grains'] for f in fills) + sum(x['grains'] for x in rings)
    print(f'# {len(lines)} lines, {len(fills)} fills, {len(rings)} rings, {n} still grains')


if __name__ == '__main__':
    main(*sys.argv[1:3])
