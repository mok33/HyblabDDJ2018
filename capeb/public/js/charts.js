var colors = [
    'rgba(223,38,29,1)',
    'rgba(213,188,40,1)',
    'rgba(88,83,83,1)',
    'rgba(100,191,182,1)',
    'rgba(104,192,237,1)',
    'rgba(235,103,105,1)',
    'rgba(29, 29, 27, 1)',
    'rgba(255,224,0,1)',
    'rgba(255,224,0,1)',
    'rgba(255,224,0,1)'
];

var colors_pie = [
    'rgba(104,192,237,1)',
    'rgba(255,224,0,1)',
    'rgba(223,38,29,1)'
];


var colorZoom = [
    'rgba(223,38,29,0.8)',
    'rgba(104,192,237,0.8)',
    'rgba(255,224,0,0.8)',
];

var drawDDChart = function(stats) {
    var colorsDD = {
        ité:'rgba(18,68,75,100)',
        ent:'rgba(96,192,190,100)',
        ets:'rgba(42,114,135,100)',
        ion:'rgba(208,2,27,100)',
        gie:'rgba(39,194,172,100)',
        les:'rgba(152,17,33,100)',
        air:'rgba(235,188,42,100)',
        eau:'rgba(96,177,192,100)',
        aux:'rgba(214,235,55,100)'
    };
    function scale(number) {
        var r;
        if(number<=10){
            r = 10;
        } else if(number<=25){
            r = 18;
        } else if(number<=50){
            r = 26;
        } else if(number<=75){
            r =  34;
        } else if(number<=100){
            r = 42;
        }
        return r;
    }

    var sec = document.getElementById("dataviz-section");
    if (sec !== null) {
        sec.remove();
    }
    sec = document.getElementById("dataviz").appendChild(document.createElement('section'));
    sec.setAttribute("id", "dataviz-section");

    var canvas = document.getElementById("canvas-dataviz");
    if (canvas !== null) {
        canvas.remove();
    }
    canvas = document.createElement('canvas');
    canvas.setAttribute("id", "canvas-dataviz");

    var cvs = sec.appendChild(canvas);


    var ctx = cvs.getContext("2d");
    var datasets = stats.Developpement_durable.values[0].map(function(aspect, id){
        return {
            label: aspect,
            data: [
                {
                    x: id,
                    y: 2,
                    r: scale(parseFloat(stats.Developpement_durable.values[1][id]))
                }
            ],
            backgroundColor: colorsDD[aspect.substr(aspect.length -3)]
        };
	});
	
    var ch = new Chart(ctx,
        {
            type: 'bubble',
            data: {'datasets': datasets},
            options: {
                title: {
                    display: false
                },
                legend: {
                    display: false
                },
                onClick: function (e) {
                    var element = this.getElementAtEvent(e);

                    // If you click on at least 1 element ...
                    if (element.length > 0) {
                        // Logs it
                        // Here we get the data linked to the clicked bubble ...
                        var datasetLabel = this.config.data.datasets[element[0]._datasetIndex].label;

                        var dt = {'labels': [], 'values': []}
						
						
                        stats.Interet_ApsectDD.values.map(function(cell) {
							if(cell[0] === datasetLabel)
							{
								dt.labels.push(cell[1]);
								dt.values.push(parseFloat(cell[2]).toFixed(1));
							}
						});
						
                        $("#canvas-dataviz").hide();
                        $(".plus").html("");

                        drawPieChart(dt, datasetLabel);
		                $(".plus").append($.parseHTML("<svg id='unzoom' viewBox='0 0 50 70' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g transform='translate(10.0, 25.0)'><polyline points='20 0 10 10 20 20'></polyline></g></svg>"))

						}
                },
                hover: {
                    mode: 'nearest',
                    intersect: true,
                    onHover: function (e) {
                        var point = this.getElementAtEvent(e);
                        if (point.length) e.target.style.cursor = 'pointer';
                        else e.target.style.cursor = 'default';
                    }
                },
                tooltips: {
                    callbacks: {
                        label: function (t, d) {
                            return d.datasets[t.datasetIndex].label + ': ' + parseFloat(stats.Developpement_durable.values[1][t.datasetIndex]).toFixed(1) + '%';

                        }
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            display: false,
                            min: -1,
                            max: stats.Developpement_durable.values[0].length
                        },
                        gridLines: {
                            display: false
                        },
                        scaleLabel: {
                            display: false,
                        },

                    }],
                    yAxes: [{
                        ticks: {
                            display: false
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false
                        }
                    }]
                }
            }
        }
    );


}

