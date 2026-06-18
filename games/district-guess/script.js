// ============================================================
//  District Guess — script.js
// ============================================================

// ---- FIREBASE CONFIGURATION (optional) ----------------------
// To enable the global leaderboard:
//   1. Create a project at https://console.firebase.google.com
//   2. Enable Firestore (start in test mode for development)
//   3. Replace the null below with your config object
//
// Example:
// const FIREBASE_CONFIG = {
//   apiKey: "AIza...",
//   authDomain: "your-project.firebaseapp.com",
//   projectId: "your-project",
//   storageBucket: "your-project.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "1:123:web:abc"
// };
//
// Firestore security rules (paste into Firebase console):
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /scores/{doc} {
//       allow read: if true;
//       allow create: if request.resource.data.keys().hasAll(
//         ['date','username','guesses','time','won','timestamp']
//       );
//     }
//   }
// }
const FIREBASE_CONFIG = null;

// ---- CENSUS API KEY (optional, free) -------------------------
// Get one at https://api.census.gov/data/key_signup.html
// Leave empty for keyless access (rate-limited but works fine).
const CENSUS_API_KEY = '95fe940d2fe95c12900a6f024c35f29fac6f28ee';

// ============================================================
//  LOOKUP TABLES
// ============================================================
const STATE_FIPS = {
  AL:'01',AK:'02',AZ:'04',AR:'05',CA:'06',CO:'08',CT:'09',DE:'10',
  FL:'12',GA:'13',HI:'15',ID:'16',IL:'17',IN:'18',IA:'19',KS:'20',
  KY:'21',LA:'22',ME:'23',MD:'24',MA:'25',MI:'26',MN:'27',MS:'28',
  MO:'29',MT:'30',NE:'31',NV:'32',NH:'33',NJ:'34',NM:'35',NY:'36',
  NC:'37',ND:'38',OH:'39',OK:'40',OR:'41',PA:'42',RI:'44',SC:'45',
  SD:'46',TN:'47',TX:'48',UT:'49',VT:'50',VA:'51',WA:'53',WV:'54',
  WI:'55',WY:'56',DC:'11'
};
const STATE_NAMES = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',
  CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',
  HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',
  KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',
  MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',
  NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',
  NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',
  OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',
  SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',
  VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',
  DC:'Washington D.C.'
};
// Primary time zone per state (some states span multiple zones — using dominant zone)
const STATE_TIMEZONES = {
  ME:'Eastern',NH:'Eastern',VT:'Eastern',MA:'Eastern',RI:'Eastern',CT:'Eastern',
  NY:'Eastern',NJ:'Eastern',PA:'Eastern',DE:'Eastern',MD:'Eastern',DC:'Eastern',
  VA:'Eastern',WV:'Eastern',NC:'Eastern',SC:'Eastern',GA:'Eastern',FL:'Eastern',
  OH:'Eastern',IN:'Eastern',MI:'Eastern',KY:'Eastern',TN:'Central',
  AL:'Central',MS:'Central',AR:'Central',LA:'Central',MO:'Central',
  IL:'Central',WI:'Central',MN:'Central',IA:'Central',ND:'Central',
  SD:'Central',NE:'Central',KS:'Central',OK:'Central',TX:'Central',
  MT:'Mountain',ID:'Mountain',WY:'Mountain',CO:'Mountain',UT:'Mountain',
  AZ:'Mountain',NM:'Mountain',NV:'Pacific',WA:'Pacific',OR:'Pacific',CA:'Pacific',
  AK:'Alaska',HI:'Hawaii–Aleutian'
};

const STATE_REGIONS = {
  ME:'Northeast',NH:'Northeast',VT:'Northeast',MA:'Northeast',RI:'Northeast',
  CT:'Northeast',NY:'Northeast',NJ:'Northeast',PA:'Northeast',DE:'Northeast',
  MD:'Northeast',DC:'Northeast',
  VA:'South',WV:'South',KY:'South',TN:'South',NC:'South',SC:'South',
  GA:'South',FL:'South',AL:'South',MS:'South',AR:'South',LA:'South',
  TX:'South',OK:'South',
  OH:'Midwest',IN:'Midwest',IL:'Midwest',MI:'Midwest',WI:'Midwest',
  MN:'Midwest',IA:'Midwest',MO:'Midwest',ND:'Midwest',SD:'Midwest',
  NE:'Midwest',KS:'Midwest',
  MT:'West',ID:'West',WY:'West',CO:'West',NM:'West',AZ:'West',
  UT:'West',NV:'West',WA:'West',OR:'West',CA:'West',AK:'West',HI:'West'
};

// Adjacency: which states share a land border.
// AK and HI have no contiguous neighbors (empty array).
// Used for the hot/cold elimination mechanic:
//   correct IS adjacent → eliminate guessed + everything NOT in its neighbors
//   correct NOT adjacent → eliminate guessed + all of its neighbors
const STATE_ADJACENCY = {
  AL: ['FL','GA','MS','TN'],
  AK: ['WA'],
  AZ: ['CA','CO','NM','NV','UT'],
  AR: ['LA','MO','MS','OK','TN','TX'],
  CA: ['AZ','HI','NV','OR'],
  CO: ['AZ','KS','NE','NM','OK','UT','WY'],
  CT: ['MA','NY','RI'],
  DC: ['MD','VA'],
  DE: ['MD','NJ','PA'],
  FL: ['AL','GA'],
  GA: ['AL','FL','NC','SC','TN'],
  HI: ['CA'],
  ID: ['MT','NV','OR','UT','WA','WY'],
  IL: ['IN','IA','KY','MO','WI'],
  IN: ['IL','KY','MI','OH'],
  IA: ['IL','MN','MO','NE','SD','WI'],
  KS: ['CO','MO','NE','OK'],
  KY: ['IL','IN','MO','OH','TN','VA','WV'],
  LA: ['AR','MS','TX'],
  ME: ['NH'],
  MD: ['DC','DE','PA','VA','WV'],
  MA: ['CT','NH','NY','RI','VT'],
  MI: ['IN','OH','WI'],
  MN: ['IA','ND','SD','WI'],
  MS: ['AL','AR','LA','TN'],
  MO: ['AR','IL','IA','KS','KY','NE','OK','TN'],
  MT: ['ID','ND','SD','WY'],
  NE: ['CO','IA','KS','MO','SD','WY'],
  NV: ['AZ','CA','ID','OR','UT'],
  NH: ['MA','ME','VT'],
  NJ: ['DE','NY','PA'],
  NM: ['AZ','CO','OK','TX','UT'],
  NY: ['CT','MA','NJ','PA','VT'],
  NC: ['GA','SC','TN','VA'],
  ND: ['MN','MT','SD'],
  OH: ['IN','KY','MI','PA','WV'],
  OK: ['AR','CO','KS','MO','NM','TX'],
  OR: ['CA','ID','NV','WA'],
  PA: ['DE','MD','NJ','NY','OH','WV'],
  RI: ['CT','MA'],
  SC: ['GA','NC'],
  SD: ['IA','MN','MT','ND','NE','WY'],
  TN: ['AL','AR','GA','KY','MO','MS','NC','VA'],
  TX: ['AR','LA','NM','OK'],
  UT: ['AZ','CO','ID','NM','NV','WY'],
  VT: ['MA','NH','NY'],
  VA: ['DC','KY','MD','NC','TN','WV'],
  WA: ['AK','ID','OR'],
  WV: ['KY','MD','OH','PA','VA'],
  WI: ['IL','IA','MI','MN'],
  WY: ['CO','ID','MT','NE','SD','UT'],
};

// ============================================================
//  SVG ICON SYSTEM  (no emojis anywhere in the UI)
// ============================================================
// Each entry is the inner path/shape markup for a 24×24 viewBox.
const ICON_PATHS = {
  question:    `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12" y2="17.01"/>`,
  barchart:    `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
  moon:        `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`,
  sun:         `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`,
  clock:       `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
  checkCircle: `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`,
  xCircle:     `<path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>`,
  lock:        `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
  share:       `<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>`,
  target:      `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,
  flame:       `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>`,
  snowflake:   `<line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="20" y1="16" x2="4" y2="8"/><line x1="20" y1="8" x2="4" y2="16"/><line x1="16" y1="20" x2="8" y2="4"/><line x1="8" y1="20" x2="16" y2="4"/>`,
  ruler:       `<path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4z"/><path d="m7.5 10.5 3 3"/><path d="m10.5 7.5 3 3"/><path d="m13.5 4.5 3 3"/>`,
  building:    `<rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>`,
  dollar:      `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
  people:      `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  mappin:      `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`,
  maximize:    `<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>`,
  minimize:    `<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>`,
  flag:        `<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>`,
  message:     `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
};

/** Returns an SVG element string for the named icon. */
function svgIcon(name, cls = 'icon') {
  const inner = ICON_PATHS[name] || '';
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

// ============================================================
//  GAME CONSTANTS
// ============================================================
const MAX_GUESSES = 6;
const STORAGE_PREFIX = 'districtguess_';
const HOW_TO_SEEN_KEY      = STORAGE_PREFIX + 'howToSeen';
const WELCOME_SEEN_KEY     = STORAGE_PREFIX + 'welcomeSeen';
const SETTINGS_SEEN_KEY    = STORAGE_PREFIX + 'settingsSeen';
const FEEDBACK_PROMPTED_AT = STORAGE_PREFIX + 'feedbackAt'; // games-played count when last prompted
const SESSION_REPLAY_KEY  = 'districtguess_replay';      // sessionStorage key
const SESSION_RANDSEED_KEY = 'districtguess_randseed';  // seed for current random (non-daily) game
// D3 US reference map coordinate space (viewBox dimensions)
const REF_VB_W = 960;
const REF_VB_H = 400;
const GAME_VERSION = (() => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `Beta 1.8.6 (${y}-${m}-${day} ${h}:${min})`;
})();

// Built at load time from GeoJSON: { 'TX': ['01','02',...], 'WY': ['01'], ... }
let stateDistrictMap = {};

// District facts — Fact 0 is always visible; one more unlocks per wrong guess.
// fn receives districtDataFor(todayDistrict) = {state, district}
const FACT_DEFS = [
  {
    icon: 'ruler',
    label: 'District size',
    fn: () => {
      if (!todayDistrict) return '—';
      const areaMi2 = Math.round(todayDistrict.properties.area_sqmi || 0);
      if (areaMi2 <   300) return `Very compact — under 300 sq mi`;
      if (areaMi2 <  2000) return `Small: ~${areaMi2.toLocaleString()} sq mi`;
      if (areaMi2 < 15000) return `Mid-size: ~${areaMi2.toLocaleString()} sq mi`;
      return `Large: ~${areaMi2.toLocaleString()} sq mi`;
    }
  },
  {
    icon: 'building',
    label: 'State delegation size',
    fn: d => {
      const count = stateDistrictMap[d.state]?.length || 1;
      if (count === 1) return 'At-large: only congressional district in its state';
      return `One of ${count} congressional districts in its state`;
    }
  },
  {
    icon: 'dollar',
    label: 'Median household income',
    fn: async d => fetchCensus(d, 'income')
  },
  {
    icon: 'people',
    label: 'Largest racial/ethnic group',
    fn: async d => fetchCensus(d, 'plurality')
  },
  {
    icon: 'flag',
    label: '2024 Presidential vote',
    fn: () => {
      if (!todayDistrict) return '—';
      const margin  = todayDistrict.properties.Margin2024Pres;
      if (margin == null || isNaN(+margin)) return 'No data';
      const pctDem  = Math.round((todayDistrict.properties.DemPct2024Pres || 0) * 100);
      const pctRep  = Math.round((todayDistrict.properties.RepPct2024Pres || 0) * 100);
      const absMar  = Math.abs(+margin * 100).toFixed(1);
      const m = +margin;
      const tag = m >  0.30 ? 'Strongly Democratic'
                : m >  0.10 ? 'Likely Democratic'
                : m >  0.05 ? 'Leans Democratic'
                : m < -0.30 ? 'Strongly Republican'
                : m < -0.10 ? 'Likely Republican'
                : m < -0.05 ? 'Leans Republican'
                : 'Competitive';
      const side = m > 0 ? `D+${absMar}%` : m < 0 ? `R+${absMar}%` : 'Even';
      return `${tag} — ${side} (${pctDem}D / ${pctRep}R)`;
    }
  },
  {
    icon: 'clock',
    label: 'Time zone',
    fn: d => STATE_TIMEZONES[d.state] ? `${STATE_TIMEZONES[d.state]} Time` : '—'
  },
  {
    icon: 'mappin',
    label: 'State',
    fn: d => STATE_NAMES[d.state] || d.state
  },
];

// Map tile progression — label-free throughout (labels give away city/state names).
// Stage 0: outline only (nearly invisible background)
// Stage 1: ESRI shaded relief (light) / satellite (dark) — geographic shape, no labels
// Stage 2: ESRI satellite imagery — detailed terrain, no labels
// Stage 3: same as stage 2 (satellite stays); labeled tiles never revealed

// ============================================================
//  STATE
// ============================================================
let districts           = [];
let districtPoints      = {};  // state-district key → [lon, lat] inner point

// Manual overrides for districts where the computed inner point lands in water.
const POINT_OVERRIDES = {};
let topoRoads              = null;  // FeatureCollection from TopoJSON roads layer
// Debug logging — set window._debugGame = true in console to enable.
// Recorded events are in window._gameLog; call copy(window._gameLog.join('\n')) to export.
window._gameLog = [];
function dbg(...args) {
  if (!window._debugGame) return;
  const msg = `[${new Date().toISOString().slice(11,23)}] ${args.join(' ')}`;
  window._gameLog.push(msg);
  console.log('%c[DG]', 'color:#C41230;font-weight:bold', ...args);
}

let topoUrban              = null;  // FeatureCollection from TopoJSON urban layer
let topoCounties           = null;  // FeatureCollection of county boundary lines
let districtGameOverTransform = null; // saved game-over zoom transform for fit-toggle button
let topoStates          = {};    // state abbr → merged state Feature for clean outline drawing
let rawTopo             = null;  // raw TopoJSON topology — kept for topojson.mesh() calls
let adjMap              = new Map(); // state-district key → string[] of adjacent keys
let currentMapStage     = 0;     // highest stage reached; preserved across re-renders
let todayDistrict       = null;   // feature object
let todayKey            = '';     // 'YYYY-MM-DD'
let map, terrainLayer, satelliteLayer, streetLayer, districtLayer;
let usRefMap            = null;   // US states reference map SVG element
let usRefMapGroup       = null;   // main <g> inside the SVG (holds all paths)
let usRefLayers         = {};     // abbr → D3 path selection
let usRefCallouts       = {};     // abbr → { group, circle, line, text, anchorX, anchorY, offX, offY } for small-state callouts
let _lastFitBBoxKey     = null;   // dedupe key — skip zoomUSRefMapToValid when bbox unchanged
let usRefZoom           = null;   // d3.zoom instance
let usRefSvgSel         = null;   // d3 selection of the SVG element
let usRefPathGen        = null;   // reusable geoPath generator (set after projection.fitSize)
let usDistLayers        = {};     // distPart ('01','02'…) → D3 path selection for district overlay
let eliminatedStates    = new Set(); // all states removed from valid set (wrong guess + adjacency)
let districtZoomBehavior    = null;   // saved d3.zoom instance for district tiles map
let districtUserZoomed      = false;  // true once user manually pans/zooms district map
let districtSavedTransform  = null;   // zoom transform preserved across rebuilds
let districtStateFitTransform = null; // full-state zoom set on first gameplay build; used by fit-toggle
let districtSimulation     = null;   // active force simulation — updated on zoom for centroid pull
let _gameStarted        = false;   // true after welcome is dismissed; guards clue/guess DOM rendering
let guessCount          = 0;
let guessHistory        = [];     // [{text, correct}]
let cluesRevealed       = 0;      // how many text clues are showing
let correctStateGuessed = false;  // true once any guess has the right state
let timerInterval       = null;
let elapsedSeconds      = 0;
let timerRunning        = false;
let gameOver            = false;
let lastGameWon         = false;  // outcome of the most recently finished game (for confetti gating)
let _resultConfettiFired = false; // confetti fires once per game, the first time results are viewed
let gamePhase            = 'state';  // 'state' | 'district' | 'gameover'
let _districtBuiltState  = null;     // stateAbbr currently rendered in the tiles SVG
let _districtSvgSel      = null;     // D3 selection of the tiles SVG (cached for zoom reuse)
let _districtPathSnap    = null;     // pathGen cached from last build (for reveal zoom)
let _districtStateFSnap  = null;     // stateFeatures cached from last build (for reveal zoom)
let _gameOverTime        = 0;        // Date.now() when endGame() was called (confetti gate)
let _gameOverAnimsCallback  = null;   // deferred: pulse/shake/confetti, fired after reveal circle collapses
let _tileZoomInAnimating    = false;  // true during 700ms entry zoom-in so handler skips simulation re-runs
let db                  = null;   // Firestore instance (if configured)
let username            = '';
let replayCount         = 0;      // increments each "Play Again" to pick a fresh district

// ============================================================
//  HELPERS
// ============================================================
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function seededIndex(seed, max) {
  // Mulberry32-style hash for reproducible daily index
  let s = (seed ^ 0xdeadbeef) >>> 0;
  s = Math.imul(s ^ (s >>> 15), s | 1);
  s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
  return Math.abs((s ^ (s >>> 14)) >>> 0) % max;
}

function dateSeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

// ============================================================
//  STATE → DISTRICT MAP + DROPDOWNS
// ============================================================
function buildStateDistrictMap(features) {
  const map = {};
  for (const f of features) {
    const state = f.properties.state;
    if (!state) continue; // skip territory features with no state code
    // Derive district number from 'state-district' (e.g. 'TX-01' → '01')
    const sd   = f.properties['state-district'] || '';
    const dist = sd.slice(state.length + 1) || '01';
    if (!map[state]) map[state] = [];
    map[state].push(dist);
  }
  // Sort numerically
  for (const state of Object.keys(map)) {
    map[state].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }
  return map;
}

// State selected via D3 map or chips only.
// District selected via tile grid (shown after state is confirmed).

function parseDistrict(raw) {
  const t = raw.trim().toUpperCase()
    .replace(/\s+/g, '-')
    .replace(/([A-Z]{2})-?0+$/, '$1-AT-LARGE'); // XX-0 → AT-LARGE
  return t;
}

function normalizeGuess(raw) {
  let t = raw.trim().toUpperCase().replace(/\s+/g, '-');
  // Insert dash if missing: NY14 → NY-14
  t = t.replace(/^([A-Z]{2})(\d+)$/, '$1-$2');
  // Normalize at-large variants
  if (/^([A-Z]{2})-(0+|AL|AT-?LARGE|ATLARGE)$/.test(t)) {
    t = t.replace(/^([A-Z]{2})-.*$/, '$1-AT-LARGE');
  }
  // Zero-pad single digit district numbers: NY-3 → NY-03 … but the data uses NY-03
  t = t.replace(/^([A-Z]{2})-(\d)$/, '$1-0$2');
  return t;
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2,'0')}`;
}

function formatNumber(n) {
  return parseInt(n, 10).toLocaleString();
}

function formatCurrency(n) {
  return '$' + parseInt(n, 10).toLocaleString();
}

// Observable zoom-to-bounding-box pattern (observablehq.com/@d3/zoom-to-bounding-box).
// Returns a d3.ZoomTransform that centers the given bbox in a W×H viewport.
// margin is a fraction of the viewport (0.85 = 15% padding around the constraining axis).
function zoomToBBox([[x0, y0], [x1, y1]], W, H, { margin = 0.85, maxScale = Infinity, minScale = 0 } = {}) {
  const bw = x1 - x0, bh = y1 - y0;
  if (!(bw > 0) || !(bh > 0)) return d3.zoomIdentity;
  const k = Math.min(maxScale, Math.max(minScale, margin / Math.max(bw / W, bh / H)));
  return d3.zoomIdentity
    .translate(W / 2, H / 2)
    .scale(k)
    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2);
}

// ============================================================
//  STORAGE
// ============================================================
function saveGameState() {
  const state = {
    key: todayKey,
    guessCount,
    guessHistory,
    cluesRevealed,
    elapsedSeconds,
    gameOver,
    won: gameOver && guessHistory.some(g => g.correct),
  };
  localStorage.setItem(STORAGE_PREFIX + 'today', JSON.stringify(state));
}

function loadGameState() {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'today');
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s.key !== todayKey) return null; // different day
    return s;
  } catch { return null; }
}

function savePersonalStats(won, guesses, seconds) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'stats');
    const stats = raw ? JSON.parse(raw) : {
      played: 0, won: 0, streak: 0, maxStreak: 0,
      guessDist: { 1:0,2:0,3:0,4:0,5:0,6:0,X:0 },
      totalWonTime: 0,
      lastDate: null
    };
    stats.played++;
    if (won) {
      stats.won++;
      stats.streak = (stats.lastDate === getPrevDayKey()) ? stats.streak + 1 : 1;
      stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
      stats.guessDist[guesses] = (stats.guessDist[guesses] || 0) + 1;
      stats.totalWonTime = (stats.totalWonTime || 0) + seconds;
    } else {
      stats.streak = 0;
      stats.guessDist['X'] = (stats.guessDist['X'] || 0) + 1;
    }
    stats.lastDate = todayKey;
    localStorage.setItem(STORAGE_PREFIX + 'stats', JSON.stringify(stats));
  } catch {}
}

function getPrevDayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function loadPersonalStats() {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'stats');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function getUsername() {
  return localStorage.getItem(STORAGE_PREFIX + 'username') || '';
}

function setUsername(name) {
  localStorage.setItem(STORAGE_PREFIX + 'username', name);
}

// ============================================================
//  MAP
// ============================================================

// Tile helpers — dark mode uses CartoDB Dark Matter; light uses OSM
function streetTileUrl() {
  return isDarkMode()
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
}
function streetTileAttrib() {
  return isDarkMode()
    ? '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
    : '© OpenStreetMap contributors';
}

