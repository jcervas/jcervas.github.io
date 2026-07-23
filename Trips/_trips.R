
#Directory
directory <- "/Volumes/GoogleDrive/My Drive/GitHub/Trips/"
# GIS
download.file(url, destfile, method, quiet = FALSE, mode = "w",
              cacheOK = TRUE,
              extra = getOption("download.file.extra"),
              headers = NULL, ...)
states <- rgdal::readOGR("/Volumes/GoogleDrive/My Drive/GitHub/Data Files/GIS/NYT/states/states.shp")

trips <- read.csv(paste0(directory, "trips.csv"))
head(trips)



# air <- read.csv(paste0(directory, "fullairports.csv"))
airports <- read.csv(paste0(directory,"airports.csv"))
head(airports)

trips$Latitude_exp <- airports$LAT[match(trips$Exporter, airports$iata)]
trips$Longitude_exp <- airports$LONG[match(trips$Exporter, airports$iata)]

trips$Latitude_imp <- airports$LAT[match(trips$Importer, airports$iata)]
trips$Longitude_imp <- airports$LONG[match(trips$Importer, airports$iata)]
trips$Millions <- 100
trips$country <- "United States"
trips$distance <- geosphere::distCosine(cbind(trips$Longitude_exp, trips$Latitude_exp), cbind(trips$Longitude_imp, trips$Latitude_imp), r=3963)


trips$st <- air$State[match(trips$Exporter, air$LocationID)]


trips <- rbind(trips,c("","12/12/19","","SNA","PHX","SA","LEISURE",33.67570114,-117.8679962,33.43429947,-112.012001,100,"United States",337.9129,"CA"))


sp::plot(states)
points(trips$Longitude_imp, trips$Latitude_imp, cex=0.5, col="gray60", pch=19)

write.csv(trips, "/Users/cervas/Downloads/cervas_trips_2019.csv", row.names=F)


