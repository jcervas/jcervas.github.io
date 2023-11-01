states.t <- app.april.1.2020$state
pop.t <- app.april.1.2020$pop
pop.t[states.t %in% "MT"] <- pop.t[states.t %in% "MT"]+56553
		
		# a <- apportion(
		# 	STATES=app.april.1.2020$state, 
		# 	POP=app.april.1.2020$pop, 
		# 	n_seats=435, 
		# 	autoseats=1, 
		# 	threshold=0, 
		# 	method = "hamilton", 
		# 	state = "all")

		b <- apportion(
			STATES=states.t, 
			POP=pop.t, 
			n_seats=435, 
			autoseats=1, 
			threshold=0, 
			method = "hamilton", 
			state = "all")

		data.frame(a,b)





states.t <- app.april.1.2020$state
pop.t <- app.april.1.2020$pop
		a <- apportion(
			STATES=app.april.1.2020$state, 
			POP=app.april.1.2020$pop, 
			n_seats=435, 
			autoseats=1, 
			threshold=0, 
			method = "hill-huntington", 
			state = "all")
appt.hill.change <- data.frame(st=states.t, minpop=NA)
	for (j in 1:length(states.t)) {
		pop.j <- pop.t
		appt.a <- a$seats[a$state %in% states.t[j]]
		x <- floor(sum(pop.t)/435/5)
			pop.j[states.t %in% states.t[j]] <- pop.t[states.t %in% states.t[j]] + x

			b <- apportion(
				STATES=states.t, 
				POP=pop.j, 
				n_seats=435, 
				autoseats=1, 
				threshold=0, 
				method = "hill-huntington", 
				state = "all")
			appt.b <- b$seats[b$state %in% states.t[j]]
		if (appt.a == appt.b) {
		next
		}
		appt.b <- appt.a

		for (i in 1:x) {
				cat(states.t[j], ":", i, ".")
			pop.j[states.t %in% states.t[j]] <- pop.t[states.t %in% states.t[j]] + i

			b <- apportion(
				STATES=states.t, 
				POP=pop.j, 
				n_seats=435, 
				autoseats=1, 
				threshold=0, 
				method = "hill-huntington", 
				state = "all")
			appt.b <- b$seats[b$state %in% states.t[j]]
			if (appt.a != appt.b) {break}
		}
		appt.hill.change[j,2] <- i
	}


	# ----



states.t <- app.april.1.2020$state
pop.t <- app.april.1.2020$pop
		a <- apportion(
			STATES=app.april.1.2020$state, 
			POP=app.april.1.2020$pop, 
			n_seats=435, 
			autoseats=1, 
			threshold=0, 
			method = "jefferson", 
			state = "all")
appt.jefferson.change <- data.frame(st=states.t, minpop=NA)
x <- 100000
	for (j in 1:length(states.t)) {
		pop.j <- pop.t
		appt.a <- a$seats[a$state %in% states.t[j]]
		
			pop.j[states.t %in% states.t[j]] <- pop.t[states.t %in% states.t[j]] + x

			b <- apportion(
				STATES=states.t, 
				POP=pop.j, 
				n_seats=435, 
				autoseats=1, 
				threshold=0, 
				method = "jefferson", 
				state = "all")
			appt.b <- b$seats[b$state %in% states.t[j]]
		if (appt.a == appt.b) {
		next
		}
			appt.b <- appt.a
			
		for (i in 1:x) {
				cat(states.t[j], ":", i, ".")
			pop.j[states.t %in% states.t[j]] <- pop.t[states.t %in% states.t[j]] + i

			b <- apportion(
				STATES=states.t, 
				POP=pop.j, 
				n_seats=435, 
				autoseats=1, 
				threshold=0, 
				method = "jefferson", 
				state = "all")
			appt.b <- b$seats[b$state %in% states.t[j]]
			if (appt.a != appt.b) {break}
		}
		appt.jefferson.change[j,2] <- i
	}


appt2000 <- read.csv("https://raw.githubusercontent.com/jcervas/R-Functions/main/apportion/appt2000.csv")
state=appt2000[,1]
pop=appt2000[,2]
apportion(
			STATES=appt2000[,1], 
			POP=appt2000[,2], 
			n_seats=435, 
			autoseats=1, 
			threshold=0, 
			method = "hamilton", 
			state = "all")


states.t <- app.april.1.2020$state
pop.t <- app.april.1.2020$pop
		a <- apportion(
			STATES=app.april.1.2020$state, 
			POP=app.april.1.2020$pop, 
			n_seats=435, 
			autoseats=1, 
			threshold=0, 
			method = "adams", 
			state = "all")
appt.adams.change <- data.frame(st=states.t, minpop=NA)
x <- 60000
	for (j in 1:length(states.t)) {
		pop.j <- pop.t
		appt.a <- a$seats[a$state %in% states.t[j]]
		
			pop.j[states.t %in% states.t[j]] <- pop.t[states.t %in% states.t[j]] + x

			b <- apportion(
				STATES=states.t, 
				POP=pop.j, 
				n_seats=435, 
				autoseats=1, 
				threshold=0, 
				method = "adams", 
				state = "all")
			appt.b <- b$seats[b$state %in% states.t[j]]
		if (appt.a == appt.b) {
		next
		}
			appt.b <- appt.a
			
		for (i in 1:x) {
				cat(states.t[j], ":", i, ".")
			pop.j[states.t %in% states.t[j]] <- pop.t[states.t %in% states.t[j]] + i

			b <- apportion(
				STATES=states.t, 
				POP=pop.j, 
				n_seats=435, 
				autoseats=1, 
				threshold=0, 
				method = "adams", 
				state = "all")
			appt.b <- b$seats[b$state %in% states.t[j]]
			if (appt.a != appt.b) {break}
		}
		appt.adams.change[j,2] <- i
	}


	appt.hill.change
	appt.jefferson.change
	appt.hamilton.change
