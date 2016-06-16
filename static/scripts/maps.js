var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7598564, lng: -122.4349647},
    zoom: 12
  });
}

initMap()
