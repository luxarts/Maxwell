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