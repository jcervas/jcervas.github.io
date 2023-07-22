cat(
  "\n
•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
    DATA PREPARATION
•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••\n")
# =================================================================
# -- PLANS 2016 DATA -- -- PLANS 2016 DATA -- -- PLANS 2016 DATA --
# =================================================================
# pa.redist.shp <- readOGR("/Users/cervas/Google Drive/School/UCI/Papers/(2019) Tools for Identifying Partisan Gerrymandering (PA)/PA Redistricting/Shapefiles/PA_REDIST_SHP/PA_REDIST_SHP.shp")
# pa.redist.dta <- pa.redist.shp@data
# pa.redist.dta <- pa.redist.dta[order(pa.redist.dta$enacted),]
# pa.redist.dta <- read.csv("./_data/pa_redist_shp.csv")
pa.redist.dta$enacted <- sprintf("%02d", as.numeric(pa.redist.dta$enacted))
pa.redist.dta$joint <- sprintf("%02d", as.numeric(pa.redist.dta$joint))
pa.redist.dta$court <- sprintf("%02d", as.numeric(pa.redist.dta$court))
pa.redist.dta$gov <- sprintf("%02d", as.numeric(pa.redist.dta$gov))

# cols = c(8:26,30:51);    
# pa.redist.dta[,cols] = apply(pa.redist.dta[,cols], 2, function(x) as.numeric(as.character(x)));
# pa.redist.dta2 <- (merge(pa.redist.dta, cbind.data.frame(enacted = sprintf("%02d", seq(1,18,1)), inc = house.inc.2016), by="enacted"))
# pa.redist.dta2 <- pa.redist.dta2[,c(1,50,51,52,53,4:49)]
# write.csv(pa.redist.dta2, "/Users/cervas/Google Drive/School/UCI/Papers/(2019) Tools for Identifying Partisan Gerrymandering (PA)/_data/pa_redist_shp.csv", row.names=F)


enacted.elections <- composite(pa.redist.dta, "enacted")
find.winner(enacted.elections)
find.winner(composite(pa.redist.dta, "court"))
seats.print(enacted.elections[,1])
seats.print(house.2012.votes)
seats.print(house.2014.votes)
seats.print(house.2016.votes)
mean(default.unc(house.2012.votes))
# PRECINCT RAW VOTES
cong.precinct <- agg.precinct(pa.redist.dta, "T16CONG", "enacted")
# ACTUAL RAW VOTES
cong.actual <- cbind.data.frame(REP=house.rep.2016, DEM=house.dem.2016)

# INTER-ELECTION SWINGS
inter_election <- default.unc(pahouse$VOTE[pahouse$unc + pahouse$unc_lag==0]) - default.unc(pahouse$REP_lag[pahouse$unc + pahouse$unc_lag==0])
min(inter_election, na.rm=T)
max(inter_election, na.rm=T)
mean(inter_election, na.rm=T)



 # •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# - CORRELATION BETWEEN COMPOSITE MEASURE AND ACTUAL RESULTS
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# BASELINE COMPOSITE MEASURE FOR 2016
comp.2016.votes <- enacted.elections[,"COMPOSITE"]
  cat(paste("", collapse = "\n"), "\n")
    (cor(house.2016.votes, comp.2016.votes))
      cat(paste("", collapse = "\n"), "\n")
  cat("CORRELATION BETWEEN COMPOSITE MEASURE AND ACTUAL VOTE RESULTS: \n")
    print(cor(default.unc(house.2016.votes), default.unc(comp.2016.votes)))
      cat(paste("", collapse = "\n"), "\n")

#  MEAN - All races as is
    mean(house.2016.votes - comp.2016.votes)
# MEAN - Imputed 0.25 & 0.75 for uncompetitive
    mean(default.unc(house.2016.votes) - default.unc(comp.2016.votes))
# MEAN - only contested races
    mean(delete.unc(house.2016.votes, 0.25, 0.75) -
      delete.unc(comp.2016.votes, 0.25, 0.75), na.rm=T)

      seats(default.unc(comp.2016.votes))
      shift(default.unc(comp.2016.votes), c = mean(default.unc(house.2016.votes)))
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

#  SIMULATIONS

# Years in which inter-election swings can be measured at the district level.
yrs.nondistricting <- c(2006,2008,2010,2014,2016)
pahouse.non.redist <- pahouse[pahouse$year %in% yrs.nondistricting,]
cong.coef <- array(NA, c(length(yrs.nondistricting),7))
  colnames(cong.coef) <- c("intercept", "RepVoteLag", "incumbency", "incum_lag", "partycontrol", "UNC", "unc_lag")
  rownames(cong.coef) <- yrs.nondistricting
cong.resid.errors <- rep(NA, length(yrs.nondistricting )) #empty vector to store residual errors
base.form <- formula(REPUBLICAN_IMPUTED ~ + REPUBLICAN_LAG_IMPUTED)
base.coef <- array(NA, c(length(yrs.nondistricting),4))
  colnames(base.coef) <- c("intercept", "RepVoteLag", "epsilon", "adj.r.squared")
  rownames(base.coef) <- yrs.nondistricting
#  SIMULATIONS
for (y in 1:length(yrs.nondistricting))
  {
reg <- lm(update(base.form, as.formula(. ~ .)), 
  data = pahouse.non.redist, 
  subset = year == yrs.nondistricting[y])

    base.coef[y,1:2] <- coef(reg)
    base.coef[y,3] <- arm::sigma.hat(reg)
    base.coef[y,4]  <- summary(reg)$adj.r.squared
    # pahouse.non.redist[pahouse.non.redist$year == yrs.nondistricting[y], "regvote"] <- predict(reg.cong.2006.2018)
  }
base.incumb.coef <- array(NA, c(length(yrs.nondistricting),6))
  colnames(base.incumb.coef) <- c("intercept", "RepVoteLag", "Incumbency", "UNC", "epsilon", "adj.r.squared")
  rownames(base.incumb.coef) <- yrs.nondistricting
for (y in 1:length(yrs.nondistricting))
  {
reg <- lm(update(base.form, as.formula(. ~ . + INC + unc)), 
  data=pahouse.non.redist, 
  subset = year == yrs.nondistricting[y])

    base.incumb.coef[y,1:4] <- coef(reg)
    base.incumb.coef[y,5] <- arm::sigma.hat(reg)
    base.incumb.coef[y,6]  <- summary(reg)$adj.r.squared
    # pahouse.non.redist[pahouse.non.redist$year == yrs.nondistricting[y], "regvote"] <- predict(reg.cong.2006.2018)
  }

full.coef <- array(NA, c(length(yrs.nondistricting),9))
  colnames(full.coef) <- c("intercept", "RepVoteLag", "Incumbency", "Incum_lag", "PartyControl", "UNC", "UNC_lag", "epsilon", "adj.r.squared")
  rownames(full.coef) <- yrs.nondistricting
for (y in 1:length(yrs.nondistricting))
  {
reg <- lm(update(base.form, as.formula(. ~ . + INC + INC_lag + partycontrol + unc + unc_lag)), 
  data=pahouse.non.redist, 
  subset = year == yrs.nondistricting[y])

    full.coef[y,1:7] <- coef(reg)
    full.coef[y,8] <- arm::sigma.hat(reg)
    full.coef[y,9]  <- summary(reg)$adj.r.squared
    cong.resid.errors[y] <- arm::sigma.hat(reg)
    # pahouse.non.redist[pahouse.non.redist$year == yrs.nondistricting[y], "regvote"] <- predict(reg.cong.2006.2018)
  }

sigma <- mean(base.incumb.coef[,5])
incum_advant <- mean(base.incumb.coef[,3]) # average incumbency effect 2006-2016

cat("Unexplained Varience: ", percent(sigma))
cat("\nIncumbency Advantage:", percent(incum_advant))

pahouse.2016 <- pahouse.non.redist[pahouse.non.redist$year==2016,]
h2016 <- default.unc(enacted.elections[,"COMPOSITE"][pahouse.2016$unc==0])
c2016 <- default.unc(pahouse.2016$VOTE[pahouse.2016$unc==0] - (pahouse.2016$INC[pahouse.2016$unc==0] * incum_advant))
cat("\n")
cat("Average difference between composite and the congressional election: \n")
cat(percent(mean(abs(h2016-c2016))))
mean(abs(default.unc(enacted.elections[,"COMPOSITE"])-default.unc(pahouse.2016$VOTE - (pahouse.2016$INC * incum_advant))))
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# # =================================================================
# # -- PLANS 2008 DATA -- -- PLANS 2008 DATA -- -- PLANS 2008 DATA --
# # =================================================================
# directory.2008 <- "/Users/cervas/Google Drive/School/UCI/Papers/(2019) Tools for Identifying Partisan Gerrymandering (PA)/PA Redistricting/Data/2008 Plan Comparisons"
# tp <- numeric(0)
# files08 <- list.files(path = directory.2008)
# district_votes_2008 <- numeric()
# pres.districts.votes.2008 <- numeric()
# plans_2008 <- list()
  
#   for (i in 1:length(files08)) 
#     {
#       dt.2008 <- read.csv(paste0(directory.2008, "/", files08[i]))
#         dt.2008<- dt.2008[order(dt.2008$district),]
#       dt.2008$Dsum <- (dt.2008$DEMpres2008 + dt.2008$DEMatt2008 + dt.2008$DEMaud2008 + dt.2008$DEMtre2008)
#       dt.2008$Rsum <- (dt.2008$REPpres2008 + dt.2008$REPatt2008 + dt.2008$REPaud2008 + dt.2008$REPtre2008)
#       dt.2008$sumTotal <- dt.2008$Dsum + dt.2008$Rsum
#       dt.2008$RsumTP <- dt.2008$Rsum / dt.2008$sumTotal
#       dt.2008$RpresTP <- two_party(dt.2008$REPpres2008, dt.2008$DEMpres2008)
#       dt.2008$presTotal <- dt.2008$DEMpres2008 + dt.2008$REPpres2008
#       dt.2008$R_ave_TP <- colMeans(
#                               rbind(
#                                 two_party(dt.2008$REPpres2008, dt.2008$DEMpres2008), 
#                                 two_party(dt.2008$REPatt2008, dt.2008$DEMatt2008), 
#                                 two_party(dt.2008$REPaud2008, dt.2008$DEMaud2008), 
#                                 two_party(dt.2008$REPtre2008, dt.2008$DEMtre2008)))

#       dt.2008 <- dt.2008[order(dt.2008$RsumTP),]
#       plans_2008[[files08[i]]] <- dt.2008


#     cat("# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••")
#     print(files08[i])
#     cat("# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••\n")
#       cat("2008 Composite District Partisanship")
#       print(paste0(sum(find.winner(dt.2008$RsumTP)), "R-", 18-sum(find.winner(dt.2008$RsumTP)), "D"))
#       cat("2008 Presidential Districts")
#       print(paste0(sum(find.winner(dt.2008$RpresTP)), "R-", 18-sum(find.winner(dt.2008$DEMpres2008/(dt.2008$DEMpres2008+dt.2008$REPpres2008))), "D"))
#       cat("2000-2010 Decade Average")
#       print(paste0(sum(find.winner(dt.2008$REPdecadeAVE / (dt.2008$DEMdecadeAVE+dt.2008$REPdecadeAVE))), "R-", 18-sum(find.winner(dt.2008$REPdecadeAVE/(dt.2008$DEMdecadeAVE+dt.2008$REPdecadeAVE))),"D"))
#       cat("2008 Average District Partisanship")
#       print(paste0(sum(find.winner(dt.2008$R_ave_TP)), "R-", 18-sum(find.winner(dt.2008$R_ave_TP)), "D"))
#       cat(paste("", collapse = "\n"), "\n")
#       # print(dt)

#       tp <- rbind(tp, dt.2008$RsumTP)
#       pres.districts.votes.2008 <- cbind(pres.districts.votes.2008, dt.2008$RpresTP)
#       district_votes_2008 <- cbind(district_votes_2008, dt.2008$RsumTP)
#     }

# colnames(district_votes_2008) <- files08
# statewide.contests.2008 <- c("Presidential", "US Senate", "PA Attorneys General", "PA Auditor", "PA Treasurer", "Composite", "Congressional")


# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# c <- proj.2016$`1_111thOldMap.csv`
#     pres16 <- cbind.data.frame(VOTE = two_party(c$REPpres, c$DEMpres), TURNOUT = c$DEMpres + c$REPpres)
#     ussen16 <- cbind.data.frame(VOTE = two_party(c$T16SENR, c$T16SEND), TURNOUT = c$T16SEND + c$T16SENR)
#     atg16 <- cbind.data.frame(VOTE = two_party(c$T16ATGR, c$T16ATGD), TURNOUT = c$T16ATGD + c$T16ATGR)
#     aud16 <- cbind.data.frame(VOTE = two_party(c$T16AUDR, c$T16AUDD), TURNOUT = c$T16AUDD + c$T16AUDR)
#     trea16 <- cbind.data.frame(VOTE = two_party(c$T16TREASR, c$T16TREASD), TURNOUT = c$T16TREASD + c$T16TREASR)
#     comp2016 <-  cbind.data.frame(VOTE = comp.2016.votes, TURNOUT = c$Dsum + c$Rsum)
#     cong2016 <- cbind.data.frame(VOTE = house.2016.votes, TURNOUT = house.2016.turnout)

cat("
•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n
  ")








