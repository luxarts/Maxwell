var tempData = {
	labels: [],
	series: [
		[],//Grafico 1 = Extrusor target
		[],//Grafico 2 = Extrusor actual
		[],//Grafico 3 = Cama target
		[] //Grafico 4 = Cama actual
	]
};

for(var i=0;i<60;i++){
	tempData.labels.push(i+1);
}

var tempOptions = {
	// Don't draw the line chart points
	showPoint: false,
	// Disable line smoothing
	lineSmooth: true,
	// X-Axis specific configuration

	axisX: {
		showLabel: true,
		labelInterpolationFnc: function (value, index) {
			return index % 5 === 0 ? value-1 : null;
		}
	},
	// Y-Axis specific configuration
	axisY: {
		offset: 30,
		high: 300,
		low: 0,
		onlyInteger: true,
		labelInterpolationFnc: function (value){
			return value + 'º';
		}
	}
};

function actualizarTemp(extruderCurrentTemp, extruderTargetTemp, bedCurrentTemp, bedTargetTemp){
	if(tempData.series[0].length>59)tempData.series[0].shift();//Saca el dato mas viejo
	tempData.series[0].push(extruderTargetTemp);//Temperatura actual
	if(tempData.series[1].length>59)tempData.series[1].shift();//Saca el dato mas viejo
	tempData.series[1].push(extruderCurrentTemp);//Temperatura a la que se debe llegar
	if(tempData.series[2].length>59)tempData.series[2].shift();//Saca el dato mas viejo
	tempData.series[2].push(bedTargetTemp);//Temperatura actual
	if(tempData.series[3].length>59)tempData.series[3].shift();//Saca el dato mas viejo
	tempData.series[3].push(bedCurrentTemp);//Temperatura a la que se debe llegar
	document.getElementById("extruderTemp").innerHTML = extruderCurrentTemp + "º / " + extruderTargetTemp + "º";
	document.getElementById("bedTemp").innerHTML = bedCurrentTemp + "º / " + bedTargetTemp + "º";
	Chartist.Line('.ct-chart', tempData, tempOptions);
}

function getTemp(){
	//sendCmd("M105");
	actualizarTemp(Math.floor((Math.random() * 40) + 180), Math.floor((Math.random() * 10) + 180), Math.floor((Math.random() * 30) + 40), Math.floor((Math.random() * 10) + 40));
}

// window.setInterval(getTemp,500);

new Chartist.Line('.ct-chart', tempData, tempOptions);