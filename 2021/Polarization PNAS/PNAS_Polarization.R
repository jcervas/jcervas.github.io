# Remove all objects just to be safe.
			rm(list=ls(all=TRUE))
library(tidyverse)
library(jsonlite)
setwd("/Users/user/Google Drive/Projects/Polarization PNAS")
options(scipen=999) # Turn off Scientific Notation
source("/Users/user/Google Drive/GitHub/R Functions/GERRYfunctions.R")
fips <- read.csv("https://raw.githubusercontent.com/jcervas/Data/master/fips.csv")

years <- seq(1868,2020,4)
elect.dta <- read.csv("https://raw.githubusercontent.com/jcervas/Data/master/Elections/Presidential/Pres%20by%20State/president_state.csv")
	# electiondata <- split(elect.dta, elect.dta$year)
house.del <- read.csv("https://raw.githubusercontent.com/jcervas/Data/master/Elections/House/housedelegations1868-2020.csv")
presCD <- read.csv("https://raw.githubusercontent.com/jcervas/Data/master/Elections/Presidential/Pres%20by%20CD/pres_cd_1952_2020.csv")
presCD$ed[presCD$ed %in% "99"] <- 1
	presCD.elections <- data.frame(year=presCD$year, state=presCD$state, district=presCD$ed, demPres=two_party(presCD$dem,presCD$rep))
# Ideology
a <- read.csv("https://voteview.com/static/data/out/members/HSall_members.csv")
a <- full_join(a, fips, by= c("state_abbrev"="abv"))
	years.match <- data.frame(congress=seq(1,116,1),year=seq(1788,2018,2))
	a$year <- years.match$year[match(a$congress, years.match$congress)]
	housesenate <- a[a$congress %in% seq(41,max(a$congress, na.rm=T)),]
	house <- housesenate[housesenate$chamber %in% "House",]
	house.ideo <- data.frame(year=house$year, state=house$state, district=house$district_code, DWnom1=house$nominate_dim1, party=house$party_code)
	senate <- housesenate[housesenate$chamber %in% "Senate",]

houseCD <- read.csv("https://raw.githubusercontent.com/jcervas/Data/master/Elections/House/house_elections_1968_2020.csv")
	house.elections <- data.frame(year=houseCD$year, state=houseCD$state, district=houseCD$district, demCD=two_party(replaceNA(houseCD$dem),replaceNA(houseCD$rep)))
cd.elections <- full_join(house.elections, presCD.elections)
cd.full <- full_join(cd.elections, house.ideo)
head(cd.full)

for (j in unique(houseCD$year)) {
	tmp <- houseCD[houseCD$year %in% j,]
	cat(j, sum(1* (abs(two_party(tmp$dem,tmp$rep)-0.5) < 0.05))/length(two_party(tmp$dem,tmp$rep)), "\n")
}
#######################################
#######################################
# Density and Partisanship, State level - I think the correlation is related to the Democratic domananc of New England in the second half of the 20ths and first part ot the 21st century
#######################################
#######################################
cnty.area <- read.csv("https://raw.githubusercontent.com/jcervas/Data/master/Census/counties/LND01.csv")
cnty.area <- data.frame(sTaTe=standardizeText(cnty.area$state), cntfips=leadingZeroes(cnty.area$STCOU,5), area=cnty.area$LND110210D)
st.area <- aggregate(cnty.area$area, by=list(sTaTe=cnty.area$sTaTe), FUN=sum)

# cnty.pop <- read.csv("https://raw.githubusercontent.com/jcervas/Data/master/Census/counties/county2010_hist_pops.csv")
st.area$sTaTe[st.area$sTaTe %in% "districtofcolumbia"] <- "dc"

	head(st.area)
		elect.dta$sTaTe <- standardizeText(elect.dta$state)
		elect.dta <- full_join(elect.dta, st.area, by="sTaTe")
		elect.dta$x <- elect.dta$pop/elect.dta$x
	
	density.partisanship <- density.part.025 <- density.part.975 <- rep(NA, length(elect.dta))
			elect.dta <- elect.dta[!is.na(elect.dta$dem),]
		for (j in 1:length(unique(elect.dta$year))) {
			x <- elect.dta[elect.dta$year %in% unique(elect.dta$year)[j],]
				# summary(reg.tmp <- lm(rank(electiondata[[j]]$dem)~rank(electiondata[[j]]$x)))
			density.partisanship[j] <- cor(rank(x$dem),rank(x$x))
			density.part.025[j] <- cor.test(rank(x$dem),rank(x$x))$conf.int[1]
			density.part.975[j] <- cor.test(rank(x$dem),rank(x$x))$conf.int[2]
	}

