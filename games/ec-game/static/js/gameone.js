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
  try {
    const { data, error } = await sb.rpc("get_participant_count");
    if (error) throw error;
    document.querySelectorAll(".participant-count").forEach(el => {
      el.textContent = data + " participants";
    });
  } catch (e) {
    console.error("Count failed:", e);
  }
}
document.addEventListener("DOMContentLoaded", loadStats);



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


var graphic = d3.select(".jc-graphic"),
    submitButton = d3.select(".jc-submit"),
    bottomSection = d3.select(".jc-bottom-section"),
    inputBox = $('input'),
    histogramTitle = d3.select(".jc-histogram-title"),
    totalParticipants = d3.select(".jc-participants"),
    eventualDecimalRound = d3.select(".jc-decimal-eventual-round"),
    roundingWarning = d3.select(".jc-roundinjc-warning"),
    outOfBoundsWarning = d3.select('.jc-out-of-bounds-warning'),
    totalHighWarning = d3.select(".jc-totalHighWarning-jc-warning"),
    totalLowWarning = d3.select(".jc-totalLowWarning-jc-warning"),
    totalAlloted = d3.select(".jc-total-allocated"),
    inputA = document.getElementById("jc-user-submit-inputA"),
    inputB = document.getElementById("jc-user-submit-inputB"),
    inputC = document.getElementById("jc-user-submit-inputC"),
    inputD = document.getElementById("jc-user-submit-inputD"),
    inputE = document.getElementById("jc-user-submit-inputE"),
    inputF = document.getElementById("jc-user-submit-inputF"),
    inputG = document.getElementById("jc-user-submit-inputG");
    var currentTime = (new Date()).getTime();

var a = generateQAPairs(".jc-option-1", ".jc-answer-1", 30, 80);
var b = generateQAPairs(".jc-option-2", ".jc-answer-2", 0, 49);
var c = generateState(".jc-state-1", ".jc-state-1a", ".jc-ev-1");
var c2 = generateState(".jc-state-2", ".jc-state-2a", ".jc-ev-2");

submitButton.on("click", showAnswer); // This triggers function to generate D3, and send user inputs to JSON

function generateQAPairs(sel1, sel2, floor, ceil) {
    var dif = ceil - floor,
        qNum = Math.round(floor + Math.random() * dif),
        ansMin = qNum + 1
    ansNum = Math.round(Math.floor(Math.random() * qNum));

    d3.select(sel1).text(qNum);
    d3.select(sel2).text(ansNum);
    d3.select(".jc-answer-3").text(ansMin);
    return qNum;
}

function generateState(sel3, sel4, sel5) {
    var state = "ABCDEFG";
    var st = state.substr(Math.floor(Math.random() * 7), 1);

    if (st == "A") {
        ev = 3
    } else if (st == "B") {
        ev = 5
    } else if (st == "C") {
        ev = 8
    } else if (st == "D") {
        ev = 13
    } else if (st == "E") {
        ev = 21
    } else if (st == "F") {
        ev = 34
    } else {
        ev = 55
    }
    d3.select(sel3).text(st);
    d3.select(sel4).text(st);
    d3.select(sel5).text(ev);

    return st;
}


function getValues() {
    return [inputA.value, inputB.value, inputC.value, inputD.value, inputE.value, inputF.value, inputG.value];
}

function myFunct() { // console.log("Checking Validity of inputs")
    totalVal = checktotalVar()
    document.getElementById("jc-total-allocated").innerHTML = (100 - totalVal);

    var userData = getValues()

    var isValidA = checkInputValidity(userData[0]);
    var isValidB = checkInputValidity(userData[1]);
    var isValidC = checkInputValidity(userData[2]);
    var isValidD = checkInputValidity(userData[3]);
    var isValidE = checkInputValidity(userData[4]);
    var isValidF = checkInputValidity(userData[5]);
    var isValidG = checkInputValidity(userData[6]);
}

function inputboxes() {

    var userData = getValues()

    inputA.value = Math.round(userData[0]);
    inputB.value = Math.round(userData[1]);
    inputC.value = Math.round(userData[2]);
    inputD.value = Math.round(userData[3]);
    inputE.value = Math.round(userData[4]);
    inputF.value = Math.round(userData[5]);
    inputG.value = Math.round(userData[6]);
    inputA.select();
}

function checkDecimal() {
var userData = getValues()

    inputA.value = Math.round(userData[0]);
    inputB.value = Math.round(userData[1]);
    inputC.value = Math.round(userData[2]);
    inputD.value = Math.round(userData[3]);
    inputE.value = Math.round(userData[4]);
    inputF.value = Math.round(userData[5]);
    inputG.value = Math.round(userData[6]);

}

