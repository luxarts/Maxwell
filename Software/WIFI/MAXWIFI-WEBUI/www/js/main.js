document.addEventListener("DOMContentLoaded", function(){
	var elems = document.querySelectorAll('.sidenav');
	var instances = M.Sidenav.init(elems, '');
	var elems = document.querySelectorAll('.tooltipped');
	var instances = M.Tooltip.init(elems, {outDuration: 0});
	var elems = document.querySelectorAll('.collapsible');
	var instances = M.Collapsible.init(elems, {accordion: false});
	var elems = document.querySelectorAll('select');
	var instances = M.FormSelect.init(elems, '');
	var elems = document.querySelectorAll('.modal');
	var instances = M.Modal.init(elems, '');
});

var printerStatus = {
	"temp": {
		"extruder": {
			"actual": null,
			"target": null
		},
		"bed": {
			"actual": null,
			"target": null
		}
	},
	"layerFan": null,
	"printing": {
		"status": "I",
		"percent": null,
		"filename": "",
		"time": null
	},
	"pos": {
		"x": null,
		"y": null,
		"z": null,
		"homed": null
	},
	"caselight": null
}

var eeprom = {
	"language": {"type": 0, "pos": 1028, "value": null},
	"baudrate": {"type": 2, "pos": 75, "value": null},
	"filamentPrinted": {"type": 3, "pos": 129, "value": null},
	"printerActive": {"type": 2, "pos": 125, "value": null},
	"maxInactiveTime": {"type": 2, "pos": 79, "value": null},
	"stopStepperAfter": {"type": 2, "pos": 83, "value": null},
	"stepsPerMm": {"type": 3, "pos": 11, "value": null},
	"maxFeedrate": {"type": 3, "pos": 23, "value": null},
	"homingFeedrate": {"type": 3, "pos": 35, "value":null},
	"maxJerk": {"type": 3, "pos": 39, "value": null},
	"xMinPos": {"type": 3, "pos": 133, "value": null},
	"yMinPos": {"type": 3, "pos": 137, "value": null},
	"zMinPos": {"type": 3, "pos": 141, "value": null},
	"xMaxLength": {"type": 3, "pos": 145, "value": null},
	"yMaxLength": {"type": 3, "pos": 149, "value": null},
	"zMaxLength": {"type": 3, "pos": 153, "value": null},
	"segmentsForTravel": {"type": 1, "pos": 891, "value": null},
	"segmentsForPrinting": {"type": 1, "pos": 889, "value": null},
	"acceleration": {"type": 3, "pos": 59, "value": null},
	"travelAcceleration": {"type": 3, "pos": 71, "value": null},
	"diagonalRodLength": {"type": 3, "pos": 881, "value": null},
	"horizontalRodRadius": {"type": 3, "pos": 885, "value": null},
	"maxPrintableRadius": {"type": 3, "pos": 925, "value": null},
	"towerXendstop": {"type": 1, "pos": 893, "value": null},
	"towerYendstop": {"type": 1, "pos": 895, "value": null},
	"towerZendstop": {"type": 1, "pos": 897, "value": null},
	"alphaA": {"type": 3, "pos": 901, "value": null},
	"alphaB": {"type": 3, "pos": 905, "value": null},
	"alphaC": {"type": 3, "pos": 909, "value": null},
	"deltaRadiusA": {"type": 3, "pos": 913, "value": null},
	"deltaRadiusB": {"type": 3, "pos": 917, "value": null},
	"deltaRadiusC": {"type": 3, "pos": 921, "value": null},
	"corrDiagonalA": {"type": 3, "pos": 933, "value": null},
	"corrDiagonalB": {"type": 3, "pos": 937, "value": null},
	"corrDiagonalC": {"type": 3, "pos": 941, "value": null},
	"coatingThickness": {"type": 3, "pos": 1024, "value": null},
	"bedPreheatTemp": {"type": 1, "pos": 1048, "value": null},
	"bedHeatManager": {"type": 0, "pos": 106, "value": null},
	"bedPIDdriveMax": {"type": 0, "pos": 107, "value": null},
	"bedPIDdriveMin": {"type": 0, "pos": 124, "value": null},
	"bedPIDPgain": {"type": 3, "pos": 108, "value": null},
	"bedPIDIgain": {"type": 3, "pos": 112, "value": null},
	"bedPIDDgain": {"type": 3, "pos": 116, "value": null},
	"bedPIDmaxValue": {"type": 0, "pos": 120, "value": null},
	"extr1stepsPerMm": {"type": 3, "pos": 200, "value": null},
	"extr1maxFeedrate": {"type": 3, "pos": 204, "value": null},
	"extr1startFeedrate": {"type": 3, "pos": 208, "value": null},
	"extr1acceleration": {"type": 3, "pos": 212, "value": null},
	"extr1preheatTemp": {"type": 1, "pos": 294, "value": null},
	"extr1heatManager": {"type": 0, "pos": 216, "value": null},
	"extr1PIDdriveMax": {"type": 0, "pos": 217, "value": null},
	"extr1PIDdriveMin": {"type": 0, "pos": 245, "value": null},
	"extr1PIDPgain": {"type": 3, "pos": 218, "value": null},
	"extr1PIDIgain": {"type": 3, "pos": 222, "value": null},
	"extr1PIDDgain": {"type": 3, "pos": 226, "value": null},
	"extr1PIDmaxValue": {"type": 0, "pos": 230, "value": null},
	"extr1xOffset": {"type": 2, "pos": 231, "value": null},
	"extr1yOffset": {"type": 2, "pos": 235, "value": null},
	"extr1zOffset": {"type": 2, "pos": 290, "value": null},
	"extr1tempStabilize": {"type": 1, "pos": 239, "value": null},
	"extr1tempRetraction": {"type": 1, "pos": 250, "value": null},
	"extr1distanceRetract": {"type": 1, "pos": 252, "value": null},
	"extr1coolerSpeed": {"type": 0, "pos": 254, "value": null}
}

