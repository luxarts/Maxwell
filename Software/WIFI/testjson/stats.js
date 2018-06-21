function Get(yourUrl){
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.open("GET",yourUrl,false);
	Httpreq.send(null);
	return Httpreq.responseText;          
}

function handleSubir(event){
	var file = event.target.files[0];

	var reader = new FileReader();
	reader.onload = function(){
		stats = JSON.parse(reader.result);
		console.log("Archivo "+file.name+" cargado.");
		console.log(stats);
		updateList();
	}
	if(file)reader.readAsBinaryString(file);
}

function handleDescargar(){
	if(stats == undefined){
		return;
	}
	var jsonStr = JSON.stringify(stats);
	//var bytes = new Uint8Array(jsonStr.length);
	
	var blob=new Blob([jsonStr], {type: "application/json"});
	var link=document.createElement('a');
	link.href=window.URL.createObjectURL(blob);
	link.download="stats.json";
	link.click();
}

function agregarFilamento(){
	if(stats == undefined)return;

	var nombre = document.getElementById("newNombre").value;
	var peso = document.getElementById("newPeso").value;
	var precio = document.getElementById("newPrecio").value;
	var temperatura = document.getElementById("newTemperatura").value;
	
	var o = {
		"nombre":nombre.toString(), 
		"peso": parseFloat(peso), 
		"precio": parseFloat(precio),
		"temperatura": parseFloat(temperatura),
		"usado": 0
	};
	stats.filamentos.push(o);
	updateList();
}

function eliminarFilamento(){
	if(stats.filamentos.length<1)return;
	var filNumber = document.getElementById("filamentos").value;
	stats.filamentos.splice(filNumber, 1);
	updateList();
}
var stats;// = JSON.parse(Get("stats.json"));

function updateList(){
	var select = document.getElementById("filamentos");

	for(var i=select.options.length-1 ; i>=0 ; i--){
		select.remove(i);
	}

	for(var i=0 ; i<stats.filamentos.length ; i++){
		var element = document.createElement('option');
		element.setAttribute("value", i);
		element.innerHTML = stats.filamentos[i].nombre;
		select.appendChild(element);
	}
	changeSelect();
}

function changeSelect(){
	if(stats.filamentos.length<1){
		document.getElementById("peso").innerHTML = 0+" gr";
		document.getElementById("precio").innerHTML = "$"+0;
		document.getElementById("temperatura").innerHTML = 0+"º C";
		document.getElementById("usado").innerHTML = 0+"m";
		return;
	}
	var selected = parseInt(document.getElementById("filamentos").value);
	var statsElement = stats.filamentos[selected];
	document.getElementById("peso").innerHTML = statsElement.peso+" gr";
	document.getElementById("precio").innerHTML = "$"+statsElement.precio;
	document.getElementById("temperatura").innerHTML = statsElement.temperatura+"º C";
	document.getElementById("usado").innerHTML = statsElement.usado/1000+"m";
}