function checkInputValidity(val) { //checks that the inputs are valid
    totalVal = checktotalVar()

    var val2 = val;
    outOfBoundsWarning.classed('jc-hidden', val2 >= 0 && val2 <= 100);

    if (totalVal > 100) {
        totalHighWarning.classed("jc-hidden", false);
    } else {
        totalHighWarning.classed("jc-hidden", true);
    }

    if (totalVal < 100) {
        totalLowWarning.classed("jc-hidden", false);
    } else {
        totalLowWarning.classed("jc-hidden", true);
    }

    if (totalVal == 100) {
        submitButton.classed("jc-disabled", false);
    } else {
        submitButton.classed("jc-disabled", true);
    }

    return (!isNaN(val2) && (totalVar == 100));
}

function checktotalVar() { //checks that user data is equal to 100
            var userData = getValues()
            const add = (a, b) => +a + +b

    totalVar = (userData.reduce(add))
    if (totalVar == 100) {
        submitButton.classed("jc-disabled", false);
    }
    return totalVar
}

function coinToss() {
    var coin = Math.floor(Math.random() * 1);

    if (coin == 0) {
        return 0;
    } else {
        return 1;
    }
};

function showAnswer() {
    console.log("Checking Validity of Submitted Allocations")
    //check validity of answer backup
    var userData = getValues()

    var isValidA = checkInputValidity(userData[0]);
    var isValidB = checkInputValidity(userData[1]);
    var isValidC = checkInputValidity(userData[2]);
    var isValidD = checkInputValidity(userData[3]);
    var isValidE = checkInputValidity(userData[4]);
    var isValidF = checkInputValidity(userData[5]);
    var isValidG = checkInputValidity(userData[6]);

    if (!isValidA) return;
    if (!isValidB) return;
    if (!isValidC) return;
    if (!isValidD) return;
    if (!isValidE) return;
    if (!isValidF) return;
    if (!isValidG) return;

    //deactivate text input
    inputA.blur();
    inputB.blur();
    inputC.blur();
    inputD.blur();
    inputE.blur();
    inputF.blur();
    inputG.blur();

    //turn off the whole input container
    d3.select("#jc-input").classed("jc-disabled", true);

    //what was the user's allocation?
    userData = getValues()

    var userData = {
        A: userData[0],
        B: userData[1],
        C: userData[2],
        D: userData[3],
        E: userData[4],
        F: userData[5],
        G: userData[6],
        date: Date(),
        timePondered: ((new Date()).getTime() - currentTime) / 1000
    };
    console.log("User Allocation: ", userData);

    function userVotes(userData, opponentData) {
        var votes = [3,5,8,13,21,34,55]
        var user_votes = 0;
        var opponent_votes = 0;
        for (let state_idx = 0; state_idx <= 6; state_idx++) {
            var state_votes = votes[state_idx];
            var user_allocation = userData[state_idx];
            var opponent_allocation = opponentData[state_idx];
            var user_wins_tie = (user_allocation == opponent_allocation) & coinToss();
            // console.log("user_allocation: ", user_allocation, "opponent_allocatin: ", opponent_allocation, "wins tie: ", user_wins_tie)
            if(user_allocation > opponent_allocation | user_wins_tie){
                user_votes += state_votes;
            } else {
                opponent_votes += state_votes;
            }
        };
        return user_votes;
    }

    function make_histogram(data) {
        // Histogram adapted fromhttps://www.d3-graph-gallery.com/graph/histogram_coloredTail.html
        var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
            
        // append the svg object to the body of the page
        var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        //.attr("preserveAspectRatio", "xMinYMin meet")
        //.attr("viewBox", "0 0 350 700")
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

        // X axis: scale and draw:
        var x = d3.scaleLinear()
        .domain([0, 139])
        .range([0, width]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("font-family", "sans-serif")
        .attr("font-weight", "300")
        .call(d3.axisBottom(x));

        // set the parameters for the histogram
        var histogram = d3.histogram()
        .value(function(d) { return d; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(70)); // then the numbers of bins

        // And apply this function to data to get the bins
        var bins = histogram(data);

        // Y axis: scale and draw:
        var y = d3.scaleLinear()
        .range([height, 0]);
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
        svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-weight", "300")
        .call(d3.axisLeft(y));

        // append the bar rectangles to the svg element
        svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", function(d){ if(d.x0<win_threshold){return "#69b3a2"} else {return "orange"}})

        // Append a vertical line to highlight the separation
        svg
        .append("line")
        .attr("x1", x(win_threshold) )
        .attr("x2", x(win_threshold) )
        .attr("y1", y(0))
        .attr("y2", y(1600))
        .attr("stroke", "grey")
        .attr("font-family", "sans-serif")
        .attr("font-weight", "300")
        .attr("stroke-dasharray", "4");

        svg
        .append("text")
        .attr("x", x(80))
        .attr("y", 6)
        .attr("font-family", "sans-serif")
        .attr("font-weight", "300")
        .text("Votes needed to win: " + win_threshold)
        
        svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .attr("font-family", "sans-serif")
        .attr("font-weight", "300")
        .text("Electors total"); 

        svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".65em")
        .attr("font-family", "sans-serif")
        .attr("font-weight", "300")
        .attr("transform", "rotate(-90)")
        .text("Elections win frequency");
    };
    
    var win_threshold = 70;
    var arr = new Array();

$("html, body").animate({ scrollTop: 0 }, 0);


// --- constants from your table ---
const STATES = ["A","B","C","D","E","F","G"];
const EC = [3,5,8,13,21,34,55];

// Utilities
function readPlayerAllocations() {
  return STATES.map(id => Math.trunc(+document.getElementById("jc-user-submit-input"+id).value || 0));
}
function sum(arr){ return arr.reduce((a,b)=>a+b,0); }
function coinFlip(){ return Math.random() < 0.5; }

// Modal helpers
function pgShow(stepName){
  const modal = document.getElementById("postGame");
  modal.classList.add("show");
  modal.querySelectorAll(".pg-step").forEach(s => s.classList.remove("active"));
  modal.querySelector(`.pg-step--${stepName}`).classList.add("active");
}
function pgHide(){ document.getElementById("postGame").classList.remove("show"); }

// Wire modal close buttons
(function(){
  const modal = document.getElementById("postGame");
  modal.addEventListener("click", (e)=>{
    if (e.target.classList.contains("pg-close") || e.target.classList.contains("pg-close-bottom")) pgHide();
  });
})();

// Compute head-to-head EC totals vs opponent allocations object {a..g}
function computeResult(player, opp){
  let youEC = 0, oppEC = 0, youStates=[], oppStates=[];
  STATES.forEach((s, i)=>{
    const p = player[i], o = opp[s.toLowerCase()];
    let winner = null;
    if (p > o) winner = "you";
    else if (p < o) winner = "opp";
    else winner = coinFlip() ? "you" : "opp";

    if (winner === "you") { youEC += EC[i]; youStates.push(s); }
    else { oppEC += EC[i]; oppStates.push(s); }
  });
  let verdict = (youEC>oppEC)?"win":(youEC<oppEC)?"lose":"tie";
  return { youEC, oppEC, youStates, oppStates, verdict };
}

// RPCs
async function getOpponent() {
  const { data, error } = await sb.rpc("get_random_participant");
  if (error) throw error;
  return Array.isArray(data) && data[0] ? data[0] : null;
}

async function getMeans() {
  const { data, error } = await sb.rpc("get_mean_allocations");
  if (error) throw error;
  return Array.isArray(data) && data[0] ? data[0] : null;
}

window._testRPCs = async function(){
  console.log("Testing RPCs…");
  console.log("URL:", SUPABASE_URL);
  const c = await sb.rpc("get_participant_count");
  console.log("count:", c);
  const r = await sb.rpc("get_random_participant");
  console.log("random:", r);
  const m = await sb.rpc("get_mean_allocations");
  console.log("means:", m);
};


// D3 chart: bars = mean, dots = player, axes + labels
function renderMeansChart(means, player){
  const data = STATES.map((s,i)=>({
    state:s,
    mean:+means[s.toLowerCase()],
    you:+player[i]
  }));

  const container = d3.select("#pg-chart").html("");
  const W = 760, H = 280, M = {t:20,r:16,b:40,l:40};
  const svg = container.append("svg").attr("width", W).attr("height", H);
  const x = d3.scaleBand().domain(STATES).range([M.l, W-M.r]).padding(0.2);
  const y = d3.scaleLinear().domain([0, d3.max(data, d=>Math.max(d.mean,d.you))||100]).nice().range([H-M.b, M.t]);

  // Bars (means)
  svg.selectAll(".bar").data(data).enter().append("rect")
    .attr("class","bar")
    .attr("x", d=>x(d.state)).attr("y", d=>y(d.mean))
    .attr("width", x.bandwidth())
    .attr("height", d=>y(0)-y(d.mean))
    .attr("fill", "#a5b4fc");

  // Dots (you)
  svg.selectAll(".dot").data(data).enter().append("circle")
    .attr("class","dot")
    .attr("cx", d=>x(d.state)+x.bandwidth()/2)
    .attr("cy", d=>y(d.you))
    .attr("r", 5)
    .attr("fill", "#111827");

  // Labels for your dot (optional compact)
  svg.selectAll(".dot-label").data(data).enter().append("text")
    .attr("class","dot-label")
    .attr("x", d=>x(d.state)+x.bandwidth()/2)
    .attr("y", d=>y(d.you)-8)
    .attr("text-anchor","middle")
    .attr("font-size","10px")
    .attr("fill","#111827")
    .text(d=>d.you);

  // Axes
  const axX = d3.axisBottom(x);
  const axY = d3.axisLeft(y).ticks(5);
  svg.append("g").attr("transform",`translate(0,${H-M.b})`).call(axX);
  svg.append("g").attr("transform",`translate(${M.l},0)`).call(axY);

  // Title + subtitle
  svg.append("text").attr("x", W/2).attr("y", M.t).attr("text-anchor","middle")
    .attr("font-weight","600").text("Average vs. Your Allocation");
  svg.append("text").attr("x", W/2).attr("y", M.t+16).attr("text-anchor","middle")
    .attr("fill","#555").attr("font-size","12px")
    .text("Bars: average across all participants; Dots: your choices");
}

// Hook submit button to full flow
(function(){
  const btn = document.querySelector(".jc-submit");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const player = readPlayerAllocations();
    if (sum(player) !== 100) { alert("Please allocate exactly $100."); return; }

    // Show loading modal immediately
    pgShow("loading");

    try {
      // fetch opponent, compute result
      const opponent = await getRandomOpponent();
      const outcome = computeResult(player, opponent);

      // Fill result step
      document.getElementById("pg-ec-you").textContent = outcome.youEC;
      document.getElementById("pg-ec-opp").textContent = outcome.oppEC;
      document.getElementById("pg-states-you").textContent = outcome.youStates.join(", ") || "—";
      document.getElementById("pg-states-opp").textContent = outcome.oppStates.join(", ") || "—";
      const summary = {
        win:  `You WIN! ${outcome.youEC}–${outcome.oppEC} electoral votes.`,
        lose: `You LOSE. ${outcome.youEC}–${outcome.oppEC} electoral votes.`,
        tie:  `It's a TIE at ${outcome.youEC}–${outcome.oppEC}.`
      }[outcome.verdict];
      document.getElementById("pg-result-summary").textContent = summary;

      // Step nav
      const modal = document.getElementById("postGame");
      const nextButtons = modal.querySelectorAll(".pg-step--result .pg-next, .pg-step--chart .pg-next");
      let nextHandlerChart, nextHandlerBg;

      // Move to result after a short pause so loading feels real
      setTimeout(()=> pgShow("result"), 600);

      // When user clicks Next on result -> chart
      nextButtons[0]?.removeEventListener("click", nextHandlerChart);
      nextHandlerChart = async ()=>{
        pgShow("chart");
        // fetch means and render chart
        const means = await getMeans();
        renderMeansChart(means, player);
      };
      nextButtons[0]?.addEventListener("click", nextHandlerChart);

      // When user clicks Next on chart -> background
      nextButtons[1]?.removeEventListener("click", nextHandlerBg);
      nextHandlerBg = ()=> pgShow("background");
      nextButtons[1]?.addEventListener("click", nextHandlerBg);

    } catch (e){
      console.error(e);
      alert("Sorry, we couldn’t complete the simulation.");
      pgHide();
    }
  });
})();


