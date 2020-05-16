# Changelog

## [Unreleased] (00/00/2020)

* add more stats to transponder page like `average lap`, `best lap`, and `worse lap`


## [V0.0.4] (05/15/2020)

### Added

* Command line usage output now with --help
* Changed the html grid layout on devices with screen <768 wide. Looks better on phones. Updated screenshots.
* Lap area now auto scrolls to the bottom to show newest incoming 

### Changes

* Version now comes from package.json. removed VERSION file

### BUGFIX

* There was a problem with the handling of the option being passed to the serialport start up code that would give a `TypeError: First argument must be a string` error with some uses of --serialport and the default option

## [V0.0.3] (05/11/2020)

* Some code clean up
* Added READY GO info to laps area to show what state you are in. First run over the loop detects the transponder, READY waiting again for you to pass over the loop, GO = lap started. Would you like a default list of transponders already detected on load up to skip detection step. Open a github issue.
* Add back in stats shown on transponder page (just fastest lap for now)
* Added command line options --wwwport  example: `node laps.js --wwwport 8080` linux requires root to open port under 1024. No command line --help text atm

## [V0.0.2] (05/04/2020)

* Removed limits on websocket connection that limited the use of transponder pages to one user
* Full updating of all web pages without reloading it yourself. The home page didn't do that last version
* Added command line options --serialport  example: `node laps.js --serialport com5` No command line --help text atm

## [V0.0.1] (04/29/2020)

* first commit
