// https://observablehq.com/@mcmcclur/nc-congressional-districts@915
import define1 from "./e93997d5089d7165@2303.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["NC_Congressional_Data@1.json",new URL("./files/f9acf825d33c006f1901422d4d0bdbba0bb69c6646d1d541091e17b05485288debacc491a10f10cc5fc7293a9740183de795eb004767f0a202f027034358deb3",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# NC Congressional Districts`
)});
  main.variable(observer("intro_commentary")).define("intro_commentary", ["md"], function(md){return(
md`North Carolina has been central to the gerrymandering controversy in the US over this last decade. While congressional districts are meant to be redrawn every 10 years (after the census), North Carolina's districts have recently been re-redrawn for the second time since 2010 by court order. 

The map below provides an interactive look at the three district plans that North Carolina has had during the 2010s. You can select the year the districts were drawn (2011, 2017, or 2019) to view the districts and get some basic information about that version of the map. You can also hover over each district to get information on that district.`
)});
  main.variable(observer("viewof w")).define("viewof w", ["radio"], function(radio){return(
radio({
  title: 'Draw date',
  options: [
    { label: '2011', value: 0 },
    { label: '2017', value: 1 },
    { label: '2019', value: 2 }
  ],
  value: 0
})
)});
  main.variable(observer("w")).define("w", ["Generators", "viewof w"], (G, _) => G.input(_));
  main.variable(observer("state_commentary")).define("state_commentary", ["html"], function(html){return(
html``
)});
  main.variable(observer("map")).define("map", ["make_map"], function(make_map){return(
make_map()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Data`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The bulk of the data comes from the [Metric Geometry and Gerrymandering Group](https://github.com/mggg-states/NC-shapefiles). That data specifies, for each voting precinct,

  * The cartographic boundaries of that precinct drawn in both 2011 and 2017,
  * which 2011 and 2017 congressional district the precinct is in, 
  * results for presidential, senate, and gubernatorial elections for 2008-2016, as well as some other information.

Unfortunately, the latest (Fall 2019), court enforced districts aren't accounted for. The NC Legislature, however, has [a shapefile on it's redistricting page](https://www.ncleg.gov/RnR/Redistricting/Main) defining the cartographic boundaries of the new districts. Thus, it's not too hard to use [mapshaper](https://github.com/mbloch/mapshaper) programmatically figure out which precincts make up the new districts. We can then bundle all that information up into the following file.
`
)});
  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("NC_Congressional_Data@1.json").json()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Code`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The main image is an SVG with a static background image generated via a Canvas. That should allow for reasonable performance (since the background image consists of a lot of detailed little precincts) and easy interaction via the SVG overlay. Sadly, there's still a bit of latency that I suspect arises when the tooltips are set up on the 13 fairly complicated districts.`
)});
  main.variable(observer("make_map")).define("make_map", ["map_width","d3","map_height","DOM","im_url","district_boundary_array","path"], function(map_width,d3,map_height,DOM,im_url,district_boundary_array,path){return(
function make_map() {
  console.log(['map_width is', map_width]);
  let svg = d3
    .create("svg")
    .attr('width', map_width)
    .attr('height', map_height);

  const mapbg = DOM.uid('mapbg');

  // Set up the SVG background
  svg
    .append("defs")
    .append('pattern')
    .attr('id', mapbg.id)
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', map_width)
    .attr('height', map_height)
    .append("image")
    .attr("xlink:href", im_url)
    .attr('width', map_width)
    .attr('height', map_height);
  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", map_width)
    .attr("height", map_height)
    .attr("fill", mapbg);

  // Set up the district overlay.
  let districts = svg
    .append("g")
    .attr('id', 'districts')
    .selectAll("path")
    .data(district_boundary_array[0].features)
    .join("path")
    .attr('class', 'district')
    .attr("stroke-opacity", 0)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr("stroke-linejoin", "round")
    .attr("fill", 'none')
    .attr("d", path);

  // And react to a mouse hover.
  districts
    .on('mouseenter', function(d) {
      districts
        .attr('fill', 'white')
        .style('stroke-width', 1)
        .attr('fill-opacity', 0.8);
      d3.select(this)
        .style('stroke-width', 4)
        .attr('fill', 'white')
        .attr('fill-opacity', 0);
    })
    .on('mouseleave', function() {
      districts
        .attr('fill', 'white')
        .attr('fill-opacity', 0)
        .style('stroke-width', 2);
    });

  return svg.node();
}
)});
  main.variable(observer("transition")).define("transition", ["d3","state_commentary","Promises","state_commentary_text","map","district_boundary_array","path","tippy"], function(d3,state_commentary,Promises,state_commentary_text,map,district_boundary_array,path,tippy){return(
function transition(n) {
  let comm = d3.select(state_commentary);
  Promises.delay(
    1000,
    comm
      .transition()
      .duration(1000)
      .style('opacity', 0)
  ).then(function() {
    comm.html(state_commentary_text(n));
    comm
      .transition()
      .duration(1000)
      .style('opacity', 1);
  });

  let districts = d3.select(map).select('#districts');
  Promises.delay(
    1000,
    districts
      .selectAll('path')
      .transition()
      .duration(1000)
      .attr('stroke-opacity', 0)
  )
    .then(function() {
      districts
        .selectAll("path")
        .data(district_boundary_array[n].features)
        .join("path")
        .attr("fill", 'none')
        .attr("d", path)
        .attr('title', function(d) {
          let dprop = d.properties.DPROP;
          let party, perc;
          if (dprop < 0.5) {
            party = 'Republican';
            perc = d3.format('0.1%')(1 - dprop);
          } else {
            party = 'Democratic';
            perc = d3.format('0.1%')(dprop);
          }
          return `District ${d.properties.DISTRICT}: ${perc} ${party}`;
        });
    })
    .then(function() {
      districts
        .selectAll('path')
        .attr('stroke-opacity', 0)
        .transition()
        .duration(1000)
        .attr('stroke-opacity', 0.9);
    })
    .then(function() {
      tippy('svg .district');
    });
}
)});
  main.variable(observer()).define(["transition","w"], function(transition,w){return(
transition(w)
)});
  main.variable(observer("im_url")).define("im_url", ["DOM","map_width","map_height","d3","projection","precinctFeatures"], function(DOM,map_width,map_height,d3,projection,precinctFeatures)
{
  const context = DOM.context2d(map_width, map_height);
  const path = d3
    .geoPath()
    .projection(projection)
    .context(context);
  context.canvas.style.maxWidth = "100%";
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = 'rgba(0,0,0,0.2)';

  precinctFeatures.features.forEach(function(d) {
    context.fillStyle = d3.interpolateRdBu(d.properties.DPROP);
    context.beginPath();
    path(d);
    context.fill();
    context.stroke();
  });
  return context.canvas.toDataURL();
}
);
  main.variable(observer("district_boundary_array")).define("district_boundary_array", ["topojson","data"], function(topojson,data){return(
[
  "oldplan_boundaries",
  "newplan_boundaries",
  "court_boundaries"
].map(d => topojson.feature(data, data.objects[d]))
)});
  main.variable(observer("precinctFeatures")).define("precinctFeatures", ["topojson","data"], function(topojson,data){return(
topojson.feature(data, data.objects.NC_VTD)
)});
  main.variable(observer("path")).define("path", ["d3","projection"], function(d3,projection){return(
d3.geoPath().projection(projection)
)});
  main.variable(observer("projection")).define("projection", ["d3","map_width","map_height","precinctFeatures"], function(d3,map_width,map_height,precinctFeatures){return(
d3
  .geoIdentity()
  .reflectY(true)
  .fitSize([map_width, map_height], precinctFeatures)
)});
  main.variable(observer("map_width")).define("map_width", ["width"], function(width){return(
0.98 * width
)});
  main.variable(observer("map_height")).define("map_height", ["map_width"], function(map_width){return(
(4 * map_width) / 9
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@5')
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  const child1 = runtime.module(define1);
  main.import("radio", child1);
  main.variable(observer("tippy")).define("tippy", ["require"], function(require){return(
require("https://unpkg.com/tippy.js@2.5.4/dist/tippy.all.min.js")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Computations`
)});
  main.variable(observer()).define(["efficiency_gap","district_boundary_array"], function(efficiency_gap,district_boundary_array){return(
efficiency_gap(district_boundary_array[0])
)});
  main.variable(observer("efficiency_gap")).define("efficiency_gap", ["d3","wasted_votes"], function(d3,wasted_votes){return(
function efficiency_gap(districts) {
  let wasted_dem_votes = d3.sum(
    districts.features.map(d => wasted_votes(d.properties, 'dem'))
  );
  let wasted_rep_votes = d3.sum(
    districts.features.map(d => wasted_votes(d.properties, 'rep'))
  );
  let total_votes = d3.sum(districts.features.map(d => d.properties.TVOTE));
  return (wasted_dem_votes - wasted_rep_votes) / total_votes;
}
)});
  main.variable(observer("wasted_votes")).define("wasted_votes", function(){return(
function wasted_votes(o, p) {
  let dvote = o.DVOTE;
  let rvote = o.RVOTE;
  let tvote = o.TVOTE;
  if (p == 'dem') {
    if (dvote < tvote / 2) {
      return dvote;
    } else {
      return dvote - tvote / 2;
    }
  } else {
    if (rvote < tvote / 2) {
      return rvote;
    } else {
      return rvote - tvote / 2;
    }
  }
}
)});
  main.variable(observer("state_commentary_text")).define("state_commentary_text", ["d3","efficiency_gap","district_boundary_array","expected_republican_count"], function(d3,efficiency_gap,district_boundary_array,expected_republican_count){return(
function state_commentary_text(n) {
  let eg = d3.format("0.1%")(efficiency_gap(district_boundary_array[n]));
  let erc = expected_republican_count(n);
  let text;
  if (n == 0) {
    text = `Districts drawn by Republicans after the 2010 election. Districts 1 and 12 
    are two of the most highly contentious districts with regard to gerrymandering in the US.`;
  } else if (n == 1) {
    text = `Districts redrawn by Republicans in 2016 after federal courts held that districts 1 and 12 
    were unconstitutionally gerrymandered based on race. This map was used in the 2018 elections 
    pending appeal.`;
  } else if (n == 2) {
    text = `Districts re-redrawn by Republicans in 2019 after state courts held 
the previous maps were unconstitutionally gerrymandered based on party. This map will be used in the 2020 elections.`;
  }
  text =
    text +
    `<div style="text-align: center">${erc} Republican districts and ${13 -
      erc} Democratic districts</div>
    <div style="text-align: center"><a href="https://ballotpedia.org/Efficiency_gap" target='_blank'>Efficiency Gap</a> = ${eg}</div>`;
  return text;
}
)});
  main.variable(observer("expected_republican_count")).define("expected_republican_count", ["district_boundary_array"], function(district_boundary_array){return(
function expected_republican_count(n) {
  return district_boundary_array[n].features.filter(
    o => o.properties.DVOTE < o.properties.RVOTE
  ).length;
}
)});
  return main;
}
