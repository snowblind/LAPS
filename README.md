# LAPS

___

Web based app (nodejs) for showing lap data coming from [RC HourGlass](https://github.com/mv4wd/RCHourglass "RC HourGlass github project page") DIY lap timing system hardware.

I would like to thank Marco Venturini - mv4wd for the use of RC HourGlass logo - see licensing terms below

[Screenshots and help here](./image/SHOW.md)

## Making it work

___

### Windows PC install:

Get [NodeJS](https://nodejs.org/en/)

* Get 12.xx.x LTS version

* Install NodeJS

Download my git repository

* use download button or git clone it

* run `npm install` in the dir the package.json file ends up in. Run this when you update also I may have added a new module to the project.

* run `node laps.js --serialport your com port`  example: `node laps.js --serialport com5`

### Raspberry PI Install

* `wget https://github.com/snowblind/LAPS/archive/master.zip`
* `unzip master.zip`
* `cd LAPS-master`
* `npm install`
* `node laps --serialport /dev/ttyACM1`

#### find serial port
  
```shell
root@RPI3-MAIN:~/RCLAPS # lsusb
Bus 001 Device 005: ID 04b4:0008 Cypress Semiconductor Corp.

root@RPI3-MAIN:~/RCLAPS # ll /dev/serial/by-id

lrwxrwxrwx 1 root root 13 May  4 20:21 usb-MV_Lap_timing_USB_Lap_Timing -> ../../ttyACM1
```

* full setup coming soon

### Errors

If you get a `Error: listen EADDRINUSE :::80` when trying to start node laps.js it means you already have a web server using port 80. Will make this a command line option to set different port at some point. Note port 80 is the default port for web servers.  

## Config Options

___

[transponders.json:](./transponders.json)

* by default it is filled with all transponder IDs included with the RC HourGlass project

* edit the name field to have a name show up and not just the ID

* I may add a way to edit this in the web app

* This is not required for laps to work

## Project status

___

Right now this is a "personal" type lap software. You can not see everybody elses laps times at the same you you are looking at yours. I dunno if it will ever be a full race type program.

It may look ugly to you and I don't care. It works for what I want. The css, html files are changeable.  

I removed the limit of one connection per transponder page.

At some point I will add info on setting up Raspberry PI to run this.

I use icons from: here

## Licensing terms

___

* LAPS:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANYKIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE." Michael Pounders - snowblind

* RC HourGlass:

Short version: if you build it for your personal use, you're only kindly requested to donate a small sum to a children
charity of your choice (use 'RC Hourglass for children' as a reference).

Please feedback your donations to:charity dot rchourglass at gmail.com

Please consider donating 5 euros per transponder and 30 euros for the decoder for personal use.
If the transponder is used in a club/circuit with an admission fee, please consider donating 100 euros for the decoder.

The original RCTech thread author/designer (Howard Cano) license applies to the decoder project:

*"All information presented on this thread is free for use for personal, non-commercial purposes.
Contact me for licensing arrangements if you wish to produce and market the decoder."* -user howardcano on rctech

Additional licensing terms for the PSOC firmware/design & transponder by mv4wd:

"All information shared is free for use for personal, non-commercial purposes.
Contact me for licensing arrangements if you wish to produce and market the decoder.

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

Any derivative work source code/design must be public and use this licensing terms.

Any device derived from this project must respond to the command 'License' with this text.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANYKIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE." Marco Venturini - mv4wd
