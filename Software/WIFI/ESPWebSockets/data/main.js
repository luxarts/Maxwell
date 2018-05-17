var connection = new WebSocket('ws://' + location.hostname + ':8888/', ['mwp'])

connection.onmessage = function (event){
	document.getElementById('serverText').innerHTML = event.data;
}

function sendCmd(cmd){
	if(connection.readyState)
		connection.send('!MAX123 ' + cmd);
}