library("geojsonio","rgdal","rmapshaper")
options(stringsAsFactors=F)
 # "+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=37.5 +lon_0=-96 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs"
us <- readOGR("/Users/cervas/Google Drive/Dissertation/US", "counties")
lakes <- readOGR("/Users/cervas/Google Drive/Dissertation/US/","lakes")
proj4string(us) <- "+proj=utm +zone=18 +datum=WGS84 +units=m +no_defs +ellps=WGS84 +towgs84=0,0,0"
proj4string(lakes) <- "+proj=utm +zone=18 +datum=WGS84 +units=m +no_defs +ellps=WGS84 +towgs84=0,0,0"
us.border <- ms_dissolve(us)
us@data <- us@data[colnames(us@data) %in% c("name")]
	us@data$state <- us@data$name
	d <- read.csv("https://raw.githubusercontent.com/jcervas/Non-Competitive-Advantage/master/Presidential_Election_General_Two_Party.csv", stringsAsFactors=FALSE)
d.2016 <- d[d$year %in% '2016',]
a <- data.frame(state=as.character(d.2016$state), dem=two_party(d.2016$dem, d.2016$rep))
a$state[a$state %in% "D. C."] <- "District of Columbia"


us@data <- left_join(us@data, a)

us@data$dem <- two_party(us@data$dem,us@data$rep)
us@data$pvi <- -1 * (us@data$dem<0.47) + 1 * (us@data$dem>0.53)

svg("/Users/cervas/Google Drive/Dissertation/images/us-2016.svg", width=12, height=10)
plot(us, lty=1, border="white")
plot(us.border, border="black", lwd=3, add=T, lty="solid")
plot(us, lty=1, border="white", add=T)
plot(us[us@data$pvi==1,], col="blue", border="white", add=T)
plot(us[us@data$pvi==-1,], col="red", border="white", add=T)
plot(lakes, lty=1, col=rgb(52,68,103, max=255), border=0, add=T)
plot(us[!us@data$pvi %in% c(-1,1),], lty=2, border="gray70", add=T)
dev.off()


years <- seq(1976,2016,4)
for (i in 1:length(years)) {
d.2016 <- d[d$year %in% years[i],]
a <- data.frame(state=as.character(d.2016$state), dem=two_party(d.2016$dem, d.2016$rep))
a$state[a$state %in% "D. C."] <- "District of Columbia"
a <- a[order(a[,2]),]
	thirds <- length(a[,1])/3
	first.third <- a[1:thirds,]
	second.third <- a[thirds:(2*thirds),]
	third.third <- a[(2*thirds):length(a[,1]),]

svg(paste0("/Users/cervas/Downloads/thirds/us-",years[i],".svg"), width=12, height=7)
par(mar=c(0,0,0,0))
	plot(us, lty=1, border="white")
	plot(us.border, border="black", lwd=3, add=T, lty="solid")
	plot(us, lty=1, border="white", add=T)
	plot(us[us@data$state %in% first.third$state,], col="red", border="white", add=T)
	plot(us[us@data$state %in% third.third$state,], col="blue", border="white", add=T)
	plot(us[us@data$state %in% second.third$state,], lty="dotdash", border="gray70", add=T)
dev.off()
	}

writeOGR(us, "/Users/cervas/Downloads", "us", driver="ESRI Shapefile", overwrite_layer=TRUE)