// Track current street-layer opacity so we can restore it after a tile swap
let _streetOpacity = 0.01;

function initMap() {
  map = L.map('map', {
    zoomControl:      false,   // no zoom buttons — district map is for context only
    scrollWheelZoom:  false,
    doubleClickZoom:  false,
    touchZoom:        false,
    boxZoom:          false,
    dragging:         false,   // prevent accidental map panning on mobile
    attributionControl: false
  }).setView([37.8, -96], 4);

  // Layer 1: shaded relief — no labels, pure hillshade (light mode stage 1)
  terrainLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 13, opacity: 0, attribution: 'Tiles © Esri' }
  ).addTo(map);

  // Layer 2: satellite imagery — no labels, used as stage 2 hint in all modes
  satelliteLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 19, opacity: 0, attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics' }
  ).addTo(map);

  // Layer 3: labeled tiles — CartoDB dark in dark mode, OSM in light; revealed only at game end
  streetLayer = L.tileLayer(streetTileUrl(), {
    maxZoom: 19,
    opacity: 0.01,
    attribution: streetTileAttrib()
  }).addTo(map);

  L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);
}

function applyMapStage(wrongGuesses, gameEnded = false) {
  const dark = isDarkMode();
  let idx;
  if (gameEnded || wrongGuesses >= 4) idx = 3;
  else if (wrongGuesses >= 3)         idx = 2;
  else if (wrongGuesses >= 1)         idx = 1;
  else                                idx = 0;

  // D3 overlay: stages 0 (outline only), 1 (+ urban/roads), 2+ (transparent bg over terrain)
  currentMapStage = Math.max(currentMapStage, idx);
  renderMapD3(currentMapStage);

  // One basemap per theme starting at stage 2: terrain in light mode, satellite in dark mode
  terrainLayer.setOpacity(dark ? 0 : (currentMapStage >= 2 ? 1 : 0));
  satelliteLayer.setOpacity(dark ? (currentMapStage >= 2 ? 1 : 0) : 0);

  // Labels never shown
  _streetOpacity = 0.01;
  streetLayer.setOpacity(0.01);
}

function districtStyle() {
  // Leaflet layer is used only for fitBounds — D3 overlay draws the visible border
  return { color: 'transparent', weight: 0, fillOpacity: 0 };
}

function renderMapD3(stage) {
  const mapEl = document.getElementById('map');
  if (!mapEl || !todayDistrict || !window.d3) return;

  let overlayEl = document.getElementById('map-d3-overlay');
  if (!overlayEl) {
    overlayEl = document.createElement('div');
    overlayEl.id = 'map-d3-overlay';
    overlayEl.style.cssText =
      'position:absolute;inset:0;z-index:500;pointer-events:none;';
    mapEl.appendChild(overlayEl);
  }
  overlayEl.innerHTML = '';

  const W = mapEl.offsetWidth  || 400;
  const H = mapEl.offsetHeight || 300;
  const pad = Math.min(W, H) * 0.1;
  const dark = isDarkMode();

  const projection = _previewProjection(W, H, pad, { centerOnCentroid: gameOver });
  const pathGen    = d3.geoPath(projection);
  const dPath      = pathGen(todayDistrict);
  if (!dPath) return;

  const svg = d3.select(overlayEl).append('svg')
    .attr('width', W).attr('height', H)
    .style('display', 'block');

  // Opaque background for stages 0-1 (no tile basemap visible); matches --bg like us-ref-map
  if (stage < 2) {
    const bg = getComputedStyle(document.body).getPropertyValue('--bg').trim();
    svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg || '#f5f5f5');
  }

  // Urban areas + roads only after game ends (not during gameplay — too revealing)
  if (gameOver && (topoUrban || topoRoads)) {
    const [[bx0, by0], [bx1, by1]] = d3.geoBounds(todayDistrict);
    const mg = 0.1;
    const inBounds = f => {
      try {
        const [[fx0, fy0], [fx1, fy1]] = d3.geoBounds(f);
        return fx1 >= bx0-mg && fx0 <= bx1+mg && fy1 >= by0-mg && fy0 <= by1+mg;
      } catch { return false; }
    };
    if (topoUrban) topoUrban.features.filter(inBounds).forEach(f =>
      svg.append('path').attr('d', pathGen(f))
        .attr('fill', dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.09)')
        .attr('stroke', 'none'));
    if (topoRoads) topoRoads.features.filter(inBounds).forEach(f =>
      svg.append('path').attr('d', pathGen(f))
        .attr('fill', 'none')
        .attr('stroke', dark ? 'rgba(255,255,255,0.2)' : '#bbb')
        .attr('stroke-width', 0.6));
  }

  // District fill — white in dark mode after game over, subtle red tint otherwise
  const fillColor   = (dark && gameOver) ? '#ffffff' : '#C41230';
  const fillOpacity = (dark && gameOver) ? 0.25 : (dark ? 0.3 : 0.35);
  svg.append('path').attr('d', dPath)
    .attr('fill', fillColor)
    .attr('fill-opacity', fillOpacity);

  // District border — always white
  svg.append('path').attr('d', dPath)
    .attr('fill', 'none')
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 2.5)
    .attr('stroke-linejoin', 'round');
}

function renderDistrict(feature) {
  if (districtLayer) map.removeLayer(districtLayer);
  // Invisible Leaflet layer — used only to drive fitBounds; D3 overlay draws the visible border
  districtLayer = L.geoJSON(feature, { style: districtStyle() }).addTo(map);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    map.invalidateSize();
    if (districtLayer) {
      map.fitBounds(districtLayer.getBounds(), { padding: [40, 40], animate: false });
    }
    renderMapD3(currentMapStage); // restore current stage (preserves urban/roads if already revealed)
  }));
}

// ============================================================
//  CENSUS DATA — read from TopoJSON properties (pre-aggregated via BAF)
// ============================================================
async function getDistrictCensusData() {
  if (!todayDistrict) return null;
  const p = todayDistrict.properties;
  if (p.pop == null) return null;
  return {
    name:       p['state-district'],
    pop:        p.pop,
    income:     p.income,
    whiteNH:    p.whiteNH,
    black:      p.black,
    asian:      p.asian,
    hispanic:   p.hispanic,
    medianHome: p.medianHome,
    bach:       p.bach,
    master:     p.master,
  };
}

async function fetchCensus(districtData, field) {
  const d = await getDistrictCensusData();
  if (!d) return 'N/A';

  if (field === 'pop') {
    return formatNumber(d.pop) + ' people';
  }

  if (field === 'income') {
    return parseInt(d.income, 10) > 0 ? formatCurrency(d.income) + '/yr' : 'N/A';
  }

  if (field === 'plurality') {
    const total = parseInt(d.pop, 10);
    if (!total) return 'N/A';
    const groups = [
      { name: 'White',    val: parseInt(d.whiteNH,  10) },
      { name: 'Black',    val: parseInt(d.black,    10) },
      { name: 'Hispanic', val: parseInt(d.hispanic, 10) },
      { name: 'Asian',    val: parseInt(d.asian,    10) },
    ].filter(g => g.val > 0 && !isNaN(g.val));
    groups.sort((a, b) => b.val - a.val);
    if (!groups.length) return 'N/A';
    const top = groups[0];
    const pct = Math.round(top.val / total * 100);
    return `${pct}% ${top.name} plurality`;
  }

  return 'N/A';
}

function renderTabHeader(containerId) {
  const el = document.getElementById(containerId);
  if (!el || !todayDistrict) return;
  const answer    = todayDistrict.properties['state-district'] || '';
  const stateName = STATE_NAMES[todayDistrict.properties.state] || todayDistrict.properties.state;
  const isAtLarge = (stateDistrictMap[todayDistrict.properties.state] || []).length === 1;
  const distPart  = answer.slice(todayDistrict.properties.state.length + 1);
  const distLabel = isAtLarge ? 'At-Large District' : `District ${parseInt(distPart, 10)}`;
  const won       = guessHistory.some(g => g.correct && g.phase === 'district');
  const timeStr   = elapsedSeconds > 0 ? ` &middot; <strong>${formatTime(elapsedSeconds)}</strong>` : '';
  const solveStr  = won
    ? `Solved in <strong>${guessCount}</strong> guess${guessCount !== 1 ? 'es' : ''}${timeStr}`
    : `Not solved &mdash; the answer was <strong>${answer}</strong>`;
  el.innerHTML = `
    <div class="result-answer">
      <span class="result-answer-code">${answer}</span>
    </div>
    <div class="result-time-line">${solveStr}</div>`;
}

// kept for backward compat call sites
function renderGuessesSummary() { renderTabHeader('guesses-header'); }

