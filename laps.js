const sprintf = require('sprintf-js').sprintf
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort("com5", { baudRate: 115200 })

const parser = new Readline()
port.pipe(parser)

const express = require('express')
const app = express()
var expressWs = require('express-ws')(app);
const www_port = 80

const fs = require('fs');
//let html = [];                                                                                       //TODO:MJP lets use a cache when finshed with html code
//html[0] = fs.readFileSync( __dirname + '/web/html/top.html');
//html[1] = fs.readFileSync( __dirname + '/web/html/bottom.html');

var tlist = require( "./transponders.json");                                                           //TODO:MJP Add a way to edit this from a web page maybe

var found_transids = [];

//setup transponder id with info for testing
 
found_transids[7531106] = { 
  tid: 7531106,
  lapcount: 3,
  lastlap: 109615405,
  firstseen: 109591806,
  fastlap: 5035,
  name: 'JoeP',
  laps: { lap1: '00:07.748', lap2: '00:10.816', lap3: '00:05.035' } }



var appData ={
  flap: 0,
  flapid: 0,
  tottransfound: 0,
  fastlap: 0, //TODO:MJP This is fastest lap for all transponders seen. Need transponder id ? need name also put in new object inside this one

              //TODO:MJP list of found transponders?
};

var myData = { 
  tid: 0,
  lapcount: 0,
  lastlap:  0,
  firstseen: 0,
  fastlap: 0, 
  name: '',   
  wsid: null,
  laps: {}
    
  }; 




app.use('/web', express.static('web'));
app.use('/scripts', express.static('web/scripts'));
app.use('/icons', express.static( 'web/icons'));


  app.ws('/', function(ws, req) {
   
      
        ws.on('close' , function() {
          //console.log("WS: connection closed" );
        });

  });
  
  app.ws("/*", function(ws, req) {

    var tid = parseInt( req.path.substr(1, 7) )    //TODO:MJP not really robust
  
    //console.log( "WS:// " + tid )

    ws.on('message', function(msg) {
      console.log("WS://"+ tid + ": " + msg);
      
      
              if ( msg[0] == '{' ){                       //TODO:MJP is there a check for a vaild json string? before parseing to JSON.parse
                myJson = JSON.parse(msg);
                //console.log( myJson );

                  switch(myJson.command){
                    case 22:
                      clearUserData( myJson.tid );
                    break;
                  }

              }
              return
    });
    found_transids[tid].wsid = ws
  });


app.get('/', (req, res) =>{     // HTML ROOT
  let body = ''
  let cache = [];                                                         //TODO:MJP Remove this when finshed and use cached version when hmtl code is done
  cache[0] = fs.readFileSync( __dirname + '/web/html/top_root.html');     //TODO:MJP rename to root.html 
                                                                          //TODO:MJP I plan on refactoring the code to move the html below back into root.html
          body+= "<div><header><h1>Found Transponders</h1></header><p></p><p></p>"                                   //List transponders
            found_transids.forEach(function(item){
                body += sprintf( "<li><a href=\"%s\" ref=>%s</a></li>",  item.tid, "Transponder: " + item.name + ':' + item.tid )
                console.log( item.tid )
            })
          body += "</div>"

          body +=  "<div><header><h1>Current stats</h1></header><p>Not working yet</p></div>"   //Show stats
      
      var html =  cache[0] + body + "</div></body></html>"
      res.send(html)
})

