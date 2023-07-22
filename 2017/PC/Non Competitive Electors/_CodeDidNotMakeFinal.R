
# Didn't make it to final paper

##########################################################################################################
#################### - State Propensity Analysis - #######################################################
##########################################################################################################	 
rep.state.safe <- list()
dem.state.safe <- list()
battleground.state <- list()
ecvotes <- list()
state.sum <- list()
cycles <- c("1868-1892", "1896-1928", "1932-1964", "1968-1988", "1992-2016")
time.periods.1868.1892 <- seq(1860,1892,4)
time.periods.1896.1928 <- seq(1896,1928,4)
time.periods.1932.1964 <- seq(1932,1964,4)
time.periods.1968.1988 <- seq(1968,1988,4)
time.periods.1992.2016 <- seq(1992,2016,4)
time.periods <- list(time.periods.1868.1892, time.periods.1896.1928, time.periods.1932.1964 , time.periods.1968.1988, time.periods.1992.2016)
safe <- cbind.data.frame(year=d$year, ecvotes=d$ecvotes, state=d$state, rep_safe= 1 * (d$pctREP > 0.53), dem_safe= 1 * (d$pctDEM > 0.53), battleground= 1 * (d$pctREP < 0.53 & d$pctREP > 0.47))

for (tp in 1:length(time.periods)) {
	t <- time.periods[[tp]]
	safe.time <- safe[safe$year %in% t,]
	
for (st in unique(safe.time$state)) {
	e <- safe.time[safe.time$state==st,]

	rep.state.safe[[st]] <- mean(e$rep_safe, na.rm=TRUE)
	dem.state.safe[[st]] <- mean(e$dem_safe, na.rm=TRUE)
	battleground.state[[st]] <- mean(e$battleground, na.rm=TRUE)
	ecvotes[[st]] <- mean(e$ecvotes, na.rm=TRUE)
}
state.sum[[tp]] <-  cbind.data.frame(do.call(rbind, ecvotes), do.call(rbind, dem.state.safe), do.call(rbind, rep.state.safe), do.call(rbind, battleground.state))
colnames(state.sum[[tp]]) <- c("ecvotes","dem.safe", "rep.safe", "battleground")
}


state.sum[[1]]$code <- ifelse(state.sum[[1]][, "battleground"] < 0.5, ifelse(state.sum[[1]][, "rep.safe"] < 0.5, ifelse(state.sum[[1]][, "rep.safe"] > state.sum[[1]][, "dem.safe"], "Lean Republican", ifelse(state.sum[[1]][, "dem.safe"] > 0.5, "Strong Democratic", "Lean Democratic")), "Strong Republican"), "Battleground")

state.sum[[2]]$code <- ifelse(state.sum[[2]][, "battleground"] < 0.5, ifelse(state.sum[[2]][, "rep.safe"] < 0.5, ifelse(state.sum[[2]][, "rep.safe"] > state.sum[[2]][, "dem.safe"], "Lean Republican", ifelse(state.sum[[2]][, "dem.safe"] > 0.5, "Strong Democratic", "Lean Democratic")), "Strong Republican"), "Battleground")

state.sum[[3]]$code <- ifelse(state.sum[[3]][, "battleground"] < 0.5, ifelse(state.sum[[3]][, "rep.safe"] < 0.5, ifelse(state.sum[[3]][, "rep.safe"] > state.sum[[3]][, "dem.safe"], "Lean Republican", ifelse(state.sum[[3]][, "dem.safe"] > 0.5, "Strong Democratic", "Lean Democratic")), "Strong Republican"), "Battleground")

state.sum[[4]]$code <- ifelse(state.sum[[4]][, "battleground"] < 0.5, ifelse(state.sum[[4]][, "rep.safe"] < 0.5, ifelse(state.sum[[4]][, "rep.safe"] > state.sum[[4]][, "dem.safe"], "Lean Republican", ifelse(state.sum[[4]][, "dem.safe"] > 0.5, "Strong Democratic", "Lean Democratic")), "Strong Republican"), "Battleground")

