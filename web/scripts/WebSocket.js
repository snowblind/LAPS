
var connection = new WebSocket('ws://'+location.hostname + location.pathname, ['arduino']);

connection.onopen = function () {
    
    console.log('WebSocket connection opened');
    
};

connection.onerror = function (error) {
    console.log('WebSocket Error ', error);
};

connection.onmessage = function (e) { 
    var body = '';

    var test = JSON.parse( e.data )

        for (var key in test) {
           body += "<li>" + key + " " + test[key] + "</li>"
        }
        body += "<p></p><p></p>"
        document.getElementById('lapdata').innerHTML = body;

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

//console.log( "WebSock.js: " + location.pathname )