var connection;
var debugServer = true;
var waitOk = true;

try{
	connection = new WebSocket('ws://' + location.hostname + ':8888/', ['mwp']);
}catch(err){
	console.log("Error" + err);
	console.error("No se pudo establecer la conexion WebSocket");
	connection = {readyState: 1, onmessage: function(){}, send: function(str){console.error("Mensaje fallido: " + str)}};
}
function sendLine(cmd){
	if(debugServer)console.log("Client>>"+cmd);
	if(connection.readyState == 1){
		envioCompleto = false;
		connection.send('!MWP7 ' + cmd);
	}
	else{
		if(debugServer)console.log("No se pudo enviar");
	}
}
//Serial comunication with ACK
var txBuffer = [];
var envioCompleto = true;
var txInterval;
function sendCmd(dato){
	//if(txBuffer[txBuffer.length-1] == "M205" || txBuffer[txBuffer.length-1] == "m205")return; //Evita enviar dos veces seguidas cargar eeprom
	if(!waitOk){
		sendLine(dato);
		envioCompleto=true;
	}else{
		txBuffer.push(dato); //Mete el dato al final del array
		if(envioCompleto){
			sendLine(txBuffer.shift()); //Saca el primer dato y lo envia
			txInterval = setInterval(enviarResto, 10);
		}
	}
}
function enviarResto(){
	if(txBuffer.length && envioCompleto){ //Si quedan datos por enviar
		sendLine(txBuffer.shift()); //Saca el primer dato y lo envia
	}
	else if(!txBuffer.length){//Si no hay mas datos
		clearInterval(txInterval);
	}
}

connection.onmessage = function (event){
	if(debugServer)console.log("Server>>"+event.data);
	
	if(okCheck(event.data));
	else if(eepromCheck(event.data));
	else if(sdCheck(event.data));
	else if(wifiCheck(event.data));
	else if(jsonCheck(event.data));
	// else if(fwuCheck(event.data));
}
function okCheck(data){
	var matches = data.match(/^(ok|o)$/gm);//Si empieza y termina con 'ok' o con 'o'
	if(!matches)return false;

	envioCompleto = true;
	return true;
}

