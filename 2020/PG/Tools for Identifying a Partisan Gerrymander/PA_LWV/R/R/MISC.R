# 2018 General Election Results
  # Precinct File  
    PA_2018 <- read.table("/Users/cervas/Google Drive/Data/Elections/PA 2018 election results/ERStat_2018_G(151980)_20181220.txt", sep=",")
      colnames(PA_2018) <- c("year", "type", "county", "precinct", "office", "district", "party", "ballot_pos", "office_code", "party_code", "cand_num", "first_name", "last_name", "middle_name", "suffix", "votes", "yes_votes", "no_votes", "USHouse_district", "ST_Senate_distric", "ST_House_district", "munic_type", "munic_name", "mun_code1", "mun_name1", "mun_code2", "mun_name2", "bicounty_code", "mcd_code", "fips", "vtd", "ballotquest", "record_type", "previous_precinct", "prevous_USHouse", "previous_STSenate", "previous_STHouse")
    
    PA_2018_HOUSE <- PA_2018[PA_2018$office_code %in% c("USC"),]
    PA_2018_HOUSE <- PA_2018_HOUSE[PA_2018_HOUSE$party_code %in% c("DEM", "REP"),]
    PA2018dem <- PA_2018_HOUSE[PA_2018_HOUSE$party_code %in% c("DEM"),]
    PA2018rep <- PA_2018_HOUSE[PA_2018_HOUSE$party_code %in% c("REP"),]
    PA2018 <- merge(PA2018dem, PA2018rep, by = "precinct", all.x = T, all.y = T)
    PA2018$code <- paste0(PA2018$precinct, PA2018$county.x, PA2018$district.x)
    PA2018 <- PA2018[!duplicated(PA2018$code),]
  percent(two_party(sum(PA2018$votes.x, na.rm = T), sum(PA2018$votes.y, na.rm = T)))

# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
#### Presidential returns at CD level, 1956-2016
pres <- read.csv("/Users/cervas/Google Drive/Data/Elections/Presidential/FINAL Pres by CD.csv")
	colnames(pres)[colnames(pres)=="dem"] <- "PresDEM"
	colnames(pres)[colnames(pres)=="rep"] <- "PresREP"
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••



#### State-Wide Aggregate Election Returns
# 2016 Presidential
DEM2016_pres <- sum(precincts$T16PRESD)
REP2016_pres <- sum(precincts$T16PRESR)
  percent(two_party(DEM2016_pres, REP2016_pres))
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

# reg.cong.2016 <- lm(default.unc(PA_house[['2016']]$VOTE) ~ 
#           default.unc(PA_house[['2016']]$REP_lag))
# reg.cong.2014 <- lm(
#           default.unc(PA_house[['2014']]$VOTE) ~ 
#           default.unc(PA_house[['2014']]$REP_lag) )
# reg.cong.2010 <- lm(
#           default.unc(PA_house[['2010']]$VOTE) ~ 
#           default.unc(PA_house[['2010']]$REP_lag) )
# reg.cong.2008 <- lm( 
#           default.unc(PA_house[['2008']]$VOTE) ~ 
#           default.unc(PA_house[['2008']]$REP_lag) )
# reg.cong.2006 <- lm( 
#           default.unc(PA_house[['2006']]$VOTE) ~ 
#           default.unc(PA_house[['2006']]$REP_lag) )
# sigma <- mean(
#   c(
#     arm::sigma.hat(reg.cong.2016),
#     arm::sigma.hat(reg.cong.2014),
#     arm::sigma.hat(reg.cong.2010),
#     arm::sigma.hat(reg.cong.2008),
#     arm::sigma.hat(reg.cong.2006)
#     )
#   )


  
# 50/50 Hypothetical (uniform shift)
    shift(votes.2008.default, w=house.2008.turnout, c=0.5)
      shift(votes.2010.default, w=house.2010.turnout, c=0.5)
        shift(votes.2012.default, w=house.2012.turnout, c=0.5)
          shift(votes.2014.default, w=house.2014.turnout, c=0.5)
            shift(votes.2016.default, w=house.2016.turnout, c=0.5)
              shift(votes.2018.default, w=house.2018.turnout, c=0.5)



