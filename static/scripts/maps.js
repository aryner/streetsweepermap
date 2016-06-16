var map;
var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7598564, lng: -122.4349647},
    zoom: 12
  });

  map.mapTypes.set('map_style',styledMap);
  map.setMapTypeId('map_style');
}

initMap()
