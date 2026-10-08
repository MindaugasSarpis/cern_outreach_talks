import json, math, sys
coast, borders, out = sys.argv[1], sys.argv[2], sys.argv[3]
LON0, LAT0, K = 10.0, 50.0, math.cos(math.radians(52))
BB = (-11.5, 34.5, 34.0, 63.0)   # lon_min, lat_min, lon_max, lat_max
def proj(lon, lat): return ((lon - LON0) * K, -(lat - LAT0))
def lines(path):
    d = json.load(open(path))
    for f in d['features']:
        g = f['geometry']
        parts = g['coordinates'] if g['type'] == 'MultiLineString' else [g['coordinates']]
        for p in parts: yield p
def sample(path, step):
    pts = []
    for line in lines(path):
        for (a, b) in zip(line, line[1:]):
            inside = lambda q: BB[0] <= q[0] <= BB[2] and BB[1] <= q[1] <= BB[3]
            if not (inside(a) or inside(b)): continue
            ax, az = proj(*a); bx, bz = proj(*b)
            L = math.hypot(bx - ax, bz - az); n = max(1, int(L / step))
            for i in range(n):
                t = i / n; pts.append((round(ax + (bx - ax) * t, 3), round(az + (bz - az) * t, 3)))
    return pts
c = sample(coast, 0.07); b = sample(borders, 0.3)
json.dump({'proj': {'lon0': LON0, 'lat0': LAT0, 'k': round(K, 6), 'note': 'x = (lon - lon0) * k, z = -(lat - lat0); one unit = one degree of latitude'},
           'coast': [v for p in c for v in p], 'borders': [v for p in b for v in p]}, open(out, 'w'), separators=(',', ':'))
print(len(c), len(b))