// Wordle-style personal stats grid (played, win%, streaks, distribution)
function renderInlinePersonalStats() {
  const el = document.getElementById('result-personal-stats');
  if (!el) return;
  const stats = loadPersonalStats();
  if (!stats || stats.played === 0) { el.innerHTML = ''; return; }

  const winRate = Math.round(stats.won / stats.played * 100);
  const dist    = stats.guessDist || {};
  const maxBar  = Math.max(...Object.values(dist).map(Number), 1);
  const wonToday = guessHistory.some(g => g.correct && g.phase === 'district');

  const bars = [1, 2, 3, 4, 5, 6, 'X'].map(k => {
    const count = dist[k] || 0;
    const pct   = count > 0 ? Math.max(Math.round(count / maxBar * 100), 12) : 0;
    const hi    = gameOver && ((wonToday && k === guessCount) || (!wonToday && k === 'X'));
    return `<div class="rdist-row">
      <span class="rdist-n">${k}</span>
      <div class="rdist-bar-wrap">
        <div class="rdist-bar${hi ? ' today' : ''}" style="width:${pct}%">
          ${count ? `<span class="rdist-count">${count}</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');

  const avgSecs  = stats.won > 0 ? Math.round((stats.totalWonTime || 0) / stats.won) : null;
  const avgLabel = avgSecs !== null ? formatTime(avgSecs) : '—';
  const totalWonGuesses = [1,2,3,4,5,6].reduce((s, k) => s + k * (dist[k] || 0), 0);
  const totalWonCount   = [1,2,3,4,5,6].reduce((s, k) => s + (dist[k] || 0), 0);
  const avgGuesses = totalWonCount > 0 ? (totalWonGuesses / totalWonCount).toFixed(1) : '—';

  el.innerHTML = `
    <div class="result-stats-grid">
      <div class="rstat-cell"><span class="rstat-big">${stats.played}</span><span class="rstat-label">Played</span></div>
      <div class="rstat-cell"><span class="rstat-big">${winRate}</span><span class="rstat-label">Win %</span></div>
      <div class="rstat-cell"><span class="rstat-big">${stats.streak}</span><span class="rstat-label">Current Streak</span></div>
      <div class="rstat-cell"><span class="rstat-big">${stats.maxStreak}</span><span class="rstat-label">Max Streak</span></div>
    </div>
    <div class="result-dist">
      <h4>Guess Distribution</h4>
      ${bars}
    </div>
    <div class="rstat-avg-time">Avg. guesses (wins): <strong>${avgGuesses}</strong> &nbsp;&middot;&nbsp; Avg. time: <strong>${avgLabel}</strong></div>`;
}

// Helper: switch the result modal between "result" and "census" tabs
function switchResultTab(tab) {
  document.querySelectorAll('.result-tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.result-tab-btn').forEach(b => b.classList.remove('active'));
  const paneId = { result: 'result-section', guesses: 'guesses-section', census: 'census-section' }[tab] || 'result-section';
  const pane = document.getElementById(paneId);
  const btn  = document.querySelector(`.result-tab-btn[data-rtab="${tab}"]`);
  if (pane) pane.classList.add('active');
  if (btn)  btn.classList.add('active');
  if (tab === 'census') renderTabHeader('census-header');
  if (tab === 'guesses') renderTabHeader('guesses-header');
}

async function fetchAndRenderCensusPanel(districtData) {
  const censusLoading = document.getElementById('census-loading');
  const censusDataEl  = document.getElementById('census-data');

  const d = await getDistrictCensusData();
  if (!d) {
    censusLoading.textContent = 'Census data unavailable for this district.';
    return;
  }

  const total    = parseInt(d.pop,       10);
  const whPct    = total > 0 ? Math.round(parseInt(d.whiteNH,  10) / total * 100) : 0;
  const blPct    = total > 0 ? Math.round(parseInt(d.black,    10) / total * 100) : 0;
  const hiPct    = total > 0 ? Math.round(parseInt(d.hispanic, 10) / total * 100) : 0;
  const asPct    = total > 0 ? Math.round(parseInt(d.asian,    10) / total * 100) : 0;
  const bachPlus = parseInt(d.bach, 10) + parseInt(d.master, 10);
  const eduPct   = total > 0 ? Math.round(bachPlus / total * 100) : 0;

  // Shapefile-derived facts (precise values for District Profile)
  const areaMi2     = Math.round(todayDistrict?.properties.area_sqmi || 0);
  const delegCount  = (stateDistrictMap[districtData.state] || []).length;
  const margin      = todayDistrict?.properties.Margin2024Pres;
  const pctDem      = Math.round((todayDistrict?.properties.DemPct2024Pres || 0) * 100);
  const pctRep      = Math.round((todayDistrict?.properties.RepPct2024Pres || 0) * 100);
  const absMar      = margin != null ? Math.abs(+margin * 100).toFixed(1) : null;
  const voteValue   = absMar == null ? 'No data'
    : +margin >  0.05 ? `D+${absMar}%`
    : +margin < -0.05 ? `R+${absMar}%`
    : 'Competitive';
  const voteSub     = absMar == null ? '' : `${pctDem}D / ${pctRep}R`;

  censusLoading.classList.add('hidden');
  censusDataEl.classList.remove('hidden');
  censusDataEl.innerHTML = `
    <div class="census-grid">
      <div class="census-card">
        <div class="label">District Area</div>
        <div class="value">${areaMi2 > 0 ? areaMi2.toLocaleString() + ' sq mi' : '—'}</div>
        <div class="sub">2026 district boundaries</div>
      </div>
      <div class="census-card">
        <div class="label">State Delegation</div>
        <div class="value">${delegCount === 1 ? 'At-Large' : delegCount + ' districts'}</div>
        <div class="sub">${STATE_NAMES[districtData.state] || districtData.state}</div>
      </div>
      <div class="census-card">
        <div class="label">2024 Presidential Vote</div>
        <div class="value">${voteValue}</div>
        <div class="sub">${voteSub}</div>
      </div>
      <div class="census-card">
        <div class="label">Total Population</div>
        <div class="value">${formatNumber(d.pop)}</div>
        <div class="sub">ACS 2024 5-year</div>
      </div>
      <div class="census-card">
        <div class="label">Median Household Income</div>
        <div class="value">${parseInt(d.income,10) > 0 ? formatCurrency(d.income) : 'N/A'}</div>
        <div class="sub">per year</div>
      </div>
      <div class="census-card">
        <div class="label">Median Home Value</div>
        <div class="value">${parseInt(d.medianHome,10) > 0 ? formatCurrency(d.medianHome) : 'N/A'}</div>
        <div class="sub">owner-occupied</div>
      </div>
      <div class="census-card">
        <div class="label">Bachelor's Degree+</div>
        <div class="value">${eduPct}%</div>
        <div class="sub">of population</div>
      </div>
      <div class="census-card">
        <div class="label">Racial / Ethnic Composition</div>
        <div class="value">${whPct}% White (non-Hispanic)</div>
        <div class="sub">${blPct}% Black · ${hiPct}% Hispanic · ${asPct}% Asian</div>
      </div>
    </div>
    <div class="census-source">Source: U.S. Census Bureau, ACS 5-Year Estimates (2024) &amp; 2026 district boundaries. ${d.name}</div>
  `;
}

// ============================================================
//  FIREBASE / LEADERBOARD
// ============================================================
let _firebaseReady = null; // Promise that resolves when Firebase is loaded and initialized

function loadFirebase() {
  if (_firebaseReady) return _firebaseReady;
  if (!FIREBASE_CONFIG) { _firebaseReady = Promise.resolve(); return _firebaseReady; }
  _firebaseReady = new Promise(resolve => {
    const s1 = document.createElement('script');
    s1.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js';
    s1.onload = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js';
      s2.onload = () => {
        try {
          firebase.initializeApp(FIREBASE_CONFIG);
          db = firebase.firestore();
        } catch (e) { console.warn('Firebase init failed:', e); }
        resolve();
      };
      s2.onerror = resolve; // non-fatal
      document.head.appendChild(s2);
    };
    s1.onerror = resolve; // non-fatal
    document.head.appendChild(s1);
  });
  return _firebaseReady;
}

async function submitScore(won, guesses, seconds) {
  await loadFirebase();
  if (!db) return;
  try {
    await db.collection('scores').add({
      date: todayKey,
      username,
      guesses: won ? guesses : MAX_GUESSES + 1,
      time: seconds,
      won,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {
    console.warn('Score submit failed:', e);
  }
}

async function loadTodayScores() {
  await loadFirebase();
  if (!db) return null;
  try {
    const snap = await db.collection('scores')
      .where('date', '==', todayKey)
      .orderBy('won', 'desc')
      .orderBy('guesses', 'asc')
      .orderBy('time', 'asc')
      .limit(50)
      .get();
    return snap.docs.map(d => d.data());
  } catch { return null; }
}

async function loadAlltimeScores() {
  await loadFirebase();
  if (!db) return null;
  try {
    // Fetch recent 500 scores and aggregate client-side
    const snap = await db.collection('scores')
      .where('won', '==', true)
      .orderBy('timestamp', 'desc')
      .limit(500)
      .get();
    const rows = snap.docs.map(d => d.data());

    // Aggregate by username
    const agg = {};
    for (const r of rows) {
      if (!agg[r.username]) agg[r.username] = { username: r.username, games: 0, wins: 0, totalGuesses: 0, totalTime: 0 };
      agg[r.username].games++;
      agg[r.username].wins++;
      agg[r.username].totalGuesses += r.guesses;
      agg[r.username].totalTime    += r.time;
    }
    return Object.values(agg)
      .map(a => ({ ...a, avgGuesses: a.totalGuesses / a.wins, avgTime: a.totalTime / a.wins }))
      .sort((a, b) => a.avgGuesses - b.avgGuesses || a.avgTime - b.avgTime)
      .slice(0, 30);
  } catch { return null; }
}

// ============================================================
//  FACTS UI  (one per wrong guess; fact 0 always visible)
// ============================================================
function renderHintBar() {
  if (!todayDistrict) return;
  const bar = document.getElementById('hint-bar');
  if (!bar) return;
  if (!_gameStarted) { bar.innerHTML = ''; return; }

  bar.innerHTML = '';
  const distData = districtDataFor(todayDistrict);

  FACT_DEFS.forEach((def, i) => {
    const revealed = i <= cluesRevealed;
    const isLatest = revealed && i === Math.min(cluesRevealed, FACT_DEFS.length - 1);

    const card = document.createElement('div');
    card.className = 'hint-card' + (revealed ? ' revealed' + (isLatest ? ' latest' : '') : ' locked');
    card.setAttribute('role', 'listitem');

    if (revealed) {
      card.innerHTML = `
        <div class="hint-card-header">
          <span class="hint-card-icon">${svgIcon(def.icon, 'clue-icon-svg')}</span>
          <span class="hint-card-label">${def.label}</span>
        </div>
        <div class="hint-card-val"><span>…</span></div>`;
    } else {
      card.innerHTML = `<div class="hint-card-header"><span class="hint-card-icon">${svgIcon('lock', 'clue-icon-svg')}</span></div>`;
    }

    if (revealed) {
      const spanEl = card.querySelector('.hint-card-val > span');
      const val = def.fn(distData);
      if (val instanceof Promise) {
        val.then(v => { if (spanEl) spanEl.textContent = v; });
      } else {
        spanEl.textContent = val;
      }
    }

    // Tap any previous revealed card → open hints modal showing all clues
    if (revealed && !isLatest) {
      card.addEventListener('click', () => {
        renderHintsModal();
        document.getElementById('hints-modal')?.classList.remove('hidden');
      });
    }

    bar.appendChild(card);
  });

  // Measure overflow and enable auto-scroll after all cards are in DOM
  function applyScrollMeasure(root) {
    const els = root ? root.querySelectorAll('.hint-card-val') : bar.querySelectorAll('.hint-card-val');
    els.forEach(el => {
      el.classList.remove('auto-scroll');
      const inner = el.querySelector('span');
      if (!inner) return;
      requestAnimationFrame(() => {
        const overflow = inner.scrollWidth - el.clientWidth;
        if (overflow > 4) {
          const duration = Math.max(3, overflow / 40);
          el.style.setProperty('--scroll-dist', `-${overflow}px`);
          el.style.setProperty('--scroll-duration', `${duration}s`);
          el.classList.add('auto-scroll');
        }
      });
    });
  }
  requestAnimationFrame(() => applyScrollMeasure(null));

  // Scroll latest revealed card into view
  const latest = bar.querySelectorAll('.hint-card.revealed');
  if (latest.length) latest[latest.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function renderClues() {
  renderStateChips(); // update chip states whenever facts change
  updateUSRefMap();   // keep D3 map in sync
  renderHintBar();
  // hints-clues-list is populated lazily when the hints modal opens — not stored in DOM at rest
}

function renderHintsModal() {
  if (!todayDistrict) return;
  const list = document.getElementById('hints-clues-list');
  if (!list) return;
  list.innerHTML = '';
  const distData = districtDataFor(todayDistrict);
  for (let i = 0; i < FACT_DEFS.length; i++) {
    const def = FACT_DEFS[i];
    const revealed = i <= cluesRevealed;
    const div = document.createElement('div');
    if (revealed) {
      div.className = 'clue-item revealed';
      div.innerHTML = `
        <span class="clue-icon">${svgIcon(def.icon, 'clue-icon-svg')}</span>
        <span class="clue-text">
          <span class="clue-label">${def.label}</span>
          <span class="clue-val">…</span>
        </span>`;
      const val = def.fn(distData);
      if (val instanceof Promise) {
        val.then(v => { const el = div.querySelector('.clue-val'); if (el) el.textContent = v; });
      } else {
        div.querySelector('.clue-val').textContent = val;
      }
    } else {
      div.className = 'clue-item locked';
      div.innerHTML = `<span class="clue-icon">${svgIcon('lock', 'clue-icon-svg locked')}</span><span class="clue-text">${def.label}</span>`;
    }
    list.appendChild(div);
  }
}

function districtDataFor(feature) {
  const state    = feature.properties.state;
  const sd       = feature.properties['state-district'] || '';
  const distPart = sd.slice(state.length + 1) || '01';
  // Census API uses '00' for at-large (single-district) states
  const censusDist = (stateDistrictMap[state] || []).length === 1 ? '00' : distPart;
  return { state, district: censusDist };
}

// ============================================================
//  TIMER
// ============================================================
function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  document.getElementById('timer-display').classList.add('running');
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    const t = formatTime(elapsedSeconds);
    const tv = document.getElementById('timer-value');
    if (tv) tv.textContent = t;
    const tvi = document.getElementById('timer-value-inline');
    if (tvi) tvi.textContent = t;
    saveGameState();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  document.getElementById('timer-display').classList.remove('running');
}

// ============================================================
//  GUESS HANDLING
// ============================================================
function renderGuessHistory() {
  if (!_gameStarted) return;
  const el = document.getElementById('guess-history');
  const answerKey = todayDistrict?.properties['state-district'];
  const answerNeighbors = new Set(adjMap.get(answerKey) || []);
  el.innerHTML = guessHistory.map(g => {
    const iconName = g.correct ? 'checkCircle' : 'xCircle';
    const cls      = g.correct ? 'correct' : 'wrong';

    if (g.phase === 'state') {
      const label = STATE_NAMES[g.text] || g.text;
      if (!g.correct) {
        const hint = g.adjacent
          ? `<span class="guess-hint hot">${svgIcon('flame','hint-icon')} Adjacent</span>`
          : `<span class="guess-hint cold">${svgIcon('snowflake','hint-icon')} Not adjacent</span>`;
        return `<div class="guess-row ${cls}">
          <span class="guess-icon">${svgIcon(iconName,'guess-icon-svg')}</span>
          <span class="guess-label">${label}</span>${hint}
        </div>`;
      }
      return `<div class="guess-row ${cls}">
        <span class="guess-icon">${svgIcon(iconName,'guess-icon-svg')}</span>
        <span class="guess-label">${label}</span>
        <span class="guess-hint hot">Correct state!</span>
      </div>`;
    }

    // District phase
    const distPart   = g.text.split('-').slice(1).join('-');
    const guessState = g.text.split('-')[0];
    const distLabel  = (stateDistrictMap[guessState] || []).length === 1
      ? 'At-Large' : `District ${parseInt(distPart, 10)}`;
    let distHint = '';
    if (g.correct) {
      distHint = `<span class="guess-hint hot">Correct!</span>`;
    } else if (answerNeighbors && answerNeighbors.has(g.text)) {
      distHint = `<span class="guess-hint hot">${svgIcon('flame','hint-icon')} Adjacent</span>`;
    } else if (answerNeighbors) {
      distHint = `<span class="guess-hint cold">${svgIcon('snowflake','hint-icon')} Not adjacent</span>`;
    }
    return `<div class="guess-row ${cls}">
      <span class="guess-icon">${svgIcon(iconName,'guess-icon-svg')}</span>
      <span class="guess-label">${distLabel}</span>
      ${distHint}
    </div>`;
  }).join('');

  const remaining = MAX_GUESSES - guessCount;
  const remEl = document.getElementById('guess-remaining');
  if (!gameOver) {
    remEl.textContent = remaining === 1
      ? '1 guess remaining'
      : `${remaining} guesses remaining`;
  } else {
    remEl.textContent = '';
  }

  updateGuessCounter();
}

/** Render the small dot-row guess progress indicator in the reference panel. */
function updateGuessCounter() {
  const el = document.getElementById('guess-counter');
  if (!el) return;

  // Build a counted-guess list: wrong guesses (both phases) + the winning guess if any.
  // Excludes the correct-state transition (it doesn't cost a guess).
  const countedGuesses = guessHistory.filter(g => !g.correct || g.phase === 'district');
  const dots = Array.from({ length: MAX_GUESSES }, (_, i) => {
    const g = countedGuesses[i];
    if (!g) return '<span class="gc-dot gc-empty"></span>';
    if (g.correct) return `<span class="gc-dot gc-used gc-correct">${svgIcon('checkCircle','gc-icon-svg')}</span>`;
    return `<span class="gc-dot gc-used gc-wrong">${svgIcon('xCircle','gc-icon-svg')}</span>`;
  }).join('');

  const used    = guessCount;
  const wonGame = guessHistory.some(g => g.correct);
  const label   = gameOver
    ? (wonGame ? 'Solved!' : 'No more guesses')
    : used === 0
      ? `${MAX_GUESSES} guesses`
      : `${used} / ${MAX_GUESSES} · ${MAX_GUESSES - used} left`;

  const timerVal = document.getElementById('timer-value-inline');
  const timerHtml = `<div id="timer-display-inline" class="timer-inline">${svgIcon('clock','icon')}<span id="timer-value-inline">${timerVal ? timerVal.textContent : '0:00'}</span></div>`;
  el.innerHTML = `<div class="gc-dots">${dots}</div><span class="gc-label">${label}</span>${timerHtml}`;
}

// ---- Hard mode ----
let hardMode = localStorage.getItem('districtguess_hardMode') === '1';

// ---- Confirm-selection mode ----
let confirmInputMode   = localStorage.getItem('districtguess_confirmMode') === '1';
let _pendingConfirmAbbr = null;

function setConfirmPending(abbr) {
  _pendingConfirmAbbr = abbr;
  const hint = document.getElementById('confirm-hint');
  if (hint) {
    hint.textContent = abbr ? `Tap ${abbr} again to confirm` : 'Tap again to confirm';
    hint.classList.toggle('visible', !!abbr);
  }
  // Highlight pending state gold, restore others
  Object.entries(usRefLayers).forEach(([a, pathEl]) => {
    if (a === abbr) pathEl.attr('fill', '#FDB515').attr('fill-opacity', 0.85);
    else _applyStateStyle(pathEl, a);
  });
  Object.entries(usRefCallouts).forEach(([a, co]) => {
    if (a === abbr) co.circle.attr('fill', '#FDB515').attr('fill-opacity', 1);
    else _applyCalloutStyle(a);
  });
}

function handleStateSelection(abbr) {
  if (!confirmInputMode) { submitStateGuess(abbr); return; }
  if (_pendingConfirmAbbr === abbr) {
    setConfirmPending(null);
    submitStateGuess(abbr);
  } else {
    setConfirmPending(abbr);
  }
}

// Called when a state is chosen via map click or chip click.
let _guessLocked = false; // prevent double-submit during animation
function submitStateGuess(abbr) {
  if (gameOver || correctStateGuessed || _guessLocked) return;
  _guessLocked = true;

  const isCorrect = abbr === todayDistrict.properties.state;

  // Flash the state — CMU Gold (correct) or Carnegie Red (wrong)
  const pathEl = usRefLayers[abbr];
  if (pathEl) {
    pathEl
      .attr('fill',         isCorrect ? '#FDB515' : '#C41230')
      .attr('fill-opacity', 0.9);
  }

  // Animate the reference panel
  const panel = document.getElementById('us-ref-map');
  panel.classList.add(isCorrect ? 'flash-correct' : 'flash-wrong');
  setTimeout(() => panel.classList.remove('flash-correct', 'flash-wrong'), 700);

  // Process the guess after a brief pause so the animation is visible
  setTimeout(() => {
    _guessLocked = false;
    processStateGuess(abbr, isCorrect);
  }, 650);
}

function processStateGuess(abbr, correct) {
  if (!timerRunning) startTimer();

  const correctState = todayDistrict.properties.state;
  const neighbors    = STATE_ADJACENCY[abbr] || [];
  const isAdjacent   = neighbors.includes(correctState);

  if (!correct) guessCount++;   // correct state unlocks district phase — not a counted guess
  guessHistory.push({ text: abbr, correct, phase: 'state', adjacent: isAdjacent });

  if (correct) {
    const isAtLarge = (stateDistrictMap[abbr] || []).length === 1;
    if (isAtLarge) {
      // At-large state — state guess IS the district guess; win immediately
      const fullGuess = `${abbr}-AL`;
      guessHistory.push({ text: fullGuess, correct: true, phase: 'district' });
      correctStateGuessed = true;
      renderGuessHistory();
      renderClues();
      saveGameState();
      endGame(true);
      return;
    }
    correctStateGuessed = true;
    lockStateDropdown(abbr);
  } else {
    eliminatedStates.add(abbr);

    if (isAdjacent) {
      // HOT: correct state is adjacent to this guess — keep only neighbors.
      const neighborSet = new Set(neighbors);
      for (const s of [...getValidStates()]) {
        if (s !== correctState && !neighborSet.has(s)) eliminatedStates.add(s);
      }
    } else {
      // COLD: correct state is not adjacent — eliminate this guess and all its neighbors.
      for (const n of neighbors) {
        if (n !== correctState) eliminatedStates.add(n);
      }
    }

    // Dead-end cleanup: a state whose every adjacency neighbor has been explicitly
    // guessed wrong can't be the answer. Only uses intentional wrong guesses so
    // cold-eliminated neighbors don't cascade into false dead-ends.
    const wrongGuessed = new Set(
      guessHistory.filter(g => g.phase === 'state' && !g.correct).map(g => g.text)
    );
    let _changed = true;
    while (_changed) {
      _changed = false;
      for (const s of [...getValidStates()]) {
        if (s === correctState) continue;
        const sN = STATE_ADJACENCY[s] || [];
        if (sN.length > 0 && sN.every(n => wrongGuessed.has(n))) {
          eliminatedStates.add(s);
          _changed = true;
        }
      }
    }

    const wrongCount = guessHistory.filter(g => !g.correct).length;
    if (!hardMode) cluesRevealed = Math.min(wrongCount, FACT_DEFS.length);
    applyMapStage(wrongCount);
    if (guessCount >= MAX_GUESSES) { endGame(false); return; }
  }

  renderGuessHistory();
  renderClues();        // also calls updateUSRefMap() + renderStateChips()
  zoomUSRefMapToValid(); // zoom D3 map to remaining valid states
  saveGameState();

  // If elimination narrowed the field to exactly 1 state, auto-confirm it
  const _autoRemaining = getValidStates();
  if (_autoRemaining.size === 1 && !correctStateGuessed) {
    const _onlyState = [..._autoRemaining][0];
    setTimeout(() => {
      guessHistory.push({ text: _onlyState, correct: true, phase: 'state', adjacent: false });
      correctStateGuessed = true;
      renderGuessHistory();
      saveGameState();
      lockStateDropdown(_onlyState);
    }, 900);
  }
}

// ── Phase 2: district tile input ──────────────────────────────
let _distLocked = false; // prevent double-tap during tile animation

function submitDistrictTile(dist) {
  if (gameOver || !correctStateGuessed || _distLocked) return;
  dbg(`submitDistrictTile dist=${dist} today=${todayDistrict?.properties?.['state-district']} guessCount=${guessCount}`);

  _distLocked = true;
  if (!timerRunning) startTimer();

  const stateAbbr = todayDistrict.properties.state;
  const fullGuess = `${stateAbbr}-${dist}`;
  const correct   = fullGuess === todayDistrict.properties['state-district'];

  const tilesEl = document.getElementById('district-tiles');

  const clickedTile = tilesEl.querySelector(`g.district-tile[data-dist="${dist}"]`);
  const tileCircle  = clickedTile?.querySelector('circle');

  if (correct) {
    if (tileCircle) {
      tileCircle.classList.add('tile-correct-pop');
      // ✓ overlaid as SVG text in the group
      const ns = 'http://www.w3.org/2000/svg';
      const checkEl = document.createElementNS(ns, 'text');
      checkEl.setAttribute('text-anchor', 'middle');
      checkEl.setAttribute('dominant-baseline', 'central');
      const svgEl = tilesEl.querySelector('svg');
      const curK = svgEl ? d3.zoomTransform(svgEl).k : 1;
      checkEl.setAttribute('font-size', String(10 / Math.max(curK, 1)));
      checkEl.setAttribute('font-weight', '900');
      checkEl.setAttribute('fill', '#1a1a1a');
      checkEl.setAttribute('pointer-events', 'none');
      checkEl.setAttribute('class', 'tile-correct-check');
      checkEl.textContent = '✓';
      clickedTile.appendChild(checkEl);
    }
  } else {
    if (tileCircle) {
      tileCircle.classList.add('tile-wrong-shake');
    }
  }

  if (correct) {
    setTimeout(() => {
      _distLocked = false;
      processDistrictGuessTile(dist, fullGuess, true);
    }, 650);
  } else {
    setTimeout(() => {
      tileCircle?.classList.remove('tile-wrong-shake');
      _distLocked = false;
      processDistrictGuessTile(dist, fullGuess, false);
    }, 480);
  }
}

// Alias used by the D3 map click handlers
const submitDistrictGuess = submitDistrictTile;

function processDistrictGuessTile(dist, fullGuess, correct) {
  if (!correct) guessCount++;
  guessHistory.push({ text: fullGuess, correct, phase: 'district' });
  dbg(`processDistrictGuessTile guess=${fullGuess} correct=${correct} guessCount=${guessCount}`);

  if (correct) {
    startGameOverTransition(true, dist);
    return;
  }

  const wrongCount = guessHistory.filter(g => !g.correct).length;
  if (!hardMode) cluesRevealed = Math.min(wrongCount, FACT_DEFS.length);
  applyMapStage(wrongCount);

  if (guessCount >= MAX_GUESSES) {
    renderGuessHistory();
    renderClues();
    saveGameState();
    startGameOverTransition(false, dist);
    return;
  }

  // Non-game-over wrong guess: rebuild D3 district map after one frame so the compositing
  // layer from the first flash (in submitDistrictTile) has already settled.
  requestAnimationFrame(() => buildDistrictD3Map(todayDistrict.properties.state));

  renderGuessHistory();
  renderClues();
  saveGameState();
}

// Animated game-over reveal: the clicked tile expands to cover the district-tiles container
// (gold for win, CMU red for loss), the container transitions to game-over size underneath,
// then the circle collapses to expose the pre-built game-over map. Spark/confetti fire after.
function startGameOverTransition(won, dist) {
  const tilesEl = document.getElementById('district-tiles');

  // Locate the clicked tile — get its center in fixed (viewport) coordinates.
  const tileG  = tilesEl?.querySelector(`g.district-tile[data-dist="${dist}"]`);
  const circle = tileG?.querySelector('circle');
  let ox = window.innerWidth  / 2;
  let oy = window.innerHeight / 2;
  if (circle) {
    const cr = circle.getBoundingClientRect();
    ox = cr.left + cr.width  / 2;
    oy = cr.top  + cr.height / 2;
  }

  // Radius needed to cover every corner of the full viewport from (ox, oy).
  // Using fixed positioning so the overlay is unaffected by container resizing.
  const dx = Math.max(ox, window.innerWidth  - ox);
  const dy = Math.max(oy, window.innerHeight - oy);
  const diameter = Math.ceil(Math.sqrt(dx * dx + dy * dy)) * 2 + 20;

  const fillColor = won ? '#FDB515' : '#C41230';

  const overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed',
    `left:${ox}px`,
    `top:${oy}px`,
    'width:0',
    'height:0',
    'border-radius:50%',
    `background:${fillColor}`,
    'transform:translate(-50%,-50%)',
    'pointer-events:none',
    'z-index:1000',
    'transition:width 180ms ease-in, height 180ms ease-in',
  ].join(';');
  document.body.appendChild(overlay);

  // Expand to cover the full viewport.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    overlay.style.width  = `${diameter}px`;
    overlay.style.height = `${diameter}px`;
  }));

  // Trigger container resize while the circle is still expanding.
  setTimeout(() => {
    document.getElementById('game-section')?.classList.add('map-collapsed');
  }, 10);

  // Once expansion finishes, build game-over content underneath, then collapse.
  setTimeout(() => {
    endGame(won, { skipAnims: true });

    // Brief settle so the newly-built game-over SVG paints before we uncover it.
    setTimeout(() => {
      overlay.style.transition = 'width 120ms ease-out, height 120ms ease-out, opacity 60ms ease-out 40ms';
      overlay.style.width  = '0';
      overlay.style.height = '0';
      overlay.style.opacity = '0';

      // Fire deferred animations (spark trace + pulse/shake + confetti) once revealed.
      setTimeout(() => {
        overlay.remove();
        if (_gameOverAnimsCallback) {
          _gameOverAnimsCallback();
          _gameOverAnimsCallback = null;
        }
      }, 240);
    }, 60);
  }, 220);
}

// ============================================================
//  REFERENCE PANEL
// ============================================================

// Returns the set of state abbreviations still in play.
// Valid = not yet eliminated by the adjacency-based hot/cold mechanic.
function getValidStates() {
  const all = Object.keys(stateDistrictMap);
  if (!todayDistrict) return new Set(all);
  return new Set(all.filter(abbr => !eliminatedStates.has(abbr)));
}

// Inverted lookup: full name → abbreviation (built from STATE_NAMES)
const STATE_ABBR_BY_NAME = {};
for (const [abbr, name] of Object.entries(STATE_NAMES)) STATE_ABBR_BY_NAME[name] = abbr;

// FIPS code → state abbreviation (for us-atlas TopoJSON)
const FIPS_TO_ABBR = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT',
  '10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL',
  '18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD',
  '25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE',
  '32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND',
  '39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD',
  '47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV',
  '55':'WI','56':'WY'
};

// ============================================================
//  DARK MODE
// ============================================================
function isDarkMode() {
  return document.body.classList.contains('dark-mode') ||
    (!document.body.classList.contains('light-mode') &&
     window.matchMedia('(prefers-color-scheme: dark)').matches);
}

function applyDarkModeClass() {
  const saved = localStorage.getItem('districtguess_theme');
  if (saved === 'dark')  document.body.classList.add('dark-mode');
  if (saved === 'light') document.body.classList.add('light-mode');
}

function toggleDarkMode() {
  const dark = isDarkMode();
  document.body.classList.toggle('dark-mode',  !dark);
  document.body.classList.toggle('light-mode',  dark);
  localStorage.setItem('districtguess_theme', dark ? 'light' : 'dark');
  updateThemeToggle();
  updateUSRefMap(); // repaint D3 reference map with new color scheme
  // Swap Leaflet street tiles to match new theme
  if (map && streetLayer) {
    map.removeLayer(streetLayer);
    streetLayer = L.tileLayer(streetTileUrl(), {
      maxZoom: 19,
      opacity: _streetOpacity,
      attribution: streetTileAttrib(),
    }).addTo(map);
  }
  // Re-apply map tile stage (dark mode skips terrain, prefers satellite)
  if (map) {
    const wrongCount = guessHistory.filter(g => !g.correct).length;
    applyMapStage(wrongCount, gameOver);
  }
  // Update district boundary color for new theme
  if (districtLayer) districtLayer.setStyle(districtStyle());
  // Rebuild game-over context map so colors match new theme
  if (gameOver && todayDistrict) buildDistrictD3Map(todayDistrict.properties.state);
}

function updateThemeToggle() {
  const cb = document.getElementById('settings-dark-toggle');
  if (cb) cb.checked = isDarkMode();
}

// ---- US reference map (clickable states) ----

// ---- D3 AlbersUSA reference map ----

// Returns theme-aware D3 map colors
// Hover fill used in initUSRefMap mouseover — kept in sync here.
const STATE_COLOR = {
  // Light mode
  light: {
    valid:     { fill: '#d4606e', opacity: 1.0 },   // saturated salmon-red — clearly "in play"
    elim:      { fill: '#b8bcc4', opacity: 1.0 },   // blue-gray — clearly "out"
    confirmed: { fill: '#C41230', opacity: 1.0 },   // solid CMU red — the answer
    hover:     '#a01025',                            // darker red — clear interactive feedback
  },
  // Dark mode
  dark: {
    valid:     { fill: '#9b2d3e', opacity: 1.0 },   // medium crimson — warm on dark bg
    elim:      { fill: '#48484a', opacity: 1.0 },   // dark gray — clearly inactive
    confirmed: { fill: '#e8314a', opacity: 1.0 },   // bright red — pops on dark bg
    hover:     '#ff4d62',                            // bright pink-red — obvious on dark
  },
};

function _stateColors(abbr) {
  const c = isDarkMode() ? STATE_COLOR.dark : STATE_COLOR.light;

  if (correctStateGuessed) {
    const confirmed = todayDistrict ? todayDistrict.properties.state : null;
    if (abbr === confirmed) return c.confirmed;
    return c.elim;
  }
  const valid = getValidStates();
  return valid.has(abbr) ? c.valid : c.elim;
}

function _applyStateStyle(sel, abbr) {
  const s = _stateColors(abbr);
  sel.attr('fill', s.fill)
     .attr('stroke', 'none')   // borders drawn as separate white mesh overlay
     .attr('fill-opacity', s.opacity)
     .style('cursor', (!correctStateGuessed && getValidStates().has(abbr)) ? 'pointer' : 'default');
}

// Resize/reposition callouts based on current zoom k.
// k=1 → full offshore + full size; higher k → lerp toward anchor, shrink, fade.
function _updateCalloutsForZoom(k) {
  _usRefZoomK = k || 1;
  const K_FULL = 1.0;
  const K_HIDE = 2.4;
  const t = Math.max(0, Math.min(1, (k - K_FULL) / (K_HIDE - K_FULL)));
  const inv = 1 / k;

  for (const abbr of Object.keys(usRefCallouts)) {
    const co = usRefCallouts[abbr];
    // Callouts stay at their stacked offshore position; only fade out with zoom.
    const x = co.offX;
    const y = co.offY;
    const rx = CALLOUT_RX * inv;
    const ry = CALLOUT_RY * inv;
    const fontSize = 11 * inv;

    co.circle.attr('cx', x).attr('cy', y).attr('rx', rx).attr('ry', ry);
    co.text.attr('x', x).attr('y', y).attr('font-size', fontSize);
    co.line
      .attr('x2', x).attr('y2', y)
      .attr('stroke-width', 0.8 * inv);

    const clickable = !correctStateGuessed && getValidStates().has(abbr);
    const confirmed = correctStateGuessed && todayDistrict && todayDistrict.properties.state === abbr;
    const baseOpacity = (clickable || confirmed) ? 1 : 0.55;
    const opacity = baseOpacity * (1 - t);
    co.group.style('opacity', opacity);
    co.group.style('pointer-events', opacity < 0.15 ? 'none' : null);
  }
}

