mapshaper
-i '/Users/cervas/My Drive/GitHub/createMaps/us-cart.json'
-i '/Users/cervas/My Drive/GitHub/jcervas.github.io/2024/ALR-Partisan-Gerrymandering-Cases/maps/map-data.csv'
-join map-data keys=STUSPS,State
-proj albersusa
-classify field=party-contol colors='#E0E0E0','#3A88CA',purple,'#D75C5C','#E0E0E0' null-value="#000" key-name="legend-party-control" key-style="simple" key-tile-height=10 key-width=320 key-font-size=10 
-innerlines target=us-cart + name=lines
-style stroke='#E9E9E9' stroke-width=0.5
-dissolve target=us-cart + name=US
-style stroke=#000



-classify field=drew-lines colors='#008F91','#C41230','#E0E0E0',purple,'#FDB515','#E0E0E0' null-value="#000" key-name="legend-drew-lines" key-style="simple" key-tile-height=10 key-width=320 key-font-size=10 