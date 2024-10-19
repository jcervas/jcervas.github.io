let districts = [];
let currentDistrictIndex = 0;
let score = 0;
let totalDistricts = 435;
let guessedDistricts = new Set();
let progressCount = 0;
let map, tileLayer;
let resetButton;
const elements = {
    score: document.getElementById("score"),
    progress: document.getElementById("progress"),
    result: document.getElementById("result"),
    guessInput: document.getElementById("guessInput"),
    guessButton: document.getElementById("guessButton"),
    skipButton: document.getElementById("skipButton")
};

async function loadDistricts() {
    try {
        const response = await fetch('./national_cong119_carto_boundary.json');
        districts = await response.json();
        initializeMap();
        showNextDistrict();
    } catch (error) {
        console.error("Error loading districts:", error);
        alert("Failed to load district data. Please refresh the page.");
    }
}

function initializeMap() {
    map = L.map('map').setView([37.8, -96], 4);
    tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        opacity: 0.01
    }).addTo(map);
}

function updateDisplay() {
    elements.score.textContent = `Score: ${score} out of ${totalDistricts}`;
    elements.progress.textContent = `Progress: ${progressCount} out of 435`;
}

function showNextDistrict() {
    map.eachLayer(layer => {
        if (layer !== tileLayer) map.removeLayer(layer);
    });
    if (guessedDistricts.size === districts.features.length) {
        showResult();
        return;
    }
    do {
        currentDistrictIndex = Math.floor(Math.random() * districts.features.length);
    } while (guessedDistricts.has(currentDistrictIndex));
    guessedDistricts.add(currentDistrictIndex);
    progressCount++;
    
    const district = districts.features[currentDistrictIndex];
    const geojsonLayer = L.geoJSON(district, {
        style: { color: '#ff7800', weight: 2, fillOpacity: 0 }
    }).addTo(map);
    map.fitBounds(geojsonLayer.getBounds());
    updateDisplay();
}

function checkGuess() {
    const userGuess = elements.guessInput.value.trim().toUpperCase();
    const correctDistrict = districts.features[currentDistrictIndex].properties.CONG119.toUpperCase();
    
    if (userGuess === correctDistrict) {
        score++;
        alert(`Correct! Your score: ${score}`);
        elements.guessInput.value = '';
        showNextDistrict();
    } else {
        alert("Wrong guess. Try again.");
    }
}

function skipDistrict() {
    showNextDistrict();
}

function showResult() {
    elements.result.textContent = `Game Over! Your final score: ${score} out of ${totalDistricts}.`;
    elements.result.style.display = "block";
    elements.guessButton.disabled = true;
    elements.skipButton.disabled = true;
    
    if (!resetButton) {
        resetButton = document.createElement("button");
        resetButton.textContent = "Play Again";
        resetButton.onclick = resetGame;
        document.body.appendChild(resetButton);
    }
}

function resetGame() {
    score = 0;
    guessedDistricts.clear();
    progressCount = 0;
    elements.result.style.display = "none";
    elements.guessButton.disabled = false;
    elements.skipButton.disabled = false;
    elements.guessInput.value = '';
    
    if (resetButton) {
        resetButton.remove();
        resetButton = null;
    }
    
    showNextDistrict();
}

window.addEventListener('load', loadDistricts);
elements.guessButton.addEventListener('click', checkGuess);
elements.skipButton.addEventListener('click', skipDistrict);
elements.guessInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkGuess();
});

































































