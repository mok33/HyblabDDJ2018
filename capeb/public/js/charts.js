var colors = [
			'rgb(230, 25, 75)',
			'rgb(60, 180, 75)',
			'rgb(255, 225, 25)',
			'rgb(0, 130, 200)',
			'rgb(245, 130, 48)',
			'rgb(70, 240, 240)',
			'rgb(240, 50, 230)',
			'rgb(210, 245, 60)',
			'rgb(250, 190, 190)',
			'rgb(0, 128, 128)',
			'rgb(230, 190, 255)',
			'rgb(170, 110, 40)',
			'rgb(255, 250, 200)',
			'rgb(128, 0, 0)',
			'rgb(170, 255, 195)',
			'rgb(128, 128, 0)'
			];

var drawChart3dEmploi = (data) => {
	var sec = document.getElementById("dataviz").appendChild(document.createElement('section'));

	var h3 = sec.appendChild(document.createElement('h3'));
    h3.innerHTML = "Jusqu'où peuvent-ils aller ?";
    var cvs = sec.appendChild(document.createElement('canvas'))

	var ctx = cvs.getContext("2d")
	var region = {
					"labels": ["annee","Moy_recrutement_envi"],
					"values":[["2014","2015","2016","2017"],["1.11538461538462","1.13223140495868","1.11678832116788","1.35028248587571"]]
				 }
	data2 = [data.Recrutement_Evo, region]
	var labels = ["Epci", "Région"]
	var d = data2.map((val, i) => {return {
											label: labels[i], 
											backgroundColor: colors[i], 
											borderColor: colors[i], 
											data: val.values[1].map(Number),
											fill: true
										  }
								 })
	var ch = new Chart(ctx, {
		// The type of chart we want to create
		type: 'line',

		// The data for our dataset
		data: {
			labels: data2[0].values[0],
			datasets: d
		},
		// Configuration options go here
		options: { 
				responsive:false,
				maintainAspectRatio: false,
				tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
				scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Moyenne Nb récrutement envisagé'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        ticks: {
							suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
							// OR //
							beginAtZero: true   // minimum value will be 0.
						},
                        scaleLabel: {
                            display: true,
                            labelString: 'Année'
                        }
                    }]
                }
		}	
	});
	
	cvs.onclick = function(evt) {
      var activePoints = ch.getElementsAtEvent(evt);
      if (activePoints[0]) {
        var chartData = activePoints[0]['_chart'].config.data;
        var idx = activePoints[0]['_index'];

        var label = chartData.labels[idx];
        var value = chartData.datasets[0].data[idx];
		
		var i = data.Recrutement_Evo_Act.values[0].indexOf(label)
		var p = {"labels" : data.Recrutement_Evo_Act.labels.slice(1), "values": data.Recrutement_Evo_Act.values[1 + i]}
				$(".plus").html("")


		drawBarChart(p, "Rapartition du nombre de recrutement envisagé par activité")
      }
    };
};


