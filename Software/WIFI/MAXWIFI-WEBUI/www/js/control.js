document.getElementById("sendCtrlCmd").addEventListener("click", function(){
	sendCmd(document.getElementById("cmdLine").value);
	document.getElementById("cmdLine").value = "";
	document.getElementById("sendCtrlCmd").classList.add("disabled");
});

document.getElementById("cmdLine").addEventListener("keyup", function(){
	if(event.key == "Enter"){
		sendCmd(document.getElementById("cmdLine").value);
		document.getElementById("cmdLine").value = "";
		document.getElementById("sendCtrlCmd").classList.add("disabled");
	}
	else{
		if(document.getElementById("cmdLine").value != ""){
			document.getElementById("sendCtrlCmd").classList.remove("disabled");
		}
		else{
			document.getElementById("sendCtrlCmd").classList.add("disabled");
		}
	}
});

function changeMoveValue(axis, newValue){
	if(axis == "X" || axis == "Y"){
		document.getElementById("moveValueXY").innerHTML = newValue;
	}
	else if(axis == "Z"){
		document.getElementById("moveValueZ").innerHTML = newValue;
	}
	
}
function sendMove(axis, amount){
	sendCmd("G91");//Relative
	sendCmd("G0 "+axis+amount);
	sendCmd("G92");//Absolute
}
function toggleLights(){
	if(printerStatus.caselight == 0){
		sendCmd("m355 s255");
		printerStatus.caselight = 1;
	}
	else{
		sendCmd("m355 s0");
		printerStatus.caselight = 0;
	}
}