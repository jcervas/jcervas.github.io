# Remove all objects just to be safe.
	rm(list=ls(all=TRUE))
	options(scipen=999) # Turn off Scientific Notation

	source("https://raw.githubusercontent.com/jcervas/R-Functions/main/apportion/apportion.R")

pop2020 <- read.csv("/Users/user/Library/Mobile Documents/com~apple~CloudDocs/Downloads/pop2020.csv")

POP=pop.t <- pop2020[,2]
STATES=states.t <- pop2020[,1]
quota <- pop.t/sum(POP=pop.t)*435


# ▒█░▒█ ░▀░ █░░ █░░ ░░ ▒█░▒█ █░░█ █▀▀▄ ▀▀█▀▀ ░▀░ █▀▀▄ █▀▀▀ ▀▀█▀▀ █▀▀█ █▀▀▄ 
# ▒█▀▀█ ▀█▀ █░░ █░░ ▀▀ ▒█▀▀█ █░░█ █░░█ ░░█░░ ▀█▀ █░░█ █░▀█ ░░█░░ █░░█ █░░█ 
# ▒█░▒█ ▀▀▀ ▀▀▀ ▀▀▀ ░░ ▒█░▒█ ░▀▀▀ ▀░░▀ ░░▀░░ ▀▀▀ ▀░░▀ ▀▀▀▀ ░░▀░░ ▀▀▀▀ ▀░░▀

hill.change.gain <- appt.gain(POP=pop.t,STATES=states.t,method="hill-huntington")
hill.change.lose <- appt.lose(POP=pop.t,STATES=states.t,method="hill-huntington")


# ░█▀▀█ █▀▀▄ █▀▀█ █▀▄▀█ █▀▀ 
# ▒█▄▄█ █░░█ █▄▄█ █░▀░█ ▀▀█ 
# ▒█░▒█ ▀▀▀░ ▀░░▀ ▀░░░▀ ▀▀▀

adams.change.gain <- appt.gain(POP=pop.t,STATES=states.t,method="adams")
adams.change.lose <- appt.lose(POP=pop.t,STATES=states.t,method="adams")



# ░░░▒█ █▀▀ █▀▀ █▀▀ █▀▀ █▀▀█ █▀▀ █▀▀█ █▀▀▄ 
# ░▄░▒█ █▀▀ █▀▀ █▀▀ █▀▀ █▄▄▀ ▀▀█ █░░█ █░░█ 
# ▒█▄▄█ ▀▀▀ ▀░░ ▀░░ ▀▀▀ ▀░▀▀ ▀▀▀ ▀▀▀▀ ▀░░▀

jefferson.change.gain <- appt.gain(POP=pop.t,STATES=states.t,method="jefferson")
jefferson.change.lose <- appt.lose(POP=pop.t,STATES=states.t,method="jefferson")



# ▒█░░▒█ █▀▀ █▀▀▄ █▀▀ ▀▀█▀▀ █▀▀ █▀▀█ 
# ▒█▒█▒█ █▀▀ █▀▀▄ ▀▀█ ░░█░░ █▀▀ █▄▄▀ 
# ▒█▄▀▄█ ▀▀▀ ▀▀▀░ ▀▀▀ ░░▀░░ ▀▀▀ ▀░▀▀

webster.change.gain <- appt.gain(POP=pop.t,STATES=states.t,method="webster")
webster.change.lose <- appt.lose(POP=pop.t,STATES=states.t,method="webster")



# ▒█░▒█ █▀▀█ █▀▄▀█ ░▀░ █░░ ▀▀█▀▀ █▀▀█ █▀▀▄ 
# ▒█▀▀█ █▄▄█ █░▀░█ ▀█▀ █░░ ░░█░░ █░░█ █░░█ 
# ▒█░▒█ ▀░░▀ ▀░░░▀ ▀▀▀ ▀▀▀ ░░▀░░ ▀▀▀▀ ▀░░▀

hamilton.change.gain <- appt.gain(POP=pop.t,STATES=states.t,method="hamilton")
hamilton.change.lose <- appt.lose(POP=pop.t,STATES=states.t,method="hamilton")



# ████████╗░█████╗░██████╗░██╗░░░░░███████╗  ░░███╗░░
# ╚══██╔══╝██╔══██╗██╔══██╗██║░░░░░██╔════╝  ░████║░░
# ░░░██║░░░███████║██████╦╝██║░░░░░█████╗░░  ██╔██║░░
# ░░░██║░░░██╔══██║██╔══██╗██║░░░░░██╔══╝░░  ╚═╝██║░░
# ░░░██║░░░██║░░██║██████╦╝███████╗███████╗  ███████╗
# ░░░╚═╝░░░╚═╝░░╚═╝╚═════╝░╚══════╝╚══════╝  ╚══════╝