function _applyCalloutStyle(abbr) {
  const co = usRefCallouts[abbr];
  if (!co) return;
  const s = _stateColors(abbr);
  const clickable = !correctStateGuessed && getValidStates().has(abbr);
  const stroke = isDarkMode() ? '#ffffff' : '#ffffff';
  co.circle
    .attr('fill', s.fill)
    .attr('fill-opacity', s.opacity)
    .attr('stroke', stroke)
    .attr('stroke-width', 1.25)
    .style('cursor', clickable ? 'pointer' : 'default');
  co.line
    .attr('stroke', s.fill)
    .attr('stroke-opacity', 0.7);
  // Opacity is controlled jointly by zoom level and clickability — applied in _updateCalloutsForZoom.
  _updateCalloutsForZoom(_usRefZoomK);
}

let _usRefZoomK = 1;

// Small/dense states that are easy to misclick — render a labeled
// callout badge offshore connected by a leader line.
const CALLOUT_STATES = ['VT', 'NH', 'MA', 'RI', 'CT', 'NJ', 'DE', 'MD'];
const CALLOUT_RX = 14;   // ellipse horizontal radius
const CALLOUT_RY = 8.5;  // ellipse vertical radius
const CALLOUT_GAP = 2;   // vertical pixel gap between stacked ellipses

function _addStateCallouts(g, geojson, pathGen, fipsToFeature) {
  // Collect, sorted north-to-south by each state's bbox upper bound (min y in projection).
  const items = [];
  let maxEast = -Infinity;
  CALLOUT_STATES.forEach((abbr) => {
    const fips = Object.keys(FIPS_TO_ABBR).find(k => FIPS_TO_ABBR[k] === abbr);
    const feature = fipsToFeature[fips];
    if (!feature) return;
    const [cx, cy] = pathGen.centroid(feature);
    if (!isFinite(cx)) return;
    const b = pathGen.bounds(feature); // [[x0,y0],[x1,y1]]
    items.push({ abbr, anchorX: cx, anchorY: cy, topY: b[0][1], eastX: b[1][0] });
    if (b[1][0] > maxEast) maxEast = b[1][0];
  });
  items.sort((a, b) => a.topY - b.topY);

  // Stack left-aligned at a common X just east of the eastmost state's edge.
  const stackX = maxEast + 18 + CALLOUT_RX;

  const layer = g.append('g').attr('class', 'us-ref-callouts');

  // Place labels evenly spaced (N→S order), centered at the mean anchor Y.
  // This is O(n) and guaranteed collision-free regardless of how close anchors are.
  const minSpacing = 2 * CALLOUT_RY + CALLOUT_GAP;
  const nodes = items.map(it => ({
    abbr: it.abbr,
    anchorX: it.anchorX,
    anchorY: it.anchorY,
    x: stackX,
    y: it.anchorY,
  }));
  nodes.sort((a, b) => a.anchorY - b.anchorY);
  const meanAnchorY = nodes.reduce((s, n) => s + n.anchorY, 0) / nodes.length;
  const totalH  = (nodes.length - 1) * minSpacing;
  const startY  = Math.max(CALLOUT_RY + 2,
                    Math.min(REF_VB_H - CALLOUT_RY - totalH - 2,
                      meanAnchorY - totalH / 2));
  nodes.forEach((n, i) => { n.y = startY + i * minSpacing; });

  nodes.forEach(n => {
    const grp = layer.append('g').attr('data-abbr', n.abbr);
    const line = grp.append('line')
      .attr('x1', n.anchorX).attr('y1', n.anchorY)
      .attr('x2', n.x).attr('y2', n.y)
      .attr('stroke-width', 0.8)
      .attr('vector-effect', 'non-scaling-stroke')
      .attr('pointer-events', 'none');
    const circle = grp.append('ellipse')
      .attr('cx', n.x).attr('cy', n.y)
      .attr('rx', CALLOUT_RX).attr('ry', CALLOUT_RY)
      .attr('vector-effect', 'non-scaling-stroke');
    const textSel = grp.append('text')
      .attr('x', n.x).attr('y', n.y)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', 11)
      .attr('font-weight', '700')
      .attr('fill', '#ffffff')
      .attr('pointer-events', 'none')
      .text(n.abbr);

    usRefCallouts[n.abbr] = {
      group: grp, circle, line, text: textSel,
      anchorX: n.anchorX, anchorY: n.anchorY,
      offX: n.x, offY: n.y,
    };

    const tooltip = document.getElementById('us-ref-tooltip');
    circle
      .on('click', () => {
        if (gameOver || correctStateGuessed) return;
        if (!getValidStates().has(n.abbr)) return;
        handleStateSelection(n.abbr);
      })
      .on('mouseover', (event) => {
        if (tooltip && !window.matchMedia('(pointer: coarse)').matches) {
          tooltip.textContent = (STATE_NAMES[n.abbr] || n.abbr) + ' (' + n.abbr + ')';
          tooltip.classList.add('visible');
          tooltip.style.left = (event.clientX + 14) + 'px';
          tooltip.style.top  = (event.clientY - 34) + 'px';
        }
        if (!correctStateGuessed && getValidStates().has(n.abbr)) {
          const hoverColor = isDarkMode() ? STATE_COLOR.dark.hover : STATE_COLOR.light.hover;
          circle.attr('fill', hoverColor).attr('fill-opacity', 1.0);
          // Also flash the actual state path
          const pathEl = usRefLayers[n.abbr];
          if (pathEl) pathEl.attr('fill', hoverColor).attr('fill-opacity', 1.0);
        }
      })
      .on('mousemove', (event) => {
        if (tooltip) {
          tooltip.style.left = (event.clientX + 14) + 'px';
          tooltip.style.top  = (event.clientY - 34) + 'px';
        }
      })
      .on('mouseout', () => {
        if (tooltip) tooltip.classList.remove('visible');
        _applyCalloutStyle(n.abbr);
        const pathEl = usRefLayers[n.abbr];
        if (pathEl) _applyStateStyle(pathEl, n.abbr);
      });

    _applyCalloutStyle(n.abbr);
  });
}

function initUSRefMap() {
  if (usRefMap) return;
  const container = document.getElementById('us-ref-map');

  // Use a fixed coordinate space (viewBox) so the SVG scales with CSS
  const W = REF_VB_W, H = REF_VB_H;

  const svgSel = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('preserveAspectRatio', 'xMidYMid slice')
    .style('display', 'block')
    .style('background', 'transparent')
    .style('touch-action', 'none');  // let D3 zoom own all touch gestures (pinch, two-finger)

  usRefMap    = svgSel.node();
  usRefSvgSel = svgSel;

  // D3 zoom — allow user to pan & scroll-zoom the reference map
  usRefZoom = d3.zoom()
    .scaleExtent([0.7, Infinity])
    .on('zoom', (event) => {
      d3.select(usRefMapGroup).attr('transform', event.transform);
      _updateCalloutsForZoom(event.transform.k);
      // Dismiss the pan/zoom hint on the first user gesture (not programmatic transitions)
      if (event.sourceEvent) {
        const hint = document.getElementById('us-ref-hint');
        if (hint) hint.classList.add('dismissed');
      }
    });
  svgSel.call(usRefZoom);
  // Double-click resets to fitted view instead of zooming in
  svgSel.on('dblclick.zoom', () => zoomUSRefMapToValid(true));

  // Zoom +/- buttons — added once to the wrap, shared by ref-map and district-tiles
  const wrap = container.closest('.us-ref-map-wrap');
  if (wrap && !wrap.querySelector('.map-zoom-btns')) {
    const btnWrap = document.createElement('div');
    btnWrap.className = 'map-zoom-btns';
    btnWrap.innerHTML = '<button class="mzb" data-dir="in" aria-label="Zoom in">+</button>'
                      + '<button class="mzb" data-dir="out" aria-label="Zoom out">−</button>'
                      + '<button class="mzb mzb-fit" data-dir="fit" aria-label="Fit view" title="Fit view">'
                      + svgIcon('maximize', 'mzb-icon') + '</button>';
    wrap.appendChild(btnWrap);
    btnWrap.addEventListener('click', e => {
      const btn = e.target.closest('.mzb');
      if (!btn) return;
      const dir = btn.dataset.dir;
      const tilesHidden = gamePhase === 'state';

      if (dir === 'fit') {
        if (tilesHidden) {
          // State phase: re-fit ref map to the current valid states
          zoomUSRefMapToValid(true);
          return;
        }
        const tilesSvg = d3.select('#district-tiles svg');
        if (tilesSvg.empty() || !districtZoomBehavior) return;
        if (!gameOver) {
          const atActiveFit = btn.classList.contains('at-active-fit');
          if (atActiveFit && districtStateFitTransform) {
            // Second press: zoom back out to the full-state view
            districtSavedTransform = districtStateFitTransform;
            districtUserZoomed = false;
            tilesSvg.transition().duration(500).ease(d3.easeCubicInOut)
              .call(districtZoomBehavior.transform, districtStateFitTransform);
            btn.classList.remove('at-active-fit');
          } else {
            // First press: zoom to remaining active districts
            districtUserZoomed = false;
            districtSavedTransform = null;
            buildDistrictD3Map(todayDistrict?.properties?.state, false, false);
            btn.classList.add('at-active-fit');
          }
          return;
        }
        // Game-over: toggle between district view and national view
        const atNational = btn.classList.contains('at-national');
        if (atNational) {
          const target = districtGameOverTransform || d3.zoomIdentity;
          tilesSvg.transition().duration(600).ease(d3.easeCubicInOut)
            .call(districtZoomBehavior.transform, target);
          btn.classList.remove('at-national');
          btn.querySelector('svg')?.replaceWith(
            Object.assign(document.createRange().createContextualFragment(svgIcon('maximize','mzb-icon')).firstChild)
          );
        } else {
          tilesSvg.transition().duration(600).ease(d3.easeCubicInOut)
            .call(districtZoomBehavior.transform, d3.zoomIdentity);
          btn.classList.add('at-national');
          btn.querySelector('svg')?.replaceWith(
            Object.assign(document.createRange().createContextualFragment(svgIcon('minimize','mzb-icon')).firstChild)
          );
        }
        return;
      }

      const factor = dir === 'in' ? 1.6 : 1 / 1.6;
      if (tilesHidden) {
        usRefSvgSel?.transition().duration(250).call(usRefZoom.scaleBy, factor);
      } else {
        const tilesSvg = d3.select('#district-tiles svg');
        if (!tilesSvg.empty() && districtZoomBehavior) {
          tilesSvg.transition().duration(250).call(districtZoomBehavior.scaleBy, factor);
        }
      }
    });
  }

  const projection = d3.geoAlbersUsa();
  const pathGen    = d3.geoPath().projection(projection);

  const tooltip = document.getElementById('us-ref-tooltip');

  // Use states already loaded from districts-core.topojson — no CDN fetch needed.
  (function renderRefMap() {
    const stateFeatures = Object.values(topoStates).filter(Boolean);
    const geojson = { type: 'FeatureCollection', features: stateFeatures };
    projection.fitSize([W, H], geojson);
    usRefPathGen = pathGen; // save for district overlay

    // Single group for ALL content so zoom transforms everything
    const g = svgSel.append('g');
    usRefMapGroup = g.node();

    stateFeatures.forEach(feature => {
      const abbr = feature.properties && feature.properties.state;
      if (!abbr || !stateDistrictMap[abbr]) return;

      const pathEl = g.append('path')
        .datum(feature)
        .attr('d', pathGen)
        .attr('stroke', 'none')
        .attr('data-abbr', abbr);

      usRefLayers[abbr] = pathEl;
      _applyStateStyle(pathEl, abbr);

      pathEl
        .on('click', () => {
          if (gameOver || correctStateGuessed) return;
          if (!getValidStates().has(abbr)) return;
          handleStateSelection(abbr);
        })
        .on('mouseover', (event) => {
          // Tooltip — desktop/mouse only
          if (tooltip && !window.matchMedia('(pointer: coarse)').matches) {
            tooltip.textContent = (STATE_NAMES[abbr] || abbr) + ' (' + abbr + ')';
            tooltip.classList.add('visible');
            tooltip.style.left = (event.clientX + 14) + 'px';
            tooltip.style.top  = (event.clientY - 34) + 'px';
          }
          // Highlight only clickable states
          if (!correctStateGuessed && getValidStates().has(abbr)) {
            const hoverColor = isDarkMode() ? STATE_COLOR.dark.hover : STATE_COLOR.light.hover;
            pathEl.attr('fill', hoverColor).attr('fill-opacity', 1.0);
          }
        })
        .on('mousemove', (event) => {
          if (tooltip) {
            tooltip.style.left = (event.clientX + 14) + 'px';
            tooltip.style.top  = (event.clientY - 34) + 'px';
          }
        })
        .on('mouseout', () => {
          if (tooltip) tooltip.classList.remove('visible');
          _applyStateStyle(pathEl, abbr);
        });
    });

    // White internal borders
    if (rawTopo && rawTopo.objects.states) {
      g.append('path')
        .datum(topojson.mesh(rawTopo, rawTopo.objects.states, (a, b) => a !== b))
        .attr('d', pathGen)
        .attr('fill', 'none')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1)
        .attr('vector-effect', 'non-scaling-stroke')
        .attr('pointer-events', 'none');

      // Outer US boundary
      g.append('path')
        .datum(topojson.mesh(rawTopo, rawTopo.objects.states, (a, b) => a === b))
        .attr('d', pathGen)
        .attr('fill', 'none')
        .attr('stroke', '#adb5bd')
        .attr('stroke-width', 0.75)
        .attr('vector-effect', 'non-scaling-stroke')
        .attr('pointer-events', 'none');
    }

    // Callouts for small states — build abbr-keyed lookup from our state features
    const fipsToFeature = {};
    stateFeatures.forEach(f => {
      const abbr = f.properties && f.properties.state;
      if (abbr) {
        const fips = Object.keys(FIPS_TO_ABBR).find(k => FIPS_TO_ABBR[k] === abbr);
        if (fips) fipsToFeature[fips] = f;
      }
    });
    _addStateCallouts(g, geojson, pathGen, fipsToFeature);

    // Always fit the ref map to the current valid state set (removes AlbersUSA whitespace)
    zoomUSRefMapToValid(false);
    // If state already confirmed (restored session), draw district overlay immediately
    if (correctStateGuessed && todayDistrict && !gameOver) {
      showDistrictD3Map(todayDistrict.properties.state, true);
    }

    // Re-zoom once the container has real CSS dimensions (fixes mobile timing issue
    // where getBBox() fires before layout settles, leaving the map too zoomed out)
    const refEl = document.getElementById('us-ref-map');
    if (refEl && window.ResizeObserver) {
      let fired = false;
      const ro = new ResizeObserver(() => {
        if (refEl.offsetWidth > 0 && refEl.offsetHeight > 0 && !fired) {
          fired = true;
          ro.disconnect();
          zoomUSRefMapToValid(false);
        }
      });
      ro.observe(refEl);
    }
  })();
}

// Zoom the D3 reference map to the bounding box of still-valid states.
// Pass animated=false for instant placement (e.g., on restore).
function zoomUSRefMapToValid(animated = true) {
  if (!usRefMapGroup || !usRefMap) return;

  // Determine target state set
  const targetSet = correctStateGuessed && todayDistrict
    ? new Set([todayDistrict.properties.state])
    : getValidStates();

  if (targetSet.size === 0) return;

  // Always use the viewBox coordinate space — not CSS pixel dimensions
  const W = REF_VB_W;
  const H = REF_VB_H;

  // Compute bounding box in the group's LOCAL coordinate space
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [abbr, pathEl] of Object.entries(usRefLayers)) {
    if (!targetSet.has(abbr)) continue;
    const bb = pathEl.node().getBBox();
    if (bb.width === 0 && bb.height === 0) continue;
    x0 = Math.min(x0, bb.x);
    y0 = Math.min(y0, bb.y);
    x1 = Math.max(x1, bb.x + bb.width);
    // Include callout bbox so offshore badges stay in frame
    const co = usRefCallouts[abbr];
    if (co) {
      const cb = co.group.node().getBBox();
      if (cb.width > 0 || cb.height > 0) {
        x0 = Math.min(x0, cb.x);
        y0 = Math.min(y0, cb.y);
        x1 = Math.max(x1, cb.x + cb.width);
        y1 = Math.max(y1, cb.y + cb.height);
      }
    }
    y1 = Math.max(y1, bb.y + bb.height);
  }
  if (x0 === Infinity) return;

  const dx = x1 - x0;
  const dy = y1 - y0;
  if (dx === 0 || dy === 0) return;

  const padding = 28;
  // With slice mode, the visible viewBox region is determined by container aspect.
  // pxPerVb = max(cw/W, ch/H) (slice fills the larger axis, crops the other).
  const svgRect = usRefMap.getBoundingClientRect();

  // Skip re-fitting if neither the target bbox NOR the container size has changed since the
  // last call — preserves the user's pan/zoom when a guess doesn't change the valid set.
  // Container size MUST be part of the key: the computed scale depends on it, so a resize
  // (e.g. the initial fit ran behind the welcome modal at the wrong size, then the
  // ResizeObserver fires once layout settles) must force a re-fit. Otherwise the stale
  // initial scale persists until the first guess changes the bbox — looking like a zoom-out.
  const bboxKey = `${x0.toFixed(1)},${y0.toFixed(1)},${x1.toFixed(1)},${y1.toFixed(1)}@${Math.round(svgRect.width)}x${Math.round(svgRect.height)}`;
  if (_lastFitBBoxKey === bboxKey) return;
  _lastFitBBoxKey = bboxKey;
  const pxPerVb = (svgRect.width > 0 && svgRect.height > 0)
    ? Math.max(svgRect.width / W, svgRect.height / H)
    : 1;
  const visW = svgRect.width  > 0 ? svgRect.width  / pxPerVb : W;
  const visH = svgRect.height > 0 ? svgRect.height / pxPerVb : H;
  // Always use min-fit so neither axis overflows the visible region.
  const fit = Math.min((visW - 2 * padding) / dx, (visH - 2 * padding) / dy);
  // No minimum scale — allow zooming out to show the full US at game start.
  const scale = Math.max(0.3, fit);
  const cx = x0 + dx / 2, cy = y0 + dy / 2;

  // Sync through d3.zoom so user pan/scroll starts from the correct position
  const zTransform = d3.zoomIdentity.translate(W / 2, H / 2).scale(scale).translate(-cx, -cy);
  if (usRefZoom && usRefSvgSel) {
    if (animated) {
      usRefSvgSel.transition().duration(700).ease(d3.easeCubicInOut)
        .call(usRefZoom.transform, zTransform);
    } else {
      usRefSvgSel.call(usRefZoom.transform, zTransform);
    }
  } else {
    // Fallback if zoom not yet initialized
    d3.select(usRefMapGroup).attr('transform', `translate(${tx},${ty}) scale(${scale})`);
  }
}

function updateUSRefMap() {
  if (!usRefMap) return;
  for (const [abbr, pathEl] of Object.entries(usRefLayers)) {
    _applyStateStyle(pathEl, abbr);
  }
  for (const abbr of Object.keys(usRefCallouts)) {
    _applyCalloutStyle(abbr);
  }
}

function renderStateChips() {
  const container = document.getElementById('state-chips');
  const countEl   = document.getElementById('state-match-count');
  if (!container) return;

  const validStates = getValidStates();
  countEl.textContent = `${validStates.size} of 50`;

  // Sort: valid first (alpha), then eliminated (alpha)
  const allStates = Object.keys(stateDistrictMap).sort((a, b) =>
    (STATE_NAMES[a] || a).localeCompare(STATE_NAMES[b] || b)
  );

  container.innerHTML = '';
  for (const abbr of allStates) {
    const chip = document.createElement('button');
    chip.className = 'state-chip' + (validStates.has(abbr) ? '' : ' eliminated');
    chip.textContent = abbr;
    chip.title = STATE_NAMES[abbr] || abbr;
    chip.disabled = correctStateGuessed; // lock chips once state is confirmed

    chip.addEventListener('click', () => {
      if (correctStateGuessed || gameOver) return;
      if (!validStates.has(abbr)) return;
      handleStateSelection(abbr);
    });

    container.appendChild(chip);
  }

  // Keep the US ref map in sync
  updateUSRefMap();
}

function lockStateDropdown(stateAbbr, instant = false) {
  gamePhase = 'district';

  // Update chips and US ref map to show only the confirmed state
  renderStateChips();
  updateUSRefMap();
  zoomUSRefMapToValid();

  // Zoom into state and show D3 district map (always — read-only when game is over)
  showDistrictD3Map(stateAbbr, instant);
}

