##########################################################################################################
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ──╔╦═══╦═╗─╔╦═══╦════╦╗─╔╦═══╦═╗─╔╗
# ──║║╔═╗║║╚╗║║╔═╗║╔╗╔╗║║─║║╔═╗║║╚╗║║
# ──║║║─║║╔╗╚╝║║─║╠╝║║╚╣╚═╝║║─║║╔╗╚╝║
# ╔╗║║║─║║║╚╗║║╚═╝║─║║─║╔═╗║╚═╝║║╚╗║║
# ║╚╝║╚═╝║║─║║║╔═╗║─║║─║║─║║╔═╗║║─║║║
# ╚══╩═══╩╝─╚═╩╝─╚╝─╚╝─╚╝─╚╩╝─╚╩╝─╚═╝
#         ╔═══╦═══╦═══╦╗──╔╦═══╦═══╗
#         ║╔═╗║╔══╣╔═╗║╚╗╔╝║╔═╗║╔═╗║
#         ║║─╚╣╚══╣╚═╝╠╗║║╔╣║─║║╚══╗
#         ║║─╔╣╔══╣╔╗╔╝║╚╝║║╚═╝╠══╗║
#         ║╚═╝║╚══╣║║╚╗╚╗╔╝║╔═╗║╚═╝║
#         ╚═══╩═══╩╝╚═╝─╚╝─╚╝─╚╩═══╝
### Code to Replicate "Are Presidential Inversions Inevitable? Comparing Eight Counterfactual Rules for Electing the U.S. President"
### Social Science Quarterly
### Jonathan R. Cervas, University of California Irvine
### Bernard N. Grofman, University of California Irvine
### Note: View Paper here: https://rdcu.be/bxHJ4
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# Remove all objects just to be safe.
			rm(list=ls(all=TRUE))
##########################################################################################################

setwd("/Users/cervas/Google Drive/School/UCI/Papers/Electoral College")
options(scipen=999) # Turn off Scientific Notation
#_________________________________
#_________ Libraries
#_________________________________
library(maps)
library(stargazer)
#_________________________________
#_________ Functions
#_________________________________
source("https://raw.githubusercontent.com/jcervas/inversions/master/apportion.R")
source("https://raw.githubusercontent.com/jcervas/inversions/master/ECasAPPORTIONMENT.R")

#_________ Find election winners
unc <- function(inp) 0*(inp<0.5)+1*(inp>0.5)
#_________
#_________ Convert decimels to percentages for presentation purposes
per <- function(x, digits=4) {
	paste0(round(x*100, digits=digits), "%")
	}	
# _____ Two-Party Vote Share
two_party <- function(data, dem, rep) data[,dem] / (data[,dem] + data[,rep])

# ______ Cube-Root of the Population
cube_root <- function(pop) {
	floor(sum(pop)^(1/3))
	}
# EQUATIONS
#__________________________________________________________
Popular_Vote <- function(data, dem, rep) {
	sum(data[,dem])/sum(data[,dem]+data[,rep])
	}
	
Electoral_College <- function(data, dem, ecvotes, add.seats = 0) {
	sum(unc(data[,dem]) * (data[,ecvotes] + add.seats))/(sum(data[,ecvotes] + add.seats))
	}

Population_Unit <-  function(data, dem, pop) {
	sum(unc(data[,dem]) * (data[,pop]/sum(data[,pop])))
	}

Whole_Number_Proportional <- function(data, add.seats=0) {
	w <- ec_apportionment(data=data, add.seats = add.seats)
	w$democrat / (w$democrat + w$republican)
	}
	
Fractional_Porportional <- function(data, dem, rep, ecvotes, add.seats=0) {
	round(sum(two_party(data, dem, rep) * (data[,ecvotes] + add.seats)) / sum(data[,ecvotes] + add.seats), digits=5)
	}
	
# District_Specific <- 


#_________
# Read Data
trends <- read.csv("https://raw.githubusercontent.com/jcervas/inversions/master/EC_googleTrends.csv")
	trends$Month <- as.Date(paste0(as.character(trends$Month), "-01"))
	trends$x <- 1:length(trends$Month)
