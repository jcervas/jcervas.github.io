

############################################################################################################
################################ - FIGURES - ###############################################################
############################################################################################################
# - Plot Functions
  years <- seq(1790,2010,10)
  x.axis <- c(years, years[length(years)]+10, years[length(years)]+20, years[length(years)]+30)
    mal.plot <- function(x, y, z, dep.var, main="", xaxis=T, mar=c(2, 4, 0, 0)) {
      max.y <<- (max(c(x, y, z))) * 1.15
      min.y <<- (min(c(x, y, z))) * 0.85
        par(mar = mar)
    new.mal.plot <- plot(x.axis, seq(1:length(x.axis)), 
      type = "n", ylab = "", xlab = "", 
      yaxt = "n", xaxt = "n", bty = "n", 
      sub = "", cex.sub = .5, ylim = c(min.y, max.y), 
      cex.lab = .85, cex.axis = 0.65) 
    mtext(side = 2, line = 3, dep.var, cex = 1, font=4) 
    # rect(1915, -.1, 1925, max.y, col = "gray90", density = 40, border = "transparent") #bottom
    # text(1919, max.y/2, pos = 1, "No Apportionment", cex = 0.6, srt = 90)
    # rect(1790, -.2, 1868, max.y, col = "gray90", density = 40, border = "transparent") #bottom
    # text(1829, max.y, pos = 1, "3/5 Compromise", cex = 0.6)
    # abline(v = 1962, lty = 2, col = "gray70")
    # text(1964, max.y/2, pos = 1, expression(italic("Baker v. Carr") ~" (1962)"), cex = 0.6, srt = 90, col="gray50")
        if (xaxis==T){
          axis(side = 1, las = 1, at = seq(1790, 2010, 20), cex.axis = 0.85, font=4) 
          mtext(side = 3, line = 1, main, cex = 1, font=4) 
      } else {
            mtext(side = 3, line = 1, main, cex = 1, font=4) }    
        axis(side = 2, las = 2, cex.axis = 0.85, font=4)      
             grid(NA, NULL, lwd = .5, col="gray40") 
             abline(h=0, lwd=4)
    lines(years, x, lty = 1, col = "gray20", lwd = 2)
    lines(years, y, lty = 2, col = "gray30", lwd = 2)
    lines(years, z, lty = 1, col = "gray40", lwd = 1)
    points(years, z, col = "gray40", bg="gray40", pch = 24)
      text(2025, x[length(x)], pos = 4, "EC", cex = 0.75, srt = 0, col="gray20", font=4)
      text(2025, y[length(y)], pos = 4, "House", cex = 0.75, srt = 0, col="gray20", font=4)
      text(2025, z[length(z)], pos = 4, "Senate", cex = 0.75, srt = 0, col="gray20", font=4)
    }

  minpop.plot <- function(x, y, z, dep.var, main="", xaxis=T, mar=c(2, 4, 0, 0)) {
      max.y <- (max(c(x, y, z))) * 1.15
      min.y <- (min(c(x, y, z))) * 1.15
        par(mar = mar)
    new.mal.plot <- plot(
      x.axis, seq(1:length(x.axis)), 
      type = "n", 
      ylab = "", 
      xlab = "", 
      yaxt = "n", 
      xaxt = "n", 
      bty = "n", 
      sub = "", 
      cex.sub = .5, 
      ylim = c(.4,1), 
      cex.lab = 0.85, 
      cex.axis = 0.65)
    mtext(side = 2, line = 3, dep.var, cex = 1, font=4) 
         axis(side = 2, las = 2, at=seq(0.4, 1,0.15), labels=c("60%","45%","30%","15%","0%"), lwd=0.65, cex.axis = 0.85, font=4)
        if (xaxis==T){
          axis(side = 1, las = 1, at = seq(1790, 2010, 20), cex.axis = 0.65, font=4) 
          mtext(side = 3, line = 1, main, cex = 1, font=4) } 
          else {
              mtext(side = 3, line = 1, main, cex = 1, font=4) 
            }
             grid(NA, NULL, lwd = .5, col="gray40") 
             abline(h=0.5, lwd=4)
    lines(years, x, lty = 1, col = "gray20", lwd = 1)
    lines(years, y, lty = 2, col = "gray30", lwd = 2)
    lines(years, z, lty = 1, col = "gray40", lwd = 1)
    points(years, z, col = "gray40", bg="gray40", pch = 24)
      text(2025, x[length(x)], pos = 4, "EC", cex = 0.75, srt = 0, col="gray20", font=4)
      text(2025, y[length(y)], pos = 4, "House", cex = 0.75, srt = 0, col="gray20", font=4)
      text(2025, z[length(z)], pos = 4, "Senate", cex = 0.75, srt = 0, col="gray20", font=4)
    }

