function showValues(){
	document.getElementById("stepspermm").value = eeprom.stepsPermm;
	document.getElementById("zmaxlength").value = eeprom.zMaxLength;
	document.getElementById("diagonalrodlength").value = eeprom.diagonalRodLength;
	document.getElementById("horizontalrodradius").value = eeprom.horizontalRodRadius;
	document.getElementById("maxprintableradius").value = eeprom.maxPrintableRadius;
	document.getElementById("towerxendstop").value = eeprom.towerXendstop;
	document.getElementById("toweryendstop").value = eeprom.towerYendstop;
	document.getElementById("towerzendstop").value = eeprom.towerZendstop;
}
function updateValues(){
	eepromNew.stepsPermm = document.getElementById("stepspermm").value ;
	eepromNew.zMaxLength = document.getElementById("zmaxlength").value;
	eepromNew.diagonalRodLength = document.getElementById("diagonalrodlength").value;
	eepromNew.horizontalRodRadius = document.getElementById("horizontalrodradius").value;
	eepromNew.maxPrintableRadius = document.getElementById("maxprintableradius").value ;
	eepromNew.towerXendstop = document.getElementById("towerxendstop").value;
	eepromNew.towerYendstop = document.getElementById("toweryendstop").value;
	eepromNew.towerZendstop = document.getElementById("towerzendstop").value;
}
function handleCargar(){
	loadEeprom();
	showValues();
	document.getElementById("msg").innerHTML = "Configuracion cargada";
}
function handleGuardar(){
	updateValues();
	saveEeprom();
	document.getElementById("msg").innerHTML = "Configuracion guardada";
}