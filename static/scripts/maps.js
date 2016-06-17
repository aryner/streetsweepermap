var map;
var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7598564, lng: -122.4349647},
    zoom: 12
  });

  map.mapTypes.set('map_style',styledMap);
  map.setMapTypeId('map_style');
  
  return map;
}

function drawLine(map, coords, color) {
  var line = new google.maps.Polyline({
    path: coords,
    strokeColor: color,
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  line.setMap(map);
}

map = initMap()

// 37.7598248, -122.4573765
// 37.7405511, -122.4156628
var coords = [{lat: 37.7598248, lng: -122.4573765},{lat: 37.7405511, lng: -122.4156628}]
drawLine(map, coords, '#ff0000')


