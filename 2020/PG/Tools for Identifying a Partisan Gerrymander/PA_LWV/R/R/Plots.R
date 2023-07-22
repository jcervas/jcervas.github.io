# █▀▀ ░▀░ █▀▀▀ █░░█ █▀▀█ █▀▀ █▀▀
# █▀▀ ▀█▀ █░▀█ █░░█ █▄▄▀ █▀▀ ▀▀█
# ▀░░ ▀▀▀ ▀▀▀▀ ░▀▀▀ ▀░▀▀ ▀▀▀ ▀▀▀
# 🅙🅞🅝🅐🅣🅗🅐🅝 🅡. 🅒🅔🅡🅥🅐🅢
# 🅑🅔🅡🅝🅐🅡🅓 🅖🅡🅞🅕🅜🅐🅝

cat(
	"\n
•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
		CREATING PLOTS . . . . . . . . . . . . . . . . . . . . . 
•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••\n")

# # % -----------------------------------------------------------------
# yrs <- seq(2012,2016,2)
# pdf(paste0("Figures/fig_sims_actual_density.pdf"), 
# 	width = 5, 
# 	height = 6)
# par(mfrow=c(3,1), 
# 	oma= c(3,1.5,0,0), 
# 	mar=c(3,1,1,1), 
# 	mgp= c(2,1,0))
# for (k in 1:3)
# 	{		
# 		sims.tmp.yrs <- sim.election(
# 			votes = default.unc(house.2016.votes), 
# 			center = default.unc(get(paste0("house.", yrs[k],".votes"))), 
# 			yr=yrs[k], sims=1000, 
# 			sigma=sigma)

# 		x <- (unlist(lapply(sims.tmp.yrs, seats))) # Vector of Seats from Simulations for each year
# 		x.sd <- sd(x)
# 		x.mean <- mean(x)
# 		a <- density(x, na.rm=TRUE, from=x.mean-x.sd, to=x.mean+x.sd)
# 		area <- abs(sum(a$y)*(a$x[1]-a$x[2]))
# 		# twec <- sum(d$ecvotes[d$p>.5])/sum(d$ecvotes)
# 		e1 <- density(x, na.rm=TRUE, adjust=2)
		
# 	plot(e1, xlim=c(0,1), ylim=c(0,15), main=yrs[k], xlab = "", ylab = "", xaxt = "n", yaxt = "n")
# 		abline(v=seq(0,1,0.1), 
# 			lty=2, 
# 			col="gray95")
# 		axis(
# 			side=1, 
# 			las=1, 
# 			at=seq(0,1,0.1), 
# 			labels=paste0(seq(0,100,10),"%"), 
# 			cex.axis=0.85)
# 		mtext(side=1, 
# 			line=3, 
# 			ifelse(k %in% c(3, 8), "Republican Share of Seats", ""), 
# 			cex=0.65)
# 		x4 <- min(which(e1$x>x.mean-x.sd))
# 		x2 <- min(which(e1$x>x.mean+x.sd))
# 	with(e1, 
# 		polygon(
# 			x = c(x[c(x2,x2:x4,x4)]),  
# 			y = c(0, y[x2:x4], 0), 
# 			col = "gray60", 
# 			angle = 225, 
# 			density = 40, 
# 			border = NA))
# 	with(e1, 
# 		polygon(
# 			x = c(x[c(x2,x2:x4,x4)]),  
# 			y = c(0, y[x2:x4], 0), 
# 			col = "gray60", 
# 			angle = 135, 
# 			density = 40, 
# 			border = NA))
# 		rect(
# 			-.1,-1,1.1,0, 
# 			col="black")
# 		points(e1, 
# 			type="l")
# 		actual.seats <- seats(default.unc(get(paste0("house.", yrs[k], ".votes"))))
# 			if (k == 1) arrows(
# 				x0 = actual.seats - 0.03, 
# 				x1 = actual.seats - 0.1, 
# 				y0 = 7,
# 				y1 = 7, 
# 				angle=40, 
# 				length=0.05, 
# 				code=1, 
# 				lty=1, 
# 				col="gray10", 
# 				lwd=1)
# 			abline(v = actual.seats, lty=2, col="gray5")
# 	if (k == 1) text(actual.seats - 0.1, 7, "Actual Congressional \n Results", pos=2)
# 	}
# 	dev.off()

# Figure(
# 	path="Figures/fig_sims_actual_density.pdf", 
# 	caption="Comparing the Simulated Elections with US Congressional Elections (PA)", 
# 	label="fig:densityplots_congressional", 
# 	footnote="Plots based on the 2016 Five Election Composite data centered at the vote share for each year. All percentages in terms of Republican share of the two-party vote from the composite measure of five state-wide races in 2016. Shaded area contains one standard deviation on either side of the mean, representing 68\\% of the simulated seat percentages.")

# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# pdf(paste0("Figures/fig_sims_2016_maps_density.pdf"), 
# 	width = 8, 
# 	height = 10)
# par(mfrow=c(4,2), 
# 	oma= c(3,1.5,0,0), 
# 	mar=c(3,1,1,1), 
# 	mgp= c(2,1,0))
# for (k in 1:length(maps.sims.seats.2016))
# 	{		
# 		x <- do.call(rbind, maps.sims.seats.2016[k])
# 		x.sd <- sd(x)
# 		x.mean <- mean(x)
# 		a <- density(x, na.rm=TRUE, from=x.mean-x.sd, to=x.mean+x.sd)
# 		area <- abs(sum(a$y)*(a$x[1]-a$x[2]))
# 		# twec <- sum(d$ecvotes[d$p>.5])/sum(d$ecvotes)
# 		e1 <- density(x, na.rm=TRUE, adjust=2)
		
# 	plot(e1, xlim=c(0,1), ylim=c(0,10), main=plan_names[k], xlab = "", ylab = "", xaxt = "n", yaxt = "n")
# 		abline(v=seq(0,1,0.1), 
# 			lty=2, 
# 			col="gray95")
# 		axis(
# 			side=1, 
# 			las=1, 
# 			at=seq(0,1,0.1), 
# 			labels=paste0(seq(0,100,10),"%"), 
# 			cex.axis=0.85)
# 		mtext(side=1, 
# 			line=3, 
# 			ifelse(k %in% c(7, 8), "Republican Share of Seats", ""), 
# 			cex=0.65)
# 		x4 <- min(which(e1$x>x.mean-x.sd))
# 		x2 <- min(which(e1$x>x.mean+x.sd))
# 	with(e1, 
# 		polygon(
# 			x = c(x[c(x2,x2:x4,x4)]),  
# 			y = c(0, y[x2:x4], 0), 
# 			col = "gray60", 
# 			angle = 225, 
# 			density = 40, 
# 			border = NA))
# 	with(e1, 
# 		polygon(
# 			x = c(x[c(x2,x2:x4,x4)]),  
# 			y = c(0, y[x2:x4], 0), 
# 			col = "gray60", 
# 			angle = 135, 
# 			density = 40, 
# 			border = NA))
# 		rect(
# 			-.1,-1,1.1,0, 
# 			col="black")
# 		points(e1, 
# 			type="l")
# 		actual.seats <- seats(default.unc(get(paste0("house.2016.votes"))))
# 			if (k == 1) arrows(
# 				x0 = actual.seats - 0.03, 
# 				x1 = actual.seats - 0.1, 
# 				y0 = 7,
# 				y1 = 7, 
# 				angle=40, 
# 				length=0.05, 
# 				code=1, 
# 				lty=1, 
# 				col="gray10", 
# 				lwd=1)
# 			abline(v = actual.seats, lty=2, col="gray5")
# 	if (k == 1) text(actual.seats - 0.1, 7, "Actual Congressional \n Results", pos=2)
# 				legend("topright", 
# 			legend=
# 				c("SEAT SHARE ",
# 					paste0("  Average: ", 
# 					percent(mean(unlist(maps.sims.seats.2016[k])))), 
# 				paste0("  Median: ", 
# 					percent(median(unlist(maps.sims.seats.2016[k]))))),
# 				 bty="n", 
# 				 box.lwd=0,
# 				 cex=0.75)
# 		}
# 	dev.off()

# Figure(
# 	path="Figures/fig_sims_2016_maps_density.pdf", 
# 	caption="Simulated 2016 Elections by Plan", 
# 	label="fig:density2016", 
# 	footnote="Plots based on the 2016 Five Election Composite data centered at the 2016 vote share. All percentages in terms of Republican share of the two-party vote from the composite measure of five state-wide races in 2016. Shaded area contains one standard deviation on either side of the mean, representing 68\\% of the simulated seat percentages.")
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••


radius <- function(x) perimeter(x) / (2 * 3.1415926535)
# COMPACTNESS EXAMPLE: DISTRICT 6 OF THE COURT ADOPTED court PLAN AND DISTRICT 7 OF THE 2011 PLAN
# % =================================================================
# % -- FIGURE -- FIGURE -- FIGURE -- FIGURE -- FIGURE -- FIGURE --  %
# % -----------------------------------------------------------------
# pdf(paste0("Figures/fig_compactness.pdf"), width = 6, height = 6)
# 	par(
# 		mfrow = c(2, 2), 
# 		mar = c(0, 0, 0, 0), 
# 		oma = c(0, 0, 0, 0), 
# 		mai = c(0, 0, 0.4, 0), 
# 		xpd = NA, 
# 		pty = "s")
# # Reock
# 	plot(
# 		boundingcircle(court.cd.6.boundary), main = "")
# 		rect(
# 			1 * par("usr")[1], 
# 			(1 * par("usr")[3]), 
# 			0.995 * par("usr")[2], 
# 			(1 * par("usr")[4]), 
# 			density = NULL, 
# 			angle = 45, 
# 			col = "gray70", 
# 			border = NA,
# 			lty = par("lty"), 
# 			lwd = par("lwd"), 
# 			xpd = NA)

# 	plot(
# 		boundingcircle(court.cd.6.boundary), 
# 		col = "white", 
# 		add = T)

# 	plot(
# 		court.cd.6.boundary, 
# 		add = T, 
# 		col = "gray30", 
# 		border = "gray30")


# # Plot Polsby - Popper
# 	r <- radius(court.cd.6.boundary)
# 		circle.new(
# 			centroid.owin(court.cd.6.boundary)$x, 
# 			centroid.owin(court.cd.6.boundary)$y, 
# 			r, 
# 			main = "", 
# 			add = F)
# 		rect(
# 			1.0015 * par("usr")[1], 
# 			(1 * par("usr")[3]), 
# 			1 * par("usr")[2], 
# 			(1 * par("usr")[4]), 
# 			density = NULL, 
# 			angle = 45, 
# 			col = "gray70", 
# 			border = NA,
# 		    lty = par("lty"), 
# 		    lwd = par("lwd"), 
# 		    xpd = NA)
# 		circle(
# 			centroid.owin(court.cd.6.boundary)$x, 
# 			centroid.owin(court.cd.6.boundary)$y, 
# 			r, 
# 			col = "white")

# 	plot(
# 		court.cd.6.boundary, 
# 		col = "gray30", 
# 		border = "gray30", 
# 		add = T)

# # •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# 	# Plot Second plan
# 		# Reock
# 	plot(
# 		boundingcircle(enacted.cd.7.shp), 
# 		main = "Reock")
# 		rect(
# 			1 * par("usr")[1], 
# 			(1 * par("usr")[3]), 
# 			0.995 * par("usr")[2], 
# 			(1 * par("usr")[4]), 
# 			density = NULL, 
# 			angle = 45, 
# 			col = "gray70", 
# 			border = NA,
# 			lty = par("lty"), 
# 			lwd = par("lwd"), 
# 			xpd = NA)
# 	plot(
# 		boundingcircle(enacted.cd.7.shp), 
# 		col = "white", 
# 		add = T)

# 	plot(
# 		enacted.cd.7.shp, 
# 		add = T, 
# 		col = "gray30", 
# 		border = "gray30")


# 	# Plot Polsby - Popper
# 	r <- radius(enacted.cd.7.shp) 
# 		circle.new(
# 			centroid.owin(enacted.cd.7.shp)$x, 
# 			centroid.owin(enacted.cd.7.shp)$y, 
# 			r, 
# 			main = "Polsby-Popper", 
# 			add = F)
# 		rect(
# 			1.0015 * par("usr")[1], 
# 			(1 * par("usr")[3]), 1 * par("usr")[2], 
# 			(1 * par("usr")[4]), 
# 			density = NULL, 
# 			angle = 45, 
# 			col = "gray70", 
# 			border = NA,
# 		    lty = par("lty"), 
# 		    lwd = par("lwd"), 
# 		    xpd = NA)
# 		circle(
# 			centroid.owin(enacted.cd.7.shp)$x, 
# 			centroid.owin(enacted.cd.7.shp)$y, 
# 			r, 
# 			col = "white")

# 	plot(
# 		enacted.cd.7.shp, 
# 		col = "gray30", 
# 		border = "gray30", 
# 		add = T)


# 	title(
# 		"court Plan\n District 6", 
# 		outer = TRUE, 
# 		line = -5, 
# 		cex.main = 0.7)
# 	title(
# 		"2011 Plan Plan\n District 7", 
# 		outer = TRUE, 
# 		line = -23, 
# 		cex.main = 0.7)
# dev.off()
#   # write.csv(do.call("rbind", plan_compactness),  "Side Projects/PA Redistricting/Data/Plan Comparisons/compactness.csv")
# Figure(
# 	path="Figures/fig_compactness.pdf", 
# 	caption="Compactness Example: District 6 of the Court Adopted court Plan and District 7 of the 2011 Plan", 
# 	label="fig:compact", 
# 	footnote="District 7 of the Enacted plan is recognized as the ``Goofy kicking Donald Duck'', while District 6 of the court map has the same geographic center.")
  


# % =================================================================
# % -- MAPS -- MAPS -- MAPS -- MAPS -- MAPS -- MAPS -- MAPS -- MAPS -
# % =================================================================
  plans.compressed <- c("enacted2011.compressed", "court.compressed", "joint.compressed", "govwolf.compressed") #, "dailykos.compressed", "authorv1.compressed", "authorv2.compressed", "authorv3.compressed")
  plans <- c("enacted2011", "court", "joint", "govwolf") #, "dailykos.compressed", "authorv1.compressed", "authorv2.compressed", "authorv3.compressed")
  rem.philly <- court.compressed[court.compressed@data$DISTRICT %in% c("01", "02", "03", "04", "05"),]
  # Plot Plan Maps
  		plot(rem.philly, border=NA)
		e <- par("usr")
		e2 <- e + c(-.1, .1, -.1, .1)
		x <- e[2] - (e[2]-e[1])/2
		y <- e[4] - (e[4]-e[3])/2
		cir <-  circle(x,y, radius=(e[2]-e[1])/2.4)
		c <- cbind.data.frame(x=rev(cir$x),y=rev(cir$y))
		rim <- rbind(cbind(e2[2],e2[3]),cbind(e2[2],e2[4]), cbind(e2[1],e2[4]), cbind(e2[1],e2[3]), cbind(e2[2],e2[3])) 
		colnames(rim) <- c("x", "y")
		c <- rbind(rim,c, c[1,])
		dev.off()
svg(paste0("../Latex/Figures/fig_maps.svg"), 
  	width=8, 
  	height=10)
par(mar=c(0,0,0,0),
	bg="white")
nf <- layout(
	rbind(mat=
		c(0,1:2), c(3,7,8), c(4,9,10), c(5,11,12), c(6,13,14)
		),
	# widths= c(.15,3,1.45),
	widths= c(1, 3, 2),
	heights= c(.1,1,1,1,1), respect=F)
# layout.show(nf)
par(mar=c(0,0,0,0))
plot(.5,.5, xlim = c(.4, .7), ylim = c(.4, .7), type = "n", axes = F, xlab = "", ylab = "")#call empty plot to keep on same scale
text(.55, .55, " ", cex = 1.2, srt = 0, xpd = NA)
plot(.5,.5, xlim = c(.4, .7), ylim = c(.4, .7), type = "n", axes = F, xlab = "", ylab = "")#call empty plot to keep on same scale
text(.55, .55, "Philadelphia", cex = 1.2, srt = 0, xpd = NA)
for (plan in 1:4){
par(mar=c(0,0.5,0,0))
plot(.5,.5, xlim = c(.4, .7), ylim = c(.4, .7), type = "n", axes = F, xlab = "", ylab = "")#call empty plot to keep on same scale
text(.55, .55, plan_names[plan], cex = 2, srt = 90, xpd = NA)
}
	for (plan in 1:length(plans.compressed)) {
		shapeFile.compressed <- get(plans.compressed[plan])
		shapeFile <- get(plans[plan])
	par(mar=c(0,0,0,0))
		plot(shapeFile.compressed, 
			col="gray30", 
			border="gray70",
			lwd=1)
		plot(shapeFile.compressed,
			add=T,
			col=NA,
			lwd=0.25,
			border="white")
		polygon(cir, border="black", lwd=6)
		polygon(cir, border="white", lwd=2)
	par(mar=c(0,0,0,0))	
		plot(rem.philly, border=NA)
		plot(raster::crop(shapeFile.compressed,c), add=T, col="gray30", border="gray70", lwd=1)
		plot(pa_counties.compressed, add=T, col="NA", border="gray10", lwd=3)
		plot(raster::crop(shapeFile.compressed,c), add=T, col=NA, border="white", lwd=0.20)
		polygon(cir, border="black", lwd=15)
		polygon(cir, border="white", lwd=5)
		polygon(c, col="white", border="white")
  }
dev.off()

Figure(
	path="Figures/fig_maps.pdf", 
	caption="Maps Of The Proposed Pennsylvania Congressional Districts", 
	label="fig:maps", 
	footnote="Maps drawn with a Lambert Conformal Conic projection. Shapefiles were obtained from the Pennsylvania Supreme Court website for the four government plans.")


cat("
•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n
	")







# plot.density <- function(x) {
# 		if (is.list(x)) x <- unlist(x)
# 		x.mean <- mean(x)
# 		x.sd <- sd(x)
# 		a <- density(x, na.rm=TRUE, from=x.mean-x.sd, to=x.mean+x.sd)
# 		area <- abs(sum(a$y)*(a$x[1]-a$x[2]))
# 		# twec <- sum(d$ecvotes[d$p>.5])/sum(d$ecvotes)
# 		e1 <- density(x, na.rm=TRUE, adjust=2)
		
# 		plot(e1, xlim=c(0,1), ylim=c(0,10), xlab = "", ylab = "", xaxt = "n", yaxt = "n")
# 			abline(v=seq(0,1,0.1), lty=2, col="gray95")
# 			axis(side=1, las=1, at=seq(0,1,0.1), labels=paste0(seq(0,100,10),"%"), cex.axis=0.85)
# 		mtext(side=1, line=3, ifelse(k %in% c(7, 8), "Republican Share of Seats", ""), cex=0.65)

# 		x4 <- min(which(e1$x>x.mean-x.sd))
# 		x2 <- min(which(e1$x>x.mean+x.sd))
# 	with(e1, polygon(x=c(x[c(x2,x2:x4,x4)]),  y= c(0, y[x2:x4], 0), col="gray60", angle=225, density=40, border=NA))
# 	with(e1, polygon(x=c(x[c(x2,x2:x4,x4)]),  y= c(0, y[x2:x4], 0), col="gray60", angle=135, density=40, border=NA))
# 		rect(-.1,-1,1.1,0, col="black", fill="black")
# 		points(e1, type="l", add=TRUE)
# 		actual.seats <- seats(default.unc(get(paste0("house.", yrs[k], ".votes"))))
# if (k ==1 ) arrows(
# 	x0 = actual.seats + 0.03, 
# 	x1 = actual.seats + 0.1, 
# 	y0 = 7,
# 	y1 = 7, 
# 		angle=40, length=0.05, code=1, lty=1, col="gray10", lwd=1)
# 			abline(v = actual.seats, lty=2, col="gray5")
# if (k == 1) text(actual.seats + 0.1, 7, "Actual Congressional \n Results", pos=4)
# 	}



# % =================================================================
# % -- FIGURE -- FIGURE -- FIGURE -- FIGURE -- FIGURE -- FIGURE --  %
# % -----------------------------------------------------------------

# # Alternative Partisanship Graph

# Old <-  t((matrix(c(4, 1, 5, 8), nrow=1)))
# govwolf <- t((matrix(c(5,2,3,8), nrow=1)))
# Joint <- t((matrix(c(4, 3, 3, 8), nrow=1)))
# court <- t((matrix(c(5, 4, 2, 7), nrow=1)))


# district_per <- abs(50 - r(comp.2016.votes * 100, d = 0))

# # Gradiant Version
# pdf(paste0("Figures/fig_barplotPartisanship.pdf"), width=8, height=8)
#   par(mfrow=c(1,9),
#   	mar=c(0,0,0,0))
#   for (i in 1:4) 
#     {
#     plot(x=c(0,1), y=c(0,18), col="white", xaxt="none", yaxt="none", bty="n")
#       rect(0,0,1,1, col = paste0("grey", abs(100-district_per[1,i]*2)), border = "white")
#       rect(0,1,1,2, col = paste0("grey", abs(100-district_per[2,i]*2)), border = "white")
#       rect(0,2,1,3, col = paste0("grey", abs(100-district_per[3,i]*2)), border = "white")
#       rect(0,3,1,4, col = paste0("grey", abs(100-district_per[4,i]*2)), border = "white")
#       rect(0,4,1,5, col = paste0("grey", abs(100-district_per[5,i]*2)), border = "white")
#       rect(0,5,1,6, col = paste0("grey", abs(100-district_per[6,i]*2)), border = "white")
#       rect(0,6,1,7, col = paste0("grey", abs(100-district_per[7,i]*2)), border = "white")
#       rect(0,7,1,8, col = paste0("grey", abs(100-district_per[8,i]*2)), border = "white")
#       rect(0,8,1,9, col = paste0("grey", abs(100-district_per[9,i]*2)), border = "white")
#       rect(0,9,1,10, col = paste0("grey", abs(100-district_per[10,i]*2)), border = "white")
#       rect(0,10,1,11, col = paste0("grey", abs(100-district_per[11,i]*2)), border = "white")
#       rect(0,11,1,12, col = paste0("grey", abs(100-district_per[12,i]*2)), border = "white")
#       rect(0,12,1,13, col = paste0("grey", abs(100-district_per[13,i]*2)), border = "white")
#       rect(0,13,1,14, col = paste0("grey", abs(100-district_per[14,i]*2)), border = "white")
#       rect(0,14,1,15, col = paste0("grey", abs(100-district_per[15,i]*2)), border = "white")
#       rect(0,15,1,16, col = paste0("grey", abs(100-district_per[16,i]*2)), border = "white")
#       rect(0,16,1,17, col = paste0("grey", abs(100-district_per[17,i]*2)), border = "white")
#       rect(0,17,1,18, col = paste0("grey", abs(100-district_per[18,i]*2)), border = "white")
# # 50/50
#       abline(h=9, lty=3, lwd=1, col="gray20")
#       shadowtext(.5,9, pos=1, srt=90, label=plan_names[i], cex=1.5, col="black", bg="gray90")
#     }
#     plot(x=c(0,1), y=c(-200,400), col="white", xaxt="none", yaxt="none", bty="n")
#       for (j in 0:99)
#         {
#       	 rect(.4,j,.6,(j+1), col = paste0("grey", j+1), border = "transparent")
#         }
#       for (j in 99:0)
#         {
#         	rect(.4,j+100,.6,j+101, col = paste0("grey", abs(j-100)), border = "transparent")
#         }
#         mtext(side=4,line=-5.25,"<---- More Democratic", cex=.75, adj=.5, at=-100)
#         mtext(side=4,line=-5.25,"More Republican ---->", cex=.75, adj=.5, at=300)
#         mtext(side=4, las=2, line=-5.95,"50/50", cex=.5, adj=.5, at=100)
#         axis(side=4, las=1, at=c(0, 25, 50, 75, 100, 125, 150, 175, 200), line=-2.65, labels=paste0(c(seq(100,0,-25),seq(25,100,25)), "%"), cex.axis=.75)
# dev.off()

# Figure(
# 	path="Figures/fig_barplotpartisanship.pdf", 
# 	caption="District Partisanship by Plan", 
# 	label="fig:1a", 
# 	footnote="All percentages in terms of Democratic share of the two-party vote from the composite measure of five state-wide races in 2016."
# 	)

# % -----------------------------------------------------------------
# % -- END FIGURE -- END FIGURE -- END FIGURE -- END FIGURE -- FIGU %
# % =================================================================



# % =================================================================
# % -- FIGURE -- FIGURE -- FIGURE -- FIGURE -- FIGURE -- FIGURE --  %




# MAP SIMULATIONS OF PLANS - 2018
# # % =================================================================
# # % -- FIGURE -- FIGURE -- FIGURE -- FIGURE -- FIGURE -- FIGURE --  %
# # % -----------------------------------------------------------------

# pdf(paste0("Figures/fig_sims_2018_maps_density.pdf"), 
# 	width = 8, 
# 	height = 10)
# par(mfrow=c(4,2), 
# 	oma= c(3,1.5,0,0), 
# 	mar=c(3,1,1,1), 
# 	mgp= c(2,1,0))
# for (k in 1:length(maps.sims.seats.2018))
# 	{		
# 		x <- do.call(rbind, maps.sims.seats.2018[k])
# 		x.sd <- sd(x)
# 		x.mean <- mean(x)
# 		a <- density(x, na.rm=TRUE, from=x.mean-x.sd, to=x.mean+x.sd)
# 		area <- abs(sum(a$y)*(a$x[1]-a$x[2]))
# 		# twec <- sum(d$ecvotes[d$p>.5])/sum(d$ecvotes)
# 		e1 <- density(x, na.rm=TRUE, adjust=1)
		
# 	plot(e1, xlim=c(0,1), ylim=c(0,10), main=plan_names[k], xlab = "", ylab = "", xaxt = "n", yaxt = "n")
# 		abline(v=seq(0,1,0.1), 
# 			lty=2, 
# 			col="gray95")
# 		axis(
# 			side=1, 
# 			las=1, 
# 			at=seq(0,1,0.1), 
# 			labels=paste0(seq(0,100,10),"%"), 
# 			cex.axis=0.85)
# 		mtext(side=1, 
# 			line=3, 
# 			ifelse(k %in% c(7, 8), "Republican Share of Seats", ""), 
# 			cex=0.65)
# 		x4 <- min(which(e1$x>x.mean-x.sd))
# 		x2 <- min(which(e1$x>x.mean+x.sd))
# 	with(e1, 
# 		polygon(
# 			x = c(x[c(x2,x2:x4,x4)]),  
# 			y = c(0, y[x2:x4], 0), 
# 			col = "gray60", 
# 			angle = 225, 
# 			density = 40, 
# 			border = NA))
# 	with(e1, 
# 		polygon(
# 			x = c(x[c(x2,x2:x4,x4)]),  
# 			y = c(0, y[x2:x4], 0), 
# 			col = "gray60", 
# 			angle = 135, 
# 			density = 40, 
# 			border = NA))
# 		rect(
# 			-.1,-1,1.1,0, 
# 			col="black")
# 		points(e1, 
# 			type="l")
# 		actual.seats <- seats(default.unc(get(paste0("house.2018.votes"))))
# 			if (k == 1) arrows(
# 				x0 = actual.seats - 0.03, 
# 				x1 = actual.seats - 0.1, 
# 				y0 = 7,
# 				y1 = 7, 
# 				angle=40, 
# 				length=0.05, 
# 				code=1, 
# 				lty=1, 
# 				col="gray10", 
# 				lwd=1)
# 			abline(v = actual.seats, lty=2, col="gray5")
# 	if (k == 1) text(actual.seats - 0.1, 7, "Actual Congressional \n Results", pos=2)
# 			legend("topright", 
# 			legend=
# 				c("SEAT SHARE ",
# 					paste0("  Average: ", 
# 					percent(mean(unlist(maps.sims.seats.2018[k])))), 
# 				paste0("  Median: ", 
# 					percent(median(unlist(maps.sims.seats.2018[k]))))),
# 				 bty="n", 
# 				 box.lwd=0,
# 				 cex=0.75)
# 	}
# 	dev.off()

# Figure(
# 	path="Figures/fig_sims_2018_maps_density.pdf", 
# 	caption="Simulated 2018 Elections by Plan", 
# 	label="fig:density2018", 
# 	footnote="Plots based on the 2016 Five Election Composite data centered at the 2018 vote share. All percentages in terms of Republican share of the two-party vote from the composite measure of five state-wide races in 2016. Shaded area contains one standard deviation on either side of the mean, representing 68\\% of the simulated seat percentages.")
# # % -----------------------------------------------------------------
# # % -- END FIGURE -- END FIGURE -- END FIGURE -- END FIGURE -- FIGU %
# # % =================================================================

# # MAP SIMULATIONS OF PLANS - 50/50 Hypothetical Tie
# # % =================================================================
# # % -- FIGURE -- FIGURE -- FIGURE -- FIGURE -- FIGURE -- FIGURE --  %
# # % -----------------------------------------------------------------

# pdf(paste0("Figures/fig_sims_5050_maps_density.pdf"), 
# 	width = 8, 
# 	height = 10)
# par(mfrow=c(4,2), 
# 	oma= c(3,1.5,0,0), 
# 	mar=c(3,1,1,1), 
# 	mgp= c(2,1,0))
# for (k in 1:length(maps.sims.seats.5050))
# 	{		
# 		x <- do.call(rbind, maps.sims.seats.5050[k])
# 		x.sd <- sd(x)
# 		x.mean <- mean(x)
# 		a <- density(x, na.rm=TRUE, from=x.mean-x.sd, to=x.mean+x.sd)
# 		area <- abs(sum(a$y)*(a$x[1]-a$x[2]))
# 		# twec <- sum(d$ecvotes[d$p>.5])/sum(d$ecvotes)
# 		e1 <- density(x, na.rm=TRUE, adjust=1)
		
# 	plot(e1, xlim=c(0,1), ylim=c(0,8), main=plan_names[k], xlab = "", ylab = "", xaxt = "n", yaxt = "n")
# 		abline(v=seq(0,1,0.1), 
# 			lty=2, 
# 			col="gray95")
# 		axis(
# 			side=1, 
# 			las=1, 
# 			at=seq(0,1,0.1), 
# 			labels=paste0(seq(0,100,10),"%"), 
# 			cex.axis=0.85)
# 		mtext(side=1, 
# 			line=3, 
# 			ifelse(k %in% c(7, 8), "Republican Share of Seats", ""), 
# 			cex=0.65)
# 		x4 <- min(which(e1$x>x.mean-x.sd))
# 		x2 <- min(which(e1$x>x.mean+x.sd))
# 	with(e1, 
# 		polygon(
# 			x = c(x[c(x2,x2:x4,x4)]),  
# 			y = c(0, y[x2:x4], 0), 
# 			col = "gray60", 
# 			angle = 225, 
# 			density = 40, 
# 			border = NA))
# 	with(e1, 
# 		polygon(
# 			x = c(x[c(x2,x2:x4,x4)]),  
# 			y = c(0, y[x2:x4], 0), 
# 			col = "gray60", 
# 			angle = 135, 
# 			density = 40, 
# 			border = NA))
# 		rect(
# 			-.1,-1,1.1,0, 
# 			col="black")
# 		points(e1, 
# 			type="l")
# 		actual.seats <- 0.5
# 			if (k == 1) arrows(
# 				x0 = actual.seats - 0.03, 
# 				x1 = actual.seats - 0.1, 
# 				y0 = 7,
# 				y1 = 7, 
# 				angle=40, 
# 				length=0.05, 
# 				code=1, 
# 				lty=1, 
# 				col="gray10", 
# 				lwd=1)
# 			abline(v = 0.5, lty=2, col="gray5")
# 	if (k == 1) text(actual.seats - 0.1, 7, "Hypothetical (Proportional) \n Congressional Results", pos=2)
# 		legend("topright", 
# 			legend=
# 				c("SEAT SHARE ",
# 					paste0("  Average: ", 
# 					percent(mean(unlist(maps.sims.seats.5050[k])))), 
# 				paste0("  Median: ", 
# 					percent(median(unlist(maps.sims.seats.5050[k]))))),
# 				 bty="n", 
# 				 box.lwd=0,
# 				 cex=0.75)
# 	}
# 	dev.off()

# Figure(
# 	path="Figures/fig_sims_5050_maps_density.pdf", 
# 	caption="Hypothetical 50/50 Tied Election", 
# 	label="fig:5050Tie", 
# 	footnote="Plots based on the 2016 Five Election Composite data centered at 50\\% vote share for each party. All percentages in terms of Republican share of the two-party vote from the composite measure of five state-wide races in 2016. Shaded area contains one standard deviation on either side of the mean, representing 68\\% of the simulated seat percentages.")