var wordCloud = function(FreinsMP) {
    var frequency_list = FreinsMP.values[0].map(function(name, id){
        return {
            "text": name,
            "size": FreinsMP.values[1][id]
        };
	});

    var fill = d3.scale.category20();

    var layout = d3.layout.cloud()
        .size([600, 600])
        .words(frequency_list)
        .padding(5)
        .font("Montserrat', sans-serif")
        .fontSize(function (d) {
            return d.size;
        })
        .on("end", draw);

    layout.start();

    function draw(words) {
        $("#dataviz").html("")
        d3.select("#dataviz").append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) {
                return d.size + "px";
            })
            .style("font-family", "Montserrat', sans-serift")
            .style("fill", function (d, i) {
                return fill(i);
            })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) {
                return d.text;
            });
    };
}
;

var drawChart3dEmploi = function (data) {

    var sec = document.getElementById("dataviz-section");
    if (sec !== null) {
        sec.remove();
    }
    sec = document.getElementById("dataviz").appendChild(document.createElement('section'));
    sec.setAttribute("id", "dataviz-section");

    var canvas = document.getElementById("canvas-dataviz");
    if (canvas !== null) {
        canvas.remove();
    }
    canvas = document.createElement('canvas');
    canvas.setAttribute("id", "canvas-dataviz");

    var cvs = sec.appendChild(canvas);


    var ctx = cvs.getContext("2d");

    var region = {
        "labels": ["annee", "Moy_recrutement_envi"],
        "values": [
            ["2014", "2015", "2016", "2017"],
            ["8.321377", "12.15517", "17.19409", "25.60819"]
        ]

    };
    data2 = [data.Recrutement_Evo, region];
    var labels = ["Epci", "Région"];
    var d = data2.map(function (val, i) {
        return {
            tension: 0,
            label: labels[i],
            backgroundColor: colorZoom[i + 1],
            borderColor: colorZoom[i + 1],
            borderWidth: "0",
            data: val.values[1].map(Number),
            fill: true
        }
    });


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
            legend: {
                display: false
            },
            title: {
                display: true
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: true,
                onHover: function (e) {
                    var point = this.getElementAtEvent(e);
                    if (point.length) e.target.style.cursor = 'pointer';
                    else e.target.style.cursor = 'default';
                }
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Année'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        suggestedMin: 0, // minimum will be 0, unless there is a lower value.
                        // OR //
                        beginAtZero: true, // minimum value will be 0.
                        callback: function(value){
                            return value + "%";
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "% d'entreprises qui envisagent d'embaucher"
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }]
            }
        }
    });

/*
    cvs.onclick = function (evt) {
        var activePoints = ch.getElementsAtEvent(evt);
        if (activePoints[0]) {
            var chartData = activePoints[0]['_chart'].config.data;
            var idx = activePoints[0]['_index'];

            var label = chartData.labels[idx];
            var value = chartData.datasets[0].data[idx];

            var i = data.Recrutement_Evo_Act.values[0].indexOf(label)
            var p = {
                "labels": data.Recrutement_Evo_Act.labels.slice(1),
                "values": data.Recrutement_Evo_Act.values[1 + i]
            };

            $("#canvas-dataviz").fadeOut();
            $(".plus").html("");
            drawBarChart(p, "Moyenne Nb récrutement envisagé " + label)
		    $(".plus").append($.parseHTML("<svg id='unzoom' viewBox='0 0 50 70' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g transform='translate(10.0, 25.0)'><polyline points='20 0 10 10 20 20'></polyline></g></svg>"))

        }
    };
*/
};


function investissementDataviz(data) {
    var sec = document.getElementById("dataviz-section");
    if (sec !== null) {
        sec.remove();
    }
    sec = document.getElementById("dataviz").appendChild(document.createElement('section'));
    sec.setAttribute("id", "dataviz-section");

    var canvas = document.getElementById("canvas-dataviz");
    if (canvas !== null) {
        canvas.remove();
    }
    canvas = document.createElement('canvas');
    canvas.setAttribute("id", "canvas-dataviz");

    var cvs = sec.appendChild(canvas);

    var d = {
        datasets: [],
        labels: []
    };
    var dataset = {
        data: [],
        label: "Votre secteur",
        backgroundColor: colorZoom[1],
        borderWidth: "0",
        tension: 0

    };

    var datasetRegion = {data: [], label: "Région", backgroundColor: colorZoom[2], borderWidth: "0", tension:0};
    data.region.forEach(function (value) {
        datasetRegion.data.push(parseFloat(value[1])*100);
    });

    data.values.forEach(function (value) {
        d.labels.push(value[0]);
        dataset.data.push(parseFloat(value[1])*100);
    });

    d.datasets.push(dataset);
    d.datasets.push(datasetRegion);

    var ctx = cvs.getContext("2d");
    var c = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: d,
        // Configuration options go here
        options: {
            legend: {
                display: false
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: true,
                onHover: function (e) {
                    var point = this.getElementAtEvent(e);
                    if (point.length) e.target.style.cursor = 'pointer';
                    else e.target.style.cursor = 'default';
                }
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Année'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true, // minimum value will be 0.
                        callback: function(value){
                            return value + "%";
                        }
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    scaleLabel: {
                        display: true
                    }
                }]
            }
        }
    });
}

