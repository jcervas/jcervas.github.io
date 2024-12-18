##########################################################################################################
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ──╔╦═══╦═╗─╔╦═══╦════╦╗─╔╦═══╦═╗─╔╗
# ──║║╔═╗║║╚╗║║╔═╗║╔╗╔╗║║─║║╔═╗║║╚╗║║
# ──║║║─║║╔╗╚╝║║─║╠╝║║╚╣╚═╝║║─║║╔╗╚╝║
# ╔╗║║║─║║║╚╗║║╚═╝║─║║─║╔═╗║╚═╝║║╚╗║║
# ║╚╝║╚═╝║║─║║║╔═╗║─║║─║║─║║╔═╗║║─║║║
# ╚══╩═══╩╝─╚═╩╝─╚╝─╚╝─╚╝─╚╩╝─╚╩╝─╚═╝
#         ╔═══╦═══╦═══╦╗──╔╦═══╦═══╗
#         ║╔═╗║╔══╣╔═╗║╚╗╔╝║╔═╗║╔═╗║
#         ║║─╚╣╚══╣╚═╝╠╗║║╔╣║─║║╚══╗
#         ║║─╔╣╔══╣╔╗╔╝║╚╝║║╚═╝╠══╗║
#         ║╚═╝║╚══╣║║╚╗╚╗╔╝║╔═╗║╚═╝║
#         ╚═══╩═══╩╝╚═╝─╚╝─╚╝─╚╩═══╝
### Code to Replicate "Tools for Identifying Partisan Gerrymandering"
# 🅙🅞🅝🅐🅣🅗🅐🅝 🅡. 🅒🅔🅡🅥🅐🅢, University of California Irvine
# 🅑🅔🅡🅝🅐🅡🅓 🅖🅡🅞🅕🅜🅐🅝, University of California Irvine
### Note: 
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
##########################################################################################################
    rm(list=ls(all=TRUE))   # Remove all objects just to be safe.
    options(scipen=999)     # Turn off Scientific Notation
    options(stringsAsFactors = FALSE)
    doInstall <- F # Change to FALSE if you don't want packages installed.
setwd("/Volumes/GoogleDrive/My Drive/Papers/Tools for Identifying a Partisan Gerrymander/PA_LWV/R")  # Main directory
source("R/license.R")
seed <- 66
set.seed(seed)
              
  projection <- "+proj=lcc +lat_1=40.96666666666667 +lat_2=39.93333333333333 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs"
# https://spatialreference.org/ref/epsg/nad83-pennsylvania-south-ftus/
  projection <- "+init=epsg:4269"
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  plan_names <- 
    c(
      "2011 Enacted",
      "2018 Court Remedial",
      "Joint Legislative",
      "Gov. Wolf")
	plans <- 
		c("enacted2011",
        "court", 
        "joint", 
        "govwolf")
# •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
# =================================================================
# -- FUNCTIONS -- -- FUNCTIONS -- -- FUNCTIONS -- -- FUNCTIONS  -- 
# =================================================================
    source("https://raw.githubusercontent.com/jcervas/PA_LWV/master/R/R/GERRYfunctions.R")
    source("https://raw.githubusercontent.com/jcervas/PA_LWV/master/R/R/___seatsvotes.R")
# =================================================================
# -- DATA -- -- DATA -- -- DATA -- -- DATA  -- -- DATA  -- -- DATA 
# =================================================================
    source("R/PA_Congressional_Data.R")
    pa.redist.dta <- read.csv("data/pa_redist_shp.csv")
    source("R/DataSetup.R") 
# ================================================================= #
# -- TOOLS FOR IDENTIFYING PARTISAN  GERRYMANDERING -- ANALYSIS -- -#
# ================================================================= #        
    source("R/Simulations.R")
    source("R/GIS.R")
    source("R/Tables.R")
    source("R/Plots.R")










