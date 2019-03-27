function convert_to_geojson(json){
    console.log(json)
    geojson = {}
    geojson.type = 	"FeatureCollection"
    geojson.features = []

    json.forEach(function (station) {
      {
        station.type = "Feature",
        station.geometry = {
          "type": "Point",
          "coordinates": [station.position.lng, station.position.lat]
        },
        station.properties = {
          "name": station.name
        }

        geojson.features.push(station)
      }
    })
    console.log(geojson)
    return geojson
}

var Map = {
    // stockage de l'Api JCDecaux open data dans Map
    velibApi: 'https://api.jcdecaux.com/vls/v1/stations?contract=nantes&apiKey=93d5179e7169f9d205bbdc2d581d485573a4df83',
    map: null,
    reservationPanel: $('.reservation'),
    stationName: $('.station-name'),
    stationAddress: $('.station-address'),
    availableBikes: $('.available-bikes'),
    infoStationPanel: $('.info-station'),
    reservationButton: $('.reservation-button'),
    submitButton: $('#submit'),
    currentReservMessage: $('.footer-text'),
    cancelReservation: $('.cancel'),
    timerText: $('.timer-text'),
    x: null,

    // Ajout d'une carte via Mapbox, définition du style utilisé et de la localisation
    init: function () {
        mapboxgl.accessToken = 'pk.eyJ1Ijoibnl2cmlzdGhyaXQiLCJhIjoiY2p0YTJsNjlwMDZuejQ0bGkxb2U0NXJobCJ9.AYOlZKYg2k8-LpgBoSXRuw';
        Map.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/nyvristhrit/cjtab00bk119l1fpeoeyybdjt',
          center: [-1.553890, 47.217220],
          zoom: 12.8,
          showZoom: true,
        });

    //Active le panneau de controle afin de pouvoir Zoomer et désactive le compas
        Map.map.addControl(new mapboxgl.NavigationControl({showCompass: false}));

        Map.hideCountDownPanel();
        Map.callApiVelib();
    },

    // when there isn't a current reservation : no countdown, no cancel button
    hideCountDownPanel: function () {
        Map.timerText.hide();
        Map.cancelReservation.hide();
    },

    // Hide precedent station informations on click on a different station
    hideInfosStation: function () {
        Map.reservationPanel.fadeOut();
        Map.stationName.hide();
        Map.stationAddress.hide();
        Map.availableBikes.hide();
    },

    countDown: function() {
        var finishDate = new Date().getTime() + 1200000;
        Map.x = setInterval(function() {
            var now = new Date().getTime();

            var distance = finishDate - now;

            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            // Display the result in the element with id="demo"
            Map.timerText.fadeIn();
             Map.timerText.text(minutes + "m " + seconds + "s ");

            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(Map.x);
                Map.currentReservMessage.text('Votre réservation à expiré');
                Map.timerText.text('');
            }


        }, 999);

    },

    // Call of the velibAPI, display markers and clusterers, reservation, and countdown
    callApiVelib: function () {
        ajaxGet(Map.velibApi, function (reponse) {
            // On range la réponse dans un tableau stations
            var stations = JSON.parse(reponse);
            let stations_in_geojson = convert_to_geojson(stations)

            Map.map.on('load', function () {
                Map.map.addSource("stations", {
                    type: "geojson",
                    data: stations_in_geojson,
                    cluster: true,
                    clusterMaxZoom: 14, // Max zoom to cluster points on
                    //clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                });

                Map.map.addLayer({
                    id: "clusters",
                    type: "circle",
                    source: "stations",
                    filter: ["has", "point_count"],
                    paint: {
                        "circle-color": [
                            "step",
                            ["get", "point_count"],
                            "#FF8300",
                            100,
                            "grey"
                        ],
                        "circle-radius": [
                            "step",
                            ["get", "point_count"],
                            25,
                            100,
                            50
                        ]
                    }
                });

                Map.map.addLayer({
                    id: "cluster-count",
                    type: "symbol",
                    interactive: true,
                    source: "stations",
                    filter: ["has", "point_count"],
                    layout: {
                        "text-field": "{point_count_abbreviated}",
                        "text-font": ["Open Sans Regular", "Arial Unicode MS Bold"],
                        "text-size": 13
                    },
                    paint: {
                      "text-color": "white"
                    }
                });

                Map.map.addLayer({
                    id: "unclustered-point",
                    type: "circle",
                    source: "stations",
                    filter: ["!", ["has", "point_count"]],
                    paint: {
                        "circle-color": "#FF8300",
                        "circle-radius": 8,
                        "circle-stroke-width": 2,
                        "circle-stroke-color": "#fff"
                    }
                });
            }) // Map on load

            // inspect a cluster on click
            Map.map.on('click', 'clusters', function (e) {
              var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
              var clusterId = features[0].properties.cluster_id;
                map.getSource('stations').getClusterExpansionZoom(clusterId, function (err, zoom) {
                  if (err)
                  return;

                map.easeTo({
                  center: features[0].geometry.coordinates,
                  zoom: zoom
                });
          });
      });


              /*  // Display infosStations on click on the marker
                Map.$('#unclustered-point').addListener('click', function () {
                    Map.hideInfosStation();
                    Map.reservationButton.css('display', 'block');
                    Map.stationName.text(station.name);
                    Map.stationAddress.text('Adresse : ' + station.address);
                    Map.availableBikes.text('Bicloo(s) disponible(s) : ' + station.available_bikes);
                    Map.stationName.fadeIn('slow');
                    Map.stationAddress.fadeIn('slow');
                    Map.availableBikes.fadeIn('slow');
                    // On click on a marker, smooth scroll to the informations panel for a better experience for mobile devices
                    $('html, body').animate({
                        scrollTop: Map.infoStationPanel.offset().top},
                        'slow'
                    );*/


                        Map.hideInfosStation();
                        Map.reservationButton.css('display', 'block');
                        Map.stationName.text(station.name);
                        Map.stationAddress.text('Adresse : ' + station.address);
                        Map.availableBikes.text('Bicloo(s) disponible(s) : ' + station.available_bikes);
                        Map.stationName.fadeIn('slow');
                        Map.stationAddress.fadeIn('slow');
                        Map.availableBikes.fadeIn('slow');
                        // On click on a marker, smooth scroll to the informations panel for a better experience for mobile devices
                        $('html, body').animate({
                            scrollTop: Map.infoStationPanel.offset().top},
                            'slow'
                        );

                    // Display the panel of reservation on click on the reservation button
                    Map.reservationButton.click(function () {
                        if (station.available_bikes > 0) {
                            Map.reservationPanel.css('display', 'block');
                            Map.availableBikes.text('Il y a ' + station.available_bikes + ' bicloo(s) disponible(s) à réserver');
                        } else {
                            Map.availableBikes.text('Il n\' y a aucun bicloo disponible dans cette station');
                            Map.reservationButton.css('display', 'none');
                            Map.reservationPanel.css('display', 'none');
                        }
                        // On click on a marker, smooth scroll to the reservation panel for a better experience for mobile devices
                        $('html, body').animate({
                        scrollTop: Map.reservationPanel.offset().top},
                        'slow'
                    );
                    });

                    // Register reservation on validation
                    Map.submitButton.click(function () {
                        sessionStorage.setItem('name', station.name);
                        Map.reservationPanel.css('display', 'none');
                        Map.reservationButton.css('display', 'none');
                        Map.availableBikes.text('Vous avez réservé un bicloo à cette station');
                        Map.currentReservMessage.text('Vous avez réservé un bicloo à la station ' + sessionStorage.name + ' pour ');
                        Map.cancelReservation.show();
                        // Reset a precedent countdown if there was a precedent reservation
                        clearInterval(Map.x);
                        // Start a new countdow for the current reservation
                        Map.countDown();

                        // Annulation of the reservation
                        Map.cancelReservation.click(function () {
                            clearInterval(Map.x);
                            Map.currentReservMessage.text('');
                            Map.timerText.text('Réservation annulée');
                            Map.cancelReservation.hide();
                        })
                });
            })
        },

    }

$(function () {
    Map.init();

})
