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
          showZoom: true,
        });

//Active le panneau de controle afin de pouvoir Zoomer et désactive le compas
        Map.map.addControl(new mapboxgl.NavigationControl({showCompass: false}));

        Map.hideCountDownPanel();
        Map.callApiVelib();
    },

    // Add a marker clusterer to manage the markers.
    /*displayMarkerCluster: function (map, markers) {
        var markerCluster = new MarkerClusterer(Map.map, markers, {
            imagePath: 'img/m/m',

        });
    },*/

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
              Map.map.on('load', function () {
                  stations.forEach(function (station) {
                      console.log(station)
                      console.log(station.position); // OK
                      console.log(station.position.lat); // OK

                      let sourceName = 'point_'+station.number
                      let layerName = 'layer_'+station.number

                      Map.map.addSource(sourceName, {
                          "type": "geojson",
                          "data": {
                              "type": "Point",
                              "coordinates": [station.position.lat, station.position.lng]
                          }
                      });

                      Map.map.addLayer({
                          "id": layerName,
                          "source": sourceName,
                          "type": "circle",
                          "paint": {
                              "circle-radius": 10,
                              "circle-color": "pink"
                          }
                      });
                  }); // foreach
              })
          })
      }, // callApiVelib
}


$(function () {
    Map.init();

})
