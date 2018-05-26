var eeprom = {
	stepsPermm:null,
	zMaxLength:null,
	diagonalRodLength:null,
	horizontalRodRadius:null,
	maxPrintableRadius:null,
	towerXendstop:null,
	towerYendstop:null,
	towerZendstop:null
};
var eepromNew = {
	stepsPermm:null,
	zMaxLength:null,
	diagonalRodLength:null,
	horizontalRodRadius:null,
	maxPrintableRadius:null,
	towerXendstop:null,
	towerYendstop:null,
	towerZendstop:null
};
var debugServer=false;
var eepromLoaded=false;
var connection = new WebSocket('ws://' + location.hostname + ':8888/', ['mwp'])
var feedrate = 100;//100mm/s
var fwuStatus = -1;

connection.onmessage = function (event){
	if(debugServer)console.log("Server>>"+event.data)
	eepromCheck(event.data);
	fwuCheck(event.data);
}

function sendCmd(cmd){
	console.log(cmd);
	if(connection.readyState){
		connection.send('!MWP7 ' + cmd);
	}
}

function fwuCheck(data){
	var matches = data.match(/!MWP8 /);
	if(matches ==null)return;

	matches = data.match(/S\d/g);
	if(matches[0] == "S1")fwuStatus=1;
	else if(matches[0] == "S0")fwuStatus=0;
}

function saveEeprom(){
	//zMaxLength
	if(eepromNew.zMaxLength != null)sendCmd("M206 T3 P153 X"+eepromNew.zMaxLength.toString());
	//horizontalRodRadius
	if(eepromNew.horizontalRodRadius != null)sendCmd("M206 T3 P885 X"+eepromNew.horizontalRodRadius.toString());//T=tipo P=posicion X=valor float
	//towerXendstop
	if(eepromNew.towerXendstop != null)sendCmd("M206 T1 P893 S"+eepromNew.towerXendstop.toString());//T=tipo P=posicion S=valor int
	//towerYendstop
	if(eepromNew.towerYendstop != null)sendCmd("M206 T1 P895 S"+eepromNew.towerYendstop.toString());
	//towerZendstop
	if(eepromNew.towerZendstop != null)sendCmd("M206 T1 P897 S"+eepromNew.towerZendstop.toString());
	loadEeprom();
}
function loadEeprom(){
	sendCmd("M205");
	if(eepromLoaded)return true;
	else return false;
}

function eepromCheck(epr){
	var matches = epr.match(/EPR:/);
	if(matches == null)return; //No se encontro patron
	
	matches = epr.match(/[+-]?\d+(\.\d+)?/g);
	var value = parseFloat(matches[2]);//Valor
	var eprPos = parseInt(matches[1]);

	switch(eprPos){
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
			eepromLoaded = true;
		break;
	}
}

window.onload = loadEeprom;//Carga eeprom
/*
	EPR:3 11 80.0000 Steps per mm
	EPR:3 153 155.0 Z max length [mm]
	EPR:3 881 200.000 Diagonal rod length [mm]
	EPR:3 885 100.000 Horizontal rod radius at 0,0 [mm]
	EPR:3 925 81.000 Max printable radius [mm]
	EPR:1 893 10 Tower X endstop offset [steps]
	EPR:1 895 20 Tower Y endstop offset [steps]
	EPR:1 897 30 Tower Z endstop offset [steps]

	EPR:3 901 210.000 Alpha A(210):
	EPR:3 905 330.000 Alpha B(330):
	EPR:3 909 90.000 Alpha C(90):
	EPR:3 913 0.000 Delta Radius A(0):
	EPR:3 917 0.000 Delta Radius B(0):
	EPR:3 921 0.000 Delta Radius C(0):
	EPR:3 933 4.206 Corr. diagonal A [mm]
	EPR:3 937 0.815 Corr. diagonal B [mm]
	EPR:3 941 1.662 Corr. diagonal C [mm]
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