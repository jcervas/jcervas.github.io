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
  AK: [],
  AZ: ['CA','CO','NM','NV','UT'],
  AR: ['LA','MO','MS','OK','TN','TX'],
  CA: ['AZ','NV','OR'],
  CO: ['AZ','KS','NE','NM','OK','UT','WY'],
  CT: ['MA','NY','RI'],
  DC: ['MD','VA'],
  DE: ['MD','NJ','PA'],
  FL: ['AL','GA'],
  GA: ['AL','FL','NC','SC','TN'],
  HI: [],
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
  WA: ['ID','OR'],
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
  xCircle:     `<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>`,
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
const HOW_TO_SEEN_KEY = STORAGE_PREFIX + 'howToSeen';

// Built at load time from GeoJSON: { 'TX': ['01','02',...], 'WY': ['AT-LARGE'], ... }
let stateDistrictMap = {};

// District facts — Fact 0 is always visible; one more unlocks per wrong guess.
// fn receives districtDataFor(todayDistrict) = {state, district}
const FACT_DEFS = [
  {
    icon: 'ruler',
    label: 'District size',
    fn: () => {
      if (!todayDistrict) return '—';
      // d3.geoArea returns steradians; Earth radius ≈ 6371 km
      const areaKm2  = d3.geoArea(todayDistrict) * 6371 * 6371;
      const areaMi2  = Math.round(areaKm2 * 0.386102);
      if (areaMi2 <   300) return `Very compact — under 300 sq mi`;
      if (areaMi2 <  2000) return `Small — ~${areaMi2.toLocaleString()} sq mi`;
      if (areaMi2 < 15000) return `Mid-size — ~${areaMi2.toLocaleString()} sq mi`;
      return `Large — ~${areaMi2.toLocaleString()} sq mi`;
    }
  },
  {
    icon: 'building',
    label: 'State delegation size',
    fn: d => {
      const count = stateDistrictMap[d.state]?.length || 1;
      if (count === 1) return 'At-large — only congressional district in its state';
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
    icon: 'mappin',
    label: 'State',
    fn: d => STATE_NAMES[d.state] || d.state
  },
];

// Map tile progression.
// Terrain (ESRI shaded relief, no labels) after guess 1, stays through guess 4.
// Full OSM (cities + labels) unlocks as the 5th clue after 4 wrong guesses.
const MAP_STAGES = [
  { terrainOpacity: 0, streetOpacity: 0.01 }, // 0 wrong: outline only
  { terrainOpacity: 1, streetOpacity: 0    }, // 1–3 wrong: terrain, no labels
  { terrainOpacity: 0, streetOpacity: 1    }, // 4 wrong OR game over: full OSM
];

// ============================================================
//  STATE
// ============================================================
let districts           = [];
let todayDistrict       = null;   // feature object
let todayKey            = '';     // 'YYYY-MM-DD'
let map, terrainLayer, streetLayer, districtLayer;
let usRefMap            = null;   // US states reference map SVG element
let usRefMapGroup       = null;   // main <g> inside the SVG (holds all paths)
let usRefLayers         = {};     // abbr → D3 path selection
let eliminatedStates    = new Set(); // all states removed from valid set (wrong guess + adjacency)
let guessCount          = 0;
let guessHistory        = [];     // [{text, correct}]
let cluesRevealed       = 0;      // how many text clues are showing
let correctStateGuessed = false;  // true once any guess has the right state
let timerInterval       = null;
let elapsedSeconds      = 0;
let timerRunning        = false;
let gameOver            = false;
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
    const state = f.properties.STATE;
    const dist  = f.properties.DISTRICT; // '01', '02', 'AT-LARGE', etc.
    if (!map[state]) map[state] = [];
    map[state].push(dist);
  }
  // Sort districts: AT-LARGE first, then numerically
  for (const state of Object.keys(map)) {
    map[state].sort((a, b) => {
      if (a === 'AT-LARGE') return -1;
      if (b === 'AT-LARGE') return  1;
      return parseInt(a, 10) - parseInt(b, 10);
    });
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
function initMap() {
  map = L.map('map', { zoomControl: true, attributionControl: false }).setView([37.8, -96], 4);

  // Layer 1: shaded relief (ESRI) — pure elevation/hillshade, no labels or roads
  terrainLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
    {
      maxZoom: 13,
      opacity: 0,
      attribution: 'Tiles © Esri — Source: Esri'
    }
  ).addTo(map);

  // Layer 2: streets (OSM) — roads, labels, cities — renders on top
  streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    opacity: 0.01,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);
}

