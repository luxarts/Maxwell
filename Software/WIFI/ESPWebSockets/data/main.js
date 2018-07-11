var eeprom = {
	stepsPermm:null,
	zMaxLength:null,
	diagonalRodLength:null,
	horizontalRodRadius:null,
	maxPrintableRadius:null,
	towerXendstop:null,
	towerYendstop:null,
	towerZendstop:null,
	corrDiagonalA:null,
	corrDiagonalB:null,
	corrDiagonalC:null,
	deltaRadiusA:null,
	deltaRadiusB:null,
	deltaRadiusC:null,
	maxFeedrate:null,
	acceleration:null,
	travelAcceleration:null,
	jerk:null,
	extr1DeadTime:null,
	filamentPrinted:null,	
	printerActive:null
	
};
var eepromNew = {
	stepsPermm:null,
	zMaxLength:null,
	diagonalRodLength:null,
	horizontalRodRadius:null,
	maxPrintableRadius:null,
	towerXendstop:null,
	towerYendstop:null,
	towerZendstop:null,
	corrDiagonalA:null,
	corrDiagonalB:null,
	corrDiagonalC:null,
	deltaRadiusA:null,
	deltaRadiusB:null,
	deltaRadiusC:null,
	maxFeedrate:null,
	acceleration:null,
	travelAcceleration:null,
	jerk:null,
	extr1DeadTime:null,
	filamentPrinted:null,	
	printerActive:null
};
var eprPos = {
	stepsPermm: 11,
	zMaxLength: 153,
	diagonalRodLength: 881,
	horizontalRodRadius: 885,
	maxPrintableRadius: 925,
	towerXendstop: 893,
	towerYendstop: 895,
	towerZendstop: 897,
	corrDiagonalA: 933,
	corrDiagonalB: 937,
	corrDiagonalC: 941,
	deltaRadiusA: 901,
	deltaRadiusB: 905,
	deltaRadiusC: 909,
	maxFeedrate: 23,
	acceleration: 59,
	travelAcceleration: 71,
	jerk: 39,
	extr1DeadTime: 218,
	filamentPrinted: 129,
	printerActive: 125
};
var debugServer=false;
var eepromLoaded=false;
var connection = new WebSocket('ws://' + location.hostname + ':8888/', ['mwp'])
var feedrate = 150;//150mm/s
var fwuStatus = -1;
var navbarWidth = 0;

function getnavbarWidth(){
	var navbarDOM = document.getElementById("navbar");
	var liDOM = navbarDOM.getElementsByTagName("li");

	for (var i=0 ; i < liDOM.length ; i++){
		navbarWidth += liDOM[i].getElementsByTagName("a")[0].offsetWidth;//Obtiene el ancho de cada elemento
	}
	navbarCheck();
}
getnavbarWidth();

function navbarCheck(){
	var navbarDOM = document.getElementById("navbar");
	if(document.body.offsetWidth <= navbarWidth){//Si es mas ancha la barra que la pantalla
		navbarDOM.classList.remove("navbar-h");
		navbarDOM.classList.add("navbar-v");
	}
	else{
		navbarDOM.classList.remove("navbar-v");
		navbarDOM.classList.add("navbar-h");
	}
}
window.onresize = navbarCheck;

connection.onmessage = function (event){
	if(debugServer)console.log("Server>>"+event.data)
	
	if(okCheck(event.data));
	else if(eepromCheck(event.data));
	else if(fwuCheck(event.data));
	else if(wifiCheck(event.data));
	else if(tempCheck(event.data));
	else if(sdCheck(event.data));
	else if(statusCheck(event.data));
	else if(percentageCheck(event.data));
}

function okCheck(data){
	if(!data.startsWith("ok"))return false;
	receivedOk = true;
	return true;
}

