// gameone.js — cleaned version with Supabase + modal flow only

// --- Supabase client setup ---
const SUPABASE_URL = 'https://renowzxywrnuomxzsydn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbm93enh5d3JudW9teHpzeWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwODc1NDgsImV4cCI6MjA3MTY2MzU0OH0.8AvSHDFDPD9b-hHOTN1DPLwrtjdWnXjmjXNpumh0YL0';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Input utilities ---
function readAllocations() {
    const ids = ["A", "B", "C", "D", "E", "F", "G"];
    return ids.map(id => Math.trunc(+document.getElementById("jc-user-submit-input" + id).value || 0));
}

function updateRemainingAndButton() {
    const vals = readAllocations();
    const total = vals.reduce((a, b) => a + b, 0);

    // Update Remaining
    const remainingEl = document.getElementById("jc-total-allocated");
    if (remainingEl) remainingEl.textContent = 100 - total;

    // Toggle button enabled
    const btn = document.querySelector(".jc-submit");
    if (!btn) return;
    if (total === 100) {
        btn.classList.remove("jc-disabled");
        btn.disabled = false;
    } else {
        btn.classList.add("jc-disabled");
        btn.disabled = true;
    }
}

function myFunct() { updateRemainingAndButton(); }

function checkDecimal() { /* no-op; type=number step=1 already enforces integers */ }

// --- RPC helpers ---
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

// --- Modal helpers ---
function pgShow(stepName) {
    const modal = document.getElementById("postGame");
    modal.classList.add("show");
    modal.querySelectorAll(".pg-step").forEach(s => s.classList.remove("active"));
    modal.querySelector(`.pg-step--${stepName}`).classList.add("active");
}

function pgHide() { document.getElementById("postGame").classList.remove("show"); }

(function() {
    const modal = document.getElementById("postGame");
    if (!modal) return;
    modal.addEventListener("click", (e) => {
        if (e.target.classList.contains("pg-close") || e.target.classList.contains("pg-close-bottom")) pgHide();
    });
})();

// --- Game logic ---
const STATES = ["A", "B", "C", "D", "E", "F", "G"];
const EC = [3, 5, 8, 13, 21, 34, 55];

function sum(arr) { return arr.reduce((a, b) => a + b, 0); }

function coinFlip() { return Math.random() < 0.5; }

function computeResult(player, opp) {
    let youEC = 0,
        oppEC = 0,
        youStates = [],
        oppStates = [];
    STATES.forEach((s, i) => {
        const p = player[i],
            o = opp[s.toLowerCase()];
        let winner = null;
        if (p > o) winner = "you";
        else if (p < o) winner = "opp";
        else winner = coinFlip() ? "you" : "opp";

        if (winner === "you") {
            youEC += EC[i];
            youStates.push(s);
        } else {
            oppEC += EC[i];
            oppStates.push(s);
        }
    });
    let verdict = (youEC > oppEC) ? "win" : (youEC < oppEC) ? "lose" : "tie";
    return { youEC, oppEC, youStates, oppStates, verdict };
}

// --- Chart ---
function renderMeansChart(means, player) {
    const data = STATES.map((s, i) => ({ state: s, mean: +means[s.toLowerCase()], you: +player[i] }));

    const container = d3.select("#pg-chart").html("");
    const W = 760,
        H = 280,
        M = { t: 20, r: 16, b: 40, l: 40 };
    const svg = container.append("svg").attr("width", W).attr("height", H);
    const x = d3.scaleBand().domain(STATES).range([M.l, W - M.r]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => Math.max(d.mean, d.you)) || 100]).nice().range([H - M.b, M.t]);

    svg.selectAll(".bar").data(data).enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.state)).attr("y", d => y(d.mean))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.mean))
        .attr("fill", "#a5b4fc");

    svg.selectAll(".dot").data(data).enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.state) + x.bandwidth() / 2)
        .attr("cy", d => y(d.you))
        .attr("r", 5)
        .attr("fill", "#111827");

    svg.selectAll(".dot-label").data(data).enter().append("text")
        .attr("class", "dot-label")
        .attr("x", d => x(d.state) + x.bandwidth() / 2)
        .attr("y", d => y(d.you) - 8)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "#111827")
        .text(d => d.you);

    svg.append("g").attr("transform", `translate(0,${H-M.b})`).call(d3.axisBottom(x));
    svg.append("g").attr("transform", `translate(${M.l},0)`).call(d3.axisLeft(y).ticks(5));

    svg.append("text").attr("x", W / 2).attr("y", M.t).attr("text-anchor", "middle")
        .attr("font-weight", "600").text("Average vs. Your Allocation");
    svg.append("text").attr("x", W / 2).attr("y", M.t + 16).attr("text-anchor", "middle")
        .attr("fill", "#555").attr("font-size", "12px")
        .text("Bars: average across all participants; Dots: your choices");
}