#_________________________________
#_________ Election Data Set-up 
#_________________________________
yearlist <- seq(1868,2016, by=4) 	#Election Years
year.list <- seq(1790, 2010, by = 10) 	#Apportionment Years
electiondata <- list()
greycol <- rgb(red = 190, green = 190, blue = 190, alpha = 170, maxColorValue = 255)
returns <- runif(100)
# state.fips <- read.table("state-fips.txt", header=TRUE, sep="", stringsAsFactors=FALSE)
# state.fips$state[state.fips$state=="district of columbia"] <- "d. c."

aves <- data.frame(Year= yearlist, Votes = NA, Seats = NA)
ec <- read.csv("https://raw.githubusercontent.com/jcervas/inversions/master/Historical.csv", header=TRUE)
pres.cd <- read.csv("https://raw.githubusercontent.com/jcervas/inversions/master/FINAL%20Pres%20by%20CD.csv")

#_________________________________
#_________ Set-up
#_________________________________
pop <- read.csv("https://raw.githubusercontent.com/jcervas/inversions/master/HistoricPopulationsStates.csv", header=TRUE) # Population at Census Year

for (j in 1:length(yearlist)) {
					
year <- yearlist[j]

dat <- read.csv(paste0("https://raw.githubusercontent.com/jcervas/inversions/master/data/", year, ".csv"), header=TRUE ,  stringsAsFactors=FALSE) # Dave Leip US Election Atlas
# dat <- merge(dat, state.fips, by="state")
# dat$fips <- factor(dat$fips, labels=dat$state)

if(substr(year,(nchar(year)+1)-1,nchar(year))=="0"){popy <- year-10}
if(substr(year,(nchar(year)+1)-1,nchar(year))=="2"){popy <- round(year, digits=-1)-10}
if(substr(year,(nchar(year)+1)-1,nchar(year))=="4"){popy <- round(year, digits=-1)}
if(substr(year,(nchar(year)+1)-1,nchar(year))=="6"){popy <- round(year-10, digits=-1)}
if(substr(year,(nchar(year)+1)-1,nchar(year))=="8"){popy <- round(year-10, digits=-1)}

popyear <- paste0("X",round(popy, digits=-1))
popyear_plusTEN <- paste0("X",popy+10)

ifelse (year < 2011,dat <- 
	merge(dat, pop[, c("state", c(popyear,popyear_plusTEN))], by="state", all.x=TRUE),
	dat <- merge(dat, pop[, c("state", c(popyear))], by="state", all.x=TRUE))
colnames(dat)[colnames(dat)==popyear] <- "pop"
colnames(dat)[colnames(dat)==popyear_plusTEN] <- "popplusten"
dat$pop[is.na(dat$pop)] <- dat$popplusten[is.na(dat$pop)]
dat$house <- dat$ecvotes-2
dat$total <- (dat$dem + dat$rep)
dat$pctdem <- dat$dem/dat$total

dat$demwin <-  1 * (dat$dem>dat$rep)
 
dat$year <- year
electiondata[[j]] <- dat


aves[j,"Votes"] <- sum(dat$dem)/sum(dat$total)
aves[j,"Seats"] <- sum(dat$demwin*dat$ecvotes)/sum(dat$ecvotes)
rownames(aves) <- yearlist


cat("\n", "Year: ", year, "\n", "Popular Vote: ", per(Popular_Vote(electiondata[[j]], "dem", "rep")),"\n",  "Electoral College:", per(sum(electiondata[[j]]$ecvotes[dat$demwin==1]/sum(electiondata[[j]]$ecvotes))), "\n _________________________________ \n")
}


paste(cat("Currenty Working Directory: \n"),getwd())

#_________________________________
#_________ END DATA SETUP
#_________________________________





#_________________________________
#_________ START ANALYSIS
#_________________________________
	ectotals <- list()
	cubetotals <- list()