function showDistrictD3Map(stateAbbr, instant = false, animateReveal = false) {
  const mapEl   = document.getElementById('us-ref-map');
  const tilesEl = document.getElementById('district-tiles');
  const labelEl = document.getElementById('ref-label');

  // Hide state chips
  document.getElementById('state-chips-section').classList.add('hidden');

  // Update label
  const count = (stateDistrictMap[stateAbbr] || []).length;
  if (labelEl) {
    if (gameOver && todayDistrict) {
      const answerKey = todayDistrict.properties['state-district'];
      const distPart  = answerKey.split('-').slice(1).join('-');
      const isAL      = count === 1;
      const distLabel = isAL ? 'At-Large' : `District ${parseInt(distPart, 10)}`;
      const won       = guessHistory.some(g => g.correct && g.phase === 'district');
      labelEl.textContent = won
        ? `Answer: ${answerKey} — ${distLabel}`
        : `Answer was: ${answerKey} — ${distLabel}`;
    } else {
      labelEl.textContent = count === 1
        ? 'One district — click to guess'
        : `Pick a district (${count} total)`;
    }
  }

  // Reset zoom state when entering district phase fresh; preserve it on game-over rebuild
  // so a user who was already zoomed into NYC doesn't see a jarring re-zoom on correct guess.
  if (!gameOver) {
    districtUserZoomed        = false;
    districtSavedTransform    = null;
    districtStateFitTransform = null;
  }

  // Dismiss the pan/zoom hint pill when entering district-pick phase
  const hintEl = document.getElementById('us-ref-hint');
  if (hintEl) hintEl.classList.add('dismissed');

  const zoomIn = !instant && !gameOver;

  // If tiles were pre-built at init for this state (and game is not over, which always
  // needs a fresh build with answer highlight), reuse the existing SVG — just reveal
  // it and apply the zoom-in animation without tearing down and rebuilding the DOM.
  const preBuilt = !gameOver
    && _districtBuiltState === stateAbbr
    && tilesEl.querySelector('svg');

  // Ensure tilesEl is visible before building so offsetWidth/offsetHeight are non-zero
  tilesEl.classList.remove('hidden');
  tilesEl.style.opacity = instant ? '1' : '0';
  tilesEl.style.pointerEvents = '';

  if (preBuilt) {
    // Apply zoom animation on the cached SVG so the entry feels smooth even without rebuild
    if (zoomIn && _districtSvgSel && _districtPathSnap && _districtStateFSnap) {
      const stateFC       = { type: 'FeatureCollection', features: _districtStateFSnap };
      const stateBBox     = _districtPathSnap.bounds(stateFC);
      const entryTransform = zoomToBBox(stateBBox, REF_VB_W, REF_VB_H, { margin: 0.85 });
      const refStart      = usRefMap ? d3.zoomTransform(usRefMap) : d3.zoomIdentity;
      districtSavedTransform = entryTransform;
      _districtSvgSel.call(districtZoomBehavior.transform, refStart);
      _districtSvgSel.transition().duration(700).ease(d3.easeCubicInOut)
        .call(districtZoomBehavior.transform, entryTransform);
    }
  } else {
    buildDistrictD3Map(stateAbbr, animateReveal, zoomIn);
  }

  if (instant) {
    mapEl.classList.add('hidden');
    tilesEl.style.opacity = '1';
  } else {
    // Cross-fade: both maps share REF_VB coordinate space so they align during the fade.
    mapEl.style.opacity = '0';
    setTimeout(() => { mapEl.classList.add('hidden'); }, 370);
    tilesEl.style.opacity = '0';
    tilesEl.classList.remove('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      tilesEl.style.opacity = '1';
    }));
  }
}

// ─── District D3 Map ────────────────────────────────────────────────────────
//
// Split into four focused functions:
//   buildDistrictD3Map   — thin coordinator: clears container, builds context, routes
//   _buildDistrictCtx    — creates SVG, projection, zoom behavior; returns shared context
//   _applyDistrictZoom   — picks and applies the correct initial transform
//   _drawGameOverMap     — game-over render (answer highlight, badge, spark, context layers)
//   _drawGameplayTiles   — gameplay render (clickable circles + force simulation)

function buildDistrictD3Map(stateAbbr, animateReveal = false, zoomIn = false) {
  dbg(`buildDistrictD3Map state=${stateAbbr} gameOver=${gameOver} animateReveal=${animateReveal} zoomIn=${zoomIn} districtUserZoomed=${districtUserZoomed} savedK=${districtSavedTransform?.k?.toFixed(2)??'null'}`);
  const tilesEl = document.getElementById('district-tiles');
  tilesEl.classList.toggle('gameover-context', !!gameOver);
  tilesEl.classList.remove('gameover-loss-shake', 'gameover-win-pulse');
  tilesEl.innerHTML = '';

  const ctx = _buildDistrictCtx(stateAbbr, tilesEl);
  if (!ctx) return;

  _applyDistrictZoom(ctx, zoomIn);

  if (gameOver && todayDistrict) {
    _drawGameOverMap(ctx, animateReveal);
  } else {
    _drawGameplayTiles(ctx);
  }
}

// Creates the SVG, projection, and zoom behavior.  Returns a context object
// shared by _applyDistrictZoom and the two render functions.
function _buildDistrictCtx(stateAbbr, tilesEl) {
  const stateFeatures = districts.filter(f => f.properties.state === stateAbbr);
  if (!stateFeatures.length) return null;

  // Density-aware circle sizing: dense states (TX, CA) get smaller circles.
  const densityScale   = 1; // reserved; circles are always the same screen size
  const targetCirclePx = 14;

  // Hot/cold inference from guess history
  const answerKey       = todayDistrict?.properties['state-district'];
  const answerNeighbors = new Set(adjMap.get(answerKey) || []);
  const wrongGuesses    = guessHistory.filter(g => g.phase === 'district' && !g.correct);

  let possibleKeys = new Set(stateFeatures.map(f => f.properties['state-district']));
  const hotGuessKeys = new Set(), coldGuessKeys = new Set();
  for (const guess of wrongGuesses) {
    const key  = guess.text;
    const dist = key.split('-').slice(1).join('-');
    if (answerNeighbors.has(key)) {
      hotGuessKeys.add(dist);
      const nbrSet = new Set(adjMap.get(key) || []);
      for (const k of [...possibleKeys]) {
        if (k !== key && !nbrSet.has(k)) possibleKeys.delete(k);
      }
      possibleKeys.delete(key);
    } else {
      coldGuessKeys.add(dist);
      possibleKeys.delete(key);
      for (const nbr of (adjMap.get(key) || [])) possibleKeys.delete(nbr);
    }
  }
  const hotKeys  = hotGuessKeys;
  const coldKeys = new Set(
    stateFeatures.map(f => f.properties['state-district'])
      .filter(k => !possibleKeys.has(k))
      .map(k => k.split('-').slice(1).join('-'))
      .filter(d => !hotGuessKeys.has(d))
  );

  const wonDist     = guessHistory.find(g => g.phase === 'district' && g.correct);
  const wonDistPart = wonDist ? wonDist.text.split('-').slice(1).join('-') : null;
  const isAtLarge   = stateFeatures.length === 1;

  // SVG coordinate space — matches the ref map's REF_VB so cross-fades align.
  // cssScale = min(w/W, h/H) mirrors the browser's xMidYMid "meet" scaling.
  const cssW    = tilesEl.offsetWidth  || REF_VB_W;
  const cssH    = tilesEl.offsetHeight || REF_VB_H;
  const cssScale = Math.min(cssW / REF_VB_W, cssH / REF_VB_H);
  const W = REF_VB_W, H = REF_VB_H;
  const dark = isDarkMode();

  const stateFC  = { type: 'FeatureCollection', features: stateFeatures };
  const allStatesFC = { type: 'FeatureCollection', features: Object.values(topoStates).filter(Boolean) };
  const projection  = d3.geoAlbersUsa().fitExtent([[10, 10], [W - 10, H - 10]], allStatesFC);
  const pathGen     = d3.geoPath().projection(projection);
  const stateBBox   = pathGen.bounds(stateFC);
  const stateFitTransform = zoomToBBox(stateBBox, W, H, { margin: 0.85, maxScale: W / 12 });

  dbg(`SVG W=${W} H=${H} cssScale=${cssScale.toFixed(2)} container=${cssW}×${cssH} possibleKeys=${possibleKeys.size}/${stateFeatures.length}`);

  const svg = d3.select(tilesEl)
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('width', '100%').attr('height', '100%')
    .style('display', 'block')
    .style('touch-action', 'none');

  const g = svg.append('g');

  // Cache for showDistrictD3Map to reuse on reveal without a full rebuild
  _districtSvgSel     = svg;
  _districtPathSnap   = pathGen;
  _districtStateFSnap = stateFeatures;
  _districtBuiltState = stateAbbr;

  // Zoom behavior — defined here so the handler captures the context constants
  // (densityScale, targetCirclePx, cssScale, W) without threading them explicitly.
  districtZoomBehavior = d3.zoom()
    .scaleExtent([0.3, Infinity])
    .on('zoom', event => {
      g.attr('transform', event.transform);
      const k  = event.transform.k;
      const rk = targetCirclePx / (k * cssScale);

      // Gameplay circles: radius, stroke, text
      g.select('.dist-icons').selectAll('circle')
        .attr('r', rk)
        .attr('stroke-width', 1.5 / k);
      g.select('.dist-icons').selectAll('text').each(function() {
        if (this.parentNode && this.parentNode.querySelector('rect')) return; // skip badge text
        const baseSize = Math.min(this.textContent.length > 2 ? 8 : 9, targetCirclePx);
        d3.select(this).attr('font-size', `${baseSize / (k * cssScale)}px`);
      });
      g.select('.dist-connectors').selectAll('line').attr('stroke-width', 0.8 / k);
      g.select('.dist-connectors').attr('display', k > 1.5 ? 'none' : null);

      // Game-over pill badge: reposition + resize so it stays fixed on screen
      const leader = g.select('.dist-leader');
      if (!leader.empty()) {
        const ldbx0 = +leader.attr('data-dbx0'), ldbx1 = +leader.attr('data-dbx1');
        const ldby0 = +leader.attr('data-dby0'), ldby1 = +leader.attr('data-dby1');
        const nby = (ldby0 + ldby1) / 2;
        const badgeG   = g.select('.dist-icons');
        const label    = badgeG.select('text').text();
        const hasIcon  = !badgeG.select('.gc-icon-svg').empty();
        const iconSize = 13 / (k * cssScale), iconGap = 4 / (k * cssScale);
        const pH = 26 / (k * cssScale);
        const pW = (label.length * 7.5 + 22) / (k * cssScale) + (hasIcon ? iconSize + iconGap : 0);
        let nbx = ldbx1 + 10 / (k * cssScale) + pW / 2;
        if (nbx + pW / 2 > W * 0.94) nbx = ldbx0 - 10 / (k * cssScale) - pW / 2;
        leader.attr('x2', nbx).attr('y2', nby).attr('stroke-width', 1 / (k * cssScale));
        g.selectAll('.dist-leader').attr('stroke-width', 1 / k);
        badgeG.attr('transform', `translate(${nbx},${nby})`);
        badgeG.select('rect')
          .attr('width', pW).attr('height', pH).attr('rx', pH / 2)
          .attr('x', -pW / 2).attr('y', -pH / 2)
          .attr('stroke-width', 1 / (k * cssScale));
        if (hasIcon) {
          const iconX = -pW / 2 + 7 / (k * cssScale) + iconSize / 2;
          badgeG.select('.gc-icon-svg')
            .attr('transform', `translate(${iconX},0) scale(${iconSize / 24}) translate(-12,-12)`);
          badgeG.select('text').attr('x', iconSize / 2 + iconGap / 2);
        }
        badgeG.select('text')
          .attr('font-size', `${12 / (k * cssScale)}px`)
          .attr('letter-spacing', 0.3 / (k * cssScale));
      }

      // Retune simulation so tiles stay collision-free at the new zoom level
      if (districtSimulation && !gameOver && districtSimulation._applyIconPositions && !_tileZoomInAnimating) {
        const newCollide  = 16 / (k * cssScale * densityScale);
        const newStrength = Math.min(0.98, 0.6 + (k - 1) * 0.15);
        districtSimulation
          .force('collide', d3.forceCollide(d => d.isCold ? newCollide * 0.25 : d.isHot ? newCollide * 0.45 : newCollide))
          .force('x', d3.forceX(d => d.ox).strength(newStrength))
          .force('y', d3.forceY(d => d.oy).strength(newStrength))
          .alpha(1).stop();
        districtSimulation.tick(Math.ceil(Math.log(districtSimulation.alphaMin() / districtSimulation.alpha()) / Math.log(1 - districtSimulation.alphaDecay())));
        districtSimulation._applyIconPositions();
      }

      // Context layers fade in with zoom (game-over only for counties; gameplay keeps fixed opacity)
      if (gameOver) {
        const countyOpacity = k > 3 ? Math.min(0.65, (k - 3) * 0.25) : 0;
        g.select('.context-counties').attr('opacity', countyOpacity);
      }
      const fadeOpacity = k > 2 ? Math.min(1, (k - 2) * 0.35) : 0;
      g.select('.context-urban').attr('opacity', fadeOpacity);
      g.select('.context-roads').attr('opacity', fadeOpacity);

      if (event.sourceEvent) {
        districtUserZoomed     = true;
        districtSavedTransform = event.transform;
        document.querySelector('.mzb-fit')?.classList.remove('at-active-fit');
      }
    });
  svg.call(districtZoomBehavior).on('dblclick.zoom', null);

  return { svg, g, pathGen, projection, cssScale, W, H, dark, tilesEl, stateAbbr,
           stateFeatures, stateFC, stateBBox, stateFitTransform,
           densityScale, targetCirclePx,
           possibleKeys, hotKeys, coldKeys,
           wonDist, wonDistPart, isAtLarge, answerKey };
}

// Decides and applies the initial zoom transform (zoomIn animation, game-over zoom,
// or restore from saved state).  Must be called after _buildDistrictCtx.
function _applyDistrictZoom(ctx, zoomIn) {
  const { svg, pathGen, stateFeatures, stateFC, stateBBox, possibleKeys, W, H } = ctx;

  if (zoomIn) {
    const refStartTransform = usRefMap ? d3.zoomTransform(usRefMap) : d3.zoomIdentity;
    const possFeatures  = stateFeatures.filter(f => possibleKeys.has(f.properties['state-district']));
    const entryBBox     = possFeatures.length
      ? pathGen.bounds({ type: 'FeatureCollection', features: possFeatures })
      : stateBBox;
    const entryTransform = zoomToBBox(entryBBox, W, H, { margin: 0.85 });
    dbg(`zoomIn start k=${refStartTransform.k.toFixed(2)} target k=${entryTransform.k.toFixed(2)} x=${entryTransform.x.toFixed(0)} y=${entryTransform.y.toFixed(0)}`);
    districtSavedTransform = entryTransform;
    _tileZoomInAnimating = true;
    svg.call(districtZoomBehavior.transform, refStartTransform);
    svg.transition().duration(700).ease(d3.easeCubicInOut)
      .call(districtZoomBehavior.transform, entryTransform)
      .on('end', () => { _tileZoomInAnimating = false; });

  } else if (gameOver && todayDistrict) {
    svg.interrupt(); // cancel any running zoomIn so game-over zoom wins
    const answerF    = stateFeatures.find(f => f.properties['state-district'] === todayDistrict.properties['state-district']);
    const zoomTarget = answerF || (stateFeatures.length ? stateFC : null);
    if (zoomTarget) {
      // Pad the district bbox by 30% of the state extent in each axis, clamped to state borders.
      // A tall state (NJ, VT) adds vertical context; a wide state (KS, NE) adds horizontal.
      const [[dx0, dy0], [dx1, dy1]] = pathGen.bounds(zoomTarget);
      const [[sx0, sy0], [sx1, sy1]] = pathGen.bounds(stateFC);
      const padX = (sx1 - sx0) * 0.30, padY = (sy1 - sy0) * 0.30;
      const paddedBBox = [
        [Math.max(sx0, dx0 - padX), Math.max(sy0, dy0 - padY)],
        [Math.min(sx1, dx1 + padX), Math.min(sy1, dy1 + padY)],
      ];
      const goTransform = zoomToBBox(paddedBBox, W, H, { minScale: 1.2, maxScale: 40 });
      districtGameOverTransform = goTransform;
      svg.call(districtZoomBehavior.transform, goTransform);
    }

  } else {
    // Guess rebuild: preserve current zoom so tiles don't appear to resize.
    // On the very first build with no saved transform, fit to possible districts.
    if (districtSavedTransform) {
      svg.call(districtZoomBehavior.transform, districtSavedTransform);
    } else {
      const possFeatures  = stateFeatures.filter(f => possibleKeys.has(f.properties['state-district']));
      const activeBBox    = possFeatures.length
        ? pathGen.bounds({ type: 'FeatureCollection', features: possFeatures })
        : stateBBox;
      const activeTransform = zoomToBBox(activeBBox, W, H, { margin: 0.85 });
      dbg(`active-zoom possibleKeys=${ctx.possibleKeys.size}/${stateFeatures.length} k=${activeTransform.k.toFixed(2)}`);
      svg.call(districtZoomBehavior.transform, activeTransform);
      districtSavedTransform    = activeTransform;
      districtStateFitTransform = activeTransform;
    }
  }
}

