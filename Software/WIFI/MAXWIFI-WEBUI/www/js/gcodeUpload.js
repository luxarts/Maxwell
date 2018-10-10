var uploader;

onmessage = function (e){
	var settings;
	[gcodeLines, settings] = e.data;
	startUpload(gcodeLines, settings);
}

function startUpload(gcodeLines, settings){
	var percent;
	sendCmd("M28 "+settings.fileName);
	console.log("Archivo: "+settings.fileName);
	console.log("Lineas totales: "+gcodeLines.length);
	for(var i in gcodeLines){
		//console.log("Linea: ("+i+")"+gcodeLines[i]);
		if(!gcodeLines[i].startsWith(";")){//Si no es un comentario
			sendCmd(gcodeLines[i]);
		}
		percent = Math.floor(i * 100 / gcodeLines.length);
		if (percent != Math.floor((i - 1) * 100 / gcodeLines.length)) {
			postMessage({"progress": percent});
		}
	}
	sendCmd("M29");
	postMessage({"complete": true});
}

// WebSocket
var connection;
var receivedOk = true;

try{
	connection = new WebSocket('ws://' + location.hostname + ':8888/', ['mwp']);
}catch(err){
	console.log("Error" + err);
	console.error("No se pudo establecer la conexion WebSocket");
	connection = {readyState: 1, onmessage: function(){}, send: function(str){}};
}
function sendCmd(cmd){
	//if(!receivedOk)return;
	if(connection.readyState == 1){
		connection.send('!MWP7 ' + cmd);
		receivedOk=false;
	}
}
connection.onmessage = function (event){	
	if(okCheck(event.data));
}
function okCheck(data){
	if(!data.startsWith("ok"))return false;
	receivedOk = true;
	return true;
}