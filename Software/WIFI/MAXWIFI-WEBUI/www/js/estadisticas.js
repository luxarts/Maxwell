var gcodeProcessorWorker = new Worker('js/gcodeProcessor.js');
var gcodeLines = undefined;

var currentSettings = {
	"absoluteExtrusion": false,
	"feedrateMultiplyer": 100,
	"filamentDiameter": 1.75,
	"firmwareRetractLength":0,
	"firmwareRetractSpeed":0,
	"firmwareRetractZhop":0,
	"firmwareUnretractLength":0,
	"firmwareUnretractSpeed":0,
	"lookAheadBuffer": 64,
	"maxJerk": [25, 25, 25, 20], //XYZ, E
	"maxPrintAcceleration": [2000, 2000, 2000, 100], //XYZ, E 
	"maxSpeed": [200, 200, 200, 60], //XYZ, E
	"maxTravelAcceleration": [4000, 4000, 4000, 100],
	"timeScale": 1.01,
	"fileName": "",
	"fileSize": "",
	"kwhPrice": 1.998, //Precio del KWh
	"spoolWeight": 0, //Peso del rollo en gramos
	"spoolPrice": 0,  //Precio del rollo
	"spoolDensity": 0, //Densidad del material
	"insumos": 0,
	"watts": 330 //Consumo de la maquina
}
var userData = {
	kwh: 0,
	filamentos: [],
	insumos: []
}
var results;

window.onload = function(){
	cargarUserData();
}

gcodeProcessorWorker.onmessage = function (e) {
	if ("progress" in e.data) {
		setProgressBarPercent(e.data.progress);
	} else if ("result" in e.data) {
		results = e.data.result;
		showResults();
		document.getElementById("progress").style = "display:none;";
		document.getElementById("fileInput").style = "display:block;";
		document.getElementById("resultadosRow").style = "display:block;";
	}
}

function readFile(e){
	var f = e.target.files[0];

	if(f){
		if(f.name.endsWith(".gcode") || f.name.endsWith(".gco") || f.name.endsWith(".g")){
			var size;
			if(f.size / 1024 / 1024 < 1){
				currentSettings["fileSize"] = (f.size / 1024).toFixed(1) + " KB";
			}
			else{
				currentSettings["fileSize"] = (f.size / 1024 / 1024).toFixed(1) + " MB";
			}
			currentSettings["fileName"] = f.name;
			var r = new FileReader();
			r.onload = function (e){
				gcodeLines = e.target.result.split(/\s*[\r\n]+\s*/g);
				calculateGcode();
			}
			r.readAsText(f);
		}
		else{
			M.toast({html: '<i class="mwicons left small red-text">report</i>El archivo no es válido'});
		}
	}
}
function calculateGcode() {
	if (gcodeLines != undefined) {
		setProgressBarPercent(0);
		document.getElementById("progress").style = "display:inline-block;";
		document.getElementById("fileInput").style = "display:none;";
		document.getElementById("resultadosRow").style = "display:none;";
		gcodeProcessorWorker.postMessage([gcodeLines, currentSettings]);
	}
}

function setProgressBarPercent(val){
	document.getElementById("progressBar").style = "width: " + val + "%;";
}

function showResults(){
	if(results == undefined)return;
	//Tiempos
	document.getElementById("accelerationTime").innerHTML = results["accelerationTime"];
	document.getElementById("constantSpeedTime").innerHTML = results["constantSpeedTime"];
	document.getElementById("retractTime").innerHTML = results["retractTime"];
	document.getElementById("printTime").innerHTML = results["printTime"];
	//Velocidades
	document.getElementById("averageSpeed").innerHTML = results["averageSpeed"];
	document.getElementById("printSpeed").innerHTML = results["printSpeed"];
	document.getElementById("travelSpeed").innerHTML = results["travelSpeed"];
	document.getElementById("xyFeedrate").innerHTML = results["xyFeedrate"];
	//Distancias
	document.getElementById("accelerationDistance").innerHTML = results["accelerationDistance"];
	document.getElementById("constantSpeedDistance").innerHTML = results["constantSpeedDistance"];
	document.getElementById("printDistance").innerHTML = results["printDistance"];
	document.getElementById("totalDistance").innerHTML = results["totalDistance"];
	
	//Costos
	var horas = results["printTime"].split(':').reverse().reduce((prev, curr, i) => prev + curr*Math.pow(60,i),0);
	horas = horas/60/60;
	var costoEnergia = Math.round(currentSettings.watts/1000*horas*currentSettings.kwhPrice *100)/100;
	document.getElementById("costoEnergia").innerHTML = "$"+costoEnergia;
	//masa = densidad * pi * radio^2 * longitud
	//Densidad = gr/cm3
	//Longitud = metros
	var masa = currentSettings.spoolDensity * 0.024052818754046853 * parseFloat(results["filamentUsage"])*100; //0.024052818754046853 = diametro 1.75mm
	var costoMaterial = Math.round((masa * currentSettings.spoolPrice / currentSettings.spoolWeight)*100)/100;
	masa = Math.round(masa*100)/100;
	document.getElementById("costoMaterial").innerHTML = "$"+costoMaterial +" ("+results["filamentUsage"]+" - "+masa+"gr)"; 
	document.getElementById("costoInsumos").innerHTML = "$"+currentSettings.insumos;
	document.getElementById("costoTotal").innerHTML = "$"+Math.round((parseFloat(costoEnergia) + parseFloat(costoMaterial) + parseFloat(currentSettings.insumos))*100)/100;
}

