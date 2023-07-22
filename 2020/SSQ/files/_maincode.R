##########################################################################################################
##########################################################################################################
##########################################################################################################
##########################################################################################################
### Code to Replicate "Legal, political science and economics approaches to measuring malapportionment"
### Jonathan R. Cervas, University of California Irvine
### Bernard N. Grofman, University of California Irvine
### Note: in 1872, Arkansas (4) and Louisiana (6) did not participate in EC, but I added in what would be their respective ECvotes
###			Even though no apportionment happened in 1920, we calculated the expected apportionment from the 1920 Census
##########################################################################################################
##########################################################################################################
# Remove all objects just to be safe.
			rm(list = ls(all = TRUE))
	setwd("/Users/user/Google Drive/Projects/Malapportionment")
	data.directory <- "/Users/user/Google Drive/Github/Data/"
	functions.directory <- "/Users/user/Google Drive/GitHub/R Functions/"
	options(scipen = 999) # Turn off Scientific Notation
##########################################################################################################
########### - Libraries - ###########
##########################################################################################################
	doInstall <- F  # Change to FALSE if you don't want packages installed.
	toInstall <- c("tidyverse", "stargazer", "moments", "acid", "svglite")
	if(doInstall){install.packages(toInstall, repos = "http://cran.r-project.org")}
	lapply(toInstall, library, character.only = TRUE)
	# install.packages("JudgeIt",repos = "http://r.iq.harvard.edu")
	# library(JudgeIt)
####################################
######### - Functions - ############
####################################
source(paste0(functions.directory, "apportion.r"))
source(paste0(functions.directory, "winningness.r"))
source(paste0(functions.directory, "seatsvotes.R"))
source(paste0(functions.directory, "GERRYfunctions.R"))

figures.make <- "_figures.R"

'tpd' <-
	function(pop) {
			( max(pop[!is.na(pop)], na.rm = TRUE) - min(pop[!is.na(pop)], na.rm = TRUE) ) / ideal(pop[!is.na(pop)])
		}
'ideal' <-
	function(pop) {
			sum(pop[!is.na(pop)], na.rm = T)/length(pop[!is.na(pop)])
		}
'VER' <-
	function(pop) { 
			max(pop[!is.na(pop)], na.rm = T)/min(pop, na.rm = T)
		}
'loosemore_hanby' <-	#### Loosemore–Hanby index of electoral disproportionality x% of votes allocated to states that would not receive those votes if there were no dissporpotionality
	function(pop, districts=NULL) {
		if(is.null(districts)) {districts <- rep(1, length(pop))}
			(sum( abs(districts[!is.na(pop)]/sum(districts[!is.na(pop)]) - (pop[!is.na(pop)]/sum(pop[!is.na(pop)], na.rm = TRUE))), na.rm = TRUE ) / 2) * 100
		}
'gallagher' <-
	function(pop,seats=NULL) {
		if (is.null(seats)) {
			(sqrt(0.5 * sum((pop[!is.na(pop)]/sum(pop[!is.na(pop)])-(1/length(pop[!is.na(pop)])))^2))) * 100
		} else {
			(sqrt(0.5 * sum((pop[!is.na(pop)]/sum(pop[!is.na(pop)])-(seats/sum(seats)))^2))) * 100
		}
	}
'average_mal' <-
	function(pop, districts) {
			100 * mean(abs(pop[!is.na(pop)] - ideal(pop[!is.na(pop)])) /ideal(pop[!is.na(pop)])  )
		}

'Gini' <- function(x, corr = FALSE, na.rm = TRUE) {
    if(!na.rm && any(is.na(x))) return(NA_real_)
    x <- as.numeric(na.omit(x))
    n <- length(x)
    x <- sort(x)
    G <- sum(x * 1L:n)
    G <- 2 * G/sum(x) - (n + 1L)
    if (corr) (G/(n - 1L)) * 100 else (G/n) * 100
	}
'minpop' <- function(pop, dist=NULL) {
	if (is.null(dist)) {dist <- rep(1, length(pop))}
	if (length(dist) != length(pop)) {stop("weights must be same length as data")}
	order.tmp <- order(pop/dist)
	pop <- pop[order.tmp]
	dist <- dist[order.tmp]
	pop <- rep(pop,dist)
	dist <- rep(1,length(pop))
	n <- 1
	dist.tmp <- dist[1]
	while (dist.tmp < (sum(dist)/2) + 0.5) {
		n <- n+1
		dist.tmp <- sum(dist[1:n])
	}
	return(sum(pop[1:n])/sum(pop))
}

