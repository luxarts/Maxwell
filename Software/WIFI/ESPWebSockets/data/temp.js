var tempData = {
	labels: [],
	series: [
		[],//Grafico 1
		[]//Grafico 2
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
		offset: 60,
		high: 300,
		low: 0,
		onlyInteger: true,
		labelInterpolationFnc: function (value){
			return value + 'º';
		}
	}
};

function actualizarTemp(currentTemp, targetTemp){
	if(tempData.series[0].length>59)tempData.series[0].shift();//Saca el dato mas viejo
	tempData.series[0].push(targetTemp);//Temperatura actual
	if(tempData.series[1].length>59)tempData.series[1].shift();//Saca el dato mas viejo
	tempData.series[1].push(currentTemp);//Temperatura a la que se debe llegar
	Chartist.Line('.ct-chart', tempData, tempOptions);
}

function getTemp(){
	sendCmd("M105");
}

window.setInterval(getTemp,1000);

new Chartist.Line('.ct-chart', tempData, tempOptions);