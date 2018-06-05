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
	var file = event.target;

	var reader = new FileReader();
	reader.onload = function(){
		var text = atob(reader.result);
	}
	reader.readAsText(file.files[0]);
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
			connection.send('!MWP9 ' + ssid);
			connection.send('!MWP10 ' + password);
		}
	}
}
function loadWifi(){
	if(connection.readyState){
		connection.send('!MWP2');
	}
}

if (!window.File || !window.FileReader) {
	document.getElementById("content").removeChild(document.getElementById("down"));
	document.getElementById("content").removeChild(document.getElementById("up"));
	document.getElementById("content").removeChild(document.getElementById("label-down"));
	document.getElementById("content").removeChild(document.getElementById("label-up"));
}