'Percentile' <- function(x) {
	x <- x[order(x)]
	c <- cumsum(x)/sum(x)
	d <- (quantile(c, c(0.20, 0.50, 0.80),, na.rm=T))
	return(d[3]/d[1])
}
'qsumm' <- function(x) {
	cbind.data.frame(
		Mean = round(mean(x, na.rm=T), digits=3),
		SD = round(sd(x, na.rm=T), digits=3),
		Variance = round(var(x, na.rm=T), digits=3),
		Median = round(median(x, na.rm=T), digits=3),
		'20%' = quantile(x[!is.na(x)], 0.2, na.rm=T),
        '80%' = quantile(x[!is.na(x)], 0.8, na.rm=T) 
		)
}
'per_change' <- function(z) {
	z <- do.call(c, z)
  START <-  z[1]
  return( (z-START)/START * 100)
}

##########################################################################################################
########## - Election Data Set-up - ######################################################################
##########################################################################################################
	greycol <- rgb(red = 190, green = 190, blue = 190, alpha = 170, maxColorValue = 255)
	returns <- runif(100)
	# prop <- matrix(NA, nrow = length(seq(1790,2010,10)), ncol = 6)

	states <- c("Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "D. C.", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming")
	years <- seq(1790, 2010, 10)
	apportioned <- c(65,105,141,181,213,240,223,234,241,292,325,356,386,435,435,435,435,435,435,435,435,435,435,435)
	
		appt.all <- read.csv("/Users/user/Google Drive/Data/Census/state_apportionment.csv", colClasses=c("character", rep("numeric",23)))
			appt.all <- cbind(appt.all[,1:15], appt.all[,15], appt.all[,16:dim(appt.all)[2]])
	colnames(appt.all) <- c("st", "Constitution", paste0("Census", seq(1790,2010,10)))
	rownames(appt.all) <- appt.all[,1]

pop.race <- read.csv("/Users/user/Google Drive/Data/Census/race.csv")
	pop.race.tmp <- split(pop.race, pop.race$year)

p.r.tmp <- lapply(pop.race.tmp, function(x) merge(data.frame(state=states), x, all.x=T))

	pop.threefifths.tmp <- lapply(p.r.tmp, function(x) rowSums(x[c("total")], na.rm=T) - rowSums(x[c("slave")], na.rm=T) + rowSums((3/5) * x[c("slave")], na.rm=T))
		pop.threefifths.tmp1 <- lapply(pop.threefifths.tmp, function(x) {x[x==0] <- NA; x})
		pop.threefifths.tmp2 <- round(do.call(cbind, pop.threefifths.tmp1))
	
	pop.whole.tmp1 <- lapply(p.r.tmp, function(x) x$total)
		pop.whole.tmp2 <- do.call(cbind, pop.whole.tmp1)

		pop.whole <- pop.whole.tmp2[,!colnames(pop.whole.tmp2) %in% c("1890_b")]
		rownames(pop.whole) <- states

		pop.threefifths <- pop.threefifths.tmp2[,!colnames(pop.threefifths.tmp2) %in% c("1890_b")]
			rownames(pop.threefifths) <- states

	pop.free.tmp <- lapply(p.r.tmp, function(x) rowSums(x[c("total")], na.rm=T) - rowSums(x[c("slave")], na.rm=T))
		pop.free.tmp1 <- lapply(pop.free.tmp, function(x) {x[x==0] <- NA; x})
		pop.free.tmp2 <- round(do.call(cbind, pop.free.tmp1))
		pop.free <- pop.free.tmp2[,!colnames(pop.free.tmp2) %in% c("1890_b")]
			rownames(pop.free) <- states
	
