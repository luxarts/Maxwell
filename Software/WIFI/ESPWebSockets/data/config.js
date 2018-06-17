function showValues(){
	document.getElementById("stepspermm").value = eeprom.stepsPermm;
	document.getElementById("zmaxlength").value = eeprom.zMaxLength;
	document.getElementById("diagonalrodlength").value = eeprom.diagonalRodLength;
	document.getElementById("horizontalrodradius").value = eeprom.horizontalRodRadius;
	document.getElementById("maxprintableradius").value = eeprom.maxPrintableRadius;
	document.getElementById("towerxendstop").value = eeprom.towerXendstop;
	document.getElementById("toweryendstop").value = eeprom.towerYendstop;
	document.getElementById("towerzendstop").value = eeprom.towerZendstop;
	document.getElementById("corrdiagonala").value = eeprom.corrDiagonalA;
	document.getElementById("corrdiagonalb").value = eeprom.corrDiagonalB;
	document.getElementById("corrdiagonalc").value = eeprom.corrDiagonalC;
	document.getElementById("extr1deadtime").value = eeprom.extr1DeadTime;

}
function updateValues(){
	eepromNew.stepsPermm = document.getElementById("stepspermm").value ;
	eepromNew.zMaxLength = document.getElementById("zmaxlength").value;
	eepromNew.diagonalRodLength = document.getElementById("diagonalrodlength").value;
	eepromNew.horizontalRodRadius = document.getElementById("horizontalrodradius").value;
	eepromNew.maxPrintableRadius = document.getElementById("maxprintableradius").value;
	eepromNew.towerXendstop = document.getElementById("towerxendstop").value;
	eepromNew.towerYendstop = document.getElementById("toweryendstop").value;
	eepromNew.towerZendstop = document.getElementById("towerzendstop").value;
	eepromNew.corrDiagonalA = document.getElementById("corrdiagonala").value;
	eepromNew.corrDiagonalB = document.getElementById("corrdiagonalb").value;
	eepromNew.corrDiagonalC = document.getElementById("corrdiagonalc").value;
	eepromNew.extr1DeadTime = document.getElementById("extr1deadtime").value;
}
function handleCargar(){
	loadEeprom();
	loadWifi();
	showValues();
	document.getElementById("msg").innerHTML = "Configuracion cargada";
}
function handleGuardar(){
	updateValues();
	saveEeprom();
	saveWifi();
	document.getElementById("msg").innerHTML = "Configuracion guardada";
}
function handleSubir(event){
	var file = event.target.files[0];

	var reader = new FileReader();
	reader.onload = function(){
		archivo = formatFile(reader.result).split(" ");
		fileValues();
		showValues();
	}
	reader.readAsBinaryString(file);
}
function handleDescargar(){
	var settings = "MWC";
	for (var i in eeprom){
		settings += eeprom[i] + '&';	
	}

	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(btoa(settings)));
	element.setAttribute('download', "config.mw");

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}
function saveWifi(){
	var ssid = document.getElementById("STA_SSID").value;
	var password = document.getElementById("STA_PASSWORD").value;

	if(ssid!=null && password!=null){
		if(connection.readyState){
			if(debugServer)console.log("Client>>"+'!MWP9 ' + ssid);
			connection.send('!MWP9 ' + ssid + '0');
			if(debugServer)console.log("Client>>"+'!MWP10 ' + password);
			connection.send('!MWP10 ' + password + '0');
		}
	}
}
function loadWifi(){
	if(connection.readyState){
		if(debugServer)console.log("Client>>"+'!MWP2');
		connection.send('!MWP2');
	}
}

if (!window.File || !window.FileReader) {
	document.getElementById("content").removeChild(document.getElementById("down"));
	document.getElementById("content").removeChild(document.getElementById("up"));
	document.getElementById("content").removeChild(document.getElementById("label-down"));
	document.getElementById("content").removeChild(document.getElementById("label-up"));
}

var archivo;
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
	extr1DeadTime: 218
};

function formatFile(str){
	var formatedStr = "";
	for(var i=0;i<str.length;i++){
		if("0x"+str.charCodeAt(i).toString(16)<15)
			formatedStr+="0";
		formatedStr += str.charCodeAt(i).toString(16)+" ";
	}
	return formatedStr;
}

function fileValues(){
	eeprom.stepsPermm = readHex(archivo,eprPos.stepsPermm,'f');
	eeprom.zMaxLength = readHex(archivo,eprPos.zMaxLength,'f');
	eeprom.diagonalRodLength = readHex(archivo,eprPos.diagonalRodLength,'f');
	eeprom.horizontalRodRadius = readHex(archivo,eprPos.horizontalRodRadius,'f');
	eeprom.maxPrintableRadius = readHex(archivo,eprPos.maxPrintableRadius,'f');
	eeprom.towerXendstop = readHex(archivo,eprPos.towerXendstop,'d');
	eeprom.towerYendstop = readHex(archivo,eprPos.towerYendstop,'d');
	eeprom.towerZendstop = readHex(archivo,eprPos.towerZendstop,'d');
	eeprom.corrDiagonalA = readHex(archivo,eprPos.corrDiagonalA,'f');
	eeprom.corrDiagonalB = readHex(archivo,eprPos.corrDiagonalB,'f');
	eeprom.corrDiagonalC = readHex(archivo,eprPos.corrDiagonalC,'f');
	eeprom.extr1DeadTime = readHex(archivo,eprPos.extr1DeadTime,'f');
}

//Lee un dato en hexadecimal
//Param1: vector donde se encuentra el dato
//Param2: posicion del primer byte
//Param3: tipo ('f'= float, 'd' = int, 'b' = byte)
function readHex(vector, pos, tipo){
	var num="";
	switch(tipo){
		case 'f':
			for(var i=pos+3 ; i>=pos ; i--)
				num += vector[i];
			num = parseFloat(htf(num));
		break;
		case 'd':
			for(var i=pos+1 ; i>=pos ; i--)
				num += vector[i];
			num = parseInt(num,16);
		break;
		case 'b':
			num += vector[pos];
			num = parseInt(num,16);
		break;
	}
	return num;
}

function htf(str) {
	var float = 0, sign, order, mantiss,exp,int = 0, multi = 1;

	int = parseInt(str,16);//Guarda el valor en base 16

	sign = (int>>>31)? -1 : 1; //Si el bit 31 está en 1 es negativo
	exp = (int >>> 23 & 0xff) - 127;//Separa la parte entera (exponente)
	mantiss = ((int & 0x7fffff) + 0x800000).toString(2);//Separa la parte decimal (mantisa)

	for (i=0; i<mantiss.length; i++){//Recorre bit a bit de la parte decimal
		float += parseInt(mantiss[i])? Math.pow(2,exp) : 0;//Si es un 1,
		exp--;
	}
	return (float*sign).toFixed(3);
}