per.change.plot <- function(t,u,v,w,x, dep.var, main="", xaxis=F, mar=c(2, 4, 0, 4), x.axis=NULL) {
      max.y <- max(c(t,u,v,w,x)) * 1.15
      min.y <- (min(c(t,u,v,w,x))) * 1.15
        par(mar = mar)
      plot(x.axis, seq(1:length(x.axis)), type = "n", ylab = "", xlab = "", yaxt = "n", xaxt = "n", bty = "n", sub = "", cex.sub = .5, ylim = c(-100, 100), cex.lab = .85, cex.axis = 0.65) 
      mtext(side = 2, line = 4, dep.var, cex = 1, font=4) 
          if (xaxis==T){
            axis(side = 1, las = 1, at = seq(1790, 2010, 20), cex.axis = 0.65, font=4)
              mtext(side = 3, line = 1, main, cex = 1, font=4)
          } else {
                mtext(side = 3, line = 1, main, cex = 1, font=4)
          }
              grid(NA, NULL, lwd = .5, col="gray40") 
              abline(h=0, lwd=2)
              # abline(h=0, lwd=4)
        axis(side = 2, line=1, las = 2, at=seq(-100,100,40), labels=c("-100%", "-60%", "-20%", "20%", "60%", "100%"), cex.axis = 0.75, font=4)
    
      lines(years, t, lty = 3, col = "gray50", lwd = 3)
      lines(years, u, lty = 1, col = "gray20", lwd = 1)
      lines(years, v, lty = 2, col = "gray30", lwd = 2)
      lines(years, w, lty = 3, col = "gray30", lwd = 2)
      lines(years, x, lty = 2, col = "gray20", lwd = 1)
    }

per.change2.plot <- function(y,z, dep.var, main="", xaxis=T, mar=c(2, 4, 0, 4), x.axis=NULL) {
      max.y <- max(c(y,z)) * 1.15
      min.y <- min(c(y,z)) * 1.15
        par(mar = mar)
        plot(x.axis, seq(1:length(x.axis)), type = "n", ylab = "", xlab = "", yaxt = "n", xaxt = "n", bty = "n", sub = "", cex.sub = 0.5, ylim = c(-100,1500), cex.lab = .85, cex.axis = 0.65)
        mtext(side = 2, line = 3, "", cex = 1, font=4) 
        grid(NA, NULL, lwd = .5, col="gray40") 
        abline(h=0, lwd=2)
        lines(years, y, lty = 1, col = "gray40", lwd = 2)
        lines(years, z, lty = 2, col = "gray40", lwd = 2)
        axis(side = 2, line=1, las = 2, lwd=0.65, at=c(0,500,1000,1500), labels=c("0%", "500%", "1,000%", "1,500%"), cex.axis = 0.75, font=4)
            if (xaxis==T){
          axis(side = 1, las = 1, at = seq(1790, 2010, 20), cex.axis = 0.65, font=4)
        } 
        }


