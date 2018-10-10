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
	"position": {
		"x": null,
		"y": null,
		"z": null,
		"e": null
	}
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
var eepromLoaded = false;
var connection;
var debugServer = true;

try{
	connection = new WebSocket('ws://' + location.hostname + ':8888/', ['mwp']);
}catch(err){
	console.log("Error" + err);
	console.error("No se pudo establecer la conexion WebSocket");
	connection = {readyState: 1, onmessage: function(){}, send: function(str){console.error("Mensaje fallido: " + str)}};
}

function sendCmd(cmd){
	//if(!receivedOk)return;
	if(debugServer)console.log("Client>>"+cmd);
	if(connection.readyState == 1){
		connection.send('!MWP7 ' + cmd);
		receivedOk=false;
	}
	else{
		if(debugServer)console.log("No se pudo enviar");
	}
}

connection.onmessage = function (event){
	if(debugServer)console.log("Server>>"+event.data);
	
	if(okCheck(event.data));
	else if(eepromCheck(event.data));
	else if(sdCheck(event.data));
	else if(wifiCheck(event.data));
	// else if(fwuCheck(event.data));
	// else if(tempCheck(event.data));
	// else if(statusCheck(event.data));
	// else if(percentageCheck(event.data));
}
function okCheck(data){
	if(!data.startsWith("ok"))return false;
	receivedOk = true;
	return true;
}
function eepromCheck(data){
	var matches = data.startsWith('EPR:');
	if(matches == null)return false; //No se encontro patron EPR:
	
	matches = data.match(/[+-]?\d+(\.\d+)?/g);//Obtiene todos los números
	var pos = parseInt(matches[1]); //Posicion en la EEPROM
	var value = parseFloat(matches[2]);//Valor
	

	for(var key in eeprom){//Recorre todos los objetos
		if(eeprom.hasOwnProperty(key)){
			if(eeprom[key].pos == pos){//Si la posicion coincide con la leida
				eeprom[key].value = value;//Guarda el valor
				break;//Termina el bucle for
			}
		}
	}
	eepromLoaded = eepromIsLoaded();
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
	sendCmd("M205");
}

var sdItems = [];
sdItems = ["CALIBR~1/", "CALIBR~1/caldelta10cm.gcode 492036", "CALIBR~1/caldelta60mm.gcode 1071141", "Maxwell/", "Maxwell/Duct.gcode 419198", "Maxwell/Effector.gcode 1371175", "Maxwell/FlyingMK8.gcode 1379435", "Maxwell/Foot.gcode 1576667", "Maxwell/Hotend.gcode 1412505", "Maxwell/HotendClamp.gcode 1632055", "Maxwell/joint x12.gcode 2292749", "Maxwell/MotorBase.gcode 7330960", "Maxwell/SoporteTop.gcode 5725384", "Maxwell/SoporteTopCorto.gcode 2623209", "Maxwell/SpotLed.gcode 1960631", "Maxwell/SujetaCorrea.gcode 908033", "AIO test.gcode 2203504", "eeprom.bin 4096"];
var sdReceiving = false;
var sdLoaded = false;
function sdCheck(data){
	var matches = data.match(/Begin file list/g);

	//si el inicio se encuentra -> se activa la bandera
	if(matches){
		sdReceiving = true;
		sdLoaded = false;
		sdItems = [];
		document.getElementById("fileListProgress").style.display = "block";
		document.getElementById("fileList").style.display = "none";
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
			try{
				actualizarLista();
				document.getElementById("fileListProgress").style.display = "none";
				document.getElementById("fileList").style.display = "block";
			}catch(e){};
		}
		//si el final no se encuentra -> es un archivo o carpeta
		else{
			sdItems.push(data);
		}
	}
	return true;
}



































