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

    x <- append(x,
paste0("\n% =====================================================================
% ▀▄▀▄▀▄ T̟A̟B̟L̟E̟ ▄▀▄▀▄▀▀▄▀▄▀▄ T̟A̟B̟L̟E̟ ▄▀▄▀▄▀▀▄▀▄▀▄ T̟A̟B̟L̟E̟ ▄▀▄▀▄▀▀▄▀▄▀▄ T̟A̟B̟L̟E̟
% ---------------------------------------------------------------------",
ifelse(landscape==T, "\n\\begin{landscape}", "")),
 after = 1)

    x <- append(x,
paste0("\\end{tabular}
\\tabnotes{", footnote, "}
\\end{table}",
ifelse(landscape==T, "\n\\end{landscape}", ""),
"
% ---------------------------------------------------------------------
% ▀▄▀▄▀▄ E͎N͎D͎ T͎A͎B͎L͎E͎ ▄▀▄▀▄▀▀▄▀▄▀▄ E͎N͎D͎ T͎A͎B͎L͎E͎ ▄▀▄▀▄▀▀▄▀▄▀▄ E͎N͎D͎ T͎A͎B͎L͎E͎ ▄▀▄▀▄▀
% ===================================================================== \n \n"),
after = length(x))
cat(paste(latex.special.chr(t), collapse = "\n"), "\n")
cat(paste(latex.special.chr(x), collapse = "\n"), "\n", file = paste0("./Latex/", path))
  }