# mycolours <- brewer.pal(8, "Greys")
# mybreaks <- c(-0.01, .20, .40, .50, .60, .80, 1.00)

plot_dims <- function(plots=1, nrow=1, path="", RESO=400, PS=14, WIDTHS=8, HEIGHTS=3.5, OMA=c(2,2,2,2)) {
  LO <- matrix(1:plots, nrow=nrow, byrow=T)
  W <- rep(WIDTHS, dim(LO)[2])
  H <- rep(HEIGHTS, dim(LO)[1])
  HEIGHT <- sum(H) + OMA[1]*PS*1/72 + OMA[3]*PS*1/72
  WIDTH <- sum(W) + OMA[2]*PS*1/72 + OMA[4]*PS*1/72
  OMA <- OMA
  RESO <- RESO
  PS <- PS
  svglite(path, width=WIDTH, height=HEIGHT, pointsize=PS)
  par(oma=OMA, ps=PS, bg=NA, mar=c(5, 6, 6, 2) + 0.1)
      layout(LO, heights=H, widths=W)
}

      # plot_dims(plots=4,nrow=2,path="/Users/cervas/Google Drive/Projects/Malapportionment/Figures/fig1.svg",RESO=400,PS=14,WIDTHS=8,HEIGHTS=3.5,OMA=c(2,2,2,0))
        
svg("Figures/fig1ab.svg", width=10, height=10, pointsize=14)
  par(mfrow=c(2,1), oma=c(2,2,2,0), ps=14, bg=NA, mar=c(5, 6, 6, 2) + 0.1)
        mal.plot(m.ec$TPD, m.house$TPD, m.sen$TPD, "Total Population Deviation", mar=c(2, 4, 1, 2), main="(A)", xaxis=F)
          axis(side = 2, las = 2, lwd = 0.65, cex.axis = 0.85, font=4)
          box(lty = 1, col = 'black')
        mal.plot(m.ec$VER, m.house$VER, m.sen$VER, "Voter Equivalancy Ratio", mar=c(2, 4, 1, 2),main="(B)", xaxis=T)
          axis(side = 2, las = 2, lwd=0.65, cex.axis = 0.85, font=4)
          box(lty = 1, col = 'black')
dev.off()

# plot_dims(plots=4,nrow=2,path="/Users/cervas/Google Drive/Projects/Malapportionment/Figures/fig1b.svg",RESO=400,PS=14,WIDTHS=8,HEIGHTS=3.5,OMA=c(2,2,2,0))
svg("Figures/fig1cd.svg", width=10, height=10, pointsize=14)
  par(mfrow=c(2,1), oma=c(2,2,2,0), ps=14, bg=NA, mar=c(5, 6, 6, 2) + 0.1)
        minpop.plot(1-m.ec$Minimum_Winning_Population, 1-m.house$Minimum_Winning_Population, 1-m.sen$Minimum_Winning_Population, "Minimum % of Population to Win", mar=c(2, 4, 1, 2), main="(C)", xaxis=F)
          box(lty = 1, col = 'black')
        mal.plot(m.ec$Loosemore_Hanbly, m.house$Loosemore_Hanbly, m.sen$Loosemore_Hanbly, "Loosemore–Hanby", mar=c(2, 4, 1, 2), main="(D)", xaxis=T)
          axis(side = 2, las = 2, lwd = 0.65, cex.axis = 0.85, font=4)
          box(lty = 1, col = 'black')
dev.off()

svg("Figures/fig1ef.svg", width=10, height=10, pointsize=14)
  par(mfrow=c(2,1), oma=c(2,2,2,0), ps=14, bg=NA, mar=c(5, 6, 6, 2) + 0.1)
        mal.plot(m.ec$Gallagher, m.house$Gallagher, m.sen$Gallagher, "Gallagher", mar=c(2, 4, 1, 2), main="(E)", xaxis=F)
          axis(side = 2, las = 2, lwd = 0.65, cex.axis = 0.85, font=4)
          box(lty = 1, col = 'black')
        mal.plot(m.ec$Percentile, m.house$Percentile, m.sen$Percentile, "Percentile Ratio (80/20)", mar=c(2, 4, 1, 2), main="(F)", xaxis=T)
          axis(side = 2, las = 2, lwd = 0.65, cex.axis = 0.85, font=4)
          box(lty = 1, col = 'black')