function drawBarChart(data, title) {
    var sec = document.getElementById("dataviz").appendChild(document.createElement('section'));
    sec.className = "plus";
    sec.onclick = function() {
        sec.style.display = "none";

        document.getElementById("canvas-dataviz").style.display = "block";
    };
    var cvs = sec.appendChild(document.createElement('canvas'))

    var ctx = cvs.getContext("2d")
    new Chart(ctx, {
        // The type of chart we want to create
        type: 'horizontalBar',
        // The data for our dataset
        data: {
            labels: data.labels,
            datasets: [{
                backgroundColor: colors,
                borderWidth: 0,
                data: data.values.map(val => parseFloat(val).toFixed(1) * 100),
            }]
        },

        // Configuration options go here
        options: {
            title: {
                display: true,
                text: title
            },
			legend: {
				display: false
			},
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        beginAtZero: true, // minimum value will be 0.
                        callback: function (value) {
                            return value + "%";
                        }
                    }
                }],
                    yAxes: [{
                    gridLines: {
                        display: false
                    },
                }]

            }
        }
    });

}

var drawMP = function(stats) {
    var colorsMP = ['rgba(100,191,182,100)', 'rgba(88,88,83,100)']
	var sec = document.getElementById("dataviz-section");
    if (sec !== null) {
        sec.remove();
    }
    sec = document.getElementById("dataviz").appendChild(document.createElement('section'));
    sec.setAttribute("id", "dataviz-section");

    var canvas = document.getElementById("canvas-dataviz");
    if (canvas !== null) {
        canvas.remove();
    }
    canvas = document.createElement('canvas');
    canvas.setAttribute("id", "canvas-dataviz");

    var cvs = sec.appendChild(canvas);

	var ctx = cvs.getContext("2d");
    
    var myNewChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: stats.Marches_publics.labels,
            datasets: [{
                label: "Activte",
                borderWidth: 0,
                data: stats.Marches_publics.values.map(function(val){return parseFloat(val) * 100;}),
                backgroundColor: colorsMP
            }]
        },
        options: {
            title: {
                display: false,
            },
            legend: {
                display: false
            },
             hover: {
                    mode: 'nearest',
                    intersect: true,
                    onHover: function (e) {
                        var point = this.getElementAtEvent(e);
                        if (point.length) e.target.style.cursor = 'pointer';
                        else e.target.style.cursor = 'default';
                    }
                },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return value.toFixed(1) + ' :%';
                    }
                }
            },
        }
    });
    canvas.onclick = function (evt) {
				var activePoints = myNewChart.getElementsAtEvent(evt);
				if (activePoints[0]) {
				var chartData = activePoints[0]['_chart'].config.data;
				var idx = activePoints[0]['_index'];

				var label = chartData.labels[idx];
				var value = chartData.datasets[0].data[idx];


				$("#canvas-dataviz").hide();
				$(".plus").html("");
				var dt = {"labels": stats.FreinsMP.values[0], "values": stats.FreinsMP.values[1]}
				if(label == "Oui"){
					label = "Difficutlés rencontrées"
				
					dt = {"labels": stats.DifficultésMP.values[0], "values": stats.DifficultésMP.values[1]}
				}
				else{
					label = "Freins"
				}
				drawBarChart(dt, label);

				$(".plus").append($.parseHTML("<svg id='unzoom' viewBox='0 0 50 70' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g transform='translate(10.0, 25.0)'><polyline points='20 0 10 10 20 20'></polyline></g></svg>"))


                }
	}
}

function drawPieChart(data, title) {
    var sec = document.getElementById("dataviz").appendChild(document.createElement('section'));
    sec.className = "plus"
    sec.onclick = function() {
        sec.style.display = "none";
        document.getElementById("canvas-dataviz").style.display = "block";
    };
    var cvs = sec.appendChild(document.createElement('canvas'));

    var ctx = cvs.getContext("2d")

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                label: "Activte",
                borderWidth: 0,
                data: data.values,
                backgroundColor: colors_pie,
            }]
        },
        options: {
            title: {
                display: true,
                text: title
            }
        }
    });
}

