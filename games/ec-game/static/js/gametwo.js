var states = [["Nebraska (CD2)", 1], 
              ["New Hampshire", 4],
              ["Minnesota", 10],
              ["Wisconsin", 10],
              ["Michigan", 16],
              ["Pennsylvania", 20],
              ["Florida", 29]],
    totalElectors = 0,
    toWinOptions = [37, 55],
    toWinRand = Math.floor(Math.random() * toWinOptions.length)
    toWin = toWinOptions[toWinRand],
    opponentToWin = toWinOptions[(toWinRand + 1) % toWinOptions.length]
    round = "game2:" + toWin.toString();
    opponentRound = "game2:" + opponentToWin.toString();

// for now, 7 states (just how the DB is currently set up)
window.onload = function() {
    for (i = 0; i < states.length; i++) {
        document.getElementById("state-" + i).innerHTML = states[i][0]
        document.getElementById("state-value-" + i).innerHTML = states[i][1]
        totalElectors += states[i][1]
    }
    document.getElementById("total-electors").innerHTML = totalElectors
    document.getElementById("to-win").innerHTML = toWin
};


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
        timePondered: ((new Date()).getTime() - currentTime) / 1000,
        round: round
    };
    console.log("User Allocation: ", userData);

    function userVotes(userData, opponentData) {
        var user_votes = 0;
        var opponent_votes = 0;
        for (let state_idx = 0; state_idx <= 6; state_idx++) {
            var state_votes = states[state_idx][1];
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
            .style("fill", function(d){ if(d.x0<toWin){return "#69b3a2"} else {return "orange"}})

        // Append a vertical line to highlight the separation
        svg
        .append("line")
        .attr("x1", x(toWin) )
        .attr("x2", x(toWin) )
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
        .text("Votes needed to win: " + toWin)
        
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
    
    var arr = new Array();

    $.getJSON('/get_all_games', function(data) {
        console.log('Got games! ', console.log(data));
        var n_wins = 0,
            n_opponents = 0;
        for(let game_idx = 0; game_idx<data.length; game_idx++){
            if(data[game_idx].round == opponentRound) {
                var user_votes = userVotes(Object.values(userData), Object.values(data[game_idx]));
                arr.push(user_votes);
                n_wins += user_votes >= toWin;
                n_opponents++;
            }
        }
        console.log("n_wins: " + n_wins);
        console.log("n_opponents: " + n_opponents); 
        var result = 'You won against ' + parseFloat(100 * n_wins/n_opponents ).toFixed(2) + '% of players in the database!';
        console.log(result);
        var element = document.getElementById("postGame-text-id");
        element.innerHTML = result;
        make_histogram(arr);
        var postGameDiv = document.getElementById("postGame");
        postGameDiv.style.display = "inline";
        // Scroll down to the div with the 
        $('html,body').animate({scrollTop: $("#postGame-text-id").offset().top - 10},'slow');
    });

    
    $.ajax('/write_game', {
        data : JSON.stringify(userData),
        contentType : 'application/json',
        type : 'POST',
        success: function() { console.log("Wrote to BE"); },
        failure: function() { console.log("Failed to write to BE"); }
    })
};

$("html, body").animate({ scrollTop: 0 }, 0);