plot(years, density.partisanship, type="l",
	cex=0.3, 
	ylim=c(-0.55,0.8), 
	axes="F", 
	xlab="Year", 
	ylab="Correlation (Partisanship | Density)",
	main="")
	abline(h=seq(-0.55,0.8,0.1), col="gray80", lwd=0.5)
	axis(side=1, las=2, at=seq(1868,2020,4), labels=years, cex.lab=0.5)
	axis(side=2, las=2, at=seq(-0.55,0.8,0.1), labels=seq(-0.55,0.8,0.1))
	polygon(x= c(years, rev(years)),  y= c(density.part.025, rev(density.part.975)), col="#11111111", border=NA)
	lines(years, density.partisanship, lwd=2)
	points(years, density.partisanship, pch=19, cex=1.5)
	abline(h=0, lty=2)
# head(cnty.pop)
# aggregate(cnty.pop[,5:27], by=list(state=cnty.pop$STATE), FUN=sum)
# hist.pop <- fromJSON("https://raw.githubusercontent.com/jcervas/Data/master/Census/hist_pop.json", simplifyDataFrame = T)
# 	head(hist.pop)#

# POPS <- list()
# for (j in 1:length(hist.pop)) {
# 	POPS[[j]] <- hist.pop[[j]]$census$population
# }
# pops <- as.data.frame(do.call(rbind,POPS))
# for(j in 1:length(hist.pop)){rownames(pops)[j] <- hist.pop[[j]]$name}
# pops$sTaTe <- standardizeText(rownames(pops))

# DENSITY <- full_join(pops,st.area)
# DENSITY <- data.frame(state=DENSITY$state,DENSITY[,1:23]/DENSITY[,26])
urban.st <- read.csv("https://raw.githubusercontent.com/jcervas/Data/master/Census/Urban/urban_state.csv")
years.urban <- seq(1900,2008,4)
	urban.partisanship <- rep(NA, length(years.urban))
		for (j in 1:length(years.urban)) {
head(urban.st)

elect.tmp <- elect.dta[elect.dta$year %in% years.urban[j],]
elect.tmp <- elect.tmp[!is.na(elect.tmp$pop),]

urban.tmp <- urban.st[urban.st$year %in% years.urban[j],]

elect.tmp <- left_join(elect.tmp, urban.tmp)
			urban.partisanship[j] <- cor(rank(elect.tmp$dem),rank(elect.tmp$urban))
	}
plot(years.urban, urban.partisanship, type="l",
	cex=0.3, 
	pch=19, 
	ylim=c(-0.6,0.6), 
	axes="F", 
	xlab="Year", 
	ylab="Correlation rank(Partisanship | Urban)",
	main="")
	axis(side=1, at=years.urban, labels=years.urban)
	axis(side=2, las=2, at=seq(-0.55,0.55,0.1), labels=seq(-0.55,0.55,0.1))
	points(years.urban, urban.partisanship, pch=19)
	abline(h=0, lty=3)



#######################################
#######################################
# States Safe
#######################################
#######################################
Safe.States.Composite <- rowSums(data.frame(
find.winner(electiondata[[34]]$dem),
find.winner(electiondata[[35]]$dem),
find.winner(electiondata[[36]]$dem),
find.winner(electiondata[[37]]$dem),
find.winner(electiondata[[38]]$dem),
find.winner(electiondata[[39]]$dem)))

length(Safe.States.Composite[Safe.States.Composite %in% c(0,6)])
#// 15 Dem States, 20 Rep States, total of 35/50



#######################################
#######################################
# Ideology
#######################################
#######################################
senate.dem <- senate[senate$party_code %in% "100",]
senate.rep <- senate[senate$party_code %in% "200",]

house.dem <- house[house$party_code %in% "100",]
house.rep <- house[house$party_code %in% "200",]