### Incumbency Advantage
pres2016 <- pres

pres2016 <- pres2016[, c("abv", "year", "state", "district", "PresDEM", "PresREP")]
cong <- read.csv("https://raw.githubusercontent.com/jcervas/data/master/Elections/House/elections1968_2016.csv")
prescong <- merge(pres, cong, by=c("abv", "district", "year"))
cong2016 <- cong[cong$year=="2016",]
prescong2016 <- merge(pres2016, cong2016, by=c("abv", "district", "year"))
prescong2016$demwin <- find.winner((prescong2016$dem/(prescong2016$dem + prescong2016$rep)))

prescong2016$dem[is.na(prescong2016$dem)] <- 0
prescong2016$rep[is.na(prescong2016$rep)] <- 0

prescong$dem[prescong$dem==0] <- NA
prescong$rep[prescong$rep==0] <- NA

mean(two_party(prescong2016$PresDEM, prescong2016$PresREP) - two_party(prescong2016$dem, prescong2016$rep) , na.rm=T) * 100

mean((prescong2016$PresDEM[prescong2016$demwin==1]/(prescong2016$PresDEM[prescong2016$demwin==1] + prescong2016$PresREP[prescong2016$demwin==1])) - (prescong2016$dem[prescong2016$demwin==1]/(prescong2016$dem[prescong2016$demwin==1] + prescong2016$rep[prescong2016$demwin==1])) , na.rm=T) * 100
mean((prescong2016$PresREP[prescong2016$demwin==0]/(prescong2016$PresDEM[prescong2016$demwin==0] + prescong2016$PresREP[prescong2016$demwin==0])) - (prescong2016$rep[prescong2016$demwin==0]/(prescong2016$dem[prescong2016$demwin==0] + prescong2016$rep[prescong2016$demwin==0])) , na.rm=T) * 100

 returns <- runif(100)



pdf(paste0("Papers/(2019) Tools for Identifying Partisan Gerrymandering (PA)/Figures/prescong_scatterplots.pdf"), width=12, height=6)
par(mfrow=c(1,2),
  mar=c(3,3.5,0,0),
  pty="s")
plot(x=0, y=0, xlim=c(0,1), ylim=c(0,1), xlab="", ylab="", xaxt="n", yaxt="n", col="white", bty="n")
mtext(side=1, line=2, "Presidential Votes Share 2016", cex=0.65)
mtext(side=2, line=2.5, "Congressional Vote Share 2016", cex=0.65)
axis(side=2, las=2, cex.axis=0.65, at=pretty(returns), lab=paste0(pretty(returns)*100, "%"))
axis(side=1, cex.axis=0.65, at=pretty(returns), lab=paste0(pretty(returns)*100, "%"))
abline(0,1, lty=4, col="gray20",lwd=1)
points(x=two_party(prescong$PresDEM[prescong$year=="2016"], prescong$PresREP[prescong$year=="2016"]), y=two_party(prescong$dem[prescong$year=="2016"], prescong$rep[prescong$year=="2016"]), pch=19, col = "#33333333")
    # rect(-.05,-.05,0,1.05, col = rgb(0.1,0.1,0.1,1/2), density=40, border = "transparent") #left
    # rect(0,0,1.05 ,-.05, col = rgb(0.1,0.1,0.1,1/2), density=40, border = "transparent") #bottom
    # rect(1,0,1.05,1.05, col = rgb(0.1,0.1,0.1,1/2), density=40, border = "transparent") #right
    # rect(0,1,1,1.05, col = rgb(0.1,0.1,0.1,1/2), density=40, border = "transparent") #top