// Renders the game-over view: national context, district boundary lines, answer highlight,
// leader-line badge, and deferred spark/confetti animations.
function _drawGameOverMap(ctx, animateReveal) {
  const { svg, g, pathGen, projection, cssScale, W, H, dark, tilesEl, stateAbbr,
          stateFeatures, stateFC, wonDist, wonDistPart, isAtLarge, answerKey } = ctx;

  const answerLabel = isAtLarge ? stateAbbr : answerKey;

  // ── National context layers ───────────────────────────────────────────────
  if (rawTopo) {
    const allStateFills = Object.values(topoStates).filter(f => f.properties?.state !== stateAbbr);

    g.append('g').attr('class', 'context-state-fills').attr('pointer-events', 'none')
      .selectAll('path').data(allStateFills).join('path').attr('d', pathGen)
      .attr('fill', dark ? 'rgba(255,255,255,0.06)' : 'rgba(100,100,120,0.12)')
      .attr('stroke', 'none');

    // Clip roads/urban to the US land boundary
    const clipId = 'gameover-us-land-clip';
    let defs = svg.select('defs');
    if (defs.empty()) defs = svg.insert('defs', ':first-child');
    defs.selectAll(`#${clipId}`).remove();
    defs.append('clipPath').attr('id', clipId)
      .append('path').datum(topojson.merge(rawTopo, rawTopo.objects.districts.geometries)).attr('d', pathGen);

    if (topoUrban) {
      g.append('g').attr('class', 'context-urban')
        .attr('clip-path', `url(#${clipId})`).attr('opacity', 0).attr('pointer-events', 'none')
        .selectAll('path').data(topoUrban.features).join('path').attr('d', pathGen)
        .attr('fill', dark ? 'rgba(255,255,255,0.06)' : 'rgba(80,80,140,0.08)').attr('stroke', 'none');
    }
    if (topoRoads) {
      g.append('g').attr('class', 'context-roads')
        .attr('clip-path', `url(#${clipId})`).attr('opacity', 0).attr('pointer-events', 'none')
        .selectAll('path').data(topoRoads.features).join('path').attr('d', pathGen)
        .attr('fill', 'none')
        .attr('stroke', dark ? 'rgba(255,255,255,0.14)' : 'rgba(60,60,100,0.18)')
        .attr('stroke-width', 0.5).attr('vector-effect', 'non-scaling-stroke');
    }
    if (topoCounties) {
      g.append('g').attr('class', 'context-counties')
        .attr('clip-path', `url(#${clipId})`).attr('opacity', 0).attr('pointer-events', 'none')
        .selectAll('path').data(topoCounties.features).join('path').attr('d', pathGen)
        .attr('fill', 'none')
        .attr('stroke', dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.45)')
        .attr('stroke-width', 0.5).attr('stroke-dasharray', '2 3').attr('vector-effect', 'non-scaling-stroke');
    }

    // Sync context-layer opacity to current zoom (zoom handler fired before these existed)
    {
      const k0 = d3.zoomTransform(svg.node()).k || 1;
      const cOp = k0 > 3 ? Math.min(0.65, (k0 - 3) * 0.25) : 0;
      const fOp = k0 > 2 ? Math.min(1,    (k0 - 2) * 0.35) : 0;
      g.select('.context-counties').attr('opacity', cOp);
      g.select('.context-roads').attr('opacity', fOp);
      g.select('.context-urban').attr('opacity', fOp);
    }

    g.append('path')
      .datum(topojson.mesh(rawTopo, rawTopo.objects.districts,
        (a, b) => a !== b && a.properties?.state === b.properties?.state && a.properties?.state !== stateAbbr))
      .attr('class', 'context-district-lines').attr('d', pathGen)
      .attr('fill', 'none')
      .attr('stroke', dark ? 'rgba(255,255,255,0.22)' : 'rgba(60,60,90,0.50)')
      .attr('stroke-width', 0.5).attr('vector-effect', 'non-scaling-stroke').attr('pointer-events', 'none');

    g.append('g').attr('class', 'context-state-borders').attr('pointer-events', 'none')
      .selectAll('path').data(allStateFills).join('path').attr('d', pathGen)
      .attr('fill', 'none')
      .attr('stroke', dark ? 'rgba(255,255,255,0.30)' : 'rgba(40,40,60,0.60)')
      .attr('stroke-width', 0.7).attr('vector-effect', 'non-scaling-stroke');
  }

  // ── Target-state district boundaries ─────────────────────────────────────
  stateFeatures.forEach(f => {
    g.append('path').datum(f)
      .attr('data-key', f.properties['state-district']).attr('d', pathGen)
      .attr('fill', 'none')
      .attr('stroke', dark ? 'rgba(255,255,255,0.35)' : 'rgba(60,60,80,0.25)')
      .attr('stroke-width', 0.8).attr('vector-effect', 'non-scaling-stroke').attr('pointer-events', 'none');
  });

  // ── Answer district highlight + spark + badge ─────────────────────────────
  const answerFeature = stateFeatures.find(f => f.properties['state-district'] === answerKey);
  if (answerFeature) {
    const won = !!wonDist;

    const answerPath = g.append('path').datum(answerFeature).attr('d', pathGen)
      .attr('fill',   dark ? 'rgba(196,18,48,0.55)' : 'rgba(196,18,48,0.30)')
      .attr('stroke', '#C41230').attr('stroke-width', 2)
      .attr('vector-effect', 'non-scaling-stroke').attr('pointer-events', 'none');

    const node = answerPath.node();
    const len  = node.getTotalLength ? node.getTotalLength() : 0;
    const sparkLayer = g.append('g').attr('class', 'spark-layer').attr('pointer-events', 'none');

    // Spark trace + pulse/shake + confetti: deferred until the reveal circle collapses,
    // or fired immediately when animateReveal is true (theme change / restore path).
    _gameOverAnimsCallback = function() {
      if (len > 0) {
        const k0    = d3.zoomTransform(svg.node()).k || 1;
        const spark = sparkLayer.append('circle')
          .attr('r', 4 / k0).attr('pointer-events', 'none').attr('fill', '#fffbe8')
          .style('filter', 'drop-shadow(0 0 4px #fff) drop-shadow(0 0 10px #ffb020) drop-shadow(0 0 16px #ff7700)');
        const p0 = node.getPointAtLength(0);
        spark.attr('cx', p0.x).attr('cy', p0.y);

        function emitEmber(x, y) {
          const k   = d3.zoomTransform(svg.node()).k || 1;
          const ang = Math.random() * Math.PI * 2;
          const d   = (6 + Math.random() * 9) / k;
          sparkLayer.append('circle')
            .attr('cx', x).attr('cy', y).attr('r', (1.5 + Math.random() * 1.2) / k)
            .attr('fill', Math.random() < 0.5 ? '#ffb020' : '#ff5500').attr('pointer-events', 'none')
            .style('filter', 'drop-shadow(0 0 3px #ff8800)')
            .transition().duration(350 + Math.random() * 200).ease(d3.easeCubicOut)
              .attr('cx', x + Math.cos(ang) * d).attr('cy', y + Math.sin(ang) * d)
              .attr('r', 0).style('opacity', 0).remove();
        }

        const LAPS = 5, LAP_MS = 3000, t0 = performance.now();
        (function frame(now) {
          const elapsed = now - t0;
          const pt = node.getPointAtLength(((elapsed % LAP_MS) / LAP_MS) * len);
          spark.attr('cx', pt.x).attr('cy', pt.y);
          if (Math.random() < 0.45) emitEmber(pt.x, pt.y);
          if (elapsed < LAPS * LAP_MS) requestAnimationFrame(frame);
          else spark.transition().duration(300).attr('r', 0).style('opacity', 0).remove();
        })(t0);
      }

      if (!won) {
        tilesEl.classList.add('gameover-loss-shake');
      } else {
        tilesEl.classList.add('gameover-win-pulse');
        setTimeout(() => requestAnimationFrame(() => {
          const svgEl   = svg.node();
          const svgRect = svgEl.getBoundingClientRect();
          const { k, x: tx, y: ty } = d3.zoomTransform(svgEl);
          const xOff = (svgRect.width  - W * cssScale) / 2;
          const yOff = (svgRect.height - H * cssScale) / 2;
          const [dcx, dcy] = answerFeature ? pathGen.centroid(answerFeature) : [W / 2, H / 2];
          const sx = svgRect.left + xOff + (tx + dcx * k) * cssScale;
          const sy = svgRect.top  + yOff + (ty + dcy * k) * cssScale;
          launchBoundaryConfetti([{ x: sx, y: sy }]);
        }), 900);
      }
    };
    if (animateReveal) { _gameOverAnimsCallback(); _gameOverAnimsCallback = null; }

    // ── Leader line + pill badge ──────────────────────────────────────────
    const initK  = d3.zoomTransform(svg.node()).k || 1;
    const initR  = Math.max(1, 13 / initK);
    const [[dbx0, dby0], [dbx1, dby1]] = pathGen.bounds(answerFeature);
    const screenGap = 18 / (initK * cssScale);
    let bx = dbx1 + screenGap;
    let by = (dby0 + dby1) / 2;
    if (bx + initR > W - 4) bx = dbx0 - screenGap;
    bx = Math.max(initR + 4, Math.min(W - initR - 4, bx));
    by = Math.max(initR + 4, Math.min(H - initR - 4, by));

    g.append('line').attr('class', 'dist-leader')
      .attr('x1', dbx1).attr('y1', by).attr('x2', bx).attr('y2', by)
      .attr('stroke', dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)')
      .attr('stroke-width', 1 / (initK * cssScale)).attr('pointer-events', 'none')
      .attr('data-dbx0', dbx0).attr('data-dbx1', dbx1)
      .attr('data-dby0', dby0).attr('data-dby1', dby1);

    const iconSize = 13 / (initK * cssScale), iconGap = 4 / (initK * cssScale);
    const pillH = 26 / (initK * cssScale);
    const pillW = (answerLabel.length * 7.5 + 22) / (initK * cssScale) + iconSize + iconGap;
    const badge = g.append('g').attr('class', 'dist-icons').attr('transform', `translate(${bx},${by})`);
    badge.append('rect')
      .attr('x', -pillW / 2).attr('y', -pillH / 2).attr('width', pillW).attr('height', pillH)
      .attr('rx', pillH / 2)
      .attr('fill', 'rgba(196,18,48,0.82)').attr('stroke', 'rgba(255,255,255,0.35)')
      .attr('stroke-width', 1 / (initK * cssScale));

    const iconX    = -pillW / 2 + 7 / (initK * cssScale) + iconSize / 2;
    const iconScale = iconSize / 24;
    const iconG = badge.append('g').attr('class', 'gc-icon-svg')
      .attr('transform', `translate(${iconX},0) scale(${iconScale}) translate(-12,-12)`)
      .attr('fill', 'none').attr('stroke', '#fff')
      .attr('stroke-width', 2).attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round')
      .html(wonDist ? ICON_PATHS.checkCircle : ICON_PATHS.xCircle);
    iconG.selectAll('path, circle, line, polyline').attr('vector-effect', 'non-scaling-stroke');

    badge.append('text')
      .attr('x', iconSize / 2 + iconGap / 2)
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('font-size', `${12 / (initK * cssScale)}px`).attr('font-weight', '600')
      .attr('fill', '#fff').attr('letter-spacing', 0.3 / (initK * cssScale))
      .attr('pointer-events', 'none').text(answerLabel);
  }

  // ── State outline (topmost) ───────────────────────────────────────────────
  const stateOutline = topoStates[stateAbbr];
  if (stateOutline) {
    g.append('path').datum(stateOutline).attr('d', pathGen)
      .attr('fill', 'none').attr('stroke', dark ? '#aaa' : '#555')
      .attr('stroke-width', 2).attr('vector-effect', 'non-scaling-stroke').attr('pointer-events', 'none');
  }
  g.select('.dist-leader').raise();
  g.select('.dist-icons').raise();
  g.select('.spark-layer').raise();
}

// Renders the gameplay tile view: state context fill, clickable circles with
// hot/cold styling, connector lines, and a force-directed collision layout.
function _drawGameplayTiles(ctx) {
  const { svg, g, pathGen, projection, cssScale, W, H, dark, stateAbbr,
          stateFeatures, stateFC, densityScale, targetCirclePx,
          possibleKeys, hotKeys, coldKeys, wonDist, wonDistPart, isAtLarge,
          stateFitTransform } = ctx;

  // Other states as a muted context
  const otherStateFills = Object.values(topoStates).filter(f => f && f.properties?.state !== stateAbbr);
  g.append('g').attr('class', 'context-other-states').attr('pointer-events', 'none')
    .selectAll('path').data(otherStateFills).join('path').attr('d', pathGen)
    .attr('fill', dark ? 'rgba(255,255,255,0.05)' : 'rgba(160,160,175,0.25)')
    .attr('stroke', dark ? 'rgba(255,255,255,0.12)' : 'rgba(130,130,150,0.45)')
    .attr('stroke-width', 0.4).attr('vector-effect', 'non-scaling-stroke');

  // Active state surface fill
  const fillG = g.append('g').attr('class', 'state-fill');
  stateFeatures.forEach(f => {
    fillG.append('path').datum(f).attr('d', pathGen)
      .attr('style', 'fill: var(--surface);').attr('stroke', 'none').attr('pointer-events', 'none');
  });

  // County lines — always visible in gameplay (no zoom threshold), clipped to active state
  const stateOutline = topoStates[stateAbbr];
  if (topoCounties && stateOutline) {
    const clipId = `gameplay-county-clip-${stateAbbr}`;
    svg.append('defs').append('clipPath').attr('id', clipId)
      .append('path').attr('d', pathGen(stateOutline));
    g.append('g').attr('class', 'context-counties').attr('pointer-events', 'none')
      .attr('clip-path', `url(#${clipId})`).attr('opacity', 0.45)
      .selectAll('path').data(topoCounties.features).join('path').attr('d', pathGen)
      .attr('fill', 'none')
      .attr('stroke', dark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.35)')
      .attr('stroke-width', 0.5).attr('stroke-dasharray', '2 3')
      .attr('vector-effect', 'non-scaling-stroke');
  }

  // State border
  if (stateOutline) {
    g.append('path').datum(stateOutline).attr('class', 'state-border').attr('d', pathGen)
      .attr('fill', 'none').attr('stroke', dark ? '#999' : '#555')
      .attr('stroke-width', 2).attr('vector-effect', 'non-scaling-stroke').attr('pointer-events', 'none');
  }

  // Build node data — only possible-answer districts get a tile
  const nodes = stateFeatures.filter(f => possibleKeys.has(f.properties['state-district'])).map(f => {
    const sdKey = f.properties['state-district'];
    const dist  = sdKey?.split('-').slice(1).join('-') || '00';
    const label = isAtLarge ? 'AL' : String(parseInt(dist, 10));
    const isHot = hotKeys.has(dist), isCold = coldKeys.has(dist);
    const refPoint  = POINT_OVERRIDES[sdKey] || districtPoints[sdKey] || d3.geoCentroid(f);
    const projected = projection(refPoint);
    const [ox, oy]  = projected && isFinite(projected[0]) ? projected : [W / 2, H / 2];
    return { dist, label, isWrong: isHot || isCold, isCorrect: wonDistPart === dist,
             isHot, isCold, x: ox, y: oy, ox, oy };
  });
  nodes.sort((a, b) => (a.isCold ? 0 : a.isHot ? 1 : 2) - (b.isCold ? 0 : b.isHot ? 1 : 2));

  // zoomK is the scale that will actually be on screen — use it to size circles so they
  // render correctly before any subsequent zoom event fires.
  const zoomK = districtSavedTransform ? districtSavedTransform.k : stateFitTransform.k;
  const R     = targetCirclePx / (zoomK * cssScale);

  // Connector lines (drawn first so they appear behind circles)
  const lineG   = g.append('g').attr('class', 'dist-connectors');
  const lineEls = nodes.map(d =>
    lineG.append('line')
      .attr('x1', d.ox).attr('y1', d.oy).attr('x2', d.ox).attr('y2', d.oy)
      .attr('stroke', dark ? '#666' : '#aaa').attr('stroke-width', 0.8)
      .attr('stroke-opacity', 0).attr('pointer-events', 'none').node()
  );

  // Clickable tile circles
  const iconG   = g.append('g').attr('class', 'dist-icons');
  const iconEls = nodes.map(d => {
    const disabled  = d.isWrong || d.isCorrect;
    const fillColor = d.isCorrect ? '#2563EB'
                    : d.isCold   ? (dark ? '#333' : '#bbb')
                    : d.isHot    ? (dark ? '#6b3030' : '#d4908a')
                    : '#C41230';
    const textColor = (d.isCold && !dark) ? '#888' : (d.isHot && !dark) ? '#7a2020' : '#fff';
    const opacity   = d.isCold ? 0.18 : d.isHot ? 0.32 : 1;

    const grp = iconG.append('g')
      .attr('transform', `translate(${d.ox},${d.oy})`).attr('data-dist', d.dist)
      .attr('class', 'district-tile').style('cursor', disabled ? 'default' : 'pointer')
      .style('opacity', opacity);
    grp.append('circle').attr('r', R)
      .attr('fill', fillColor).attr('stroke', dark ? '#222' : '#fff').attr('stroke-width', 1.5 / zoomK);
    grp.append('text')
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('font-size', `${Math.min(d.label.length > 2 ? 8 : 9, targetCirclePx) / (zoomK * cssScale)}px`)
      .attr('font-weight', '700').attr('fill', textColor).attr('pointer-events', 'none')
      .text(d.label);
    if (!disabled) {
      grp.on('mouseover', function() { d3.select(this).select('circle').attr('fill', '#a01025'); })
         .on('mouseout',  function() { d3.select(this).select('circle').attr('fill', fillColor); })
         .on('click',     () => submitDistrictGuess(d.dist));
    }
    return grp.node();
  });

  // Force simulation — run synchronously so tiles are at their final positions on first paint
  const collide      = 16 / (zoomK * cssScale * densityScale);
  const forceStrength = Math.min(0.98, 0.6 + (zoomK - 1) * 0.15);

  function applyIconPositions() {
    nodes.forEach((d, i) => {
      d3.select(iconEls[i]).attr('transform', `translate(${d.x},${d.y})`);
      const dx = d.x - d.ox, dy = d.y - d.oy;
      d3.select(lineEls[i])
        .attr('x1', d.ox).attr('y1', d.oy).attr('x2', d.x).attr('y2', d.y)
        .attr('stroke-opacity', Math.sqrt(dx * dx + dy * dy) > 4 ? 1 : 0);
    });
  }

  districtSimulation = d3.forceSimulation(nodes)
    .alphaDecay(0.12).alphaMin(0.01)
    .force('collide', d3.forceCollide(collide))
    .force('x', d3.forceX(d => d.ox).strength(forceStrength))
    .force('y', d3.forceY(d => d.oy).strength(forceStrength))
    .stop();
  districtSimulation.tick(Math.ceil(Math.log(districtSimulation.alphaMin() / districtSimulation.alpha()) / Math.log(1 - districtSimulation.alphaDecay())));
  applyIconPositions();
  districtSimulation._applyIconPositions = applyIconPositions;
}

// skipAnims: true when called from startGameOverTransition — animations are deferred
// until the reveal circle finishes collapsing (_gameOverAnimsCallback fires then).
function endGame(won, { skipAnims = false } = {}) {
  gameOver = true;
  gamePhase = 'gameover';
  if (won) _gameOverTime = Date.now();
  stopTimer();
  cluesRevealed = FACT_DEFS.length;   // reveal all text clues
  applyMapStage(0, true);
  // Ensure state is locked to the answer
  if (!correctStateGuessed) {
    correctStateGuessed = true;
    lockStateDropdown(todayDistrict.properties.state);
  }
  // Always rebuild district tiles at game-over so the answer district gets the highlight
  // showDistrictD3Map updates the label correctly for game-over state
  showDistrictD3Map(todayDistrict.properties.state, true, !skipAnims);
  // Reset the fit-toggle button icon for game-over view
  document.querySelector('.mzb-fit')?.classList.remove('at-national');
  // Pulsing "View Results" arrow overlay on the map
  const tilesEl = document.getElementById('district-tiles');
  if (tilesEl && !tilesEl.querySelector('.gameover-results-arrow')) {
    const arrow = document.createElement('button');
    arrow.className = 'gameover-results-arrow';
    arrow.setAttribute('aria-label', 'View results');
    arrow.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;
    arrow.addEventListener('click', () => { openResultModal(); });
    tilesEl.appendChild(arrow);
  }
  if (!skipAnims) document.getElementById('game-section')?.classList.add('map-collapsed');
  renderClues();
  renderGuessHistory();
  // Add 1 for the winning guess itself; wrong guesses are already counted
  if (won) guessCount += 1;
  // Save stats BEFORE showResult so renderInlinePersonalStats shows current game
  savePersonalStats(won, guessCount, elapsedSeconds);
  lastGameWon = won;
  // Render result content now, but don't auto-open the modal — let the user watch the
  // map-ref reveal animation (boundary draw-in + shake/pulse) on the game-over screen,
  // then open results via the "View Result" banner button when ready.
  showResult(won, false);

  // Auto-prompt feedback every 5 games if not already prompted at this count
  const _fbStats = loadPersonalStats();
  if (_fbStats && _fbStats.played > 0 && _fbStats.played % 5 === 0) {
    const lastPrompted = parseInt(localStorage.getItem(FEEDBACK_PROMPTED_AT) || '0', 10);
    if (lastPrompted < _fbStats.played) {
      localStorage.setItem(FEEDBACK_PROMPTED_AT, String(_fbStats.played));
      setTimeout(() => {
        document.getElementById('result-modal')?.classList.add('hidden');
        document.getElementById('feedback-modal').classList.remove('hidden');
      }, 3000);
    }
  }
  saveGameState();

  // Show the game-over banner so "View Result" / "New Map" are accessible after modal close
  const banner = document.getElementById('already-played-banner');
  const bannerMsg = document.getElementById('banner-msg');
  if (banner) {
    if (bannerMsg) bannerMsg.textContent = won
      ? `You got it — ${todayDistrict.properties['state-district']}!`
      : `The answer was ${todayDistrict.properties['state-district']}.`;
    banner.classList.remove('hidden');
  }

  // Submit to Firebase and render census data
  submitScore(won, guessCount, elapsedSeconds);
  fetchAndRenderCensusPanel(districtDataFor(todayDistrict));
}

// ============================================================
//  RESULT & SHARE
// ============================================================

function _previewProjection(W, H, pad, { centerOnCentroid = false } = {}) {
  // Use AlbersUSA so the district shape matches the district tile map and ref map.
  // For MultiPolygon, fit to the largest sub-polygon so small islands don't
  // blow out the extent.
  const geom = todayDistrict && todayDistrict.geometry;
  let fitFeature = todayDistrict;
  if (geom && geom.type === 'MultiPolygon') {
    const largest = geom.coordinates.reduce((best, poly) => {
      const a = d3.geoArea({ type: 'Feature', geometry: { type: 'Polygon', coordinates: poly } });
      const b = d3.geoArea({ type: 'Feature', geometry: { type: 'Polygon', coordinates: best } });
      return a > b ? poly : best;
    });
    fitFeature = { type: 'Feature', geometry: { type: 'Polygon', coordinates: largest } };
  }
  const projection = d3.geoAlbersUsa().fitExtent([[pad, pad], [W - pad, H - pad]], fitFeature);
  if (centerOnCentroid) {
    // fitExtent centers the bounding box; shift translate so the geographic centroid
    // lands at (W/2, H/2) instead, giving a more natural centered view.
    const centroidGeo = d3.geoCentroid(fitFeature);
    const projected = projection(centroidGeo);
    if (projected) {
      const [tx, ty] = projection.translate();
      projection.translate([tx + (W / 2 - projected[0]), ty + (H / 2 - projected[1])]);
    }
  }
  return projection;
}

function _renderDistrictToBlob() {
  return new Promise((resolve, reject) => {
    if (!todayDistrict || !window.d3) return reject('no district');
    const W = 800, H = 450, pad = 40;
    const dark = isDarkMode();
    const projection = _previewProjection(W, H, pad);
    const pathGen = d3.geoPath(projection);
    const d = pathGen(todayDistrict);
    const stroke = dark ? '#ff6b6b' : '#C41230';

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('xmlns', ns);
    svg.setAttribute('width', W); svg.setAttribute('height', H);

    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', W); bg.setAttribute('height', H);
    bg.setAttribute('fill', dark ? '#252526' : '#f3f4f6');
    svg.appendChild(bg);

    const fill = document.createElementNS(ns, 'path');
    fill.setAttribute('d', d);
    fill.setAttribute('fill', '#C41230');
    fill.setAttribute('fill-opacity', dark ? '0.55' : '0.3');
    svg.appendChild(fill);

    const outline = document.createElementNS(ns, 'path');
    outline.setAttribute('d', d);
    outline.setAttribute('fill', 'none');
    outline.setAttribute('stroke', stroke);
    outline.setAttribute('stroke-width', '3');
    outline.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(outline);

    const url = URL.createObjectURL(
      new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' })
    );
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      canvas.getContext('2d').drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(b => b ? resolve(b) : reject('toBlob failed'), 'image/png');
    };
    img.onerror = () => reject('svg→img failed');
    img.src = url;
  });
}

