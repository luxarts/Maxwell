var currentPath = "";

//Comprueba si es una carpeta
function isFolder(path){
	var matches = matches = path.match(/.*\/$/gm); //Busca 'ejemplo/'
	if(matches)return true;
	else return false;
}
//Ejemplo:
//Agregar carpeta -> addItem("carpeta/");
//Agregar archivo -> addItem("carpeta/archivo.ext 1234");
function addItem(path){
	var tr = document.createElement("tr");
	var nombre = path.split("/");

	if(isFolder(path)){
		nombre.pop(); //Saca el ultimo elemento (vacio)

		//Icono carpeta
		var td = document.createElement("td");
		td.innerHTML = "<i class=\"mwicons small\">folder</i>";
		tr.appendChild(td);

		//Texto
		td = document.createElement("td");
		var nombre = document.createTextNode(nombre[nombre.length-1]);
		td.appendChild(nombre);
		tr.appendChild(td);

		//Vacio
		td = document.createElement("td");
		tr.appendChild(td);

		//Evento
		tr.setAttribute("onclick", "folderIn(this)");
	}
	else{
		//Icono archivo
		var td = document.createElement("td");
		td.innerHTML = "<i class=\"mwicons small\">description</i>";
		tr.appendChild(td);
		
		//Texto
		var td = document.createElement("td");
		nombre = nombre[nombre.length-1].match(/.+\..+ /gm);

		if(nombre[0].startsWith("eeprom.bin"))return;
		nombre = document.createTextNode(nombre[0]);
		
		td.appendChild(nombre);
		tr.appendChild(td);

		//Peso
		var peso = path.match(/\d+$/gm);
		var mult = " bytes";
		peso = parseFloat(peso[0]);

		if(peso>1000){
			peso = peso/1000;
			mult = " KB";
		}
		if(peso>1000){
			peso = peso/1000;
			mult = " MB";
		}
		if(peso>1000){
			peso = peso/1000;
			mult = " GB";
		}
		peso = document.createTextNode(peso.toFixed(2).toString() + mult);
		
		td = document.createElement("td");
		td.appendChild(peso);
		tr.appendChild(td);

		tr.setAttribute("data-path", path.match(/.*[^\s0-9]/g)[0]);
		tr.setAttribute("onclick", "selectFile(this)");
	}
	document.getElementById("sdlist").appendChild(tr);
}

var selectedFile="";

function selectFile(dom){
	var items = document.getElementById("sdlist").getElementsByTagName("tr");
	for(var i=0 ; i<items.length ; i+=1){
		items[i].classList.remove("selectedFile");
	}
	var fileToPrint = dom.dataset.path;
	dom.classList.add("selectedFile");
	selectedFile = dom.getElementsByTagName("td")[1].innerHTML;
	document.getElementById("playpause_btn").classList.remove("disabled");
	document.getElementById("stop_btn").classList.remove("disabled");
	document.getElementById("delete_btn").classList.remove("disabled");
	sendCmd("M23 "+fileToPrint);
}

function itemBack(){
	var tr = document.createElement("tr");

	//Icono carpeta
	var td = document.createElement("td");
	td.innerHTML = "<i class=\"mwicons small\">folder</i>";
	tr.appendChild(td);

	//Texto
	var nombre = document.createTextNode("..");
	var td = document.createElement("td");
	td.appendChild(nombre);
	tr.appendChild(td);
	td = document.createElement("td");
	tr.appendChild(td);

	tr.setAttribute("onclick", "folderOut(this)");
	
	document.getElementById("sdlist").appendChild(tr);
}
function showList(bool){
	if(showList){
		document.getElementById("fileList").style.display = "block";
		document.getElementById("fileListProgress").style.display = "none";
	}
	else{
		document.getElementById("fileList").style.display = "none";
	}
}

