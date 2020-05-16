
var connection = new WebSocket('ws://'+location.hostname + location.pathname, ['arduino']);

var lapdata;
const scrollIntoViewOptions = { behavior: "smooth", block: "end" };

connection.onopen = function (){  
    console.log('WebSocket connection opened');  
};

connection.onerror = function (error){
    console.log('WebSocket Error ', error);
};

connection.onmessage = function(e){ 
    var body = '';
 try{
    var jsonmsg = JSON.parse( e.data )
      
              switch(jsonmsg.command){
                case 44:
                  console.log( 'command 44' );
                  if( jsonmsg.name){
                    document.getElementById('tinfo').innerHTML = jsonmsg.name + ':' + jsonmsg.tid + '<input type="button" onclick="clearUserData()" style="border: none; height: 24px; width: 24px; background: url( /icons/icons8-cls-24.png )"/>'
                  }
                  else{
                    document.getElementById('tinfo').innerHTML =  jsonmsg.tid + '<input type="button" onclick="clearUserData()" style="border: none; height: 24px; width: 24px; background: url( /icons/icons8-cls-24.png )"/>'      
                  }
                break;
                case 66:
                    for (var key in jsonmsg.laps) {
                        body += '<li>' + key + ' ' + jsonmsg.laps[key] + '</li>'
                     }
                     body += '<p></p><p></p>'
                     lapdata.innerHTML = body;
                     lapdata.scrollIntoView(scrollIntoViewOptions);
                     console.log( 'command 66' )
                break;
                case 67:
                     lapdata.innerHTML = '<h1 style="color:yellow">READY!!</h1> Pass over the loop to start';
                     console.log( 'command 67' )
                break;
                case 68:
                     lapdata.innerHTML = '<h1 style="color:green">GO!!!</h1>';
                     console.log( 'command 68' )
                break;
                case 80:
                     document.getElementById('userstats').innerHTML = '<td class="drt1">Fastest Lap</td><td class="drt2">' + jsonmsg.fastlap + '</td>';
                     console.log( 'command 80' )
                break;
                case 81:
                     body += '<p></p><p></p>'
                     lapdata.innerHTML = body;
                     console.log( 'command 81')
                break;
              }
    }
    catch(err){
        console.log( err )
    }
    console.log(e);
}; 

connection.onclose = function(){
    console.log('WebSocket connection closed');
};
 
function clearUserData(){
    connection.send(  JSON.stringify( { command: 22, tid: location.pathname.substr(1, 7) }) );
    lapdata.innerHTML = '<h1 style="color:yellow">READY!!</h1> Pass over the loop to start';
}

function load(){
  lapdata =  document.getElementById('lapdata');
	  console.log( 'load event detected!' );   
}
window.onload = load;