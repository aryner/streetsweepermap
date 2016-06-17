// TODO
// 3 - split lines to either side of the street
// 4 - create color gradient for distance from street cleaning 
// 5 - apply above to the lines
// 6 - prevent repeat queries and redrawing
// 7 - style 
// 8 - refactor everything

var map;
var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});

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
    console.log(zoom);

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
    drawLine(map, routesJson[i].path, '#ff0000');
  }
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

// random line
var coords = [{lat: 37.7598248, lng: -122.4573765},{lat: 37.7405511, lng: -122.4156628}]
drawLine(map, coords, '#ff0000')


