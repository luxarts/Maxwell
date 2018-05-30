var posicion = {x:0,y:0,z:0};
var hommed = false;
feedrate = 150;

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
	var gcode = "";
	var x=0,y=0,z=0;

	if(!loadEeprom())return;
	modulo=eeprom.maxPrintableRadius-1;

	gcode += ";Modo exhibicion para impresoras Maxwell\n";
	gcode += ";Radio de impresion: "+modulo+"mm\n";
	gcode += ";Velocidad: "+feedrate+"mm/s\n";

//Home
	gcode += "G28\n";
//Levanta 10mm
	z = 1;
	gcode += "G1 Z"+z+" F"+feedrate*60+"\n";
//Circulo
	for(angulo=0;angulo<360;angulo+=0.5){
		x = modulo*Math.cos(angulo*Math.PI/180);
		y = modulo*Math.sin(angulo*Math.PI/180);
		x = x.toFixed(2);
		y = y.toFixed(2);
		//x = Math.round(x*100)/100;
		//y = Math.round(y*100)/100;
		gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";
	}
//Cuadrado
	for(angulo=45;angulo<=405;angulo+=90){
		x = modulo*Math.cos(angulo*Math.PI/180);
		y = modulo*Math.sin(angulo*Math.PI/180);
		x = x.toFixed(2);
		y = y.toFixed(2);
		//x = Math.round(x*100)/100;
		//y = Math.round(y*100)/100;
		gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";
	}
//Cubo
	z = modulo;
	x = modulo*Math.cos(135*Math.PI/180).toFixed(2);
	x = Math.round(x*100)/100;
	y = modulo*Math.sin(135*Math.PI/180).toFixed(2);
	y = Math.round(y*100)/100;
	gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";

	z = modulo;
	x = modulo*Math.cos(45*Math.PI/180).toFixed(2);
	x = Math.round(x*100)/100;
	y = modulo*Math.sin(45*Math.PI/180).toFixed(2);
	y = Math.round(y*100)/100;
	gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";

	z = 1;
	x = modulo*Math.cos(135*Math.PI/180).toFixed(2);
	x = Math.round(x*100)/100;
	y = modulo*Math.sin(135*Math.PI/180).toFixed(2);
	y = Math.round(y*100)/100;
	gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";

	z = modulo;
	x = modulo*Math.cos(225*Math.PI/180).toFixed(2);
	x = Math.round(x*100)/100;
	y = modulo*Math.sin(225*Math.PI/180).toFixed(2);
	y = Math.round(y*100)/100;
	gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";

	z = modulo;
	x = modulo*Math.cos(135*Math.PI/180).toFixed(2);
	x = Math.round(x*100)/100;
	y = modulo*Math.sin(135*Math.PI/180).toFixed(2);
	y = Math.round(y*100)/100;
	gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";

	z = 1;
	x = modulo*Math.cos(225*Math.PI/180).toFixed(2);
	x = Math.round(x*100)/100;
	y = modulo*Math.sin(225*Math.PI/180).toFixed(2);
	y = Math.round(y*100)/100;
	gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";

	z = modulo;
	x = modulo*Math.cos(315*Math.PI/180).toFixed(2);
	x = Math.round(x*100)/100;
	y = modulo*Math.sin(315*Math.PI/180).toFixed(2);
	y = Math.round(y*100)/100;
	gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";

	z = modulo;
	x = modulo*Math.cos(225*Math.PI/180).toFixed(2);
	x = Math.round(x*100)/100;
	y = modulo*Math.sin(225*Math.PI/180).toFixed(2);
	y = Math.round(y*100)/100;
	gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";

	z = 1;
	x = modulo*Math.cos(315*Math.PI/180).toFixed(2);
	x = Math.round(x*100)/100;
	y = modulo*Math.sin(315*Math.PI/180).toFixed(2);
	y = Math.round(y*100)/100;
	gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";

	z = modulo;
	x = modulo*Math.cos(45*Math.PI/180).toFixed(2);
	x = Math.round(x*100)/100;
	y = modulo*Math.sin(45*Math.PI/180).toFixed(2);
	y = Math.round(y*100)/100;
	gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";

	z = modulo;
	x = modulo*Math.cos(315*Math.PI/180).toFixed(2);
	x = Math.round(x*100)/100;
	y = modulo*Math.sin(315*Math.PI/180).toFixed(2);
	y = Math.round(y*100)/100;
	gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";

	z = 1;
	x = modulo*Math.cos(45*Math.PI/180).toFixed(2);
	x = Math.round(x*100)/100;
	y = modulo*Math.sin(45*Math.PI/180).toFixed(2);
	y = Math.round(y*100)/100;
	gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";

//Espiral CCW
	for(angulo=0;angulo<720;angulo+=0.5){
		x = modulo*Math.cos(angulo*Math.PI/180);
		y = modulo*Math.sin(angulo*Math.PI/180);
		x = x.toFixed(2);
		y = y.toFixed(2);
		z = angulo*120/720;
		z = Math.round(z*100)/100;
		gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";
	}
//Espiral CW
	for(angulo=719;angulo>=0;angulo-=0.5){
		x = modulo*Math.cos(angulo*Math.PI/180);
		y = modulo*Math.sin(angulo*Math.PI/180);
		x = x.toFixed(2);
		y = y.toFixed(2);
		z = angulo*120/720;
		z = Math.round(z*100)/100;
		gcode += "G1 X"+x+" Y"+y+" Z"+z+"\n";
	}
//Descarga el script
	var element = document.createElement('a');
	element.setAttribute('href','data:text/plain;charset=utf-8,'+encodeURIComponent(gcode));
	element.setAttribute('download','exhibicion.gcode');
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}