function drawDistanceDataviz(data) {

    var colorMatch = {
        Ele: colors[1],
        maç: colors[2],
        men: colors[3],
        Mét: colors[7],
        Pei: colors[4],
        plâ: colors[5],
        plo: colors[0],
        Tra: colors[8]
    };

    function scale(number) {
        var start = 10;
        var inc = 8;
        if (number == 0) {
            return start;
        } else if (number <= 2) {
            return start + inc;
        } else if (number <= 5) {
            return start + inc * 2;
        } else if (number <= 10) {
            return start + inc * 3;
        } else {
            return start + inc * 4;
        }
    }

    var sec = document.getElementById("dataviz-section");
    if (sec !== null) {
        sec.remove();
    }
    sec = document.getElementById("dataviz").appendChild(document.createElement('section'));
    sec.setAttribute("id", "dataviz-section");

    var canvas = document.getElementById("canvas-dataviz");
    if (canvas !== null) {
        canvas.remove();
    }
    canvas = document.createElement('canvas');
    canvas.setAttribute("id", "canvas-dataviz");

    var cvs = sec.appendChild(canvas);
    var ctx = cvs.getContext("2d");

    var points = {
        datasets: []
    };


    var maxX=0;
    var minX = 1000;
    data.values.forEach(function (value) {
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
        dataset.borderWidth = 0;
        dataset.backgroundColor = colorMatch[value[0].substr(0, 3)];
        points.datasets.push(dataset);

        if(parseFloat(value[2]) > maxX){maxX = parseFloat(value[2]);}
        if(parseFloat(value[2]) < minX){minX = parseFloat(value[2]);}
    });

    // so the bubbles aren't cut on sides
    maxX = parseFloat(maxX) + 10;
    (parseFloat(minX)-10<0) ? minX=0 : minX = parseFloat(minX) - 10;
    maxX = parseInt(maxX);
    minX = parseInt(minX);

    var options = {
        tooltips: false,
        scales: {
            xAxes: [{
                gridLines: {
                    display: false
                },
                scaleLabel: {
                    display: true,
                    labelString: "Distance en kilomètres"
                },
                ticks: {
                    min: minX,
                    max: maxX
                }
            }],
            yAxes: [{
                ticks: {
                    display: false
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                }
            }]
        },
        legend: {
            display: false
        }
    };


    new Chart(ctx, {
        type: 'bubble',
        data: points,
        options: options
    });

}

function fetchConjonctureData(d) {
    fetch("/capeb/data/" + d.properties.siren_epci + "/conjoncture_facteurs")
        .then(function (value) {
            return value.json();
        })
        .catch(function (error) {
            console.log("error");
            console.log(error);
            return {};
        })
        .then(function (json) {
            createConjonctureDataviz(json);
        });
}

function createConjonctureDataviz(json) {
    var labelsy = ["Chiffre d'affaires", "Marge", "Trésorerie", "Carnet de commandes"];
    var labelsx = ["À la baisse", "Stable", "À la hausse"];
    var pointsColor = [["#ACF2E2", "#50EC2", "#02998B"], ["#AEDFF8", "#68C0ED", "#427C9A"], ["#D8D8D8", "#9B9B9B", "#585354"], ["#EB8D8B", "#DF261D", "#A61B14"]];


    var d = {
        datasets: [],
    };
    var cptx = 1;
    var cpty = 1;
    var dataset = {};
    var data = [];
    var point = {};
    json.values[0].forEach(function (value) {
        point = {};
        point.x = cptx;
        point.y = cpty;
        point.r = radiusmatch(value);
        point.percentage = value;
        data.push(point);
        cptx++;
        if (cptx == 4) {
            dataset.data = data;
            dataset.borderColor = "white";
            d.datasets.push(dataset);
            dataset = {};
            data = [];
            cpty++;
            cptx = 1;
        }
    });

    function radiusmatch(value) {
      return (value*50)
    }

    var sec = document.getElementById("dataviz-section");
    if (sec !== null) {
        sec.remove();
    }
    sec = document.getElementById("dataviz").appendChild(document.createElement('section'));
    sec.setAttribute("id", "dataviz-section");

    var canvas = document.getElementById("canvas-dataviz");
    if (canvas !== null) {
        canvas.remove();
    }

    canvas = document.createElement('canvas');
    canvas.setAttribute("id", "canvas-dataviz");

    var cvs = sec.appendChild(canvas);
    var ctx = cvs.getContext("2d");

    var chart = new Chart(ctx, {
        type: 'bubble',
        data: d,
        options: {
            title: {
                display: false,
            },
            legend: {
                display: false
            },
            elements: {
                point: {
                    backgroundColor: function (context) {
                        var value = context.dataset.data[context.dataIndex];
                        return pointsColor[value.y - 1][value.x - 1];
                    }
                }
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return [(value.percentage*100).toFixed(1) +  " %"];
                    }
                }
            },
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        callback: function(value){
                            return labelsx[value-1];
                        },
                        beginAtZero: true,
                        stepSize: 1,
                        max: 4
                    }
                }],
                yAxes: [{
                    display: true,
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        callback: function(value){
                                return labelsy[value-1];
                        },
                        beginAtZero: true,
                        stepSize: 1,
                        max: 5
                    }
                }]
            }
        }
    });

}
