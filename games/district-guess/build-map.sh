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
ACS_CSV="$CREATEMAPS/acs_by_district.csv"
OUT="$SCRIPT_DIR/districts.topojson"

SIMPLIFY="20%"
STATE_SVGS="$SCRIPT_DIR/state-svgs"

# ── State EPSG codes (from createMaps/compactness/compactness.sh) ─────────────
state_epsg() {
  case "$1" in
    AL) echo 2759 ;; AK) echo 3338 ;; AZ) echo 2762 ;; AR) echo 2764 ;;
    CA) echo 3311 ;; CO) echo 2773 ;; CT) echo 2775 ;; DE) echo 2776 ;;
    FL) echo 2777 ;; GA) echo 2780 ;; HI) echo 2784 ;; ID) echo 2788 ;;
    IL) echo 2790 ;; IN) echo 2792 ;; IA) echo 2794 ;; KS) echo 2796 ;;
    KY) echo 2798 ;; LA) echo 2800 ;; ME) echo 2802 ;; MD) echo 2804 ;;
    MA) echo 2805 ;; MI) echo 2808 ;; MN) echo 2811 ;; MS) echo 2813 ;;
    MO) echo 2816 ;; MT) echo 2818 ;; NE) echo 2819 ;; NV) echo 2821 ;;
    NH) echo 2823 ;; NJ) echo 2824 ;; NM) echo 2826 ;; NY) echo 2829 ;;
    NC) echo 3358 ;; ND) echo 2832 ;; OH) echo 2834 ;; OK) echo 2836 ;;
    OR) echo 2838 ;; PA) echo 3362 ;; RI) echo 2840 ;; SC) echo 3360 ;;
    SD) echo 2841 ;; TN) echo 2843 ;; TX) echo 2845 ;; UT) echo 2850 ;;
    VT) echo 2852 ;; VA) echo 2853 ;; WA) echo 2855 ;; WV) echo 2857 ;;
    WI) echo 2860 ;; WY) echo 2863 ;; *) echo "" ;;
  esac
}

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

# ── Compactness + area via R redist package ───────────────────────────────────
DISTRICTS_WITH_COMPACT="$TMPWORK/districts_compact.json"
echo "  Computing area, Polsby-Popper, and Reock via R redist..."
Rscript - "$DISTRICTS_SIMPLE" "$DISTRICTS_WITH_COMPACT" "$ACS_CSV" <<'REOF'
args <- commandArgs(trailingOnly = TRUE)
suppressPackageStartupMessages({
  library(sf)
  library(redistmetrics)
})

shp <- st_read(args[1], quiet = TRUE)
shp_proj <- st_transform(shp, 5070)   # NAD83 / Conus Albers (equal-area)
shp_proj <- st_make_valid(shp_proj)

# Each row is its own district; plans vector = 1:nrow
plans <- seq_len(nrow(shp_proj))

shp$area_sqmi     <- round(as.numeric(st_area(shp_proj)) / 2589988.11)
shp$polsby_popper <- round(comp_polsby(plans, shp_proj), 4)
shp$reock         <- round(comp_reock(plans, shp_proj), 4)

# R replaces hyphens in column names with dots — restore original name
names(shp)[names(shp) == "state.district"] <- "state-district"

# Adjacency: pipe-separated list of neighboring state-district keys
adj_touches <- sf::st_touches(shp, sparse = TRUE)
ids <- shp[["state-district"]]
shp$adj <- sapply(seq_along(adj_touches), function(i) {
  paste(ids[adj_touches[[i]]], collapse = "|")
})
cat(sprintf("  Adjacency computed for %d districts.\n", nrow(shp)))

# Join ACS data if CSV path provided and exists
if (length(args) >= 3 && file.exists(args[3])) {
  acs <- read.csv(args[3], stringsAsFactors = FALSE, check.names = FALSE)
  shp <- merge(shp, acs[, c("state-district","pop","income","medianHome",
                              "whiteNH","black","asian","hispanic","bach","master")],
               by = "state-district", all.x = TRUE)
  cat(sprintf("  ACS data joined for %d districts.\n", sum(!is.na(shp$pop))))
}

st_write(shp, args[2], driver = "GeoJSON", delete_dsn = TRUE, quiet = TRUE)
cat(sprintf("  area/PP/Reock written for %d districts.\n", nrow(shp)))
REOF
DISTRICTS_SIMPLE="$DISTRICTS_WITH_COMPACT"

# ── States: dissolve districts by state ──────────────────────────────────────
echo "Step 2/5  Dissolving state boundaries..."
mapshaper "$DISTRICTS_SIMPLE" name=districts \
  -dissolve state name=states \
  -o "$STATES"

# ── Inner points: one per district, guaranteed inside polygon ─────────────────
echo "Step 3/5  Computing inner points..."
mapshaper "$DISTRICTS_SIMPLE" name=districts \
  -points inner \
  -filter-fields state-district \
  -o "$POINTS"