hill <- apportion(STATES=STATES,POP=POP, method="hill-huntington")[,2]
cbind.data.frame(
	state=STATES,
	pop=format(POP, big.mark=","),
	# quota=round(quota,d=2),
		hill=hill,
		adams=apportion(STATES=STATES,POP=POP, method="adams")[,2]-hill,
		webster=apportion(STATES=STATES,POP=POP, method="webster")[,2]-hill,
		jefferson=apportion(STATES=STATES,POP=POP, method="jefferson")[,2]-hill,
		hamilton=apportion(STATES=STATES,POP=POP, method="hamilton")[,2]-hill
)[order(hill, decreasing=T),]


# ████████╗░█████╗░██████╗░██╗░░░░░███████╗  ██████╗░
# ╚══██╔══╝██╔══██╗██╔══██╗██║░░░░░██╔════╝  ╚════██╗
# ░░░██║░░░███████║██████╦╝██║░░░░░█████╗░░  ░░███╔═╝
# ░░░██║░░░██╔══██║██╔══██╗██║░░░░░██╔══╝░░  ██╔══╝░░
# ░░░██║░░░██║░░██║██████╦╝███████╗███████╗  ███████╗
# ░░░╚═╝░░░╚═╝░░╚═╝╚═════╝░╚══════╝╚══════╝  ╚══════╝
write.csv(data.frame(
	hill_less=hill.change.gain[order(hill.change.gain[,2]),],
	hill_excess=hill.change.lose[order(hill.change.lose[,2]),],

	adams_less=adams.change.gain[order(adams.change.gain[,2]),],
	adams_excess=adams.change.lose[order(adams.change.lose[,2]),],

	jefferson_less=jefferson.change.gain[order(jefferson.change.gain[,2]),],
	jefferson_excess=jefferson.change.lose[order(jefferson.change.lose[,2]),],

	webster_less=webster.change.gain[order(webster.change.gain[,2]),],
	webster_excess=webster.change.lose[order(webster.change.lose[,2]),],

	hamilton_less=hamilton.change.gain[order(hamilton.change.gain[,2]),],
	hamilton_excess=hamilton.change.lose[order(hamilton.change.lose[,2]),]
	), "/Users/user/Google Drive/Projects/Apportionment/minChangeMethods.csv", row.names=F)



# ██████╗░░█████╗░██╗░░░░░██╗███╗░░██╗░██████╗██╗░░██╗██╗  ░█████╗░███╗░░██╗██████╗░
# ██╔══██╗██╔══██╗██║░░░░░██║████╗░██║██╔════╝██║░██╔╝██║  ██╔══██╗████╗░██║██╔══██╗
# ██████╦╝███████║██║░░░░░██║██╔██╗██║╚█████╗░█████═╝░██║  ███████║██╔██╗██║██║░░██║
# ██╔══██╗██╔══██║██║░░░░░██║██║╚████║░╚═══██╗██╔═██╗░██║  ██╔══██║██║╚████║██║░░██║
# ██████╦╝██║░░██║███████╗██║██║░╚███║██████╔╝██║░╚██╗██║  ██║░░██║██║░╚███║██████╔╝
# ╚═════╝░╚═╝░░╚═╝╚══════╝╚═╝╚═╝░░╚══╝╚═════╝░╚═╝░░╚═╝╚═╝  ╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░

# ██╗░░░██╗░█████╗░██╗░░░██╗███╗░░██╗░██████╗░  ████████╗░█████╗░██████╗░██╗░░░░░███████╗
# ╚██╗░██╔╝██╔══██╗██║░░░██║████╗░██║██╔════╝░  ╚══██╔══╝██╔══██╗██╔══██╗██║░░░░░██╔════╝
# ░╚████╔╝░██║░░██║██║░░░██║██╔██╗██║██║░░██╗░  ░░░██║░░░███████║██████╦╝██║░░░░░█████╗░░
# ░░╚██╔╝░░██║░░██║██║░░░██║██║╚████║██║░░╚██╗  ░░░██║░░░██╔══██║██╔══██╗██║░░░░░██╔══╝░░
# ░░░██║░░░╚█████╔╝╚██████╔╝██║░╚███║╚██████╔╝  ░░░██║░░░██║░░██║██████╦╝███████╗███████╗
# ░░░╚═╝░░░░╚════╝░░╚═════╝░╚═╝░░╚══╝░╚═════╝░  ░░░╚═╝░░░╚═╝░░╚═╝╚═════╝░╚══════╝╚══════╝
cbind.data.frame(
	state=STATES,
	pop=format(POP, big.mark=","),
	quota=round(quota,d=2),
		adams=apportion(STATES=STATES,POP=POP, method="adams")[,2],
		hill=apportion(STATES=STATES,POP=POP, method="hill-huntington")[,2],
		webster=apportion(STATES=STATES,POP=POP, method="webster")[,2],
		jefferson=apportion(STATES=STATES,POP=POP, method="jefferson")[,2],
		hamilton=apportion(STATES=STATES,POP=POP, method="hamilton")[,2]
)[order(quota, decreasing=T),]