var percentagePrinted = 0;
function percentageCheck(data){
	if(!data.startsWith("SD printing byte"))return false;
	var matches = data.match(/\d+/g);//SD printing byte 86235/86235
	
	percentagePrinted = (parseInt(matches[0])*100/parseInt(matches[1])).toFixed(2);
	return true;
}

var printerStatus = {};
function statusCheck(data){
	if(!data.startsWith('{"status": '))return false;
	try{
		printerStatus = JSON.parse(data);
		readStatus();
	}
	catch(e){}

	return true;
}

var receivedOk = true;
function sendCmd(cmd){
	//if(!receivedOk)return;
	if(debugServer)console.log("Client>>"+cmd);
	if(connection.readyState){
		connection.send('!MWP7 ' + cmd);
		receivedOk=false;
	}
	else{
		if(debugServer)console.log("No se pudo enviar");
	}
}

function showMsg(msg){
	var newmsg = document.createElement("div");
	newmsg.setAttribute("id", "msgbox");
	newmsg.innerHTML = msg;
	document.body.appendChild(newmsg);

	setTimeout(function(){
	 	document.getElementById("msgbox").style.opacity = "0.9";
	}, 10);
	setTimeout(function(){
	 	document.getElementById("msgbox").style.opacity = "0";
	}, 3000);
	setTimeout(function(){
		document.body.removeChild(document.getElementById("msgbox"));
	}, 3600);
}