function renderResultChart(youEC, oppEC) {
    const data = [
        { name: "You", value: youEC },
        { name: "Opponent", value: oppEC }
    ];

    const W = 400,
        H = 160,
        M = { t: 20, r: 20, b: 30, l: 60 };
    const svg = d3.select("#pg-result-chart").html("").append("svg")
        .attr("width", W)
        .attr("height", H);

    const x = d3.scaleLinear().domain([0, 139]).range([M.l, W - M.r]);
    const y = d3.scaleBand().domain(data.map(d => d.name)).range([M.t, H - M.b]).padding(0.2);

    // Bars
    svg.selectAll(".bar").data(data).enter().append("rect")
        .attr("class", "bar")
        .attr("x", M.l)
        .attr("y", d => y(d.name))
        .attr("width", d => x(d.value) - M.l)
        .attr("height", y.bandwidth())
        .attr("fill", d => d.name === "You" ? "#111827" : "#a5b4fc");

    // Labels
    svg.selectAll(".label").data(data).enter().append("text")
        .attr("x", d => x(d.value) + 5)
        .attr("y", d => y(d.name) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .text(d => d.value);

    // Axis
    svg.append("g").attr("transform", `translate(0,${H-M.b})`)
        .call(d3.axisBottom(x).ticks(6));
    svg.append("g").attr("transform", `translate(${M.l},0)`)
        .call(d3.axisLeft(y));
}


// --- Submit flow ---
(function() {
    const btn = document.querySelector(".jc-submit");
    if (!btn) return;

    btn.addEventListener("click", async () => {
        const player = readAllocations();
        if (sum(player) !== 100) { alert("Please allocate exactly $100."); return; }

        pgShow("loading");

        try {
            const opponent = await getOpponent();
            const outcome = computeResult(player, opponent);

            // render the EC comparison bars
            renderResultChart(outcome.youEC, outcome.oppEC);

            // Fill result step text
            document.getElementById("pg-ec-you").textContent = outcome.youEC;
            document.getElementById("pg-ec-opp").textContent = outcome.oppEC;
            document.getElementById("pg-states-you").textContent = outcome.youStates.join(", ") || "—";
            document.getElementById("pg-states-opp").textContent = outcome.oppStates.join(", ") || "—";
            const summary = {
                win: `You WIN! ${outcome.youEC}–${outcome.oppEC} electoral votes.`,
                lose: `You LOSE. ${outcome.youEC}–${outcome.oppEC} electoral votes.`,
                tie: `It's a TIE at ${outcome.youEC}–${outcome.oppEC}.`
            } [outcome.verdict];
            document.getElementById("pg-result-summary").textContent = summary;

            const modal = document.getElementById("postGame");
            const nextButtons = modal.querySelectorAll(".pg-step--result .pg-next, .pg-step--chart .pg-next");
            let nextHandlerChart, nextHandlerBg;

            setTimeout(() => pgShow("result"), 600);

            nextButtons[0]?.removeEventListener("click", nextHandlerChart);
            nextButtons[0]?.addEventListener("click", nextHandlerChart);

            nextButtons[1]?.removeEventListener("click", nextHandlerBg);
            nextButtons[1]?.addEventListener("click", nextHandlerBg);


        } catch (e) {
            console.error(e);
            alert("Sorry, we couldn’t complete the simulation.");
            pgHide();
        }
    });
})();

// --- Init input bindings ---
document.addEventListener("DOMContentLoaded", () => {
    updateRemainingAndButton();
    document.querySelectorAll(".jc-num").forEach(inp => {
        inp.addEventListener("input", updateRemainingAndButton);
        inp.addEventListener("blur", updateRemainingAndButton);
    });
});