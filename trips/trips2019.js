 //Width and height
      var w = 480;
      var h = 300;

      var margin = {
          top: 10,
          bottom: 0,
          left: 0,
          right: 30
        };

        var width = w - margin.left - margin.right;
        var height = h - margin.top - margin.bottom;


      var lineScale = d3.scaleSqrt()
        .domain([0, 332])
        .range([0.5, 3])

      var circleScale = d3.scaleSqrt()
        .domain([0, 4445])
        .range([0.5, 10])


      // define map projection
      // var projection = d3.geoConicEqualArea()
      //     .scale(1268.55260065596)
      //     .center([-98.6300941779231,39.84010618376426]) //projection center
      //     .parallels([24.396308,49.384358]) //parallels for conic projection
      //     .rotate([98.6300941779231]) //rotation for conic projection
      //     .translate([-924.5040708344418,-492.5028570756716]) //translate to center the map in view
var projection = d3.geoAlbersUsa();

      //Define default path generator
      var path = d3.geoPath()
        .projection(projection)


        d3.json("states.json", function(json){
          d3.csv("cervas_trips_2019.csv", function(error, data){
            var states = topojson.feature(json, json.objects.states).features

            const mesh = topojson.mesh(json, json.objects["states"], function (a, b) {
            return a !== b;
            });

            var Exporters = d3.nest()
              .key(function(d){ return d.state; })
              .entries(data)

            var StatesVisited = d3.nest()
               .key(function(d){ return d.st; })
               .entries(data)

               console.log(Exporters)
               console.log(StatesVisited)

               // Add a local variable
               var local = d3.local();
               var States_highlight = d3.local();

               var svg = d3.select("body")
               .selectAll("svg")
               .data(Exporters)
               .enter()
               .append("svg")
               .attr("id", "maps")
               .attr("width", w)
               .attr("height", h)
               .append("g")
               .attr("transform",  "translate(" + margin.left + "," + margin.top + ")")
               // .each(function(d){ local.set(this, d.key); })

               svg.selectAll(".state")
               .data(states)
               .enter()
               .append("path")
               .attr("class", "state")
               .attr("fill", "#161719")
               .attr("d", path)
               .attr("opacity", 1)

               svg.append("path")
               .datum(topojson.mesh(json, json.objects.states, function(a, b) { return a !== b; }))
               .attr("class", "boundary")
               .attr("d", path);

               //Container for the gradients
               var defs = svg.append("defs");
               var filter = defs.append("filter")
                    .attr("id", "glow");
                    filter.append("feGaussianBlur")
                    .attr("stdDeviation", "3.5")
                    .attr("result", "coloredBlur");
                    var feMerge = filter.append("feMerge");
                    feMerge.append("feMergeNode")
                    .attr("in", "coloredBlur");
                    feMerge.append("feMergeNode")
                    .attr("in", "SourceGraphic");

               svg.append("path")
          		.datum(topojson.merge(json, json.objects["states"].geometries.filter(d => d.properties.name)))
          		.attr("class", "outline")
          		.style("filter", "url(#glow)")
          		.attr("d", path);


            svg.selectAll("circles")
              .data(function(d){ return d.values })
              .enter()
              .append("circle")
              .attr("class", "importer")
              .attr("r", function(d){
                return circleScale(300)
              })
              .attr("cx", function(d){
                var coords = projection([d.Longitude_imp, d.Latitude_imp])
                return coords[0];
              })
              .attr("cy", function(d){
                var coords = projection([d.Longitude_imp, d.Latitude_imp])
                return coords[1];
              })
              .style("fill", function(d){
                if(d.Millions > 0.5){
                  return "#497AA6"
                } else {
                  return "none"
                }
              })

            svg.selectAll(".arcs")
              .data(function(d){ return d.values})
              .enter()
              .append("path")
              .style("stroke", function(d){
                if(d.Millions > 0.5){
                  return "#497AA6"
                }
              })
              .attr("d", function(d){
                return lngLatToArc(d, 1)
              })
              .style("fill", "none")
              .style("opacity", 0.5)
              .style("stroke-width", "1.05px")

              svg.append("text")
                .attr("x", 100)
                .attr("y", 100)
                .text(function(d){
                  return d.Exporter
                })



          function lngLatToArc(d, bend){
                // If no bend is supplied, then do the plain square root
                bend = bend || 1;
                // `[d.Lon_Origin, d.Lat_Origin]` and `[d.Lon_Residence, d.Lat_Residence]` are arrays of `[lng, lat]`
                // Note, people often put these in lat then lng, but mathematically we want x then y which is `lng,lat`


                var sourceLngLat = [d.Longitude_exp, d.Latitude_exp],
                    targetLngLat = [d.Longitude_imp, d.Latitude_imp];



                if(targetLngLat && sourceLngLat){

                  var sourceXY = projection(sourceLngLat),
                      targetXY = projection(targetLngLat);

                  // Uncomment this for testing, useful to see if you have any null lng/lat values
                // if (!targetXY) console.log(d, targetLngLat, targetXY)
                var sourceX = sourceXY[0],
                    sourceY = sourceXY[1];

                  var targetX = targetXY[0],
                      targetY = targetXY[1];

                  var dx = targetX - sourceX,
                      dy = targetY - sourceY
                    dr = Math.sqrt(dx * dx + dy * dy) * bend;

                    // To avoid a whirlpool effect, make the bend direction consistent regardless of whether the source is east or west of the target
                var west_of_source = (targetX - sourceX) < 0;
                if (west_of_source) return "M" + targetX + "," + targetY + "A" + dr + "," + dr + " 0 0,1 " + sourceX + "," + sourceY;
                return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;

                } else{
                  return "M0,0,l0,0z";
                }
              }

          })
        })
