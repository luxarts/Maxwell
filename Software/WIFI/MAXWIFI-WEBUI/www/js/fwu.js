document.addEventListener("DOMContentLoaded", function(){
	var elems = document.querySelectorAll('.sidenav');
	var instances = M.Sidenav.init(elems, '');
	var elems = document.querySelectorAll('.tooltipped');
	var instances = M.Tooltip.init(elems, {outDuration: 0});
	var elems = document.querySelectorAll('.collapsible');
	var instances = M.Collapsible.init(elems, {accordion: false});
	var elems = document.querySelectorAll('select');
	var instances = M.FormSelect.init(elems, '');
	var elems = document.querySelectorAll('.modal');
	var instances = M.Modal.init(elems, '');
});
function readFile(e){
	var f = e.target.files[0];

	if(f){
		if(f.name.endsWith(".html") || f.name.endsWith(".js") || f.name.endsWith(".css") || f.name.endsWith(".gz")){
			var r = new FileReader();
			r.onload = function (e){
				document.getElementById("uploadButton").classList.remove("disabled");
			}
			r.readAsText(f);
		}
		else{
			document.getElementById("uploadButton").classList.add("disabled");
			M.toast({html: '<i class="mwicons left small red-text">report</i>El archivo no es válido'});
		}
	}
}