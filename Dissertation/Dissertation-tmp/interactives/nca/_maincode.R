
options(stringsAsFactors=F)
fips <- read.csv("/Users/cervas/Google Drive/Data/fips.csv")
election <- electiondata[[37]]
elec.dta <- merge(election, fips, by.x="state", by.y="name", all.x=T)
a <- data.frame(
	code=elec.dta$st, 
	dem= elec.dta$dem, 
	rep=1-elec.dta$dem, 
	fips=1:length(elec.dta$state), 
	abbreviation=elec.dta$st, 
	votes=elec.dta$ecvotes, 
	name=elec.dta$state)


a[,2] <- ifelse(a[,2]>.53, 1, ifelse(a[,2]<.47, 0, a[,2]))
a[,3] <- ifelse(a[,3]>.53, 1,ifelse(a[,3]<.47, 0, a[,3]))
# a[,3] <- ifelse(a[,3]<.6 & a[,3]>.55,.65,ifelse(a[,3]>.4 & a[,3]<.45,.35, a[,3]))
# a[,2] <- ifelse(a[,2]<.6 & a[,2]>.55,.65,ifelse(a[,2]>.4 & a[,2]<.45,.35, a[,2]))
write.csv(a, "/Users/cervas/Downloads/states.csv", row.names=F)