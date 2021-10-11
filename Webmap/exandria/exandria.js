// Version 1.3

// use your mapbox access token below
mapboxgl.accessToken = '<PUT YOUR MAPBOX TOKEN HERE>';
var defaultZoom = 3.8;
// lon, lat
var bounds = [[-65,-30],[97,40]];
var defaultCenter = [11.806, 5.193];
var defaultBearing = 0;
var defaultPitch = 0;
// intent to let users toggle between units.
var units = "mi";

if(screen.width < 600){
  defaultZoom = 3;
  bounds = [[-20,-40],[65,50]];
}

if (sessionStorage.getItem("is_reloaded")){
  defaultZoom = sessionStorage.getItem("zoom");
  defaultCenter = [Number(sessionStorage.getItem("long")),Number(sessionStorage.getItem("lat"))];
  defaultBearing = sessionStorage.getItem("bearing");
  defaultPitch = sessionStorage.getItem("pitch");
}

sessionStorage.setItem("is_reloaded", true);
var map = new mapboxgl.Map({
container: 'map',
// Exandria Map tiles
style: 'mapbox://styles/rossthorn/ckbp6ladn41cv1hjypubbuiiv',
// if you wish to use the individual continents, create an account on mapbox.com and copy
// them to your account
// wildemount: https://api.mapbox.com/styles/v1/rossthorn/ck8s05ej60kpo1inxus2e9hdm.html?title=copy&access_token=pk.eyJ1Ijoicm9zc3Rob3JuIiwiYSI6ImNpdW9mNWRobjAxNjUydHBoOTV2aGFhYW4ifQ._gXtryi8ORM28NdR7aXcCg&zoomwheel=true&fresh=true#5.08/4.99/20.98
// tal'dorei: https://api.mapbox.com/styles/v1/rossthorn/ck7s1xop62ze91iphvnd1sbcx.html?title=copy&access_token=pk.eyJ1Ijoicm9zc3Rob3JuIiwiYSI6ImNpdW9mNWRobjAxNjUydHBoOTV2aGFhYW4ifQ._gXtryi8ORM28NdR7aXcCg&zoomwheel=true&fresh=true#5.19/3.432/-0.983
center: defaultCenter,
zoom: defaultZoom,
maxZoom: 12,
minZoom: 3,
maxBounds: bounds,
bearing: defaultBearing,
pitch: defaultPitch,
maxPitch: 69
});

// physical labels
// big labels => zoom level 6
// small labels => zoom level 7

// these are routed to the Data folder which is also connected to the QGIS map document
// for data editing. If you change the exandria data there, it will also change in the
// web map once those edits are published to wherever you're hosting your site.
// however, if you change places there, be sure to also remove them from the
// exandria_search.geojson under Webmap/exandria.
var cities = "../Data/OSE/exandria_cities.geojson";
var pois = "../Data/OSE/exandria_pois.geojson";
var geojson;
var linestring;

var distanceContainer = document.getElementById('distance');
var measuring = false;

// some functionality to log map movements as well as use session storage to 
// know where the last viewed location is
map.on('moveend', function() {
    // console.log('zoom',map.getZoom());
    // console.log('center',map.getCenter());
    sessionStorage.setItem("zoom", map.getZoom());
    sessionStorage.setItem("long", map.getCenter().lng);
    sessionStorage.setItem("lat", map.getCenter().lat);
    sessionStorage.setItem("pitch", map.getPitch());
    sessionStorage.setItem("bearing", map.getBearing());
});

var cityIconOptions =
  [
  "interpolate", ["linear"], ["zoom"],
    // zoom is 4 (or less) -> circle radius will be minimum size
    4, 0.05,
    // zoom is 18 (or greater) -> circle radius will be maximum size
    12, 0.2
  ];
var cityLabelOptions =
  [
  "interpolate", ["linear"], ["zoom"],
    // zoom is 0 (or less) -> text will be minimum size
    0, 10,
    // zoom is 5 (or greater) -> text will be maximum size
    10, 16
  ];

  var poiIconOptions = 
  [
    'step', // arg 1
    ['zoom'], // arg 2
      0, // arg 3
    4.5, 0.04,  // rest of the expression is arg 4
    5, 0.06,
    6, 0.07
   ];

  var poiLabelOptions = 
  [
    'step', // arg 1
    ['zoom'], // arg 2
      0, // arg 3
    4.5, 10,  // rest of the expression is arg 4
    5, 11,
    6, 14
   ];

map.on('load',function(){
  //url, layername, icon, source, radialOffset, iconOptions, labelOptions
  loadPoints(pois, 'poi_points','images/cr_icon_poi.png', 'pois', [0.04,0.7], poiIconOptions, poiLabelOptions, 1);
  loadPoints(cities, 'city_points','images/cr_icon_pop.png', 'cities', [0.01,0.6], cityIconOptions, cityLabelOptions, 0);
});

