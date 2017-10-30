"use strict";
// import Connector from './connector.class.js';
export default class Authenticator {
  constructor() {
    this.token = null;
  }
  getAuthenticated(login, controller){
    const url = 'https://apis.detroitmi.gov/photo_survey/auth_token/';
    // Create our request constructor with all the parameters we need
    var request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(login),
        headers: new Headers()
    });

    fetch(request)
    .then((resp) => resp.json())
    .then(function(data){
      // console.log(data);
      if(data.token){
        controller.authenticator.successLogin(data, controller);
        controller.initialForm('authenticated-user',controller);
      }else{
        document.querySelector('#alert-overlay div').innerHTML = "Invalid login information. Please try again.";
        document.getElementById('alert-overlay').className = 'active';
      }
    });
  }
  successLogin(response, controller){
    controller.authenticator.token = response.token;
  }
  failLogin(response){
    console.log(response);
  }
}
