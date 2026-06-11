#!/usr/bin/env bash
# ============================================================
# build-map.sh
# Packages the national 2026 district GeoJSON as a TopoJSON
# for the district-guess game.
#
# Input:  createMaps/national/output/national-cd-2026.geojson
# Output: districts.topojson  (served alongside index.html)
#   Layers:
#     districts  – 435 district polygons with all properties
#     states     – state boundaries (dissolved from districts)
#     points     – one inner point per district (inside the polygon)
#     urban      – Census TIGER 2020 urbanized areas
#     roads      – simplified road network
#
# Requires: mapshaper ≥ 0.6, python3
#
# Usage:
#   bash build-map.sh
#   SIMPLIFY=0.5% bash build-map.sh
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CREATEMAPS="$(cd "$SCRIPT_DIR/../../../createMaps" && pwd)"

DISTRICTS_SRC="$CREATEMAPS/national/output/national-cd-2026.geojson"
URBAN_SRC="$CREATEMAPS/us-urban.json"
ROADS_SRC="$CREATEMAPS/us_can_roads.json"
OUT="$SCRIPT_DIR/districts.topojson"

SIMPLIFY="${SIMPLIFY:-10%}"

echo "=== district-guess map builder ==="
echo "  Input:    $DISTRICTS_SRC"
echo "  Simplify: $SIMPLIFY"
echo "  Output:   $OUT"
echo ""

if [ ! -f "$DISTRICTS_SRC" ]; then
  echo "ERROR: $DISTRICTS_SRC not found."
  echo "  Run createMaps/national/build_national.sh first."
  exit 1
fi

# Use a temp directory so files can have proper .json extensions
# (macOS mktemp does not support filename suffixes like file_XXXXXX.json)
TMPWORK="$(mktemp -d /tmp/build_map_XXXXXX)"
DISTRICTS_SIMPLE="$TMPWORK/districts.json"
STATES="$TMPWORK/states.json"
POINTS="$TMPWORK/points.json"
URBAN_SIMPLE="$TMPWORK/urban.json"
ROADS_FC="$TMPWORK/roads_fc.json"
ROADS_SIMPLE="$TMPWORK/roads.json"

cleanup() { rm -rf "$TMPWORK"; }
trap cleanup EXIT

# ── Districts: simplify ───────────────────────────────────────────────────────
echo "Step 1/5  Simplifying districts..."
mapshaper "$DISTRICTS_SRC" name=districts \
  -simplify "$SIMPLIFY" keep-shapes \
  -o "$DISTRICTS_SIMPLE"

# ── States: dissolve districts by state ──────────────────────────────────────
echo "Step 2/5  Dissolving state boundaries..."
mapshaper "$DISTRICTS_SIMPLE" name=districts \
  -dissolve state name=states \
  -o "$STATES"

# ── Inner points: one per district, guaranteed inside polygon ─────────────────
echo "Step 3/5  Computing inner points..."
mapshaper "$DISTRICTS_SIMPLE" name=districts \
  -points inner \
  -o "$POINTS"

# ── Urban areas ───────────────────────────────────────────────────────────────
echo "Step 4/5  Simplifying urban areas and roads..."
mapshaper "$URBAN_SRC" name=urban \
  -simplify "$SIMPLIFY" keep-shapes \
  -filter-fields 'NAME20,GEOID20' \
  -o "$URBAN_SIMPLE"

# Roads: convert GeometryCollection → FeatureCollection, then simplify
python3 - "$ROADS_SRC" "$ROADS_FC" <<'PYEOF'
import json, sys
with open(sys.argv[1]) as f:
    data = json.load(f)
if data.get('type') == 'GeometryCollection':
    features = [{'type': 'Feature', 'properties': {}, 'geometry': g}
                for g in data.get('geometries', [])]
elif data.get('type') == 'FeatureCollection':
    features = data['features']
else:
    features = []
fc = {'type': 'FeatureCollection', 'features': features}
with open(sys.argv[2], 'w') as f:
    json.dump(fc, f)
print(f"  Roads: {len(features)} geometries ready.")
PYEOF

mapshaper "$ROADS_FC" name=roads \
  -simplify "$SIMPLIFY" \
  -o "$ROADS_SIMPLE"

# ── Combine all layers into one TopoJSON ─────────────────────────────────────
echo "Step 5/5  Building TopoJSON..."
mapshaper \
  -i "$DISTRICTS_SIMPLE" "$STATES" "$POINTS" "$URBAN_SIMPLE" "$ROADS_SIMPLE" combine-files \
  -rename-layers districts,states,points,urban,roads \
  -o "$OUT" format=topojson no-quantization

echo ""
SIZE=$(du -sh "$OUT" | cut -f1)
echo "Done → $OUT  ($SIZE)"
echo ""
echo "Layers:"
python3 - "$OUT" <<'PYEOF'
import json, sys
with open(sys.argv[1]) as f:
    topo = json.load(f)
for name, obj in topo.get('objects', {}).items():
    n = len(obj.get('geometries', []))
    print(f"  {name:<14} {n} geometries")
PYEOF
