var posicion = {x:0,y:0,z:0};
var hommed = false;
var feedrate = 150;

function mover(eje, valor){
	if(!hommed){
		return;
	}
	if (eje == 'x'){
		posicion.x+=valor;
		posicion.x=Math.round(posicion.x*100)/100;
		document.getElementById("actualX").innerHTML = "X: "+posicion.x+"mm";
	}
	else if (eje == 'y'){
		posicion.y+=valor;
		posicion.y=Math.round(posicion.y*100)/100;
		document.getElementById("actualY").innerHTML = "Y: "+posicion.y+"mm";
	}
	else if (eje == 'z'){
		posicion.z+=valor;
		posicion.z=Math.round(posicion.z*100)/100;
		if(posicion.z<0)posicion.z=0;
		document.getElementById("actualZ").innerHTML = "Z: "+posicion.z+"mm";
	}
	sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);
}
function changeFeedrate(){
	feedrate = parseInt(document.getElementById("frSlider").value);
	document.getElementById("fr").innerHTML = "Velocidad: "+feedrate+"mm/s";
}
function home(){
	hommed = true;
	posicion.x = 0;
	posicion.y = 0;
	posicion.z = 0;
	document.getElementById("actualX").innerHTML = "X: "+posicion.x+"mm";
	document.getElementById("actualY").innerHTML = "Y: "+posicion.y+"mm";
	document.getElementById("actualZ").innerHTML = "Z: "+posicion.z+"mm";
	sendCmd("G28");
}
function sendCmdLine(){
	sendCmd(document.getElementById("cmdline").value.toString());
	document.getElementById("cmdline").value = "";
}

function enter(event){
	var x = event.which || event.keyCode;
	if(x == 13)sendCmdLine();
}

function exhibicion(){
	var angulo;
	var modulo;

	if(!loadEeprom())return;
	modulo=eeprom.maxPrintableRadius;

//Levanta 10mm
	posicion.z = 1;
//Circulo
	for(angulo=0;angulo<360;angulo++){
		posicion.x = modulo*Math.cos(angulo*Math.PI/180).toFixed(2);
		posicion.x = Math.round(posicion.x*100)/100;
		posicion.y = modulo*Math.sin(angulo*Math.PI/180).toFixed(2);
		posicion.y = Math.round(posicion.y*100)/100;
		sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);
	}
//Cuadrado
	for(angulo=45;angulo<=405;angulo+=90){
		posicion.x = modulo*Math.cos(angulo*Math.PI/180).toFixed(2);
		posicion.x = Math.round(posicion.x*100)/100;
		posicion.y = modulo*Math.sin(angulo*Math.PI/180).toFixed(2);
		posicion.y = Math.round(posicion.y*100)/100;
		sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);
	}
