##########################################################################################################
##########################################################################################################
##########################################################################################################
##########################################################################################################
### Code to Replicate "Why noncompetitive states are so important for understanding the outcomes of competitive elections: the Electoral College 1868-2016"
### Accepted - Public Choice
### Jonathan R. Cervas, University of California Irvine
### Bernard N. Grofman, University of California Irvine
### Notes: 
### 1960 and 1976 have too many coalitons to calculate when we go to +-5%, so they are excluded.  
### All calulations are done by taking the two-party vote, ie, DEM/(DEM+REP) or (REP/DEM+REP).
### Running funtction to get Winningness and other B+K calculations takes a long time, so they are commented out and just imports data from CSV for further calculations.
##########################################################################################################
##########################################################################################################
### Remove all objects just to be safe.
			rm(list=ls(all=TRUE))

setwd("/Users/cervas/Google Drive/Papers/Non Competitive Electors")
options(scipen=999) # Turn off Scientific Notation
##########################################################################################################
########### - Libraries - ###########
##########################################################################################################
library(stargazer)

##########################################################################################################
######### - Functions - ############
##########################################################################################################
source("https://raw.githubusercontent.com/jcervas/Non-Competitive-Advantage/master/winningness.R")

##########################################################################################################
######### - Read in Data from internet - ############
##########################################################################################################
		cat(paste("\n", "********** Read in Brams-Kilgour Replication Data [+/-3%]", "**********", "\n")) 
	bramskilgour.plusminus3 <- read.csv("https://raw.githubusercontent.com/jcervas/Non-Competitive-Advantage/master/bramskilgourplusminus3.csv")
		cat(paste("\n", "********** Read in Brams-Kilgour Replication Data [+/-5%]", "**********", "\n")) 
	bramskilgour.plusminus5 <- read.csv("https://raw.githubusercontent.com/jcervas/Non-Competitive-Advantage/master/bramskilgourplusminus5.csv")
		cat(paste("\n", "********** Read in Presidential Election Data", "**********", "\n")) 
	d <- read.csv("https://raw.githubusercontent.com/jcervas/Non-Competitive-Advantage/master/Presidential_Election_General_Two_Party.csv")
##########################################################################################################
########## - Election Data Set-up - ############
##########################################################################################################
	 d$tptotal <- d$dem+d$rep
	 d$pctREP <- d$rep/d$tptotal
	 d$pctDEM <- d$dem/d$tptotal
d <- d[d$year>1867,] 
uniqueyr <- unique(d$year)

##########################################################################################################
########## - Non-Competitive Summary - ###############
##########################################################################################################	 
ptm <- proc.time()
bramskilgour <- numeric(0)
competitive.low <- 0.47
competitive.high <- 0.53

summary.plusminus3 <- 
	data.frame(Year=uniqueyr, 
	Total.States=NA, 
	Total.ECvotes=NA, 
	Safe.Republican.States=NA, 
	Safe.Democratic.States=NA, 
	Competitive.States=NA, 
	Safe.Republican.ECvotes=NA, 
	Safe.Democratic.ECvotes=NA, 
	Competitive.ECvotes=NA, 
	Rep.Competitive.Wins=NA, 
	Dem.Competitive.Wins=NA, 
	Rep.Total.ECwins =NA, 
	Dem.Total.ECwins =NA)	 

correlate3independence <- 
	data.frame(Year=uniqueyr, 
	Rep.st.NonCompetitive=NA, 
	Rep.st.Competitive=NA, 
	Rep.EC.NonCompetitive=NA, 
	Rep.EC.Competitive=NA)
	
		 
for (yr in uniqueyr){
	e <- d[d$year==yr,]
		noncompet <- e[(e$pctREP > competitive.high | e$pctREP < competitive.low) & !is.na(e$pctREP),]
		compet <- e[e$pctREP > competitive.low & e$pctREP < competitive.high & !is.na(e$pctREP),]

noncompetitive <- 
	data.frame(
	state=NA, 
	pctREP=NA, 
	ecvotes=NA)
	
competitive <- 
	data.frame(state=NA, 
	pctREP=NA, 
	ecvotes=NA)	


noncompetitive[1:length(noncompet$state),1] <- noncompet$state
noncompetitive[1:length(noncompet$state),2] <- noncompet$pctREP
noncompetitive[1:length(noncompet$state),3] <- noncompet$ecvotes
noncompetitive$s <- 1

competitive[1:length(compet$state),1] <- compet$state
competitive[1:length(compet$state),2] <- compet$pctREP
competitive[1:length(compet$state),3] <- compet$ecvotes
competitive$s <- 1	


summary.plusminus3[summary.plusminus3$Year==yr,"Total.States"] <- sum(competitive$s) + sum(noncompetitive$s)
summary.plusminus3[summary.plusminus3$Year==yr,"Total.ECvotes"] <- sum(competitive$s * competitive$ecvotes) + sum(noncompetitive$s * noncompetitive$ecvotes)
summary.plusminus3[summary.plusminus3$Year==yr,"Competitive.States"] <- sum(competitive$s)
summary.plusminus3[summary.plusminus3$Year==yr,"Competitive.ECvotes"] <- sum(competitive$s * competitive$ecvotes)
summary.plusminus3[summary.plusminus3$Year==yr,"Dem.Competitive.Wins"] <- sum(competitive$ecvotes[competitive$pctREP<.5])
summary.plusminus3[summary.plusminus3$Year==yr,"Rep.Competitive.Wins"] <- sum(competitive$ecvotes[competitive$pctREP>.5])

summary.plusminus3[summary.plusminus3$Year==yr,"Safe.Republican.States"] <- sum(noncompetitive$s[noncompetitive$pctREP>.5])
summary.plusminus3[summary.plusminus3$Year==yr,"Safe.Democratic.States"] <- sum(noncompetitive$s[noncompetitive$pctREP<.5])
summary.plusminus3[summary.plusminus3$Year==yr,"Safe.Republican.ECvotes"] <- sum(noncompetitive$ecvotes[noncompetitive$pctREP>.5])
summary.plusminus3[summary.plusminus3$Year==yr,"Safe.Democratic.ECvotes"] <- sum(noncompetitive$ecvotes[noncompetitive$pctREP<.5])
summary.plusminus3[summary.plusminus3$Year==yr,"Rep.Total.ECwins"] <- sum(e$ecvotes[e$pctREP>.5])
summary.plusminus3[summary.plusminus3$Year==yr,"Dem.Total.ECwins"] <- sum(e$ecvotes[e$pctREP<.5])
# write.csv(summary.plusminus3, "summary.plusminus3.csv", row.names=FALSE)
####### - Run this to generate +-3% numbers	
# # # winning <- numeric(0) # Place holder for quicker run times
# # # winning <- winningness(e, "ecvotes", "pctDEM", "pctREP",competitive.high, competitive.low) 
# # # bramskilgour <- rbind(bramskilgour,winning)

####### - Correlating Republican share of victories and Republican share of EC seat in Competitive and Non-Competitive States
correlate3independence[correlate3independence$Year==yr,"Rep.st.NonCompetitive"] <- sum(noncompetitive$s[noncompetitive$pctREP>.5])/sum(noncompetitive$s)
correlate3independence[correlate3independence$Year==yr,"Rep.st.Competitive"] <- sum(competitive$s[competitive$pctREP>.5])/sum(noncompetitive$s)
correlate3independence[correlate3independence$Year==yr,"Rep.EC.NonCompetitive"] <- sum(noncompetitive$ecvotes[noncompetitive$pctREP>.5])/sum(noncompetitive$ecvotes)
correlate3independence[correlate3independence$Year==yr,"Rep.EC.Competitive"] <- sum(competitive$ecvotes[competitive$pctREP>.5])/sum(competitive$ecvotes)
}
# # # write.csv(bramskilgour, "bramskilgourplusminus3.csv", row.names=FALSE)
proc.time() - ptm

##########################################################################################################
cat(paste("########################################################################################################## \n","***** Correlation tests", "\n"))
cat(paste("***** Correlation tests", "\n")) ##############################
	 cor.test(correlate3independence[,"Rep.st.NonCompetitive"],correlate3independence[,"Rep.st.Competitive"])
	 cor.test(correlate3independence[,"Rep.EC.NonCompetitive"],correlate3independence[,"Rep.EC.Competitive"]) 
	 
	 