dev.off()

svg("Figures/fig1g.svg", width=10, height=10, pointsize=14)
  par(mfrow=c(2,1), oma=c(2,2,2,0), ps=14, bg=NA, mar=c(5, 6, 6, 2) + 0.1)     
        mal.plot(m.ec$Gini, m.house$Gini, m.sen$Gini, "Gini Coefficient", mar=c(2, 4, 1, 2), main="(G)", xaxis=T)
          axis(side = 2, las = 2, lwd=0.65, cex.axis = 0.85, font=4)
          box(lty = 1, col = 'black')
dev.off()


  RESO=400 ;PS=14; WIDTHS=8.5 ; OMA=c(2,2,2,2)
  LO <- matrix(1:2, nrow=2, byrow=T)
  W <- rep(WIDTHS, dim(LO)[2])
  H <- c(4,2)
  HEIGHT <- sum(H) + OMA[1]*PS*1/72 + OMA[3]*PS*1/72
  WIDTH <- sum(W) + OMA[2]*PS*1/72 + OMA[4]*PS*1/72
    x.axis <- c(years, years[length(years)]+10, years[length(years)]+20, years[length(years)]+30, years[length(years)]+40)
  
svg("Figures/fig_changeHouse.svg", width=WIDTH, height=HEIGHT, pointsize=PS)
  par(oma=OMA, ps=PS, bg=NA)
      layout(LO, heights=H, widths=W)
 per.change.plot(per_mech.house["Percentile",], per_mech.house["Loosemore_Hanbly",], per_mech.house["Gallagher",], per_mech.house["Gini",], -1*per_mech.house["Minimum_Winning_Population",], dep.var="U.S. House", main="", xaxis=F, mar=c(0, 4, 0, 0), x.axis=x.axis)
    box(lty = 1, col = 'black')
      text(2011, -5, pos = 4, "Percentile (80/20)", cex = 0.65, srt = 0, col="gray20", font=4)
      text(2011, -75, pos = 4, "Loosemore–Hanby", cex = 0.65, srt = 0, col="gray20", font=4)
      text(2011, -85, pos = 4, "Gallagher", cex = 0.65, srt = 0, col="gray20", font=4)     
      text(2011, -65, pos = 4, "Gini Coefficient", cex = 0.65, srt = 0, col="gray20", font=4)
      text(2011, 5, pos = 4, "Minimum Population", cex = 0.65, srt = 0, col="gray20", font=4)
  per.change2.plot(per_mech.house["VER",], per_mech.house["TPD",], x.axis=x.axis, mar=c(2, 4, 1, 0), main="")
      text(2011, 100, pos = 4, "VER", cex = 0.65, srt = 0, col="gray20", font=4)
      text(2011, 300, pos = 4, "TPD", cex = 0.65, srt = 0, col="gray20", font=4)
    box(lty = 1, col = 'black')
dev.off()

