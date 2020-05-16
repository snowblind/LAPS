
var connection = new WebSocket('ws://'+location.hostname, ['arduino']);

connection.onopen = function (){
    console.log('WebSocket connection opened');    
};

connection.onerror = function (error){
    console.log('WebSocket Error ', error);
};

connection.onmessage = function (e){ 
    try{
        var jsonmsg = JSON.parse( e.data )
          
                switch(jsonmsg.command){
                    case 10:
                      document.getElementById('tlist').innerHTML = jsonmsg.body;
                      console.log( 'command 10' );
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
function load() {
    console.log("load event detected!");  
}
window.onload = load;