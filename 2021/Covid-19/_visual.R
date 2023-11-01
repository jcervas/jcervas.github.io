

covid <- read.csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv", stringsAsFactors=F)
# covid <- read.csv("/Users/cervas/Downloads/time_series_covid19_deaths_US.csv")
head(covid)
covid.US <- covid[covid$Country_Region %in% "US",]


covid.st <- aggregate(covid.US[,13:dim(covid.US)[2]], by=list(covid.US[,"Province_State"]), FUN=sum)
# days <- c(paste("March", 19:31), paste("April", 1:4))
# colnames(covid.st) <- c("st", days)
colnames(covid.st) <- c("st", 1:(dim(covid.st)[2]-1))
covid.st <- covid.st[!covid.st$st %in% c("Virgin Islands", "Puerto Rico", "Northern Mariana Islands", "Guam", "Grand Princess", "Diamond Princess", "American Samoa"),]
covid.st[,1] <- as.character(covid.st[,1])
covid.st[,1][covid.st[,1] %in% "District of Columbia"] <- "D. C."

covid.st1 <- covid.st[,-1]
rownames(covid.st1) <- covid.st[,1]
tmp <- split(covid.st1,rownames(covid.st1))
perday <- lapply(tmp, function(x) diff(as.numeric(x)))
covid.tmp <- lapply(tmp, function(x) cumsum(x))

	# What if start at 500th death?
	# covid.tmp <- lapply(covid.tmp, function(x) x[x>50])
		# cov.length <- max(do.call(rbind, lapply(covid.tmp, function(x) length(x))))
		# covid.tmp <- lapply(covid.tmp, function(x) c(rep(0, cov.length-length(x)),x))

covid.tmp <- do.call(rbind, covid.tmp)
covid.tmp[(nrow(covid.tmp)+1),] <- colSums(covid.tmp)

fromDay <- function(x) {
	x <- as.numeric(unlist(x))
	i <- 1
	if (is.na(x[i])) x[i] <- 0
	while (x[i] <= 0) {
		i <- i+1L
		if (is.na(x[i])) x[i] <- 0
		if (i == length(x)) break
	}
		x <- x[i:length(x)]
		x <- c(x, rep(NA, i))
	return(as.numeric(x))
}

applydouble <- function(x,y,z){z*(2^(1/y))^x}
doubletime <- function(x,y,z) {(x*log(2))/(log(y/z))}



a <- numeric() 
for (j in 1:nrow(covid.tmp)) {
	a <- rbind(a, fromDay(covid.tmp[j,]))
}
a <- as.data.frame(a)
rownames(a) <- c(covid.st[,1], "US")

j <- 1
while (!all(is.na(a[,j]))) j <- j+1
a <- a[,1:j-1]
colnames(a) <- 1:ncol(a)
write.csv(a, "/Users/user/Downloads/deaths_US.csv", row.names=T)

u <- covid.st1[52,]
doubletime(3,u[length(u)], u[(length(u)-3)])

# html <- readLines("/Users/cervas/Google Drive/Projects/Web Development/Covid-19/deaths_days.html")
# html[779]
# writeLines(a)


# b <- c("var data = {\"State\"", paste0("\"", as.character(1:ncol(a)), "\""))
# for (j in 1:nrow(a)) {
# 	b <- c(b, paste0("\"", rownames(a)[j], "\""))
# 	for (i in 1:ncol(a)) {
# 		b <- c(b, a[j,i])
# 	}
# 	b <- c(b, "\\n")
# }
# b

# html.write <- paste(b, collapse=",")
# html.write <- paste0(html.write, "}")
# html[779] <- html.write
# writeLines(html, "/Users/cervas/Google Drive/Projects/Web Development/Covid-19/deaths_days2.html")
# # # # # # # # 

covid.pop <- pop[,"2010"][match(covid.st[,1], row.names(pop))]
us.pop <- sum(covid.pop)


covid.stp <- (covid.st[,2:18]/covid.pop) * 1000000
covid.stp <- rbind(covid.stp, colSums(covid.stp/us.pop * 1000000))
rownames(covid.stp) <- c(covid.st[,1], "US")
write.csv(covid.stp, "/Users/user/Downloads/STcovid19_deaths_US.csv", row.names=T)


rownames(covid.st) <- covid.st[,1]

# covid.change <- do.call(cbind, lapply(covid.st1, FUN=as.numeric))
tmp <- 100*(covid.change[,2:17] - covid.change[,1:16])/ covid.change[,1:16]
rownames(covid.change) <- covid.st[,1]


# topten <- covid.st[order(as.numeric(covid.st[,"April 4"]), decreasing=T),][1:10,]
# topten$st



"New York":0,"New Jersey":0,"Louisiana":0,"Michigan":0,"Washington":0,"Connecticut":0,"D. C.":0,"Massachusetts":0,"Vermont":0,"Colorado":0

"Georgia":1,"Illinois":1,"Indiana":1,"Nevada":1,"Rhode Island":1,"Delaware":1,"Mississippi":1,"Oklahoma":1,"Pennsylvania":1,"Florida":1,"Wisconsin":1,"Maryland":1,"Kentucky":1,"Alabama":1,"Ohio":1,"South Carolina":1,"Arizona":1,"Tennessee":1,"California":1,"Maine":1,"Kansas":1,"Alaska":1,"Virginia":1,"Idaho":1,"Montana":1,"Oregon":1,"Missouri":1,"New Hampshire":1,"New Mexico":1,"Arkansas":1,"Texas":1,"Iowa":1,"Minnesota":1,"North Dakota":1,"North Carolina":1,"Nebraska":1,"Utah":1,"South Dakota":1,"Hawaii":1,"West Virginia":1,"Wyoming":1 

"New York":0,"New Jersey":0,"Louisiana":0,"Michigan":0,"Washington":0,"Connecticut":0,"D. C.":0,"Massachusetts":0,"Vermont":0,"Colorado":0,"Georgia":1,"Illinois":1,"Indiana":1,"Nevada":1,"Rhode Island":1,"Delaware":1,"Mississippi":1,"Oklahoma":1,"Pennsylvania":1,"Florida":1,"Wisconsin":1,"Maryland":1,"Kentucky":1,"Alabama":1,"Ohio":1,"South Carolina":1,"Arizona":1,"Tennessee":1,"California":1,"Maine":1,"Kansas":1,"Alaska":1,"Virginia":1,"Idaho":1,"Montana":1,"Oregon":1,"Missouri":1,"New Hampshire":1,"New Mexico":1,"Arkansas":1,"Texas":1,"Iowa":1,"Minnesota":1,"North Dakota":1,"North Carolina":1,"Nebraska":1,"Utah":1,"South Dakota":1,"Hawaii":1,"West Virginia":1,"Wyoming":1