svg("Figures/fig_changeEC.svg", width=WIDTH, height=HEIGHT, pointsize=PS)
  par(oma=OMA, ps=PS, bg=NA)
      layout(LO, heights=H, widths=W)
 per.change.plot(per_mech.ec["Percentile",], per_mech.ec["Loosemore_Hanbly",], per_mech.ec["Gallagher",], per_mech.ec["Gini",], -1*per_mech.ec["Minimum_Winning_Population",], dep.var="Electoral College", main="", xaxis=F, mar=c(0, 4, 0, 0), x.axis=x.axis)
    box(lty = 1, col = 'black')
      text(2011, -5, pos = 4, "Percentile (80/20)", cex = 0.65, srt = 0, col="gray20", font=4)
      text(2011, -30, pos = 4, "Loosemore–Hanby", cex = 0.65, srt = 0, col="gray20", font=4)
      text(2011, -66, pos = 4, "Gallagher", cex = 0.65, srt = 0, col="gray20", font=4)     
      text(2011, -25, pos = 4, "Gini Coefficient", cex = 0.65, srt = 0, col="gray20", font=4)
      text(2011, 5, pos = 4, "Minimum Population", cex = 0.65, srt = 0, col="gray20", font=4)
  per.change2.plot(per_mech.ec["VER",], per_mech.ec["TPD",], x.axis=x.axis, mar=c(2, 4, 1, 0), main="")
      text(2011, 300, pos = 4, "VER", cex = 0.65, srt = 0, col="gray20", font=4)
      text(2011, 100, pos = 4, "TPD", cex = 0.65, srt = 0, col="gray20", font=4)
    box(lty = 1, col = 'black')
dev.off()

svg("Figures/fig_changeSen.svg", width=WIDTH, height=HEIGHT, pointsize=PS)
  par(oma=OMA, ps=PS, bg=NA)
      layout(LO, heights=H, widths=W)
 per.change.plot(per_mech.sen["Percentile",], per_mech.sen["Loosemore_Hanbly",], per_mech.sen["Gallagher",], per_mech.sen["Gini",], -1*per_mech.sen["Minimum_Winning_Population",], dep.var="U.S. Senate", main="", xaxis=F, mar=c(0, 4, 0, 0), x.axis=x.axis)
      text(2011, 60, pos = 4, "Percentile (80/20)", cex = 0.65, srt = 0, col="gray20", font=4)
      text(2011, 25, pos = 4, "Loosemore–Hanby", cex = 0.65, srt = 0, col="gray20", font=4)
      text(2011, -15, pos = 4, "Gallagher", cex = 0.65, srt = 0, col="gray20", font=4)     
      text(2011, 30, pos = 4, "Gini Coefficient", cex = 0.65, srt = 0, col="gray20", font=4)
      text(2011, 35, pos = 4, "Minimum Population", cex = 0.65, srt = 0, col="gray20", font=4)
    box(lty = 1, col = 'black')
  per.change2.plot(per_mech.sen["VER",], per_mech.sen["TPD",], x.axis=x.axis, mar=c(2, 4, 1, 0), main="")
      text(2011, 500, pos = 4, "VER", cex = 0.65, srt = 0, col="gray20", font=4)
      text(2011, 100, pos = 4, "TPD", cex = 0.65, srt = 0, col="gray20", font=4)
    box(lty = 1, col = 'black')
dev.off()

# ########################################################################################################################
# ### - Figure 4:  Illustrative Lorenz Curves for 1810, 1850, 1890, 1930, 1970, and 2010 - ###
# ########################################################################################################################
# matrixlist <- as.character(c(1810, 1850, 1890, 1930, 1970, 2010)) #Years to have in Graph

# pdf("/Users/cervas/Google Drive/Projects/Malapportionment/Figures/lorenz.pdf", width = 6, height = 7)
#  par(mfrow = c(3, 2), oma = c(3, 3, 0, 0), mar = c(1, 1, 0, 0), mgp = c(2, 1, 0))