state.sum[[5]]$code <- ifelse(state.sum[[5]][, "battleground"] < 0.5, ifelse(state.sum[[5]][, "rep.safe"] < 0.5, ifelse(state.sum[[5]][, "rep.safe"] > state.sum[[5]][, "dem.safe"], "Lean Republican", ifelse(state.sum[[5]][, "dem.safe"] > 0.5, "Strong Democratic", "Lean Democratic")), "Strong Republican"), "Battleground")

for (tp in 1:length(time.periods)) {
	state.sum[[tp]]$classification <- ifelse(state.sum[[tp]]$code == "Strong Republican", 2, ifelse(state.sum[[tp]]$code == "Lean Republican", 1, ifelse(state.sum[[tp]]$code == 
		"Battleground", 0, ifelse(state.sum[[tp]]$code == "Lean Democratic", -1, ifelse(state.sum[[tp]]$code == "Strong Democratic", -2, NA)))))
}
lapply(state.sum, FUN = function(i) weighted.mean(i[, "classification"], i[, "ecvotes"]))
lapply(state.sum, FUN = function(i) sum((i[, "ecvotes"]/sum(i[, "ecvotes"])) * (i[, "classification"] - weighted.mean(i[, "classification"], i[, "ecvotes"]))^2))

lapply(state.sum, FUN = function(i) length(i[, "classification"][i[, "classification"]==0])/length(i[, "classification"]))
lapply(state.sum, FUN = function(i) sum(i[,"ecvotes"][i[, "battleground"]>0])/sum(i[,"ecvotes"]))

#### AVERAGE COMPETITIVE ECVOTES BY CYCLE
average.competitive <- data.frame(cycle=cycles, mean=NA, sd=NA)
	n <- 1
for (time in time.periods) {

average.competitive[n,2] <- mean(summary.plusminus3$Competitive.ECvotes[summary.plusminus3$Year %in% time] / summary.plusminus3$Total.ECvotes[summary.plusminus3$Year %in% time])
average.competitive[n,3] <- sd(summary.plusminus3$Competitive.ECvotes[summary.plusminus3$Year %in% time]/summary.plusminus3$Total.ECvotes[summary.plusminus3$Year %in% time])
n <- n+1
}
average.competitive