app.get('*', (req, res) =>{    // Handle transponder ids

  var tid = parseInt( req.path.substr(1, 7) )
  var ftid = found_transids[tid]
  var body = ''
  let cache = [];
  var fastlap                                                                                           //TODO:MJP Remove this when finshed and use cached version when hmtl code is done
  cache[1] = fs.readFileSync( __dirname + '/web/html/top_transponder.html');                            //TODO:MJP rename to transponder.html
                                                                                                        //TODO:MJP I plan on refactoring the code to move the html below back into transponder.html 
  if( ! found_transids[tid] )
  {
    res.send('transponder ID not seen yet')
      return
  }
  
          body+= "<div><header><h1>" + ftid.name + ":" + tid  + "<input type=\"button\" onclick=\"clearUserData()\" style=\"border: none; height: 24px; width: 24px; background: url('/icons/icons8-cls-24.png' )\"/>" + "</h1></header><p></p><div id=\"lapdata\">"                                    //Show laps data
            for (var key in ftid.laps) {
              body += sprintf( "<li>%s %s</li>", key,  ftid.laps[key] )
            }
            body += "</div></div>"
            fastlap = timeTotxt( ftid.fastlap )
            body +=  "<div><header><h1>Your stats</h1></header><p>Fastest lap: " + fastlap + "</p></div>"       //Show stats

var html =  cache[1] + body + "</div></body></html>"                                                            //Close out html page
res.send(html)


})

app.listen(www_port, () => console.log(`LAPS web app listening on port http://localhost:${www_port}`))


parser.on('data', line => {
    
    
        var transid = parseInt( line.substr(0, 6), 16 );              
        
        if(!transid)                                                                                    //TODO:MJP This checking may need to be more robust
          return;
        
        if( ! found_transids[transid] )                                                                 //Only run when we find a new transponder
        {  
          found_transids[transid]  = Object.assign( {}, myData );
          found_transids[transid].tid = transid;

          var hrtime = process.hrtime();

          found_transids[transid].lastlap = found_transids[transid].firstseen = parseInt(((hrtime[0] * 1e3) + (hrtime[1]) * 1e-6));
                  
            
            found_transids[transid].name = findFname(transid)
            console.log( found_transids[transid] )
            console.log("alloc")
          return
        }
        
        
        var hrtime = process.hrtime();
        var time = parseInt(((hrtime[0] * 1e3) + (hrtime[1]) * 1e-6));

        if(found_transids[transid].firstseen == 0 )
        {
          found_transids[transid].lastlap = found_transids[transid].firstseen = time;
            return        
        }
        
        var curlap = (time - found_transids[transid].lastlap)    

        fastlap( curlap, found_transids[transid] );

            
            
            let clap = sprintf( "lap%i",  ++found_transids[transid].lapcount )  //Make string needed for laps key name and +1 lap count
            found_transids[transid].laps[clap] = timeTotxt( curlap );

        
        found_transids[transid].lastlap = time;

        found_transids[transid].wsid.send( JSON.stringify( found_transids[transid].laps ) )

        //console.log(found_transids.length ); //using transponder number as id makes this array kinda large but I dont care 
        printmyDataObj( found_transids[transid] ); //for debug

  })

  function findFname(tid){
    var t = ''
    tlist.forEach(function(item){

      if( item.id == tid )
          t = item.fname;
 
         
      })
  return t;  
  }

  function fastlap( curlap, user ){

    if( ! user.fastlap )
      user.fastlap = curlap;

    if( curlap < user.fastlap )
        user.fastlap = curlap;

  }

  function timeTotxt( curtime ){

    let ms_count = curtime % 1000;
    let ctime = curtime / 1000;

    let secs_count = ctime % 60;
    let mins_count = ( ctime / 60) % 60;

    let laptxt = sprintf( "%02u:%02u.%03u", mins_count, secs_count, ms_count )
    return laptxt
  }

  function clearUserData( tid ){
    found_transids[tid].lapcount = 0;
    found_transids[tid].laps = {};
    found_transids[tid].lastlap = 0;
    found_transids[tid].firstseen = 0;
    found_transids[tid].fastlap = 0;

    printmyDataObj( found_transids[tid] ) // for debug
  }  

  function printmyDataObj( tid ) // For Debugging made this skip over websocket object
  {
    console.log( "{ \n  tid: " + tid.tid + ',')
    console.log( "  lapcount: " + tid.lapcount + ',')
    console.log( "  lastlap: " + tid.lastlap + ',')
    console.log( "  firstseen: " + tid.firstseen + ',')
    console.log( "  fastlap: " + tid.fastlap + ',')
    console.log( "  name: " + tid.name + ',')


    console.log( "laps: ", tid.laps )
    //console.log( "  : " + tid. + ',')

    console.log( "}")
  }