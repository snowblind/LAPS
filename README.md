# LAPS

Web based app (nodejs) for showing lap data coming from [RC HourGlass](https://github.com/mv4wd/RCHourglass "RC HourGlass github project page") DIY lap timing system hardware.

I would like to thank Marco Venturini - mv4wd for the use of RC HourGlass logo - see licensing terms below

## Making it work

```javascript
const port = new SerialPort("com5", { baudRate: 115200 })
```

Right now you need to edit line 4 (looks like the above line) in [laps.js](./laps.js) to change serial port used

[transponders.json:](./transponders.json)

* by default it is filled with all transponder IDs included with the RC hourGlass project

* edit the name fleild to have a name show up and not just the ID

* This is not required for laps to work

## Project status

Right now this a personal (one viewer per detected transponder page) lap software. I dunno if it will ever be a full race type program.

I am working on a new layout for this, but I am not web page designer. It may look ugly to you and I don't care. It works for what I want. I am planing on refactoring the code to make the web page be a static file and be updated with web-sockets. Meaning the web page will not be split up like it is now some html from a file and some html in nodejs code to finsh the html page. I will put all html in a file and have JS client side code change the the DOM of the document with the help of web-sockets.
This would allow someone with better web skills to change the look of the page with the html and css files

Currently this only allows on connection to each personal transponder page.. Any new connection from another device takes over the connection. This may change or a may make like a watch all web page with filters so spectators can watch what is going on.

At some point I will add info on setting up Raspberry PI to run this.

I use icons from: here

## Licensing terms

* LAPS:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANYKIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OROTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OROTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE." Michael Pounders - snowblind

* RC HourGlass:

Short version: if you build it for your personal use, you're only kindly requested to donate a small sum to a children
charity of your choice (use 'RC Hourglass for children' as a reference).

Please feedback your donations to:charity dot rchourglass at gmail.com

Please consider donating 5 euros per transponder and 30 euros for the decoder for personal use.
If the transponder is used in a club/circuit with an admission fee, please consider dontaing 100 euros for the decoder.

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

IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OROTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OROTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE." Marco Venturini - mv4wd
