'use strict';
import Controller from './controller.class.js';
import Connector from './connector.class.js';
(function(){
  let controller = new Controller();
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