plot(x=0, y=0, xlim=c(0,1), ylim=c(0,1), xlab="", ylab="", xaxt="n", yaxt="n", col="white", bty="n")
mtext(side=1, line=2, "Presidential Votes Share 1956-2016", cex=0.65)
mtext(side=2, line=2.5, "Congressional Vote Share 1956-2016", cex=0.65)
axis(side=2, las=2, cex.axis=0.65, at=pretty(returns), lab=paste0(pretty(returns)*100, "%"))
axis(side=1, cex.axis=0.65, at=pretty(returns), lab=paste0(pretty(returns)*100, "%"))
abline(0,1, lty=4, col="gray20",lwd=1)
points(x=two_party(prescong$PresDEM, prescong$PresREP), y=two_party(prescong$dem, prescong$rep), pch=19, col = "#33333333")

dev.off()


precincts[precincts==0] <- NA
precincts[precincts==0] <- NA

prec_list <- list(
cbind(precincts$T16PRESD, precincts$T16PRESR),
cbind(precincts$T16SEND, precincts$T16SENR),
cbind(precincts$T16ATGD, precincts$T16ATGR),
cbind(precincts$T16AUDD, precincts$T16AUDR),
cbind(precincts$T16TREASD, precincts$T16TREASR),
cbind(precincts$T16PRESD+precincts$T16SEND+precincts$T16ATGD+precincts$T16AUDD+precincts$T16TREASD, precincts$T16PRESR+precincts$T16SENR+precincts$T16ATGR+precincts$T16AUDR+precincts$T16TREASR)
)
race <- c("Presidential", "US Senate", "Attorneys General", "Auditor", "Treasurer", "Composite")


pdf(paste0("Papers/(2019) Tools for Identifying Partisan Gerrymandering (PA)/Figures/cong_statewide_scatterplots.pdf"), width=12, height=8)
par(mfrow=c(2,3),
  mar=c(3,6,1,0.5),
  pty="s")
for (i in 1:6)
{
plot(x=0, y=0, xlim=c(0,1), ylim=c(0,1), xlab="", ylab="", xaxt="n", yaxt="n", col="white", bty="n")
mtext(side=1, line=2, paste(race[i], "Vote Share 2016"), cex=0.70)
if (i == 1) { mtext(side=2, line=3.75, "Congressional Vote Share 2016", cex=0.85) }
if (i == 4) { mtext(side=2, line=3.75, "Congressional Vote Share 2016", cex=0.85) }
axis(side=2, las=2, cex.axis=1, at=pretty(returns), lab=paste0(pretty(returns)*100, "%"))
axis(side=1, cex.axis=1, at=pretty(returns), lab=paste0(pretty(returns)*100, "%"))
abline(0,1, lty=4, col="gray20",lwd=1)
points(x=two_party(prec_list[[i]][,1], prec_list[[i]][,2]), y=two_party(precincts$T16CONGD, precincts$T16CONGR), pch=19, col = "#33333333", cex=precincts$TAPERSONS/sum(precincts$TAPERSONS, na.rm=T)*2000) 
    rect(-.05,-.05,0,1.05, col = rgb(0.1,0.1,0.1,1/2), density=40, border = "transparent") #left
    rect(0,0,1.05 ,-.05, col = rgb(0.1,0.1,0.1,1/2), density=40, border = "transparent") #bottom
    rect(1,0,1.05,1.05, col = rgb(0.1,0.1,0.1,1/2), density=40, border = "transparent") #right
    rect(0,1,1,1.05, col = rgb(0.1,0.1,0.1,1/2), density=40, border = "transparent") #top
}
dev.off()

prescong[prescong$year.x=='2014',]


prescong2016 <- merge(pres2016[pres2016$year=="2016",], house, by=c("abv", "district", "year"))
prescong2016 <- prescong2016[order(prescong2016$state.y),]
prescong2016 <- cbind.data.frame(prescong2016, ptynow=find.winner(house_2014$dpres/100))
summary(reg_prescong2016_1 <- lm(two_party(dem,rep) ~ two_party(PresDEM,PresREP), data=prescong2016))
summary(reg_prescong2016_2 <- lm(two_party(dem,rep) ~ two_party(PresDEM,PresREP) + inc3, data=prescong2016))
summary(reg_prescong2016_3 <- lm(two_party(dem,rep) ~ two_party(PresDEM,PresREP) + inc3 + ptynow, data=prescong2016))

