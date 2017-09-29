import React, { Component} from 'react'

const testLocation = new google.maps.LatLng(37.7758, -122.435);

class Map extends Component {
  componentDidMount() {
    var mapOptions = {
      center: testLocation,
      zoom: 15
    };

    this.map = new google.maps.Map(this.refs.map, mapOptions);

    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'WALKING';

    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');
    var modeSelector = document.getElementById('mode-selector');
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(this.map);

    var originAutocomplete = new google.maps.places.Autocomplete(
        originInput, {placeIdOnly: true});
    var destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, {placeIdOnly: true});
    this.setupClickListener('changemode-walking', 'WALKING');
    this.setupClickListener('changemode-transit', 'TRANSIT');
    this.setupClickListener('changemode-driving', 'DRIVING');

    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
  }

  setupClickListener(id, mode){
    var radioButton = document.getElementById(id);
    var me = this;
    radioButton.addEventListener('click', function() {
      me.travelMode = mode;
      me.route();
    });
  }

  setupPlaceChangedListener(autocomplete, mode){
    var me = this;
    autocomplete.bindTo('bounds', me.map);
    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();
      if (!place.place_id) {
        window.alert("Please select an option from the dropdown list.");
        return;
      }
      if (mode === 'ORIG') {
        me.originPlaceId = place.place_id;
      } else {
        me.destinationPlaceId = place.place_id;
      }
      me.route();
    });
  }

  route(){
    if (!this.originPlaceId || !this.destinationPlaceId) {
      return;
    }
    var me = this;

    this.directionsService.route({
      origin: {'placeId': this.originPlaceId},
      destination: {'placeId': this.destinationPlaceId},
      travelMode: this.travelMode
    }, function(response, status) {
      if (status === 'OK') {
        me.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  render(){
    return (
      <div id='container'>
        <input id="origin-input" className="controls" type="text"
        placeholder="Enter an origin location"/>

        <input id="destination-input" className="controls" type="text"
            placeholder="Enter a destination location"/>

        <div id="mode-selector" className="controls">
          <input type="radio" name="type" id="changemode-walking" defaultChecked="checked"/>
          <label htmlFor="changemode-walking">Walking</label>

          <input type="radio" name="type" id="changemode-transit"/>
          <label htmlFor="changemode-transit">Transit</label>

          <input type="radio" name="type" id="changemode-driving"/>
          <label htmlFor="changemode-driving">Driving</label>
        </div>
        <div id='map-container'>
          <div id='map' ref='map'></div>
        </div>
      </div>
    )
  }
}

export default Map