sen.dem.median <- aggregate(senate.dem$nominate_dim1, by=list(senate.dem$congress), FUN=function(x) quantile(x, 0.5, na.rm=T))
sen.dem.05 <- aggregate(senate.dem$nominate_dim1, by=list(senate.dem$congress), FUN=function(x) quantile(x, 0.025, na.rm=T))
sen.dem.95 <- aggregate(senate.dem$nominate_dim1, by=list(senate.dem$congress), FUN=function(x) quantile(x, 0.975, na.rm=T))

sen.rep.median <- aggregate(senate.rep$nominate_dim1, by=list(senate.rep$congress), FUN=function(x) quantile(x, 0.5, na.rm=T))
sen.rep.05 <- aggregate(senate.rep$nominate_dim1, by=list(senate.rep$congress), FUN=function(x) quantile(x, 0.025, na.rm=T))
sen.rep.95 <- aggregate(senate.rep$nominate_dim1, by=list(senate.rep$congress), FUN=function(x) quantile(x, 0.975, na.rm=T))

par(mfrow=c(2,1))
plot(sen.dem.median[,1], sen.dem.median[,2], 
	type="l", 
	cex=0.3, 
	pch=19, 
	ylim=c(-1,1), 
	axes="F", 
	xlab="Year", 
	ylab="Ideology",
	main="Senate")
lines(sen.rep.median[,1], sen.rep.median[,2])
	polygon(x= c(sen.dem.median[,1], rev(sen.dem.median[,1])),  y= c(sen.dem.95[,2], rev(sen.dem.05[,2])), col="#11111111", border=NA)
	polygon(x= c(sen.rep.median[,1], rev(sen.rep.median[,1])),  y= c(sen.rep.95[,2], rev(sen.rep.05[,2])), col="#11111111", border=NA)
	abline(h=0, lty=3, col="gray50")
axis(side=1, las=2, at=seq(41,117,2), labels=years, cex.axis=0.5)
axis(side=2, las=1, at=seq(-1,1,0.5), labels=seq(-1,1,0.5))


house.dem.median <- aggregate(house.dem$nominate_dim1, by=list(house.dem$congress), FUN=function(x) quantile(x, 0.5, na.rm=T))
house.dem.05 <- aggregate(house.dem$nominate_dim1, by=list(house.dem$congress), FUN=function(x) quantile(x, 0.025, na.rm=T))
house.dem.95 <- aggregate(house.dem$nominate_dim1, by=list(house.dem$congress), FUN=function(x) quantile(x, 0.975, na.rm=T))

house.rep.median <- aggregate(house.rep$nominate_dim1, by=list(house.rep$congress), FUN=function(x) quantile(x, 0.5, na.rm=T))
house.rep.05 <- aggregate(house.rep$nominate_dim1, by=list(house.rep$congress), FUN=function(x) quantile(x, 0.025, na.rm=T))
house.rep.95 <- aggregate(house.rep$nominate_dim1, by=list(house.rep$congress), FUN=function(x) quantile(x, 0.975, na.rm=T))

plot(house.dem.median[,1], house.dem.median[,2], 
	type="l", 
	cex=0.3, 
	pch=19, 
	ylim=c(-1,1), 
	axes="F", 
	xlab="Year", 
	ylab="Ideology",
	main="House")
lines(house.rep.median[,1], house.rep.median[,2])
	polygon(x= c(house.dem.median[,1], rev(house.dem.median[,1])),  y= c(house.dem.95[,2], rev(house.dem.05[,2])), col="#11111111", border=NA)
	polygon(x= c(house.rep.median[,1], rev(house.rep.median[,1])),  y= c(house.rep.95[,2], rev(house.rep.05[,2])), col="#11111111", border=NA)
	abline(h=0, lty=3, col="gray50")
axis(side=1, las=2, at=seq(41,117,2), labels=years, cex.axis=0.5)
axis(side=2, las=1, at=seq(-1,1,0.5), labels=seq(-1,1,0.5))





# Delegation Sizes
plot(house.del[,2], house.del[,"seats"], 
	type="n", 
	ylim=c(0,435),
	cex=0.3, 
	pch=19, 
	axes="F", 
	xlab="Year", 
	ylab="Delegation Size",
	main="House")
