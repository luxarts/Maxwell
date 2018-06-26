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
		td.innerHTML = "<svg height='20px' viewBox='0 0 510 510' xml:space='preserve'><g><g><path d='M204,51H51C22.95,51,0,73.95,0,102v306c0,28.05,22.95,51,51,51h408c28.05,0,51-22.95,51-51V153c0-28.05-22.95-51-51-51 H255L204,51z'/></g></g></svg>";
		tr.appendChild(td);

		//Texto
		td = document.createElement("td");
		td.setAttribute("class", ".sdlist-folder");
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
		td.innerHTML = "<svg height='20px' viewBox='0 0 459 459' xml:space='preserve'><g><g><path d='M408,0H51C22.95,0,0,22.95,0,51v357c0,28.05,22.95,51,51,51h357c28.05,0,51-22.95,51-51V51C459,22.95,436.05,0,408,0z M357,153H102v-51h255V153z M357,255H102v-51h255V255z M280.5,357H102v-51h178.5V357z'/></g></g></svg>";
		tr.appendChild(td);
		//Texto
		nombre = nombre[nombre.length-1].match(/.+\..+ /gm);
		nombre = document.createTextNode(nombre[0]);
		var td = document.createElement("td");
		td.setAttribute("class", ".sdlist-file");
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
		td.setAttribute("class", ".sdlist-file");
		td.appendChild(peso);
		tr.appendChild(td);

		tr.setAttribute("data-path", path.match(/.*[^\s0-9]/g)[0]);
		tr.setAttribute("onclick", "selectFile(this)");
	}
	document.getElementById("sdlist").appendChild(tr);
}
var selectedFile="";

function selectFile(dom){
	var items = document.getElementsByTagName("tr");
	console.log(items);
	for(var i=0 ; i<items.length ; i+=1){
		console.log(items[i]);
		items[i].classList.remove("selectedFile");
	}
	var fileToPrint = dom.dataset.path;
	dom.classList.add("selectedFile");
	selectedFile = dom.getElementsByTagName("td")[1].innerHTML;
	sendCmd("M23 "+fileToPrint);
}
function printFile(){
	if(selectedFile == "")return;
	sendCmd("M24");
	showMsg("Imprimiendo "+selectedFile+"");
}
function pausePrint(){
	sendCmd("M25");
}

function agregarCarpeta(){ //Completar
}
function eliminarArchivo(){ //Completar
}

function itemBack(){
	var tr = document.createElement("tr");

	//Icono flecha atras
	var td = document.createElement("td");
	td.innerHTML = "<svg height='20px' viewBox='0 0 306 306' xml:space='preserve'><g><g><polygon points='247.35,270.3 130.05,153 247.35,35.7 211.65,0 58.65,153 211.65,306'/></g></g></svg>";
	tr.appendChild(td);

	//Texto
	var nombre = document.createTextNode("..");
	var td = document.createElement("td");
	td.setAttribute("class", ".sdlist-folder");
	td.appendChild(nombre);
	tr.appendChild(td);
	td = document.createElement("td");
	tr.appendChild(td);
	tr.setAttribute("onclick", "folderOut(this)");
	
	document.getElementById("sdlist").appendChild(tr);
}
function actualizarLista(){
	var select = document.getElementById("sdlist");

	for(var i=select.rows.length-1 ; i>=1 ; i--){
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
showMsg("Cargando memoria SD...");
var sdInterval = setInterval(cargarSD, 1000);
function cargarSD(){
	if(!sdLoaded){
		sendCmd('m20');
	}
	else clearInterval(sdInterval);
}
/* Ejemplo de datos recibidos

Begin file list
Hardware/
Hardware/VIKI/
Hardware/VIKI/Soporte polea Y.gcode 482188
Hardware/VIKI/Sujeta correa Y.gcode 638399
Hardware/Skyprint/
Hardware/Skyprint/Hotend.gcode 1426513
Hardware/Skyprint/boost-cooler40.gcode 1428368
Calibracion/
Calibracion/BridgeTestPart.gcode 2374216
Calibracion/3DBenchy.gcode 2389717
pendrive/
pendrive/Apps/
SOPORT~1.GCO 2056283
penholder/
penholder/clamp.gcode 453121
exhibicion.gcode 86234
DRILL/
DRILL/chuck_jaw.gcode 785976
BUSTOS/
BUSTOS/4x lenin80mm.gcode 33519334
BUSTOS/lenin80mm.gcode 8020432
Otros/
Otros/SoporteCuadros.gcode 1537062
Otros/spiral_cube_cube.gcode 4488313
Otros/66to1 planetary/
Otros/66to1 planetary/AllParts.gcode 26044771
Otros/66to1 planetary/Joint1A_and_acople.gcode 5481057
Otros/Skyprint/
Otros/Skyprint/MotorBase.gcode 3848279
Otros/Skyprint/3xCarriage.gcode 4957578
End file list
*/