function addFilament(){
	var marca = document.getElementById("filaMarca").value;
	var material = document.getElementById("filaMaterial").value.toUpperCase();
	var densidad = parseFloat(document.getElementById("filaDensidad").value);
	var peso = parseFloat(document.getElementById("filaPeso").value);
	var precio = parseFloat(document.getElementById("filaPrecio").value);

	var newopt = document.createElement("option");
	newopt.setAttribute("value", userData.filamentos.length);
	newopt.innerHTML = marca + " (" + material + ")";
	document.getElementById("filamentos").appendChild(newopt);
	document.getElementById("filamentos").value = userData.filamentos.length;
	var elems = document.querySelectorAll('select');
	var instances = M.FormSelect.init(elems);

	userData.filamentos.push({"marca": marca, "material": material, "densidad": densidad, "precio": precio, "peso": peso});
	localStorage.setItem("mw3dstats", JSON.stringify(userData));
	updateDOMFilament();
}

function updateDOMFilament(){
	if(document.getElementById("filamentos").value == "add"){
		document.getElementById("addedit_icon").innerHTML = "add";
		document.getElementById("deleteFilament").style.display = "none";
		document.getElementById("addedit_btn").innerHTML = "Agregar";
		document.getElementById("addedit_btn").setAttribute("onclick", "addFilament()");

		document.getElementById("filaMarca").value = "";
		document.getElementById("filaMaterial").value = "PLA";
		document.getElementById("filaDensidad").value = "1.24";
		document.getElementById("filaPeso").value = "1000";
		document.getElementById("filaPrecio").value = "";
	}
	else{
		document.getElementById("addedit_icon").innerHTML = "edit";
		document.getElementById("deleteFilament").style.display = "inline-block";
		document.getElementById("addedit_btn").innerHTML = "Guardar";
		document.getElementById("addedit_btn").setAttribute("onclick", "updateFilament()");

		var filamento = userData.filamentos[parseInt(document.getElementById("filamentos").value)];
		document.getElementById("filaMarca").value = filamento.marca;
		document.getElementById("filaMaterial").value = filamento.material;
		document.getElementById("filaDensidad").value = filamento.densidad;
		document.getElementById("filaPeso").value = filamento.peso;
		document.getElementById("filaPrecio").value = filamento.precio;

		currentSettings.spoolWeight = filamento.peso;
		currentSettings.spoolPrice = filamento.precio;
		currentSettings.spoolDensity = filamento.densidad;
		M.updateTextFields();
		showResults();
	}
}

function updateFilament(){
	var marca = document.getElementById("filaMarca").value;
	var material = document.getElementById("filaMaterial").value.toUpperCase();
	var densidad = parseFloat(document.getElementById("filaDensidad").value);
	var peso = parseFloat(document.getElementById("filaPeso").value);
	var precio = parseFloat(document.getElementById("filaPrecio").value);

	var id = parseInt(document.getElementById("filamentos").value);
	var filamento = userData.filamentos[id];
	filamento.marca = marca;
	filamento.material = material;
	filamento.densidad = densidad;
	filamento.peso = peso;
	filamento.precio = precio;

	var options = document.getElementById("filamentos").getElementsByTagName("option");
	for (var i = 0 ; i < options.length; i++) {
		if(options[i].value == id){
			options[i].innerHTML = marca + " (" + material + ")";
			break;
		}
	}
	var elems = document.querySelectorAll('select');
	var instances = M.FormSelect.init(elems);
	localStorage.setItem("mw3dstats", JSON.stringify(userData));
	updateDOMFilament();
}

function deleteFilament(){
	var domselect = document.getElementById("filamentos");
	var selected = domselect.value;

	if(selected != "add"){
		selected = parseInt(selected);
		userData.filamentos.splice(selected, 1); //Elimina el elemento del array
		domselect.removeChild(domselect.childNodes[selected+3]); //Elimina el elemento del DOM		
		for (var i = selected+1 ; i < domselect.childNodes.length-3; i++) { //Reacomoda el DOM
			domselect.childNodes[i].setAttribute("value", i-1);
		}
		if(selected>0)
			domselect.value = selected-1;
		else
			domselect.value = "add";

		var elems = document.querySelectorAll('select');
		var instances = M.FormSelect.init(elems);
		localStorage.setItem("mw3dstats", JSON.stringify(userData));
		updateDOMFilament();
	}
}

function cargarUserData(){
	var storedUserData = localStorage.getItem("mw3dstats");

	if(storedUserData == null)return;
	userData = JSON.parse(storedUserData);
	for(var i=0 ; i < userData.filamentos.length ; i++){
		var newopt = document.createElement("option");
		newopt.setAttribute("value", i);
		newopt.innerHTML = userData.filamentos[i].marca + " (" + userData.filamentos[i].material + ")";
		document.getElementById("filamentos").appendChild(newopt);
	}
	var elems = document.querySelectorAll('select');
	var instances = M.FormSelect.init(elems);
}