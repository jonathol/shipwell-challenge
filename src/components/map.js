import React, { Component} from 'react'
import RouteInfo from './route_info'

const testLocation = new google.maps.LatLng(37.7758, -122.435);

class Map extends Component {
  constructor(props){
    super(props)
    this.state = {
      routes: [],
      markers: []
    };
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
    this.placesService = new google.maps.places.PlacesService(this.map);
    this.directionsDisplay = new google.maps.DirectionsRenderer({
      draggable:true
    });
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
    var that = this;
    radioButton.addEventListener('click', function() {
      that.travelMode = mode;
      that.route();
    });
  }

  setupPlaceChangedListener(autocomplete, mode){
    var that = this;
    autocomplete.bindTo('bounds', that.map);
    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();
      if (!place.place_id) {
        window.alert("Please select an option from the dropdown list.");
        return;
      }
      if (mode === 'ORIG') {
        that.originPlaceId = place.place_id;
      } else {
        that.destinationPlaceId = place.place_id;
      }
      var request = {
        placeId: place.place_id
      }
      that.placesService.getDetails(request, function(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          var marker = new google.maps.Marker({
            map: that.map,
            position: place.geometry.location
          });
          var markers = that.state.markers;
          markers.push(marker);
          that.setState({markers: markers});
        }
      });
      that.route();
    });
  }

  deleteMarkers(){
    for (var i = 0; i < this.state.markers.length; i++) {
      this.state.markers[i].setMap(null);
    }
  }

  route(){
    if (!this.originPlaceId || !this.destinationPlaceId) {
      return;
    }
    var that = this;
    this.deleteRoutes(this.state.routes);
    this.setState({routes: []});
    var routes = [];

    google.maps.event.clearListeners(that.directionsDisplay);

    this.directionsService.route({
      origin: {'placeId': this.originPlaceId},
      destination: {'placeId': this.destinationPlaceId},
      travelMode: this.travelMode,
      provideRouteAlternatives: true,
    }, function(response, status) {

      if (status === 'OK') {
        that.directionsDisplay.setDirections(response);
        that.drawAltRoutes(response, routes);
        that.deleteMarkers();
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  drawAltRoutes(response,routes){
    for (var x = 0; x < response.routes.length; x++) {
      var route = new google.maps.DirectionsRenderer({
        map: this.map,
        directions: response,
        routeIndex: x,
        suppressMarkers: true
      });
      routes.push(route);
      this.setState({routes: routes});
      google.maps.event.addListener(this.directionsDisplay, 'directions_changed', function() {
        this.originPlaceId = this.directionsDisplay.directions.geocoded_waypoints[0].place_id;
        this.destinationPlaceId = this.directionsDisplay.directions.geocoded_waypoints[1].place_id;
        this.route();
      }.bind(this));
    }
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
    var routes = this.state.routes;
    var routesKeys = Object.keys(routes);
    var that = this;

    return (
      <div id='container'>
        <div id='options-container'>
          <div id="mode-selector" className="controls">
            <input type="radio" name="type" id="changemode-walking" defaultChecked="checked"/>
            <label htmlFor="changemode-walking">Walking</label>

            <input type="radio" name="type" id="changemode-transit"/>
            <label htmlFor="changemode-transit">Transit</label>

            <input type="radio" name="type" id="changemode-driving"/>
            <label htmlFor="changemode-driving">Driving</label>
          </div>

          <input id="origin-input" className="controls" type="text"
            placeholder="Enter an origin location"/>

          <input id="destination-input" className="controls" type="text"
            placeholder="Enter a destination location"/>
        </div>
        <div id='map-container'>
          <div id='map' ref='map'></div>
        </div>
        <div id='routes-container'>
          {
            routesKeys.map( key => {
              return <RouteInfo
                key={key}
                routeIndex={routes[key].routeIndex}
                route={routes[key].directions.routes[key]}
                changeRouteIndex={()=>{this.changeRouteIndex(routes[key].routeIndex)}}
                />;
            })
          }
        </div>
      </div>
    )
  }
}

export default Map
