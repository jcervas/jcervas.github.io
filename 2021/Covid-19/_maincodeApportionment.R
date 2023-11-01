	rm(list=ls(all=TRUE))

source("https://raw.githubusercontent.com/jcervas/R-Functions/main/apportion/apportion.R")

pop.tmp <- read.csv("https://raw.githubusercontent.com/jcervas/R-Functions/main/apportion/pop.csv")
	pop.tmp <- pop.tmp[,1:4]

covid.dta.tmp <- read.csv("https://data.cdc.gov/api/views/9mfq-cb36/rows.csv?accessType=DOWNLOAD") #Data "https://data.cdc.gov/Case-Surveillance/United-States-COVID-19-Cases-and-Deaths-by-State-o/9mfq-cb36"
	covid.dta.tmp$date <- as.Date(covid.dta.tmp$submission_date, "%m/%d/%Y")
	covid.dta.tmp <- covid.dta.tmp[order(covid.dta.tmp$date, covid.dta.tmp$state, decreasing=T),]

for (i in 1:length(unique(covid.dta.tmp$date))){
	date.i <- unique(covid.dta.tmp$date)[i]
		covid.dta.tmp$tot_cases[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] <- 
			covid.dta.tmp$tot_cases[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] + 
			covid.dta.tmp$tot_cases[covid.dta.tmp$state %in% "NYC" & covid.dta.tmp$date %in% date.i]
		covid.dta.tmp$conf_cases[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] <- 
			covid.dta.tmp$conf_cases[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] + 
			covid.dta.tmp$conf_cases[covid.dta.tmp$state %in% "NYC" & covid.dta.tmp$date %in% date.i]
		covid.dta.tmp$prob_cases[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] <- 
			covid.dta.tmp$prob_cases[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] + 
			covid.dta.tmp$prob_cases[covid.dta.tmp$state %in% "NYC" & covid.dta.tmp$date %in% date.i]
		covid.dta.tmp$new_case[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] <- 
			covid.dta.tmp$new_case[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] + 
			covid.dta.tmp$new_case[covid.dta.tmp$state %in% "NYC" & covid.dta.tmp$date %in% date.i]
		covid.dta.tmp$pnew_case[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] <- 
			covid.dta.tmp$pnew_case[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] + 
			covid.dta.tmp$pnew_case[covid.dta.tmp$state %in% "NYC" & covid.dta.tmp$date %in% date.i]
		covid.dta.tmp$tot_death[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] <- 
			covid.dta.tmp$tot_death[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] + 
			covid.dta.tmp$tot_death[covid.dta.tmp$state %in% "NYC" & covid.dta.tmp$date %in% date.i]
		covid.dta.tmp$conf_death[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] <- 
			covid.dta.tmp$conf_death[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] + 
			covid.dta.tmp$conf_death[covid.dta.tmp$state %in% "NYC" & covid.dta.tmp$date %in% date.i]
		covid.dta.tmp$prob_death[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] <- 
			covid.dta.tmp$prob_death[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] + 
			covid.dta.tmp$prob_death[covid.dta.tmp$state %in% "NYC" & covid.dta.tmp$date %in% date.i]
		covid.dta.tmp$new_death[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] <- 
			covid.dta.tmp$new_death[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] + 
			covid.dta.tmp$new_death[covid.dta.tmp$state %in% "NYC" & covid.dta.tmp$date %in% date.i]
		covid.dta.tmp$pnew_death[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] <- 
			covid.dta.tmp$pnew_death[covid.dta.tmp$state %in% "NY" & covid.dta.tmp$date %in% date.i] + 
			covid.dta.tmp$pnew_death[covid.dta.tmp$state %in% "NYC" & covid.dta.tmp$date %in% date.i]
	}

	states <- c(
		"AK", "AL", "AR", "AZ", "CA",
		"CO", "CT", "DE", "FL", "GA",
		"HI", "IA", "ID", "IL", "IN",
		"KS", "KY", "LA", "MA","MD",
		"ME", "MI", "MN", "MO", "MS",
		"MT", "NC", "ND", "NE", "NH",
		"NJ", "NM", "NV", "NY", "OH",
		"OK", "OR", "PA", "RI", "SC",
		"SD", "TN", "TX", "UT", "VA",
		"VT", "WA", "WI", "WV", "WY")
	covid.dta.tmp <- covid.dta.tmp[covid.dta.tmp$state %in% states,]
	st.match <- match(covid.dta.tmp$state, pop.tmp$abv)
covid.dta.tmp$STATE <- pop.tmp$state[st.match]
covid.dta.tmp$pop <- pop.tmp$pop2020[st.match]

current.date <- covid.dta.tmp$date[1]
april.1.2020 <- as.Date("04/01/2020", "%m/%d/%Y")
april.1.2021 <- as.Date("04/01/2021", "%m/%d/%Y")
# current.date <- as.Date("04/01/2021", "%m/%d/%Y")

app.april.1.2020 <- covid.dta.tmp[covid.dta.tmp$date %in% april.1.2020,]
	precensusDeaths <- data.frame(state=app.april.1.2020$STATE, coviddeaths=app.april.1.2020$tot_death)
	census.app.match <- match(covid.dta.tmp$STATE, precensusDeaths$state)
		covid.dta.tmp$precensusDeaths <- app.april.1.2020$tot_death[census.app.match]
app.april.1.2021 <- covid.dta.tmp[covid.dta.tmp$date %in% april.1.2021,]
app.today <- covid.dta.tmp[covid.dta.tmp$date %in% current.date,]


	(census.2020.actual <- 
		apportion(
			STATES=app.april.1.2020$state, 
			POP=app.april.1.2020$pop, 
			n_seats=435, 
			autoseats=1, 
			threshold=0, 
			method = "hill-huntington", 
			state = "all"))

	(census.2020.nocovid <- 
		apportion(
			STATES=app.april.1.2020$state, 
			POP=(app.april.1.2020$pop+app.april.1.2020$tot_death), 
			n_seats=435, 
			autoseats=1, 
			threshold=0, 
			method = "hill-huntington", 
			state = "all"))

	(census.2021.covid <- 
		apportion(
			STATES=app.april.1.2021$state, 
			POP=(app.april.1.2021$pop-app.april.1.2021$tot_death+app.april.1.2021$precensusDeaths), 
			n_seats=435, 
			autoseats=1, 
			threshold=0, 
			method = "hill-huntington", 
			state = "all"))

	(census.2020.today <- 
		apportion(
			STATES=app.today$state, 
			POP=app.today$pop-app.today$tot_death+app.today$precensusDeaths, 
			n_seats=435, 
			autoseats=1, 
			threshold=0, 
			method = "hill-huntington", 
			state = "all"))

data.frame(census.2020.actual,census.2020.nocovid, census.2020.today)