coalition.time <- cbind(
rbind(
	sum(state.sum[[1]]$ecvotes[state.sum[[1]]$code=="Strong Republican"]) / sum(state.sum[[1]]$ecvotes),
sum(state.sum[[1]]$ecvotes[state.sum[[1]]$code=="Lean Republican"]) / sum(state.sum[[1]]$ecvotes),
sum(state.sum[[1]]$ecvotes[state.sum[[1]]$code=="Battleground"]) / sum(state.sum[[1]]$ecvotes),
sum(state.sum[[1]]$ecvotes[state.sum[[1]]$code=="Lean Democratic"]) / sum(state.sum[[1]]$ecvotes),
sum(state.sum[[1]]$ecvotes[state.sum[[1]]$code=="Strong Democratic"]) / sum(state.sum[[1]]$ecvotes)),
rbind(
sum(state.sum[[2]]$ecvotes[state.sum[[2]]$code=="Strong Republican"]) / sum(state.sum[[2]]$ecvotes),
sum(state.sum[[2]]$ecvotes[state.sum[[2]]$code=="Lean Republican"]) / sum(state.sum[[2]]$ecvotes),
sum(state.sum[[2]]$ecvotes[state.sum[[2]]$code=="Battleground"]) / sum(state.sum[[2]]$ecvotes),
sum(state.sum[[2]]$ecvotes[state.sum[[2]]$code=="Lean Democratic"]) / sum(state.sum[[2]]$ecvotes),
sum(state.sum[[2]]$ecvotes[state.sum[[2]]$code=="Strong Democratic"]) / sum(state.sum[[2]]$ecvotes)),
rbind(
sum(state.sum[[3]]$ecvotes[state.sum[[3]]$code=="Strong Republican"]) / sum(state.sum[[3]]$ecvotes),
sum(state.sum[[3]]$ecvotes[state.sum[[3]]$code=="Lean Republican"]) / sum(state.sum[[3]]$ecvotes),
sum(state.sum[[3]]$ecvotes[state.sum[[3]]$code=="Battleground"]) / sum(state.sum[[3]]$ecvotes),
sum(state.sum[[3]]$ecvotes[state.sum[[3]]$code=="Lean Democratic"]) / sum(state.sum[[3]]$ecvotes),
sum(state.sum[[3]]$ecvotes[state.sum[[3]]$code=="Strong Democratic"]) / sum(state.sum[[3]]$ecvotes)),
rbind(
sum(state.sum[[4]]$ecvotes[state.sum[[4]]$code=="Strong Republican"]) / sum(state.sum[[4]]$ecvotes),
sum(state.sum[[4]]$ecvotes[state.sum[[4]]$code=="Lean Republican"]) / sum(state.sum[[4]]$ecvotes),
sum(state.sum[[4]]$ecvotes[state.sum[[4]]$code=="Battleground"]) / sum(state.sum[[4]]$ecvotes),
sum(state.sum[[4]]$ecvotes[state.sum[[4]]$code=="Lean Democratic"]) / sum(state.sum[[4]]$ecvotes),
sum(state.sum[[4]]$ecvotes[state.sum[[4]]$code=="Strong Democratic"]) / sum(state.sum[[4]]$ecvotes)),
rbind(
sum(state.sum[[5]]$ecvotes[state.sum[[5]]$code=="Strong Republican"]) / sum(state.sum[[5]]$ecvotes),
sum(state.sum[[5]]$ecvotes[state.sum[[5]]$code=="Lean Republican"]) / sum(state.sum[[5]]$ecvotes),
sum(state.sum[[5]]$ecvotes[state.sum[[5]]$code=="Battleground"]) / sum(state.sum[[5]]$ecvotes),
sum(state.sum[[5]]$ecvotes[state.sum[[5]]$code=="Lean Democratic"]) / sum(state.sum[[5]]$ecvotes),
sum(state.sum[[5]]$ecvotes[state.sum[[5]]$code=="Strong Democratic"]) / sum(state.sum[[5]]$ecvotes)
))
rownames(coalition.time) <- c("Strong Republican", "Lean Republican", "Battleground", "Lean Democratic", "Strong Democratic")
colnames(coalition.time) <- c("1868-1892", "1896-1928", "1932-1964", "1968-1988", "1992-2016")
coalition.time
# barplot(coalition.time, col=c("dark red", "red", "magenta", "blue", "dark blue"), beside=T)

overtime_non_competitive <- numeric()
	for (yr in unique(safe$year)) {
overtime_non_competitive <- rbind(overtime_non_competitive, cbind.data.frame(year= yr,
rep_non_competitive= sum(safe$rep_safe[safe$year==yr] * safe$ecvotes[safe$year==yr])/sum(safe$ecvotes[safe$year==yr]), 
dem_non_competitive= sum(safe$dem_safe[safe$year==yr] * safe$ecvotes[safe$year==yr])/sum(safe$ecvotes[safe$year==yr]), 
battleground= sum(safe$battleground[safe$year==yr] * safe$ecvotes[safe$year==yr])/sum(safe$ecvotes[safe$year==yr])))
	}