function createPopup(e){
  var coordinates = e.features[0].geometry.coordinates.slice();
  var name = e.features[0].properties.Name;
  var population = e.features[0].properties.Population;
  var category = e.features[0].properties.Type;
  var info =  e.features[0].properties.Info;
  var popupContent;
  if (category != 'null' && category != undefined){
    popupContent = "<p>"+category+ " of</p><h2 style='padding-bottom: 5px;'>"+name+"</h2><hr>";
  } else {
    popupContent = "<h2 style='padding-bottom: 5px;'>"+name+"</h2><hr>";
  }

  if (population != 'null' && population != undefined){
    popupContent += ("<h3>Population: </h3>" + String(population));
  }

  if (info != 'null'){
    popupContent += ("<h3>Description: </h3>" + info);
  }

  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  new mapboxgl.Popup()
  .setLngLat(coordinates)
  .setHTML(popupContent)
  .addTo(map);
}

function loadPoints(url, layername, icon, source, radialOffset, iconOptions, labelOptions, sortkey){
  map.loadImage(icon, function(error, image) {
    var iconLayer = 'icon_' + layername;
  if (error) throw error;
    map.addImage(iconLayer, image);
      map.addSource(source, { type: 'geojson', data: url});
      map.addLayer({
        "id": layername,
        "type": "symbol",
        "source": source,
        "layout": {
          "icon-image": iconLayer,
          "icon-size": iconOptions,
          "icon-allow-overlap": false,
          "text-allow-overlap": false,
          "text-field": ["get", "Name"],
          "text-size": labelOptions,
          "text-variable-anchor": ["top", "bottom", "left", "right"],
          "text-radial-offset": [
          "interpolate", ["linear"], ["zoom"],
            // zoom is 0 (or less) -> circle radius will be minimum size
            0, radialOffset[0],
            // zoom is 5 (or greater) -> circle radius will be maximum size
            5, radialOffset[1]
          ],
          "text-justify": "left",
          "symbol-sort-key": sortkey
        },
        "paint": {
          // symbol label options
          "text-halo-color": "#fff7e4",
          "text-halo-width": 2
        }
    });
  
  });
  
  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', layername, createPopup);
  
  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', layername, function () {
  map.getCanvas().style.cursor = 'pointer';
  });
  
  // Change it back to a pointer when it leaves.
  map.on('mouseleave', layername, function () {
  map.getCanvas().style.cursor = '';
  });
  
  
  }

function mouseMoveMeasure(e){
  var features = map.queryRenderedFeatures(e.point, {
  layers: ['measure-points']
  });
  // UI indicator for clicking/hovering a point on the map
  map.getCanvas().style.cursor = features.length ? 'pointer' : 'crosshair';
}

function clickMeasureFunction(e){
  var unitDivisor;
  // this is where that unit toggle functionality would come into play.
  // if you wish to do your own distance multiplier, change the unitDivisor value
  if (units == "mi"){
    unitDivisor = 1.609;
  } else {
    unitDivisor = 1;
  }
  var features = map.queryRenderedFeatures(e.point, {
  layers: ['measure-points']
  });

  // Remove the linestring from the group
  // So we can redraw it based on the points collection
  if (geojson.features.length > 1) geojson.features.pop();

  // Clear the Distance container to populate it with a new value
  distanceContainer.innerHTML = '';

  // If a feature was clicked, remove it from the map
  if (features.length) {
  var id = features[0].properties.id;
  geojson.features = geojson.features.filter(function(point) {
  return point.properties.id !== id;
  });
  } else {
  var point = {
  'type': 'Feature',
  'geometry': {
  'type': 'Point',
  'coordinates': [e.lngLat.lng, e.lngLat.lat]
  },
  'properties': {
  'id': String(new Date().getTime())
  }
  };

  geojson.features.push(point);
  }

  if (geojson.features.length > 1) {
  linestring.geometry.coordinates = geojson.features.map(function(
  point
  ) {
  return point.geometry.coordinates;
  });

  geojson.features.push(linestring);

  // Populate the distanceContainer with total distance
  var value = document.createElement('pre');
  value.textContent =
  'Total distance: ' +
  (Math.round((turf.lineDistance(linestring)/unitDivisor)*1.05*10)/10).toLocaleString() +
  ' '+units;
  distanceContainer.appendChild(value);
  // document.getElementsByClassName('btn-container')[0].style.top = "30px";
  }

  map.getSource('geojson').setData(geojson);
}

function rightClickRemove(e){
  if (e.button == 2){
    var measureBtnElement = document.getElementsByClassName('mapbox-gl-measure')[0];
    measuring = !measuring;
    removeMeasure(measureBtnElement);
  }
}