##########################################################################################################
########## - Sensitivity Analysis +-5% - #################################################################
##########################################################################################################	 
	 competitive.low <- 0.45
	 competitive.high <- 0.55
	 
	 summary.plusminus5 <- 
	 	data.frame(Year=uniqueyr, 
	 	Total.States=NA, 
	 	Total.ECvotes=NA, 
	 	Safe.Republican.States=NA, 
	 	Safe.Democratic.States=NA, 
	 	Competitive.States=NA, 
	 	Safe.Republican.ECvotes=NA, 
	 	Safe.Democratic.ECvotes=NA, 
	 	Competitive.ECvotes=NA, 
	 	Rep.Competitive.Wins=NA, 
	 	Dem.Competitive.Wins=NA, 
	 	Rep.Total.ECwins =NA, 
	 	Dem.Total.ECwins =NA)
	 		 
	summary.plusminus5 <- 
		data.frame(Year=uniqueyr, 
		Total.States=NA, 
		Total.ECvotes=NA, 
		Safe.Republican.States=NA, 
		Safe.Democratic.States=NA, 
		Competitive.States=NA, 
		Safe.Republican.ECvotes=NA, 
		Safe.Democratic.ECvotes=NA, 
		Competitive.ECvotes=NA, 
		Rep.Competitive.Wins=NA, 
		Dem.Competitive.Wins=NA, 
		Rep.Total.ECwins =NA, 
		Dem.Total.ECwins =NA)	
		
		
 uniqueyr <- seq(1868,2016, 4)
for (yr in uniqueyr) {
	e <- d[d$year == yr, ]

	noncompet <- e[(e$pctREP > competitive.high | e$pctREP < competitive.low) & !is.na(e$pctREP), ]
	compet <- e[e$pctREP > competitive.low & e$pctREP < competitive.high & !is.na(e$pctREP), ]

	noncompetitive2 <- data.frame(state = noncompet$state, pctREP = NA, ecvotes = NA, s = 1)
	competitive2 <- data.frame(state = compet$state, pctREP = NA, ecvotes = NA, s = 1)

	noncompetitive2[1:length(noncompet$state), 1] <- noncompet$state
	noncompetitive2[1:length(noncompet$state), 2] <- noncompet$pctREP
	noncompetitive2[1:length(noncompet$state), 3] <- noncompet$ecvotes

	competitive2[1:length(compet$state), 1] <- compet$state
	competitive2[1:length(compet$state), 2] <- compet$pctREP
	competitive2[1:length(compet$state), 3] <- compet$ecvotes

	summary.plusminus5[summary.plusminus5$Year == yr, "Total.States"] <- sum(competitive2$s) + sum(noncompetitive2$s)
	summary.plusminus5[summary.plusminus5$Year == yr, "Total.ECvotes"] <- sum(competitive2$s * competitive2$ecvotes) + sum(noncompetitive2$s * 
		noncompetitive2$ecvotes)
	summary.plusminus5[summary.plusminus5$Year == yr, "Competitive.States"] <- sum(competitive2$s)
	summary.plusminus5[summary.plusminus5$Year == yr, "Competitive.ECvotes"] <- sum(competitive2$s * competitive2$ecvotes)
	summary.plusminus5[summary.plusminus5$Year == yr, "Dem.Competitive.Wins"] <- sum(competitive2$ecvotes[competitive2$pctREP < 0.5])
	summary.plusminus5[summary.plusminus5$Year == yr, "Rep.Competitive.Wins"] <- sum(competitive2$ecvotes[competitive2$pctREP > 0.5])

	summary.plusminus5[summary.plusminus5$Year == yr, "Safe.Republican.States"] <- sum(noncompetitive2$s[noncompetitive2$pctREP > 0.5])
	summary.plusminus5[summary.plusminus5$Year == yr, "Safe.Democratic.States"] <- sum(noncompetitive2$s[noncompetitive2$pctREP < 0.5])
	summary.plusminus5[summary.plusminus5$Year == yr, "Safe.Republican.ECvotes"] <- sum(noncompetitive2$ecvotes[noncompetitive2$pctREP > 0.5])
	summary.plusminus5[summary.plusminus5$Year == yr, "Safe.Democratic.ECvotes"] <- sum(noncompetitive2$ecvotes[noncompetitive2$pctREP < 0.5])
	summary.plusminus5[summary.plusminus5$Year == yr, "Rep.Total.ECwins"] <- sum(e$ecvotes[e$pctREP > 0.5])
	summary.plusminus5[summary.plusminus5$Year == yr, "Dem.Total.ECwins"] <- sum(e$ecvotes[e$pctREP < 0.5])
	####### - Run this to generate +-5% numbers	
	# # # winning10 <- numeric(0) # Place holder for quicker run times
# # # winning10 <- winningness(e, "ecvotes", "pctDEM", "pctREP", competitive.high, competitive.low) 
# # # bramskilgour.plusminus5 <- rbind(bramskilgour.plusminus5,winning10)
} 
# # # write.csv(bramskilgour.plusminus5, "bramskilgour.plusminus5.csv")

##########################################################################################################
########## - Sensitivity Analysis +/- 1.5% - ####################################################################
##########################################################################################################	 
	 competitive.low <- 0.485
	 competitive.high <- 0.515
	 bramskilgour.plusminus1.5 <- numeric(0)
	 summary.plusminus1.5 <- 
	 	data.frame(Year = uniqueyr, 
	 	Total.States = NA, 
	 	Total.ECvotes = NA, 
	 	Safe.Republican.States = NA, 
	 	Safe.Democratic.States = NA, 
	 	Competitive.States = NA, 
	 	Safe.Republican.ECvotes = NA, 
	 	Safe.Democratic.ECvotes = NA, 
	 	Competitive.ECvotes = NA, 
	 	Rep.Competitive.Wins = NA, 
	 	Dem.Competitive.Wins = NA, 
	 	Rep.Total.ECwins = NA, 
	 	Dem.Total.ECwins = NA)
	 	
	 summary.plusminus1.5 <- 
	 	data.frame(Year = uniqueyr, 
	 	Total.States = NA, 
	 	Total.ECvotes = NA, 
	 	Safe.Republican.States = NA, 
	 	Safe.Democratic.States = NA, 
	 	Competitive.States = NA, 
	 	Safe.Republican.ECvotes = NA, 
	 	Safe.Democratic.ECvotes = NA, 
	 	Competitive.ECvotes = NA, 
	 	Rep.Competitive.Wins = NA, 
	 	Dem.Competitive.Wins = NA, 
	 	Rep.Total.ECwins = NA, 
	 	Dem.Total.ECwins = NA)	
	 	
 uniqueyr <- seq(1868, 2016, 4)
 for (yr in uniqueyr) {
 	e <- d[d$year == yr, ]
 	is.competitive <- ifelse(e$pctREP > competitive.low & e$pctREP < competitive.high & !is.na(e$pctREP), is.competitive <- 1, is.competitive <- 0)

 	if (sum(is.competitive) < 1) {
 		summary.plusminus1.5[summary.plusminus1.5$Year == yr, ] <- 0
 	}
 	if (sum(is.competitive) < 1) {
 		next
 	}
 	noncompet <- e[(e$pctREP > competitive.high | e$pctREP < competitive.low) & !is.na(e$pctREP), ]
 	compet <- e[e$pctREP > competitive.low & e$pctREP < competitive.high & !is.na(e$pctREP), ]

 	noncompetitive2 <- 
 		data.frame(state = noncompet$state, 
 		pctREP = NA, 
 		ecvotes = NA, 
 		s = 1)
 	competitive2 <- 
 		data.frame(state = compet$state, 
 		pctREP = NA, 
 		ecvotes = NA, 
 		s = 1)

 	noncompetitive2[1:length(noncompet$state), 1] <- noncompet$state
 	noncompetitive2[1:length(noncompet$state), 2] <- noncompet$pctREP
 	noncompetitive2[1:length(noncompet$state), 3] <- noncompet$ecvotes

 	competitive2[1:length(compet$state), 1] <- compet$state
 	competitive2[1:length(compet$state), 2] <- compet$pctREP
 	competitive2[1:length(compet$state), 3] <- compet$ecvotes

 	summary.plusminus1.5[summary.plusminus1.5$Year == yr, "Total.States"] <- sum(competitive2$s) + sum(noncompetitive2$s)
 	summary.plusminus1.5[summary.plusminus1.5$Year == yr, "Total.ECvotes"] <- sum(competitive2$s * competitive2$ecvotes) + sum(noncompetitive2$s * 
 		noncompetitive2$ecvotes)
 	summary.plusminus1.5[summary.plusminus1.5$Year == yr, "Competitive.States"] <- sum(competitive2$s)
 	summary.plusminus1.5[summary.plusminus1.5$Year == yr, "Competitive.ECvotes"] <- sum(competitive2$s * competitive2$ecvotes)
 	summary.plusminus1.5[summary.plusminus1.5$Year == yr, "Dem.Competitive.Wins"] <- sum(competitive2$ecvotes[competitive2$pctREP < 0.5])
 	summary.plusminus1.5[summary.plusminus1.5$Year == yr, "Rep.Competitive.Wins"] <- sum(competitive2$ecvotes[competitive2$pctREP > 0.5])

 	summary.plusminus1.5[summary.plusminus1.5$Year == yr, "Safe.Republican.States"] <- sum(noncompetitive2$s[noncompetitive2$pctREP > 0.5])
 	summary.plusminus1.5[summary.plusminus1.5$Year == yr, "Safe.Democratic.States"] <- sum(noncompetitive2$s[noncompetitive2$pctREP < 0.5])
 	summary.plusminus1.5[summary.plusminus1.5$Year == yr, "Safe.Republican.ECvotes"] <- sum(noncompetitive2$ecvotes[noncompetitive2$pctREP > 0.5])
 	summary.plusminus1.5[summary.plusminus1.5$Year == yr, "Safe.Democratic.ECvotes"] <- sum(noncompetitive2$ecvotes[noncompetitive2$pctREP < 0.5])
 	summary.plusminus1.5[summary.plusminus1.5$Year == yr, "Rep.Total.ECwins"] <- sum(e$ecvotes[e$pctREP > 0.5])
 	summary.plusminus1.5[summary.plusminus1.5$Year == yr, "Dem.Total.ECwins"] <- sum(e$ecvotes[e$pctREP < 0.5])

 	####### - Run this to generate +-5% numbers	
 	winning1.5 <- numeric(0) # Place holder for quicker run times
 	winning1.5 <- winningness(e, "ecvotes", "pctDEM", "pctREP", competitive.high, competitive.low)
 	bramskilgour.plusminus1.5 <- rbind(bramskilgour.plusminus1.5, winning1.5)
 }