# ### Average for each Party Cycle
	# party.cycle.ave <- rbind(
	# cbind(mean(overtime_non_competitive$rep_non_competitive[overtime_non_competitive$year %in% seq(1860,1892,4)]),
	# mean(overtime_non_competitive$dem_non_competitive[overtime_non_competitive$year %in% seq(1860,1892,4)]),
	# mean(overtime_non_competitive$battleground[overtime_non_competitive$year %in% seq(1860,1892,4)])),
	
	# cbind(mean(overtime_non_competitive$rep_non_competitive[overtime_non_competitive$year %in% seq(1896,1928,4)]),
	# mean(overtime_non_competitive$dem_non_competitive[overtime_non_competitive$year %in% seq(1896,1928,4)]),
	# mean(overtime_non_competitive$battleground[overtime_non_competitive$year %in% seq(1896,1928,4)])),
	
	# cbind(mean(overtime_non_competitive$rep_non_competitive[overtime_non_competitive$year %in% seq(1932,1964,4)]),
	# mean(overtime_non_competitive$dem_non_competitive[overtime_non_competitive$year %in% seq(1932,1964,4)]),
	# mean(overtime_non_competitive$battleground[overtime_non_competitive$year %in% seq(1932,1964,4)])),
	
	# cbind(mean(overtime_non_competitive$rep_non_competitive[overtime_non_competitive$year %in% seq(1968,1988,4)]),
	# mean(overtime_non_competitive$dem_non_competitive[overtime_non_competitive$year %in% seq(1968,1988,4)]),
	# mean(overtime_non_competitive$battleground[overtime_non_competitive$year %in% seq(1968,1988,4)])),	
	
	# cbind(mean(overtime_non_competitive$rep_non_competitive[overtime_non_competitive$year %in% seq(1992,2016,4)]),
	# mean(overtime_non_competitive$dem_non_competitive[overtime_non_competitive$year %in% seq(1992,2016,4)]),
	# mean(overtime_non_competitive$battleground[overtime_non_competitive$year %in% seq(1992,2016,4)]))
	# )
# rownames(party.cycle.ave) <- c("1868-1892", "1896-1928", "1932-1964", "1968-1988", "1992-2016")
# colnames(party.cycle.ave) <- c("Republican Non-Competitive", "Democratic Non-Competitive", "Battleground")


######## - Additional Tests: Logit Model

### +- 3%
invlogit <- function (x) {1/(1+exp(-x))}
repwin <- 1* (bramskilgour.plusminus3$rep.ec.outcome>.5)
e <- data.frame(cbind(uniqueyr, repwin, rep.BK$noncompetitiveadvantage, rep.BK$winningness))
colnames(e) <- c("year", "repwin", "NonCompetitiveAdvantage", "Winningness")
fit.1 <- glm(repwin ~ NonCompetitiveAdvantage, data=e, family=binomial(link="logit"))
fit.2 <- glm(repwin ~ Winningness, data=e, family=binomial(link="logit"))
electionpredictions <- invlogit(predict(fit.1))
winningnesspredictions <- invlogit(predict(fit.2))
election.logit3 <- cbind(uniqueyr, round(electionpredictions, digits=3)*100, round(rep.BK5$EC.Outcome.REP, digits=3)*100)
colnames(election.logit3) <- c("Year", "Prediction", "Actual")

predicted <- as.numeric(predict.glm(fit.1, type="response")>.5)
correct <- as.numeric(predicted==repwin)
100*(table(correct)/sum(table(correct))) #Model correctly classifies 94.7% of elections

winningnesspredicted <- as.numeric(predict.glm(fit.2, type="response")>.5)
correctw <- as.numeric(winningnesspredicted==repwin)
100*(table(correctw)/sum(table(correctw))) #Model correctly classifies 94.7% of elections

### +-5%
invlogit <- function (x) {1/(1+exp(-x))}
repwin <- 1* (bramskilgour.plusminus5$rep.ec.outcome>.5)
e <- data.frame(cbind(uniqueyr, repwin, rep.BK5$NonCompetitiveAdvantage, rep.BK5$Winningness))
colnames(e) <- c("year", "repwin", "NonCompetitiveAdvantage", "Winningness")
fit.3 <- glm(repwin ~ NonCompetitiveAdvantage, data=e, family=binomial(link="logit"))
fit.4 <- glm(repwin ~ Winningness, data=e, family=binomial(link="logit"))
electionpredictions <- invlogit(predict(fit.3))
election.logit5 <- cbind(uniqueyr, round(electionpredictions, digits=3)*100, round(rep.BK5$EC.Outcome.REP, digits=3)*100)
colnames(election.logit5) <- c("Year", "Prediction", "Actual")