#  par(mar = c(1, 1, 1, 1)+0.1)
#    returns <- runif(100)
# plot(lorenz[, matrixlist[1]], lorenz2[, matrixlist[1]], xlab = "", ylab = "", yaxt = "n", xaxt = "n", bty = "n", cex.sub = .5, ylim = c(0, 1), xlim = c(0, 1), cex.lab = .85, cex.axis = 0.65, xaxs = "i", yaxs = "i", col = "gray30", main = paste("Apportionment Year: ", matrixlist[1]), cex.main = 0.65)
#        axis(side = 2, las = 2, at = pretty(returns), lab = paste0(pretty(returns)*100, "%"), cex.axis = 0.65)
#        grid(NULL, NULL, lwd = .5, lty = 3, col = "gray80")
# abline(0, 1, col = "black", lty = 3)
# lines(lorenz[, matrixlist[1]], lorenz2[, matrixlist[1]], col = "gray30", lty = 1)
# mtext(side = 2, line = 2.5, "State Share of Electoral College", cex = 0.65)

#  par(mar = c(1, 1, 1, 1)+0.1)
#    returns <- runif(100)
# plot(lorenz[, matrixlist[2]], lorenz2[, matrixlist[2]], xlab = "", ylab = "", yaxt = "n", xaxt = "n", bty = "n", cex.sub = .5, ylim = c(0, 1), xlim = c(0, 1), cex.lab = .85, cex.axis = 0.65, xaxs = "i", yaxs = "i", col = "gray30", main = paste("Apportionment Year: ", matrixlist[2]), cex.main = 0.65)
#        grid(NULL, NULL, lwd = .5, lty = 3, col = "gray80")
# abline(0, 1, col = "black", lty = 3)
# lines(lorenz[, matrixlist[2]], lorenz2[, matrixlist[2]], col = "gray30", lty = 1)

#  par(mar = c(1, 1, 1, 1)+0.1)
# returns <- runif(100)
# plot(lorenz[, matrixlist[3]], lorenz2[, matrixlist[3]], xlab = "", ylab = "", yaxt = "n", xaxt = "n", bty = "n", cex.sub = .5, ylim = c(0, 1), xlim = c(0, 1), cex.lab = .85, cex.axis = 0.65, xaxs = "i", yaxs = "i", col = "gray30", main = paste("Apportionment Year: ", matrixlist[3]), cex.main = 0.65)
#        axis(side = 2, las = 2, at = pretty(returns), lab = paste0(pretty(returns)*100, "%"), cex.axis = 0.65)
#        grid(NULL, NULL, lwd = .5, lty = 3, col = "gray80")
# abline(0, 1, col = "black", lty = 3)
# lines(lorenz[, matrixlist[3]], lorenz2[, matrixlist[3]], col = "gray30", lty = 1)
# mtext(side = 2, line = 2.5, "State Share of Electoral College", cex = 0.65)

#  par(mar = c(1, 1, 1, 1)+0.1)
#  returns <- runif(100)
# plot(lorenz[, matrixlist[4]], lorenz2[, matrixlist[4]], xlab = "", ylab = "", yaxt = "n", xaxt = "n", bty = "n", cex.sub = .5, ylim = c(0, 1), xlim = c(0, 1), cex.lab = .85, cex.axis = 0.65, xaxs = "i", yaxs = "i", col = "gray30", main = paste("Apportionment Year: ", matrixlist[4]), cex.main = 0.65)
#        grid(NULL, NULL, lwd = .5, lty = 3, col = "gray80")
# abline(0, 1, col = "black", lty = 3)
# lines(lorenz[, matrixlist[4]], lorenz2[, matrixlist[4]], col = "gray30", lty = 1)

#  par(mar = c(1, 1, 1, 1)+0.1)
# returns <- runif(100)
# plot(lorenz[, matrixlist[5]], lorenz2[, matrixlist[5]], xlab = "", ylab = "", yaxt = "n", xaxt = "n", bty = "n", cex.sub = .5, ylim = c(0, 1), xlim = c(0, 1), cex.lab = .85, cex.axis = 0.65, xaxs = "i", yaxs = "i", col = "gray30", main = paste("Apportionment Year: ", matrixlist[5]), cex.main = 0.65)
#        axis(side = 2, las = 2, at = pretty(returns), lab = paste0(pretty(returns)*100, "%"), cex.axis = 0.65)
#        axis(side = 1, las = 1, at = pretty(returns), lab = paste0(pretty(returns)*100, "%"), cex.axis = 0.65)
#        grid(NULL, NULL, lwd = .5, lty = 3, col = "gray80")
# abline(0, 1, col = "black", lty = 3)
# lines(lorenz[, matrixlist[5]], lorenz2[, matrixlist[5]], col = "gray30", lty = 1)
# mtext(side = 2, line = 2.5, "State Share of Electoral College", cex = 0.65)
# mtext(side = 1, line = 2.5, "State Share of Population", cex = 0.65)

