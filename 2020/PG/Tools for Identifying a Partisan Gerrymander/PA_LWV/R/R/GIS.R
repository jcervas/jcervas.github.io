cat(
	"\n
•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
		LOADING SHAPEFILES AND INITALIZING GIS
•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••\n")
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# =================================================================
# -- SHAPEFILES -- -- SHAPEFILES -- -- SHAPEFILES -- -- SHAPEFILES 
# =================================================================
sink("/dev/null")
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
#### STATE SHAPEFLES readOGR("Data/Shapefiles/Places", "PopulatedPlaces", GDAL1_integer64=TRUE), CRS(projection))
usa_shp <- spTransform(readOGR("shapefiles/States/tl_2017_us_state.shp"), CRS(projection))
  pa_shp <- usa_shp[usa_shp@data$NAME == "Pennsylvania",]
#### County Shapefiles
pa_counties <- spTransform(readOGR("shapefiles/PA Counties/PA_Counties.shp"), CRS(projection))
pa_counties.compressed <- spTransform(readOGR("shapefiles/PA Counties/PA_Counties.geojson"), CRS(projection))

# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
#### PA Cities
pa_places <- spTransform(readOGR("shapefiles/Places/tl_2010_42_place10.shp"), CRS(projection))
	pa_major <- pa_places[pa_places@data$NAME10 %in% c("Pittsburgh", "Philadelphia", "Erie", "Scranton", "State College "),]
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
enacted2011.compressed <- readOGR("shapefiles/topojson/shapefiles2.json", "enacted2011")
	proj4string(enacted2011.compressed) <- CRS("+init=epsg:4269")
court.compressed <- readOGR("shapefiles/topojson/shapefiles4.json", "remedial")
	proj4string(court.compressed) <- CRS("+init=epsg:4269")
joint.compressed <- readOGR("shapefiles/topojson/shapefiles4.json", "joint")
	proj4string(joint.compressed) <- CRS("+init=epsg:4269")	
govwolf.compressed <- readOGR("shapefiles/topojson/shapefiles3.json", "govwolf")
	proj4string(govwolf.compressed) <- CRS("+init=epsg:4269")

enacted2011 <- spTransform(readOGR("shapefiles/enacted/enacted.shp"), CRS(projection))
court <- spTransform(readOGR("shapefiles/court/remedial.shp"), CRS(projection))
joint <- spTransform(readOGR("shapefiles/joint/joint.shp"), CRS(projection))
govwolf <- spTransform(readOGR("shapefiles/govwolf/govwolf.shp"), CRS(projection))

# =================================================================
# -- COMPACTNESS -- -- COMPACTNESS -- -- COMPACTNESS -- -- COMPACTN
# =================================================================
# Compactness
compactness <- list()
plan_compactness <- list()

lapply(plan_compactness, REOCK)
#### Plot Compactness ####

enacted2011.geom <- poly.math(enacted2011)
court.geom <- poly.math(court)
joint.geom <- poly.math(joint)
govwolf.geom <- poly.math(govwolf)
# dailykos.geom <- poly.math(dailykos)
# cervasv1.geom <- poly.math(cervasv1)
# cervasv2.geom <- poly.math(cervasv2)
# cervasv3.geom <- poly.math(cervasv3)

enacted.cd.7.shp <- enacted2011[enacted2011@data$GEOID==4207,]
court.cd.6.shp <- court[court@data$DISTRICT=="06",]
enacted.cd.7.geom <- poly.math(enacted.cd.7.shp)
court.cd.6.geom <- poly.math(court.cd.6.shp)



enacted2011_plan_mapObject <- fortify(enacted.cd.7.shp)  # Convert to a data.frame
enacted2011_plan_mapObject <- data.frame(enacted2011_plan_mapObject, enacted.cd.7.shp@data[enacted2011_plan_mapObject$id, ])
enacted2011_plan_mapObject$piece <- as.character(enacted2011_plan_mapObject$piece)
 enacted2011_plan_Shape <- enacted2011_plan_mapObject[enacted2011_plan_mapObject$id == 2, ]
  enacted2011_plan_Poly <- SpatialPolygons(list(Polygons(lapply(split(enacted2011_plan_Shape[, c("long", "lat")], enacted2011_plan_Shape$piece), Polygon), ID = "b")))
  enacted.cd.7.shp <- try(as(enacted2011_plan_Poly, "owin")) 

pa.cd.court.6 <- fortify(court.cd.6.shp)  # Convert to a data.frame
pa.cd.court.6 <- data.frame(pa.cd.court.6, court.cd.6.shp@data[pa.cd.court.6$id, ])
pa.cd.court.6$piece <- as.character(pa.cd.court.6$piece)
cdShape <- pa.cd.court.6[pa.cd.court.6$id == 5, ]
  cdPoly <- SpatialPolygons(list(Polygons(lapply(split(cdShape[, c("long", "lat")], cdShape$piece), Polygon), ID = "b")))
  court.cd.6.boundary <- try(as(cdPoly, "owin"))


sink()
cat("
•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n
	")	