for (i in 1:length(yearlist)) {
	year <- yearlist[i]
	e <- electiondata[[i]]

	wholenum_apportion <- ec_apportionment(data=e, autoseats=0)
	wholenum_apportion.house <- ec_apportionment(e, autoseats=-2)

#_________________________________
#_________ Apportion by CubeRoot
#_________________________________
f <- merge(e, apportion(e,"state","pop", cube_root(e$pop), autoseats=1), "state")
cube_root_wo_twoseat <- Electoral_College(f, "pctdem", "seats", add.seats = 0)
cube_root_w_twoseat <- Electoral_College(f, "pctdem", "seats", add.seats = 2)

cube_wholenum_apportion <- ec_apportionment(f, seats="seats", autoseats=2)
cube_wholenum_apportion.house <- ec_apportionment(f, seats="seats", autoseats=0)
	
	
cubetotals[[i]] <- list(
	Cube_EC_Apportionment = cube_root(f$pop)+(2*length(f$seats)),
	EC_Apportionment = sum(f$ecvotes),
	Popular_Vote = per(Popular_Vote(e, "dem", "rep"), digits=3),
	Electoral_College = per(Electoral_College(e, "pctdem", "ecvotes", add.seats=0), digits=3),			Cube_Root_Electoral_College = per(Electoral_College(f, "pctdem", "seats", add.seats=0), digits=3),
	Cube_Root_Whole_Number_Proportionality_with_Two_Seat = per(cube_wholenum_apportion$democrat / (cube_wholenum_apportion$democrat + cube_wholenum_apportion$republican), digits=3),
	Cube_Root_Whole_Number_Proportionality_without_Two_Seat = per(cube_wholenum_apportion.house$democrat / (cube_wholenum_apportion.house$democrat +  cube_wholenum_apportion.house$republican), digits=3),
	Cube_Root_Fractional_Proportionality_with_Two_Seat = per(Fractional_Porportional(f, "dem", "rep", "seats", add.seats=0)),
	Cube_Root_Fractional_Proportionality_without_Two_Seat = per(Fractional_Porportional(f, "dem", "rep", "seats", add.seats=-2))
	)
### Table - 
# EC Under different Roles
ectotals[[i]] <- list(
	Popular_Vote = per(Popular_Vote(e, "dem", "rep"), digits=3),
	Electoral_College = per(Electoral_College(e, "pctdem", "ecvotes", add.seats=0), digits=3), 
	Electoral_College_without_Two_Seat = per(Electoral_College(e, "pctdem", "ecvotes", add.seats=-2), digits=3),
	Population_Weighted_State_Unit = per(sum(unc(e$pctdem) * (e$pop/sum(e$pop))), digits=3),
	
	Whole_Number_Proportionality_with_Two_Seat = per(wholenum_apportion$democrat/(wholenum_apportion$democrat + 	wholenum_apportion$republican), digits=3),
	Whole_Number_Proportionality_without_Two_Seat = per(wholenum_apportion.house$democrat/(wholenum_apportion.house$democrat + wholenum_apportion.house$republican), digits=3),
	Fractional_Proportionality_with_Two_Seat = per(Fractional_Porportional(e, "dem", "rep", "ecvotes", add.seats=0), digits=3),
	Fractional_Proportionality_without_Two_Seat = per(Fractional_Porportional(e, "dem", "rep", "ecvotes", add.seats=-2), digits=3),
	District_Specific_with_Two_Seat = NA,
	District_Specific_without_Two_Seat = NA #,
	# Cube_Root_EC_with_Two_Seat = per(cube_root_w_twoseat, digits=3),
	# Cube_Root_EC_without_Two_Seat = per(cube_root_wo_twoseat, digits=3)
)

}
names(ectotals) <- yearlist
names(cubetotals) <- yearlist

cubetotals <- do.call(rbind.data.frame, cubetotals)
	cubetotals$Cube_EC_Apportionment - cubetotals$EC_Apportionment

#_________________________________
#_________ House District Specific
#_________________________________