### Table B - Incumbency Advantage in 2016
stargazer(reg_prescong2016_1, reg_prescong2016_2, reg_prescong2016_3, 
      type="text", 
      omit.stat=c("rsq", "ser"), 
      style="AJPS", 
      covariate.labels=c("Presidential Vote", "Incumbency", "Party"), 
      dep.var.labels="",
      title="Incumbency Advantage in 2016", 
      notes="Note: All Regressions calculated using Democratic share of the two-party vote.")



 #### Additional Plot Options
 
D <- dt[,3]
R <- dt[,4]
    total <- sum(D)+sum(R)
    dem_wasted <- ifelse(D>R, D[D>R] - R[D>R], D[D<R])
    rep_wasted <- ifelse(D<R, R[D<R] - D[D<R], R[D>R])

Dcumsum <- cumsum(dem_wasted[order(-dem_wasted)])
Rcumsum <- cumsum(rep_wasted[order(-rep_wasted)])
Tcumsum <- (sum(dem_wasted)+sum(rep_wasted))
temp <- Dcumsum - ((Rcumsum+Rcumsum)/2)
Dtem <- temp[temp>0]
Rtem <- abs(temp[temp<0])
Rtem <- Rtem[order(-Rtem)]
# Plot Wasted Votes
plot(1:length(Dcumsum), Dcumsum/Tcumsum, type="l", xlim=c(1,18), ylim=c(0,1), bty="n", ylab="", cex.lab=.85, cex.axis=.65, xaxt="n", xlab="")
lines(1:length(Dcumsum), Rcumsum/Tcumsum, lty=3, col="gray50", add=TRUE)
 axis(side=1, las=1, at=c(1,18), lab=c("Most Democratic", "Least Democratic"), cex.axis=.65)
#points(1:length(Rtem), cumsum(Rtem), type="l", lty=3)
abline(v=9, lty=3, col="gray70")
abline(v=seq(1,18), col="gray80", lty=3)
abline(h=seq(0,1, .2), col="gray80", lty=3)
abline(h= .5, lty=2, col="gray40")
abline(v= 9, lty=2, col="gray40")
 mtext(side=2, line=2.5, "Percent of Waste Votes", cex=.65)
 # text(12, total/2, pos=1, expression(italic("Half the Wasted Votes")), cex=.6, srt=0) 
 text(9.25, .5, pos=1, expression(italic("Middle District")), cex=.6, srt=90) 
 text(1:18, 1.05, pos=1, 1:18, cex=.6, srt=0) 

dt$Dsum - dt$Rsum[order(-dt$Rsum)]



temp <- dt$Dsum / ((dt$Dsum+dt$Rsum))
Dtem <- temp[9:1]
Rtem <- abs(temp[10:18])

# Difference in Share of the Two Party vote by Competitiveness
axis1 <- c(0, .25, .5)
plot(Dtem-Rtem, type="l", bty="n", xaxt="n", yaxt="n", xlim=c(1,9), xlab="", ylab="")
 axis(side=1, las=1, at=c(1,9), lab=c("Most Competitive", "Most Partisan"), cex.axis=.65)
 axis(side=2, las=2, at= pretty(axis1), lab=paste0(pretty(axis1)*100, "%"), cex.axis=.65)
 mtext(side=2, line=2.5, "Democratic Share - Republican Share", cex=.65)
grid(NULL, NULL, lwd=.5, lty=3, col="gray80")


barplot(t(cbind(temp, 1-temp )))
abline(h=0.5, lty=3, col="gray70")
 axis(side=1, las=1, at=c(0,21.75), lab=c("Most Democratic", "Least Democratic"), cex.axis=.65)








#### Folded Gradiant ####

# district_percent <- r(district_votes.2016*100, digits=0)

