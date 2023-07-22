bias <- 
	function(x, ...) {
		tmp <- seatsvotes(pct = x)
			return(tmp["bias"])
	}

swing_ratio <- 
	function(x, ...) {
		tmp <- seatsvotes(pct = x)
			return(tmp["swing_ratio"])
	}

centre <- function(x, w = weights, type) {
	if(is.null(w)) w <- rep(1,length(x))
  switch(type,
         fifty = x - (mean.w(x, w) - 0.5),
         actual = x,
         average = x - (mean(x, na.rm=TRUE) - 0.5)
         )
}

'bias' <- function(x) as.numeric(seatsvotes(x)[2])

'seatsvotes' <- 
	function(
		pct = NULL,  
		DEMvotes = NULL, 
		REPvotes = NULL,  
		weights = NULL,
		year = NULL, 
		center = "fifty", # center options ["fifty", "actual", "average"]
		iterations = 0.0015, 
		range = c(0.40, 0.60), 
		...) {
			if (is.null(year)) year <- "MISSING"
			if (is.null(pct)) 
				{
					if (is.null(DEMvotes)) stop("No Election data found")
					if(length(DEMvotes)!=length(REPvotes)) stop("Parties don't have the same number of districts")
			# total <- (DEMvotes + REPvotes)
					pct <- two_party(DEMvotes,REPvotes)
				}
				pct <- default.unc(pct)
			sim	 <- seq(range[1],range[2], by=iterations)
			coefs <- array(NA, c(length(sim), 3))
			if (is.null(weights)) weights <- rep(1, length(pct))
					
				mean.w(pct, weights)
# =================================================================
# -- SIMULATE -- SIMULATE -- SIMULATE --  SIMULATE -- SIMULATE -- S 
# =================================================================
		for (i in 1:length(sim))
			{ 
				x.dem <- centre(pct, weights, center)
					x.dem <- default.unc(x.dem)
				DEMvotesper <- x.dem + (sim[i] - 0.50)
				coefs[i,1] <- sum(find.winner(DEMvotesper))	/ length(DEMvotesper)	#Seats
				coefs[i,2] <- mean.w(DEMvotesper, weights)		#Votes
				coefs[i,3] <- sim[i]
			}
				colnames(coefs) <- c("Seats", "Votes", "Sim")
		coefs2 <- coefs
		coefs2[,1] <- truncate(coefs2[,1])
		coefs2[,2] <- truncate(coefs2[,2]) 

		y <- c(coefs2[,1]/( 1 - coefs2[,1]))
		x <- c(coefs2[,2]/( 1 - coefs2[,2]))
		logged <- cbind(log(y),log(x))

# =================================================================
# -- COLLECT DATA -- COLLECT DATA -- COLLECT DATA --  COLLECT DATA 
# =================================================================
		bias <- list(year = year, 
			bias=NA, 
			bias_se=NA, 
			swing_ratio=NA, 
			swing_ratio_se=NA,  
			Log_Odds_Seats=NA, 
			Linear_Regression_Seats=NA, 
			bias_low=NA,
			bias_point=NA, 
			bias_high=NA,
			seats=NA,
			votes=NA,
			mean=NA,
			median=NA
			)
			votes.tmp <- weighted.mean(pct, weights)
			seats.tmp <- seats(find.winner(pct))
		bias$votes <- votes.tmp
		bias$seats <- seats.tmp
			
		summary(reg <- lm (log(y) ~ log(x)))   #### Log-Odds Regression

# Toy Example
	x.nb <- sv(seq(0.01,.99, 0.1))
	y.nb <- sv(cube(seq(0.01,.99, 0.1)))
	summary(toy <- lm (log(y.nb) ~ log(x.nb)))
paste0("SEATS AT 50% VOTE = ", round(inv(((toy$coefficients[2] * log(sv(0.5))) + toy$coefficients[1])), digits=3) * 100, "%")
paste0("BIAS % = ", round(inv(toy$coefficients[1]) - 0.5, digits=3) * 100, "%")
 1 / (exp(toy$coefficients[1]) / toy$coefficients[2] + 1) - 0.5  # Bias from Grofman 1983 equation 16
	####  (exp(log(1))/( 1 + exp(log(1)))) - .5  #No Bias
		(exp(log(1))/( 1 + exp(log(1)))) - .5

		mean(2*(coefs[,1][round(coefs[,2],2)==.50]-.5))


		bias$swing_ratio <- reg$coefficients[2]
		bias$swing_ratio_se <- summary(reg)$coef[2,2]
		bias$bias <- (inv(reg$coefficients[1])) - 0.5  #### Bias from Grofman 1983 equation 26
		bias$bias_se <- summary(reg)$coef[1,2] 
 1 / (exp(reg$coefficients[1]) / reg$coefficients[2] + 1) - 0.5  # Bias from Grofman 1983 equation 16


		summary(reglin <- lm(coefs2[,1] ~ coefs2[,2]))  #Linear Regression

		bias$Linear_Regression_Seats <- paste0(round(100 * (reglin$coefficients[1]+(reglin$coefficients[2] * 0.5) ), digits=3), "%")	# Seat Predictions from Linear Regression
		bias$Log_Odds_Seats <- 100* (exp(reg$coefficients[1] + (reg$coefficients[2])) / (1+exp(reg$coefficients[1]+(reg$coefficients[2]))) -.5)	#Seat Prediction from Log-Odds Model
		bias$bias_point <- inv(reg$coefficients[1])
		bias$bias_high <- inv(reg$coefficients[1] + (1.96 * summary(reg)$coef[1,2]))
		bias$bias_low <- inv(reg$coefficients[1] - (1.96 * summary(reg)$coef[1,2]))

		bias$mean <- mean(pct)
		bias$median <- median(pct)
		x <- bias
		return(x)
	}