var sdItems = [];
var sdReceiving = false;
var sdLoaded = false;
function sdCheck(data){
	var matches = data.match(/Begin file list/g);

	//si el inicio se encuentra -> se activa la bandera
	if(matches){
		sdReceiving = true;
		sdItems = [];
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
			try{actualizarLista()}catch(e){};
		}
		//si el final no se encuentra -> es un archivo o carpeta
		else{
			sdItems.push(data);
		}
	}
	return true;
}
function wifiCheck(data){
	var matches = data.match(/!MWP2 /g);
	if(matches == null)return false;

	if(document.getElementById("STA_SSID")==null || document.getElementById("STA_PASSWORD") == null)return;
	matches = data.match(/\w+/g);
	document.getElementById("STA_SSID").value = matches[1];
	document.getElementById("STA_PASSWORD").value = matches[2];
	return true;
}
function fwuCheck(data){
	var matches = data.match(/!MWP8 /);
	if(matches == null)return false;

	matches = data.match(/S\d/g);
	if(matches[0] == "S1")fwuStatus=1;
	else if(matches[0] == "S0")fwuStatus=0;
	return true;
}
function tempCheck(data){
	var matches = data.match(/T:/);
	if(matches == null)return false;


	//Formato = T: 123.45 /123.45 @:123
	matches = data.match(/[+-]?\d+(\.\d+)?/g);//Obtiene todos los números
	var currentTemp = parseFloat(matches[0]);
	var targetTemp = parseFloat(matches[1]);
	//var heaterPwm = parseFloat(matches[2]);
	
	try{actualizarTemp(currentTemp, targetTemp)}catch(e){};;
	return true;
}
function saveEeprom(){
	//stepsPermm
	if(eepromNew.stepsPermm != null)sendCmd("M206 T3 P11 X"+eepromNew.stepsPermm.toString());
	//zMaxLength
	if(eepromNew.zMaxLength != null)sendCmd("M206 T3 P153 X"+eepromNew.zMaxLength.toString());
	//horizontalRodRadius
	if(eepromNew.horizontalRodRadius != null)sendCmd("M206 T3 P885 X"+eepromNew.horizontalRodRadius.toString());//T=tipo P=posicion X=valor float
	//diagonalRodLength
	if(eepromNew.diagonalRodLength != null)sendCmd("M206 T3 P881 X"+eepromNew.diagonalRodLength.toString());
	//maxPrintableRadius
	if(eepromNew.maxPrintableRadius != null)sendCmd("M206 T3 P925 X"+eepromNew.maxPrintableRadius.toString());
	//towerXendstop
	if(eepromNew.towerXendstop != null)sendCmd("M206 T1 P893 S"+eepromNew.towerXendstop.toString());//T=tipo P=posicion S=valor int
	//towerYendstop
	if(eepromNew.towerYendstop != null)sendCmd("M206 T1 P895 S"+eepromNew.towerYendstop.toString());
	//towerZendstop
	if(eepromNew.towerZendstop != null)sendCmd("M206 T1 P897 S"+eepromNew.towerZendstop.toString());
	//corrDiagonalA
	if(eepromNew.corrDiagonalA != null)sendCmd("M206 T3 P933 X"+eepromNew.corrDiagonalA.toString());
	//corrDiagonalB
	if(eepromNew.corrDiagonalB != null)sendCmd("M206 T3 P937 X"+eepromNew.corrDiagonalB.toString());
	//corrDiagonalC
	if(eepromNew.corrDiagonalC != null)sendCmd("M206 T3 P941 X"+eepromNew.corrDiagonalC.toString());
	//extr1DeadTime
	if(eepromNew.extr1DeadTime != null)sendCmd("M206 T3 P218 X"+eepromNew.extr1DeadTime.toString());
	//deltaRadiusA (alpha A)
	if(eepromNew.deltaRadiusA != null)sendCmd("M206 T3 P901 X"+eepromNew.deltaRadiusA.toString());
	//deltaRadiusB (alpha B)
	if(eepromNew.deltaRadiusB != null)sendCmd("M206 T3 P905 X"+eepromNew.deltaRadiusB.toString());
	//deltaRadiusC (alpha C)
	if(eepromNew.deltaRadiusC != null)sendCmd("M206 T3 P909 X"+eepromNew.deltaRadiusC.toString());
	//filamentPrinted
	if(eepromNew.filamentPrinted != null)sendCmd("M206 T3 P129 X"+eepromNew.filamentPrinted.toString());
	//printerActive
	if(eepromNew.printerActive != null)sendCmd("M206 T2 P125 X"+eepromNew.printerActive.toString());
	//maxFeedrate
	if(eepromNew.maxFeedrate != null){
		sendCmd("M206 T3 P15 X"+eepromNew.maxFeedrate.toString());
		sendCmd("M206 T3 P19 X"+eepromNew.maxFeedrate.toString());
		sendCmd("M206 T3 P23 X"+eepromNew.maxFeedrate.toString());
	}
	//acceleration
	if(eepromNew.acceleration != null){
		sendCmd("M206 T3 P51 X"+eepromNew.acceleration.toString());
		sendCmd("M206 T3 P55 X"+eepromNew.acceleration.toString());
		sendCmd("M206 T3 P59 X"+eepromNew.acceleration.toString());
	}
	//travelAcceleration
	if(eepromNew.travelAcceleration != null){
		sendCmd("M206 T3 P51 X"+eepromNew.travelAcceleration.toString());
		sendCmd("M206 T3 P55 X"+eepromNew.travelAcceleration.toString());
		sendCmd("M206 T3 P59 X"+eepromNew.travelAcceleration.toString());
	}
	//jerk
	if(eepromNew.jerk != null)sendCmd("M206 T2 P125 X"+eepromNew.jerk.toString());

	loadEeprom();
}
function loadEeprom(){
	sendCmd("M205");
	if(eepromLoaded)return true;
	else return false;
}
function eepromCheck(epr){
	var matches = epr.match(/EPR:/);
	if(matches == null)return false; //No se encontro patron
	
	matches = epr.match(/[+-]?\d+(\.\d+)?/g);//Obtiene todos los números
	var value = parseFloat(matches[2]);//Valor
	var eprPos = parseInt(matches[1]);

	switch(eprPos){
		case 129:
			eeprom.filamentPrinted = value;
		break;
		case 125:
			eeprom.printerActive = value;
		break;
		case 11:
			eeprom.stepsPermm = value;
		break;
		case 153:
			eeprom.zMaxLength = value;
		break;
		case 881:
			eeprom.diagonalRodLength = value;
		break;
		case 885:
			eeprom.horizontalRodRadius = value;
		break;
		case 925:
			eeprom.maxPrintableRadius = value;
		break;
		case 893:
			eeprom.towerXendstop = value;
		break;
		case 895:
			eeprom.towerYendstop = value;
		break;
		case 897:
			eeprom.towerZendstop = value;
		break;
		case 933:
			eeprom.corrDiagonalA = value;
		break;
		case 937:
			eeprom.corrDiagonalB = value;
		break;
		case 941:
			eeprom.corrDiagonalC = value;
		break;
		case 901:
			eeprom.deltaRadiusA = value;
		break;
		case 905:
			eeprom.deltaRadiusB = value;
		break;
		case 909:
			eeprom.deltaRadiusC = value;
		break;
		case 218:
			eeprom.extr1DeadTime = value;
			eepromLoaded = true;
			clearInterval(eprInterval);
		break;
	}
	return true;
}