lines(lowess(house.del[,2], house.del[,"Democrats"], f=0.1))
lines(lowess(house.del[,2], house.del[,"Republicans"], f=0.1), lty=2)
axis(side=1, at=seq(41,117,2), labels=years)
axis(side=2, las=1, at=seq(0,435,50), labels=seq(0,435,50))
legend("bottomright",legend=c("Democrats","Republicans"), lty=c(1,2))

#######################################
#######################################



#######################################
#######################################
# Plotting DW-Nominate by period
#######################################
#######################################
# Pres by CD plot
# house.presCD <- house[house$year %in% seq(1956,2018,2),]
	# head(house.presCD)
	# head(presCD)
	
# presCD$DWnom1 <- house.presCD$nominate_dim1[match((paste0(presCD$year,leadingZeroes(presCD$icpsr,2),leadingZeroes(presCD$district,2))),
	# (paste0(house.presCD$year,leadingZeroes(house.presCD$state_icpsr,2),leadingZeroes(house.presCD$district_code,2))))]

# presCD$party <- house.presCD$party_code[match((paste0(presCD$year,leadingZeroes(presCD$icpsr,2),leadingZeroes(presCD$district,2))),
	# (paste0(house.presCD$year,leadingZeroes(house.presCD$state_icpsr,2),leadingZeroes(house.presCD$district_code,2))))]

presCD <- cd.full[!is.na(cd.full$DWnom1),]

period.56.64 <- seq(1956,1964,2)
period.66.74 <- seq(1966,1974,2)
period.76.84 <- seq(1976,1984,2)
period.86.94 <- seq(1986,1994,2)
period.96.04 <- seq(1996,2004,2)
period.06.16 <- seq(2006,2016,2)

periods <- c("period.56.64", "period.66.74", "period.76.84", "period.86.94", "period.96.04", "period.06.16")

	par(mfrow=c(2,3))
for (j in 1:length(periods)) {
	
	per.tmp <- get(periods[j])
	pres.cd.tmp <- presCD[presCD$year %in% per.tmp,]
		pres.year.avg <- aggregate(pres.cd.tmp$demPres, by=list(pres.cd.tmp$year), FUN=mean, na.rm=T)
		pres.cd.tmp$presAVG <- pres.year.avg[match(pres.cd.tmp$year, pres.year.avg[,1]),2]
	DEM <- pres.cd.tmp$demPres
		dem.min <- min(pres.cd.tmp$demPres, na.rm=T)
		dem.max <- max(pres.cd.tmp$demPres, na.rm=T)
		demtp <- pres.cd.tmp$demPres

	rep.reg <- lm(pres.cd.tmp$DWnom1[pres.cd.tmp$party ==200] ~ DEM[pres.cd.tmp$party ==200])
	dem.reg <- lm(pres.cd.tmp$DWnom1[pres.cd.tmp$party ==100] ~ DEM[pres.cd.tmp$party ==100])
		print(rep.reg$coef[1] - dem.reg$coef[1])
	cat("Republican: ", rep.reg$coef[1], "\n")
	cat("Democrat: ", dem.reg$coef[1])

			par(mar=c(5,5,1,1))
			plot(DEM, pres.cd.tmp$DWnom1, 
				col=ifelse(pres.cd.tmp$party ==100,"#33333333","#33333333"), 
				pch=ifelse(pres.cd.tmp$party ==100,19,18),
				# pch=ifelse(pres.cd.tmp$party ==100,"D","R"),
				cex=ifelse(pres.cd.tmp$party ==100,0.75,0.95), 
				xlim=c(0,1),
				ylim=c(-1,1),
				ylab="",
				xlab="",
				axes=F,
				main=paste0(min(per.tmp), "-", max(per.tmp)))
			abline(rep.reg, lty=2)
			abline(dem.reg)
			if (j %in% c(1,4)) axis(side=2, las=1, at=seq(-1,1,.25), labels=seq(-1,1,.25))
			# if (j %in% c(4,5,6)) axis(side=1, las=1, at=seq(-0.5,0.5,0.25), labels=c("R+50","R+25","Nat.Avg","D+25","D+50"))
			if (j %in% c(4,5,6)) axis(side=1, las=1, at=seq(0,1,0.25), labels=c("R+50","R+25","Tie","D+25","D+50"))
			}
			mtext('DW-Nominate Ideology', side = 2, outer = TRUE, line = -2)
			mtext('Presidential Vote', side = 1, outer = TRUE, line = -2)