cat(paste("***** Brams-Kilgour Replication Data [+/-1.5%]", "\n")) ##############################
summary.plusminus1.5 <- summary.plusminus1.5[!(summary.plusminus1.5$Year==0),]



		cat(paste("\n", "##########################################################################################################
", "********** Comparing new data to B-K", "**********", "\n", "##########################################################################################################")) 
####### - Select years to compare to B&K
	 shortyr <- c(2000, 2004, 2008, 2012, 2016)
summary.plusminus3.short <- summary.plusminus3[summary.plusminus3$Year %in% shortyr,]
summary.plusminus5.short <- summary.plusminus5[summary.plusminus5$Year %in% shortyr,]
bramskilgour.3.short <- bramskilgour.plusminus3[bramskilgour.plusminus3[,"year"] %in% shortyr,]
bramskilgour.5.short <- bramskilgour.plusminus5[bramskilgour.plusminus5[,"year"] %in% shortyr,]

short.summary <- data.frame(
	CompetitiveStates = 
		cbind(summary.plusminus3.short[,"Competitive.States"], 
		summary.plusminus5.short[,"Competitive.States"]),
	CompetitiveECvotes = 
		cbind(summary.plusminus3.short[,"Competitive.ECvotes"], 
		summary.plusminus5.short[,"Competitive.ECvotes"]),
	DiffNonCompetitiveEC = 
		cbind(summary.plusminus3.short[,"Safe.Republican.ECvotes"] - summary.plusminus3.short[,"Safe.Democratic.ECvotes"], 
		summary.plusminus5.short[,"Safe.Republican.ECvotes"] - summary.plusminus5.short[,"Safe.Democratic.ECvotes"]),
	R.Winningness = 
		cbind(bramskilgour.3.short[,"winningness"], 
		bramskilgour.5.short[,"winningness"]),
	D.Winningness = 
		cbind(bramskilgour.3.short[,"winningness.1"], 
		bramskilgour.5.short[,"winningness.1"]),
	R.Vulnerability = 
		cbind(bramskilgour.3.short[,"vulnerability"], 
		bramskilgour.5.short[,"vulnerability"]),
	R.Fragility = 
		cbind(bramskilgour.3.short[,"fragility"], 
		bramskilgour.5.short[,"fragility"]),
	D.Vulnerability = 
		cbind(bramskilgour.3.short[,"vulnerability.1"], 
		bramskilgour.5.short[,"vulnerability.1"]),
	D.Fragility = 
		cbind(bramskilgour.3.short[,"fragility.1"], 
		bramskilgour.5.short[,"fragility.1"]),
	ECOutcomeREP = summary.plusminus3.short[, "Rep.Total.ECwins"]/ summary.plusminus3.short[, "Total.ECvotes"]
)

	 bramskilgour.plusminus3$rep.ec.outcome <- summary.plusminus3[, "Rep.Total.ECwins"]/ summary.plusminus3[, "Total.ECvotes"]
	 
	 
		 ### Matching Winningness with Actual EC Outcomes
		 noncompetediff <- summary.plusminus3[,"Safe.Republican.ECvotes"] - summary.plusminus3[,"Safe.Democratic.ECvotes"]
		noncompete_winning <- 
			cbind(ifelse(noncompetediff > 0,1,0), 
			ifelse(bramskilgour.plusminus3[,"rep.ec.outcome"]>0.5, 1, 0))
	 	match <- ifelse(noncompete_winning[,1]== noncompete_winning[,2], 1, 0)
	 	
	 	data.frame(Year=uniqueyr, Match=match, SafeRepEC=summary.plusminus3[,"Safe.Republican.ECvotes"], SafeDemEC=summary.plusminus3[,"Safe.Democratic.ECvotes"])
	 winningness_winning <- cbind(ifelse(bramskilgour.plusminus3[,"winningness"]>0.5,1,0), ifelse(bramskilgour.plusminus3[,"rep.ec.outcome"]>0.5,1,0))
	 match2 <- ifelse(winningness_winning[,1]== winningness_winning[,2], 1, 0)
cbind(uniqueyr, match2)
	 
	 
		 ### Matching Winningness with Actual EC Outcomes: +-5%
	 bramskilgour.plusminus5$rep.ec.outcome <- summary.plusminus5[, "Rep.Total.ECwins"]/ summary.plusminus5[, "Total.ECvotes"]
		 noncompetediff5 <- summary.plusminus5[,"Safe.Republican.ECvotes"] - summary.plusminus5[,"Safe.Democratic.ECvotes"]
		noncompete_winning5 <- cbind(ifelse(noncompetediff5 > 0,1,0), ifelse(bramskilgour.plusminus5[,"rep.ec.outcome"]>0.5,1,0))
	 	match5 <- ifelse(noncompete_winning5[,1]== noncompete_winning5[,2], 1, 0)
	 	cbind(uniqueyr, match5, summary.plusminus5[,"Safe.Republican.ECvotes"], summary.plusminus5[,"Safe.Democratic.ECvotes"])
	 winningness_winning5 <- cbind(ifelse(bramskilgour.plusminus5[,"winningness"]>0.5,1,0), ifelse(bramskilgour.plusminus5[,"rep.ec.outcome"]>0.5,1,0))
	 match5 <- ifelse(winningness_winning5[,1]== winningness_winning5[,2], 1, 0)
cbind(uniqueyr, match5)

		 ### Matching Winningness with Actual EC Outcomes: +- 1.5%
	 bramskilgour.plusminus1.5$rep.ec.outcome <- summary.plusminus1.5[, "Rep.Total.ECwins"]/ summary.plusminus1.5[, "Total.ECvotes"]
		 noncompetediff1.5 <- summary.plusminus1.5[,"Safe.Republican.ECvotes"] - summary.plusminus1.5[,"Safe.Democratic.ECvotes"]
		noncompete_winning1.5 <- cbind(ifelse(noncompetediff1.5 > 0,1,0), ifelse(bramskilgour.plusminus1.5[,"rep.ec.outcome"]>0.5,1,0))
	 	match1.5 <- ifelse(noncompete_winning1.5[,1]== noncompete_winning1.5[,2], 1, 0)
	 	cbind(unique(summary.plusminus1.5$Year), match1.5, summary.plusminus1.5[,"Safe.Republican.ECvotes"], summary.plusminus1.5[,"Safe.Democratic.ECvotes"])
	 winningness_winning1.5 <- cbind(ifelse(bramskilgour.plusminus1.5[,"winningness"]>0.5,1,0), ifelse(bramskilgour.plusminus1.5[,"rep.ec.outcome"]>0.5,1,0))
	 match1.5 <- ifelse(winningness_winning1.5[,1]== winningness_winning1.5[,2], 1, 0)
	 yrs <- match(bramskilgour.plusminus1.5$year, uniqueyr)
cbind(uniqueyr[yrs], match1.5)

##########################################################################################################
######################## - Shaw and Althaus Replication - #######################################################
##########################################################################################################	
shaw <- read.csv("https://raw.githubusercontent.com/jcervas/Non-Competitive-Advantage/master/campaign_classifications.csv")

shaw.all <- data.frame(Year=unique(shaw$year), Total.States=NA, Total.ECvotes=NA, Safe.Republican.States=NA, Safe.Democratic.States=NA, Competitive.States=NA, Safe.Republican.ECvotes=NA, Safe.Democratic.ECvotes=NA, Competitive.ECvotes=NA, Rep.Competitive.Wins=NA, Dem.Competitive.Wins=NA, Rep.Total.ECwins =NA, Dem.Total.ECwins =NA, Rep.Outcome.EC=NA)	

shaw$code <- ifelse(shaw$classification=="Base Democratic", -1, ifelse(shaw$classification=="Battleground", 0, ifelse(shaw$classification=="Base Republican", 1, NA)))
party.class <- numeric()
for (yr in unique(shaw$year)) {
	shaw.yr <- shaw[shaw$year==yr,]
	d.yr <- d[d$year==yr,]
	d.yr <- merge(shaw.yr, d.yr, by=c("state", "year"))
	party.class <- rbind(party.class , cbind(yr, sum(d.yr$code[d.yr$party=="dem"] * d.yr$ecvotes[d.yr$party=="dem"], na.rm=TRUE), sum(d.yr$code[d.yr$party=="rep"] * d.yr$ecvotes[d.yr$party=="rep"], na.rm=TRUE)     ))
	colnames(party.class) <- c("year", "dem", "rep")
}
### Candidate Perceptive of Election
party.class
### Battlegrounds From Either Party
for (yr in unique(shaw$year)) {
		shaw.yr.dem <- shaw[shaw$year==yr & shaw$party=="dem" & shaw$code==0,]
		shaw.yr.rep <- shaw[shaw$year==yr & shaw$party=="rep" & shaw$code==0,]
	battleground.yr <- unique(c(as.character(shaw.yr.dem$state), as.character(shaw.yr.rep$state)))
		d.yr <- d[d$year==yr,]
		d.yr$s <- 1
competitive <- d.yr[d.yr$state %in% battleground.yr,]
noncompetitive <- d.yr[!(d.yr$state %in% battleground.yr),]
##### - Non-Competitive Advantage
shaw.all[shaw.all$Year==yr,"Total.States"] <- sum(competitive$s) + sum(noncompetitive$s)
shaw.all[shaw.all$Year==yr,"Total.ECvotes"] <- sum(competitive$s * competitive$ecvotes) + sum(noncompetitive$s * noncompetitive$ecvotes)
shaw.all[shaw.all$Year==yr,"Competitive.States"] <- sum(competitive$s)
shaw.all[shaw.all$Year==yr,"Competitive.ECvotes"] <- sum(competitive$s * competitive$ecvotes)
shaw.all[shaw.all$Year==yr,"Dem.Competitive.Wins"] <- sum(competitive$ecvotes[competitive$pctREP<.5])
shaw.all[shaw.all$Year==yr,"Rep.Competitive.Wins"] <- sum(competitive$ecvotes[competitive$pctREP>.5])
shaw.all[shaw.all$Year==yr,"Safe.Republican.States"] <- sum(noncompetitive$s[noncompetitive$pctREP>.5])
shaw.all[shaw.all$Year==yr,"Safe.Democratic.States"] <- sum(noncompetitive$s[noncompetitive$pctREP<.5])
shaw.all[shaw.all$Year==yr,"Safe.Republican.ECvotes"] <- sum(noncompetitive$ecvotes[noncompetitive$pctREP>.5])
shaw.all[shaw.all$Year==yr,"Safe.Democratic.ECvotes"] <- sum(noncompetitive$ecvotes[noncompetitive$pctREP<.5])
shaw.all[shaw.all$Year==yr,"Rep.Total.ECwins"] <- sum(d.yr$ecvotes[d.yr$pctREP>.5])
shaw.all[shaw.all$Year==yr,"Dem.Total.ECwins"] <- sum(d.yr$ecvotes[d.yr$pctREP<.5])
shaw.all[shaw.all$Year==yr,"Rep.Outcome.EC"] <- sum(d.yr$ecvotes[d.yr$pctREP>.5])/sum(d.yr$ecvotes)
### - Average victory in Battlegrounds
# pre.post.means[pre.post.means $Year==yr,"BaseDemocratic"] <-  mean(noncompetitive$pctREP[noncompetitive$pctREP<=0.5] - noncompetitive$pctDEM[noncompetitive$pctREP<=0.5])
# pre.post.means[pre.post.means $Year==yr,"Battleground"] <-  mean(abs(d.yr$pctREP[d.yr$state %in% battleground.yr] - d.yr$pctDEM[d.yr$state %in% battleground.yr]))
# pre.post.means[pre.post.means $Year==yr,"BaseRepublican"] <-  mean(noncompetitive$pctREP[noncompetitive$pctREP>=0.5] - noncompetitive$pctDEM[noncompetitive$pctREP>=0.5])

	}

NCregressions.all <-  data.frame(noncompetitiveadvantage = (shaw.all[,"Safe.Republican.ECvotes"] - shaw.all[,"Safe.Democratic.ECvotes"])/shaw.all[,"Total.ECvotes"], RepECOutcome = shaw.all[, "Rep.Total.ECwins"]/ shaw.all[, "Total.ECvotes"], competitive= shaw.all[,"Competitive.ECvotes"]/shaw.all[,"Total.ECvotes"])

summary(nca_reg.all <- lm(RepECOutcome ~ noncompetitiveadvantage, data = NCregressions.all))

### Matching Winningness with Actual EC Outcomes
		 noncompetediff.all <- shaw.all[,"Safe.Republican.ECvotes"] - shaw.all[,"Safe.Democratic.ECvotes"]
		noncompete_winning.all <- cbind(ifelse(noncompetediff.all > 0,1,0), ifelse(shaw.all[,"Rep.Outcome.EC"]>0.5,1,0))
	 	match.all <- ifelse(noncompete_winning.all[,1]== noncompete_winning.all[,2], 1, 0)
#########################################################################################################
####################### - Other specifications - ###############################################################
#########################################################################################################
pre.post.means <- data.frame(Year=unique(shaw$year), BaseDemocraticD=NA, BaseDemocraticR=NA, BattlegroundD=NA, BattlegroundR=NA, BaseRepublicanD=NA, BaseRepublicanR=NA)
## - Using only Democratic Strategies
shaw.dem <- data.frame(Year=unique(shaw$year), Total.States=NA, Total.ECvotes=NA, Safe.Republican.States=NA, Safe.Democratic.States=NA, Competitive.States=NA, Safe.Republican.ECvotes=NA, Safe.Democratic.ECvotes=NA, Competitive.ECvotes=NA, Rep.Competitive.Wins=NA, Dem.Competitive.Wins=NA, Rep.Total.ECwins =NA, Dem.Total.ECwins =NA, Rep.Outcome.EC=NA)	
for (yr in unique(shaw$year)) {
shaw.d <- shaw[shaw$year==yr & shaw$party=="dem" , c("state", "code")]
		d.yr <- d[d$year==yr,]
		d.yr$s <- 1
		d.yr <- merge(d.yr, shaw.d, by="state")
competitive <- d.yr[d.yr$code==0,]
noncompetitive.d <- d.yr[d.yr$code==-1,]
noncompetitive.r <- d.yr[d.yr$code==1,]
shaw.dem[shaw.dem $Year==yr,"Total.States"] <- sum(competitive$s,na.rm=T) + sum(noncompetitive.d$s,na.rm=T) + sum(noncompetitive.r$s,na.rm=T)
shaw.dem[shaw.dem $Year==yr,"Total.ECvotes"] <- sum(competitive$s * competitive$ecvotes,na.rm=T) + sum(noncompetitive.d$s * noncompetitive.d$ecvotes,na.rm=T) + sum(noncompetitive.r$s * noncompetitive.r$ecvotes,na.rm=T)
shaw.dem[shaw.dem $Year==yr,"Competitive.States"] <- sum(competitive$s,na.rm=T)
shaw.dem[shaw.dem $Year==yr,"Competitive.ECvotes"] <- sum(competitive$s * competitive$ecvotes,na.rm=T)
shaw.dem[shaw.dem $Year==yr,"Dem.Competitive.Wins"] <- sum(competitive$ecvotes[competitive$pctREP<.5],na.rm=T)
shaw.dem[shaw.dem $Year==yr,"Rep.Competitive.Wins"] <- sum(competitive$ecvotes[competitive$pctREP>.5],na.rm=T)
shaw.dem[shaw.dem $Year==yr,"Safe.Republican.States"] <- sum(noncompetitive.r$s,na.rm=T)
shaw.dem[shaw.dem $Year==yr,"Safe.Democratic.States"] <- sum(noncompetitive.d$s,na.rm=T)
shaw.dem[shaw.dem $Year==yr,"Safe.Republican.ECvotes"] <- sum(noncompetitive.r$ecvotes,na.rm=T)
shaw.dem[shaw.dem $Year==yr,"Safe.Democratic.ECvotes"] <- sum(noncompetitive.d$ecvotes,na.rm=T)
shaw.dem[shaw.dem $Year==yr,"Rep.Total.ECwins"] <- sum(d.yr$ecvotes[d.yr$pctREP>.5],na.rm=T)
shaw.dem[shaw.dem $Year==yr,"Dem.Total.ECwins"] <- sum(d.yr$ecvotes[d.yr$pctREP<.5],na.rm=T)
shaw.dem[shaw.dem $Year==yr,"Rep.Outcome.EC"] <- sum(d.yr$ecvotes[d.yr$pctREP>.5],na.rm=T)/sum(d.yr$ecvotes,na.rm=T)

pre.post.means[pre.post.means $Year==yr,"BaseDemocraticD"] <- mean(abs(noncompetitive.d$pctREP-noncompetitive.d$pctDEM), na.rm=TRUE)
pre.post.means[pre.post.means $Year==yr,"BaseRepublicanD"] <- mean(abs(noncompetitive.r$pctREP-noncompetitive.r$pctDEM), na.rm=TRUE)
pre.post.means[pre.post.means $Year==yr,"BattlegroundD"] <- mean(abs(competitive$pctREP-competitive$pctDEM), na.rm=TRUE)
	}
 noncompetediff.dem <- shaw.dem[,"Safe.Republican.ECvotes"] - shaw.dem[,"Safe.Democratic.ECvotes"]
		noncompete_winning.dem <- cbind(ifelse(noncompetediff.dem > 0,1,0), ifelse(shaw.dem[,"Rep.Outcome.EC"]>0.5,1,0))
	 	match.dem <- ifelse(noncompete_winning.dem[,1]== noncompete_winning.dem[,2], 1, 0)
	 	data.frame(Year=unique(shaw$year), Match=ifelse(match.dem==1, "check", ""), SafeRepEC= shaw.dem[,"Safe.Republican.ECvotes"], SafeDemEC= shaw.dem[,"Safe.Democratic.ECvotes"], NonCompetitiveAdvantage= shaw.dem[,"Safe.Republican.ECvotes"] - shaw.dem[,"Safe.Democratic.ECvotes"], Rep.Outcome.EC= round(shaw.dem[,"Rep.Outcome.EC"], digits=2))

NCregressions.dem <-  data.frame(noncompetitiveadvantage = (shaw.dem[,"Safe.Republican.ECvotes"] - shaw.dem[,"Safe.Democratic.ECvotes"])/shaw.dem[,"Total.ECvotes"], RepECOutcome = shaw.dem[, "Rep.Total.ECwins"]/ shaw.dem[, "Total.ECvotes"], competitive= shaw.dem[,"Competitive.ECvotes"]/shaw.dem[,"Total.ECvotes"])
summary(nca_reg.dem <- lm(RepECOutcome ~ noncompetitiveadvantage, data = NCregressions.dem))
#########################################################################################################
## - Using only Republican Strategies
shaw.rep <- data.frame(Year=unique(shaw$year), Total.States=NA, Total.ECvotes=NA, Safe.Republican.States=NA, Safe.Democratic.States=NA, Competitive.States=NA, Safe.Republican.ECvotes=NA, Safe.Democratic.ECvotes=NA, Competitive.ECvotes=NA, Rep.Competitive.Wins=NA, Dem.Competitive.Wins=NA, Rep.Total.ECwins =NA, Dem.Total.ECwins =NA, Rep.Outcome.EC=NA)	
for (yr in unique(shaw$year)) {
shaw.r <- shaw[shaw$year==yr & shaw$party=="rep" , c("state", "code")]
		d.yr <- d[d$year==yr,]
		d.yr$s <- 1
		d.yr <- merge(d.yr, shaw.r, by="state")
competitive <- d.yr[d.yr$code==0,]
noncompetitive.d <- d.yr[d.yr$code==-1,]
noncompetitive.r <- d.yr[d.yr$code==1,]
shaw.rep[shaw.rep $Year==yr,"Total.States"] <- sum(competitive$s,na.rm=T) + sum(noncompetitive.d$s,na.rm=T) + sum(noncompetitive.r$s,na.rm=T)
shaw.rep[shaw.rep $Year==yr,"Total.ECvotes"] <- sum(competitive$s * competitive$ecvotes,na.rm=T) + sum(noncompetitive.d$s * noncompetitive.d$ecvotes,na.rm=T) + sum(noncompetitive.r$s * noncompetitive.r$ecvotes,na.rm=T)
shaw.rep[shaw.rep $Year==yr,"Competitive.States"] <- sum(competitive$s,na.rm=T)
shaw.rep[shaw.rep $Year==yr,"Competitive.ECvotes"] <- sum(competitive$s * competitive$ecvotes,na.rm=T)
shaw.rep[shaw.rep $Year==yr,"Dem.Competitive.Wins"] <- sum(competitive$ecvotes[competitive$pctREP<.5],na.rm=T)
shaw.rep[shaw.rep $Year==yr,"Rep.Competitive.Wins"] <- sum(competitive$ecvotes[competitive$pctREP>.5],na.rm=T)
shaw.rep[shaw.rep $Year==yr,"Safe.Republican.States"] <- sum(noncompetitive.r$s,na.rm=T)
shaw.rep[shaw.rep $Year==yr,"Safe.Democratic.States"] <- sum(noncompetitive.d$s,na.rm=T)
shaw.rep[shaw.rep $Year==yr,"Safe.Republican.ECvotes"] <- sum(noncompetitive.r$ecvotes,na.rm=T)
shaw.rep[shaw.rep $Year==yr,"Safe.Democratic.ECvotes"] <- sum(noncompetitive.d$ecvotes,na.rm=T)
shaw.rep[shaw.rep $Year==yr,"Rep.Total.ECwins"] <- sum(d.yr$ecvotes[d.yr$pctREP>.5],na.rm=T)
shaw.rep[shaw.rep $Year==yr,"Dem.Total.ECwins"] <- sum(d.yr$ecvotes[d.yr$pctREP<.5],na.rm=T)
shaw.rep[shaw.rep $Year==yr,"Rep.Outcome.EC"] <- sum(d.yr$ecvotes[d.yr$pctREP>.5],na.rm=T)/sum(d.yr$ecvotes,na.rm=T)

pre.post.means[pre.post.means $Year==yr,"BaseDemocraticR"] <- mean(abs(noncompetitive.d$pctREP-noncompetitive.d$pctDEM), na.rm=TRUE)
pre.post.means[pre.post.means $Year==yr,"BaseRepublicanR"] <- mean(abs(noncompetitive.r$pctREP-noncompetitive.r$pctDEM), na.rm=TRUE)
pre.post.means[pre.post.means $Year==yr,"BattlegroundR"] <- mean(abs(competitive$pctREP-competitive$pctDEM), na.rm=TRUE)
	}
 noncompetediff.rep <- shaw.rep[,"Safe.Republican.ECvotes"] - shaw.rep[,"Safe.Democratic.ECvotes"]
		noncompete_winning.rep <- cbind(ifelse(noncompetediff.rep > 0,1,0), ifelse(shaw.rep[,"Rep.Outcome.EC"]>0.5,1,0))
	 	match.rep <- ifelse(noncompete_winning.rep[,1]== noncompete_winning.rep[,2], 1, 0)
	 	data.frame(Year=unique(shaw$year), Match=ifelse(match.rep==1, "check", ""), SafeRepEC= shaw.rep[,"Safe.Republican.ECvotes"], SafeDemEC= shaw.rep[,"Safe.Democratic.ECvotes"], NonCompetitiveAdvantage= shaw.rep[,"Safe.Republican.ECvotes"] - shaw.rep[,"Safe.Democratic.ECvotes"], Rep.Outcome.EC= shaw.rep[,"Rep.Outcome.EC"])

NCregressions.rep <-  data.frame(noncompetitiveadvantage = (shaw.rep[,"Safe.Republican.ECvotes"] - shaw.rep[,"Safe.Democratic.ECvotes"])/shaw.rep[,"Total.ECvotes"], RepECOutcome = shaw.rep[, "Rep.Total.ECwins"]/ shaw.rep[, "Total.ECvotes"], competitive= shaw.rep[,"Competitive.ECvotes"]/shaw.rep[,"Total.ECvotes"])

summary(nca_reg.rep <- lm(RepECOutcome ~ noncompetitiveadvantage, data = NCregressions.rep))
#########################################################################################################
## - Using only matched Strategies
shaw.match <- data.frame(Year=unique(shaw$year), Total.States=NA, Total.ECvotes=NA, Safe.Republican.States=NA, Safe.Democratic.States=NA, Competitive.States=NA, Safe.Republican.ECvotes=NA, Safe.Democratic.ECvotes=NA, Competitive.ECvotes=NA, Rep.Competitive.Wins=NA, Dem.Competitive.Wins=NA, Rep.Total.ECwins =NA, Dem.Total.ECwins =NA, Rep.Outcome.EC=NA)	
for (yr in unique(shaw$year)) {
		shaw.yr.dem <- shaw[shaw$year==yr & shaw$party=="dem" & shaw$code==0,]
		shaw.yr.rep <- shaw[shaw$year==yr & shaw$party=="rep" & shaw$code==0,]
	battleground.match <- as.character(shaw.yr.dem$state[as.character(shaw.yr.dem$state) %in% as.character(shaw.yr.rep$state)])
		d.yr <- d[d$year==yr,]
		d.yr$s <- 1
competitive <- d.yr[d.yr$state %in% battleground.match,]
noncompetitive <- d.yr[!(d.yr$state %in% battleground.match),]
shaw.match[shaw.match $Year==yr,"Total.States"] <- sum(competitive$s) + sum(noncompetitive$s)
shaw.match[shaw.match $Year==yr,"Total.ECvotes"] <- sum(competitive$s * competitive$ecvotes) + sum(noncompetitive$s * noncompetitive$ecvotes)
shaw.match[shaw.match $Year==yr,"Competitive.States"] <- sum(competitive$s)
shaw.match[shaw.match $Year==yr,"Competitive.ECvotes"] <- sum(competitive$s * competitive$ecvotes)
shaw.match[shaw.match $Year==yr,"Dem.Competitive.Wins"] <- sum(competitive$ecvotes[competitive$pctREP<.5])
shaw.match[shaw.match $Year==yr,"Rep.Competitive.Wins"] <- sum(competitive$ecvotes[competitive$pctREP>.5])
shaw.match[shaw.match $Year==yr,"Safe.Republican.States"] <- sum(noncompetitive$s[noncompetitive$pctREP>.5])
shaw.match[shaw.match $Year==yr,"Safe.Democratic.States"] <- sum(noncompetitive$s[noncompetitive$pctREP<.5])
shaw.match[shaw.match $Year==yr,"Safe.Republican.ECvotes"] <- sum(noncompetitive$ecvotes[noncompetitive$pctREP>.5])
shaw.match[shaw.match $Year==yr,"Safe.Democratic.ECvotes"] <- sum(noncompetitive$ecvotes[noncompetitive$pctREP<.5])
shaw.match[shaw.match $Year==yr,"Rep.Total.ECwins"] <- sum(d.yr$ecvotes[d.yr$pctREP>.5])
shaw.match[shaw.match $Year==yr,"Dem.Total.ECwins"] <- sum(d.yr$ecvotes[d.yr$pctREP<.5])
shaw.match[shaw.match $Year==yr,"Rep.Outcome.EC"] <- sum(d.yr$ecvotes[d.yr$pctREP>.5])/sum(d.yr$ecvotes)
	}
 noncompetediff.match <- shaw.match[,"Safe.Republican.ECvotes"] - shaw.match[,"Safe.Democratic.ECvotes"]
		noncompete_winning.match <- cbind(ifelse(noncompetediff.match > 0,1,0), ifelse(shaw.match[,"Rep.Outcome.EC"]>0.5,1,0))
	 	match.match <- ifelse(noncompete_winning.match[,1]== noncompete_winning.match[,2], 1, 0)
	 	data.frame(Year=unique(shaw$year), Match=ifelse(match.match==1, "check", ""), SafeRepEC= shaw.match[,"Safe.Republican.ECvotes"], SafeDemEC= shaw.match[,"Safe.Democratic.ECvotes"], NonCompetitiveAdvantage= shaw.match[,"Safe.Republican.ECvotes"] - shaw.match[,"Safe.Democratic.ECvotes"], Rep.Outcome.EC= shaw.match[,"Rep.Outcome.EC"])

NCregressions.match <-  data.frame(noncompetitiveadvantage = (shaw.match[,"Safe.Republican.ECvotes"] - shaw.match[,"Safe.Democratic.ECvotes"])/shaw.match[,"Total.ECvotes"], RepECOutcome = shaw.match[, "Rep.Total.ECwins"]/ shaw.match[, "Total.ECvotes"], competitive= shaw.match[,"Competitive.ECvotes"]/shaw.match[,"Total.ECvotes"])

summary(nca_reg.match <- lm(RepECOutcome ~ noncompetitiveadvantage, data = NCregressions.match))







############################################################################################################
################################ - TABLES - ################################################################
############################################################################################################
################### - Table 1:
rep.BK <- cbind(bramskilgour.plusminus3[,"winningness"], bramskilgour.plusminus3[,"vulnerability"], bramskilgour.plusminus3[,"fragility"], summary.plusminus3[, "Rep.Total.ECwins"]/ summary.plusminus3[, "Total.ECvotes"])
	colnames(rep.BK) <- c("winningness", "vulnerability", "fragility", "EC.Outcome.REP")
	rownames(rep.BK) <- uniqueyr
dem.BK <- cbind(bramskilgour.plusminus3[,"winningness.1"], bramskilgour.plusminus3[,"vulnerability.1"], bramskilgour.plusminus3[,"fragility.1"], summary.plusminus3[, "Dem.Total.ECwins"]/ summary.plusminus3[, "Total.ECvotes"])
	colnames(dem.BK) <- c("winningness", "vulnerability", "fragility", "EC.Outcome.DEM")
	rownames(dem.BK) <- uniqueyr
rep.cor <- cor(rep.BK, use="pairwise.complete.obs")
dem.cor <- cor(dem.BK, use="pairwise.complete.obs")
		
		cat(paste("\n", "********** Table 1a", "**********", "\n")) 

			stargazer(dem.cor, rep.cor, 
				type="text", 
				title=c("Democratic Correlations", "Republican Correlations"), 
				out="Tables/table1a.txt")

			stargazer(dem.cor, rep.cor, 
				type="html", 
				title=c("Democratic Correlations", "Republican Correlations"), 
				out="Tables/table1a.html")
	
	drop <- c(0,1)
	
dem.BK.restricted <- dem.BK[!dem.BK[,"winningness"] %in% drop,]
rep.BK.restricted <- rep.BK[!rep.BK[,"winningness"] %in% drop,]
dem.cor.restricted <- cor(dem.BK.restricted, use="pairwise.complete.obs")
rep.cor.restricted <- cor(rep.BK.restricted, use="pairwise.complete.obs")
		
		cat(paste("\n", "********** Table 1b", "**********", "\n")) 

			stargazer(dem.cor.restricted, rep.cor.restricted, 
				type="text", 
				title=c("Democratic Correlations [Restricted Model]", "Republican Correlations [Restricted Model]"), 
				out="Tables/table1b.txt")


			stargazer(dem.cor.restricted, rep.cor.restricted, 
				type="html", 
				title=c("Democratic Correlations [Restricted Model]", "Republican Correlations [Restricted Model]"), 
				out="Tables/table1b.html")

################### - Table 2:  
table2 <- cbind(pre.post.means[,1],round(pre.post.means[,-1]*100, digits=1))

		cat(paste("\n", "********** Table 2", "**********", "\n")) 
			stargazer(table2, 
				type="text", 
				style="AJPS",  
				summary=FALSE, 
				out="/Users/jcervas/Dropbox/Non Competitive Electors/Tables/table2.txt", 
				title="Average Victory Margins in Battleground States as Defined by Shaw and Althaus",  
				digits=1, 
				rownames=F)

################### - Table 3: Correlations among the Winningness, Vulnerability, and Fragility variables for the Republicans and Republican EC seat share: 1868-2016	 
table3 <- data.frame(cbind(summary.plusminus3[,"Safe.Republican.ECvotes"], summary.plusminus3[,"Safe.Democratic.ECvotes"], summary.plusminus3[,"Rep.Total.ECwins"], summary.plusminus3[,"Dem.Total.ECwins"], round(summary.plusminus3[,"Rep.Total.ECwins"]/summary.plusminus3[,"Total.ECvotes"], digits=3), round(summary.plusminus3[,"Dem.Total.ECwins"]/summary.plusminus3[,"Total.ECvotes"], digits=3), summary.plusminus3[,"Safe.Republican.ECvotes"]-summary.plusminus3[,"Safe.Democratic.ECvotes"], round((summary.plusminus3[,"Safe.Republican.ECvotes"]-summary.plusminus3[,"Safe.Democratic.ECvotes"])/summary.plusminus3[,"Total.ECvotes"], digits=3) ))
header.table3 <- c("Democratic EC Seats", "Republican EC Seats", "Rep EC Wins", "Dem EC Wins", "Republican %", "Democratic %", "Difference", "Difference %")
colnames(table3) <- header.table3
rownames(table3) <- uniqueyr

		cat(paste("\n", "********** Table 3", "**********", "\n")) 
			stargazer(table3, type="text", style="AJPS", summary=FALSE, out="Tables/table3.txt", title="Electoral College Data 1868-2016")	 
			stargazer(table3, type="html", style="AJPS", summary=FALSE, out="Tables/table3.html", title="Electoral College Data 1868-2016")	 


############################################################################################################
#################### - Appendix A: DATA AND ANALYSES REFERRED TO IN TEXT - #################################
############################################################################################################

#################### - Table Appendix A1: Electoral College Data 1868-2016
tableA1 <- bramskilgour.plusminus3[,c("winningness", "vulnerability", "fragility", "winningness.1", "vulnerability.1", "fragility.1")]
rownames(tableA1) <- uniqueyr
tableA1$actual <- summary.plusminus3[,"Rep.Total.ECwins"]/summary.plusminus3[,"Total.ECvotes"]

		cat(paste("\n", "********** Table Appendix A1", "**********", "\n")) 
			stargazer(tableA1, 
			type="text", 
			style="AJPS",  
			summary=FALSE, 
			out="Tables/tableA1.txt", 
			title="Winningness, Vulnerability, and Fragility 1868-2016",  
			digits=3)
			
#################### - Table Appendix A2: Regressions with Non-Competitive Advantage and with Winningness to predict final Republican EC vote share		
rep.BK <- data.frame(rep.BK, noncompetitiveadvantage = (summary.plusminus3[,"Safe.Republican.ECvotes"] - summary.plusminus3[,"Safe.Democratic.ECvotes"])/summary.plusminus3[,"Total.ECvotes"])
dem.BK <- data.frame(dem.BK, noncompetitiveadvantage = (summary.plusminus3[,"Safe.Republican.ECvotes"] - summary.plusminus3[,"Safe.Democratic.ECvotes"])/summary.plusminus3[,"Total.ECvotes"])
rep.BK.restricted <- rep.BK[!rep.BK[,"winningness"] %in% drop,]
dem.BK.restricted <- dem.BK[!dem.BK[,"winningness"] %in% drop,]

NCregressions <-  data.frame(noncompetitiveadvantage = (summary.plusminus3[,"Safe.Republican.ECvotes"] - summary.plusminus3[,"Safe.Democratic.ECvotes"])/summary.plusminus3[,"Total.ECvotes"], RepECOutcome = summary.plusminus3[, "Rep.Total.ECwins"]/ summary.plusminus3[, "Total.ECvotes"], competitive= summary.plusminus3[,"Competitive.ECvotes"]/summary.plusminus3[,"Total.ECvotes"], winningness= bramskilgour.plusminus3[,"winningness"])

summary(nca_reg <- lm(RepECOutcome ~ noncompetitiveadvantage, data = NCregressions))
#summary(nca_reg <- lm(RepECOutcome ~ noncompetitiveadvantage + competitive, data = NCregressions))
summary(w_reg <- lm(RepECOutcome ~ winningness, data = NCregressions))

summary(w_reg_restricted <- lm(EC.Outcome.REP ~ winningness, data = rep.BK.restricted))

		cat(paste("\n", "********** Appendix Table A2", "**********", "\n")) 
			stargazer(nca_reg, w_reg, w_reg_restricted, 
			type="text", 
			omit.stat=c("rsq", "ser"), 
			style="AJPS", 
			title="Regressions with Non-Competitive Advantage vs Winningness to Predict Final Republican EC seat share", 
			notes="Note: All Regressions calculated using plus or minus 3% as the definition of competitive state.", 
			out="Tables/table3.txt")


############################################################################################################
######### - Appendix B: How analyses would change if we changed the definition of noncompetitive State - ###
############################################################################################################
################### - Appendix B1
## .1 = +-3.   .2 = +-5
	BKreplication <- data.frame(
				Competitive_States_3 = paste0(short.summary[, "CompetitiveStates.1"], " (", short.summary[, "CompetitiveECvotes.1"], ")" ),
				Competitive_States_5 = paste0(short.summary[, "CompetitiveStates.2"], " (", short.summary[, "CompetitiveECvotes.2"], ")" ),
				Winningness_3 = round(short.summary[, "R.Winningness.1"]/short.summary[, "D.Winningness.1"], digits=2),
				Winningness_5 = round(short.summary[, "R.Winningness.2"]/short.summary[, "D.Winningness.2"], digits=2),
				Vulnerability_3 = round(short.summary[, "R.Vulnerability.1"]/short.summary[, "D.Vulnerability.1"], digits=3),
				Vulnerability_5 = round(short.summary[, "R.Vulnerability.2"]/short.summary[, "D.Vulnerability.2"], digits=3),
				Fragility_3 = round(short.summary[, "R.Fragility.1"]/short.summary[, "D.Fragility.1"], digits=3),
				Fragility_5 = round(short.summary[, "R.Fragility.2"]/short.summary[, "D.Fragility.2"], digits=3))
rownames(BKreplication) <- seq(2000,2016,4)


		cat(paste("\n", "********** Table Appendix B1", "**********", "\n")) 
			stargazer(BKreplication, 
				type="text", out="Tables/tableB1.txt", 
				summary=FALSE, 
				title=" Comparisons of results for the Winningness, Vulnerability, and Fragility variables for the Republicans for a +/- 3% and a +/- 5% definition of competitive state: 2000-2016", 
				digits=2, 
				notes="All ratios are REP over DEM")


	summary(regressBrams1R.restricted <-  lm( rep.BK.restricted[,"EC.Outcome.REP"] ~ rep.BK.restricted[,"winningness"], na.action=na.exclude))
	summary(regressBrams2R.restricted <-  lm( rep.BK.restricted[,"EC.Outcome.REP"] ~ rep.BK.restricted[,"winningness"] + rep.BK.restricted[,"vulnerability"], na.action=na.exclude))
	summary(regressBrams3R.restricted <-  lm( rep.BK.restricted[,"EC.Outcome.REP"] ~ rep.BK.restricted[,"winningness"] + rep.BK.restricted[,"vulnerability"] + rep.BK.restricted[,"fragility"], na.action=na.exclude))

	summary(regressBrams2D.restricted <-  lm( dem.BK.restricted[,"EC.Outcome.DEM"] ~ dem.BK.restricted[,"winningness"] + dem.BK.restricted[,"vulnerability"], na.action=na.exclude))
	summary(regressBrams3D.restricted <-  lm( dem.BK.restricted[,"EC.Outcome.DEM"] ~ dem.BK.restricted[,"winningness"] + dem.BK.restricted[,"vulnerability"] + dem.BK.restricted[,"fragility"], na.action=na.exclude))

stargazer(regressBrams1R.restricted, regressBrams2R.restricted, regressBrams2D.restricted, regressBrams3R.restricted, regressBrams3D.restricted, type="text", title="Appendix: Predicting Electoral Outcomes using Winningness, Vulnerability, and Fragility", notes="Models restricted to Competitive elections, ie Winningness!= 1 or 0") 

rep.BK5 <- data.frame(cbind(bramskilgour.plusminus5[,"winningness"], bramskilgour.plusminus5[,"vulnerability"], bramskilgour.plusminus5[,"fragility"], noncompetitiveadvantage = (summary.plusminus5[,"Safe.Republican.ECvotes"] - summary.plusminus5[,"Safe.Democratic.ECvotes"])/summary.plusminus5[,"Total.ECvotes"], summary.plusminus5[, "Rep.Total.ECwins"]/ summary.plusminus5[, "Total.ECvotes"]))
	colnames(rep.BK5) <- c("Winningness", "Vulnerability", "Fragility", "NonCompetitiveAdvantage", "EC.Outcome.REP")
	rownames(rep.BK5) <- uniqueyr
dem.BK5 <- data.frame(cbind(bramskilgour.plusminus5[,"winningness.1"], bramskilgour.plusminus5[,"vulnerability.1"], bramskilgour.plusminus5[,"fragility.1"], noncompetitiveadvantage = (summary.plusminus5[,"Safe.Republican.ECvotes"] - summary.plusminus5[,"Safe.Democratic.ECvotes"])/summary.plusminus5[,"Total.ECvotes"], summary.plusminus5[, "Dem.Total.ECwins"]/ summary.plusminus5[, "Total.ECvotes"]))
	colnames(dem.BK5) <- c("Winningness", "Vulnerability", "Fragility", "NonCompetitiveAdvantage", "EC.Outcome.DEM")
	rownames(dem.BK5) <- uniqueyr
rep.cor5 <- cor(rep.BK5, use="pairwise.complete.obs")
dem.cor5 <- cor(dem.BK5, use="pairwise.complete.obs")

	drop <- c(0,1)
dem.BK5.restricted <- dem.BK5[!dem.BK5[,"Winningness"] %in% drop,]
rep.BK5.restricted <- rep.BK5[!rep.BK5[,"Winningness"] %in% drop,]

######## - Appendix Regressions Table B2

summary(reg51 <- lm(EC.Outcome.REP ~ NonCompetitiveAdvantage, data= rep.BK5))
summary(reg52 <- lm(EC.Outcome.REP ~ Winningness, data= rep.BK5))

summary(reg5restricted1 <- lm(EC.Outcome.REP ~ NonCompetitiveAdvantage, data= rep.BK5.restricted))
summary(reg5restricted2 <- lm(EC.Outcome.REP ~ Winningness, data= rep.BK5.restricted))


		cat(paste("\n", "********** Table Appendix B2", "**********", "\n")) 

		stargazer(reg51, reg52, reg5restricted1, reg5restricted2, 
			type="html", 
			covariate.labels=c("Non Competitive Advantage", "Winningness"), 
			add.lines=list(c("Restricted Model","NO","NO","YES","YES")), 
			dep.var.labels.include=FALSE, 
			df=FALSE, 
			omit.stat = c("rsq", "f","ser"), 
			column.separate=c(2,2), 
			column.labels=c("Full Model", "Restricted Model"),
			title="Regression tables using the ± 5% definition of competitive" ,
			out="Tables/tableB2.tex")




############################################################################################################
######### - Appendix C: Using Shaw and Althaus’s classification of battleground as a robustness check - ####
############################################################################################################
######## - Appendix Table C1
		cat(paste("\n", "********** Table Appendix C1", "**********", "\n")) 
		
			 	data.frame(Year=unique(shaw$year), Match=ifelse(match.all==1, "check", ""), SafeRepEC= shaw.all[,"Safe.Republican.ECvotes"], SafeDemEC= shaw.all[,"Safe.Democratic.ECvotes"], NonCompetitiveAdvantage=shaw.all[,"Safe.Republican.ECvotes"] - shaw.all[,"Safe.Democratic.ECvotes"], Rep.Outcome.EC=round(shaw.all[,"Rep.Outcome.EC"], digits=2)) 
######## - Appendix Table C2
		cat(paste("\n", "********** Table Appendix C2", "**********", "\n")) 

			stargazer(nca_reg.all, nca_reg.dem, nca_reg.rep, nca_reg.match, 
				type="text", 
				covariate.labels=c("Non Competitive Advantage"), 
				add.lines=list(c("Restricted Model","NO","NO","YES","YES")), 
				dep.var.labels.include=FALSE, 
				df=FALSE, 
				omit.stat = c("rsq", "f","ser"), 
				column.separate=c(2,2), 
				column.labels=c("Full Model", "Restricted Model"), 
				out="Tables/tableC2.tex")
######## - Appendix Table C3
		cat(paste("\n", "********** Table Appendix C3", "**********", "\n")) 
		
			cbind.data.frame(
				Year=unique(shaw$year),
				Model1=round((shaw.match[,"Safe.Republican.ECvotes"] - shaw.match[,"Safe.Democratic.ECvotes"])/shaw.match[,"Total.ECvotes"], digits=2),
				Model1=ifelse(match.all==1, "check", ""), 
				Model2=round((shaw.match[,"Safe.Republican.ECvotes"] - shaw.dem[,"Safe.Democratic.ECvotes"])/shaw.dem[,"Total.ECvotes"], digits=2),
				Model2=ifelse(match.dem==1, "check", ""), 
				Model3=round((shaw.rep[,"Safe.Republican.ECvotes"] - shaw.rep[,"Safe.Democratic.ECvotes"])/shaw.rep[,"Total.ECvotes"],digits=2),
				Model3=ifelse(match.rep==1, "check", ""), 
				Model4=round((shaw.match[,"Safe.Republican.ECvotes"] - shaw.match[,"Safe.Democratic.ECvotes"])/shaw.match[,"Total.ECvotes"],digits=2),
				Model4=ifelse(match.match==1, "check", ""), 
				EC.Outcome.REP=round(shaw.match[,"Rep.Outcome.EC"], digits=2))





############################################################################################################
#################################### - FIGURES - ###########################################################
############################################################################################################
######## - Figure 1: Scatterplots of the Three Brams and Kilgour variables
		cat(paste("\n", "********** Figure 1", "**********", "\n")) 

# svg("scatterBrams.svg", width=12, height=6)
	par(mfrow=c(1,3), 
		oma= c(1,3,0,0), 
		mar=c(3,1,1,1), 
		mgp= c(2,1,0))
		
	plot(rep.BK[,"winningness"], rep.BK[,"EC.Outcome.REP"], 
		type="n", 
		yaxt="n", 
		xaxt="n", 
		xlab="")
		
		mtext(side=2, line=2.5, "Candidate's Share of EC", cex=0.85)
		mtext(side=1, line=2, "Winningness", cex=0.85)
		text(rep.BK[,"winningness"], rep.BK[,"EC.Outcome.REP"], 
			labels=ifelse(rep.BK[,"EC.Outcome.REP"]>.5, rownames(rep.BK), rownames(rep.BK)), 
			col=ifelse(rep.BK[,"EC.Outcome.REP"]>.5, "gray50", "gray30"), 
			cex=0.85)
			abline(h=seq(0,1,.125), lty=3, lwd=.5, col="gray80")
			abline(v=seq(0,1,.25), lty=3, lwd=.5, col="gray80")
			abline(h=0.5, lty=3, lwd=.75, col="gray30")
			abline(v=0.5, lty=3, lwd=.75, col="gray30")
		axis(side=1, at=c(0, 0.25, 0.5, 0.75, 1), labels=c("0%", "25%", "50%", "75%", "100%"), cex.axis=0.85, font=2)
		axis(side=2, las=2, at=c(0, 0.25, 0.5, 0.75, 1), labels=c("0%", "25%", "50%", "75%", "100%"), cex.axis=0.85, font=2)

	plot(rep.BK[,"vulnerability"], rep.BK[,"EC.Outcome.REP"], 
		type="n", 
		yaxt="n", 
		xaxt="n", 
		xlab="")
			text(rep.BK[,"vulnerability"], rep.BK[,"EC.Outcome.REP"], 
				cex=0.85, 
				labels="R", 
				col="gray50")
			text(dem.BK[,"vulnerability"], dem.BK[,"EC.Outcome.DEM"], 
				cex=0.85, 
				labels="D", 
				col="gray30")
			mtext(side=1, 
				line=2, 
				"Vulnerability", 
				cex=0.65)
abline(h=seq(0,1,.125), lty=3, lwd=.5, col="gray80")
abline(v=seq(0,1,.25), lty=3, lwd=.5, col="gray80")
axis(side=1, at=c(0, 0.25, 0.5, 0.75, 1), labels=c("0%", "25%", "50%", "75%", "100%"), cex.axis=0.85, font=2)
abline(h=0.5, lty=3, lwd=.75, col="gray30")

	plot(rep.BK[,"fragility"], rep.BK[,"EC.Outcome.REP"], 
		type="n", 
		yaxt="n", 
		xaxt="n", 
		xlab="") 
			text(rep.BK[,"fragility"], rep.BK[,"EC.Outcome.REP"], 
				cex=0.85, 
				labels="R", 
				col="gray50")
			text(dem.BK[,"fragility"], dem.BK[,"EC.Outcome.DEM"], 
				cex=0.85, 
				labels="D", 
				col="gray30")
			mtext(side=1, 
				line=2, 
				"Fragility", 
				cex=0.65)
abline(h=seq(0,1,.125), lty=3, lwd=.5, col="gray80")
abline(v=seq(0,15,5), lty=3, lwd=.5, col="gray80")
axis(side=1, at=c(0, 5,10,15), labels=c(0, 5, 10,15), cex.axis=0.85, font=2)
abline(h=0.5, lty=3, lwd=.75, col="gray30")
# dev.off()


######## - Figure 2: Historical Trends in Competitive States
		cat(paste("\n", "********** Figure 2", "**********", "\n")) 

# svg("scatterHistoricalCompetitiveness.svg", width=12, height=6)
par(mfrow=c(1,1),
	mar=c(4,4,1,.25))
	plot(summary.plusminus3[,"Year"], summary.plusminus3[,"Safe.Republican.ECvotes"]/summary.plusminus3[,"Total.ECvotes"], 
		type="n", 
		col="gray70", 
		xlab="", 
		ylab="", 
		xaxt="n", 
		yaxt="n", 
		pch=19, 
		cex=0.65, 
		ylim=c(0,1), 
		bty="n")
		legend(1980,1,
			legend=c("Safe Republican", "Safe Democratic", "Battleground"), 
			lty=c(2,2,1), 
			lwd=c(3,3,5), 
			col=c("gray60", "gray80", "gray30"), 
			bg="white", 
			box.col="white", 
			cex=1)
abline(h=seq(0,1,.25), lwd=.5, col="gray70", lty=3)
abline(v=seq(1868,2016,12), lwd=.5, col="gray70", lty=3)
axis(side=2, las=2, at=c(0,.25,.5,.75,1), labels=c("0%", "25%", "50%", "75%", "100%"), cex.axis=1, lwd.ticks=0, lwd=0)
		text(seq(1868,2016,4), 
			par("usr")[3]-.05, 
			labels = seq(1868,2016,4), 
			srt = 45, 
			pos = 1, 
			xpd = TRUE, 
			cex=1)
	mtext(side=2, 
		line=3, 
		"Percent of Electoral College", 
		cex=1,
		font=2)
	text(summary.plusminus3[,"Year"], summary.plusminus3[,"Competitive.ECvotes"]/summary.plusminus3[,"Total.ECvotes"], 
		col="gray50", 
		labels="B", 
		cex=0.7)
lines(lowess(summary.plusminus3[,"Year"], summary.plusminus3[,"Safe.Republican.ECvotes"]/summary.plusminus3[,"Total.ECvotes"], f=0.5), lwd=3, lty=2, col="gray60")
lines(lowess(summary.plusminus3[,"Year"], summary.plusminus3[,"Safe.Democratic.ECvotes"]/summary.plusminus3[,"Total.ECvotes"], f=0.5), lwd=3, lty=2, col="gray80")
lines(lowess(summary.plusminus3[,"Year"], summary.plusminus3[,"Competitive.ECvotes"]/summary.plusminus3[,"Total.ECvotes"], f=0.5), lwd=5, lty=1, col="gray30")
# dev.off()