function renderDistrictPreview(containerId = 'result-district-preview') {
  const container = document.getElementById(containerId);
  if (!container || !todayDistrict || !window.d3) return;
  container.innerHTML = '';

  const pad = 20;
  const W = Math.max(container.offsetWidth  || 440, 100);
  const H = Math.max(container.offsetHeight || 180, 100);
  const dark = isDarkMode();
  const projection = _previewProjection(W, H, pad);
  const pathGen = d3.geoPath(projection);

  // Bounding box of district for filtering roads/urban to visible area
  const [[bx0, by0], [bx1, by1]] = d3.geoBounds(todayDistrict);
  const mg = 0.1;
  const inBounds = f => {
    try {
      const [[fx0, fy0], [fx1, fy1]] = d3.geoBounds(f);
      return fx1 >= bx0 - mg && fx0 <= bx1 + mg && fy1 >= by0 - mg && fy0 <= by1 + mg;
    } catch { return false; }
  };

  const svg = d3.create('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('class', 'district-preview-svg');

  // Urban areas
  if (topoUrban) {
    const urbanG = svg.append('g');
    topoUrban.features.filter(inBounds).forEach(f => {
      urbanG.append('path').attr('d', pathGen(f))
        .attr('fill', dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.09)')
        .attr('stroke', 'none');
    });
  }

  // Roads
  if (topoRoads) {
    const roadsG = svg.append('g');
    topoRoads.features.filter(inBounds).forEach(f => {
      roadsG.append('path').attr('d', pathGen(f))
        .attr('fill', 'none')
        .attr('stroke', dark ? 'rgba(255,255,255,0.2)' : '#bbb')
        .attr('stroke-width', 0.6);
    });
  }

  // Exterior mask: dims area outside the district
  const dPath = pathGen(todayDistrict);
  svg.append('path')
    .attr('d', `M0,0L${W},0L${W},${H}L0,${H}Z ${dPath}`)
    .attr('fill', dark ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.18)')
    .attr('fill-rule', 'evenodd');

  // District fill
  svg.append('path').attr('d', dPath)
    .attr('fill', '#C41230').attr('fill-opacity', dark ? 0.45 : 0.25);

  // District stroke
  svg.append('path').attr('d', dPath)
    .attr('fill', 'none')
    .attr('stroke', dark ? '#ff6b6b' : '#C41230')
    .attr('stroke-width', 2.5).attr('stroke-linejoin', 'round');

  container.appendChild(svg.node());
}

// Burst confetti outward from a set of screen-coordinate {x,y} origin points.
function launchBoundaryConfetti(origins) {
  const isMobile = navigator.maxTouchPoints > 0;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;will-change:transform;transform:translateZ(0)';
  document.body.appendChild(canvas);
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const COLORS = ['#C41230','#ffffff','#ffb020','#ff7700','#fffbe8','#FDB515'];
  const perOrigin = isMobile ? 40 : 80;
  const particles = [];
  for (const o of origins) {
    const count = perOrigin + Math.floor(Math.random() * (isMobile ? 10 : 20));
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 4 + Math.random() * 10;
      particles.push({
        x: o.x, y: o.y,
        w: 5 + Math.random() * 6, h: 2.5 + Math.random() * 3.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 4,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.25,
      });
    }
  }
  // Sort by color so fillStyle switches are minimised across the draw loop.
  particles.sort((a, b) => (a.color < b.color ? -1 : a.color > b.color ? 1 : 0));
  let frame, start;
  function tick(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // All particles share the same opacity at any instant — set it once per frame.
    const alpha = elapsed < 2200 ? 1 : Math.max(0, 1 - (elapsed - 2200) / 1200);
    ctx.globalAlpha = alpha;
    let lastColor = null;
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.10;
      p.angle += p.spin;
      if (p.color !== lastColor) { ctx.fillStyle = p.color; lastColor = p.color; }
      // setTransform replaces save/translate/rotate/restore (4 calls → 1).
      const cos = Math.cos(p.angle), sin = Math.sin(p.angle);
      ctx.setTransform(cos, sin, -sin, cos, p.x, p.y);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (alpha > 0) frame = requestAnimationFrame(tick);
    else { cancelAnimationFrame(frame); canvas.remove(); }
  }
  frame = requestAnimationFrame(tick);
}

function launchConfetti() {
  const isMobile = navigator.maxTouchPoints > 0;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;will-change:transform;transform:translateZ(0)';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const COLORS = ['#C41230','#FDB515','#2563EB','#16a34a','#f97316','#8b5cf6'];
  const count = isMobile ? 70 : 140;
  const particles = Array.from({length: count}, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 100,
    w: 6 + Math.random() * 6,
    h: 3 + Math.random() * 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 4,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.2,
  }));
  particles.sort((a, b) => (a.color < b.color ? -1 : a.color > b.color ? 1 : 0));
  let frame, start;
  function tick(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const alpha = elapsed < 2000 ? 1 : Math.max(0, 1 - (elapsed - 2000) / 800);
    ctx.globalAlpha = alpha;
    let alive = false, lastColor = null;
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.08;
      p.angle += p.spin;
      if (p.y < canvas.height + 20) alive = true;
      if (p.color !== lastColor) { ctx.fillStyle = p.color; lastColor = p.color; }
      const cos = Math.cos(p.angle), sin = Math.sin(p.angle);
      ctx.setTransform(cos, sin, -sin, cos, p.x, p.y);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (alive && elapsed < 3500) frame = requestAnimationFrame(tick);
    else { cancelAnimationFrame(frame); canvas.remove(); }
  }
  frame = requestAnimationFrame(tick);
}

function _showWinWordCloud() {
  const modal = document.getElementById('result-modal');
  if (!modal || modal.querySelector('.win-word-cloud')) return;
  const WORDS = [
    'Winner!', 'Congrats!', 'Nailed it!', 'Bravo!', 'Well done!',
    'Champion!', 'Brilliant!', 'Amazing!', 'Expert!', 'Ace!',
    'Outstanding!', 'Superb!', 'Correct!', 'Spot on!', 'Genius!',
    'Flawless!', 'Victory!', 'You got it!', 'Excellent!', 'Perfect!',
  ];
  const W = window.innerWidth, H = window.innerHeight;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.className = 'win-word-cloud';
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  const COLORS = ['#C41230', '#FDB515', '#d97706', '#92400e', '#b45309', '#78350f'];
  const SIZES  = [11, 14, 17, 21, 26, 32, 40, 50];
  const WEIGHTS = [400, 600, 700, 800, 900];
  for (let i = 0; i < 48; i++) {
    const word   = WORDS[Math.floor(Math.random() * WORDS.length)];
    const size   = SIZES[Math.floor(Math.random() * SIZES.length)];
    const weight = WEIGHTS[Math.floor(Math.random() * WEIGHTS.length)];
    const color  = COLORS[Math.floor(Math.random() * COLORS.length)];
    const alpha  = 0.07 + Math.random() * 0.20;
    const rot    = (Math.random() - 0.5) * 32;
    const x      = -W * 0.12 + Math.random() * W * 1.24;
    const y      = -H * 0.08 + Math.random() * H * 1.16;
    const t = document.createElementNS(ns, 'text');
    t.textContent = word;
    t.setAttribute('x', x); t.setAttribute('y', y);
    t.setAttribute('font-size', size); t.setAttribute('font-weight', weight);
    t.setAttribute('font-family', 'system-ui,sans-serif');
    t.setAttribute('fill', color); t.setAttribute('opacity', alpha);
    t.setAttribute('transform', `rotate(${rot},${x},${y})`);
    t.setAttribute('aria-hidden', 'true');
    svg.appendChild(t);
  }
  modal.insertBefore(svg, modal.firstChild);
}

// Opens the (already-populated) result modal and fires confetti once per game on a win.
// Used by the "View Result" banner button and "Review Result" welcome-splash button —
// the actual content is rendered ahead of time by showResult(won, false) in endGame().
function openResultModal() {
  document.querySelector('.gameover-results-arrow')?.remove();
  const modal = document.getElementById('result-modal');
  modal.classList.remove('hidden');
  switchResultTab('result');
  if (lastGameWon) {
    _showWinWordCloud();
    if (!_resultConfettiFired) {
      _resultConfettiFired = true;
      _showWinSpinner();
      _launchConfettiAfterAnim();
    }
  }
}

function _showWinSpinner() {
  document.querySelector('.win-spinner')?.remove();
  const el = document.createElement('div');
  el.className = 'win-spinner';
  el.setAttribute('aria-label', 'Loading');
  document.getElementById('result-modal')?.appendChild(el);
}

// Fire confetti only after the game-over win-pulse animation has completed.
// The pulse runs with a 650ms delay + 700ms duration = ~1350ms total.
// If the user opens results before then, we wait out the remainder first.
function _launchConfettiAfterAnim() {
  const WIN_ANIM_MS = 1400;
  const wait = Math.max(0, WIN_ANIM_MS - (Date.now() - _gameOverTime));
  setTimeout(() => {
    document.querySelector('.win-spinner')?.remove();
    launchConfetti();
  }, wait);
}

function showResult(won, autoOpen = true) {
  const modal = document.getElementById('result-modal');
  // Don't auto-open the result modal if the welcome splash is still up —
  // the user will reach it via the "Review Result" button on that screen.
  const welcomeVisible = !document.getElementById('welcome-modal')?.classList.contains('hidden');
  if (autoOpen && !welcomeVisible) {
    modal.classList.remove('hidden');
    switchResultTab('result');
    if (won) {
      _showWinWordCloud();
      if (!_resultConfettiFired) {
        _resultConfettiFired = true;
        _showWinSpinner();
        _launchConfettiAfterAnim();
      }
    }
  }

  const answer    = todayDistrict.properties['state-district'];
  const stateName = STATE_NAMES[todayDistrict.properties.state] || todayDistrict.properties.state;
  const distPart  = answer.slice(todayDistrict.properties.state.length + 1);
  const isAtLarge = (stateDistrictMap[todayDistrict.properties.state] || []).length === 1;
  const distLabel = isAtLarge ? 'At-Large District' : `District ${parseInt(distPart, 10)}`;

  // District preview map
  renderDistrictPreview();

  // Answer block
  const msg   = document.getElementById('result-message');
  const stats = document.getElementById('result-stats');

  if (won) {
    msg.innerHTML = guessCount === 1 ? 'Hole in one!' :
                    guessCount <= 3  ? 'Impressive!' : 'Got it!';
    msg.className = 'won';
  } else {
    msg.innerHTML = 'Better luck tomorrow';
    msg.className = 'lost';
  }

  stats.innerHTML = `
    <div class="result-answer">
      <span class="result-answer-code">${answer}</span>
    </div>
    ${won ? `<div class="result-time-line">Solved in <strong>${guessCount}</strong> guess${guessCount !== 1 ? 'es' : ''} &middot; <strong>${formatTime(elapsedSeconds)}</strong></div>` : ''}`;

  // Wordle-style statistics + distribution
  renderInlinePersonalStats();
}

function buildShareText() {
  const answer  = todayDistrict.properties['state-district'];
  const won     = guessHistory.some(g => g.correct && g.phase === 'district');
  // guessCount already reflects wrong guesses + 1 for the win (added in endGame)
  const winNum  = won ? guessCount : null;
  const usedSlots = guessHistory.map(g => {
    if (g.correct && g.phase === 'district') return '✓';
    if (g.correct && g.phase === 'state')    return '○';  // correct state — not a "wrong" guess
    return '✗';
  });
  const unusedCount = won ? MAX_GUESSES - guessCount : 0;
  const grid = [...usedSlots, ...Array(unusedCount).fill('⬜')].join(' ');
  const outcome = won ? `solved in ${winNum}/${MAX_GUESSES} guesses` : `unsolved (${MAX_GUESSES}/${MAX_GUESSES})`;
  return `🗺️ Daily District\n📍 ${answer} — ${outcome}\n${grid}\nCan you identify it? https://jcervas.github.io/games/district-guess/`;
}

