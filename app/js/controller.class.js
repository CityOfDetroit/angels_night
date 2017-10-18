'use strict';
import Map from './map.class.js';
import Connector from './connector.class.js';
import mapboxgl from 'mapbox-gl';
const turf = require('@turf/simplify');
const arcGIS = require('terraformer-arcgis-parser');
export default class Controller {
  constructor(init) {
    this.map = new Map(init);
    // this.state = {
    //   currentActiveView: 'city',
    //   selectedCompany: {
    //     name: null,
    //     data: null,
    //     geometry: null
    //   },
    //   selectedDistrict: {
    //     name: null,
    //     geometry: null
    //   },
    //   selectedHydrant: null
    // };
    // this.validation = null;
    // this.token = null;
    // this.companyList = null;
    this.initialLoad();
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
        let data = {
          // volunteer_total: volunteers,
          // assign_sca: area,
          // time_slot: hours,
          // geometry: {x:0, y:0, spatialReference:{wkid:4326}},
          // f:"json"
          "edits": [
            {
              "id": 0,
              "adds":[
                {
                  "attributes": {
                    "volunteer_total": volunteers,
                    "assign_sca": area,
                    "date": hours
                  },
                  "geometry": {
                    "x": 0,
                    "y": 0,
                    "spatialReference": {
                      "wkid": 4326
                    }
                  }
                }
              ]
            }
          ]
        };
        Connector.postData("https://cors-anywhere.herokuapp.com/"+"https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/service_60e59d8c446e4c71923abd4953010fb1/FeatureServer/0/applyEdits?XpCJyZ05Q3QThSg-uTc8-PlChML5KVCZbKg3ytLH-ZthahQThZwyQIPlsysxPhGC8Z29K6hjzm1lJ0CDu0XKTLrRLKJUzfmJQuOgjatZBLBBxK4bzc-27y6wmn595T_p2NdCds6Rp5d1tLPVX0Gryk5Fj8bYMWPMZKdlRc3_7dFdIVaeDVf6fqPdVLnU6KKODdG7X6TzkA9YwGH8UDaUnp75FI6bQtdjFTpTF358_uw.&username=SlusarskiD_detroitmi", data, function(response){
          if(response){
            document.getElementById('initial-loader-overlay').className = '';
            console.log('item submitted');
            document.querySelector('#alert-overlay div').innerHTML = "Your form has been submitted.";
            document.getElementById('alert-overlay').className = 'active';
          }
        });
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