function applyMapStage(wrongGuesses, gameEnded = false) {
  let idx;
  if (gameEnded || wrongGuesses >= 4) {
    idx = 2; // full OSM with labels
  } else if (wrongGuesses >= 1) {
    idx = 1; // terrain only
  } else {
    idx = 0; // outline only
  }
  const stage = MAP_STAGES[idx];
  terrainLayer.setOpacity(stage.terrainOpacity);
  streetLayer.setOpacity(stage.streetOpacity);
}

function renderDistrict(feature) {
  if (districtLayer) map.removeLayer(districtLayer);
  districtLayer = L.geoJSON(feature, {
    style: { color: '#2563eb', weight: 2.5, fillColor: '#2563eb', fillOpacity: 0.15 }
  }).addTo(map);
  map.fitBounds(districtLayer.getBounds(), { padding: [30, 30] });
}

// ============================================================
//  CENSUS API — single cached fetch for today's district
// ============================================================
// Cache the Promise itself so concurrent calls all await the same request
let _cachePromise = null;

async function getDistrictCensusData(districtData) {
  if (_cachePromise) return _cachePromise;

  const fips = STATE_FIPS[districtData.state];
  if (!fips) return null;

  let cdNum = districtData.district;
  if (cdNum === 'AT-LARGE') cdNum = '00';
  else cdNum = String(parseInt(cdNum, 10)).padStart(2, '0');

  // B03002 = race × Hispanic origin (no double-counting)
  const vars = [
    'NAME',
    'B01003_001E', // total population
    'B19013_001E', // median household income
    'B03002_003E', // White alone, not Hispanic
    'B03002_004E', // Black alone, not Hispanic
    'B03002_006E', // Asian alone, not Hispanic
    'B03002_012E', // Hispanic or Latino (any race)
    'B25077_001E', // median home value
    'B15003_022E', // bachelor's degree
    'B15003_023E', // master's degree
  ].join(',');

  const keyParam = CENSUS_API_KEY ? `&key=${CENSUS_API_KEY}` : '';
  const url = `https://api.census.gov/data/2022/acs/acs5?get=${vars}&for=congressional%20district:${cdNum}&in=state:${fips}${keyParam}`;

  _cachePromise = (async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Census API ${res.status}`);
      const data = await res.json();
      if (!data[1]) throw new Error('Empty Census response');
      const [name, pop, income, whiteNH, black, asian, hispanic, medianHome, bach, master] = data[1];
      return { name, pop, income, whiteNH, black, asian, hispanic, medianHome, bach, master };
    } catch (e) {
      console.error('Census fetch failed:', e);
      _cachePromise = null; // allow retry on next call
      return null;
    }
  })();

  return _cachePromise;
}

async function fetchCensus(districtData, field) {
  const d = await getDistrictCensusData(districtData);
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

// Wordle-style personal stats grid (played, win%, streaks, distribution)
function renderInlinePersonalStats() {
  const el = document.getElementById('result-personal-stats');
  if (!el) return;
  const stats = loadPersonalStats();
  if (!stats || stats.played === 0) { el.innerHTML = ''; return; }

  const winRate = Math.round(stats.won / stats.played * 100);
  const dist    = stats.guessDist || {};
  const maxBar  = Math.max(...Object.values(dist).map(Number), 1);
  const wonToday = guessHistory.some(g => g.correct);

  const bars = [1, 2, 3, 4, 5, 6, 'X'].map(k => {
    const count = dist[k] || 0;
    const pct   = count > 0 ? Math.max(Math.round(count / maxBar * 100), 7) : 0;
    const hi    = (wonToday && k === guessCount) || (!wonToday && k === 'X');
    return `<div class="rdist-row">
      <span class="rdist-n">${k}</span>
      <div class="rdist-bar-wrap">
        <div class="rdist-bar${hi ? ' today' : ''}" style="width:${pct}%">${count || ''}</div>
      </div>
    </div>`;
  }).join('');

  const avgSecs  = stats.won > 0 ? Math.round((stats.totalWonTime || 0) / stats.won) : null;
  const avgLabel = avgSecs !== null ? formatTime(avgSecs) : '—';

  el.innerHTML = `
    <div class="result-stats-grid">
      <div class="rstat-cell"><span class="rstat-big">${stats.played}</span><span class="rstat-label">Played</span></div>
      <div class="rstat-cell"><span class="rstat-big">${winRate}</span><span class="rstat-label">Win %</span></div>
      <div class="rstat-cell"><span class="rstat-big">${stats.streak}</span><span class="rstat-label">Current Streak</span></div>
      <div class="rstat-cell"><span class="rstat-big">${stats.maxStreak}</span><span class="rstat-label">Max Streak</span></div>
    </div>
    <div class="rstat-avg-time">Avg. solve time (correct guesses): <strong>${avgLabel}</strong></div>
    <div class="result-dist">
      <h4>Guess Distribution</h4>
      ${bars}
    </div>`;
}

// Helper: switch the result modal between "result" and "census" tabs
function switchResultTab(tab) {
  document.querySelectorAll('.result-tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.result-tab-btn').forEach(b => b.classList.remove('active'));
  const pane = document.getElementById(tab === 'result' ? 'result-section' : 'census-section');
  const btn  = document.querySelector(`.result-tab-btn[data-rtab="${tab}"]`);
  if (pane) pane.classList.add('active');
  if (btn)  btn.classList.add('active');
}

async function fetchAndRenderCensusPanel(districtData) {
  const censusLoading = document.getElementById('census-loading');
  const censusDataEl  = document.getElementById('census-data');

  const d = await getDistrictCensusData(districtData);
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

  censusLoading.classList.add('hidden');
  censusDataEl.classList.remove('hidden');
  censusDataEl.innerHTML = `
    <div class="census-grid">
      <div class="census-card">
        <div class="label">Total Population</div>
        <div class="value">${formatNumber(d.pop)}</div>
        <div class="sub">ACS 2022 5-year</div>
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
      <div class="census-card">
        <div class="label">State</div>
        <div class="value">${STATE_NAMES[districtData.state] || districtData.state}</div>
        <div class="sub">${districtData.district === 'AT-LARGE' ? 'At-Large District' : `District ${parseInt(districtData.district, 10)}`}</div>
      </div>
    </div>
    <div class="census-source">Source: U.S. Census Bureau, American Community Survey 5-Year Estimates (2022). ${d.name}</div>
  `;
}

// ============================================================
//  FIREBASE / LEADERBOARD
// ============================================================
function initFirebase() {
  if (!FIREBASE_CONFIG) return;
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
  } catch (e) {
    console.warn('Firebase init failed:', e);
  }
}

async function submitScore(won, guesses, seconds) {
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
function renderClues() {
  renderStateChips(); // update chip states whenever facts change
  updateUSRefMap();   // keep D3 map in sync
  const list = document.getElementById('clues-list');
  list.innerHTML = '';

  for (let i = 0; i < FACT_DEFS.length; i++) {
    const def = FACT_DEFS[i];
    const div = document.createElement('div');
    // Fact 0 always visible (i <= cluesRevealed means i=0 shows when cluesRevealed=0)
    if (i <= cluesRevealed) {
      div.className = 'clue-item revealed';
      div.innerHTML = `
        <span class="clue-icon">${svgIcon(def.icon, 'clue-icon-svg')}</span>
        <span class="clue-text">
          <span class="clue-label">${def.label}</span>
          <span class="clue-val">…</span>
        </span>`;
      const val = def.fn(districtDataFor(todayDistrict));
      if (val instanceof Promise) {
        val.then(v => {
          const el = div.querySelector('.clue-val');
          if (el) el.textContent = v;
        });
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
  return {
    state: feature.properties.STATE,
    district: feature.properties.DISTRICT
  };
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
    const tv = document.getElementById('timer-value');
    if (tv) tv.textContent = formatTime(elapsedSeconds);
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
  const el = document.getElementById('guess-history');
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
      </div>`;
    }

    // District phase
    const distPart  = g.text.split('-').slice(1).join('-');
    const distLabel = distPart === 'AT-LARGE' ? 'At-Large' : `District ${parseInt(distPart, 10)}`;
    return `<div class="guess-row ${cls}">
      <span class="guess-icon">${svgIcon(iconName,'guess-icon-svg')}</span>
      <span class="guess-label">${distLabel}</span>
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
}

// Called when a state is chosen via map click or chip click.
let _guessLocked = false; // prevent double-submit during animation
function submitStateGuess(abbr) {
  if (gameOver || correctStateGuessed || _guessLocked) return;
  _guessLocked = true;

  const isCorrect = abbr === todayDistrict.properties.STATE;

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

  const correctState = todayDistrict.properties.STATE;
  const neighbors    = STATE_ADJACENCY[abbr] || [];
  const isAdjacent   = neighbors.includes(correctState);

  guessCount++;
  guessHistory.push({ text: abbr, correct, phase: 'state', adjacent: isAdjacent });

  if (correct) {
    correctStateGuessed = true;
    lockStateDropdown(abbr);
  } else {
    // Always eliminate the guessed state
    eliminatedStates.add(abbr);

    if (isAdjacent) {
      // 🔥 Correct state IS a neighbor of the guessed state.
      // Keep ONLY the guessed state's neighbors; eliminate everything else.
      const neighborsSet = new Set(neighbors);
      for (const s of Object.keys(stateDistrictMap)) {
        if (!neighborsSet.has(s)) eliminatedStates.add(s);
      }
    } else {
      // ❄️ Correct state is NOT adjacent to the guessed state.
      // Also eliminate all of the guessed state's neighbors (they can't be it either).
      for (const n of neighbors) eliminatedStates.add(n);
    }

    const wrongCount = guessHistory.filter(g => !g.correct).length;
    cluesRevealed = Math.min(wrongCount, FACT_DEFS.length);
    applyMapStage(wrongCount);
    if (guessCount >= MAX_GUESSES) { endGame(false); return; }
  }

  renderGuessHistory();
  renderClues();        // also calls updateUSRefMap() + renderStateChips()
  zoomUSRefMapToValid(); // zoom D3 map to remaining valid states
  saveGameState();
}

// ── Phase 2: district tile input ──────────────────────────────
let _distLocked = false; // prevent double-tap during tile animation

function submitDistrictTile(dist) {
  if (gameOver || !correctStateGuessed || _distLocked) return;
  const tileEl = document.querySelector(`.district-tile[data-dist="${CSS.escape(dist)}"]`);
  if (!tileEl || tileEl.disabled) return;

  _distLocked = true;
  if (!timerRunning) startTimer();

  const stateAbbr = todayDistrict.properties.STATE;
  const fullGuess = dist === 'AT-LARGE' ? `${stateAbbr}-AT-LARGE` : `${stateAbbr}-${dist}`;
  const correct   = fullGuess === todayDistrict.properties.CONG119;

  // Flash the tile
  tileEl.classList.add(correct ? 'tile-flash-correct' : 'tile-flash-wrong');
  setTimeout(() => {
    tileEl.classList.remove('tile-flash-correct', 'tile-flash-wrong');
    _distLocked = false;
    processDistrictGuessTile(dist, fullGuess, correct);
  }, 480);
}

function processDistrictGuessTile(dist, fullGuess, correct) {
  guessCount++;
  guessHistory.push({ text: fullGuess, correct, phase: 'district' });

  const tileEl = document.querySelector(`.district-tile[data-dist="${CSS.escape(dist)}"]`);

  if (correct) {
    if (tileEl) { tileEl.classList.add('tile-correct'); tileEl.disabled = true; }
    endGame(true);
    return;
  }

  // Wrong — grey out the tile
  if (tileEl) { tileEl.classList.add('tile-wrong'); tileEl.disabled = true; }

  // Flash the container
  const tilesEl = document.getElementById('district-tiles');
  tilesEl.classList.add('flash-wrong');
  setTimeout(() => tilesEl.classList.remove('flash-wrong'), 750);

  const wrongCount = guessHistory.filter(g => !g.correct).length;
  cluesRevealed = Math.min(wrongCount, FACT_DEFS.length);
  applyMapStage(wrongCount);

  if (guessCount >= MAX_GUESSES) { endGame(false); return; }

  renderGuessHistory();
  renderClues();
  saveGameState();
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
  updateUSRefMap(); // repaint D3 map with new color scheme
}

function updateThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.innerHTML = isDarkMode() ? svgIcon('sun') : svgIcon('moon');
}

// ---- US reference map (clickable states) ----

// ---- D3 AlbersUSA reference map ----

// Returns theme-aware D3 map colors
function _stateColors(abbr) {
  const dark = isDarkMode();
  const skyFill    = dark ? '#1a3a5c' : '#cce4f0';
  const redFill    = dark ? '#3d0a18' : '#fde8ec';
  const grayFill   = dark ? '#2a2a2c' : '#E0E0E0';
  const grayStroke = dark ? '#3a3a3c' : '#c4c9d4';
  const grayOp     = dark ? 0.55 : 0.35;

  if (correctStateGuessed) {
    const confirmed = todayDistrict ? todayDistrict.properties.STATE : null;
    if (abbr === confirmed) return { fill: redFill, stroke: '#C41230', sw: 2, opacity: 0.9 };
    return { fill: grayFill, stroke: grayStroke, sw: 0.5, opacity: grayOp };
  }
  const valid = getValidStates();
  if (valid.has(abbr)) return { fill: skyFill, stroke: '#007BC0', sw: 1.2, opacity: 0.85 };
  return { fill: grayFill, stroke: grayStroke, sw: 0.4, opacity: grayOp };
}

function _applyStateStyle(sel, abbr) {
  const s = _stateColors(abbr);
  // No stroke on individual polygons — borders drawn as white mesh overlay
  sel.attr('fill', s.fill)
     .attr('stroke', 'none')
     .attr('fill-opacity', s.opacity)
     .style('cursor', (!correctStateGuessed && getValidStates().has(abbr)) ? 'pointer' : 'default');
}

function initUSRefMap() {
  if (usRefMap) return;
  const container = document.getElementById('us-ref-map');
  const W = container.clientWidth  || 960;
  const H = container.clientHeight || 400;

  const svgSel = d3.select(container)
    .append('svg')
    .attr('width', W)
    .attr('height', H)
    .style('display', 'block')
    .style('background', 'transparent');

  usRefMap = svgSel.node();

  const projection = d3.geoAlbersUsa();
  const pathGen    = d3.geoPath().projection(projection);

  fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
    .then(r => r.json())
    .then(us => {
      const geojson = topojson.feature(us, us.objects.states);
      projection.fitSize([W, H], geojson);

      // Single group for ALL content — mesh paths included — so zoom transforms everything
      const g = svgSel.append('g');
      usRefMapGroup = g.node();

      geojson.features.forEach(feature => {
        const fips = String(feature.id).padStart(2, '0');
        const abbr = FIPS_TO_ABBR[fips];
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
            submitStateGuess(abbr);
          })
          .on('mouseover', () => {
            if (correctStateGuessed || !getValidStates().has(abbr)) return;
            pathEl.attr('fill', '#007BC0').attr('fill-opacity', 0.65);
          })
          .on('mouseout', () => _applyStateStyle(pathEl, abbr));
      });

      // White internal borders — inside the group so they zoom with it
      // vector-effect keeps stroke visually 1px regardless of scale
      g.append('path')
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr('d', pathGen)
        .attr('fill', 'none')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1)
        .attr('vector-effect', 'non-scaling-stroke')
        .attr('pointer-events', 'none');

      // Outer US boundary
      g.append('path')
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a === b))
        .attr('d', pathGen)
        .attr('fill', 'none')
        .attr('stroke', '#adb5bd')
        .attr('stroke-width', 0.75)
        .attr('vector-effect', 'non-scaling-stroke')
        .attr('pointer-events', 'none');

      // If a game is already in progress, zoom to current valid set
      if (eliminatedStates.size > 0 || correctStateGuessed) {
        zoomUSRefMapToValid(false);
      }
    })
    .catch(() => {});
}

// Zoom the D3 reference map to the bounding box of still-valid states.
// Pass animated=false for instant placement (e.g., on restore).
function zoomUSRefMapToValid(animated = true) {
  if (!usRefMapGroup || !usRefMap) return;

  // Determine target state set
  const targetSet = correctStateGuessed && todayDistrict
    ? new Set([todayDistrict.properties.STATE])
    : getValidStates();

  if (targetSet.size === 0) return;

  const W = usRefMap.clientWidth  || 960;
  const H = usRefMap.clientHeight || 400;

  // Compute bounding box in the group's LOCAL coordinate space
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [abbr, pathEl] of Object.entries(usRefLayers)) {
    if (!targetSet.has(abbr)) continue;
    const bb = pathEl.node().getBBox();
    if (bb.width === 0 && bb.height === 0) continue;
    x0 = Math.min(x0, bb.x);
    y0 = Math.min(y0, bb.y);
    x1 = Math.max(x1, bb.x + bb.width);
    y1 = Math.max(y1, bb.y + bb.height);
  }
  if (x0 === Infinity) return;

  const dx = x1 - x0;
  const dy = y1 - y0;
  if (dx === 0 || dy === 0) return;

  const padding = 24;
  const scale   = Math.min((W - 2 * padding) / dx, (H - 2 * padding) / dy);
  const tx      = W / 2 - scale * (x0 + dx / 2);
  const ty      = H / 2 - scale * (y0 + dy / 2);
  const transform = `translate(${tx},${ty}) scale(${scale})`;

  const gSel = d3.select(usRefMapGroup);
  if (animated) {
    gSel.transition().duration(700).ease(d3.easeCubicInOut).attr('transform', transform);
  } else {
    gSel.attr('transform', transform);
  }
}

function updateUSRefMap() {
  if (!usRefMap) return;
  for (const [abbr, pathEl] of Object.entries(usRefLayers)) {
    _applyStateStyle(pathEl, abbr);
  }
}

function renderStateChips() {
  const container = document.getElementById('state-chips');
  const countEl   = document.getElementById('state-match-count');
  if (!container) return;

  const validStates = getValidStates();
  countEl.textContent = `${validStates.size} of 51`;

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
      submitStateGuess(abbr);
    });

    container.appendChild(chip);
  }

  // Keep the US ref map in sync
  updateUSRefMap();
}

function lockStateDropdown(stateAbbr, instant = false) {
  // Show confirmed-state badge
  document.getElementById('state-confirmed-name').textContent = STATE_NAMES[stateAbbr] || stateAbbr;
  document.getElementById('state-confirmed').classList.remove('hidden');

  // Update chips and US ref map to show only the confirmed state
  renderStateChips();
  updateUSRefMap();
  zoomUSRefMapToValid();

  // Fade out national map → show district tile grid (only when game is still in progress)
  if (!gameOver) {
    fadeToDistrictTiles(stateAbbr, instant);
  }
}

function fadeToDistrictTiles(stateAbbr, instant = false) {
  const mapEl   = document.getElementById('us-ref-map');
  const tilesEl = document.getElementById('district-tiles');
  const labelEl = document.getElementById('ref-label');

  // Hide state chips — not needed in district phase
  document.getElementById('state-chips-section').classList.add('hidden');

  // Build tile buttons
  buildDistrictTiles(stateAbbr);

  // Update label
  const count = (stateDistrictMap[stateAbbr] || []).length;
  if (labelEl) {
    labelEl.textContent = count === 1
      ? 'One district — click to guess'
      : `Pick a district (${count} total)`;
  }

  if (instant) {
    // Restore — skip animation
    mapEl.classList.add('hidden');
    tilesEl.classList.remove('hidden');
    tilesEl.style.opacity = '1';
  } else {
    // Animate: fade out national map, fade in tiles
    mapEl.style.opacity = '0';
    setTimeout(() => { mapEl.classList.add('hidden'); }, 370);

    tilesEl.style.opacity = '0';
    tilesEl.classList.remove('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      tilesEl.style.opacity = '1';
    }));
  }
}

function buildDistrictTiles(stateAbbr) {
  const tilesEl  = document.getElementById('district-tiles');
  const districts = stateDistrictMap[stateAbbr] || [];

  // Collect already-guessed wrong districts
  const wrongDists = new Set(
    guessHistory
      .filter(g => g.phase === 'district' && !g.correct)
      .map(g => g.text.split('-').slice(1).join('-'))
  );
  const wonDist = guessHistory.find(g => g.phase === 'district' && g.correct);
  const wonDistPart = wonDist ? wonDist.text.split('-').slice(1).join('-') : null;

  tilesEl.innerHTML = districts.map(dist => {
    const label   = dist === 'AT-LARGE' ? 'AL' : String(parseInt(dist, 10));
    const isWrong   = wrongDists.has(dist);
    const isCorrect = wonDistPart === dist;
    const cls = isCorrect ? 'tile-correct' : isWrong ? 'tile-wrong' : '';
    const dis = (isWrong || isCorrect || gameOver) ? ' disabled' : '';
    return `<button class="district-tile ${cls}" data-dist="${dist}"${dis}>${label}</button>`;
  }).join('');
}

function endGame(won) {
  gameOver = true;
  stopTimer();
  cluesRevealed = FACT_DEFS.length;   // reveal all text clues
  applyMapStage(0, true);             // full OSM with labels
  // Ensure state is locked to the answer
  if (!correctStateGuessed) {
    correctStateGuessed = true;
    lockStateDropdown(todayDistrict.properties.STATE);
  }
  renderClues();
  renderGuessHistory();
  // Save stats BEFORE showResult so renderInlinePersonalStats shows current game
  savePersonalStats(won, guessCount, elapsedSeconds);
  showResult(won);
  saveGameState();

  // Submit to Firebase and render census data
  submitScore(won, guessCount, elapsedSeconds);
  fetchAndRenderCensusPanel(districtDataFor(todayDistrict));
}

// ============================================================
//  RESULT & SHARE
// ============================================================

/** Renders a mini D3 SVG showing the state's districts with today's district highlighted. */
function renderDistrictPreview() {
  const container = document.getElementById('result-district-preview');
  if (!container || !todayDistrict || !districts || !window.d3) return;
  container.innerHTML = '';

  const W = 440, H = 220, pad = 14;
  const dark = isDarkMode();
  const correctState = todayDistrict.properties.STATE;
  const stateFeatures = districts.filter(d => d.properties.STATE === correctState);
  const stateFC = { type: 'FeatureCollection', features: stateFeatures };

  const projection = d3.geoMercator()
    .fitExtent([[pad, pad], [W - pad, H - pad]], stateFC);
  const pathGen = d3.geoPath(projection);

  const svg = d3.create('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('class', 'district-preview-svg');

  // Background fill matching the card
  svg.append('rect')
    .attr('width', W).attr('height', H)
    .attr('fill', dark ? '#252526' : '#f3f4f6');

  // All state districts — clearly visible neutral fill
  svg.selectAll('.prev-bg')
    .data(stateFeatures)
    .enter().append('path')
    .attr('class', 'prev-bg')
    .attr('d', pathGen)
    .attr('fill', dark ? '#3c4043' : '#c8d2da')
    .attr('stroke', dark ? '#1a1a1b' : '#ffffff')
    .attr('stroke-width', 1.5);

  // Correct district — solid CMU red, white border so it pops
  svg.append('path')
    .datum(todayDistrict)
    .attr('d', pathGen)
    .attr('fill', '#C41230')
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 1.5);

  container.appendChild(svg.node());
}

function showResult(won) {
  const modal = document.getElementById('result-modal');
  modal.classList.remove('hidden');
  switchResultTab('result');

  const answer    = todayDistrict.properties.CONG119;
  const stateName = STATE_NAMES[todayDistrict.properties.STATE] || todayDistrict.properties.STATE;
  const distPart  = answer.split('-').slice(1).join('-');
  const distLabel = distPart === 'AT-LARGE' ? 'At-Large District' : `District ${parseInt(distPart, 10)}`;

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
      <span class="result-answer-sub">${stateName} &mdash; ${distLabel}</span>
    </div>
    ${won ? `<div class="result-time-line">Solved in <strong>${guessCount}</strong> guess${guessCount !== 1 ? 'es' : ''} &middot; <strong>${formatTime(elapsedSeconds)}</strong></div>` : ''}`;

  // Wordle-style statistics + distribution
  renderInlinePersonalStats();
}