//Cubo
	posicion.z = modulo;
	posicion.x = modulo*Math.cos(135*Math.PI/180).toFixed(2);
	posicion.x = Math.round(posicion.x*100)/100;
	posicion.y = modulo*Math.sin(135*Math.PI/180).toFixed(2);
	posicion.y = Math.round(posicion.y*100)/100;
	sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);

	posicion.z = modulo;
	posicion.x = modulo*Math.cos(45*Math.PI/180).toFixed(2);
	posicion.x = Math.round(posicion.x*100)/100;
	posicion.y = modulo*Math.sin(45*Math.PI/180).toFixed(2);
	posicion.y = Math.round(posicion.y*100)/100;
	sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);

	posicion.z = 1;
	posicion.x = modulo*Math.cos(135*Math.PI/180).toFixed(2);
	posicion.x = Math.round(posicion.x*100)/100;
	posicion.y = modulo*Math.sin(135*Math.PI/180).toFixed(2);
	posicion.y = Math.round(posicion.y*100)/100;
	sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);

	posicion.z = modulo;
	posicion.x = modulo*Math.cos(225*Math.PI/180).toFixed(2);
	posicion.x = Math.round(posicion.x*100)/100;
	posicion.y = modulo*Math.sin(225*Math.PI/180).toFixed(2);
	posicion.y = Math.round(posicion.y*100)/100;
	sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);

	posicion.z = modulo;
	posicion.x = modulo*Math.cos(135*Math.PI/180).toFixed(2);
	posicion.x = Math.round(posicion.x*100)/100;
	posicion.y = modulo*Math.sin(135*Math.PI/180).toFixed(2);
	posicion.y = Math.round(posicion.y*100)/100;
	sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);

	posicion.z = 1;
	posicion.x = modulo*Math.cos(225*Math.PI/180).toFixed(2);
	posicion.x = Math.round(posicion.x*100)/100;
	posicion.y = modulo*Math.sin(225*Math.PI/180).toFixed(2);
	posicion.y = Math.round(posicion.y*100)/100;
	sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);

	posicion.z = modulo;
	posicion.x = modulo*Math.cos(315*Math.PI/180).toFixed(2);
	posicion.x = Math.round(posicion.x*100)/100;
	posicion.y = modulo*Math.sin(315*Math.PI/180).toFixed(2);
	posicion.y = Math.round(posicion.y*100)/100;
	sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);

	posicion.z = modulo;
	posicion.x = modulo*Math.cos(225*Math.PI/180).toFixed(2);
	posicion.x = Math.round(posicion.x*100)/100;
	posicion.y = modulo*Math.sin(225*Math.PI/180).toFixed(2);
	posicion.y = Math.round(posicion.y*100)/100;
	sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);

	posicion.z = 1;
	posicion.x = modulo*Math.cos(315*Math.PI/180).toFixed(2);
	posicion.x = Math.round(posicion.x*100)/100;
	posicion.y = modulo*Math.sin(315*Math.PI/180).toFixed(2);
	posicion.y = Math.round(posicion.y*100)/100;
	sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);

	posicion.z = modulo;
	posicion.x = modulo*Math.cos(45*Math.PI/180).toFixed(2);
	posicion.x = Math.round(posicion.x*100)/100;
	posicion.y = modulo*Math.sin(45*Math.PI/180).toFixed(2);
	posicion.y = Math.round(posicion.y*100)/100;
	sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);

	posicion.z = modulo;
	posicion.x = modulo*Math.cos(315*Math.PI/180).toFixed(2);
	posicion.x = Math.round(posicion.x*100)/100;
	posicion.y = modulo*Math.sin(315*Math.PI/180).toFixed(2);
	posicion.y = Math.round(posicion.y*100)/100;
	sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);

	posicion.z = 1;
	posicion.x = modulo*Math.cos(45*Math.PI/180).toFixed(2);
	posicion.x = Math.round(posicion.x*100)/100;
	posicion.y = modulo*Math.sin(45*Math.PI/180).toFixed(2);
	posicion.y = Math.round(posicion.y*100)/100;
	sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);

//Espiral CCW
	for(angulo=0;angulo<360;angulo++){
		posicion.x = modulo*Math.cos(angulo*Math.PI/180).toFixed(2);
		posicion.x = Math.round(posicion.x*100)/100;
		posicion.y = modulo*Math.sin(angulo*Math.PI/180).toFixed(2);
		posicion.y = Math.round(posicion.y*100)/100;
		posicion.z = angulo*modulo/360;
		posicion.z = Math.round(posicion.z*100)/100;
		sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);
	}
//Espiral CW
	for(angulo=359;angulo>=0;angulo--){
		posicion.x = modulo*Math.cos(angulo*Math.PI/180).toFixed(2);
		posicion.x = Math.round(posicion.x*100)/100;
		posicion.y = modulo*Math.sin(angulo*Math.PI/180).toFixed(2);
		posicion.y = Math.round(posicion.y*100)/100;
		posicion.z = angulo*modulo/360;
		posicion.z = Math.round(posicion.z*100)/100;
		sendCmd("G1 X"+posicion.x+" Y"+posicion.y+" Z"+posicion.z+" F"+feedrate*60);
	}
}