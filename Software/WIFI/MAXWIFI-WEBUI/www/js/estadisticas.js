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
	"maxJerk": [27, 27, 27, 20], //XYZ, E
	"maxPrintAcceleration": [2000, 2000, 2000, 100], //XYZ, E 
	"maxSpeed": [200, 200, 200, 60], //XYZ, E
	"maxTravelAcceleration": [3000, 3000, 3000, 100],
	"timeScale": 1.01,
	"fileName": "",
	"fileSize": "",
	"kwh": 1.998, //Precio del KWh
	"spoolWeight": 750, //Peso del rollo en gramos
	"spoolPrice": 358,  //Precio del rollo
	"insumos": 0
}

gcodeProcessorWorker.onmessage = function (e) {
	if ("progress" in e.data) {
		setProgressBarPercent(e.data.progress);
	} else if ("result" in e.data) {
		showResults(e.data.result);
		document.getElementById("progress").style = "display:none;";
		document.getElementById("calcularBtn").style = "display:inline-block;";
		document.getElementById("fileInput").style = "display:block;";
		document.getElementById("resultadosRow").style = "display:block;";
	}
}

function readFile(e){
	var f = e.target.files[0];

	if(f){
		if(f.name.endsWith(".gcode") || f.name.endsWith(".gco") || f.name.endsWith(".g")){
			console.log("valido: "+f.name);
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
				refreshStatistics();
			}
			r.readAsText(f);
		}
		else{
			console.log("invalido");
			M.toast({html: '<i class="mwicons left small red-text">report</i>El archivo no es válido'});
		}
	}
}
function refreshStatistics() {
	if (gcodeLines != undefined) {
		setProgressBarPercent(0);
		document.getElementById("progress").style = "display:inline-block;";
		document.getElementById("calcularBtn").style = "display:none;";
		document.getElementById("fileInput").style = "display:none;";
		document.getElementById("resultadosRow").style = "display:none;";
		gcodeProcessorWorker.postMessage([gcodeLines, currentSettings]);
	}
}

function setProgressBarPercent(val){
	document.getElementById("progressBar").style = "width: " + val + "%;";
}

function showResults(data){
	console.log(data);
	//Tiempos
	document.getElementById("accelerationTime").innerHTML = data["accelerationTime"];
	document.getElementById("constantSpeedTime").innerHTML = data["constantSpeedTime"];
	document.getElementById("retractTime").innerHTML = data["retractTime"];
	document.getElementById("printTime").innerHTML = data["printTime"];
	//Velocidades
	document.getElementById("averageSpeed").innerHTML = data["averageSpeed"];
	document.getElementById("printSpeed").innerHTML = data["printSpeed"];
	document.getElementById("travelSpeed").innerHTML = data["travelSpeed"];
	document.getElementById("xyFeedrate").innerHTML = data["xyFeedrate"];
	//Distancias
	document.getElementById("accelerationDistance").innerHTML = data["accelerationDistance"];
	document.getElementById("constantSpeedDistance").innerHTML = data["constantSpeedDistance"];
	document.getElementById("printDistance").innerHTML = data["printDistance"];
	document.getElementById("totalDistance").innerHTML = data["totalDistance"];
	
	//Costos
	var horas = data["printTime"].split(':').reverse().reduce((prev, curr, i) => prev + curr*Math.pow(60,i),0);
	horas = horas/60/60;
	var costoEnergia = Math.round(horas*currentSettings.kwh *100)/100;
	document.getElementById("costoEnergia").innerHTML = "$"+costoEnergia;
	//masa = densidad * pi * radio^2 * longitud
	var masa = 1.24 * Math.PI * 0.00765625 * parseFloat(data["filamentUsage"])*10 //0.00765625 = diametro 1.75mm
	var costoMaterial = Math.round((masa * currentSettings.spoolPrice / currentSettings.spoolWeight)*100)/100;
	document.getElementById("costoMaterial").innerHTML = "$"+costoMaterial +" ("+data["filamentUsage"]+")"; 
	document.getElementById("costoInsumos").innerHTML = "$"+currentSettings.insumos;
	document.getElementById("costoTotal").innerHTML = "$"+(parseFloat(costoEnergia) + parseFloat(costoMaterial) + parseFloat(currentSettings.insumos));
}