const commandline = require('./util/handle_commandline')

if( commandline.options.help ){ 
  commandline.printUsage()
  process.exit(0)
}

const sprintf = require('sprintf-js').sprintf
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort( commandline.options.serialport.toString(), { baudRate: 115200 } )
const parser = new Readline()
port.pipe(parser)

const express = require('express')
const app = express()
const expressWs = require('express-ws')(app);
const VERSION = require('./package.json').version

const fs = require('fs');
const home_html_cached = fs.readFileSync( __dirname + '/web/html/home.html').toString();
const about_html_cached = fs.readFileSync( __dirname + '/web/html/About.html').toString();
const transponder_html_cached = fs.readFileSync( __dirname + '/web/html/transponder.html').toString();

var found_transids = [];
var rootclients = new Set();
var tlist = require( "./transponders.json");            //TODO:MJP Add a way to edit this from a web page maybe

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
  clients: null,
  laps: null    
}; 

//setup transponder id with info for testing
if( commandline.options.debug )
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

  found_transids[4572215] = {
  tid: 4572215,
  lapcount: 3,
  lastlap: 2351809139, 
  firstseen: 2351793536, 
  fastlap: 3744,
  name: '', 
  laps: { lap1: '00:03.744', lap2: '00:07.985', lap3: '00:03.874' }
  }
  found_transids[4572215].clients = new Set()
}
app.use('/web', express.static('web'));
app.use('/scripts', express.static('web/scripts'));
app.use('/icons', express.static( 'web/icons'));


app.ws('/', function(ws, req){
  rootclients.add(ws)    
    ws.on('close' , function() {
      rootclients.delete(ws)
    });    
  updateRootWebPage();
});

    
app.ws("/*", function(ws, req){

    var tid = parseInt( req.path.substr(1, 7) )    //TODO:MJP not really robust
    
    found_transids[tid].clients.add(ws)

    ws.on('close', function(msg) {
      found_transids[tid].clients.delete(ws)
    });

    ws.on('message', function(msg) {
      try{                       
            myJson = JSON.parse(msg);
            //console.log( myJson );

            switch(myJson.command){
              case 22:
                clearUserData( myJson.tid );
              break;
            }
            return
          } catch(err) { console.log( err ) }
    });

  updateTransponderWebPage( tid, { command: 44, tid: tid, name: found_transids[tid].name } );

  if( found_transids[tid].firstseen ){
    updateTransponderWebPage( tid, { command: 66, laps: found_transids[tid].laps } );
  }
  else{
    updateTransponderWebPage( tid, { command: 67 } );
  }  
  updateTransponderWebPage( tid, { command: 80, fastlap: timeTotxt(found_transids[tid].fastlap) } );     
});


app.get('/', (req, res) =>{     // HTML ROOT
  res.send( home_html_cached )          
})

app.get('/About.html', (req, res) =>{     // HTML ABOUT   
  res.send( about_html_cached )           
})

app.get('*', (req, res) =>{    // HTML Handle transponder ids

  var tid = parseInt( req.path.substr(1, 7) )
  var ftid = found_transids[tid]
 
  if( !found_transids[tid] ){
    res.send('transponder ID not seen yet')
  return
  }
  
res.send( transponder_html_cached )

})

if( commandline.options.wwwport == 80 ){                                                                                             //Start Web Server
  app.listen( commandline.options.wwwport.toString(), () => console.log( 'LAPS V' + VERSION + ' web app listening at http://yourserveripadress/' ))                       
} 
else{ 
  app.listen( commandline.options.wwwport.toString(), () => console.log( 'LAPS V' + VERSION + ' web app listening at http://yourserveripadress:' + options.wwwport + '/' ))          
}

parser.on('data', line => {

  //console.log("parser.on:start \n" + "    " + transid ) //debug

        var transid = parseInt( line.substr(0, 6), 16 );                                               //TODO:MJP This checking may need to be more robust              
        
        if(!transid)                                                                                     
          return;
        
        let hrtime = process.hrtime();
        let time = parseInt(((hrtime[0] * 1e3) + (hrtime[1]) * 1e-6));

        if( !found_transids[transid] )                                                                 //Only run when we find a new transponder
        {  
          found_transids[transid] = Object.create( myData ); 
          found_transids[transid].laps = Object.create( Object );                                      //Formatted for web use
          found_transids[transid].clients = new Set()
          found_transids[transid].tid = transid;                
          found_transids[transid].name = findFname(transid)
            
            
            updateRootWebPage();
          
            console.log("New Transponder found: " + transid)
          return
        }
        

        if( !found_transids[transid].firstseen )
        {
          found_transids[transid].lastlap = found_transids[transid].firstseen = time;
          updateTransponderWebPage( transid, { command: 68 } )
          return        
        }  

        updateFastLap( curlap = (time - found_transids[transid].lastlap), found_transids[transid] );
                    
        let clap = sprintf( "lap%i",  ++found_transids[transid].lapcount )  //Make string needed for laps key name and +1 lap count
            
        found_transids[transid].laps[clap] = timeTotxt(curlap); 

        
        found_transids[transid].lastlap = time;

        console.dir(found_transids[transid], {colors: true, depth: 2 }) //debug
        
        if( found_transids[transid].clients ){
          updateTransponderWebPage( transid, { command: 66, laps: found_transids[transid].laps } )
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

function updateFastLap( curlap, user ){
    if( ! user.fastlap || curlap < user.fastlap ){
      user.fastlap = curlap;
      updateTransponderWebPage( user.tid, { command: 80, fastlap: timeTotxt(curlap) } );   
    }
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

function updateRootWebPage(){                                 //Not sure if this version is faster or not.. need to test on RPI node 10.17.0
  let body =''
    found_transids.forEach(function(item){       
        if( item.name ){
          body += '<li><a href="' +  item.tid + '" ref=>Transponder: ' + item.name + ':' + item.tid + '</a></li>'
        }
        else{
          body +=  '<li><a href="' +  item.tid + '" ref=>Transponder: ' + item.tid + '</a></li>'      
        }
                               
    });
  rootclients.forEach(client =>
  {
      client.send( JSON.stringify( { command: 10, body: body } ) ); 
  });                                    
}

function updateTransponderWebPage( tid, command){
  found_transids[tid].clients.forEach(client =>
  {
      client.send( JSON.stringify( command ) );
  });
}