'seatsvotes.plot' <- 
function(v,s, main=NULL) 
	{
	par(pty="s", mar=c(2.5,2.5,2,1))
	plot(v,s, ylim=c(0,1), xlim=c(0,1), type="p", pch=19, col=paste0("#000000", opacity[10]), ylab="Seats", xlab="Votes" , main=main, bty="n", axes=F)
	axis(side=1, at=seq(0, 1, 0.2), labels=c("0%", "20%", "40%", "60%", "80%", "100%"))
	axis(side=2, las=2, at=seq(0,1, 0.2), labels=c("0%", "20%", "40%", "60%", "80%", "100%"))
	abline(v=.5, lty=3, col="gray40")
	abline(h=.5, lty=3, col="gray40")
	abline(0,1, lty=2, col="gray90")
reg <- lm(log(sv(s)) ~ log(sv(v)))
			rect(-.05,-.05,0,1.05, col = rgb(0.1,0.1,0.1,1/2), density=40, border = "transparent") #left
			rect(0,0,1.05 ,-.05, col = rgb(0.1,0.1,0.1,1/2), density=40, border = "transparent") #bottom
			rect(1,0,1.05,1.05, col = rgb(0.1,0.1,0.1,1/2), density=40, border = "transparent") #right
			rect(0,1,1,1.05, col = rgb(0.1,0.1,0.1,1/2), density=40, border = "transparent") #top
	# plot(cube, from=0, to=1, add=TRUE, lwd=1.5, col="gray90", lty=4)
	# plot(cube, from=0, to=1, add=TRUE, lwd=1, col="gray80", lty=5)
	vote <- seq(0,1, by=.01)
	seatvotes <-  reg$coefficients[2]*log(vote/(1-vote)) + reg$coefficients[1]
	funct2 <- function (x)  exp(seatvotes)  / (1 + exp(seatvotes)) 
	plot(funct2, from=0.01, to=0.99, add=TRUE, lwd=2, col="gray40")

	# lines(v,s) #redraw so actual results on top
	# points(house.2016,seats.2016, cex=2, col="gray10", pch=19)
	# points(house.2016,seats.2016, cex=.75, col="gray60", pch=15)
	# text(house.2016,seats.2016, "Actual Election Results", cex=.6, pos=4)
	# text(.23,.25, "PROPORTIONAL REPRESENTATION", srt=45, cex=.5, col="gray90")
	}


biasplot <- 
function(sv) {
	par(mar=c(3,3,0,0))
	plot(sv[,"year"], sv[,"bias_mean"], ylim=c(25,75), xlim=c(1868,2016), type="n", yaxt="n", xaxt="n", xlab="", ylab="", bty="n")
	axis(side=2, las=2, labels=c("25%", "30%", "35%", "40%", "45%", "50%", "55%", "60%", "65%", "70%", "75%"), at=c(25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75), cex.axis=.65)
	axis(side=1, at=seq(1872, 2016, 16), cex.axis=.65)
	mtext(side=2, line=2.25, "Expected Democratic Seat Share at 50% Vote", cex=0.65)

	for (i in 1:length(sv[,1]))
	{
	xx <- c(sv[i,"year"], rev(sv[i,"year"]))
	yy <- c(sv[i,"bias_high"],rev(sv[i,"bias_low"]))

	lines(sv[i,"year"], sv[i,"bias_low"], lty=2, col= greycol)
	lines(sv[i,"year"], sv[i,"bias_high"], lty=2, col= greycol)
	polygon(xx,yy, col= "black", density=20)
	# polygon(xx,yy, col= "black", density=20, angle=90)
	 }
	abline(h=50.05, lwd=2, lty=2, col="gray80")
	abline(h=50, lwd=2, lty=2, col="gray20")
	points(sv[,"year"], sv[,"bias_mean"], pch=ifelse(sv[,"bias_low"]>50, ifelse(sv[,"bias_high"]<50, 1, 19), 1))
	points(sv[,"year"], sv[,"bias_mean"], pch=ifelse(sv[,"bias_low"]<50, ifelse(sv[,"bias_high"]>50, 1, 19), 1))
	text(1863, 60, "Pro-Democratic Bias", cex=0.65, srt=90, pos=1, col="gray30")
	text(1863, 40, "Pro-Republican Bias", cex=0.65, srt=90, pos=1, col="gray30")
	}