#######################################
#######################################

# Balkin style plot /Users/user/Google Drive/Projects/Electoral College/_maincodeEC.R



###################################################################
######### - Weighted Seats/Votes Curves - #########################
###################################################################
rep.data.frame <- function(x, times) {
	rnames <- attr(x, "row.names")
	x <- lapply(x, rep.int, times = times)
	class(x) <- "data.frame"
	if (!is.numeric(rnames))
		attr(x, "row.names") <- make.unique(rep.int(rnames, times))
	else attr(x, "row.names") <- .set_row_names(length(rnames) * times)
	x
}

skew.pres <- rep(NA,length(years))
for (j in 1:length(electiondata)) {
	d <- electiondata[[j]]
		rownames(d) <- d$state
	e <- d[!is.na(d$ecvotes),]
	dw <- rep.data.frame(e, 1)
	# dw <- rep.data.frame(e, e$ecvotes)
	skew.pres[j] <- e1071::skewness(dw$dem, na.rm = TRUE)
}

# is.na(h$dem) & is.na(h$rep)
# pdf("/Users/jcervas/Dropbox/EC Grofman Cervas/pctDem_weightedEC.pdf", width = 8, height = 6)
# par(mfrow = c(3,2), oma = c(3,1.5,0,0), mar = c(2,1,3,1), mgp = c(2,1,0))

# densityyears <- c(2000, 1884, 1916, 1876, 1960, 2016)
# 	for (yr in densityyears) {
# 		year <- yr
# 		d <- e[e$year == yr,]

# 	rownames(d) <- d$state
# 	dw <- rep.data.frame(d, d$ecvotes)
# 	competitiveECseats <- length(dw$ecvotes[dw$p>0.47 & dw$p<0.53])/ length(dw$ecvotes)
# 	a <- density(dw$p, na.rm = TRUE, from = .4, to = .6)
# 	area <- abs(sum(a$y)*(a$x[1]-a$x[2]))
# 	twec <- sum(d$ecvotes[d$p>.5])/sum(d$ecvotes)
# 	e1 <- density(dw$p, na.rm = TRUE)
# 	plot(density(dw$p, na.rm = TRUE), xlim = c(0,1), ylim = c(0,14), main = year, yaxt = "n")
# 	axis(side = 2, las = 2, cex.axis = 0.85)
# 	mtext(side = 1, line = 2, ifelse(yr %in% c(1960, 2016), "Democratic % of Two-Party Vote", ""), cex = 0.65)

# 	legend("topright", legend = c(paste("Mean ~ ", round(mean(dw$p, na.rm = TRUE), digits = 3)), paste("Median ~ ", round(median(dw$p, na.rm = TRUE), digits = 3)), paste("SD ~ ", round(sd(dw$p, na.rm = TRUE), digits = 3)), paste("Kurtosis ~ ", round(kurtosis(dw$p, na.rm = TRUE), digits = 3)), paste("Skewness ~ ", round(skewness(dw$p, na.rm = TRUE), digits = 3)), paste("EC 47%-53% ~ ", round(competitiveECseats, digits = 3)), paste("Two-Party Popular % ~ ", round(weighted.mean(d$p, d$total, na.rm = TRUE), digits = 3)), paste("Two-Party EC % ~ ", round(twec, digits = 3))), bty = "n", cex = 0.65)
# 	x1 <- min(which(e1$x<.47))

# 	x4 <- min(which(e1$x>.47))
# 	x3 <- max(which(e1$x>.53))
# 	x2 <- min(which(e1$x>.53))
# with(e1, polygon(x = c(x[c(x1,x1:x2,x2)]),  y = c(0, dat[x1:x2], 0), col = "gray70", density = 40, border = NA))
# with(e1, polygon(x = c(x[c(x3,x3:x4,x4)]),  y = c(0, dat[x3:x4], 0), col = "gray70", angle = 135, density = 40, border = NA))
# 	rect(-.1,-1,1.1,0, col = "black", fill = "black")
# 	points(e1, type = "l", add = TRUE)
# 		abline(v = .5, lty = 2, col = "gray40")

# 	}
# 	dev.off()


house.ca <- houseCD[houseCD$year %in% seq(1982, 1990, 2),]
house.ca <- house.ca[house.ca$state %in% "California",]