// ============================================================
//  LEADERBOARD UI
// ============================================================
function renderScoreRow(entry, rank, isMe) {
  const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
  const guessLabel = entry.won === false ? 'X' : entry.guesses;
  return `
    <div class="score-row ${isMe ? 'me' : ''} ${entry.won === false ? 'lost-row' : ''}">
      <span class="rank ${rankClass}">${rank}</span>
      <span class="name">${escapeHtml(entry.username)}${isMe ? ' (you)' : ''}</span>
      <span class="guesses">${guessLabel} guess${guessLabel !== 1 ? 'es' : ''}</span>
      <span class="time-val">${formatTime(entry.time || 0)}</span>
    </div>`;
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

async function openLeaderboard() {
  document.getElementById('leaderboard-modal').classList.remove('hidden');
  document.getElementById('lb-district-label').textContent =
    gameOver ? `${todayDistrict.properties['state-district']} · ${todayKey}` : todayKey;

  // Today's scores
  const todayEl = document.getElementById('today-scores');
  const todayData = await loadTodayScores();
  if (todayData === null) {
    todayEl.innerHTML = `<div class="lb-empty">Global leaderboard requires Firebase setup.<br>See script.js for instructions.</div>`;
  } else if (todayData.length === 0) {
    todayEl.innerHTML = `<div class="lb-empty">No scores yet today. Be the first!</div>`;
  } else {
    todayEl.innerHTML = todayData.map((e, i) => renderScoreRow(e, i+1, e.username === username)).join('');
  }

  // All-time scores
  const alltimeEl = document.getElementById('alltime-scores');
  const alltimeData = await loadAlltimeScores();
  if (alltimeData === null) {
    alltimeEl.innerHTML = `<div class="lb-empty">Global leaderboard requires Firebase setup.</div>`;
  } else if (alltimeData.length === 0) {
    alltimeEl.innerHTML = `<div class="lb-empty">No scores yet.</div>`;
  } else {
    alltimeEl.innerHTML = alltimeData.map((e, i) => `
      <div class="score-row ${e.username === username ? 'me' : ''}">
        <span class="rank ${i===0?'gold':i===1?'silver':i===2?'bronze':''}">${i+1}</span>
        <span class="name">${escapeHtml(e.username)}${e.username===username?' (you)':''}</span>
        <span class="guesses">avg ${e.avgGuesses.toFixed(1)}</span>
        <span class="time-val">${e.wins}W</span>
      </div>`).join('');
  }

  // Personal stats
  renderPersonalStats();
}

function renderPersonalStats() {
  const el    = document.getElementById('personal-stats');
  const stats = loadPersonalStats();
  if (!stats || stats.played === 0) {
    el.innerHTML = '<div class="lb-empty">No games played yet.</div>';
    return;
  }
  const winRate  = Math.round(stats.won / stats.played * 100);
  const dist     = stats.guessDist || {};
  const maxBar   = Math.max(...Object.values(dist).map(Number), 1);
  const wonToday = guessHistory.some(g => g.correct && g.phase === 'district');
  const avgSecs  = stats.won > 0 ? Math.round((stats.totalWonTime || 0) / stats.won) : null;
  const avgLabel = avgSecs !== null ? formatTime(avgSecs) : '—';
  const totalWonGuesses = [1,2,3,4,5,6].reduce((s, k) => s + k * (dist[k] || 0), 0);
  const totalWonCount   = [1,2,3,4,5,6].reduce((s, k) => s + (dist[k] || 0), 0);
  const avgGuesses = totalWonCount > 0 ? (totalWonGuesses / totalWonCount).toFixed(1) : '—';

  const bars = [1, 2, 3, 4, 5, 6, 'X'].map(k => {
    const count = dist[k] || 0;
    const pct   = count > 0 ? Math.max(Math.round(count / maxBar * 100), 12) : 0;
    const hi    = gameOver && ((wonToday && k === guessCount) || (!wonToday && k === 'X'));
    return `<div class="rdist-row">
      <span class="rdist-n">${k}</span>
      <div class="rdist-bar-wrap">
        <div class="rdist-bar${hi ? ' today' : ''}" style="width:${pct}%">
          ${count ? `<span class="rdist-count">${count}</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="personal-grid">
      <div class="stat-card"><div class="stat-val">${stats.played}</div><div class="stat-label">Played</div></div>
      <div class="stat-card"><div class="stat-val">${winRate}%</div><div class="stat-label">Win Rate</div></div>
      <div class="stat-card"><div class="stat-val">${stats.streak}</div><div class="stat-label">Current Streak</div></div>
      <div class="stat-card"><div class="stat-val">${stats.maxStreak}</div><div class="stat-label">Max Streak</div></div>
    </div>
    <div class="result-dist">
      <h4>Guess Distribution</h4>
      ${bars}
    </div>
    <div class="rstat-avg-time">Avg. guesses (wins): <strong>${avgGuesses}</strong> &nbsp;&middot;&nbsp; Avg. time: <strong>${avgLabel}</strong></div>`;
}

// ============================================================
//  RESTORE SAVED GAME
// ============================================================
function restoreGame(saved) {
  guessCount     = saved.guessCount;
  guessHistory   = saved.guessHistory;
  cluesRevealed  = saved.cluesRevealed;
  elapsedSeconds = saved.elapsedSeconds || 0;
  gameOver       = saved.gameOver;

  const tvEl = document.getElementById('timer-value');
  if (tvEl) tvEl.textContent = formatTime(elapsedSeconds);
  const tvElI = document.getElementById('timer-value-inline');
  if (tvElI) tvElI.textContent = formatTime(elapsedSeconds);

  // Reconstruct eliminations by replaying each wrong state guess through the same
  // "keep-only-neighbors + dead-end cleanup" logic used in processStateGuess.
  eliminatedStates = new Set();
  const _rc = todayDistrict.properties.state; // correct state — always protected
  const _wrongGuesses = guessHistory.filter(g => g.phase === 'state' && !g.correct);
  const _wrongGuessedSoFar = new Set();
  _wrongGuesses.forEach(g => {
    _wrongGuessedSoFar.add(g.text);
    eliminatedStates.add(g.text);
    const _nbrs = STATE_ADJACENCY[g.text] || [];
    if (g.adjacent) {
      // HOT restore: keep only neighbors
      const neighborSet = new Set(_nbrs);
      for (const s of Object.keys(stateDistrictMap)) {
        if (s !== _rc && !neighborSet.has(s)) eliminatedStates.add(s);
      }
    } else {
      // COLD restore: eliminate guess and its neighbors
      for (const n of _nbrs) {
        if (n !== _rc) eliminatedStates.add(n);
      }
    }
    // Dead-end: only when ALL neighbors have been explicitly guessed wrong
    let changed = true;
    while (changed) {
      changed = false;
      for (const s of Object.keys(stateDistrictMap)) {
        if (eliminatedStates.has(s) || s === _rc) continue;
        const sN = STATE_ADJACENCY[s] || [];
        if (sN.length > 0 && sN.every(n => _wrongGuessedSoFar.has(n))) {
          eliminatedStates.add(s); changed = true;
        }
      }
    }
  });

  // Reconstruct state-lock from guess history
  const correctState = todayDistrict.properties.state;
  const stateFound   = guessHistory.some(g => g.phase === 'state' ? g.correct : g.text.split('-')[0] === correctState);
  if (stateFound) {
    correctStateGuessed = true;
    // instant=true: skip fade animation on page restore
    lockStateDropdown(correctState, true);
  }

  // Reconstruct map stage
  const wrongCount = guessHistory.filter(g => !g.correct).length;
  applyMapStage(wrongCount, gameOver);

  renderDistrict(todayDistrict);
  renderGuessHistory();
  renderClues();

  if (gameOver) {
    const banner    = document.getElementById('already-played-banner');
    const bannerMsg = document.getElementById('banner-msg');
    if (banner && bannerMsg) {
      bannerMsg.textContent = saved.won
        ? `You got it — ${todayDistrict.properties['state-district']}!`
        : `The answer was ${todayDistrict.properties['state-district']}.`;
      banner.classList.remove('hidden');
    }
    buildDistrictD3Map(todayDistrict.properties.state);
    document.getElementById('game-section')?.classList.add('map-collapsed');
    lastGameWon = saved.won;
    showResult(saved.won);
    fetchAndRenderCensusPanel(districtDataFor(todayDistrict));
  }
}

// ============================================================
//  USERNAME FLOW
// ============================================================
function promptUsername(callback) {
  const modal   = document.getElementById('username-modal');
  const input   = document.getElementById('username-input');
  const submit  = document.getElementById('username-submit');
  const errEl   = document.getElementById('username-error');
  modal.classList.remove('hidden');

  submit.onclick = () => {
    const name = input.value.trim();
    if (!name || name.length < 2) { errEl.textContent = 'Please enter at least 2 characters.'; return; }
    errEl.textContent = '';
    setUsername(name);
    username = name;
    modal.classList.add('hidden');
    callback();
  };
  input.onkeydown = e => { if (e.key === 'Enter') submit.onclick(); };
}

// ============================================================
//  PLAY AGAIN — reset all state and start a fresh district
// ============================================================
function resetGame(newIdx) {
  // Stop any running timer
  stopTimer();

  // Reset all mutable game state
  guessCount          = 0;
  guessHistory        = [];
  cluesRevealed       = 0;
  correctStateGuessed = false;
  gameOver            = false;
  _gameStarted        = true;   // Play Again always goes straight to game
  elapsedSeconds      = 0;
  districtGameOverTransform = null;
  districtSavedTransform    = null;
  districtUserZoomed        = false;
  gamePhase                 = 'state';
  _districtBuiltState       = null;
  _districtSvgSel           = null;
  _districtPathSnap         = null;
  _districtStateFSnap       = null;
  _gameOverTime             = 0;
  document.querySelector('.mzb-fit')?.classList.remove('at-national');
  document.querySelector('.gameover-results-arrow')?.remove();
  eliminatedStates    = new Set();
  _distLocked         = false;
  _guessLocked        = false;
  _resultConfettiFired  = false;
  _gameOverAnimsCallback = null;

  // Pick the new district
  todayDistrict = districts[newIdx];

  // Remove saved game so restoreGame() won't trigger on this key
  localStorage.removeItem(STORAGE_PREFIX + 'today');

  // Clear census cache so District Profile loads fresh data for the new district
  _cachePromise = null;

  // --- UI resets ---

  // Hide modals / banners
  document.getElementById('result-modal').classList.add('hidden');
  document.getElementById('already-played-banner').classList.add('hidden');

  // Timer
  const tvEl = document.getElementById('timer-value');
  if (tvEl) tvEl.textContent = '0:00';
  document.getElementById('timer-display').classList.remove('running');

  // Reset Leaflet map: remove district layer; renderDistrict below will fitBounds to new district
  if (districtLayer) { map.removeLayer(districtLayer); districtLayer = null; }
  currentMapStage = 0;
  applyMapStage(0);

  // Reset US reference map (clear the SVG so initUSRefMap rebuilds it)
  const refMapEl = document.getElementById('us-ref-map');
  refMapEl.innerHTML = '';
  refMapEl.classList.remove('hidden');
  refMapEl.style.opacity = '';
  usRefMap       = null;
  usRefMapGroup  = null;
  usRefLayers    = {};
  usRefCallouts  = {};
  _lastFitBBoxKey = null;
  usRefZoom      = null;
  usRefSvgSel    = null;

  // Reset district tiles
  const tilesEl = document.getElementById('district-tiles');
  tilesEl.innerHTML = '';
  tilesEl.classList.add('hidden');
  tilesEl.style.opacity = '';

  // Re-show state chips section
  document.getElementById('state-chips-section').classList.remove('hidden');

  // Reset reference label
  const labelEl = document.getElementById('ref-label');
  if (labelEl) labelEl.textContent = 'Click a state to select it';

  // Re-initialise reference map and render
  initUSRefMap();
  renderDistrict(todayDistrict);
  renderClues();
  renderGuessHistory();  // also calls updateGuessCounter()
  document.getElementById('guess-remaining').textContent = `${MAX_GUESSES} guesses`;

  // Pre-build district tiles for the new district in the background so the
  // state→district transition on correct guess is a reveal, not a rebuild.
  requestAnimationFrame(() => {
    const tilesEl = document.getElementById('district-tiles');
    tilesEl.classList.remove('hidden');
    tilesEl.style.opacity = '0';
    tilesEl.style.pointerEvents = 'none';
    buildDistrictD3Map(todayDistrict.properties.state, false, false);
  });
}

// ============================================================
//  INIT
// ============================================================
async function init() {
  todayKey = getTodayKey();
  username = getUsername();

  // Load core TopoJSON (districts + states + points) — game is playable once this completes.
  // Roads and urban are lazy-loaded afterwards as a non-blocking overlay.
  try {
    const coreUrl = './districts-core.topojson';
    const res = await fetch(coreUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const topo = await res.json();
    rawTopo = topo;
    const data = topojson.feature(topo, topo.objects.districts);
    districts = data.features.filter(f => f.properties.state && f.properties.state !== 'DC');

    // Store inner points keyed by state-district for use in buildDistrictD3Map
    if (topo.objects.points) {
      topojson.feature(topo, topo.objects.points).features.forEach(f => {
        const key = f.properties['state-district'];
        if (key) districtPoints[key] = f.geometry.coordinates;
      });
    }

    // Correct inner points that land in enclosed water bodies.
    // For MultiPolygon districts (islands, coastal districts), check if the inner point
    // is inside the largest sub-polygon; if not, fall back to that polygon's centroid.
    // For single Polygon districts, same check against the whole polygon.
    districts.forEach(f => {
      const key  = f.properties['state-district'];
      const geom = f.geometry;
      if (!key || !geom) return;
      const inner = POINT_OVERRIDES[key] || districtPoints[key];
      if (geom.type === 'MultiPolygon' && geom.coordinates.length > 0) {
        const largest = geom.coordinates.reduce((a, b) =>
          d3.geoArea({ type: 'Feature', geometry: { type: 'Polygon', coordinates: a } }) >=
          d3.geoArea({ type: 'Feature', geometry: { type: 'Polygon', coordinates: b } }) ? a : b
        );
        const largestF = { type: 'Feature', geometry: { type: 'Polygon', coordinates: largest } };
        if (!inner || !d3.geoContains(largestF, inner)) {
          districtPoints[key] = d3.geoCentroid(largestF);
        }
      } else if (geom.type === 'Polygon') {
        if (inner && !d3.geoContains(f, inner)) {
          districtPoints[key] = d3.geoCentroid(f);
        }
      }
    });
    if (topo.objects.states) {
      topojson.feature(topo, topo.objects.states).features.forEach(f => {
        if (f.properties.state) topoStates[f.properties.state] = f;
      });
    }
  } catch (err) {
    console.error('TopoJSON load failed:', err);
    alert(`Failed to load district data (${err.message}). Please refresh.`);
    return;
  }

  // Lazy-load decorative overlay (roads + urban) — non-blocking.
  fetch('./districts-overlay.topojson')
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(topo => {
      if (topo.objects.roads) topoRoads = topojson.feature(topo, topo.objects.roads);
      if (topo.objects.urban) topoUrban = topojson.feature(topo, topo.objects.urban);
      // Re-render if game is already over so roads/urban appear even if fetch was slow
      if (gameOver && map) renderMapD3(currentMapStage);
    })
    .catch(err => console.warn('Overlay load failed (non-fatal):', err));

  // Lazy-load county boundary lines — used on district gameplay and game-over screens.
  fetch('./counties-lines.topojson')
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(topo => {
      const obj = topo.objects[Object.keys(topo.objects)[0]];
      if (obj) topoCounties = topojson.feature(topo, obj);
    })
    .catch(err => console.warn('Counties load failed (non-fatal):', err));

  // Build state→district lookup
  stateDistrictMap = buildStateDistrictMap(districts);

  // Build district adjacency lookup from embedded `adj` property
  adjMap = new Map(
    districts.map(f => [
      f.properties['state-district'],
      (f.properties.adj || '').split('|').filter(Boolean)
    ])
  );

  // Restore replayCount from sessionStorage so hard-reload resumes the same map
  const savedReplay = parseInt(sessionStorage.getItem(SESSION_REPLAY_KEY) || '0', 10);
  replayCount = isNaN(savedReplay) ? 0 : savedReplay;

  // Pick the district: daily (replayCount=0) uses a date seed shared by all players;
  // subsequent "New Map" games use a per-user random seed stored in sessionStorage.
  let idx;
  if (replayCount === 0) {
    idx = seededIndex(dateSeed(), districts.length);
  } else {
    const stored = parseInt(sessionStorage.getItem(SESSION_RANDSEED_KEY) || '0', 10);
    idx = seededIndex(stored || Date.now(), districts.length);
  }
  todayDistrict = districts[idx];

  initMap();
  // Leaflet caches container size at init; flex layout may not be settled yet
  setTimeout(() => { if (map) map.invalidateSize(); }, 50);
  initUSRefMap();   // start loading US states reference map

  // Check for saved game from today — must happen before the rAF pre-build so we can
  // skip the pre-build when restoring (the rAF fires after restoreGame completes and
  // would otherwise clobber the restored district tiles with opacity=0).
  const saved = loadGameState();
  if (saved) {
    restoreGame(saved);
    return;
  }

  // Fresh game: pre-build district tiles in the background so the state→district
  // transition on first correct guess is a reveal+zoom rather than a DOM rebuild.
  // The tiles start invisible (opacity 0, not hidden) so layout dimensions are real.
  requestAnimationFrame(() => {
    const tilesEl = document.getElementById('district-tiles');
    tilesEl.classList.remove('hidden');
    tilesEl.style.opacity = '0';
    tilesEl.style.pointerEvents = 'none';
    buildDistrictD3Map(todayDistrict.properties.state, false, false);
  });

  // Fresh game — start immediately (username/login will be added later)
  renderDistrict(todayDistrict);
  renderClues();         // also calls renderStateChips()
  renderGuessHistory();
  document.getElementById('guess-remaining').textContent = `${MAX_GUESSES} guesses`;
}

// ============================================================
//  EVENT LISTENERS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  applyDarkModeClass(); // must run before init() so D3 map gets correct colors
  updateThemeToggle();

  // Show welcome splash immediately — game loads in background behind it
  (function showWelcomeImmediately() {
    const wm = document.getElementById('welcome-modal');
    if (!wm) return;
    const EPOCH = new Date('2025-01-20T00:00:00-05:00');
    const now   = new Date();
    const puzzleNum = Math.floor((now - EPOCH) / 86400000) + 1;
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const dateLine = document.getElementById('welcome-date-line');
    const numLine  = document.getElementById('welcome-puzzle-num');
    if (dateLine) dateLine.textContent = dateStr;
    if (numLine)  numLine.textContent  = `No. ${puzzleNum}`;
    document.getElementById('welcome-buttons').innerHTML =
      '<div class="welcome-loading-spinner"></div>';
    wm.classList.remove('hidden');
  })();

  const _initPromise = init();

  // District tile clicks — event delegation on the tile container
  document.getElementById('district-tiles').addEventListener('click', e => {
    const tile = e.target.closest('.district-tile');
    if (!tile || tile.disabled) return;
    submitDistrictTile(tile.dataset.dist);
  });

  // New Map — pick a new district (both from result modal button AND banner button)
  function startNewMap() {
    replayCount++;
    sessionStorage.setItem(SESSION_REPLAY_KEY, String(replayCount));
    const randSeed = Date.now() ^ (Math.random() * 0xffffffff | 0);
    sessionStorage.setItem(SESSION_RANDSEED_KEY, String(randSeed));
    const newIdx = seededIndex(randSeed, districts.length);

    // Show welcome splash immediately (before map refresh) so user never sees
    // the new district flash in behind the closing result modal.
    document.getElementById('result-modal')?.classList.add('hidden');
    gameOver = false;
    guessCount = 0;
    correctStateGuessed = false;
    _gameStarted = false;
    buildWelcomeButtons();
    welcomeModal.classList.remove('hidden');

    // Remove map-collapsed immediately so the CSS flex expansion (300ms) starts.
    // Then defer resetGame until after that transition so Leaflet measures the
    // correct map height when renderDistrict calls fitBounds.
    document.getElementById('game-section')?.classList.remove('map-collapsed');
    setTimeout(() => {
      resetGame(newIdx);
      requestAnimationFrame(() => {
        map.invalidateSize();
        if (districtLayer) map.fitBounds(districtLayer.getBounds(), { padding: [40, 40], animate: false });
      });
    }, 350);
  }
  document.getElementById('play-again-btn').addEventListener('click', startNewMap);
  document.getElementById('banner-new-map-btn').addEventListener('click', startNewMap);

  // Post to X / Twitter
  document.getElementById('post-x-btn').addEventListener('click', async () => {
    const text = buildShareText();
    const tweetUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);

    // Try to share with district image via Web Share API (mobile/Safari)
    if (navigator.canShare && todayDistrict && window.d3) {
      try {
        const blob = await _renderDistrictToBlob();
        const file = new File([blob], 'district.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text });
          return;
        }
      } catch (err) { /* fall through to web intent */ }
    }
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  });

  // Resize — keep Leaflet map tile grid current when container changes
  window.addEventListener('resize', () => {
    if (map) map.invalidateSize();
  });


  // Leaderboard
  document.getElementById('leaderboard-btn').addEventListener('click', openLeaderboard);
  document.getElementById('show-results-btn').addEventListener('click', openResultModal);

  // Result modal tabs
  document.querySelectorAll('.result-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchResultTab(btn.dataset.rtab));
  });

  // Welcome splash — shown every time the game opens
  const welcomeModal = document.getElementById('welcome-modal');

  function buildWelcomeButtons() {
    const container = document.getElementById('welcome-buttons');
    container.innerHTML = '';

    // Reset wordmark to SVG (may have been swapped to "Welcome Back" text)
    const wmSvg  = document.querySelector('.welcome-wordmark-svg');
    const wmBack = document.getElementById('welcome-back-text');
    const slogan = document.querySelector('.welcome-slogan');
    if (wmSvg)  wmSvg.hidden  = false;
    if (wmBack) wmBack.hidden = true;
    if (slogan) slogan.textContent = 'Identify the district from its shape';

    function dismissAndStart() {
      const isFirstPlay = !localStorage.getItem(SETTINGS_SEEN_KEY);
      _gameStarted = true;
      welcomeModal.classList.add('hidden');
      localStorage.setItem(WELCOME_SEEN_KEY, '1');
      localStorage.setItem(HOW_TO_SEEN_KEY, '1');
      localStorage.setItem(SETTINGS_SEEN_KEY, '1');
      renderClues();
      renderGuessHistory();
      // #map was sized while hidden behind the modal — Leaflet's cached size is stale
      requestAnimationFrame(() => {
        if (map) map.invalidateSize();
        if (districtLayer) map.fitBounds(districtLayer.getBounds(), { padding: [40, 40], animate: false });
        if (isFirstPlay) {
          updateThemeToggle();
          document.getElementById('settings-modal').classList.remove('hidden');
        }
      });
    }

    if (gameOver) {
      const btnMap = document.createElement('button');
      btnMap.className = 'welcome-action-btn';
      btnMap.textContent = 'Back to Map';
      btnMap.addEventListener('click', dismissAndStart);

      const btnResult = document.createElement('button');
      btnResult.className = 'welcome-action-btn secondary';
      btnResult.textContent = 'Review Result';
      btnResult.addEventListener('click', () => {
        dismissAndStart();
        openResultModal();
      });

      container.appendChild(btnMap);
      container.appendChild(btnResult);
    } else {
      const inProgress = guessCount > 0 || correctStateGuessed;
      if (inProgress) {
        if (wmSvg)  wmSvg.hidden  = true;
        if (wmBack) wmBack.hidden = false;
        if (slogan) slogan.textContent =
          `You've made ${guessCount} of ${MAX_GUESSES} guess${guessCount !== 1 ? 'es' : ''}. Keep it up!`;
      }
      const btnPlay = document.createElement('button');
      btnPlay.className = 'welcome-action-btn';
      btnPlay.textContent = inProgress ? 'Continue' : 'Play';
      btnPlay.addEventListener('click', dismissAndStart);
      container.appendChild(btnPlay);
    }
  }

  // Build buttons after init() resolves so guessCount/gameOver reflect restored state
  _initPromise.then(() => {
  buildWelcomeButtons();

  // How to play — auto-show on first visit (after welcome buttons ready)
  const howToModal = document.getElementById('how-to-modal');
  if (!localStorage.getItem(HOW_TO_SEEN_KEY)) {
    howToModal.classList.remove('hidden');
  }
  document.getElementById('how-to-btn').addEventListener('click', () => {
    howToModal.classList.remove('hidden');
  });
  document.getElementById('welcome-how-to-btn')?.addEventListener('click', () => {
    howToModal.classList.remove('hidden');
  });
  document.getElementById('how-to-got-it').addEventListener('click', () => {
    howToModal.classList.add('hidden');
    localStorage.setItem(HOW_TO_SEEN_KEY, '1');
  });
  }); // end _initPromise.then

  // Title click → show welcome splash
  document.getElementById('title-home-btn')?.addEventListener('click', () => {
    document.getElementById('welcome-modal').classList.remove('hidden');
  });

  // Settings modal
  const settingsModal = document.getElementById('settings-modal');
  document.getElementById('settings-btn').addEventListener('click', () => {
    updateThemeToggle();
    settingsModal.classList.remove('hidden');
  });
  document.getElementById('settings-close').addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });
  settingsModal.addEventListener('click', e => {
    if (e.target === settingsModal) settingsModal.classList.add('hidden');
  });
  document.getElementById('settings-dark-toggle').addEventListener('change', () => {
    toggleDarkMode();
  });
  document.getElementById('settings-reset-theme').addEventListener('click', () => {
    localStorage.removeItem('districtguess_theme');
    document.body.classList.remove('dark-mode', 'light-mode');
    updateThemeToggle();
    // repaint everything to match system pref
    updateUSRefMap();
    if (map && streetLayer) {
      map.removeLayer(streetLayer);
      streetLayer = L.tileLayer(streetTileUrl(), { maxZoom: 19, opacity: _streetOpacity, attribution: streetTileAttrib() }).addTo(map);
    }
    if (map) applyMapStage(guessHistory.filter(g => !g.correct).length, gameOver);
    if (districtLayer) districtLayer.setStyle(districtStyle());
    if (gameOver && todayDistrict) buildDistrictD3Map(todayDistrict.properties.state);
  });

  // When system preference changes and user has no manual override, repaint everything
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('districtguess_theme')) return; // user chose manually — respect it
    updateThemeToggle();
    updateUSRefMap();
    if (map && streetLayer) {
      map.removeLayer(streetLayer);
      streetLayer = L.tileLayer(streetTileUrl(), { maxZoom: 19, opacity: _streetOpacity, attribution: streetTileAttrib() }).addTo(map);
    }
    if (map) applyMapStage(guessHistory.filter(g => !g.correct).length, gameOver);
    if (districtLayer) districtLayer.setStyle(districtStyle());
    if (gameOver && todayDistrict) buildDistrictD3Map(todayDistrict.properties.state);
  });

  // Modal close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      modal.classList.add('hidden');
      // Re-show game-over banner whenever result modal is dismissed
      if (modal.id === 'result-modal' && gameOver) {
        document.getElementById('already-played-banner')?.classList.remove('hidden');
      }
      // Clear hints list when closing hints modal — populated lazily on open
      if (modal.id === 'hints-modal') {
        const list = document.getElementById('hints-clues-list');
        if (list) list.innerHTML = '';
      }
    });
  });

  // Close modal on backdrop click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        if (modal.id === 'result-modal' && gameOver) {
          document.getElementById('already-played-banner')?.classList.remove('hidden');
        }
      }
    });
  });

  // Leaderboard tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(`leaderboard-${tab}`).classList.add('active');
    });
  });

  // Hint bar expand → opens full hints modal
  document.getElementById('hint-bar-expand')?.addEventListener('click', () => {
    renderHintsModal();
    document.getElementById('hints-modal').classList.remove('hidden');
  });

  // Feedback — opened from settings panel
  document.getElementById('settings-feedback-btn')?.addEventListener('click', () => {
    document.getElementById('settings-modal').classList.add('hidden');
    document.getElementById('feedback-modal').classList.remove('hidden');
  });

  document.getElementById('result-feedback-btn')?.addEventListener('click', () => {
    document.getElementById('result-modal').classList.add('hidden');
    document.getElementById('feedback-modal').classList.remove('hidden');
  });

  // Wire Hard Mode toggle
  const hardToggle = document.getElementById('settings-hard-toggle');
  if (hardToggle) {
    hardToggle.checked = hardMode;
    hardToggle.addEventListener('change', () => {
      hardMode = hardToggle.checked;
      localStorage.setItem('districtguess_hardMode', hardMode ? '1' : '0');
    });
  }

  // Wire Confirm Selection toggle
  const confirmToggle = document.getElementById('settings-confirm-toggle');
  if (confirmToggle) {
    confirmToggle.checked = confirmInputMode;
    confirmToggle.addEventListener('change', () => {
      confirmInputMode = confirmToggle.checked;
      localStorage.setItem('districtguess_confirmMode', confirmInputMode ? '1' : '0');
      if (!confirmInputMode) setConfirmPending(null); // clear any pending state
    });
  }

  document.querySelectorAll('.fb-rating-group').forEach(group => {
    const hidden = group.querySelector('input[type="hidden"]');
    const labels = group.querySelectorAll('.fb-star-label');
    labels.forEach(lbl => {
      lbl.addEventListener('click', () => {
        const val = lbl.dataset.val;
        if (hidden) hidden.value = val;
        labels.forEach(l => l.classList.toggle('selected', +l.dataset.val <= +val));
      });
      lbl.addEventListener('mouseover', () => {
        const val = +lbl.dataset.val;
        labels.forEach(l => l.classList.toggle('hovered', +l.dataset.val <= val));
      });
      lbl.addEventListener('mouseout', () => {
        labels.forEach(l => l.classList.remove('hovered'));
      });
    });
  });

  document.getElementById('feedback-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = id => (document.getElementById(id)?.value || '').trim();
    const sel = id => { const el = document.getElementById(id); return el ? el.value : ''; };
    const name     = val('fb-name') || 'Anonymous';
    const email    = val('fb-email');
    const overall  = sel('fb-overall');
    const diff     = sel('fb-difficulty');
    const intuit   = sel('fb-intuitive');
    const mechanic = sel('fb-mechanic');
    const challenge= sel('fb-challenge');
    const freq     = sel('fb-frequency');
    const recommend= sel('fb-recommend');
    const enjoyed  = val('fb-enjoyed');
    const improve  = val('fb-improve');
    const comment  = val('fb-comment');
    const errEl    = document.getElementById('fb-error');

    // All fields optional — submit whatever is filled in (useful for quick bug reports).
    errEl.textContent = '';

    const stats  = loadPersonalStats();

    // Build guess history summary for today's session
    const guessLog = guessHistory.map((g, i) =>
      `  ${i+1}. [${g.phase}] ${g.text}${g.correct ? ' ✓' : g.adjacent === true ? ' (hot)' : g.adjacent === false ? ' (cold)' : ''}`
    ).join('\n') || '  (no guesses yet)';

    // Settings snapshot
    const settingsSnap = [
      `Dark mode: ${isDarkMode() ? 'on' : 'off'}`,
      `Confirm selection: ${confirmInputMode ? 'on' : 'off'}`,
      `Theme pref stored: ${localStorage.getItem('districtguess_theme') || 'system default'}`,
    ].join(', ');

    const subject = `Daily District Feedback — ${name}`;
    const body = [
      `=== Session Info ===`,
      `Version: ${GAME_VERSION}`,
      `Date: ${todayKey}`,
      `District (today): ${todayDistrict ? todayDistrict.properties['state-district'] : 'unknown'}`,
      `Game status: ${gameOver ? (guessHistory.some(g => g.correct) ? 'won' : 'lost') : 'in progress'}`,
      `Guesses used: ${guessCount}`,
      `Solve time: ${elapsedSeconds > 0 ? formatTime(elapsedSeconds) : '—'}`,
      `Replay count (session): ${replayCount}`,
      ``,
      `=== Guess History ===`,
      guessLog,
      ``,
      `=== Lifetime Stats ===`,
      `Played: ${stats?.played ?? 0}  |  Won: ${stats?.won ?? 0}  |  Win %: ${stats?.played ? Math.round((stats.won/stats.played)*100) : 0}%`,
      `Current streak: ${stats?.streak ?? 0}  |  Max streak: ${stats?.maxStreak ?? 0}`,
      `Avg solve time (wins): ${stats?.won > 0 ? formatTime(Math.round((stats.totalWonTime||0)/stats.won)) : '—'}`,
      ``,
      `=== Settings ===`,
      settingsSnap,
      `Browser: ${navigator.userAgent}`,
      `Screen: ${screen.width}×${screen.height}  |  Viewport: ${window.innerWidth}×${window.innerHeight}`,
      ``,
      `=== Player Info ===`,
      `Name: ${name}`,
      `Email: ${email || 'Not provided'}`,
      ``,
      `=== Ratings (1–5 stars) ===`,
      `Overall experience: ${overall}/5`,
      `Difficulty: ${diff}/5  (1=too easy, 5=too hard)`,
      `Ease of understanding: ${intuit}/5`,
      ``,
      `=== Gameplay Questions ===`,
      `Hot/Cold mechanic made sense: ${mechanic}`,
      `Biggest challenge: ${challenge || 'not answered'}`,
      `How often would play: ${freq}`,
      `Would recommend: ${recommend}`,
      ``,
      `=== Open Feedback ===`,
      `Enjoyed most: ${enjoyed || '—'}`,
      `Should improve: ${improve || '—'}`,
      `Other comments: ${comment || '—'}`,
    ].join('\n');

    window.open(
      `mailto:cervas@cmu.edu,jafierman@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      '_blank'
    );
    localStorage.setItem(FEEDBACK_PROMPTED_AT, String(stats?.played ?? 0));
    document.getElementById('feedback-modal').classList.add('hidden');
    document.getElementById('feedback-form').reset();
  });
});