// --- helper to read values & update "Amount Remaining" ---
function readAllocations() {
  const ids = ["A","B","C","D","E","F","G"];
  return ids.map(id => Math.trunc(+document.getElementById("jc-user-submit-input"+id).value || 0));
}
function updateRemainingAndButton() {
  const values = readAllocations();
  const total = values.reduce((a,b)=>a+b,0);
  // Update remaining UI
  const remEl = document.getElementById("jc-total-allocated");
  if (remEl) remEl.textContent = 100 - total;

  // Enable/disable submit button
  const btn = document.querySelector(".jc-submit");
  if (!btn) return;
  if (total === 100) {
    btn.classList.remove("jc-disabled");
    btn.disabled = false;          // in case you also use the disabled attribute
  } else {
    btn.classList.add("jc-disabled");
    btn.disabled = true;
  }
}

// --- define the functions your inputs call ---
function myFunct() {
  updateRemainingAndButton();
}
// Optional: if your HTML still references checkDecimal(), keep a no-op to avoid errors.
function checkDecimal() { /* no-op; using type=number step=1 already */ }

// --- initialize on load ---
document.addEventListener("DOMContentLoaded", () => {
  // start with a clean state
  updateRemainingAndButton();

  // also bind input listeners without relying on inline HTML attributes
  document.querySelectorAll(".jc-num").forEach(inp => {
    inp.addEventListener("input", updateRemainingAndButton);
    inp.addEventListener("blur", updateRemainingAndButton);
  });
});