predicted5 <- as.numeric(predict.glm(fit.3, type="response")>.5)
correct5 <- as.numeric(predicted5==repwin)
100*(table(correct5)/sum(table(correct5))) #Model correctly classifies 89.4% of elections


# winningnesspredicted5 <- as.numeric(predict.glm(fit.4, type="response")>.5)
# correct5w <- as.numeric(winningnesspredicted5 ==repwin)
# 100*(table(correct5w)/sum(table(correct5w))) #Model correctly classifies 73.7% of elections



stargazer(election.logit3, type="text", digits=1, summary=FALSE, digit.separator="", out="Tables/appendix4a.txt", rownames=FALSE, title="±3% Non-Competitive Advantage Logit Model Predictions")
stargazer(election.logit5, type="text", digits=1, summary=FALSE, digit.separator="", out="Tables/appendix4a2.txt", rownames=FALSE, title="±5% Non-Competitive Advantage Logit Model Predictions")


jitter.binary <- function(a, jitt=.05){
ifelse (a==0, runif (length(a), 0, jitt), runif (length(a), 1-jitt, 1))
}

j <- jitter.binary (e$repwin)
## pdf("logit5percent.# pdf", width=6, height=4)
par(mar=c(3,3,1,1))
plot(e$NonCompetitiveAdvantage, j, type="n", cex=0.35, xlab="", ylab="", xaxt="n", yaxt="n")
text(e$NonCompetitiveAdvantage, j, labels=e$year, cex=0.45)
curve (invlogit (coef(fit.3)[1] + coef(fit.3)[2]*x), add=TRUE)
axis(side=1, at=seq(-1,1,.25), labels=seq(-100,100, 25), cex.axis=0.65)
axis(side=2, las=2, at=seq(0,1,.25), labels=seq(0,100, 25), cex.axis=0.65)
mtext(side=1, line=2, "Non-Competitive Advantage", cex=0.65)
mtext(side=2, line=2.25, "P(Republican Victory)", cex=0.65)
## dev.off()


NCregressionsRestricted <-  data.frame(noncompetitiveadvantage = rep.BK.restricted$noncompetitiveadvantage, RepECOutcome = rep.BK.restricted$EC.Outcome.REP, winningness= rep.BK.restricted$winningness)
summary(nca_reg_restricted <- lm(RepECOutcome ~ noncompetitiveadvantage, data = NCregressionsRestricted))
#summary(nca_reg <- lm(RepECOutcome ~ noncompetitiveadvantage + competitive, data = NCregressions))
summary(w_reg_restricted <- lm(RepECOutcome ~ winningness, data = NCregressionsRestricted))

stargazer(nca_reg_restricted, w_reg_restricted, type="text", omit.stat=c("rsq", "ser"), style="AJPS", title="Restricted Models, Regressions with Non-Competitive Advantage vs Winningness to Predict Final Republican EC seat share", notes="Note: All Regressions calculated using plus or minus 3% as the definition of competitive state.")


dem.cor5.restricted5 <- cor(dem.BK5.restricted, use="pairwise.complete.obs")
rep.cor5.restricted5 <- cor(rep.BK5.restricted, use="pairwise.complete.obs")

stargazer(dem.cor5, rep.cor5, type="text", title=c("Democratic Correlations [Full Model]", "Republican Correlations [Full Model]"), notes="Notes: Competitive State defined as being Plus or Minus 5%", covariate.labels=c("","Winningness","Vulnerability", "Fragility", "Non Competitive Advantage", "EC Outcomes"))
stargazer(dem.cor5.restricted5, rep.cor5.restricted5, type="text", title=c("Democratic Correlations [Restricted Model]", "Republican Correlations [Restricted Model]"),  notes="Notes: Competitive State defined as being Plus or Minus 5%", covariate.labels=c("","Winningness","Vulnerability", "Fragility", "Non Competitive Advantage", "EC Outcomes"))