class MapboxGLButtonControl {
  constructor({
    className = "",
    title = "",
    eventHandler = evtHndlr
  }) {
    this._className = className;
    this._title = title;
    this._eventHandler = eventHandler;
  }

  onAdd(map) {
    this._btn = document.createElement("button");
    this._btn.className = "mapboxgl-ctrl-icon" + " " + this._className;
    this._btn.type = "button";
    this._btn.title = this._title;
    this._btn.onclick = this._eventHandler;

    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

function homeView(event){

  var homeZoom = 3.8;
  var homeCenter = [11.806, 5.193];
  var homeBearing = 0;

  if(screen.width < 600){
    homeZoom = 3;
  }
  map.flyTo({
center: homeCenter,
bearing: homeBearing,
pitch: 0,
zoom: homeZoom,
speed: 1.2,

easing: function(t) {
return t;
},
essential: true
});
}

function measure(event){
    document.getElement
    // remove popup from geojson points
    map.off('click', 'city_points', createPopup);
    map.off('click', 'poi_points', createPopup);
    measuring = !measuring;
    var measureBtnElement = document.getElementsByClassName('mapbox-gl-measure')[0];
    if (measuring === true){
      measureBtnElement.style.backgroundColor = '#dfdfdf';
      // GeoJSON object to hold our measurement features
     geojson = {
        'type': 'FeatureCollection',
        'features': []
        };

        // Used to draw a line between points
        linestring = {
        'type': 'Feature',
        'geometry': {
        'type': 'LineString',
        'coordinates': []
        }
        };
        map.addSource('geojson', {
        'type': 'geojson',
        'data': geojson
        });

        // Add styles to the map
        map.addLayer({
        id: 'measure-points',
        type: 'circle',
        source: 'geojson',
        paint: {
        'circle-radius': 5,
        'circle-color': '#000'
        },
        filter: ['in', '$type', 'Point']
        });
        map.addLayer({
        id: 'measure-lines',
        type: 'line',
        source: 'geojson',
        layout: {
        'line-cap': 'round',
        'line-join': 'round'
        },
        paint: {
        'line-color': '#000',
        'line-width': 2.5
        },
        filter: ['in', '$type', 'LineString']
        });

        map.on('click', clickMeasureFunction);

        map.on('mousemove', mouseMoveMeasure);

        document.addEventListener('mousedown', rightClickRemove);
    }
    else {
      removeMeasure(measureBtnElement);

    }
}

function removeMeasure(measureBtnElement){
  // readd popup for geojson points
  map.on('click', 'city_points', createPopup);
  map.on('click', 'poi_points', createPopup);
  var distanceElement = document.getElementById('distance');
  distanceElement.innerHTML = '';
  if (map.getLayer('measure-points')){
    map.removeLayer('measure-points');
  }
  if (map.getLayer('measure-lines')){
   map.removeLayer('measure-lines');
  }
  // Remove the event handler from <div>
  map.off("mousemove", mouseMoveMeasure);
  map.off("click", clickMeasureFunction);
  measureBtnElement.style.backgroundColor = '#ffffff';
  map.removeSource('geojson');
  // UI indicator for clicking/hovering a point on the map
  map.getCanvas().style.cursor = 'pointer';
  document.removeEventListener('mousedown', rightClickRemove);
}

function zoomToLocation(poi){
  // console.log(poi);

  var coord = poi.coordinates;
  map.flyTo({
    center: coord,
    bearing: 0,
    pitch: 0,
    zoom: poi.zoom,
    speed: 1.2,
    
    
    easing: function(t) {
    return t;
    },
    essential: true
    });

    // clear searchbox
    $("#searchbox").val("")
}

var options = {
  url: "exandria/exandria_search.geojson",

  getValue: "Name",

  list: {
    match: {
      enabled: true
    },
    onChooseEvent: function(){
      var poi = $("#searchbox").getSelectedItemData();
      zoomToLocation(poi);
  }
},
};
$("#searchbox").easyAutocomplete(options);

map.addControl(new mapboxgl.NavigationControl({
}), 'top-left');

var homeBtn = new MapboxGLButtonControl({
  className: "mapbox-gl-home",
  title: "Default View",
  eventHandler: homeView
});

var measureBtn = new MapboxGLButtonControl({
  className: "mapbox-gl-measure",
  title: "Measure",
  eventHandler: measure
});

map.addControl(homeBtn, "top-left");
map.addControl(measureBtn, "top-left");

var mapcontrol = document.getElementsByClassName('mapboxgl-ctrl-top-left')[0];
var unitDiv = document.createElement("div");
unitDiv.setAttribute("id", "unit-radio");
mapcontrol.appendChild(unitDiv);