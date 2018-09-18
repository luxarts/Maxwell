var gcodeProcessorWorker = new Worker('gcodeProcessor.js');
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
	"fileSize": ""
}

var loadEepromSettings_i = setInterval(loadEepromSettings, 500);
function loadEepromSettings(){
	if(eepromLoaded){
		currentSettings.maxJerk[0] = eeprom.jerk;
		currentSettings.maxJerk[1] = eeprom.jerk;
		currentSettings.maxJerk[2] = eeprom.jerk;
		currentSettings.maxPrintAcceleration[0] = eeprom.acceleration;
		currentSettings.maxPrintAcceleration[1] = eeprom.acceleration;
		currentSettings.maxPrintAcceleration[2] = eeprom.acceleration;
		currentSettings.maxSpeed[0] = eeprom.maxFeedrate;
		currentSettings.maxSpeed[1] = eeprom.maxFeedrate;
		currentSettings.maxSpeed[2] = eeprom.maxFeedrate;
		currentSettings.maxTravelAcceleration[0] = eeprom.travelAcceleration;
		currentSettings.maxTravelAcceleration[1] = eeprom.travelAcceleration;
		currentSettings.maxTravelAcceleration[2] = eeprom.travelAcceleration;
		clearInterval(loadEepromSettings_i);
	}
}

gcodeProcessorWorker.onmessage = function (e) {
	if ("progress" in e.data) {
		setProgressBarPercent(e.data.progress);
	} else if ("result" in e.data) {
		showResults(e.data.result);
		document.getElementById("progress").style = "display:none;";
		document.getElementById("calcular").style = "display:block;";
	}
}

function readFile(e){
	var f = e.target.files[0];

	if(f){
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
			//refreshStatistics();
		}
		r.readAsText(f);
	}
}

function refreshStatistics() {
	if (gcodeLines != undefined) {
		displayProgressBar();
		gcodeProcessorWorker.postMessage([gcodeLines, currentSettings]);
	}
}

function setProgressBarPercent(val){
	document.getElementById("progressBar").style = "width: " + val + "%;";
	document.getElementById("progressBar").innerHTML = val + "%";
}

function displayProgressBar() {
	setProgressBarPercent(0);
	document.getElementById("progress").style = "display:block;";
	document.getElementById("calcular").style = "display:none;";
}

function showResults(data){
	console.log(data);

	document.getElementById("panel-head").innerHTML = "Resultados para '" + currentSettings["fileName"] + "' ("+currentSettings["fileSize"]+")";
	document.getElementById("printTime").innerHTML = data["printTime"];
	document.getElementById("constantSpeedTime").innerHTML = data["constantSpeedTime"];
	document.getElementById("accelerationTime").innerHTML = data["accelerationTime"];
	document.getElementById("retractTime").innerHTML = data["retractTime"];

	document.getElementById("averageSpeed").innerHTML = data["averageSpeed"];
	document.getElementById("printSpeed").innerHTML = data["printSpeed"];
	document.getElementById("travelSpeed").innerHTML = data["travelSpeed"];
	document.getElementById("xyFeedrate").innerHTML = data["xyFeedrate"];

	document.getElementById("panel-resultados").style = "display:block;";
}