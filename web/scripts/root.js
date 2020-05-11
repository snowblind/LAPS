
var connection = new WebSocket('ws://'+location.hostname, ['arduino']);

connection.onopen = function (){
    console.log('WebSocket connection opened');    
};

connection.onerror = function (error){
    console.log('WebSocket Error ', error);
};

connection.onmessage = function (e){ 
    document.getElementById('tlist').innerHTML = e.data;
    console.log(e);
};

connection.onclose = function(){   
    console.log('WebSocket connection closed');
};
function load() {
    console.log("load event detected!");  
}
window.onload = load;