# =================================================================
# -- DATA -- -- DATA -- -- DATA -- -- DATA  -- -- DATA  -- -- DATA 
# =================================================================
cat(
	"\n
•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
		CONGRESSIONAL DATA PREPARATION
•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••\n")

# - CONGRESSIONAL ELECTION RESULTS, PA

dist.PA.10 <- seq(1,18,1)
house.dem.2018 <- c(160745, 159600,287610,211524,198639,177704,140813,135603,100204,141668,113876,82825,74733,110051,78327,124109,183162,231472) 
house.rep.2018 <- c(169053 ,42382 ,20387 ,121467 ,106075 ,124124 ,114437 ,112563 ,148723 ,149365 ,163708 ,161047 ,178533 ,151386 ,165245 ,135348 ,142417 ,0)
	house.inc.2018 <- 
		c(1,-1,-1,0,0,0,0,-1,0,1,1,1,0,0,1,1,-1,-1)

house.dem.2016 <- c(245791,322514,0,113372,101082,155000,153824,173555,107985,89823,113800,137353,239316,255293,124129,134586,157734,0)
house.rep.2016 <- c(53219,35131,244893,220628,206761,207469,225678,207263,186580,211282,199421,221851,0,87999,190618,168669,135430,293684)
	house.inc.2016 <- 
		c(-1,0,1,1,1,1,1,0,1,1,1,1,-1,-1,1,0,-1,1)

house.dem.2014 <- c(131248,181141,73931,50250,65839,92901,89256,84767,63223,44737,62228,87928,123601,148351,0,74513,93680,0)
house.rep.2014 <- c(27193,25397,113859,147090,115018,119643,145869,137731,110094,112851,122464,127993,60549,0,128285,101722,71371,166076)
	house.inc.2014 <- 
		c(-1,-1,1,1,1,0,1,1,1,1,1,1,0,-1,1,1,-1,1)

house.dem.2012 <- c(235394,318176,123933,104643,104725,143803,143509,152859,105128,94227,118231,163589,209901,251932,128764,111185,161393,122146)
house.rep.2012 <- c(41708,33381,165826,181603,177740,191725,209942,199379,169177,179563,166967,175352,93918,75702,168960,156192,106208,216727)
	house.inc.2012 <- 
		c(-1,-1,1,0,1,1,1,1,1,1,1,-1,-1,-1,1,1,-1,1)

dist.PA.00 <- seq(1,19,1)
house.dem.2010 <- c(149944,182800,88924,120827,52375,100493,110314,113547,52322,89846,84618,94056,118710,122073,79766,70994,118486,78558,53549)
house.rep.2010 <- c(0,21907,111909,116958,127427,133770,137825,130759,141904,110599,102179,91170,91987,49997,109534,134113,95000,161888,165219)
	house.inc.2010 <- 
		c(-1,-1,-1,-1,1,1,0,-1,1,-1,-1,-1,-1,-1,1,1,-1,1,1)

house.dem.2008 <- c(242799,276870,146846,186536,112509,164952,209955,197869,98735,160837, 146379,155268,196868,242326,128333,120193,192699,119661,109533)
house.rep.2008 <- c(24714,34466,139757,147411,155513,179423,142362,145103,174951,124681,137151,113120,108271,0,181433,170329,109909,213349,218862)
	house.inc.2008 <- 
		c(-1,-1,1,-1,0,1,-1,-1,1,-1,-1,-1,-1,-1,1,1,-1,1,1)

house.dem.2006 <- c(137987, 165867, 85110, 131857, 76456, 117892, 147898, 125656, 79610, 110115, 134340, 123472, 147368, 161075, 86186, 80915, 137253, 105419, 142512)
house.rep.2006 <- c(0, 17291, 108525, 122049, 115126, 121047, 114426, 124138, 121069, 97862, 51033, 79612, 75492, 0, 106153, 115741, 75455, 144632, 142512)
	house.inc.2006 <- 
		c(-1,-1,1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,1,-1,1,1)

house.dem.2004 <- c(214462, 253266, 110684, 116303, 0, 153977, 134932, 143427, 80787, 0, 171147, 204504, 171763, 220139, 114646, 98410, 172412, 117420, 0)
house.rep.2004 <- c(33266, 34411, 166580, 204329, 192852, 160348, 196556, 183229, 184320, 191967, 0, 0, 127205, 0, 170634, 183620, 113592, 197894, 224274)
	house.inc.2004 <- 
		c(-1,-1,1,1,1,1,1,0,1,1,-1,-1,0,-1,0,1,-1,1,1)

# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  # ACTUAL RESULTS 2008 CONGRESSIONAL
    house.2004.votes <- two_party(house.rep.2004, house.dem.2004)
    house.2004.turnout <- house.dem.2004+house.rep.2004
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  # ACTUAL RESULTS 2008 CONGRESSIONAL
    house.2006.votes <- two_party(house.rep.2006, house.dem.2006)
    house.2006.turnout <- house.dem.2006+house.rep.2006  
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  # ACTUAL RESULTS 2008 CONGRESSIONAL
    house.2008.votes <- two_party(house.rep.2008, house.dem.2008)
    house.2008.turnout <- house.dem.2008+house.rep.2008
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  # ACTUAL RESULTS 2010 CONGRESSIONAL
    house.2010.votes <- two_party(house.rep.2010, house.dem.2010)
    house.2010.turnout <- house.dem.2010+house.rep.2010
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  # ACTUAL RESULTS 2012 CONGRESSIONAL    
    house.2012.votes <- two_party(house.rep.2012, house.dem.2012)
    house.2012.turnout <- house.dem.2012+house.rep.2012
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  # ACTUAL RESULTS 2014 CONGRESSIONAL
    house.2014.votes <- two_party(house.rep.2014, house.dem.2014)
    house.2014.turnout <- house.dem.2014+house.rep.2014

  # •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  # ACTUAL RESULTS 2016 CONGRESSIONAL
    house.2016.votes <- two_party(house.rep.2016, house.dem.2016)
    house.2016.turnout <- house.dem.2016+house.rep.2016
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  # ACTUAL RESULTS 2018 CONGRESSIONAL  
    house.2018.votes <- two_party(house.rep.2018, house.dem.2018)
    house.2018.turnout <- house.dem.2018+house.rep.2018
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
	house.votes.2004 <- mean.w(default.unc(house.2004.votes), w = house.2004.turnout)
	house.seats.2004 <- seats(house.2004.votes)
	house.votes.2006 <- mean.w(default.unc(house.2006.votes), w = house.2006.turnout)
	house.seats.2006 <- seats(house.2006.votes)
	house.votes.2008 <- mean.w(default.unc(house.2008.votes), w = house.2008.turnout)
	house.seats.2008 <- seats(house.2008.votes)
	house.votes.2010 <- mean.w(default.unc(house.2010.votes), w = house.2010.turnout)
	house.seats.2010 <- seats(house.2010.votes)
	house.votes.2012 <- mean.w(default.unc(house.2012.votes), w = house.2012.turnout)
	house.seats.2012 <- seats(house.2012.votes)
	house.votes.2014 <- mean.w(default.unc(house.2014.votes), w = house.2014.turnout)
	house.seats.2014 <- seats(house.2014.votes)
	house.votes.2016 <- mean.w(default.unc(house.2016.votes), w = house.2016.turnout)
	house.seats.2016 <- seats(house.2016.votes)
	house.votes.2018 <- mean.w(default.unc(house.2018.votes), w = house.2018.turnout)
	house.seats.2018 <- seats(house.2018.votes)


 congress.PA.2008.2018 <- rbind(
 	cbind(
 		percent(house.votes.2008),
 		percent(house.votes.2010),
 		percent(house.votes.2012),
 		percent(house.votes.2014),
 		percent(house.votes.2016),
 		percent(house.votes.2018)), 
 	cbind(
 		percent(house.seats.2008),
 		percent(house.seats.2010),
 		percent(house.seats.2012),
 		percent(house.seats.2014),
 		percent(house.seats.2016),
 		percent(house.seats.2018)))
  rownames(congress.PA.2008.2018) <- c("Votes", "Seats")
  colnames(congress.PA.2008.2018) <- c("2008", "2010", "2012", "2014", "2016", "2018")
stargazer(congress.PA.2008.2018, type="text")
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••


PA_house <- list()

PA_house[['2004']] <- cbind.data.frame(
year = 2004,
district = dist.PA.00,
VOTE = house.2004.votes,
REP_lag = rep(NA, length(house.2004.votes)),
TURNOUT = house.2004.turnout,
INC = house.inc.2004,
INC_lag = NA,
partycontrol = NA
)

PA_house[['2006']] <- cbind.data.frame(
year = 2006,
district = dist.PA.00,
VOTE = house.2006.votes,
REP_lag = house.2004.votes,
TURNOUT = house.2006.turnout,
INC = house.inc.2006,
INC_lag = house.inc.2004,
partycontrol = 2 * (house.2004.votes > 0.5) - 1
)

PA_house[['2008']] <- cbind.data.frame(
year = 2008,
district = dist.PA.00,
VOTE = house.2008.votes,
REP_lag = house.2006.votes,
TURNOUT = house.2008.turnout,
INC = house.inc.2008,
INC_lag = house.inc.2006,
partycontrol = 2 * (house.2006.votes > 0.5) - 1
)

PA_house[['2010']] <- cbind.data.frame(
year = 2010,
district = dist.PA.00,
VOTE = house.2010.votes,
REP_lag = house.2008.votes,
TURNOUT = house.2010.turnout,
INC = house.inc.2010,
INC_lag = house.inc.2008,
partycontrol = 2 * (house.2008.votes > 0.5) - 1
)

PA_house[['2012']] <- cbind.data.frame(
year = 2012,
district = dist.PA.10,
VOTE = house.2012.votes,
REP_lag = rep(NA, length(house.rep.2012)),
TURNOUT = house.2012.turnout,
INC = house.inc.2012,
INC_lag = NA,
partycontrol = NA
)

PA_house[['2014']] <- cbind.data.frame(
year = 2014,
district = dist.PA.10,
VOTE = house.2014.votes,
REP_lag = house.2012.votes,
TURNOUT = house.2014.turnout,
INC = house.inc.2014,
INC_lag = house.inc.2012,
partycontrol = 2 * (house.2012.votes > 0.5) - 1
)

PA_house[['2016']] <- cbind.data.frame(
year = 2016,
district = dist.PA.10,
VOTE = house.2016.votes,
REP_lag = house.2014.votes,
TURNOUT = house.2016.turnout,
INC = house.inc.2016,
INC_lag = house.inc.2014,
partycontrol = 2 * (house.2014.votes > 0.5) - 1
)

PA_house[['2018']] <- cbind.data.frame(
year = 2018,
district = dist.PA.10,
VOTE = house.2018.votes,
REP_lag = rep(NA, length(house.rep.2016)),
TURNOUT = house.2018.turnout,
INC = house.inc.2018,
INC_lag = NA,
partycontrol = NA
)

pahouse <- do.call(rbind, PA_house)
pahouse$unc <- unc(pahouse$VOTE)
pahouse$unc_lag <- unc(pahouse$REP_lag)
# pahouse$unc_lag[is.na(pahouse$unc_lag)] <- 99



 pahouse$REPUBLICAN_IMPUTED <- replace.unc(pahouse$VOTE,0.25,0.75,0.25,0.75, na.rm=F)
 pahouse$REPUBLICAN_LAG_IMPUTED <- replace.unc(pahouse$REP_lag,0.25,0.75,0.25,0.75, na.rm=F)
write.csv(pahouse, "./data/pa_USHOUSE.csv", row.names=F, na="NA")

cat("
•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n
	")