##########################################################################################################
######### - Apportionment Data Setup - ###################################################################
##########################################################################################################
	year.dist <- year.dist.alt <- list(array(NA, c(length(years), 4)),array(NA, c(length(years), 4)),array(NA, c(length(years), 4)))
		rownames(year.dist[[1]]) <- rownames(year.dist[[2]]) <- rownames(year.dist[[3]]) <- years
		colnames(year.dist[[1]]) <- colnames(year.dist[[2]]) <- colnames(year.dist[[3]]) <- c("n", "min", "max", "ideal")
	appt <- appt.whole <-  mech.measures <- pop <- list() # Appointmentment based measures
	house.mal <- sen.mal <- ec.mal <- house.mal.alt <- ec.mal.alt <- list()
	
	for (j in 1:length(years)) {
		
		real.appt.j <- data.frame(state=appt.all$st, apportionment=unlist(appt.all[j+2]))
			exclude.states <- as.character(real.appt.j$state[is.na(real.appt.j$apportionment)])

		pop.appt.j <- pop.threefifths[,j]
		pop.whole.j <- pop.whole[,j]
		appt.free.j <- pop.free[,j]

		dc.row <- rownames(pop.whole) %in% c("D. C.")
		dc.pop <- pop.whole.j[dc.row]

			west.va.row <- rownames(pop.whole) %in% "West Virginia" 
			va.row <- rownames(pop.whole) %in% "Virginia"
			if (j %in% 1:8) {
				pop.appt.j[va.row] <- pop.appt.j[west.va.row] + pop.appt.j[va.row]
				pop.whole.j[va.row] <- pop.whole.j[west.va.row] + pop.whole.j[va.row]
				appt.free.j[va.row] <- appt.free.j[west.va.row] + appt.free.j[va.row]
				pop.appt.j[west.va.row] <- pop.whole.j[west.va.row] <- appt.free.j[west.va.row] <- NA
				}

					exc.rows <- rownames(pop.whole) %in% c("D. C.", exclude.states)
				pop.appt.j[exc.rows] <-  pop.whole.j[exc.rows] <- appt.free.j[exc.rows] <-  NA
					
				pop[[j]] <- data.frame(total=pop.whole.j, threefifths=pop.appt.j, freepeople=appt.free.j)

		appt.tmp.j <- apportion(states, pop.appt.j, n_seats=apportioned[j+1], autoseats=1, threshold=0, method = "hill-huntington", state = "all")
			colnames(appt.tmp.j)[colnames(appt.tmp.j) %in% "seats"]  <- "house"
			appt.tmp.j$house[appt.tmp.j$house %in% 0] <- NA
				house.na <- is.na(appt.tmp.j$house)
			appt.tmp.j$ecn[!house.na] <- appt.tmp.j$house[!house.na] + 2
				if (j<length(years)) {
					popnext <- pop.threefifths[,j+1]
				} else {
					popnext <- pop.threefifths[,j]
				}
			appt[[j]] <- appt.tmp.j

		appt.whole.j <- apportion(states, pop.whole.j, n_seats=apportioned[j+1], autoseats=1, threshold=0, method = "hill-huntington", state = "all")
			colnames(appt.whole.j)[colnames(appt.whole.j) %in% "seats"]  <- "house_alt"
			appt.whole.j$house_alt[appt.whole.j$house_alt %in% 0] <- NA
				appt.whole[[j]] <- appt.whole.j

			pop.tmp <- data.frame(state=states, pop_appt=pop.appt.j, popnext=popnext, pop=pop.whole.j)
			dta.appt.tmp.j <- merge(data.frame(state=states), appt.tmp.j, by="state", all=T)
			dta.appt.tmp.j2 <- merge(dta.appt.tmp.j, appt.whole.j, by="state", all=T)
			dta.tmp <- merge(dta.appt.tmp.j2, pop.tmp, by="state", all=T)
				dta.tmp$ecn_alt <- dta.tmp$house_alt + 2
				house.na <- is.na(dta.tmp$house)
				dta.tmp$pop[(!house.na) & is.na(dta.tmp$pop)] <- dta.tmp$popnext[(!house.na) & is.na(dta.tmp$pop)]
			
			dc.index <- which(dta.tmp$st == "D. C.")
			if (j > 18) {
				dta.tmp$ecn[dc.index] <- 3
				dta.tmp$ecn_alt[dc.index] <- 3
			} else {
				dta.tmp$ecn[dc.index] <- NA
				dta.tmp$ecn_alt[dc.index] <- NA
			}

		house.pop.tmp <- dta.tmp[!house.na,]
		house.pop.new <- rep(house.pop.tmp$pop/house.pop.tmp$house, house.pop.tmp$house)
			house.pop.new.alt <- rep(house.pop.tmp$pop/house.pop.tmp$house_alt, house.pop.tmp$house_alt)
		house.pop <- house.pop.new[order(house.pop.new)]
			house.pop.alt <- house.pop.new.alt[order(house.pop.new.alt)]
		house.n <- length(house.pop)
		
		sen.pop.tmp <- rep(dta.tmp$pop[!house.na]/2, 2)
		sen.pop <- sen.pop.tmp[order(sen.pop.tmp)]
		sen.n <- length(sen.pop)
		
		ec.pop.tmp <- dta.tmp[!is.na(dta.tmp$ecn),]
		rownames(ec.pop.tmp) <- ec.pop.tmp$state
		if (j > 18) {ec.pop.tmp$pop[rownames(ec.pop.tmp) %in% c("D. C.")] <- dc.pop}
		ec.pop.tmpa <- rep(ec.pop.tmp$pop/ec.pop.tmp$ecn, ec.pop.tmp$ecn)
			ec.pop.tmpa.alt <- rep(ec.pop.tmp$pop/ec.pop.tmp$ecn_alt, ec.pop.tmp$ecn_alt)
		ec.pop <- ec.pop.tmpa[order(ec.pop.tmpa)]
			ec.pop.alt <- ec.pop.tmpa.alt[order(ec.pop.tmpa.alt)]
		ec.n <- length(ec.pop)

				year.dist[[1]][j,] <- c(house.n, min(house.pop, na.rm=T), max(house.pop, na.rm=T), ideal(house.pop))
				year.dist[[2]][j,] <- c(sen.n, min(sen.pop, na.rm=T), max(sen.pop, na.rm=T), ideal(sen.pop))
				year.dist[[3]][j,] <- c(ec.n, min(ec.pop, na.rm=T), max(ec.pop, na.rm=T), ideal(ec.pop))

				year.dist.alt[[1]][j,] <- c(house.n, min(house.pop.alt, na.rm=T), max(house.pop.alt, na.rm=T), ideal(house.pop.alt))
				year.dist.alt[[2]][j,] <- c(sen.n, min(sen.pop, na.rm=T), max(sen.pop, na.rm=T), ideal(sen.pop))
				year.dist.alt[[3]][j,] <- c(ec.n, min(ec.pop.alt, na.rm=T), max(ec.pop.alt, na.rm=T), ideal(ec.pop.alt))
		names(year.dist) <- c("House", "Senate", "ElectoralCollege")
				calc.mal <- function(x) {
					data.frame(
						TPD=tpd(x),
						VER=VER(x),
						Minimum_Winning_Population=minpop(x),
						Loosemore_Hanbly=loosemore_hanby(x),
						Gallagher=gallagher(x),
						# average_mal=average_mal(x, length(x)),
						Percentile=Percentile(x),
						Gini=Gini(x)
					)
				}

		ec.mal[[j]] <- calc.mal(ec.pop)
		house.mal[[j]] <- calc.mal(house.pop)
		sen.mal[[j]] <- calc.mal(sen.pop)

		ec.mal.alt[[j]] <- calc.mal(ec.pop.alt)
		house.mal.alt[[j]] <- calc.mal(house.pop.alt)
	}

