
function miniStats(regionStats, d) {
    var colorsForRegion = [
        "rgba(240,101,85,1)",
        "rgba(244,133,64,1)",
        "rgba(248,165,43,1)",
        "rgba(251,157,21,1)",
        "rgba(255,229,0,1)",
        "rgba(225,223,36,1)",
        "rgba(195,216,76,1)",
        "rgba(165,210,113,1)",
        "rgba(135,203,151,1)",
        "rgba(105,197,185,1)"
    ];

    //1 : conjoncture / number / multibubble
    fetch("/capeb/data/" + d.properties.siren_epci + "/conjoncture")
        .then(function (value) {
            return value.json();
        })
        .catch(function (error) {
            console.log("error");
            console.log(error);
            return {};
        })
        .then(function (json) {
            var dataFrame = document.getElementsByClassName("info-conjoncture")[0];
            dataFrame.getElementsByClassName("donnee")[0].innerHTML = parseFloat(json.values[0][0]).toFixed(1);
            dataFrame.style.backgroundColor = colorsForRegion[matchColor(json.values[0][0], 2.87, 3.78, 0.182, 0.244, false)];
            $('#card-conjoncture .open').each(function(){
                $(this).on('click', function() {
                    document.getElementById("modal-nom-epci").innerHTML = d.properties.nom_comple + " - Conjoncture";
                    var texte = document.getElementById("texte-conjoncture");
                    texte.className += " active-dataviz-text";
                    texte.style.display = "block";
                    fetchConjonctureData(d);
                    closeOnEscape();
                });
            });

        });

    //2 : Investissement /  / chart over time compared with region
    fetch("/capeb/data/" + d.properties.siren_epci + "/investissement")
        .then(function (value) {
            return value.json();
        })
        .catch(function (error) {
            console.log("error");
            console.log(error);
            return {};
        })
        .then(function (json) {
            var dataFrame = document.getElementsByClassName("info-investissement")[0];
            // only 2017 and percentage of yes
            dataFrame.getElementsByClassName("donnee")[0].innerHTML = (json.values[3][1] * 100).toFixed(1);
            dataFrame.style.backgroundColor = colorsForRegion[matchColor(json.values[3][1], 0, 0.15, 0.03, 0.17, false)];

            $('#card-investissement .open').each(function(){
                $(this).on('click', function() {
                    document.getElementById("modal-nom-epci").innerHTML = d.properties.nom_comple + " - Investissement";
                    var texte = document.getElementById("texte-investissement");
                    texte.className += " active-dataviz-text";
                    texte.style.display = "block";
                    drawLineChart(json);
                    closeOnEscape();
                });
            });
        });


    //3 & 8 & 7 & 4 pour eviter re faire un fetch
    fetch("/capeb/data/" + d.properties.siren_epci + "/stats")
        .then(function (value) {
            return value.json();
        })
        .catch(function (error) {
            console.log("error");
            console.log(error);
            return {};
        })
        .then(function (stats) {
            //3 : contrats / mots avec size / sunburst
            var contrats = stats.Contrats.values.slice(1);
            var stat = contrats.map(function(val, id) {
                return {
                    "name": stats.Contrats.labels[id + 1],
                    "value": parseInt(val[val.length - 1])
                };
            });
            stat = stat.sort(function(a, b) {return b.value - a.value});

            var liste = document.getElementsByClassName("info-contrat")[0].getElementsByClassName("liste")[0];
            liste.className
            liste.innerHTML = "";
            var h = document.createElement("h1");
            liste.appendChild(h);
            h.className += "donneeliste n1";
            h.innerHTML = stat[0].name;
            var ni = "n1";
            var count = 0;
            for (var i = 1; i < 4; i++) {
                if (stat[i].value < stat[i - 1].value) {
                    count++;
                    ni = "n" + count;
                }
                h = document.createElement("h1");
                liste.appendChild(h);
                h.className += "donneeliste " + ni;
                h.innerHTML = stat[i].name;
            }

            $('#card-contrat .open').each(function(){
                $(this).on('click', function() {
                    document.getElementById("modal-nom-epci").innerHTML = d.properties.nom_comple + " - Contrat";
                    var texte = document.getElementById("texte-contrat");
                    texte.className += " active-dataviz-text";
                    texte.style.display = "block";
                    createSunburst(d);
                    closeOnEscape();
                });
            });

            //8 : DD / quel aspect le plus représenté / bubble -> camembert
            var names = stats.Developpement_durable.values[0]
            var count = stats.Developpement_durable.values[1]
            var stat2 = names.map(function(val, id) {return {"name": names[id], "value": parseInt(count[id])};});
            stat2 = stat2.sort(function(a, b) {return b.value - a.value});
            $(".info-dd h1").text(stat2[0].name)
			 $('#card-dd .open').each(function(){
                $(this).on('click', function() {
					document.getElementById("modal-nom-epci").innerHTML = d.properties.nom_comple + " - Développement durable";
                    var texte = document.getElementById("texte-dd");
                    texte.className += " active-dataviz-text";
                    texte.style.display = "block";
                    
                    drawDDChart(stats);
                    closeOnEscape();
                });
            });

            //7 : MP / oui/non plus représenté / camembert -> nuage de mots
            var dataFrame = document.getElementsByClassName("info-mp")[0];
            var mean = parseFloat(stats.Marches_publics.values[0]);
            dataFrame.getElementsByClassName("donnee")[0].innerHTML = Math.round(mean * 100);
            dataFrame.style.backgroundColor = colorsForRegion[matchColor(mean, 0, 0.227, 0.227/5, (0.5 - 0.227)/5, false)];

            $('#card-mp .open').each(function(){
                $(this).on('click', function() {
                    document.getElementById("modal-nom-epci").innerHTML = d.properties.nom_comple + " - Marchés publics";
                    var texte = document.getElementById("texte-mp");
                    texte.className += " active-dataviz-text";
                    texte.style.display = "block";
                    wordCloud(stats.FreinsMP);
                    closeOnEscape();
                });
            });
            //4 : embauche / métier qui embauche le plus/ double chart with rotation
			var asNumbers = stats.Nombre_Recrutements_Envisage_2017.values.map(Number);
            var indexOfMax = asNumbers.indexOf(Math.max(...asNumbers));
            document.getElementsByClassName("info-emploi")[0].getElementsByClassName("donneetexte")[0].innerHTML = stats.Nombre_Recrutements_Envisage_2017.labels[indexOfMax];
            $('#card-emploi .open').each(function(){
                $(this).on('click', function() {
                    document.getElementById("modal-nom-epci").innerHTML = d.properties.nom_comple + " - Embauche";
                    var texte = document.getElementById("texte-emploi");
                    texte.className += " active-dataviz-text";
                    texte.style.display = "block";
                    drawChart3dEmploi(stats);
                    closeOnEscape();
                });
            });
			
        });
    //5 : distance / moyenne / bubble chart
    fetch("/capeb/data/" + d.properties.siren_epci + "/distance")
        .then(function (value) {
            return value.json();
        })
        .catch(function (error) {
            console.log("error");
            console.log(error);
            return {};
        })
        .then(function(json){
            var dataFrame = document.getElementsByClassName("info-distance")[0];
            var mean = 0;
            json.values.forEach(function(value){
                mean+= parseFloat(value[2]);
            });
            mean/=json.values.length;
            dataFrame.getElementsByClassName("donnee")[0].innerHTML = Math.round(mean);
            dataFrame.style.backgroundColor = colorsForRegion[matchColor(mean, 24, 59, 7, 13.2, true)];

            $('#card-distance .open').each(function(){
                $(this).on('click', function() {
                    document.getElementById("modal-nom-epci").innerHTML = d.properties.nom_comple + " - Distance";
                    var texte = document.getElementById("texte-distance");
                    texte.className += " active-dataviz-text";
                    texte.style.display = "block";
                    drawDistanceDataviz(json);
                    closeOnEscape();
                });
            });
        });
}

