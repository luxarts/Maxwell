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
	document.getElementById("deltaradiusa").value = eeprom.deltaRadiusA;
	document.getElementById("deltaradiusb").value = eeprom.deltaRadiusB;
	document.getElementById("deltaradiusc").value = eeprom.deltaRadiusC;
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
	eepromNew.deltaRadiusA = document.getElementById("deltaradiusa").value;
	eepromNew.deltaRadiusB = document.getElementById("deltaradiusb").value;
	eepromNew.deltaRadiusC = document.getElementById("deltaradiusc").value;
}
function handleCargar(){
	loadEeprom();
	loadWifi();
	showValues();
	showMsg("Configuracion cargada.");
}


function handleGuardar(){
	updateValues();
	saveEeprom();
	saveWifi();
	showMsg("Configuración guardada");
}
function handleSubir(event){
	var file = event.target.files[0];

	var reader = new FileReader();
	reader.onload = function(){
		archivo = formatFile(reader.result).split(" ");
		fileValues();
		showValues();
		showMsg("Archivo cargado. ("+file.name+")");
		console.log(file.name);
	}
	if(file)reader.readAsBinaryString(file);
}
function handleDescargar(){
	if(archivo == undefined){
		showMsg("Primero debe subir un archivo.");
		return;
	}
	saveFile();
	var bytes = new Uint8Array(archivo.length);

	for (var i in archivo){
		bytes[i] = parseInt(archivo[i], 16);
	}
	
	var blob=new Blob([bytes], {type: "application/octet-stream"});
	var link=document.createElement('a');
	link.href=window.URL.createObjectURL(blob);
	link.download="config.bin";
	link.click();
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
	extr1DeadTime: 218,
	deltaRadiusA: 901,
	deltaRadiusB: 905,
	deltaRadiusC: 909,
	filamentPrinted: 129,
	printerActive: 125
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
	eeprom.towerXendstop = readHex(archivo,eprPos.towerXendstop,'i');
	eeprom.towerYendstop = readHex(archivo,eprPos.towerYendstop,'i');
	eeprom.towerZendstop = readHex(archivo,eprPos.towerZendstop,'i');
	eeprom.corrDiagonalA = readHex(archivo,eprPos.corrDiagonalA,'f');
	eeprom.corrDiagonalB = readHex(archivo,eprPos.corrDiagonalB,'f');
	eeprom.corrDiagonalC = readHex(archivo,eprPos.corrDiagonalC,'f');
	eeprom.extr1DeadTime = readHex(archivo,eprPos.extr1DeadTime,'f');
	eeprom.deltaRadiusA = readHex(archivo,eprPos.deltaRadiusA,'f');
	eeprom.deltaRadiusB = readHex(archivo,eprPos.deltaRadiusB,'f');
	eeprom.deltaRadiusC = readHex(archivo,eprPos.deltaRadiusC,'f');
	eeprom.filamentPrinted = readHex(archivo,eprPos.filamentPrinted,'f');
	eeprom.printerActive = readHex(archivo,eprPos.printerActive,'d');
}

//Lee un dato en hexadecimal
//Param1: vector donde se encuentra el dato
//Param2: posicion del primer byte
//Param3: tipo ('f'= float (32 bits), 'i' = int (16 bits), 'd'= double (32 bits), 'b' = byte (8 bits))
function readHex(vector, pos, tipo){
	var num="";
	switch(tipo){
		case 'f':
			for(var i=pos+3 ; i>=pos ; i--)
				num += vector[i];
			num = parseFloat(htf(num));
		break;
		case 'i':
			for(var i=pos+1 ; i>=pos ; i--)
				num += vector[i];
			num = parseInt(num,16);
		break;
		case 'd':
			for(var i=pos+3 ; i>=pos ; i--)
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

function fth(num){
	const getHex = i => ('00' + i.toString(16)).slice(-2);

	var view = new DataView(new ArrayBuffer(4)),result;

	view.setFloat32(0, num);

	result = Array
		.apply(null, { length: 4 })
		.map((_, i) => getHex(view.getUint8(i)))
		.join('');

	return result;
}
//Set the parameter in HEX format(number) and put it in the specified position(pos).
//You must specify the type of the value in the third parameter with 'f', 'i', 'd', or 'b' for float, integer, double or byte.
function saveHex(numero, pos, tipo){
	switch(tipo){
		case 'f':
			vector = formatToEeprom(fth(numero));
			vector = vector.split(' ');
			for(var i=0 ; i<=3 ; i++)
				archivo[pos+i] = vector[i];
		break;
		case 'i':
			vector = formatToEeprom(parseInt(numero).toString(16));
			vector = vector.split(' ');
			for(var i=0 ; i<=1 ; i++)
				archivo[pos+i] = vector[i];
		break;
		case 'd':
			vector = formatToEeprom(parseInt(numero).toString(16));
			vector = vector.split(' ');
			for(var i=0 ; i<=3 ; i++)
				archivo[pos+i] = vector[i];
		break;
		case 'b':
			vector = parseInt(numero).toString(16);
			archivo[pos] = vector;
		break;
	}
}

//Cambia el órden de los bytes y los separa con un espacio
function formatToEeprom(string){
	var result = [];
	if(string.length%2 > 0){
		string += "0";
	}

	var len = string.length - 2;

	while (len >= 0) {
		result.push(string.substr(len, 2));
		len -= 2;
	}
	return result.join(' ');
}

function saveFile(){
	updateValues();
	saveHex(eepromNew.stepsPermm, eprPos.stepsPermm, 'f');
	saveHex(eepromNew.zMaxLength, eprPos.zMaxLength, 'f');
	saveHex(eepromNew.diagonalRodLength, eprPos.diagonalRodLength, 'f');
	saveHex(eepromNew.horizontalRodRadius, eprPos.horizontalRodRadius, 'f');
	saveHex(eepromNew.maxPrintableRadius, eprPos.maxPrintableRadius, 'f');
	saveHex(eepromNew.towerXendstop, eprPos.towerXendstop, 'i');
	saveHex(eepromNew.towerYendstop, eprPos.towerYendstop, 'i');
	saveHex(eepromNew.towerZendstop, eprPos.towerZendstop, 'i');
	saveHex(eepromNew.corrDiagonalA, eprPos.corrDiagonalA, 'f');
	saveHex(eepromNew.corrDiagonalB, eprPos.corrDiagonalB, 'f');
	saveHex(eepromNew.corrDiagonalC, eprPos.corrDiagonalC, 'f');
	saveHex(eepromNew.extr1DeadTime, eprPos.extr1DeadTime, 'f');
	saveHex(eepromNew.deltaRadiusA, eprPos.deltaRadiusA, 'f');
	saveHex(eepromNew.deltaRadiusB, eprPos.deltaRadiusB, 'f');
	saveHex(eepromNew.deltaRadiusC, eprPos.deltaRadiusC, 'f');
	saveHex(eepromNew.filamentPrinted, eprPos.filamentPrinted, 'f');
	saveHex(eepromNew.printerActive, eprPos.printerActive, 'd');
}