southern_states <- c("Georgia", "Kentucky", "North Carolina", "South Carolina", "Tennessee", "Virginia", "West Virginia") # West Virginia included until 1870

m.house <- do.call(rbind, house.mal)
m.sen <- do.call(rbind, sen.mal)
m.ec <- do.call(rbind, ec.mal)

m.house.alt <- do.call(rbind, house.mal.alt)
m.ec.alt <- do.call(rbind, ec.mal.alt)

rownames(m.house) <- rownames(m.sen) <- rownames(m.ec) <- rownames(m.house.alt) <- rownames(m.ec.alt) <- seq(1790,2010,10)


# Three-Fifths analysis
	threefifths.years <- seq(1790,1860,10)
		threefifths.dta <- pop.race.tmp[1:length(threefifths.years)]
		slaves.year <- do.call(rbind,lapply(threefifths.dta, function(x) sum(x$slave, na.rm=T)))
		total.year <- do.call(rbind,lapply(threefifths.dta, function(x) sum(x$total, na.rm=T)))
		slaves.per.year <- percent(slaves.year/total.year)

			mean.w(slaves.year, total.year) # Slave percentage over period
			lapply(threefifths.dta, function(x) max(x$slave/x$total, na.rm=T)) # Highest state

	# total population, slave population, three-fifths{min,max}, whole{min,max}
			min.35 <- year.dist[[1]][1:length(threefifths.years),2]
			max.35 <- year.dist[[1]][1:length(threefifths.years),3]

			min.whole <- year.dist.alt[[3]][1:length(threefifths.years),2]
			max.whole <- year.dist.alt[[3]][1:length(threefifths.years),3]

			min.35.sen <- year.dist[[3]][1:length(threefifths.years),2]
			max.35.sen <- year.dist[[3]][1:length(threefifths.years),3]

			min.whole.sen <- year.dist.alt[[3]][1:length(threefifths.years),2]
			max.whole.sen <- year.dist.alt[[3]][1:length(threefifths.years),3]

			rbind(max.35/min.35,max.whole/min.whole)
			rbind(max.35.sen/min.35.sen,max.whole.sen/min.whole.sen)

			
			m.house[1:length(threefifths.years),]
			m.house.alt[1:length(threefifths.years),]

