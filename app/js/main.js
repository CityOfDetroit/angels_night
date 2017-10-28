'use strict';
import Controller from './controller.class.js';
import Connector from './connector.class.js';
import mapboxgl from 'mapbox-gl';
(function(){
  let controller = new Controller();
  controller.map.map.on("mousemove", function(e, parent = this) {
    // console.log(this);
    if(this.getLayer("scout-cars-fill")){
      let features = this.queryRenderedFeatures(e.point, {
        layers: ["scout-cars-fill"]
      });
      // console.log(features);
      if (features.length) {
        this.setFilter("scout-cars-hover", ["==", "area", features[0].properties.area]);
      }else{
        this.setFilter("scout-cars-hover", ["==", "area", ""]);
      }
      this.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    }else{
      let features = this.queryRenderedFeatures(e.point, {
        layers: ["volunteer-fill"]
      });
      this.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    }
  });
  controller.map.map.on("click", function(e, parent = this) {
    if(this.getLayer("scout-cars-fill")){
      var features = this.queryRenderedFeatures(e.point, {
        layers: ["scout-cars-fill"]
      });
      if (features.length) {
        // console.log(features);
        document.getElementById('scout-car').value = features[0].properties.area;
        document.querySelector('.data-panel').className = "data-panel active";
        setTimeout(function () {
          controller.map.map.resize();
        },500);
      }else{
        console.log('no feature');
      }
    }else{
      var features = this.queryRenderedFeatures(e.point, {
        layers: ["volunteer-fill"]
      });
      // console.log(e.point);
      if (features.length) {
        new mapboxgl.Popup()
            .setLngLat(features[0].geometry.coordinates[0][0])
            .setHTML('<h2>Volunteers: ' + controller.scoutVolunteers[features[0].properties.area]['volunteers30'] + '</h2>')
            .addTo(this);
      }
    }
  });
  document.getElementById('volunteer-submit-btn').addEventListener('click', function(e){
    controller.submitVolunteers(controller);
  });
  let closeAlertBtns = document.querySelectorAll('.close');
  closeAlertBtns.forEach(function(btn){
    btn.addEventListener('click', function(ev){
        controller.closeAlert(ev,controller)
    });
  });
  let startingBtns = document.querySelectorAll('#user-type-section button');
  startingBtns.forEach(function(btn){
    btn.addEventListener('click', function(ev){
      controller.initialForm(ev.target.attributes[2].nodeValue, controller);
    });
  });
})(window);