# pdf(paste0(directory,"/barplotPartisanship2.pdf"), width=8, height=8)
# par(mfrow=c(2,4),
#   mar=c(2,0,1,0))
#   for (i in 1:8) 
#       {
#         plot(x=c(-.25,1.35), y=c(0,9), col="white", axes=F)
#         rect(0,0,.45,1, col = paste0("grey", abs(100-district_per[9,i]*2)), border = "white")
#         rect(0,1,.45,2, col = paste0("grey", abs(100-district_per[8,i]*2)), border = "white")
#         rect(0,2,.45,3, col = paste0("grey", abs(100-district_per[7,i]*2)), border = "white")
#         rect(0,3,.45,4, col = paste0("grey", abs(100-district_per[6,i]*2)), border = "white")
#         rect(0,4,.45,5, col = paste0("grey", abs(100-district_per[5,i]*2)), border = "white")
#         rect(0,5,.45,6, col = paste0("grey", abs(100-district_per[4,i]*2)), border = "white")
#         rect(0,6,.45,7, col = paste0("grey", abs(100-district_per[3,i]*2)), border = "white")
#         rect(0,7,.45,8, col = paste0("grey", abs(100-district_per[2,i]*2)), border = "white")
#         rect(0,8,.45,9, col = paste0("grey", abs(100-district_per[1,i]*2)), border = "white")
#         rect(0.55,8,1,9, col = paste0("grey", abs(100-district_per[18,i]*2)), border = "white")
#         rect(0.55,7,1,8, col = paste0("grey", abs(100-district_per[17,i]*2)), border = "white")
#         rect(0.55,6,1,7, col = paste0("grey", abs(100-district_per[16,i]*2)), border = "white")
#         rect(0.55,5,1,6, col = paste0("grey", abs(100-district_per[15,i]*2)), border = "white")
#         rect(0.55,4,1,5, col = paste0("grey", abs(100-district_per[14,i]*2)), border = "white")
#         rect(0.55,3,1,4, col = paste0("grey", abs(100-district_per[13,i]*2)), border = "white")
#         rect(0.55,2,1,3, col = paste0("grey", abs(100-district_per[12,i]*2)), border = "white")
#         rect(0.55,1,1,2, col = paste0("grey", abs(100-district_per[11,i]*2)), border = "white")
#         rect(0.55,0,1,1, col = paste0("grey", abs(100-district_per[10,i]*2)), border = "white")

#         mtext(side=3,line=-.25, plan_names[i], cex=.75)
#         text(.25,-.25, "DEM")
#         text(.75,-.25, "REP")
#         shadowtext(rep(.25,9),seq(.5,8.5,1), paste0(district_percent[9:1,i], "%"), cex=.8, col="black", bg="gray90")
#         shadowtext(rep(.5,9),seq(.5,8.5,1), "-", cex=.8, col="black", bg="gray90")
#         shadowtext(rep(.75,9),seq(.5,8.5,1), paste0(100-district_percent[10:18,i], "%"), cex=.8, col="black", bg="gray90")
#         shadowtext(rep(1.05,9),seq(.5,8.5,1), "=", cex=.8, col="black", bg="gray90")
#         shadowtext(rep(1.25,9),seq(.5,8.5,1), paste0(district_percent[9:1,i]-(100-district_percent[10:18,i]), "%"), cex=.8, col="black", bg="gray90")
#       }

# plot(x=c(0,1), y=c(-200,400), col="white", axes=F)
#   for (j in 0:99)
#     {
#      rect(.4,j,.6,(j+1), col = paste0("grey", j+1), border = "transparent")
#     }
#   for (j in 99:0)
#     {
#    rect(.4,j+100,.6,j+101, col = paste0("grey", abs(j-100)), border = "transparent")
#     }
#       mtext(side=4,line=-5.25,"<---- More Democratic", cex=.75, adj=.5, at=-150)
#       mtext(side=4,line=-5.25,"More Republican ---->", cex=.75, adj=.5, at=350)
#       mtext(side=4, las=2, line=-6,"50/50", cex=.5, adj=.5, at=100)
#   axis(side=4, las=1, at=c(0, 25, 50, 75, 100, 125, 150, 175, 200), line=-2.5, labels=c("100%", "75%", "50%", "25%", "0%", "25%", "50%", "75%", "100%"), cex.axis=.75)
# dev.off()