var eprInterval = setInterval(loadEeprom, 500);
window.onload = loadEeprom;//Carga eeprom

// window.setInterval(function(){
// 	sendCmd("M408");//Status
// }, 1000);

/*
	EPR:3 11 80.0000 Steps per mm
	EPR:3 153 155.0 Z max length [mm]
	EPR:3 881 200.000 Diagonal rod length [mm]
	EPR:3 885 100.000 Horizontal rod radius at 0,0 [mm]
	EPR:3 925 81.000 Max printable radius [mm]
	EPR:1 893 10 Tower X endstop offset [steps]
	EPR:1 895 20 Tower Y endstop offset [steps]
	EPR:1 897 30 Tower Z endstop offset [steps]
	EPR:3 933 4.206 Corr. diagonal A [mm]
	EPR:3 937 0.815 Corr. diagonal B [mm]
	EPR:3 941 1.662 Corr. diagonal C [mm]
	EPR:3 218 6.1250 Extr.1 PID P-gain/dead-time
	EPR:3 901 210.000 Alpha A(210):
	EPR:3 905 330.000 Alpha B(330):
	EPR:3 909 90.000 Alpha C(90):
	EPR:3 129 185.215 Filament printed [m]
	EPR:2 125 107008 Printer active [s]

	EPR:3 913 0.000 Delta Radius A(0):
	EPR:3 917 0.000 Delta Radius B(0):
	EPR:3 921 0.000 Delta Radius C(0):
	EPR:3 1024 0.000 Coating thickness [mm]
	EPR:3 200 95.300 Extr.1 steps per mm
	EPR:3 204 60.000 Extr.1 max. feedrate [mm/s]
	EPR:3 208 20.000 Extr.1 start feedrate [mm/s]
	EPR:3 212 50.000 Extr.1 acceleration [mm/s^2]
	EPR:1 294 210 Extr.1 Preheat temp. [�C]
	EPR:0 216 3 Extr.1 heat manager [0-3]
	EPR:0 217 255 Extr.1 PID drive max
	EPR:0 245 40 Extr.1 PID drive min
	EPR:3 218 6.1250 Extr.1 PID P-gain/dead-time
	EPR:3 222 2.0000 Extr.1 PID I-gain
	EPR:3 226 40.0000 Extr.1 PID D-gain
	EPR:0 230 255 Extr.1 PID max value [0-255]
	EPR:2 231 0 Extr.1 X-offset [steps]
	EPR:2 235 0 Extr.1 Y-offset [steps]
	EPR:2 290 0 Extr.1 Z-offset [steps]
	EPR:1 239 1 Extr.1 temp. stabilize time [s]
	EPR:1 250 170 Extr.1 temp. for retraction when heating [C]
	EPR:1 252 6 Extr.1 distance to retract when heating [mm]
	EPR:0 254 255 Extr.1 extruder cooler speed [0-255]
*/