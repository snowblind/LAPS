const optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'serialport', alias: 'p', type: String, multiple: false, defaultOption: true, defaultValue: [ 'com5' ] },
  { name: 'debug', alias: 'd', type: Boolean, defaultOption: false }
]

const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)

const sprintf = require('sprintf-js').sprintf
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort( options.serialport, { baudRate: 115200 })

const parser = new Readline()
port.pipe(parser)

const express = require('express')
const app = express()
const expressWs = require('express-ws')(app);
const www_port = 80

const fs = require('fs');
//let html = [];                                                                                       //TODO:MJP lets use a cache when finished with html code
//html[0] = fs.readFileSync( __dirname + '/web/html/top.html');
//html[1] = fs.readFileSync( __dirname + '/web/html/bottom.html');

const tlist = require( "./transponders.json");                                                         //TODO:MJP Add a way to edit this from a web page maybe

var found_transids = [];
var rootwss = null;
//let wss = expressWs.getWss().

//setup transponder id with info for testing
if( options.debug )
{ 
  found_transids[7531106] = { 
    tid: 7531106,
    lapcount: 3,
    lastlap: 109615405,
    firstseen: 109591806,
    fastlap: 5035,
    name: 'JoeP',
    laps: { lap1: '00:07.748', lap2: '00:10.816', lap3: '00:05.035' } 
  }
  found_transids[7531106].clients = new Set()
}
 
const rootclients = new Set();

var appData ={
  flap: 0,
  flapid: 0,
  tottransfound: 0,
  fastlap: 0, //TODO:MJP This is fastest lap for all transponders seen. Need transponder id ? need name also put in new object inside this one

              //TODO:MJP list of found transponders?
};

const myData = { 
  tid: 0,
  lapcount: 0,
  lastlap:  0,
  firstseen: 0,
  fastlap: 0, 
  name: '',   
  clients: null,
  laps: null
    
  }; 

app.use('/web', express.static('web'));
app.use('/scripts', express.static('web/scripts'));
app.use('/icons', express.static( 'web/icons'));


  app.ws('/', function(ws, req) {
     
    rootclients.add(ws)
          
        ws.on('close' , function() {
          rootclients.delete(ws)
        });
      
      let body = ''

        found_transids.forEach(function(item){
          if( item.name){
            body += sprintf( "<li><a href=\"%s\" ref=>%s</a></li>",  item.tid, "Transponder: " + item.name + ':' + item.tid )
          }
          else{
            body += sprintf( "<li><a href=\"%s\" ref=>%s</a></li>",  item.tid, "Transponder: " + item.tid )
          }
            console.log( item.tid )
        })
     
  
    ws.send( body )
    

  });

    
  app.ws("/*", function(ws, req) {

    var tid = parseInt( req.path.substr(1, 7) )    //TODO:MJP not really robust
    
    found_transids[tid].clients.add(ws)

    ws.on('close', function(msg) {
      found_transids[tid].clients.delete(ws)
    });

    ws.on('message', function(msg) {
      
      
      
              if ( msg[0] == '{' ){                       //TODO:MJP need TRY CATCH block here
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

    
    let h1data = { command: 44, tid: tid, name: found_transids[tid].name };
    
    //console.dir(h1data, {colors: true, depth: 2 }) //debug
    
    found_transids[tid].clients.forEach(client =>
      {
          client.send( JSON.stringify( h1data ) );
      });
     

  let laps_update = { command: 66, laps: found_transids[tid].laps }
  
  //console.dir(laps_update, {colors: true, depth: 2 }) //debug
    
    found_transids[tid].clients.forEach(client =>
      {
          client.send( JSON.stringify( laps_update ) );
      });
       
  });


app.get('/', (req, res) =>{     // HTML ROOT
  
  let cache = [];                    //TODO:MJP Remove this when finished and use cached version when html code is done  
  cache[0] = fs.readFileSync( __dirname + '/web/html/home.html');   

  res.send( cache[0].toString() )      
      
})

app.get('/About.html', (req, res) =>{     // HTML ABOUT
  
  let cache = [];                    //TODO:MJP Remove this when finished and use cached version when html code is done                                         
  cache[0] = fs.readFileSync( __dirname + '/web/html/About.html');   

  res.send( cache[0].toString() )      
      
})


app.get('*', (req, res) =>{    // HTML Handle transponder ids

  var tid = parseInt( req.path.substr(1, 7) )
  var ftid = found_transids[tid]
  var body = ''
  var fastlap 

  let cache = [];                    //TODO:MJP Remove this when finished and use cached version when html code is done
   cache[1] = fs.readFileSync( __dirname + '/web/html/transponder.html');                          
  
  if( !found_transids[tid] )
  {
      res.send('transponder ID not seen yet')
    return
  }
  
res.send(cache[1].toString())


})

app.listen(www_port, () => console.log(`LAPS web app listening on port http://localhost:${www_port}`))          //Start Web Server


parser.on('data', line => {

  //console.log("parser.on:start \n" + "    " + transid ) //debug

        var transid = parseInt( line.substr(0, 6), 16 );                                               //TODO:MJP This checking may need to be more robust              
        

        if(!transid)                                                                                     
          return;
        

        
        if( !found_transids[transid] )                                                                 //Only run when we find a new transponder
        {  
          found_transids[transid]  = Object.create( myData ); 
          found_transids[transid].laps  = Object.create( Object );                                      //FUCK JS Do not know why what I was doing before would not work
          found_transids[transid].clients = new Set()
          found_transids[transid].tid = transid;

          var hrtime = process.hrtime();

          found_transids[transid].lastlap = found_transids[transid].firstseen = parseInt(((hrtime[0] * 1e3) + (hrtime[1]) * 1e-6));                
            
            found_transids[transid].name = findFname(transid)
            
            
              var body = '';
              found_transids.forEach(function(item){
                if( item.name){
                  body += sprintf( "<li><a href=\"%s\" ref=>%s</a></li>",  item.tid, "Transponder: " + item.name + ':' + item.tid )
                }
                else{
                  body += sprintf( "<li><a href=\"%s\" ref=>%s</a></li>",  item.tid, "Transponder: " + item.tid )
                }
            })

            rootclients.forEach(client =>
              {
                  client.send(body);
              }); 
              
            
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
            
        found_transids[transid].laps[clap] = timeTotxt(curlap); 

        
        found_transids[transid].lastlap = time;
        let laps_update = { command: 66, laps: found_transids[transid].laps }
        if( found_transids[transid].clients ){
            found_transids[transid].clients.forEach(client =>
            {
                client.send( JSON.stringify( laps_update ) );
            });
          }
            

  //console.log("parser.on:end \n" ) //debug
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

    console.dir(found_transids[tid], {colors: true, depth: 1 }) //debug
  }