//order = true : low is good
//order = false : high is good
function matchColor(value, min, mean, firstInc, secondInc, order){
    var r;
    if(value <= min+firstInc ){
        r = (order ? 9 : 0);
    } else if(value<= min+firstInc *2){
        r = (order ? 8 : 1);
    } else if(value<= min+firstInc *3){
        r =  (order ? 7 : 2);
    } else if(value<= min+firstInc *4){
        r =  (order ? 6 : 3);
    } else if(value<= min+firstInc *5){
        r =  (order ? 5 : 4);
    } else if(value<= mean+secondInc){
        r =  (order ? 4 : 5);
    } else if(value<= mean+secondInc *2){
        r =  (order ? 3 : 6);
    } else if(value<= mean+secondInc *3){
        r =  (order ? 2 : 7);
    } else if(value<= mean+secondInc *4){
        r =  (order ? 1 : 8);
    } else if(value<= mean+secondInc *5){
        r =  (order ? 1 : 9);
    }
    return r;
}

function createModal(){
    if($("#containerForModal")!==null){
        $("#containerForModal").remove();
    }

    var div = document.createElement('div');
    div.id = "containerForModal";
    div.innerHTML = document.getElementById('blockOfStuff').innerHTML;
    document.getElementsByClassName('partie-dashboard')[0].appendChild(div);

    var $modal = $('.modal-frame');
    var $overlay = $('.modal-overlay');

    /* Need this to clear out the keyframe classes so they dont clash with each other between enter/leave. */
    $modal.bind('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
        if ($modal.hasClass('state-leave')) {
            $modal.removeClass('state-leave');
        }
    });

    $('.close').on('click', function () {
        $overlay.removeClass('state-show');
        $modal.removeClass('state-appear').addClass('state-leave');
        $("#dataviz").empty();
        document.getElementById("modal-nom-epci").innerHTML = "";
        var texte = document.getElementsByClassName("active-dataviz-text")[0];
        if(texte !== null){
            texte.style.display = "none";
            texte.className = "texte-dataviz";
        }
    });


    $('.open').each(function(){
        $(this).on('click', function () {
                $overlay.addClass('state-show');
                $modal.removeClass('state-leave').addClass('state-appear');
            });
        });
}

function closeOnEscape() {
    $(document).one('keyup', function (e) {
        if (e.keyCode == 27) { // escape key maps to keycode 27
            $('.close').click();
        }
    });
}