# ── Urban areas ───────────────────────────────────────────────────────────────
echo "Step 4/5  Simplifying urban areas and roads..."
mapshaper "$URBAN_SRC" name=urban \
  -simplify 1% keep-shapes \
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
  -simplify 0.5% \
  -o "$ROADS_SIMPLE"

# ── Combine all layers into one TopoJSON ─────────────────────────────────────
echo "Step 5/5  Building TopoJSON..."

# Core file: districts + states + points (needed to start playing)
CORE_OUT="${OUT%.topojson}-core.topojson"
mapshaper \
  -i "$DISTRICTS_SIMPLE" "$STATES" "$POINTS" combine-files \
  -rename-layers districts,states,points \
  -o "$CORE_OUT" format=topojson

# Overlay file: urban + roads (decorative; lazy-loaded after game starts)
OVERLAY_OUT="${OUT%.topojson}-overlay.topojson"
mapshaper \
  -i "$URBAN_SIMPLE" "$ROADS_SIMPLE" combine-files \
  -rename-layers urban,roads \
  -o "$OVERLAY_OUT" format=topojson

# Legacy combined file (kept for backwards compatibility; uses quantization now)
mapshaper \
  -i "$CORE_OUT" "$OVERLAY_OUT" combine-files \
  -o "$OUT" format=topojson

echo ""
SIZE=$(du -sh "$OUT" | cut -f1)
CORE_SIZE=$(du -sh "$CORE_OUT" | cut -f1)
OVERLAY_SIZE=$(du -sh "$OVERLAY_OUT" | cut -f1)
echo "Done → $OUT  ($SIZE)"
echo "      → $CORE_OUT  ($CORE_SIZE)  [core — served first]"
echo "      → $OVERLAY_OUT  ($OVERLAY_SIZE)  [overlay — lazy-loaded]"
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

# ── State boundary SVGs: for gameover-grid and guess-icon-svg ────────────────
echo ""
echo "Step 6/6  Generating state boundary SVGs..."
mkdir -p "$STATE_SVGS"

# Extract states layer to GeoJSON
mapshaper "$STATES" name=states -o "$TMPWORK/states_extract.json"

python3 - "$TMPWORK/states_extract.json" "$STATE_SVGS" <<'PYEOF'
import json
import sys
import subprocess
import tempfile
import os
import math

states_file = sys.argv[1]
output_dir = sys.argv[2]

with open(states_file) as f:
    fc = json.load(f)

state_names = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming'
}

def geojson_to_svg_path(geometry):
    """Convert GeoJSON geometry to SVG path string"""
    if geometry['type'] == 'Polygon':
        coords_list = [geometry['coordinates']]
    elif geometry['type'] == 'MultiPolygon':
        coords_list = geometry['coordinates']
    else:
        return None

    paths = []
    for polygon in coords_list:
        for ring_idx, ring in enumerate(polygon):
            if len(ring) < 2:
                continue
            # Start with M (moveto), then L (lineto) for remaining points, Z (closepath)
            path_parts = [f"M {ring[0][0]},{ring[0][1]}"]
            for point in ring[1:]:
                path_parts.append(f"L {point[0]},{point[1]}")
            path_parts.append("Z")
            paths.append(" ".join(path_parts))

    return " ".join(paths)

def get_bounds(geometry):
    """Get bounding box of geometry"""
    coords = []
    if geometry['type'] == 'Polygon':
        for ring in geometry['coordinates']:
            coords.extend(ring)
    elif geometry['type'] == 'MultiPolygon':
        for polygon in geometry['coordinates']:
            for ring in polygon:
                coords.extend(ring)

    if not coords:
        return 0, 0, 100, 100

    lons = [c[0] for c in coords]
    lats = [c[1] for c in coords]

    min_lon, max_lon = min(lons), max(lons)
    min_lat, max_lat = min(lats), max(lats)

    # Add 10% padding
    width = max_lon - min_lon
    height = max_lat - min_lat
    padding = max(width, height) * 0.1

    return min_lon - padding, min_lat - padding, max_lon + padding, max_lat + padding

for feature in fc.get('features', []):
    state = feature.get('properties', {}).get('state')
    if not state or state not in state_names:
        continue

    geometry = feature.get('geometry')
    if not geometry:
        continue

    path = geojson_to_svg_path(geometry)
    if not path:
        continue

    bounds = get_bounds(geometry)
    x_min, y_min, x_max, y_max = bounds

    width = x_max - x_min
    height = y_max - y_min

    # Flip Y axis for SVG (SVG origin is top-left, GeoJSON is lat/lon)
    svg_content = f'''<svg viewBox="{x_min} {-y_max} {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <path d="{path}" fill="none" stroke="black" stroke-width="1" vector-effect="non-scaling-stroke"/>
</svg>'''

    svg_path = os.path.join(output_dir, f"{state.lower()}.svg")
    with open(svg_path, 'w') as f:
        f.write(svg_content)

    print(f"  {state} ({state_names[state]})")

print(f"\nGenerated {len([f for f in os.listdir(output_dir) if f.endswith('.svg')])} state SVGs in {output_dir}")
PYEOF

echo "State SVGs written to $STATE_SVGS/"
