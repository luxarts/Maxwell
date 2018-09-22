var loadDOMValues_i = window.setInterval(function(){
	if(eepromLoaded){
		loadDOMValues();
		document.getElementById("configTable").style.display = "block";
		document.getElementById("configLoading").style.display = "none";
		clearInterval(loadDOMValues_i);
	}
}, 1000);

function togglePswd(){
	var domPswd = document.getElementById("wifipswd");
	var domIcon = document.getElementById("pswdIcon");
	if(domPswd.type == "password"){
		domPswd.type = "text";
		domIcon.innerHTML = "visibility";
		domIcon.classList.remove("hiddenPswd");
		domIcon.classList.add("showedPswd");
	}
	else{
		domPswd.type = "password";
		domIcon.innerHTML = "visibility_off";
		domIcon.classList.remove("showedPswd");
		domIcon.classList.add("hiddenPswd");
	} 
}

function loadDOMValues(){
	for(var key in eeprom){//Recorre todos los objetos
		if(eeprom.hasOwnProperty(key)){
			var element = document.getElementById(key);
			if(typeof(element) != 'undefined' && element != null){
				element.value = eeprom[key].value;
			}
		}
	}
}

function testLoadEeprom(){
	var x = "EPR:3 11 80.0000 Steps per mm";
	eepromCheck(x);
}