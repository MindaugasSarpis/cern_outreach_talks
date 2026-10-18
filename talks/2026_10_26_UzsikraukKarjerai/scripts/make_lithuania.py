import json, math, sys
# Lithuania's outline for slide 13, in europe.json's projection (scripts/make_europe.py).
# python3 -I make_lithuania.py ne_50m_admin_0_countries.geojson public/data/lithuania.json
countries, out = sys.argv[1], sys.argv[2]
LON0, LAT0, K = 10.0, 50.0, math.cos(math.radians(52))
def proj(lon, lat): return ((lon - LON0) * K, -(lat - LAT0))
f = next(f for f in json.load(open(countries))['features'] if f['properties'].get('ADM0_A3') == 'LTU')
g = f['geometry']
polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
pts = []
for poly in polys:
    ring = poly[0]   # the outer ring
    for (a, b) in zip(ring, ring[1:]):
        ax, az = proj(*a); bx, bz = proj(*b)
        L = math.hypot(bx - ax, bz - az); n = max(1, int(L / 0.03))
        for i in range(n):
            t = i / n; pts.append((round(ax + (bx - ax) * t, 3), round(az + (bz - az) * t, 3)))
json.dump({'proj': {'lon0': LON0, 'lat0': LAT0, 'k': round(K, 6), 'note': "Natural Earth 1:50m admin 0, Lithuania's outer rings"},
           'coast': [v for p in pts for v in p], 'borders': []}, open(out, 'w'), separators=(',', ':'))
print(len(pts))
