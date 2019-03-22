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
          scrollZoom: false,
          showZoom: true
        });

//Active le panneau de controle afin de pouvoir Zoomer
        Map.map.addControl(new mapboxgl.NavigationControl());

        Map.hideCountDownPanel();
        Map.callApiVelib();
    },

    // Add a marker clusterer to manage the markers.
    displayMarkerCluster: function (map, markers) {
        var markerCluster = new MarkerClusterer(Map.map, markers, {
            imagePath: 'img/m/m',

        });
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

  /*  // Call of the velibAPI, display markers and clusterers, reservation, and countdown
    callApiVelib: function () {
        ajaxGet(Map.velibApi, function (reponse) {
            // Answer in a Javascript array
            var stations = JSON.parse(reponse);
            markers = [];
            // For each station : we create a marker on the map + we define actions on click on this marker
            stations.forEach(function (station) {
                //console.log(station.position);
                var marker = new mapboxgl.Marker({
                    latitude: station.position.lat,
                    longitude: station.position.lng,
                    map: Map.map,
                    title: station.name,
                });
                console.log(marker.latitude);
                markers.push(marker);*/

      // Call of the velibAPI, display markers and clusterers, reservation, and countdown
      callApiVelib: function () {
          ajaxGet(Map.velibApi, function (reponse) {
              // On range la réponse dans un tableau stations
              var stations = JSON.parse(reponse);
              // For each station : we create a marker on the map + we define actions on click on this marker
              stations.forEach(function (station) {
                  //console.log(station.position); OK
                  //console.log(station.position.lat); OK
                  Map.map.addSource('point', { type: 'geojson', geometry: {"coordinates": [station.position.lat, station.position.lng]}
                });
                  markers.push(marker);


                // Display infosStations on click on the marker
                marker.addListener('click', function () {
                    Map.hideInfosStation();
                    Map.reservationButton.css('display', 'block');
                    Map.stationName.text(station.name);
                    Map.stationAddress.text('Adresse : ' + station.address);
                    Map.availableBikes.text('Vélib(s) disponible(s) : ' + station.available_bikes);
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
                            Map.availableBikes.text('Il y a ' + station.available_bikes + ' vélib(s) disponible(s) à réserver !');
                        } else {
                            Map.availableBikes.text('Il n\' y a aucun vélib disponible à réserver !');
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
                        Map.availableBikes.text('Vous avez réservé 1 vélib à cette station');
                        Map.currentReservMessage.text('Vous avez réservé 1 vélib à la station ' + sessionStorage.name + ' pour ');
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
                    })
                });
            })
            Map.displayMarkerCluster(map, markers);
        })
    },

}


$(function () {
    Map.init();

})

/*var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [-1.553890, 47.217220],
    zoom: 12.8
});

map.on('load', function () {

    // Add a source and layer displaying a point which will be animated in a circle.
    map.addSource('point', {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": [
            { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-1.553890,47.217220, 0.0 ] } },
            { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-1.553899, 47.217229, 105.5 ] } }
          ]
        }
    });



    map.addLayer({
        "id": "point",
        "source": "point",
        "type": "circle",
        "paint": {
            "circle-radius": initialRadius,
            "circle-radius-transition": {duration: 0},
            "circle-opacity-transition": {duration: 0},
            "circle-color": "green"
        }
    });

    map.addLayer({
        "id": "point1",
        "source": "point",
        "type": "circle",
        "paint": {
            "circle-radius": initialRadius,
            "circle-color": "black"
        }
    });


    function animateMarker(timestamp) {
        setTimeout(function(){
            requestAnimationFrame(animateMarker);

            radius += (maxRadius - radius) / framesPerSecond;
            opacity -= ( .9 / framesPerSecond );

            map.setPaintProperty('point', 'circle-radius', radius);
            map.setPaintProperty('point', 'circle-opacity', opacity);

            if (opacity <= 0) {
                radius = initialRadius;
                opacity = initialOpacity;
            }

        }, 1000 / framesPerSecond);

    }

    // Start the animation.
    animateMarker(0);
});*/
