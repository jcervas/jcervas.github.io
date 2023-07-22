low <- 0.03
PredictCompetitive <- data.frame(Year=uniqueyr, OverPredicts=NA, FailedPredict=NA, TotalCompetitive=NA, PercentageCorrect=NA)
for (yr in uniqueyr){
	e <- d[d$year==yr,]
e <- e[,c(1,2,8,9)]
	e1 <- d[d$year==(yr-4),]
e1 <- e1[,c(1,2,8,9)]

	wm <- weighted.mean(e1$pctREP, e1$tptotal)
noncompet <- e[(e$pctREP > competitive.high | e$pctREP < competitive.low) & !is.na(e$pctREP),]
compet <- e[e$pctREP > 0.5-low & e$pctREP < 0.5+low & !is.na(e$pctREP),]


compet2 <- e1[e1$pctREP > wm - low & e1$pctREP < wm + low & !is.na(e1$pctREP),]

a <- merge(compet, compet2, by="state", all.x=TRUE, all.y=TRUE)
length(a$year.x[!is.na(a$year.x)==TRUE])-length(a$year.x[is.na(a$year.x)==TRUE])
length(a$year.y[!is.na(a$year.y)==TRUE])-length(a$year.x[is.na(a$year.x)==TRUE])


PredictCompetitive[PredictCompetitive$Year==yr, "FailedPredict"] <- length(a$year.y[is.na(a$year.y)==TRUE])
PredictCompetitive[PredictCompetitive$Year==yr, "OverPredicts"] <- length(a$year.x[is.na(a$year.x)==TRUE])
PredictCompetitive[PredictCompetitive$Year==yr, "TotalCompetitive"] <- length(compet$year)
PredictCompetitive[PredictCompetitive$Year==yr, "PercentageCorrect"] <- ((length(compet$year) - length(a$year.y[is.na(a$year.y)==TRUE])) / length(compet$year) ) * 100
}
PredictCompetitive <- PredictCompetitive[-1,]
mean(PredictCompetitive$PercentageCorrect)