year.cd <- unique(pres.cd$year)
pres.cd$dem[is.na(pres.cd$dem)] <- 0
pres.cd$rep[is.na(pres.cd$rep)] <- 0
cd.ecvotes <- data.frame(year=year.cd, CDECvotes=NA, ECTotal=NA, percent=NA, cd_no_bonus=NA, cdno_bonus_per=NA)
cd_specific <- list()
for (i in 1:length(year.cd)) {
	year <- year.cd[i]
	cd <- pres.cd[pres.cd$year==year,]
	dc <- data.frame(abv="DC", icpsr=55, state="DISTRICT OF COLUMBIA", district=1, year=year, rep=0, dem=1, other=0 , total=1 )
	a <- ifelse(year<2016, cd <- rbind(cd, dc) , cd)
	cd$demwin <- 1 * (cd$dem>cd$rep)
	cd$totalseats <- 1
	
	dem <- aggregate(cd$dem , list(cd$st), sum)
	rep <- aggregate(cd$rep , list(cd$st), sum)
	st <- data.frame(st=dem[,1],dem=dem[,2], rep=rep[,2], ecvotes= 2* (dem[,2]>rep[,2]), totalseats=2)
	
## - CD Specific with Two Seat Bonus 
cd_w_twoseat <-  per((sum(cd$demwin, na.rm=TRUE) + sum(st$ecvotes, na.rm=TRUE)) /(sum(st$totalseats, na.rm=TRUE) + sum(cd$totalseats, na.rm=TRUE)), digits=3)

## - CD Specific without Two Seat Bonus 
cd_wo_twoseat <- per(sum(cd$demwin, na.rm=TRUE)  / ( sum(cd$totalseats, na.rm=TRUE)), digits=3)

cd_specific[[i]] <- 	list(
	cd_w_twoseat = cd_w_twoseat,
	cd_wo_twoseat= cd_wo_twoseat
	)
	

	
	cd.ecvotes[i,2] <- sum(cd$demwin, na.rm=TRUE) + sum(st$ecvotes, na.rm=TRUE)
	cd.ecvotes[i,3] <- sum(st$totalseats, na.rm=TRUE) + sum(cd$totalseats, na.rm=TRUE)
	
	#House district-specific allocation rule with 2 seat bonus (B, Ib)
	cd.ecvotes[i,4] <- (sum(cd$demwin, na.rm=TRUE) + sum(st$ecvotes, na.rm=TRUE)) /(sum(st$totalseats, na.rm=TRUE) + sum(cd$totalseats, na.rm=TRUE)) 	
	
	cd.ecvotes[i,5] <- sum(cd$demwin, na.rm=TRUE)
	cd.ecvotes[i,6] <- sum(cd$demwin, na.rm=TRUE)  / (sum(cd$totalseats, na.rm=TRUE)) #House district-specific allocation rule without 2 seat bonus (B, IIb)


ectotals[[as.character(year)]]$District_Specific_with_Two_Seat <- cd_w_twoseat
ectotals[[as.character(year)]]$District_Specific_without_Two_Seat <- cd_wo_twoseat	
}
names(cd_specific) <- year.cd
do.call(rbind.data.frame, cd_specific)
cd.ecvotes

#_________________________________
#_________ TABLE
#_________________________________
stargazer(do.call(rbind.data.frame, ectotals), summary=F)
stargazer(do.call(rbind.data.frame, cubetotals), summary=F)



#____ Figure - Google Trends _________
svg("/Users/cervas/Downloads/googletrends.svg", width=12, height=6)
par(mfrow=c(1,1),
	mar=c(3,3,.25,.25))
plot(x=trends$x, y=trends$EC, type="l", main="", xlab="", ylab="", ylim=c(0,110), xlim=c(1,176), log="", xaxt="n", yaxt="n", bty="L", yaxs="i", , xaxs="i")
	mtext(side=2, 
		line=2, 
		"Interest over time", 
		cex=1,
		font=2)
	abline(h=seq(0,100,10), lty=3, col="gray90")
elections_x <- c(11, 59, 107, 155)
abline(v= elections_x, col="gray40", lty=3)
lines(x=trends$x, y=trends$EC)
axis(side=1, 
	at= c(1, 13, 25, 37, 49, 61, 73, 85, 97, 109, 121, 133, 145, 157, 169), 
	labels=seq(2004,2018, 1), 
	cex.axis=1,
	font=2, 
	padj=-1, 
	tcl=-0.2)
axis(side=2, at=seq(0,100,20), labels=T, cex.axis=0.65, tcl=-0.2, las=2)
axis(side=2, at=seq(0,100,10), labels=F, cex.axis=0.65, tcl=-0.1)

y <- trends$EC
x <- trends$x
polygon(c(x,rev(x)),c(y, rep(0,length(x))), col="#999999")

xleft <- -10
xright <- 190
ytop <- 1
ybottom <- -10	
#Restricted area
x <- rbind(rep.int(NA, 1), xleft, xright, xright, xleft)[-1L]
y <- rbind(rep.int(NA, 1), ybottom, ybottom, ytop, ytop)[-1L]	
		polygon(x,y, col = "black",  border = "transparent")

arrows(65, 70, 60, 80, length = 0.2, col='black')
text(79,70, "Election Day")
dev.off()