#  par(mar = c(1, 1, 1, 1)+0.1)
# returns <- runif(100)
# plot(lorenz[, matrixlist[6]], lorenz2[, matrixlist[6]], xlab = "", , ylab = "", yaxt = "n", xaxt = "n", bty = "n", cex.sub = .5, ylim = c(0, 1), xlim = c(0, 1), cex.lab = .85, cex.axis = 0.65, xaxs = "i", yaxs = "i", col = "gray30", main = paste("Apportionment Year: ", matrixlist[6]), cex.main = 0.65)
#        axis(side = 1, las = 1, at = pretty(returns), lab = paste0(pretty(returns)*100, "%"), cex.axis = 0.65)
#        grid(NULL, NULL, lwd = .5, lty = 3, col = "gray80")
# abline(0, 1, col = "black", lty = 3)
# lines(lorenz[, matrixlist[6]], lorenz2[, matrixlist[6]], col = "gray30", lty = 1)
# mtext(side = 1, line = 2.5, "State Share of Population", cex = 0.65)

# dev.off()




##########################################################################################################
########### - Figure 6: 95% Confidence Limits for Partisan Bias in the Electoral College - ###############
##########################################################################################################
# pdf("/Users/cervas/Google Drive/Projects/Malapportionment/Figures/seats_w_bias_points_error.pdf", width = 7, height = 4.5)
# par(mar = c(3, 3, 0, 0))
# plot(sv[, "year"], sv[, "bias_mean"], ylim = c(35, 70), xlim = c(1868, 2016), type = "p", yaxt = "n", xaxt = "n", xlab = "", ylab = "", bty = "n", pch = ifelse(sv[, "bias_low"]>50, ifelse(sv[, "bias_high"]<50, 1, 19), 1))
# axis(side = 2, las = 2, labels = c("35%", "40%", "45%", "50%", "55%", "60%", "65%"), at = c(35, 40, 45, 50, 55, 60, 65), cex.axis = 0.65)
# axis(side = 1, at = seq(1872, 2016, 16), cex.axis = 0.65)
# mtext(side = 2, line = 2.25, "Expected Democratic Seats at 50% Vote", cex = 0.65)
# arrows(sv[, "year"], sv[, "bias_low"], sv[, "year"], sv[, "bias_high"],  angle = 90, length = 0.05, code = 0, lty = 1, col = "gray30", lwd = 1)
# points(sv[, "year"], sv[, "bias_mean"], pch = ifelse(sv[, "bias_low"]>50, ifelse(sv[, "bias_high"]<50, 1, 19), 1))
# points(sv[, "year"], sv[, "bias_mean"], pch = ifelse(sv[, "bias_low"]<50, ifelse(sv[, "bias_high"]>50, 1, 19), 1))
# text(1863, 55, "Pro-Democratic", cex = 0.5, srt = 90, pos = 1, col = "gray70")
# text(1863, 47, "Pro-Republican", cex = 0.5, srt = 90, pos = 1, col = "gray70")

# abline(h = 50.05, lwd = 2, lty = 2, col = "gray80")
# abline(h = 50, lwd = 2, lty = 2, col = "gray20")
# legend("topright", legend = c("Statistically Significant", "Not Significant"), pch = c(19, 1), box.col = "white", cex = 1)
# dev.off()
