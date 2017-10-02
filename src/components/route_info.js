import React, { Component } from 'react'

class RouteInfo extends Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    var steps = this.props.route.legs[0].steps;
    var directions = document.getElementById(this.props.routeIndex);
    directions.innerHTML = '';
    for (var i = 0; i < steps.length; i++) {
      directions.innerHTML += '<li>' + steps[i].instructions;
      var dist_dur = "";
      if (steps[i].distance && steps[i].distance.text) dist_dur += steps[i].distance.text;
      if (steps[i].duration && steps[i].duration.text) dist_dur += "&nbsp;" + steps[i].duration.text;
      if (dist_dur != "") {
        directions.innerHTML += "(" + dist_dur + ")<br /></li>";
      } else {
        directions.innerHTML += "</li>";
      }
    }
  }

  render(){
    return(
      <div>
        <h3>Route {this.props.routeIndex+1}</h3>
        <p>
          <strong>Summary:</strong> {this.props.route.summary}
          <br></br>
          <strong>Distance:</strong> {this.props.route.legs[0].distance.text}
          <br></br>
          <strong>Duration:</strong> {this.props.route.legs[0].duration.text}
          <br></br>
        </p>
        <h4>Directions:</h4>
        <ol id={this.props.routeIndex}></ol>
      </div>
    )
  }
}

export default RouteInfo