var eepromLoaded = false;
var eepromReceiving = false;
function eepromCheck(data){
	if(!data.startsWith('EPR:'))return false; //No se encontro patron EPR:
	
	var matches = data.match(/[+-]?\d+(\.\d+)?/g);//Obtiene todos los números
	var pos = parseInt(matches[1]); //Posicion en la EEPROM
	var value = parseFloat(matches[2]);//Valor
	

	for(var key in eeprom){//Recorre todos los objetos
		if(eeprom.hasOwnProperty(key)){
			if(eeprom[key].pos == pos){//Si la posicion coincide con la leida
				//Guarda el valor
				if(eeprom[key].type == 3)eeprom[key].value = parseFloat(value);
				else eeprom[key].value = parseInt(value);
				eepromReceiving = true;
				break;//Termina el bucle for
			}
		}
	}
	if(eepromIsLoaded()){
		eepromLoaded = true;
		M.toast({html: "<i class='mwicons small left'>info</i>Configuración cargada"});
	}
	return true;
}

function wifiCheck(data){
	if(!data.startsWith('!MWP2'))return false;

	if(document.getElementById("STA_SSID")==null || document.getElementById("STA_PASSWORD") == null)return;
	matches = data.match(/\w+/g);
	document.getElementById("STA_SSID").value = matches[1];
	document.getElementById("STA_PASSWORD").value = matches[2];
	return true;
}

function eepromIsLoaded(){
	for(var key in eeprom){//Recorre todos los objetos
		if(eeprom.hasOwnProperty(key)){
			if(eeprom[key].value == null){//Comprueba si esta vacio
				return false;
			}
		}
	}
	return true;
}

function cargarEeprom(){
	for(var key in eeprom){//Recorre todos los objetos
		if(eeprom.hasOwnProperty(key)){
			eeprom[key].value = null; //Vacia toda la configuracion actual
		}
	}
	eepromLoaded=false;
	eepromReceiving=false;
	sendCmd("M205");
}
function guardarEeprom(){
	waitOk = false;
	for(var key in eeprom){//Recorre todos los objetos
		if(eeprom.hasOwnProperty(key)){
			if(eeprom[key].value != null){
				var cmdString = "M206 T";
				cmdString += eeprom[key].type.toString()+" P";
				cmdString += eeprom[key].pos.toString()+" ";
				if(eeprom[key].type == 3) cmdString += "X";
				else cmdString += "S";
				cmdString += eeprom[key].value.toString();
				sendCmd(cmdString);
			}
		}
	}
	waitOk = true;
}

var sdItems = [];
var sdReceiving = false;
var sdLoaded = false;
function sdCheck(data){
	var matches = data.match(/Begin file list/g);

	//si el inicio se encuentra -> se activa la bandera
	if(matches){
		sdReceiving = true;
		sdLoaded = false;
		sdItems = [];
		if(document.getElementById("fileListProgress")!=null)document.getElementById("fileListProgress").style.display = "block";
		if(document.getElementById("fileList")!=null)document.getElementById("fileList").style.display = "none";
	}
	else{
		//si el inicio no se encuentra y la bandera esta desactivada (no se esta recibiendo) -> vuelve
		if(sdReceiving == false)return false;
		//si el inicio no se encuentra y la bandera esta activada (se esta recibiendo) -> busca el final
		matches = data.match(/End file list/g);
		//si el final se encuentra -> desactiva la bandera
		if(matches){
			sdReceiving = false;
			sdLoaded=true;
			if(typeof(actualizarLista)!="undefined")actualizarLista();
			if(typeof(showList)!="undefined")showList(true);
		}
		//si el final no se encuentra -> es un archivo o carpeta
		else{
			sdItems.push(data);
		}
	}
	return true;
}

function cargarSd(){
	sdItems = [];
	sdLoaded = false;
	sdReceiving = false;
	sendCmd("M20");
}

function jsonCheck(data){
	if(!data.startsWith("JSONStatus"))return false;
	
	var jsonStatus = data.replace("JSONStatus", "");
	printerStatus = JSON.parse(jsonStatus);

	if(typeof(updateButtons)!="undefined")updateButtons();
	//if(typeof(updateTemp)!=undefined)updateTemp(printerStatus.temp.extruder.actual, printerStatus.temp.extruder.target, printerStatus.temp.bed.actual, printerStatus.temp.bed.target);
	//if(typeof(updatePos)!=undefined)updatePos();
	return true;
}

window.addEventListener("load",function(){
	sendCmd("M205");//Cargar EEPROM
});
window.setTimeout(function(){
	if(!eepromLoaded)cargarEeprom();
}, 500);

var json_i = setInterval(function(){
	sendCmd("m408");
}, 5000);

























