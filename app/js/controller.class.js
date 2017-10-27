'use strict';
import Map from './map.class.js';
import JSUtilities from './utilities.class.js';
import Connector from './connector.class.js';
import Authenticator from './authentication.class.js';
import mapboxgl from 'mapbox-gl';
const turf = require('@turf/simplify');
const arcGIS = require('terraformer-arcgis-parser');
export default class Controller {
  constructor() {
    this.authenticator = new Authenticator();
    this.map = new Map({
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
          data: 'https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Scout_Car_NPO/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token='
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
  }
  initialLoad(){
    Connector.getData('https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Scout_Car_NPO/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=area&returnHiddenFields=false&returnGeometry=false&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=json&token=vLFEuryLFWPd69GBoUQQVcWXhKJXNb3iMqCBvpx6I-QNoY1cR1jPM12SBIpWOx4M2wl0RdYqm_V_qfwnWM7G7dWegoCz1APOufWgBfnkeR7rHXPn2Q8asb2QJyrRsdRvRlYdofTpi2iUIKIeep-t3vGN9mloXNirXxLSShizEb8Nwca1Cuhm7IkCTN7hVdiDxdvY0-F_IPkqZf_BxLUUyAHqA6vVwRnOZxCb3WaG9wvXyPCEFRIPBLv7fupJ1tVz', function(response){
      // console.log(JSON.parse(response));
      let tempHTML = "";
      JSON.parse(response).features.forEach(function(scout){
        tempHTML += '<option value="' + scout.attributes.area + '"></option>';
      });
      document.getElementById("scout-car-list").innerHTML = tempHTML;
    });
  }
  getLoginData(controller){
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    console.log(JSUtilities.emailValidator(username));
    switch (true) {
      case username === '':
        document.querySelector('#alert-overlay div').innerHTML = "Please enter your username.";
        document.getElementById('alert-overlay').className = 'active';
        break;
      case !JSUtilities.emailValidator(username):
        document.querySelector('#alert-overlay div').innerHTML = "Please enter a valid username.";
        document.getElementById('alert-overlay').className = 'active';
        break;
      case password === '':
        document.querySelector('#alert-overlay div').innerHTML = "Please enter your password.";
        document.getElementById('alert-overlay').className = 'active';
        break;
      default:
        controller.authenticator.getAuthenticated({"email":username,"password":password},controller);
    }
  }
  initialForm(ev,controller){
    switch (ev) {
      case 'v-sign-up':
        document.querySelector('#user-type-section').className = 'hidden';
        document.querySelector('main').className = '';
        break;
      case 'v-tracker':
        document.querySelector('.user-type').className = 'user-type move-left';
        document.querySelector('.login-form').className = 'login-form move-left';
        break;
      case 'v-login':
        controller.getLoginData(controller);
        break;
      case 'authenticated-user':
        console.log('loading auth user view');
        break;
      default:

    }
  }
  submitVolunteers(controller){
    let volunteers = document.getElementById('num-of-volunteers').value;
    let area = document.getElementById('scout-car').value;
    let hours = document.querySelector('input[name="hours-group"]:checked').id;
    console.log(volunteers);
    console.log(area);
    console.log(hours);
    switch (true) {
      case volunteers === '':
        document.querySelector('#alert-overlay div').innerHTML = "Need number of volunteers.";
        document.getElementById('alert-overlay').className = 'active';
        break;
      case area === '':
        document.querySelector('#alert-overlay div').innerHTML = "Need scout car area.";
        document.getElementById('alert-overlay').className = 'active';
        break;
      default:
        document.getElementById('initial-loader-overlay').className = 'active';
        console.log("ready to send");
        let dataNew = [
            {
                "id" : 0,
                "adds" : [
                    {
                        "geometry" : {
            		            "x": -83.025396,
            		            "y": 42.3488239,
                            "spatialReference": {
                              "wkid": 4326
                            }
                        },
                        "attributes" : {
                          "volunteers": 3,
                          "assign_sca": 201,
                          "date": "10_30"
                        }
                    }
                ]
            }
        ];
        let data = {"edits":{"id":0,"adds":[{"attributes":{"volunteers":"3","date":1509336000000,"sca":"102"},"geometry":{"x":0,"y":0,"spatialReference":{"wkid":4326}}}]}};
        // console.log(data);
        Connector.postData("https://cors-anywhere.herokuapp.com/"+"https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/service_e85611f4185545fab4a50ca81ca14ebf/FeatureServer/0/applyEdits?useGlobalIds=false&f=json", data, function(response){
          console.log(response);
          if(response){
            document.getElementById('initial-loader-overlay').className = '';
            console.log('item submitted');
            document.querySelector('#alert-overlay div').innerHTML = "Your form has been submitted.";
            document.getElementById('alert-overlay').className = 'active';
          }
        });
        // const url = 'https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/service_e85611f4185545fab4a50ca81ca14ebf/FeatureServer/0/applyEdits';
        // // Create our request constructor with all the parameters we need
        // var request = new Request(url, {
        //     method: 'POST',
        //     body: JSON.stringify(data),
        //     headers: new Headers()
        // });
        //
        // fetch(request)
        // .then((resp) => {
        //   console.log(resp);
        //   console.log(resp.status);
        //   if(resp.status === 200){
        //      document.getElementById('initial-loader-overlay').className = '';
        //      console.log('item submitted');
        //      document.querySelector('#alert-overlay div').innerHTML = "Your form has been submitted.";
        //      document.getElementById('alert-overlay').className = 'active';
        //    }
        // });
    }
  }
  closeAlert(ev,controller){
    console.log(ev);
    (ev.target.parentNode.parentNode.id === 'alert-overlay') ? document.getElementById('alert-overlay').className = '': document.getElementById('drill-down-overlay').className = '';
    if(ev.target.parentNode.childNodes[3].innerText === "Your form has been submitted."){
      document.querySelector('.data-panel').className = "data-panel";
      document.getElementById('num-of-volunteers').value = '';
      setTimeout(function () {
        controller.map.map.resize();
      },500);
    }
  }
  loadDrillDown(ev, controller){
    // console.log(ev);
    // console.log(ev.target.parentNode.id);
    // console.log(controller.state.selectedCompany.data[ev.target.parentNode.id]);
    let tempHTML = '<h1>District - ' + ev.target.parentNode.id + '</h1><article class="hydrant-title"><article>HYDRANT ID</article><article>ADDRESS</article><article>LAST INSPECTED</article></article>';
    controller.state.selectedCompany.data[ev.target.parentNode.id].notInspected.forEach(function(hydrant){
      let date = new Date(hydrant.attributes.INSPECTDT);
      tempHTML += '<article class="hydrant-row"><article>' + hydrant.attributes.HYDRANTID + '</article><article>' + hydrant.attributes.LOCDESC + '</article><article>' + date.toLocaleString("en-us", { month: "short" }) + ' ' + date.getDate() + ', ' + date.getFullYear() + '</article></article>';
    });
    document.querySelector('#drill-down-overlay div').innerHTML = tempHTML;
    document.getElementById('drill-down-overlay').className = 'active';
  }
}