#########################################################
########### - Knesset and Dutch Elections - #############
#########################################################

knesset <- cbind(c(985408, 786313, 446583, 371602, 315360, 283910, 241613, 214906, 210143, 165529), c(30, 24, 13, 11, 10, 8, 7, 6, 6, 5))
Knessetloosemore <- sum( abs(knesset[,2]/sum(knesset[,2], na.rm=TRUE) - (knesset[,1]/sum(knesset[,1], na.rm=TRUE))) , na.rm=TRUE )/2 
Knessetgallagher <- sqrt(0.5 * sum( ( (knesset[,2]/sum(knesset[,2], na.rm=TRUE)) - (knesset[,1]/sum(knesset[,1], na.rm=TRUE)) ) ^2, na.rm=TRUE))

dutch <- cbind(c(2238351, 1372941, 1301796, 1285819, 959600, 955633, 599699, 356271, 335214, 327131, 218950, 216147, 187162), c(33,20,19,19,14,14,9,5,5,4,3,3,2))
dutchloosemore <- sum( abs(dutch[,2]/sum(dutch[,2], na.rm=TRUE) - (dutch[,1]/sum(dutch[,1], na.rm=TRUE))) , na.rm=TRUE )/2 
dutchgallagher <- sqrt(0.5 * sum( ( (dutch[,2]/sum(dutch[,2], na.rm=TRUE)) - (dutch[,1]/sum(dutch[,1], na.rm=TRUE)) ) ^2, na.rm=TRUE))

### Doring and Manow 2015
majortiarian_countries <- mean(9.6,12.6,16.7,10.9,9.2,11.2)
proportional_countries <- mean(2.4,3.3,2.7,2.6,1.5,7.1,3,5,9.2,4.3,3.4,3.2,4.6,1.3,4.6,2.9,5.4,2)