function actualizarLista(){
	var select = document.getElementById("sdlist");

	for(var i=select.rows.length-1 ; i>=0 ; i--){
		select.deleteRow(i);
	}

	var items = [];
	var currentPathCount = currentPath.split("/").length; //Cantidad de subdirectorios

	if(currentPath != ""){
		itemBack();
	}

	for(var i in sdItems){
		if(sdItems[i].startsWith(currentPath)){//Si ese item esta en el directorio
			var subfolder = sdItems[i].substring(0, sdItems[i].lastIndexOf("/"));
			if(currentPath != "")subfolder+="/";
			
			if(subfolder == currentPath && !isFolder(sdItems[i])){
				addItem(sdItems[i]);
			}
			else{
				var subfolderCount = sdItems[i].split("/").length-1;
				if(subfolderCount == currentPathCount && isFolder(sdItems[i])){
					addItem(sdItems[i]);
				}
			}
		}
	}
	//Desactiva los botones
	if(printerStatus.printing.status == "P" || printerStatus.printing.status == "p"){//Printing or paused
		document.getElementById("playpause_btn").classList.remove("disabled");
		document.getElementById("stop_btn").classList.remove("disabled");
	}
	else{
		document.getElementById("playpause_btn").classList.add("disabled");
		document.getElementById("stop_btn").classList.add("disabled");
		document.getElementById("playpause_icon").innerHTML = "play_arrow";
	}
	document.getElementById("delete_btn").classList.add("disabled");
}
function folderIn(dom){
	dom = dom.getElementsByTagName("td");
	dom = dom[1].innerHTML+"/";
	currentPath += dom;
	actualizarLista();
}
function folderOut(){
	var pathSplit = currentPath.split("/");
	pathSplit.pop(); //Saca la barra del final
	pathSplit.pop(); //Saca la carpeta actual
	currentPath = pathSplit.join("/");//Une las carpetas
	if(currentPath != "")currentPath+="/";//Agrega la barra al final
	actualizarLista();
}
function deleteFile(){
	if(selectedFile == "")return;
	sendCmd("M30 "+currentPath+selectedFile);
	M.toast({html: "<i class='mwicons small left'>info</i>Archivo "+selectedFile+" eliminado"});

	var items = document.getElementsByTagName("tr");
	for(var i=0 ; i<items.length ; i+=1){
		items[i].classList.remove("selectedFile");
	}
	selectedFile = "";
	sendCmd('M20');//Actualizar
}

function playPausePrint(){
	if(printerStatus.printing.status == "I"){//Idle
		if(selectedFile == "")return;
		
		sendCmd("M24");//Print
		M.toast({html: "<i class='mwicons small left'>info</i>Imprimiendo "+selectedFile});

		var items = document.getElementsByTagName("tr");
		for(var i=0 ; i<items.length ; i+=1){
			items[i].classList.remove("selectedFile");
		}
		selectedFile = "";
		document.getElementById("playpause_icon").innerHTML = "pause";
		document.getElementById("playpause_btn").setAttribute("data-tooltip", "Pausar");
		document.getElementById("delete_btn").classList.add("disabled");
	}
	else if(printerStatus.printing.status == "P"){//Printing
		sendCmd("M25");//Pause
		M.toast({html: "<i class='mwicons small left'>info</i>Impresión pausada"});

		document.getElementById("playpause_icon").innerHTML = "play_arrow";
		document.getElementById("playpause_btn").setAttribute("data-tooltip", "Reanudar");
	}
	else if(printerStatus.printing.status == "p"){//paused
		sendCmd("M24");//Resume
		M.toast({html: "<i class='mwicons small left'>info</i>Impresión reanudada"});

		document.getElementById("playpause_icon").innerHTML = "pause";
		document.getElementById("playpause_btn").setAttribute("data-tooltip", "Pausar");
	}
}

function stopPrint(){
	sendCmd("M108");//Stop
	M.toast({html: "<i class='mwicons small left'>info</i>Impresión detenida"});

	document.getElementById("playpause_btn").classList.add("disabled");
	document.getElementById("stop_btn").classList.add("disabled");
	document.getElementById("playpause_icon").innerHTML = "play_arrow";
}

function updateButtons(){
	if(printerStatus.printing.status == 'I' && selectedFile == ""){
		document.getElementById("playpause_icon").innerHTML = "play_arrow";
		document.getElementById("playpause_btn").classList.add("disabled");
		document.getElementById("stop_btn").classList.add("disabled");
	}
	else if(printerStatus.printing.status == 'P'){
		document.getElementById("playpause_icon").innerHTML = "pause";
		document.getElementById("playpause_btn").classList.remove("disabled");
		document.getElementById("stop_btn").classList.remove("disabled");
	}
	else if(printerStatus.printing.status == 'p'){
		document.getElementById("playpause_icon").innerHTML = "play_arrow";
		document.getElementById("playpause_btn").classList.remove("disabled");
		document.getElementById("stop_btn").classList.remove("disabled");
	}
}

window.addEventListener("load",function(){
	sendCmd("M20");//Cargar EEPROM
});
window.setTimeout(function(){
	if(!sdLoaded)cargarSd();
}, 500);