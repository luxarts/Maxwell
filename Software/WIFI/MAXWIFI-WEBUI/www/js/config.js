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
function saveDOMValues(){
	for(var key in eeprom){//Recorre todos los objetos
		if(eeprom.hasOwnProperty(key)){
			var element = document.getElementById(key);
			if(typeof(element) != 'undefined' && element != null){
				if(element.value != ""){
					if(eeprom[key].type == 3)eeprom[key].value = parseFloat(element.value);
					else eeprom[key].value = parseInt(element.value);
					element.classList.remove("valid");
				}
			}
		}
	}
	guardarEeprom();
}
function dataChange(element){
	element.classList.add("valid");
}
var config_i;
window.addEventListener("load", function(){
	clearInterval(json_i);
	config_i = setInterval(configHandler, 500);
});

function configHandler(){
	if(eepromLoaded){
		loadDOMValues();
		document.getElementById("configTable").style.display = "block";
		document.getElementById("configLoading").style.display = "none";
		clearInterval(config_i);
	}
}