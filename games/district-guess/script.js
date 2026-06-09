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

// ============================================================
//  GAME CONSTANTS
// ============================================================
const MAX_GUESSES = 5;
const STORAGE_PREFIX = 'districtguess_';

// Built at load time from GeoJSON: { 'TX': ['01','02',...], 'WY': ['AT-LARGE'], ... }
let stateDistrictMap = {};

// Text clues — one revealed per wrong guess (0-indexed).
// Clue 0 unlocks after the 1st wrong guess, etc.
const CLUE_DEFS = [
  {
    icon: '🗺️',
    label: 'Region',
    fn: d => STATE_REGIONS[d.state] || 'Unknown'
  },
  {
    icon: '🕐',
    label: 'Time zone',
    fn: d => (STATE_TIMEZONES[d.state] || 'Unknown') + ' Time'
  },
  {
    icon: '👥',
    label: 'Largest racial/ethnic group',
    fn: async d => fetchCensus(d, 'plurality')
  },
  {
    icon: '💵',
    label: 'Median Household Income',
    fn: async d => fetchCensus(d, 'income')
  },
  {
    icon: '🌐',
    label: 'Map',
    fn: () => 'Full labeled map revealed — one guess remaining!'
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
let usRefMap            = null;   // US states reference map
let usRefLayers         = {};     // abbr → Leaflet GeoJSON layer
let wrongStateGuesses   = new Set(); // states guessed wrong (immediately greyed out)
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

function populateStateDropdown() {
  const sel = document.getElementById('stateSelect');
  // Sort states alphabetically by full name
  const sorted = Object.keys(stateDistrictMap).sort((a, b) =>
    (STATE_NAMES[a] || a).localeCompare(STATE_NAMES[b] || b)
  );
  for (const abbr of sorted) {
    const opt = document.createElement('option');
    opt.value = abbr;
    opt.textContent = STATE_NAMES[abbr] || abbr;
    sel.appendChild(opt);
  }
}

function populateDistrictDropdown(stateAbbr) {
  const sel = document.getElementById('districtSelect');
  sel.innerHTML = '<option value="">District…</option>';
  if (!stateAbbr || !stateDistrictMap[stateAbbr]) {
    sel.disabled = true;
    return;
  }
  const dists = stateDistrictMap[stateAbbr];
  for (const d of dists) {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d === 'AT-LARGE' ? 'At-Large' : `District ${parseInt(d, 10)}`;
    sel.appendChild(opt);
  }
  // If only one district (at-large state), auto-select it
  if (dists.length === 1) {
    sel.value = dists[0];
  }
  sel.disabled = false;
}

// Also filter chips when state dropdown changes (narrows which chips are clickable)
function syncChipsToDropdown(stateAbbr) {
  document.querySelectorAll('.state-chip').forEach(chip => {
    chip.classList.toggle('selected', chip.textContent === stateAbbr);
  });
}

function getGuessFromDropdowns() {
  if (!correctStateGuessed) {
    // Phase 1: state-only guess
    const state = document.getElementById('stateSelect').value;
    return state || null;
  } else {
    // Phase 2: district guess (state already locked)
    const state = document.getElementById('stateSelect').value;
    const dist  = document.getElementById('districtSelect').value;
    if (!state || !dist) return null;
    return dist === 'AT-LARGE' ? `${state}-AT-LARGE` : `${state}-${dist}`;
  }
}

function updateGuessButton() {
  const btn = document.getElementById('guessButton');
  btn.textContent = correctStateGuessed ? 'Guess District' : 'Guess State';
}

function resetDropdowns() {
  const stateSel = document.getElementById('stateSelect');
  const distSel  = document.getElementById('districtSelect');
  stateSel.value = '';
  distSel.innerHTML = '<option value="">District…</option>';
  distSel.disabled = true;
}

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
      lastDate: null
    };
    stats.played++;
    if (won) {
      stats.won++;
      stats.streak = (stats.lastDate === getPrevDayKey()) ? stats.streak + 1 : 1;
      stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
      stats.guessDist[guesses] = (stats.guessDist[guesses] || 0) + 1;
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

async function fetchAndRenderCensusPanel(districtData) {
  const censusSection = document.getElementById('census-section');
  const censusLoading = document.getElementById('census-loading');
  const censusDataEl  = document.getElementById('census-data');
  censusSection.classList.remove('hidden');

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
//  CLUES UI
// ============================================================
function renderClues() {
  renderStateChips(); // update chip states whenever clues change
  const list = document.getElementById('clues-list');
  list.innerHTML = '';

  for (let i = 0; i < CLUE_DEFS.length; i++) {
    const def = CLUE_DEFS[i];
    const div = document.createElement('div');
    if (i < cluesRevealed) {
      div.className = 'clue-item revealed';
      div.innerHTML = `<span class="clue-num">${i+1}</span><span class="clue-icon">${def.icon}</span><span class="clue-text"><strong>${def.label}:</strong> <span class="clue-val">…</span></span>`;
      // Resolve async clue values
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
      const guessesLeft = MAX_GUESSES - guessCount;
      const unlocksAfter = i - cluesRevealed + 1;
      div.className = 'clue-item locked';
      div.innerHTML = `<span class="clue-num">${i+1}</span><span class="clue-icon">🔒</span><span class="clue-text">${def.label} — unlocks after ${unlocksAfter} more wrong guess${unlocksAfter !== 1 ? 'es' : ''}</span>`;
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
    document.getElementById('timer-display').textContent = '⏱ ' + formatTime(elapsedSeconds);
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
  el.innerHTML = guessHistory.map(g => `
    <div class="guess-row ${g.correct ? 'correct' : 'wrong'}">
      <span class="guess-icon">${g.correct ? '✅' : '❌'}</span>
      <span>${g.text}</span>
    </div>
  `).join('');

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

// Called when a state is chosen (map click, chip click, or Guess State button).
// Shows a flash animation then processes the guess.
let _guessLocked = false; // prevent double-submit during animation
function submitStateGuess(abbr) {
  if (gameOver || correctStateGuessed || _guessLocked) return;
  _guessLocked = true;

  // Set dropdown value
  const stateSel = document.getElementById('stateSelect');
  stateSel.value = abbr;

  const isCorrect = abbr === todayDistrict.properties.STATE;

  // Flash the state on the map
  const layer = usRefLayers[abbr];
  if (layer) {
    layer.setStyle(isCorrect
      ? { color: '#15803d', weight: 3, fillColor: '#4ade80', fillOpacity: 0.95 }
      : { color: '#dc2626', weight: 3, fillColor: '#fca5a5', fillOpacity: 0.95 });
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

  guessCount++;
  guessHistory.push({ text: abbr, correct, phase: 'state' });

  if (correct) {
    correctStateGuessed = true;
    lockStateDropdown(abbr);
  } else {
    wrongStateGuesses.add(abbr);  // immediately grey it out
    const wrongCount = guessHistory.filter(g => !g.correct).length;
    cluesRevealed = Math.min(wrongCount, CLUE_DEFS.length);
    applyMapStage(wrongCount);
    if (guessCount >= MAX_GUESSES) { endGame(false); return; }
    resetDropdowns();
  }

  renderGuessHistory();
  renderClues();
  updateGuessButton();
  saveGameState();
}

function submitGuess() {
  if (gameOver) return;

  if (!correctStateGuessed) {
    // Phase 1: state guess — route through animation
    const abbr = document.getElementById('stateSelect').value;
    if (!abbr) {
      const row = document.getElementById('guess-selects');
      row.classList.add('shake');
      setTimeout(() => row.classList.remove('shake'), 400);
      return;
    }
    submitStateGuess(abbr);
    return;
  }

  // ── Phase 2: district guess ──
  const guess = getGuessFromDropdowns();
  if (!guess) {
    const row = document.getElementById('guess-selects');
    row.classList.add('shake');
    setTimeout(() => row.classList.remove('shake'), 400);
    return;
  }

  if (!timerRunning) startTimer();

  const correctDistrict = todayDistrict.properties.CONG119;
  const correct = guess === correctDistrict;
  guessCount++;
  guessHistory.push({ text: guess, correct, phase: 'district' });

  if (correct) {
    endGame(true); return;
  } else {
    // Flash wrong animation on the guess row
    const row = document.getElementById('guess-input-row');
    row.classList.add('flash-wrong');
    setTimeout(() => row.classList.remove('flash-wrong'), 700);

    const wrongCount = guessHistory.filter(g => !g.correct).length;
    cluesRevealed = Math.min(wrongCount, CLUE_DEFS.length);
    applyMapStage(wrongCount);
    if (guessCount >= MAX_GUESSES) { endGame(false); return; }
    document.getElementById('districtSelect').value = '';
  }

  renderGuessHistory();
  renderClues();
  saveGameState();
}

// ============================================================
//  REFERENCE PANEL
// ============================================================

// Returns the set of state abbreviations still consistent with revealed clues.
function getValidStates() {
  const all = Object.keys(stateDistrictMap);
  if (!todayDistrict) return new Set(all);
  const correctState  = todayDistrict.properties.STATE;
  const correctRegion = STATE_REGIONS[correctState];
  const correctTZ     = STATE_TIMEZONES[correctState];

  return new Set(all.filter(abbr => {
    if (wrongStateGuesses.has(abbr))                                     return false;
    if (cluesRevealed >= 1 && STATE_REGIONS[abbr]    !== correctRegion) return false;
    if (cluesRevealed >= 2 && STATE_TIMEZONES[abbr]  !== correctTZ)     return false;
    return true;
  }));
}

// Inverted lookup: full name → abbreviation (built from STATE_NAMES)
const STATE_ABBR_BY_NAME = {};
for (const [abbr, name] of Object.entries(STATE_NAMES)) STATE_ABBR_BY_NAME[name] = abbr;

// ---- US reference map (clickable states) ----

function initUSRefMap() {
  if (usRefMap) return; // already initialised
  usRefMap = L.map('us-ref-map', {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
    dragging: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
  });

  // Fit to CONUS + AK/HI by default; we'll fitBounds after data loads
  usRefMap.setView([38, -96], 3);

  fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
    .then(r => r.json())
    .then(geojson => {
      // Filter to 50 states + DC  (drop territories)
      const known = new Set(Object.values(STATE_NAMES));
      geojson.features = geojson.features.filter(f => known.has(f.properties.name));

      L.geoJSON(geojson, {
        style: f => stateStyle(STATE_ABBR_BY_NAME[f.properties.name]),
        onEachFeature(feature, layer) {
          const abbr = STATE_ABBR_BY_NAME[feature.properties.name];
          if (!abbr) return;
          usRefLayers[abbr] = layer;

          layer.on('click', () => {
            if (gameOver || correctStateGuessed) return;
            const valid = getValidStates();
            if (!valid.has(abbr)) return;
            submitStateGuess(abbr);
          });

          layer.on('mouseover', () => {
            const valid = getValidStates();
            if (correctStateGuessed || !valid.has(abbr)) return;
            layer.setStyle({ fillOpacity: 0.85, weight: 2 });
          });
          layer.on('mouseout', () => layer.setStyle(stateStyle(abbr)));
        }
      }).addTo(usRefMap);

      usRefMap.fitBounds([
        [24, -125], [50, -66]   // CONUS bounding box
      ]);
    })
    .catch(() => {}); // fail silently — ref map is optional
}

function stateStyle(abbr) {
  if (!abbr) return { color: '#94a3b8', weight: 1, fillColor: '#e2e8f0', fillOpacity: 0.5 };
  if (correctStateGuessed) {
    const confirmed = todayDistrict ? todayDistrict.properties.STATE : null;
    if (abbr === confirmed) return { color: '#16a34a', weight: 2, fillColor: '#bbf7d0', fillOpacity: 0.8 };
    return { color: '#94a3b8', weight: 0.5, fillColor: '#f1f5f9', fillOpacity: 0.4 };
  }
  const valid = getValidStates();
  if (valid.has(abbr)) {
    return { color: '#2563eb', weight: 1.5, fillColor: '#dbeafe', fillOpacity: 0.65 };
  }
  return { color: '#cbd5e1', weight: 0.5, fillColor: '#f1f5f9', fillOpacity: 0.25 };
}

function updateUSRefMap() {
  if (!usRefMap) return;
  const valid = getValidStates();

  for (const [abbr, layer] of Object.entries(usRefLayers)) {
    layer.setStyle(stateStyle(abbr));
  }

  // Zoom map to fit the valid (or confirmed) states
  const targetAbbrs = correctStateGuessed
    ? [todayDistrict.properties.STATE]
    : [...valid];

  const targetLayers = targetAbbrs
    .map(a => usRefLayers[a])
    .filter(Boolean);

  if (targetLayers.length > 0) {
    const group = L.featureGroup(targetLayers);
    const allStatesCount = Object.keys(stateDistrictMap).length;
    // Only zoom in if we've narrowed from the full set (or state confirmed)
    if (correctStateGuessed || valid.size < allStatesCount) {
      usRefMap.fitBounds(group.getBounds(), { padding: [20, 20], animate: true, duration: 0.5 });
    } else {
      usRefMap.fitBounds([[24, -125], [50, -66]]);
    }
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

function lockStateDropdown(stateAbbr) {
  const stateSel = document.getElementById('stateSelect');
  stateSel.value    = stateAbbr;
  stateSel.disabled = true;
  stateSel.classList.add('confirmed');

  const badge = document.getElementById('state-confirmed');
  document.getElementById('state-confirmed-name').textContent = STATE_NAMES[stateAbbr] || stateAbbr;
  badge.classList.remove('hidden');

  // Repopulate district dropdown and reveal it for phase 2
  populateDistrictDropdown(stateAbbr);
  document.getElementById('districtSelect').classList.remove('hidden');
  // Update chips and US ref map to reflect confirmed state
  renderStateChips();
  updateUSRefMap();
  updateGuessButton();
}

function endGame(won) {
  gameOver = true;
  stopTimer();
  cluesRevealed = CLUE_DEFS.length;   // reveal all text clues
  applyMapStage(0, true);             // full OSM with labels
  // Ensure state is locked to the answer
  if (!correctStateGuessed) {
    correctStateGuessed = true;
    lockStateDropdown(todayDistrict.properties.STATE);
  }
  renderClues();
  document.getElementById('guess-input-row').classList.add('hidden');
  renderGuessHistory();
  showResult(won);
  savePersonalStats(won, guessCount, elapsedSeconds);
  saveGameState();

  // Submit to Firebase and render census data
  submitScore(won, guessCount, elapsedSeconds);
  fetchAndRenderCensusPanel(districtDataFor(todayDistrict));
}

// ============================================================
//  RESULT & SHARE
// ============================================================
function showResult(won) {
  const section = document.getElementById('result-section');
  const msg     = document.getElementById('result-message');
  const stats   = document.getElementById('result-stats');
  section.classList.remove('hidden');

  const answer = todayDistrict.properties.CONG119;

  if (won) {
    msg.textContent = guessCount === 1 ? 'Hole in one! 🎉' :
                      guessCount <= 3  ? 'Impressive! 🎊' : 'Got it! ✅';
    msg.className = 'won';
    stats.innerHTML = `The answer was <strong>${answer}</strong>.<br>
      Solved in <strong>${guessCount} guess${guessCount !== 1 ? 'es' : ''}</strong> and <strong>${formatTime(elapsedSeconds)}</strong>.`;
  } else {
    msg.textContent = 'Better luck tomorrow! 😅';
    msg.className = 'lost';
    stats.innerHTML = `The answer was <strong>${answer}</strong>.<br>
      Come back tomorrow for a new district.`;
  }
}

function buildShareText() {
  const answer = todayDistrict.properties.CONG119;
  const won    = guessHistory.some(g => g.correct);
  const emoji  = guessHistory.map(g => g.correct ? '🟩' : '🟥').join('');
  const result = won ? `${guessCount}/${MAX_GUESSES}` : 'X/6';
  return `District Guess ${todayKey}\n${answer} — ${result}\n${emoji}\nhttps://jcervas.github.io/games/district-guess/`;
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

  document.getElementById('timer-display').textContent = '⏱ ' + formatTime(elapsedSeconds);

  // Reconstruct wrong state guesses
  guessHistory.filter(g => g.phase === 'state' && !g.correct).forEach(g => wrongStateGuesses.add(g.text));

  // Reconstruct state-lock from guess history
  const correctState = todayDistrict.properties.STATE;
  const stateFound   = guessHistory.some(g => g.phase === 'state' ? g.correct : g.text.split('-')[0] === correctState);
  if (stateFound) {
    correctStateGuessed = true;
    lockStateDropdown(correctState);
  } else {
    document.getElementById('districtSelect').classList.add('hidden');
  }
  updateGuessButton();

  // Reconstruct map stage
  const wrongCount = guessHistory.filter(g => !g.correct).length;
  applyMapStage(wrongCount, gameOver);

  renderDistrict(todayDistrict);
  renderGuessHistory();
  renderClues();

  if (gameOver) {
    document.getElementById('guess-input-row').classList.add('hidden');
    showResult(saved.won);
    fetchAndRenderCensusPanel(districtDataFor(todayDistrict));
    document.getElementById('already-played-banner').classList.remove('hidden');
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

  // Build state→district lookup and populate state dropdown
  stateDistrictMap = buildStateDistrictMap(districts);
  populateStateDropdown();

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

  // Fresh game — ask for username if not set
  const startGame = () => {
    renderDistrict(todayDistrict);
    renderClues();         // also calls renderStateChips()
    renderGuessHistory();
    document.getElementById('guess-remaining').textContent = `${MAX_GUESSES} guesses`;
  };

  if (!username) {
    promptUsername(startGame);
  } else {
    startGame();
  }
}

// ============================================================
//  EVENT LISTENERS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  init();

  // Hide district dropdown until state is confirmed (phase 2)
  document.getElementById('districtSelect').classList.add('hidden');
  updateGuessButton();

  document.getElementById('guessButton').addEventListener('click', submitGuess);

  document.getElementById('stateSelect').addEventListener('change', e => {
    if (!correctStateGuessed) populateDistrictDropdown(e.target.value);
    syncChipsToDropdown(e.target.value);
  });

  // Allow Enter key on the district dropdown to submit
  document.getElementById('districtSelect').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitGuess();
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
    openLeaderboard();
  });

  // How to play
  document.getElementById('how-to-btn').addEventListener('click', () => {
    document.getElementById('how-to-modal').classList.remove('hidden');
  });

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
