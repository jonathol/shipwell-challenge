import React, { Component} from 'react'

const testLocation = new google.maps.LatLng(37.7758, -122.435);

class Map extends Component {
  constructor(props){
    super(props)
    this.state = {routes: []};
  }
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
      me.deleteRoutes(me.state.routes);
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
    var routes = [];

    this.directionsService.route({
      origin: {'placeId': this.originPlaceId},
      destination: {'placeId': this.destinationPlaceId},
      travelMode: this.travelMode,
      provideRouteAlternatives: true,
    }, function(response, status) {
      if (status === 'OK') {
        me.directionsDisplay.setDirections(response);
        var summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = '';
        for (var x = 0; x < response.routes.length; x++) {

          var route = new google.maps.DirectionsRenderer({
            map: me.map,
            directions: response,
            routeIndex: x,
            suppressMarkers: true
          });

          routes.push(route);
          me.setState({routes: routes});

          summaryPanel.innerHTML += '<hr><br><b> Route ' + (x + 1) + ':<br>';
          var route = response.routes[x];
          for (var y = 0; y < route.legs.length; y++) {
            var routeSegment = y + 1;

            summaryPanel.innerHTML += route.legs[y].start_address + ' to ';
            summaryPanel.innerHTML += route.legs[y].end_address + '<br>';
            summaryPanel.innerHTML += route.legs[y].distance.text + '<br><br>';

            var steps = route.legs[y].steps;
            for (var z = 0; z < steps.length; z++) {
              var nextSegment = steps[z].path;
              summaryPanel.innerHTML += "<li>" + steps[z].instructions;

              var dist_dur = "";
              if (steps[z].distance && steps[z].distance.text) dist_dur += steps[z].distance.text;
              if (steps[z].duration && steps[z].duration.text) dist_dur += "&nbsp;" + steps[z].duration.text;
              if (dist_dur != "") {
                summaryPanel.innerHTML += "(" + dist_dur + ")<br /></li>";
              } else {
                summaryPanel.innerHTML += "</li>";
              }

            }

            summaryPanel.innerHTML += "<br>";
          }
        }
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  changeRouteIndex(idx){
    this.directionsDisplay.setRouteIndex(idx);
  }

  deleteRoutes(routes){
    for (var i = 0; i < routes.length; i++) {
      routes[i].setMap(null);
    }
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
        <input id="btn1" type="button" value="route1" onClick={()=>{this.changeRouteIndex(0)}} />
        <input id="btn2" type="button" value="route2" onClick={()=>{this.changeRouteIndex(1)}} />
        <input id="btn3" type="button" value="route3" onClick={()=>{this.changeRouteIndex(2)}} />
        <label id="directions-panel"></label>
      </div>
    )
  }
}

export default Map
