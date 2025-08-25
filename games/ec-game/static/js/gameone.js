// gameone.js with Supabase integration

/* Supabase front-end hook for GitHub Pages
   - Add this after your inputs and before </body>
   - Update SUPABASE_URL and SUPABASE_ANON_KEY
*/
const SUPABASE_URL = 'https://renowzxywrnuomxzsydn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbm93enh5d3JudW9teHpzeWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwODc1NDgsImV4cCI6MjA3MTY2MzU0OH0.8AvSHDFDPD9b-hHOTN1DPLwrtjdWnXjmjXNpumh0YL0';

// Load supabase-js when using this as a standalone file
// <script src="https://unpkg.com/@supabase/supabase-js@2"></script>

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function readValues() {
  const ids = ['A','B','C','D','E','F','G'];
  const vals = ids.map(id => {
    const el = document.getElementById('jc-user-submit-input' + id);
    const n = Number(el && el.value ? el.value : 0);
    return Number.isFinite(n) ? Math.trunc(n) : 0; // force integer
  });
  return vals;
}

function validate(values) {
  // All integers and between 0..100
  for (const v of values) {
    if (!Number.isInteger(v) || v < 0 || v > 100) return false;
  }
  const sum = values.reduce((a,b) => a + b, 0);
  return sum === 100;
}

async function submitAllocations() {
  const btn = document.querySelector('.jc-submit');
  const values = readValues();
  if (!validate(values)) {
    alert('Please enter integers 0–100 that sum to exactly 100.');
    return;
  }
  try {
    btn && (btn.disabled = true);
    const payload = { a: values[0], b: values[1], c: values[2], d: values[3], e: values[4], f: values[5], g: values[6] };
    const { error } = await sb.from('responses').insert([payload]);
    if (error) {
      console.error(error);
      alert('Save failed: ' + (error.message || 'Unknown error'));
    } else {
      alert('Saved! Thanks for playing.');
    }
  } finally {
    btn && (btn.disabled = false);
  }
}

// Wire up the existing "Submit" button with class .jc-submit
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.jc-submit');
  if (btn) btn.addEventListener('click', submitAllocations);
});


async function getOpponent() {
  const { data, error } = await sb.rpc("get_random_participant");
  if (!error && data.length) return data[0];
  return null;
}

async function getMeans() {
  const { data, error } = await sb.rpc("get_mean_allocations");
  if (!error && data.length) return data[0];
  return null;
}

  async function loadStats() {
    // 1. Count participants
    const { data: count, error: err1 } = await sb.rpc("get_participant_count");
    if (!err1) {
      document.querySelectorAll(".participant-count").forEach(el => {
        el.textContent = count + " participants";
      });
    }
  }

// D3 chart for means
function renderMeanChart(means) {
  const data = Object.entries(means).map(([state, val]) => ({state, value: val}));

  const width = 400, height = 200;
  const svg = d3.select("#my_dataviz").html("").append("svg")
    .attr("width", width)
    .attr("height", height);

  const x = d3.scaleBand().domain(data.map(d => d.state)).range([0, width]).padding(0.1);
  const y = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).range([height, 0]);

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.state))
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("fill", "#16212B");
}

// Submit button logic
function setupSubmit() {
  const btn = document.querySelector(".jc-submit");
  if (!btn) return;

  btn.addEventListener("click", async function() {
    const values = [
      parseInt(document.getElementById("jc-user-submit-inputA").value) || 0,
      parseInt(document.getElementById("jc-user-submit-inputB").value) || 0,
      parseInt(document.getElementById("jc-user-submit-inputC").value) || 0,
      parseInt(document.getElementById("jc-user-submit-inputD").value) || 0,
      parseInt(document.getElementById("jc-user-submit-inputE").value) || 0,
      parseInt(document.getElementById("jc-user-submit-inputF").value) || 0,
      parseInt(document.getElementById("jc-user-submit-inputG").value) || 0
    ];

    const sum = values.reduce((a,b) => a+b, 0);
    if (sum !== 100) {
      alert("You must allocate exactly $100!");
      return;
    }

    // Fetch opponent
    const opponent = await getOpponent();
    if (!opponent) {
      alert("Could not fetch an opponent.");
      return;
    }

    // Simulate outcome
    const playerWins = [];
    const opponentWins = [];
    ["a","b","c","d","e","f","g"].forEach((state, idx) => {
      if (values[idx] > opponent[state]) {
        playerWins.push(state);
      } else if (values[idx] < opponent[state]) {
        opponentWins.push(state);
      } else {
        if (Math.random() < 0.5) playerWins.push(state);
        else opponentWins.push(state);
      }
    });

    console.log("Player wins:", playerWins);
    console.log("Opponent wins:", opponentWins);

    // Fetch means
    const means = await getMeans();
    if (means) {
      console.log("Mean allocations:", means);
      renderMeanChart(means);
    }

    // Show modal
    document.getElementById("postGame-text-id").textContent =
      "You competed against a randomly selected opponent!";
    document.getElementById("postGame").style.display = "block";
  });
}

document.addEventListener("DOMContentLoaded", setupSubmit);