# plot(x=c(0,1), y=c(0,18), col="white", axes=F)
# rect(0,0.45,.5,.55, col = "black", border = "transparent")
# rect(0,17.45,.5,17.55, col = "black", border = "transparent")
# rect(0.45,.5,.5, 17.55, col = "black", border = "transparent")
# shadowtext(.5,9, pos=1, srt=90, label="Compare", cex=1.5, col="black", bg="gray90")




 # =================================================================
# -- PLOTS -- -- PLOTS -- -- -- PLOTS -- -- -- PLOTS -- -- -- PLOTS 
# =================================================================
# Bar Graph
# Strong Dem, Lean Dem, Lean Rep, Strong Rep 2016 Average Statewide Elections

# Old <-  t(percent(matrix(c(4, 1, 5, 8), nrow=1)))
# Remedial <- t(percent(matrix(c(5, 4, 2, 7), nrow=1)))
# Cervas1 <- t(percent(matrix(c(5,3,3,7), nrow=1)))
# Cervas2 <- t(percent(matrix(c(5,2,3,8), nrow=1)))
# Cervas3 <- t(percent(matrix(c(5,4,2,7), nrow=1)))
# DailyKos <- t(percent(matrix(c(5,3,2,8), nrow=1)))
# Wolf <- t(percent(matrix(c(5,2,3,8), nrow=1)))
# Joint <- t(percent(matrix(c(4, 3, 3, 8), nrow=1)))


# colorbarplot <- c("gray10", "gray20", "gray20", "gray10")

# pdf(paste0("Papers/Grofman Cervas Gerrymandering 2018/Figures/Categoricalbarplot.pdf"), width=6, height=8)
# par(mfrow=c(10,1),
  # mar=c(1,.5,1.5,1.5))
# barplot(Old , col= colorbarplot, border="white", axes=F, horiz=T)
# mtext(side=3, las=1, line=0, text="111th Congress", cex=1)

# barplot(Remedial , col= colorbarplot, border="white", axes=F, horiz=T)
# mtext(side=3, las=1, line=0, text="Remedial", cex=1)

# barplot(Cervas1 , col= colorbarplot, border="white", axes=F, horiz=T)
# mtext(side=3, las=1, line=0, text="Cervas-Grofman V1", cex=1)

# barplot(Cervas2 , col= colorbarplot, border="white", axes=F, horiz=T)
# mtext(side=3, las=1, line=0, text="Cervas-Grofman V2", cex=1)

# barplot(Cervas3 , col= colorbarplot, border="white", axes=F, horiz=T)
# mtext(side=3, las=1, line=0, text="Cervas-Grofman V3", cex=1)

# barplot(DailyKos , col= colorbarplot, border="white", axes=F, horiz=T)
# mtext(side=3, las=1, line=0, text="DailyKos", cex=1)

# barplot(Wolf , col= colorbarplot, border="white", axes=F, horiz=T)
# mtext(side=3, las=1, line=0, text="Governor Wolf", cex=1)

# jointbar <- barplot(Joint , col= colorbarplot, border="white", axes=F, horiz=T)
# mtext(side=3, las=1, line=0, text="Joint Legislative", cex=1)

# text(x=c(Joint[1]-1, Joint[1]+Joint[2], Joint[1]+Joint[2]+Joint[3], Joint[1]+Joint[2]+Joint[3]+Joint[4]-1) , y= jointbar[1], labels=c("Strong Democratic", "Lean Democratic", "Lean Republican", "Strong Republican"), col="white", adj=1)

# barplot(Joint , col="white", border="white", axes=F, horiz=T)

# plot(x=0, y=0, xlim=c(0,100), col="white", axes=F, bty="n")
# axis(side=1, las=1, at=c(0, 25, 50, 75 , 100), line=-6, labels=c("0%", "25%", "50%", "75%", "100%"), cex=2)
# dev.off()





