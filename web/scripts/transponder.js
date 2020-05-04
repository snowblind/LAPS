
var connection = new WebSocket('ws://'+location.hostname + location.pathname, ['arduino']);

connection.onopen = function () {
    
    console.log('WebSocket connection opened');
    
};

connection.onerror = function (error) {
    console.log('WebSocket Error ', error);
};

connection.onmessage = function(e) { 
    var body = '';
 try{
    var jsonmsg = JSON.parse( e.data )
      
              switch(jsonmsg.command){
                case 44:
                  console.log( "command 44" );
                  if( jsonmsg.name){
                    document.getElementById('tinfo').innerHTML = jsonmsg.name + ":" + jsonmsg.tid + "<input type=\"button\" onclick=\"clearUserData()\" style=\"border: none; height: 24px; width: 24px; background: url('/icons/icons8-cls-24.png' )\"/>"
                  }
                  else{
                    document.getElementById('tinfo').innerHTML =  jsonmsg.tid + "<input type=\"button\" onclick=\"clearUserData()\" style=\"border: none; height: 24px; width: 24px; background: url('/icons/icons8-cls-24.png' )\"/>"      
                  }
                break;
                case 66:
                    for (var key in jsonmsg.laps) {
                        body += "<li>" + key + " " + jsonmsg.laps[key] + "</li>"
                     }
                     body += "<p></p><p></p>"
                     document.getElementById('lapdata').innerHTML = body;
                    console.log( "command 66")
                break;


              }
    }
    catch(err) {
        console.log( err )
    }
    console.log(e);
}; 

connection.onclose = function(){
    console.log('WebSocket connection closed');

};
 
function clearUserData() {

    var appData ={
        command: 22,
        tid: location.pathname.substr(1, 7)   
    }
    connection.send(  JSON.stringify(appData) );

    document.getElementById('lapdata').innerHTML = "";
}

function load() {
	console.log("load event detected!");
   
}
window.onload = load;