cat(
	"\n
•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
		CREATING TABLES . . . . . . . . . . . . . . . . . . . . .
•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••\n")
sink("/dev/null")
# races <- c("cong2016", "pres16", "ussen16", "atg16", "aud16", "trea16", "comp2016")
statewide.contests.2016 <- c("Congress", "Presidential", "US Senate", "PA Attorneys General", "PA Auditor", "PA Treasurer", "Composite")
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# County Spliits
county_splits <- c(41, 19, 19, 17)
# COMPACTNESS
geom_names <- paste0(plans, ".geom")

reock.plans <- numeric()
	for (i in 1:length(geom_names)) {
		reock.plans <- rbind(reock.plans, REOCK(get(geom_names[i])))
		}
polsby.plans <- numeric()
	for (i in 1:length(geom_names)) {
		polsby.plans <- rbind(polsby.plans, POLSBYPOPPER(get(geom_names[i])))
		}

tab_plan_sum <- cbind.data.frame(
	Plan = plan_names,
	CountySplits = county_splits, 
	Reock = reock.plans, 
	PolsbyPopper = polsby.plans
	# Pres2016 = c(seats.print(enacted.pres), seats.print(court.pres), seats.print(joint.pres), seats.print(govwolf.pres)),
	# Comp2016 = c(seats.print(enacted.comp), seats.print(court.comp), seats.print(joint.comp), seats.print(govwolf.comp))
	)
tab_plan_sum
plan_summary.caption = "County Splits and Compactness Scores of the Plans"
plan_summary.label = "tab:summaries"
plan_summary.footnote = "County splits include all the pieces in which a county is split, not just the total number of counties that have been split. (The latter number is the one most often reported in both court documents and in the media, but we regard the measure we report as both more precise and more informative.)"


tab_plan_summary <- 
	stargazer(tab_plan_sum,
		style = "apsr", 
		header = FALSE,
		summary = FALSE,
		model.numbers = FALSE,
		initial.zero = TRUE,
		digits = 3,
		column.sep.width = "0pt",
		rownames = FALSE,
		multicolumn = TRUE,
		label = plan_summary.label,
		title = plan_summary.caption,
		covariate.labels = ,
		notes = plan_summary.footnote 
		)
tab_plan_summary <- tab_plan_summary[c(-6, -7, -13, -14, -15, -16)]
# tab_plan_summary <- append(tab_plan_summary, 
# 	"  &   &  &  & \\textbf{Projected} & \\textbf{Projected}  \\\\", 
#   after = 5)
# tab_plan_summary <- append(tab_plan_summary,
# 	"  &  \\textbf{County}  &  \\textbf{Polsby}   &   &  \\textbf{2016 using}  &  \\textbf{five state-wide} \\\\",
# 	after = 6)
# tab_plan_summary <- append(tab_plan_summary,
# 	"  \\textbf{Plan}  &  \\textbf{Splits} &  \\textbf{Popper}  &  \\textbf{Reock}  &  \\textbf{Presidential Results}  &  \\textbf{elections in 2016} \\\\",
# 	after = 7)

tab_plan_summary <- append(tab_plan_summary,
	"  &  \\textbf{County}  &  \\textbf{Polsby}   &   \\\\",
	after = 5)
tab_plan_summary <- append(tab_plan_summary,
	"  \\textbf{Plan}  &  \\textbf{Splits} &  \\textbf{Popper}  &  \\textbf{Reock}  \\\\",
	after = 6)
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••


# =================================================================
# Comparing Pennsylvania Congressional Results with State-wide Elections (2016) %
# =================================================================
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# SUMMARY OF ELECTIONS
percent(sum(house.rep.2012)/sum(house.2012.turnout))
percent(sum(house.rep.2014)/sum(house.2014.turnout))
percent(sum(house.rep.2016)/sum(house.2016.turnout))

congsum.caption = "U.S. House Election Summaries \\\\ {\\large\\hspace{4cm}(PA 2012-2016 Enacted Map)}"
congsum.label = "tab:congsum"
congsum.footnote = "Calculations based on actual congressional elections in Pennsylvania under the map found unconstitutional in 2018. Uncontested races are imputed with 0.25 and 0.75 for the respective winners. Un-adjusted Republican two-party vote totals are 49.2\\% for 2012, 55.5\\% for 2014, and 54.1\\% for 2016. All votes are calculated from the Republican perspective of the two-party vote. We've adjusted all gerrymandering measures such that negative numbers indicate bias in favor of the Democrats."


congsum.tmp <- cbind.data.frame(
	# PA2004 = gerry(default.unc(house.2004.votes)),
	# PA2006 = gerry(default.unc(house.2006.votes)),
	# PA2008 = gerry(default.unc(house.2008.votes)),
	# PA2010 = gerry(default.unc(house.2010.votes)),
 	PA2012 = gerry(default.unc(house.2012.votes)), 
 	PA2014 = gerry(default.unc(house.2014.votes)), 
	PA2016 = gerry(default.unc(house.2016.votes)),
	# PA2018 = gerry(default.unc(house.2018.votes)),
	PA2012_2016_AVE = rowMeans(cbind(	
  	gerry(default.unc(house.2012.votes), toggle=F),
  	gerry(default.unc(house.2014.votes), toggle=F),
  	gerry(default.unc(house.2016.votes), toggle=F)))
  )
congsum.tmp[2:3,4]  <- percent(congsum.tmp[2:3,4])
congsum.tmp[4:7,4] <- r(as.numeric(congsum.tmp[4:7,4]))
colnames(congsum.tmp) <- c(seq(2012,2016,2),"AVE")
congsum.tmp.tex <- stargazer(congsum.tmp,
	style = "apsr", 
	summary = FALSE,
	header = FALSE,
	column.sep.width = "-5pt",
	multicolumn = TRUE,
	label = congsum.label,
	title = congsum.caption,
	notes = congsum.footnote)
congsum.tmp.tex <- congsum.tmp.tex[c(-6, -16, -17, -18, -19)]
congsum.tmp.tex[8] <- "Seats &  [13R-5D] &  [13R-5D] &  [13R-5D] & [13R-5D] \\\\ "
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
dist_summary <- 
	rbind(
	  cbind.data.frame(
	    District = seq(1,18,1),
	    sapply(composite(pa.redist.dta, "enacted"), percent)),
	    c(
	      "Statewide",
	      sapply(colMeans(composite(pa.redist.dta, "enacted")), percent)
	    )
	)

district_summary.caption = "2016 District-level Summaries for 2011 Enacted Plan"
district_summary.label = "tab:districtvotes"
district_summary.footnote = "Uncontested races and those with only negligible competition will be imputed with 0.25 and 0.75 for the respective winners. All votes are calculated from the Republican perspective of the two-party vote. Composite does NOT include the Congressional elections. The statewide average is the unweighted mean of districts."

district_summary <- stargazer(dist_summary,
	style = "apsr", 
	summary = FALSE,
	header = FALSE,
	column.sep.width = "-5pt",
	multicolumn = TRUE,
	rownames = FALSE,
	label = district_summary.label,
	title = district_summary.caption,
	notes = "REPLACE WITH NOTES" )
district_summary <- district_summary[c(-6, -28, -29, -30, -31)]
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

# =================================================================
# Measures of Gerrymandering for the Eight Considered Plans
# =================================================================
gerry.table.gen <- 
	cbind.data.frame(
		gtab("enacted"),
		gtab("joint"),
		gtab("govwolf"),
		gtab("court")
		)

	colnames(gerry.table.gen) <- c(plan_names)
	rownames(gerry.table.gen) <- c(
		"Partisan Bias", 
		"CI1",
		"Efficiency Gap",
		"CI2",
		"Mean/Median",
		"CI3",
		"Declination",
		"CI4")

gerry.caption = "Measures of Gerrymandering for the Four Considered Plans at 50\\% Vote Share"
gerry.label = "tab:gerry"
gerry.footnote = "$^{*}$p $<$ 0.05; $^{**}$p $<$ .01; $^{***}$p $<$ 0.001. Measures are averages of 1,000 simulations for each map using the 2016 composite. Brackets numbers are the 95\\% range."
 
tab_gerry.tex <- stargazer(gerry.table.gen,
    style = "apsr", 
    summary=F,
    column.sep.width = "-5pt", 
    float = T, 
    header = FALSE,
    multicolumn = TRUE, 
    title= gerry.caption, 
    label= gerry.label,
	notes = gerry.footnote)
	tab_gerry.tex <- gsub("CI[1-9]", "", tab_gerry.tex)
tab_gerry <- tab_gerry.tex[c(-6, -17, -18, -19, -20)]
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

tab_prop.gen <- 
	cbind.data.frame(
		ptab("enacted"),
		ptab("joint"),
		ptab("govwolf"),
		ptab("court")
		)
	colnames(tab_prop.gen) <- c(plan_names)
	rownames(tab_prop.gen) <- c(
		"Mean Seat Share",
		"CI1", 
		"Median Seat Share",
		"Probability Republican Majority",
		"Probability Democratic Majority",
		"Probability Tied Delegation")

prop.caption = "Probabilistic Projections of Partisan Outcomes for Four Plans at 50\\% Vote-Share"
prop.label = "tab:prob"
prop.footnote = "Using a Composite of Five Statewide Elections (adjusted to a 50\\% Vote Share) but not correcting for incumbency. We report the mean seat-share from 1,000 simulations, along with a 95\\% range of the simulated outcomes."

tab_prop.tex <- stargazer(tab_prop.gen,
    style = "apsr", 
    summary=F,
    column.sep.width = "-5pt", 
    float = T, 
    header = FALSE,
    multicolumn = TRUE, 
    title= prop.caption, 
    label= prop.label,
	notes = prop.footnote)
tab_prop.tex <- gsub("CI[1-9]", "", tab_prop.tex)
tab_prop <- tab_prop.tex[c(-6, -15, -16, -17, -18)]

# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

# =================================================================
# Information about Twelve States with Constitutional Provisions similar to Pennsylvania
# =================================================================
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# latex <- function(x) cat(paste(x, collapse="\n"), "\n")
# states_compare.caption = "Information about Twelve States with Constitutional Provisions similar to Pennsylvania"
# states_compare.label = "tab:states_compare"
# states_compare.footnote = "Seats and votes are based on the 2016 five-election projection (to deal with the existence of non-contested congressional districts). Percentages are of the of district level results. This difference is why the percentages reported in columns 6 and 8 are not identical. Data from DailyKos, All about Redistricting, and Ballotpedia web sites.States with fewer than 9 districts do not have efficiency gap or median values reported because of the potential unreliability of those calculations given the small number of districts involved."

# tab_states_compare <- 
# 	paste("
# 		\\begin{table}
# 		\\caption{", states_compare.caption, "}
# 		\\label{", states_compare.label, "}
# 		\\begin{tabular}{
# 		>{\\centering\\arraybackslash}
# 		M{0.1\\linewidth}|
# 		M{.025\\linewidth}|
# 		M{.075\\linewidth}
# 		M{.075\\linewidth}
# 		M{.075\\linewidth}
# 		M{.075\\linewidth}
# 		M{.075\\linewidth}
# 		M{.075\\linewidth}
# 		M{.075\\linewidth}
# 		M{.3\\linewidth}}
# 		\\textbf{State} & \\textbf{\\# CDs} & \\textbf{Unified Control (2011)} & \\textbf{Unified Control (2016)} & \\textbf{Seats (2016)} & \\textbf{Votes (2016)} & \\textbf{Mean District Vote Share (Dem)} & \\textbf{Median District Vote Share (Dem)} & \\textbf{Efficiency Gap} & \\textbf{Who does districting} \\\\
# 		 \\hline
# 		Arizona & 9 & $\\surd$ (R) & $\\surd$ (R) & 44.4\\% & 48.1\\% & 50.4\\% & 49.4\\% & 0.08 & Independent commission \\\\
# 		Arkansas & 4 & $\\surd$ (D) & $\\surd$ (R) & 0\\% & 35.7\\% & 35.5\\% &  &  & state legislature \\\\
# 		Delaware & 1 & $\\surd$ (D) & $\\surd$ (D) & 100\\% & 55.9\\% & 56\\% &  &  & NA \\\\
# 		Illinois & 18 & $\\surd$ (D) &  & 61.1\\% & 59.0\\% & 59.6\\% & 59.8\\% & 0.08 & state legislature \\\\
# 		Indiana & 9 & $\\surd$ (R) & $\\surd$ (R) & 22.2\\% & 39.9\\% & 40.1\\% & 35.9\\% & 0.09 & state legislature \\\\
# 		Kentucky & 6 &  & $\\surd$ (R) & 16.7\\% & 34.3\\% & 33.8\\% &  &  & state legislature \\\\
# 		Oklahoma & 5 & $\\surd$ (R) & $\\surd$ (R) & 0\\% & 30.7\\% & 30.7\\% &  &  & state legislature \\\\
# 		Oregon & 5 &  & $\\surd$ (D) & 80\\% & 56.2\\% & 56\\% &  &  & state legislature \\\\
# 		South Dakota & 1 & $\\surd$ (R) & $\\surd$ (R) & 0\\% & 34.0\\% & 34\\% &  &  & NA \\\\
# 		Tennessee & 9 & $\\surd$ (R) & $\\surd$ (R) & 22.2\\% & 36.4\\% & 37.4\\% & 31.3\\% & 0.03 & state legislature \\\\
# 		Washington & 10 & $\\surd$ (D) & $\\surd$ (D) & 70\\% & 58.8\\% & 56\\% & 52.3\\% & -0.05 & 5-member independent commission \\\\
# 		Wyoming & 1 & $\\surd$ (R) & $\\surd$ (R) & 0\\% & 24.3\\% & 24.3\\% &  &  & NA ")


# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

# TWO-PARTY VOTE SHARES, ACTUAL (CONGRESSIONAL)
# tab_summary_stats <- stargazer(
# 	congress.PA.2008.2018,
# 	title="Republican Two-Party Vote/Seat Share, (PA Congressional Elections 2008-2018)",
# 	style = "apsr", 
# 	header = FALSE,
# 	column.sep.width = "-5pt",
# 	multicolumn = TRUE,
# 	label = "tab:twoparty_actuals" )
# tab_summary_stats <- tab_summary_stats[c(-6, -11)]

#  Table(tab_summary_stats,
# 	caption="Two-Party Vote/Seat Share, (PA Congressional Elections 2008-2018)",
# 	label="ab:twoparty_actuals",
# 	footnote="Votes are the two-party unweighted average of PA Congressional Districts by year (uncontested elections imputed).")

# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# AVERAGE VOTE BY DISTRICT
means_races <- numeric()
  base.form <- formula(. ~ 1)
  cong.form <- formula(default.unc(enacted.elections$CONG) ~ + pahouse.2016$INC)
for (k in colnames(enacted.elections))
{
  r.tmp <- composite(pa.redist.dta, "enacted")[,k]
    reg_races <- summary(lm(update(base.form, as.formula(default.unc(r.tmp) ~ .))))
    means_races[k] <- coef(reg_races)[1]
}

  cat(
    "2016 Average Vote Share by State-level Contest \n"
    )
    print(cbind.data.frame(Race = statewide.contests.2016, Mean = percent(means_races)))
    cat(paste("", collapse = "\n"), "\n")
# # Regression of Race on Congressional Results
    reg_cong_pres <- lm(update(cong.form, as.formula(. ~ . + default.unc(enacted.elections$PRES))))
    reg_cong_ussen <- lm(update(cong.form, as.formula(. ~ . +  default.unc(enacted.elections$USSEN))))
    reg_cong_atg <- lm(update(cong.form, as.formula(. ~ . +  default.unc(enacted.elections$ATTGEN))))
    reg_cong_aud <- lm(update(cong.form, as.formula(. ~ . +  default.unc(enacted.elections$AUDITOR))))
    reg_cong_trea <- lm(update(cong.form, as.formula(. ~ . +  default.unc(enacted.elections$TREASURER))))
    reg_cong_comp <- lm(update(cong.form, as.formula(. ~ . +  default.unc(enacted.elections$COMPOSITE))))
    reg_cong_all <- lm(update(cong.form, 
      as.formula(. ~  . +  
        default.unc(enacted.elections$PRES) + 
        default.unc(enacted.elections$USSEN) +
        default.unc(enacted.elections$ATTGEN) +
        default.unc(enacted.elections$AUDITOR) +
        default.unc(enacted.elections$TREASURER))
    ))

congress_predict.caption = "Comparing Pennsylvania Congressional Results with State-wide Elections (2016)"
congress_predict.label = "tab:tab_congress_predict"
congress_predict.footnote = "$^{*}$p $<$ 0.05; $^{**}$p $<$ .01; $^{***}$p $<$ 0.001 \\\\ Uncontested (or non-competitive) elections replaced with 0.25 \\& 0.75 vote shares. Regressions are unweighted, ie, all districts are assumed to have identical turnout. This is the usual way political scientist measure aggregate congressional vote \\cite{GelmanKing1994_unifiedAJPS}. \\\\"

tab_congress_predict <- stargazer(
		reg_cong_pres, 
         reg_cong_ussen, 
         reg_cong_atg, 
         reg_cong_aud, 
         reg_cong_trea, 
         reg_cong_comp,
         reg_cong_all,
star.cutoffs = c(0.05,0.01, 0.001),
style = "apsr", 
header = FALSE,
model.numbers = FALSE,
initial.zero = TRUE,
digits = 2,
column.sep.width = "0pt",
multicolumn = TRUE,
omit.stat = c("ll", "F", "ser"),
dep.var.labels = "Actual Congressional Results (2016)",
covariate.labels = c("Incumbency Advantage","Presidential", "US Senate", "PA Attorneys General", "PA Auditor", "PA Treasurer", "Composite"),
label = congress_predict.label,
title = congress_predict.caption,
notes = congress_predict.footnote
    )
tab_congress_predict <- tab_congress_predict[c(-6, -26, -28, -29, -30, -31, -32)]
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

sink()


Table(tab_plan_summary,
	path = "Tables/_tab_summaries.tex",
	caption = plan_summary.caption,
	label = plan_summary.label,
	footnote = plan_summary.footnote)

Table(congsum.tmp.tex,
	path = "Tables/_tab_congsum.tex",
	caption = congsum.caption,
	label = congsum.label,
	footnote = congsum.footnote)

Table(tab_gerry, 
	path = "Tables/_tab_gerry.tex", 
	caption = gerry.caption,
	label = gerry.label, 
	footnote = gerry.footnote)

Table(tab_prop,
	path = "Tables/_tab_prob.tex",
	caption = prop.caption,
	label = prop.label, 
	footnote = prop.footnote,
	landscape = TRUE)

Table(district_summary,
	path = "Tables/_a_tab_districtvotes.tex",
	caption = district_summary.caption,
	label = district_summary.label,
	footnote = district_summary.footnote
	)

Table(tab_congress_predict,
	path = "Tables/a_tab_congress_predict.tex",
	caption = congress_predict.caption,
	label = congress_predict.label,
	footnote = congress_predict.footnote)
cat("
•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n
	")
