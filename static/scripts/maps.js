// TODO
// 6 - debug the colors drawn
// 7 - style 
// 8 - refactor everything
// 9 - account more than day differences
// 10 - account for routes that have more than one day
// 11 - account for nw vs ew roads because the shift currently only works for one or the other

var map;
var queriedId = [];
var querriedBounds = null;
var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});
var colors = ['#ff0000','#ff8800','#ffff00','#88ff00','#00ff00'];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7598564, lng: -122.4349647},
    zoom: 13
  });

  map.mapTypes.set('map_style',styledMap);
  map.setMapTypeId('map_style');
  //map.addListener('bounds_changed', function() {
  map.addListener('idle', function() {
    var zoom = map.getZoom();
    if (zoom < 15) return;

    var bounds = map.getBounds();
    //var tl = {lat: bounds.H.j, lng: bounds.j.j};
    //var br = {lat: bounds.H.H, lng: bounds.j.H};
    var tl = {lat: bounds.f.b, lng: bounds.b.b};
    var br = {lat: bounds.f.f, lng: bounds.b.f};

    //TODO
    //have a drawn bounds variable 
    if(querriedBounds) {
      //only make querries outside this bounds 
      var toQuery = getAndDrawOutOfBounds(tl,br,querriedBounds);
      //and add them to the drawn bounds variable, 
      if (toQuery) {
        querriedBounds = {tl:toQuery.tl, br:toQuery.br};
      }
    } else {
      querriedBounds = {tl:tl, br:br};
      queryAndDraw(tl,br)
    }
  });

  return map;
}

function queryAndDraw(tl,br) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      console.log('querying');
      drawRoutes(JSON.parse(xmlHttp.responseText));
    }
  }
    
  xmlHttp.open("GET", "http://localhost:5000/routes/"+br.lat+"&"+tl.lng+"&"+tl.lat+"&"+br.lng, true);
  xmlHttp.send(null);
}

function getAndDrawOutOfBounds(tl, br, bounds) {
  // up++, right++
  var t = tl.lat > bounds.tl.lat ? true : false;
  var r = br.lng > bounds.br.lng ? true : false;
  var b = br.lat < bounds.br.lat ? true : false;
  var l = tl.lng < bounds.tl.lng ? true : false;

  if(!(t || r || b || l)) return null;

  //padding
  var lngP = 0.01; 
  var latP = 0.01;
  if(t) {
    if (l) {
      queryAndDraw({lat:tl.lat+latP,lng:tl.lng-lngP},bounds.br);
    } else {
      queryAndDraw({lat:tl.lat+latP,lng:bounds.tl.lng},bounds.br);
    }
  } else if (l) {
    queryAndDraw({lat:bounds.tl.lat,lng:tl.lng-lngP},bounds.br);
  }

  if(b) {
    if(r) {
      queryAndDraw(bounds.tl,{lat:br.lat-latP,lng:br.lng+lngP})
    } else {
      queryAndDraw(bounds.tl,{lat:br.lat-latP,lng:bounds.br.lng})
    }
  } else if (r) {
      queryAndDraw(bounds.tl,{lat:bounds.br.lat,lng:br.lng+lngP})
  }

  // do entire range or just two smallest squares?
  var newTl = {lat:Math.max(tl.lat+latP,bounds.tl.lat),lng:Math.min(tl.lng-lngP,bounds.tl.lng)};
  var newBr = {lat:Math.min(br.lat-latP,bounds.br.lat),lng:Math.max(tl.lng+lngP,bounds.tl.lng)};

  return {tl:newTl, br:newBr};
}

function drawRoutes(routesJson) {
  for (var i=0; i<routesJson.length; i++) {
    //if route id not in queriedId
    if (!queriedId.includes(routesJson[i].id)) {
      path = shiftSide(routesJson[i].path,routesJson[i].side)
      color = getColor(routesJson[i].from, routesJson[i].to, routesJson[i].weekday, routesJson[i].weeks,routesJson[i].street)
      drawLine(map, path, color);
      queriedId.push(routesJson[i].id);
    }
  }
}

function getColor(from, to, weekday, weeks, name) {
  weekday = convertDay(weekday);
  var date = new Date();
  var week = getWeek(date.getDate());
  //cases:
  // is this week
  if((week & weeks) > 0) {
    // today
    if(date.getDay() === weekday) {
      // to is still to come
      if(date.getHours() < to) {
        return colors[0];
      // to has passed or is ===
      } else {
        week = week << 1;
        // will happen next week
        if ((week & weeks) > 0) {
          return colors[3];
        // will not happen next week
        } else {
          return colors[4];
        }
      }
    // already happened this week
    } else if (date.getDay() > weekday) {
      week = week << 1;
      var daysAway = (6-date.getDay()) + weekday
      // will happen next week
      if ((week & weeks) > 0) {
        var daysAway = (6-date.getDay()) + weekday
        // more than 3 days away
        if(daysAway >= 3) {
          return colors[3];
        }
        return colors[daysAway];
      // will not happen next week
      } else {
        return colors[4];
      }
    // later this week
    } else {
      var daysAway = (6-date.getDay()) + weekday
      if(daysAway >= 3) {
        return colors[3];
      }
      return colors[daysAway];
    }
  // not this week
  } else {
    week = week << 1;
    // next week
    if ((week & weeks) > 0) {
     var daysAway = (6-date.getDay()) + weekday
     if(daysAway >= 3){
       return colors[3];
     }
     return colors[daysAway];
    // not next week
    } else {
      return colors[0];
    }
  }
  // blue means who knows
  return '#0000ff';
}

function getWeek(date) {
  week = 1;
  while(date > 7) {
    date -= 7;
    week = week << 1;
  }
  return week;
}

function convertDay(day) {
  switch(day) {
    case 'Sun':
      return 0;
    case 'Mon':
      return 1;
    case 'Tues':
      return 2;
    case 'Wed': 
      return 3;
    case 'Thurs':
      return 4;
    case 'Fri':
      return 5;
    default:
      return 6;
  }
}

function shiftSide(coords, side) {
  var shift = side == 1 ? -0.00005 : 0.00005;
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


