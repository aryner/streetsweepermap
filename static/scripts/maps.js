// TODO
// 5 - apply above to the lines
//  5.1 - ensure that the lines are split the correct way
// 6 - prevent repeat queries and redrawing
// 7 - style 
// 8 - refactor everything

var map;
var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});
var colors = ['#ff0000','#ff8800','#ffff00','#88ff00','#00ff00'];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7598564, lng: -122.4349647},
    zoom: 15
  });

  map.mapTypes.set('map_style',styledMap);
  map.setMapTypeId('map_style');
  map.addListener('bounds_changed', function() {
    var zoom = map.getZoom();
    if (zoom < 16) return;

    var bounds = map.getBounds();
    var tl = {lat: bounds.H.j, lng: bounds.j.j};
    var br = {lat: bounds.H.H, lng: bounds.j.H};

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        drawRoutes(JSON.parse(xmlHttp.responseText));
      }
    }
    xmlHttp.open("GET", "http://localhost:5000/routes/"+br.lat+"&"+tl.lng+"&"+tl.lat+"&"+br.lng, true);
    xmlHttp.send(null);
  });
  
  return map;
}

function drawRoutes(routesJson) {
  for (var i=0; i<routesJson.length; i++) {
    path = shiftSide(routesJson[i].path,routesJson[i].side)
    drawLine(map, path, '#ff0000');
  }
}

function shiftSide(coords, side) {
  var shift = side == 1 ? 0.00005 : -0.00005;
  for (var i=0; i<coords.length; i++) {
    coords[i].lat += shift;
    coords[i].lng += shift;
  }
  return coords;
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


