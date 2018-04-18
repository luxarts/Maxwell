var posX=0,posY=0,posZ=0;
var hommed=false;

var HttpClient = function() {
	this.get = function(aUrl, aCallback) {
		var anHttpRequest = new XMLHttpRequest();
		anHttpRequest.onreadystatechange = function() { 
			if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
			aCallback(anHttpRequest.responseText);
		}

		anHttpRequest.open( "GET", aUrl, true );            
		anHttpRequest.send( null );
	}
}	
var client = new HttpClient();

function enviarPeticion(){
	var peticion = "http://192.168.0.99/"+document.getElementById('peticion').value;
	console.log(peticion);
	
	client.get(peticion, function(response) {
		console.log("Respuesta: "+response);
	});
}

function home(){
	posX=0;
	posY=0;
	posZ=0;
	hommed=true;
	enviarComando('G28');
}
function moveX(distance){
	if(hommed){						//Comprueba que se haya hecho homing
		posX+=distance;				//Actualiza el contador
		posX=Math.round(posX*100)/100;		//Redondea a 2 decimales
		enviarComando('G1 X'+posX);
	}
	else{
		alert("Impresora sin referencia. Enviar a Home.");
	}
}
function moveY(distance){
	if(hommed){						//Comprueba que se haya hecho homing
		posY+=distance;				//Actualiza el contador
		posY=Math.round(posY*100)/100;		//Redondea a 2 decimales
		enviarComando('G1 Y'+posY);
	}
	else{
		alert("Impresora sin referencia. Enviar a Home.");
	}
}
function moveZ(distance){
	if(hommed){						//Comprueba que se haya hecho homing
		if(posZ+distance>0){			//Verifica si queda en el rango después de la operación
			posZ+=distance;				//Actualiza el contador
			posZ=Math.round(posZ*100)/100;		//Redondea a 2 decimales
			enviarComando('G1 Z'+posZ);	//
		}
		else{
			posZ=0;
			enviarComando('G1 Z'+posZ);
		}
	}
	else{
		alert("Impresora sin referencia. Enviar a Home.");
	}
}
function enviarComando(cmd){
	document.getElementById('posX').innerHTML = posX;
	document.getElementById('posY').innerHTML = posY;
	document.getElementById('posZ').innerHTML = posZ;
	console.log(cmd);
	client.get(cmd, function(response) {
		console.log("Respuesta: "+response);
	});
}