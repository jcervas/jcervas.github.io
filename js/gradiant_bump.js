var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 960 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom,
    pairId = 0;

var x = d3.scale.ordinal()
    .domain(["a", "b", "c"])
    .rangeBands([0, width], .5, 0);

var xTangent = 40, // Length of Bézier tangents to control curve.
    yPadding = .3; // Fraction of height for vertical spacing between lines.

var y = d3.scale.linear()
    .range([0, height]);

var z = {
    a: d3.scale.linear().range(["#EEE8B8", "#973333"]).interpolate(d3.interpolateHcl),
    b: d3.scale.linear().range(["#88A391", "#D0D6AF"]).interpolate(d3.interpolateHcl),
    c: d3.scale.linear().range(["#245B7B", "#6A8D94"]).interpolate(d3.interpolateHcl)
};

var gradiant = d3.select("#gradiant").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("http://jonathancervas.com/js/data.csv", type, function(error, data) {
    y.domain([0, d3.sum(data, function(d) { return d.weight; }) / (1 - yPadding)]);

    x.domain().forEach(function(k) {
        var n = data.length,
            y0 = 0,
            dy = y.domain()[1] * yPadding / (n - 1);
        data.sort(function(a, b) { return a[k] - b[k]; }).forEach(function(d, i) {
            d[k + "-offset"] = y0 + d.weight / 2;
            y0 += d.weight + dy;
        });
        z[k].domain([data[0][k], data[n - 1][k]]);
    });

    data.sort(function(a, b) { return b.weight - a.weight; });

    var bump = gradiant.append("g")
        .attr("class", "bump")
        .selectAll("g")
        .data(data)
        .enter().append("g");

    bump.append("path")
        .attr("class", "halo")
        .style("stroke-width", function(d) { return y(d.weight) + 2; })
        .attr("d", line);

    x.domain().slice(1).forEach(function(b, i) {
        var a = x.domain()[i];

        var path = bump.append("path")
            .style("stroke-width", function(d) { return y(d.weight); });

        var gradient = bump.append("linearGradient")
            .attr("id", function(d) { return "gradient-" + a + "-" + d.index; })
            .attr("x1", function(d) { return x(a) + x.rangeBand(); })
            .attr("y1", function(d) { return y(d[a + "-offset"]); })
            .attr("x2", function(d) { return x(b); })
            .attr("y2", function(d) { return y(d[b + "-offset"]); })
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("spreadMethod", "pad");

        gradient.append("svg:stop")
            .attr("offset", "0%")
            .attr("stop-color", function(d) { return z[a](d[a]); })
            .attr("stop-opacity", 1);

        gradient.append("svg:stop")
            .attr("offset", "100%")
            .attr("stop-color", function(d) { return z[b](d[b]); })
            .attr("stop-opacity", 1);

        path
            .style("stroke", function(d) { return "url(#gradient-" + a + "-" + d.index + ")"; })
            .attr("d", function(d) {
                return "M" + x(a) + "," + y(d[a + "-offset"]) +
                    "h" + x.rangeBand() +
                    curve(a, b, d) +
                    "h1";
            });
    });

    bump.append("path")
        .style("stroke-width", function(d) { return y(d.weight); })
        .style("stroke", function(d) { return z.c(d.c); })
        .attr("d", function(d) { return "M" + x("c") + "," + y(d["c-offset"]) + "h" + x.rangeBand(); });
    console.log(getBoundingBoxCenter(gradiant))

    var text = gradiant.append("text")
        .style("text-anchor", "middle");

var gradiant_text = document.getElementById("gradiant");
var gradiant_text = gradiant_text.getAttribute("data-content");

    var textLabels = text
        .attr("x", getBoundingBoxCenter(gradiant)[0])
        .attr("y", height / 2)
        .attr("dy", ".95em")
        .text(function(d) { return gradiant_text; })
        // .text(function(d) { return "PUBLICATIONS"; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "130px")
        .attr("fill", "white");


});

function getBoundingBoxCenter(selection) {
    // get the DOM element from a D3 selection
    // you could also use "this" inside .each()
    var element = selection.node();
    // use the native SVG interface to get the bounding box
    var bbox = element.getBBox();
    // return the center of the bounding box
    return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
}

function type(d, i) {
    for (var k in d) d[k] = +d[k];
    d.index = i;
    return d;
}

function line(d) {
    var path = [];
    x.domain().slice(1).forEach(function(b, i) {
        var a = x.domain()[i];
        path.push("L", x(a), ",", y(d[a + "-offset"]), "h", x.rangeBand(), curve(a, b, d));
    });
    path[0] = "M";
    path.push("h", x.rangeBand());
    return path.join("");
}

function curve(a, b, d) {
    return "C" + (x(a) + xTangent + x.rangeBand()) + "," + y(d[a + "-offset"]) + " " +
        (x(b) - xTangent) + "," + y(d[b + "-offset"]) + " " +
        x(b) + "," + y(d[b + "-offset"]);
}