function buildShareText() {
  const answer = todayDistrict.properties.CONG119;
  const won    = guessHistory.some(g => g.correct);
  const result = won ? `${guessCount}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  // Emoji grid: state-phase guesses use squares, district-phase uses a circle for the win
  const emoji = guessHistory.map(g => {
    if (g.correct) return '🟩';          // correct guess (any phase)
    if (g.phase === 'state') return '🟥'; // wrong state
    return '🟧';                          // wrong district (so close!)
  }).join(' ');
  return `🗳️ District Guess ${todayKey}\n📍 ${answer} — ${result}\n${emoji}\nhttps://jcervas.github.io/games/district-guess/`;
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
    `Today's district: ${gameOver ? todayDistrict.properties.CONG119 : '???'} · ${todayKey}`;

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
  const winRate = Math.round(stats.won / stats.played * 100);
  const dist    = stats.guessDist || {};
  const maxBar  = Math.max(...Object.values(dist), 1);

  const barRows = [1,2,3,4,5,6,'X'].map(k => {
    const count = dist[k] || 0;
    const pct   = Math.round(count / maxBar * 100);
    return `<div class="dist-row">
      <span class="dist-label">${k}</span>
      <div class="dist-bar-wrap"><div class="dist-bar" style="width:${pct}%"></div></div>
      <span class="dist-count">${count}</span>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="personal-grid">
      <div class="stat-card"><div class="stat-val">${stats.played}</div><div class="stat-label">Played</div></div>
      <div class="stat-card"><div class="stat-val">${winRate}%</div><div class="stat-label">Win Rate</div></div>
      <div class="stat-card"><div class="stat-val">${stats.streak}</div><div class="stat-label">Current Streak</div></div>
      <div class="stat-card"><div class="stat-val">${stats.maxStreak}</div><div class="stat-label">Max Streak</div></div>
    </div>
    <div class="guess-dist">
      <h4>Guess Distribution</h4>
      ${barRows}
    </div>`;
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

  // Reconstruct adjacency-based eliminations from saved guess history
  eliminatedStates = new Set();
  guessHistory.filter(g => g.phase === 'state' && !g.correct).forEach(g => {
    eliminatedStates.add(g.text);
    const neighbors = STATE_ADJACENCY[g.text] || [];
    if (g.adjacent === true) {
      // Was "hot" — everything outside this state's neighbors was eliminated
      const neighborsSet = new Set(neighbors);
      for (const s of Object.keys(stateDistrictMap)) {
        if (!neighborsSet.has(s)) eliminatedStates.add(s);
      }
    } else {
      // Was "cold" (or old save without adjacency data) — neighbors eliminated too
      for (const n of neighbors) eliminatedStates.add(n);
    }
  });

  // Reconstruct state-lock from guess history
  const correctState = todayDistrict.properties.STATE;
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
  elapsedSeconds      = 0;
  eliminatedStates    = new Set();
  _distLocked         = false;
  _guessLocked        = false;

  // Pick the new district
  todayDistrict = districts[newIdx];

  // Remove saved game so restoreGame() won't trigger on this key
  localStorage.removeItem(STORAGE_PREFIX + 'today');

  // --- UI resets ---

  // Hide modals / banners
  document.getElementById('result-modal').classList.add('hidden');
  document.getElementById('already-played-banner').classList.add('hidden');

  // Timer
  const tvEl = document.getElementById('timer-value');
  if (tvEl) tvEl.textContent = '0:00';
  document.getElementById('timer-display').classList.remove('running');

  // Reset Leaflet map: remove district layer, pan back to default view
  if (districtLayer) { map.removeLayer(districtLayer); districtLayer = null; }
  applyMapStage(0);
  map.setView([37.8, -96], 4);

  // Reset US reference map (clear the SVG so initUSRefMap rebuilds it)
  const refMapEl = document.getElementById('us-ref-map');
  refMapEl.innerHTML = '';
  refMapEl.classList.remove('hidden');
  refMapEl.style.opacity = '';
  usRefMap       = null;
  usRefMapGroup  = null;
  usRefLayers    = {};

  // Reset district tiles
  const tilesEl = document.getElementById('district-tiles');
  tilesEl.innerHTML = '';
  tilesEl.classList.add('hidden');
  tilesEl.style.opacity = '';

  // Re-show state chips section
  document.getElementById('state-chips-section').classList.remove('hidden');

  // Hide state-confirmed badge
  document.getElementById('state-confirmed').classList.add('hidden');

  // Reset reference label
  const labelEl = document.getElementById('ref-label');
  if (labelEl) labelEl.textContent = 'Click a state to select it';

  // Re-initialise reference map and render
  initUSRefMap();
  renderDistrict(todayDistrict);
  renderClues();
  renderGuessHistory();
  document.getElementById('guess-remaining').textContent = `${MAX_GUESSES} guesses`;
}

// ============================================================
//  INIT
// ============================================================
async function init() {
  todayKey = getTodayKey();
  initFirebase();

  username = getUsername();

  // Load GeoJSON
  let data;
  try {
    const res = await fetch('./national_cong119_carto_boundary.json');
    data = await res.json();
    districts = data.features;
  } catch {
    alert('Failed to load district data. Please refresh.');
    return;
  }

  // Build state→district lookup
  stateDistrictMap = buildStateDistrictMap(districts);

  // Pick today's district deterministically by date
  const idx = seededIndex(dateSeed(), districts.length);
  todayDistrict = districts[idx];

  initMap();
  initUSRefMap();   // start loading US states reference map

  // Check for saved game from today
  const saved = loadGameState();
  if (saved) {
    restoreGame(saved);
    return;
  }

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

  init();

  // District tile clicks — event delegation on the tile container
  document.getElementById('district-tiles').addEventListener('click', e => {
    const tile = e.target.closest('.district-tile');
    if (!tile || tile.disabled) return;
    submitDistrictTile(tile.dataset.dist);
  });

  // Play Again — pick a new district (offset from daily seed by replayCount)
  document.getElementById('play-again-btn').addEventListener('click', () => {
    replayCount++;
    const newIdx = seededIndex(dateSeed() + replayCount, districts.length);
    resetGame(newIdx);
  });

  // Share
  document.getElementById('share-btn').addEventListener('click', () => {
    const text    = buildShareText();
    const copiedEl = document.getElementById('share-copied');
    navigator.clipboard.writeText(text).then(() => {
      copiedEl.classList.remove('hidden');
      setTimeout(() => copiedEl.classList.add('hidden'), 2000);
    }).catch(() => {
      prompt('Copy this result:', text);
    });
  });

  // Leaderboard
  document.getElementById('leaderboard-btn').addEventListener('click', openLeaderboard);
  document.getElementById('show-results-btn').addEventListener('click', () => {
    document.getElementById('result-modal').classList.remove('hidden');
    switchResultTab('result');
  });

  // Result modal tabs
  document.querySelectorAll('.result-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchResultTab(btn.dataset.rtab));
  });

  // How to play — auto-show on first visit
  const howToModal = document.getElementById('how-to-modal');
  if (!localStorage.getItem(HOW_TO_SEEN_KEY)) {
    howToModal.classList.remove('hidden');
  }
  document.getElementById('how-to-btn').addEventListener('click', () => {
    howToModal.classList.remove('hidden');
  });
  document.getElementById('how-to-got-it').addEventListener('click', () => {
    howToModal.classList.add('hidden');
    localStorage.setItem(HOW_TO_SEEN_KEY, '1');
  });

  // Dark mode toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleDarkMode);

  // Also update toggle icon when system preference changes (no user action needed)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeToggle);

  // Modal close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').classList.add('hidden');
    });
  });

  // Close modal on backdrop click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.add('hidden');
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
});
