'use strict';
import Controller from './controller.class.js';
import Connector from './connector.class.js';
(function(){
  let controller = new Controller({
    styleURL: 'mapbox://styles/mapbox',
    mapContainer: 'map',
    geocoder: false,
    baseLayers: {
      street: 'streets-v10',
      satellite: 'cj774gftq3bwr2so2y6nqzvz4'
    },
    center: [-83.10, 42.36],
    zoom: 11,
    boundaries: {
      sw: [-83.3437,42.2102],
      ne: [-82.8754,42.5197]
    },
    sources: [
      {
        id: "scout-cars",
        type: "geojson",
        data: 'https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Scout_Car_NPO/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=area&returnHiddenFields=false&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=vLFEuryLFWPd69GBoUQQVcWXhKJXNb3iMqCBvpx6I-QNoY1cR1jPM12SBIpWOx4M2wl0RdYqm_V_qfwnWM7G7dWegoCz1APOufWgBfnkeR7rHXPn2Q8asb2QJyrRsdRvRlYdofTpi2iUIKIeep-t3vGN9mloXNirXxLSShizEb8Nwca1Cuhm7IkCTN7hVdiDxdvY0-F_IPkqZf_BxLUUyAHqA6vVwRnOZxCb3WaG9wvXyPCEFRIPBLv7fupJ1tVz'
      }
    ],
    layers: [
      {
        "id": "scout-cars-fill",
        "type": "fill",
        "source": "scout-cars",
        "maxzoom": 12.5,
        "layout": {},
        "paint": {
          "fill-color": '#9FD5B3',
          "fill-opacity": .5
        }
      },
      {
        "id": "scout-cars-borders",
        "type": "line",
        "source": "scout-cars",
        "maxzoom": 12.5,
        "layout": {},
        "paint": {
          "line-color": "#004544",
          "line-width": 3
        }
      },
      {
        "id": "scout-cars-hover",
        "type": "fill",
        "source": "scout-cars",
        "maxzoom": 12.5,
        "layout": {},
        "paint": {
          "fill-color": '#23A696',
          "fill-opacity": .5
        },
        "filter": ["==", "area", ""]
      },
      {
        'id': 'scout-cars-labels',
        'type': 'symbol',
        'source': 'scout-cars',
        "maxzoom": 12.5,
        'layout': {
          "text-font": ["Mark SC Offc Pro Bold"],
          "text-field": "{area}",
          "symbol-placement": "point",
          "text-size": 22
        },
        'paint': {
          'text-color': '#004544'
        }
      }
    ]
  });
  controller.map.map.on("mousemove", function(e, parent = this) {
    // console.log(this);
    try {
      var features = this.queryRenderedFeatures(e.point, {
        layers: ["scout-cars-fill"]
      });
      // console.log(features);
      if (features.length) {
        this.setFilter("scout-cars-hover", ["==", "area", features[0].properties.area]);
      }else{
        this.setFilter("scout-cars-hover", ["==", "area", ""]);
      }
      this.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    } catch (e) {
      console.log("Error: " + e);
    }
  });
  controller.map.map.on("click", function(e, parent = this) {
    try {
      var features = this.queryRenderedFeatures(e.point, {
        layers: ["scout-cars-fill"]
      });
      if (features.length) {
        console.log(features);
        document.getElementById('scout-car').value = features[0].properties.area;
        document.querySelector('.data-panel').className = "data-panel active";
        setTimeout(function () {
          controller.map.map.resize();
        },500);
      }else{
        console.log('no feature');
      }
    } catch (e) {
      console.log("Error: " + e);
    }
  });
  document.getElementById('volunteer-submit-btn').addEventListener('click', function(e){
    controller.submitVolunteers(controller);
  });
  // document.getElementById('query').addEventListener('click', function(e){
  //   controller.filterData(e, controller);
  // });
  let closeAlertBtns = document.querySelectorAll('.close');
  closeAlertBtns.forEach(function(btn){
    btn.addEventListener('click', function(ev){
        controller.closeAlert(ev,controller)
    });
  });
})(window);
