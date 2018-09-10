var userData = {
	kwh: 0,
	filamentos: []
}
var stats;

window.onload = function(){
	stats = new Stats();
	stats.cargar();
}

Stats = function(){}

Stats.prototype.guardar = function(){
	localStorage.setItem("Presupuesto3Dud", JSON.stringify(userData));
}

Stats.prototype.cargar = function(){
	var storedUserData = localStorage.getItem("Presupuesto3Dud");

	if(storedUserData == null)return;
	userData = JSON.parse(storedUserData);
	for(var i=0 ; i < userData.filamentos.length ; i++){
		var newopt = document.createElement("option");
		newopt.setAttribute("value", i);
		newopt.innerHTML = userData.filamentos[i].marca + " (" + userData.filamentos[i].tipo + " - " + userData.filamentos[i].diametro + "mm)";
		document.getElementById("filaSeleccionado").appendChild(newopt);
	}
}
Stats.prototype.reestablecer = function(){
	localStorage.clear();
}
Stats.prototype.cambiarFilamento = function(id){
	if(id == "nuevo"){
		document.getElementById("filaMarca").value = "";
		document.getElementById("filaTipo").value = "";
		document.getElementById("filaPrecio").value = "";
		document.getElementById("filaPeso").value = 1000;
		document.getElementById("filaDiametro").value = 1.75;
		document.getElementById("addedit").setAttribute("onclick", "stats.agregarFilamento()");
		document.getElementById("addedit").setAttribute("value", "Agregar");
		document.getElementById("eliminar").style.visibility = "hidden";
	}
	else{
		id = parseInt(id);
		document.getElementById("filaMarca").value = userData.filamentos[id].marca;
		document.getElementById("filaTipo").value = userData.filamentos[id].tipo;
		document.getElementById("filaPrecio").value = userData.filamentos[id].precio;
		document.getElementById("filaPeso").value = userData.filamentos[id].peso;
		document.getElementById("filaDiametro").value = userData.filamentos[id].diametro;
		document.getElementById("addedit").setAttribute("onclick", "stats.actualizarFilamento()");
		document.getElementById("addedit").setAttribute("value", "Actualizar");
		document.getElementById("eliminar").style.visibility = "visible";
	}
}
Stats.prototype.agregarFilamento = function(){
	if(document.getElementById("filaSeleccionado").value == "nuevo"){
		var marca = document.getElementById("filaMarca").value;
		var tipo = document.getElementById("filaTipo").value.toUpperCase();
		var precio = document.getElementById("filaPrecio").value;
		var peso = document.getElementById("filaPeso").value;
		var diametro = document.getElementById("filaDiametro").value;

		var newopt = document.createElement("option");
		newopt.setAttribute("value", userData.filamentos.length);
		newopt.innerHTML = marca + " (" + tipo + " - " + diametro + "mm)";
		document.getElementById("filaSeleccionado").appendChild(newopt);
		document.getElementById("filaSeleccionado").value = userData.filamentos.length;

		userData.filamentos.push({"marca": marca, "tipo": tipo, "precio": precio, "peso": peso, "diametro": diametro});
		this.cambiarFilamento(document.getElementById("filaSeleccionado").value);
	}
}

Stats.prototype.borrarFilamento = function(){
	var domselect = document.getElementById("filaSeleccionado");
	var selected = domselect.value;

	if(selected != "nuevo"){
		selected = parseInt(selected);
		userData.filamentos.splice(selected, 1); //Elimina el elemento del array
		domselect.removeChild(domselect.childNodes[selected+1]); //Elimina el elemento del DOM		
		for (var i = selected+1 ; i < domselect.childNodes.length; i++) { //Reacomoda el DOM
			domselect.childNodes[i].setAttribute("value", i-1);
		}
		this.cambiarFilamento("nuevo");
	}
}

Stats.prototype.actualizarFilamento = function(){
	var domselect = document.getElementById("filaSeleccionado");
	var id = parseInt(domselect.value);
	
	userData.filamentos[id].marca = document.getElementById("filaMarca").value;
	userData.filamentos[id].tipo = document.getElementById("filaTipo").value.toUpperCase();
	userData.filamentos[id].precio = document.getElementById("filaPrecio").value;
	userData.filamentos[id].peso = document.getElementById("filaPeso").value;
	userData.filamentos[id].diametro = document.getElementById("filaDiametro").value;

	domselect.childNodes[id+1].innerHTML = userData.filamentos[id].marca + " ("+userData.filamentos[id].tipo+" - "+userData.filamentos[id].diametro+"mm)";
}

test = function(){}
test.prototype.userinput = undefined;

test.prototype.out = function (){
	if(this.userinput != undefined){
		console.log(this.userinput);
	}
	else{
		console.log("*No hay datos*");
	}
}
test.prototype.in = function (){
	this.userinput = prompt("Texto: ");
}