function flush(){
	var cvs = document.getElementById("page3");
	cvs.innerHTML = ""
	

}
function drawLineChart(data, title){
	var sec = document.getElementById("page3").appendChild(document.createElement('section'));
	sec.className = "chart";

	var h3 = sec.appendChild(document.createElement('h3'))
			h3.innerHTML = title;

	var cvs = sec.appendChild(document.createElement('canvas'))

	var d = data.values.slice(1).map((val, i) => {return {
														label: data.labels[i+1], 
														backgroundColor: colors[i], 
														borderColor: colors[i], 
														data: val,
													    fill: false
														}
												})
	var ctx = cvs.getContext("2d")
		new Chart(ctx, {
		// The type of chart we want to create
		type: 'line',

		// The data for our dataset
		data: {
			labels: data.values[0],
			datasets: d
		},
		// Configuration options go here
		options: { 
				responsive:false,
				maintainAspectRatio: false
		}	
	});

}
function drawBarChart(data, title){
	var sec = document.getElementById("dataviz").appendChild(document.createElement('section'));
		sec.className = "plus"

    var cvs = sec.appendChild(document.createElement('canvas'))

	var ctx = cvs.getContext("2d")
	new Chart(ctx, {
		// The type of chart we want to create
		type: 'bar',

		// The data for our dataset
		data: {
			labels: data.labels,
			datasets: [{
				label: "Activte",
				backgroundColor: colors,
				borderColor: colors,
				data: data.values,
			}]
		},

		// Configuration options go here
		options: { 
				responsive:false,
				maintainAspectRatio: false
				}	
	});

}
function drawPieChart(data, title){
	var sec = document.getElementById("page3").appendChild(document.createElement('section'))
	sec.className = "chart"

	var h3 = sec.appendChild(document.createElement('h3'))
		h3.innerHTML = title

	var cvs2 = sec.appendChild(document.createElement('canvas'))
	var ctx2 = cvs2.getContext("2d")

	new Chart(ctx2,{
		type: 'pie',
		data: {
				labels: data.labels,
				datasets: [{
					label: "Activte",

					data: data.values,
					backgroundColor: colors,
				}]
			},
		options: { responsive:false,
		maintainAspectRatio: false,
		}
	});
}

function drawBubbleChart(data){

    var colorMatch = {
        Aut:colors[0],
        Ele: colors[1],
        maç: colors[2],
        men: colors[3],
        Mét: colors[4],
        Pei: colors[5],
        plâ: colors[6],
        plo: colors[7],
        Tra: colors[8]
    };

    function scale(number){
		var start = 10;
		var inc = 8;
		if (number == 0){
			return start;
		} else if(number <= 2){
			return start+inc;
		} else if(number <= 5){
			return start+inc*2;
		} else if(number <= 10){
            return start+inc*3;
        } else {
			return start+inc*4;
		}
	}
    var sec = document.getElementById("dataviz-section");
	if(sec !== null) {
        sec.remove();
    }
    sec = document.getElementById("dataviz").appendChild(document.createElement('section'));
    sec.setAttribute("id", "dataviz-section");

    var h3 = document.getElementById("title-dataviz");
	if(h3!==null){
        h3.remove();
	}
    h3 = sec.appendChild(document.createElement('h3'));
    h3.setAttribute("id", "title-dataviz");
    h3.innerHTML = "Jusqu'où peuvent-ils aller ?";

    var canvas = document.getElementById("canvas-dataviz");
	if(canvas !== null){
    	canvas.remove();
	}
    canvas = document.createElement('canvas');
    canvas.setAttribute("id", "canvas-dataviz");

    var cvs = sec.appendChild(canvas);
    var ctx = cvs.getContext("2d");



    var points = {datasets: []};

	data.values.forEach(function(value){
		var dataset = {};
		var data = [];
        var point = {};
		point.x = value[2];
		point.y = 0.5;
		point.r = scale(value[1]);
		point.metier = value[0];

		data.push(point);
		dataset.data = data;
		dataset.label = value[0];
		dataset.backgroundColor = colorMatch[value[0].substr(0, 3)];
        points.datasets.push(dataset);
	});

    var options = {
    	tooltips: false,
        elements: {
            point: {
                backgroundColor: function(context){
                    var value = context.dataset.data[context.dataIndex];
                    return colorMatch[value.metier.substr(0, 3)];
				},

            	r: function (context) {
                    var value = context.dataset.data[context.dataIndex];
                    var size = context.chart.width;
                    var base = Math.abs(value.v) / 1000;
                    return (size *2) * base;
                }
            }
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:false
                },
				scaleLabel : {
                	display: true,
					labelString: "Distance en kilomètres"
				}
            }],
            yAxes: [{
            	ticks: {
            		display:false
				},
                gridLines: {
                    display:false,
					drawBorder: false
                }
            }]
        },
		legend: {
    		display: true,
			labels: {

			}
		}
    };


    var chart = new Chart(ctx, {
        type: 'bubble',
        data: points,
        options: options
    });

}