aggregate((two_party(house.ca$dem,house.ca$rep)), by=list(year=house.ca$year), FUN=length)
aggregate((two_party(house.ca$dem,house.ca$rep)), by=list(year=house.ca$year), FUN=mean)
aggregate((two_party(house.ca$dem,house.ca$rep)), by=list(year=house.ca$year), FUN=function(x) mean(find.winner(x)))


house.az <- houseCD[houseCD$year %in% c("2002","2012"),]
house.az <- house.az[house.az$state %in% "Arizona",]

aggregate((two_party(house.az$dem,house.az$rep)), by=list(year=house.az$year), FUN=length)
aggregate((two_party(house.az$dem,house.az$rep)), by=list(year=house.az$year), FUN=mean)
aggregate((two_party(house.az$dem,house.az$rep)), by=list(year=house.az$year), FUN=function(x) mean(find.winner(x)))


house.pa <- houseCD[houseCD$year %in% c("2016","2018"),]
house.pa <- house.pa[house.pa$state %in% "Pennsylvania",]

aggregate((two_party(house.pa$dem,house.pa$rep)), by=list(year=house.pa$year), FUN=length)
aggregate((two_party(house.pa$dem,house.pa$rep)), by=list(year=house.pa$year), FUN=mean)
aggregate((two_party(house.pa$dem,house.pa$rep)), by=list(year=house.pa$year), FUN=function(x) mean(find.winner(x)))



house.nc <- houseCD[houseCD$year %in% c("2016","2018"),]
house.nc <- house.nc[house.nc$state %in% "North Carolina",]

aggregate((two_party(house.nc$dem,house.nc$rep)), by=list(year=house.nc$year), FUN=length)
aggregate((two_party(house.nc$dem,house.nc$rep)), by=list(year=house.nc$year), FUN=mean)
aggregate((two_party(house.nc$dem,house.nc$rep)), by=list(year=house.nc$year), FUN=function(x) mean(find.winner(x)))



intervention.dta <- read.csv("/Users/user/Google Drive/Projects/Polarization PNAS/figure_sv.csv")
intervention.dta

svg("/Users/user/Downloads/pnas_sv.svg", width=6, height=6)
	par(pty="s", mar=c(4,3,2,1))
	plot(intervention.dta$votes1,intervention.dta$seats1, 
		ylim=c(0.0,1.0), xlim=c(0.0,1.0), type="p", cex=2, pch=19, ylab="Seats", xlab="Votes" , main="", bty="n", axes=F, xaxs="i", yaxs="i")
		axis(side=1, at=seq(0, 1, 0.1), labels=F)
		axis(side=1, at=seq(0, 1, 0.1), labels=paste0(seq(0, 1, 0.1)*100, "%"))
		axis(side=1, at=seq(0, 1, 0.01), labels=F, lwd.ticks=0.2, tck=-0.01)
		axis(side=1, at=seq(0, 1, 0.05), labels=F, lwd.ticks=0.4, tck=-0.02)
		axis(side=2, las=2, at=seq(0,1, 0.1), labels=paste0(seq(0, 1, 0.1)*100, "%"))
		axis(side=2, las=2, at=seq(0,1, 0.01), labels=F, lwd.ticks=0.2, tck=-0.01)
		axis(side=2, las=2, at=seq(0,1, 0.05), labels=F, lwd.ticks=0.4, tck=-0.02)
		abline(v=.5, lty=3, col="#55555555")
		abline(h=.5, lty=3, col="#55555555")
		text(x=intervention.dta$votes1/100, y=intervention.dta$seats1/100, labels=intervention.dta$abv, col="red")
		text(x=intervention.dta$votes2/100, y=intervention.dta$seats2/100, labels=intervention.dta$abv)

		# abline(lm(S.i~V.i))
		plot(function (x) logodds(intervention.dta$seats1/100, intervention.dta$votes1/100), from=0.0, to=1, add=TRUE, lwd=2, col="red")
		plot(function (x) logodds(intervention.dta$seats2/100, intervention.dta$votes2/100), from=0.0, to=1, add=TRUE, lwd=2, col="gray40")
		legend("bottomright", legend=c("Before Intervention", "After Intervention"), col=c("red", "black"), lty=c(1,1))
		# abline(0,1, lty=2, col="gray90")
dev.off()