# ▀▀█▀▀ █▀▀█ █▀▀▄ █░░ █▀▀ █▀▀
# ░░█░░ █▄▄█ █▀▀▄ █░░ █▀▀ ▀▀█
# ░░▀░░ ▀░░▀ ▀▀▀░ ▀▀▀ ▀▀▀ ▀▀▀
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
`Table` <- function(x, path=NULL, caption="", label="", footnote="", landscape=FALSE, out=NULL)
  {
t <- 
paste0(
"\n% =====================================================================
% ▀▄▀▄▀▄ T̟A̟B̟L̟E̟ ▄▀▄▀▄▀▀▄▀▄▀▄ T̟A̟B̟L̟E̟ ▄▀▄▀▄▀▀▄▀▄▀▄ T̟A̟B̟L̟E̟ ▄▀▄▀▄▀▀▄▀▄▀▄ T̟A̟B̟L̟E̟
% ---------------------------------------------------------------------\n",
ifelse(is.null(path),
paste0("\\begin{center} \\textbf{", caption, "} \\end{center}"),
paste0("\\input{", path, "}")),

"\n \\begin{center}\\textbf{INSERT TABLE \\ref{", label, "} ABOUT HERE} \\end{center}
% •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••\n")
if(landscape==T) x <- append("\n\\begin{landscape}",x)
    x <- append(x,
paste0(
"\n% =====================================================================
% ▀▄▀▄▀▄ T̟A̟B̟L̟E̟ ▄▀▄▀▄▀▀▄▀▄▀▄ T̟A̟B̟L̟E̟ ▄▀▄▀▄▀▀▄▀▄▀▄ T̟A̟B̟L̟E̟ ▄▀▄▀▄▀▀▄▀▄▀▄ T̟A̟B̟L̟E̟
% ---------------------------------------------------------------------
\\begin{table}[!htbp] \\centering 
  \\caption{", caption, "} 
  \\label{", label, "} "),
 after = 1)

    x <- append(x,
paste0("\\end{tabular}
\\tabnotes{", footnote, "}
\\end{table}
% ---------------------------------------------------------------------
% ▀▄▀▄▀▄ E͎N͎D͎ T͎A͎B͎L͎E͎ ▄▀▄▀▄▀▀▄▀▄▀▄ E͎N͎D͎ T͎A͎B͎L͎E͎ ▄▀▄▀▄▀▀▄▀▄▀▄ E͎N͎D͎ T͎A͎B͎L͎E͎ ▄▀▄▀▄
% ===================================================================== \n",
ifelse(landscape==T, "\n\\end{landscape}", ""),
"\n"),
after = length(x))
cat(paste(latex.special.chr(t), collapse = "\n"), "\n")
cat(paste(latex.special.chr(x), collapse = "\n"), "\n", file = paste0("", path))
  }

tab_threefiths <- data.frame(Total_Population=total.year, Total_Slaves= slaves.year, Slave_percent=slaves.per.year, min_threefifths=round(min.35), max_threefifths=round(max.35), min_whole=round(min.whole), max_whole=round(max.whole))
	tab_threefiths.tex <- stargazer(tab_threefiths, summary=FALSE, align=T, digits=2)
		threefiths.tabular <- "\\begin{tabular}{p{1.5cm}|p{2cm}p{2cm}p{2cm}|p{2cm}p{2cm}|p{2cm}p{2cm}}"
	tab_threefiths.tex[[11]] <- "\\multicolumn{1}{c}{Year} & \\multicolumn{1}{c}{Total Pop.} & \\multicolumn{1}{c}{Total Slaves} & \\multicolumn{1}{c}{Slave \\%} & \\multicolumn{1}{c}{min} & \\multicolumn{1}{c}{max} & \\multicolumn{1}{c}{min} & \\multicolumn{1}{c}{max} \\\\ "
	tab_threefiths.tex <- tab_threefiths.tex[c(-1,-2,-3,-4,-5,-6,-7,-8,-9,-21,-22,-23)]
	tab_threefiths.tex <- append("\\multicolumn{1}{c}{} & \\multicolumn{1}{c}{} & \\multicolumn{1}{c}{}& \\multicolumn{1}{c}{} & \\multicolumn{2}{c}{Three-Fifths Apportionment} & \\multicolumn{2}{c}{Universal Apportionment} \\\\ ", tab_threefiths.tex)
	tab_threefiths.tex <- append(threefiths.tabular, tab_threefiths.tex)

Table(tab_threefiths.tex,
	path = "Tables/threefifths.tex",
	caption = "Apportionment in the Antebellum Period Under Two Sets of Rules",
	label = "tab:threefifths",
	footnote = "",
	landscape = TRUE)


dist_details.tex <- stargazer(round(cbind(year.dist$House,year.dist$Senate,year.dist$ElectoralCollege)), summary=FALSE, align=T, digits=2)
dist_detail.tabular  <- "\\begin{tabular}{p{1.5cm}|p{1cm}p{1.75cm}p{1.75cm}p{1.75cm}|p{1cm}p{1.75cm}p{1.75cm}p{1.75cm}|p{1cm}p{1.75cm}p{1.75cm}p{1.75cm}}"
dist_details.tex[11] <- "\\multicolumn{1}{c}{} & \\multicolumn{1}{c}{\\textit{n}} & \\multicolumn{1}{c}{\\textit{min}} & \\multicolumn{1}{c}{\\textit{max}} & \\multicolumn{1}{c}{\\textit{ideal}} & \\multicolumn{1}{c}{\\textit{n}} & \\multicolumn{1}{c}{\\textit{min}} & \\multicolumn{1}{c}{\\textit{max}} & \\multicolumn{1}{c}{\\textit{ideal}} & \\multicolumn{1}{c}{\\textit{n}} & \\multicolumn{1}{c}{\\textit{min}} & \\multicolumn{1}{c}{\\textit{max}} & \\multicolumn{1}{c}{\\textit{ideal}} \\\\ "
dist_details.tex <- dist_details.tex[c(-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-36,-37,-38)]
dist_details.tex <- append("\\multicolumn{1}{c}{Year} & \\multicolumn{4}{c}{U.S. House} & \\multicolumn{4}{c}{U.S. Senate} & \\multicolumn{4}{c}{Electoral College} \\\\ ", dist_details.tex)
dist_details.tex <- append(dist_detail.tabular,dist_details.tex)
Table(dist_details.tex,
	path = "Tables/dist_details.tex",
	caption = "District Deviation Summaries for the U.S. House, Senate, and Electoral College",
	label = "tab:dist_details",
	footnote = "In 1790, there were thirteen states which were apportioned 65 House seats. The district populations [and number of districts] are (ideal = 51,827 [65]; 45,583 [4], 47,484 [3], 47,759 [6], 47,930 [5], 48,035 [7], 51,214 [7], 52,009 [4], 53,528 [11], 54,893 [7], 54,927 [8], 59,440 [1], 71,240 [1], 71,853 [1]).",
	landscape = TRUE)

upper <- function(x) {
	m <- round(cor(x), 2)
	m[upper.tri(m)] <- NA
	m <- as.data.frame(m)
	return(m)
	}
ussenate.tex <- stargazer(upper(m.sen), summary=FALSE, align=T, digits=2, title="U.S. Senate")
	ussenate.tex  <- gsub("\\\\multicolumn\\{1\\}\\{c\\}", "", ussenate.tex)
	ussenate.tex  <- gsub("\\\\_", " ", ussenate.tex)
	ussenate.tex[8] <- "\\begin{tabular}{C{2.5cm}p{1.75cm}p{1.75cm}p{1.75cm}p{1.75cm}p{1.75cm}p{1.75cm}p{1.75cm}p{1.75cm}}"
	ussenate.tex <- ussenate.tex[c(-1,-2,-3,-4,-5,-6,-7,-9,-10,-20,-21,-22)]

		Table(ussenate.tex,
			path = "Tables/correlations_sen.tex",
			caption = "U.S. Senate",
			label = "tab:cor_sen",
			footnote = "",
			landscape = TRUE)

ushouse.tex <- stargazer(upper(m.house), summary=FALSE, align=T, digits=2, title="U.S. House")
	ushouse.tex  <- gsub("\\\\multicolumn\\{1\\}\\{c\\}", "", ushouse.tex)
	ushouse.tex  <- gsub("\\\\_", " ", ushouse.tex)
	ushouse.tex[8] <- "\\begin{tabular}{C{2.5cm}p{1.75cm}p{1.75cm}p{1.75cm}p{1.75cm}p{1.75cm}p{1.75cm}p{1.75cm}p{1.75cm}}"
	ushouse.tex <- ushouse.tex[c(-1,-2,-3,-4,-5,-6,-7,-9,-10,-20,-21,-22)]

Table(ushouse.tex,
	path = "Tables/correlations_house.tex",
	caption = "U.S. House",
	label = "tab:cor_house",
	footnote = "",
	landscape = TRUE)

usec.tex <- stargazer(upper(m.ec) , summary=FALSE, align=T, digits=2, title="Electoral College")
	usec.tex  <- gsub("\\\\multicolumn\\{1\\}\\{c\\}", "", usec.tex)
	usec.tex  <- gsub("\\\\_", " ", usec.tex)
	usec.tex[8] <- "\\begin{tabular}{C{2.5cm}p{1.75cm}p{1.75cm}p{1.75cm}p{1.75cm}p{1.75cm}p{1.75cm}p{1.75cm}p{1.75cm}}"
	usec.tex <- usec.tex[c(-1,-2,-3,-4,-5,-6,-7,-9,-10,-20,-21,-22)]

Table(usec.tex,
	path = "Tables/correlations_ec.tex",
	caption = "Electoral College",
	label = "tab:cor_ec",
	footnote = "",
	landscape = TRUE)


### APPENDIX TABLES

uss.data <- m.sen
uss.data$Minimum_Winning_Population <- 100 - (100 * uss.data$Minimum_Winning_Population)
us.senate.raw.tex <- with(round(uss.data, 2),
paste(seq(1790,2010,10), "&", TPD, "&", VER, "&", Minimum_Winning_Population, "&", Loosemore_Hanbly, "&", Gallagher, "&", Percentile, "&", Gini, "\\\\")
)
	us.senate.raw.tex <- append("\\hline \\\\[-1.8ex] ", us.senate.raw.tex)
	us.senate.raw.tex <- append(" Year &  & TPD & Population & Hanby & Gallagher & (80/20) & Gini \\\\ ", us.senate.raw.tex)
	us.senate.raw.tex <- append("  &   &   & Winning & Loosemore &  & Ratio &  \\\\ ", us.senate.raw.tex)
	us.senate.raw.tex <- append(" &  & VER & Minimum &  &  & Percentile &  \\\\ ", us.senate.raw.tex)
	us.senate.raw.tex <-append("\\begin{tabular}{c|ccccccc}", us.senate.raw.tex)
	us.senate.raw.tex <-append(" ", us.senate.raw.tex)
Table(us.senate.raw.tex,
	path = "Tables/data_sen.tex",
	caption = "U.S. Senate Data Tables",
	label = "tab:app_sen",
	footnote = "",
	landscape = FALSE)


ush.data <- m.house
ush.data$Minimum_Winning_Population <- 100 - (100 * ush.data$Minimum_Winning_Population)
us.house.raw.tex <- with(round(ush.data, 2),
paste(seq(1790,2010,10), "&", TPD, "&", VER, "&", Minimum_Winning_Population, "&", Loosemore_Hanbly, "&", Gallagher, "&", Percentile, "&", Gini, "\\\\")
)
	us.house.raw.tex <- append("\\hline \\\\[-1.8ex] ", us.house.raw.tex)
	us.house.raw.tex <- append(" Year &  & TPD & Population & Hanby & Gallagher & (80/20) & Gini \\\\ ", us.house.raw.tex)
	us.house.raw.tex <- append("  &   &   & Winning & Loosemore &  & Ratio &  \\\\ ", us.house.raw.tex)
	us.house.raw.tex <- append(" &  & VER & Minimum &  &  & Percentile &  \\\\ ", us.house.raw.tex)
	us.house.raw.tex <-append("\\begin{tabular}{c|ccccccc}", us.house.raw.tex)
	us.house.raw.tex <-append(" ", us.house.raw.tex)
Table(us.house.raw.tex,
	path = "Tables/data_house.tex",
	caption = "U.S. House Data Tables",
	label = "tab:app_house",
	footnote = "",
	landscape = FALSE)



usec.data <- m.ec
usec.data$Minimum_Winning_Population <- 100 - (100 * usec.data$Minimum_Winning_Population)
us.ec.raw.tex <- with(round(usec.data, 2),
paste(seq(1790,2010,10), "&", TPD, "&", VER, "&", Minimum_Winning_Population, "&", Loosemore_Hanbly, "&", Gallagher, "&", Percentile, "&", Gini, "\\\\")
)
	us.ec.raw.tex <- append("\\hline \\\\[-1.8ex] ", us.ec.raw.tex)
	us.ec.raw.tex <- append(" Year &  & TPD & Population & Hanby & Gallagher & (80/20) & Gini \\\\ ", us.ec.raw.tex)
	us.ec.raw.tex <- append("  &   &   & Winning & Loosemore &  & Ratio &  \\\\ ", us.ec.raw.tex)
	us.ec.raw.tex <- append(" &  & VER & Minimum &  &  & Percentile &  \\\\ ", us.ec.raw.tex)
	us.ec.raw.tex <-append("\\begin{tabular}{c|ccccccc}", us.ec.raw.tex)
	us.ec.raw.tex <-append(" ", us.ec.raw.tex)
Table(us.ec.raw.tex,
	path = "Tables/data_ec.tex",
	caption = "Electoral College Data Tables",
	label = "tab:app_ec",
	footnote = "",
	landscape = FALSE)

#### CORRELATIONS

ec.tex <- usec.tex
h.tex <- ushouse.tex
sen.tex <- ussenate.tex

ec.tex[4:10]
h.tex[4:10]
sen.tex[4:10]

corrs.tex <-
c("\\begin{tabular}{c|c|c|c|c|c|c|c|c}",
	" &  &  & Minimum &  &  & Percentile & &   \\\\ 
  & TPD  & VER  & Winning & Loosemore & Gallagher & Ratio & Gini &   \\\\ 
  &  &  & Population & Hanby &  & (80/20) & Index & \\\\ ",
  h.tex[3],
h.tex[4], ec.tex[4], sen.tex[4], h.tex[3],
h.tex[5], ec.tex[5], sen.tex[5], h.tex[3],
h.tex[6], ec.tex[6], sen.tex[6], h.tex[3],
h.tex[7], ec.tex[7], sen.tex[7], h.tex[3],
h.tex[8], ec.tex[8], sen.tex[8], h.tex[3],
h.tex[9], ec.tex[9], sen.tex[9], h.tex[3],
h.tex[10], ec.tex[10], sen.tex[10])
	
	Table(corrs.tex,
	path = "Tables/correlations.tex",
	caption = "Correlations for Seven Measures of Malapportionment",
	label = "tab:corr",
	footnote = "The top entry is for the U.S. House, the middle entry is the Electoral College, and the bottom is the U.S. Senate",
	landscape = TRUE)




m <- list(m.sen, m.house, m.ec)
names(m) <- c("Senate", "House", "ElectoralCollege")


mech.measures <- list(
	senate=lapply(m.sen, as.data.frame, row.names(m.sen)),
	house=lapply(m.house, as.data.frame, row.names(m.house)),
	ec=lapply(m.ec, as.data.frame, row.names(m.ec)))

for (i in 1:3) {
	for (j in 1:7) {
	mech.measures[[i]][[j]] <- per_change(mech.measures[[i]][[j]])
	names(mech.measures[[i]][[j]]) <- years
	}
}


per_mech.sen <- do.call(rbind, mech.measures[[1]])
per_mech.house <- do.call(rbind, mech.measures[[2]])
per_mech.ec <- do.call(rbind, mech.measures[[3]])

source(figures.make)

