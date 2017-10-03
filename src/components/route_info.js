import React, { Component } from 'react'

class RouteInfo extends Component {
  constructor(props){
    super(props)
    this.state = { visible: false}
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
        directions.innerHTML += "<span>(" + dist_dur + ")</span></li>";
      } else {
        directions.innerHTML += "</li>";
      }
    }
  }

  changeVisibility(event){
    event.preventDefault();
    if (this.state.visible) {
      this.setState({visible: false});
    } else {
      this.setState({visible: true});
    }
  }

  handleClick(e){
    e.stopPropagation();
    this.props.changeRouteIndex();
  }

  render(){
    return(
      <div onClick={this.changeVisibility.bind(this)}>

        <div className='info-container'>
          <h3>Route {this.props.routeIndex+1}</h3>
          <button onClick={this.handleClick.bind(this)}>Make Active</button>
          <p>
            <strong>Summary:</strong> {this.props.route.summary}
            <br></br>
            <strong>Distance:</strong> {this.props.route.legs[0].distance.text}
            <br></br>
            <strong>Duration:</strong> {this.props.route.legs[0].duration.text}
              <br></br>
          </p>
        </div>
        <div className={this.state.visible ? 'directions-container' : 'directions-container hidden'}>
          <h4>Directions:</h4>
          <ol id={this.props.routeIndex}></ol>
        </div>
      </div>
    )
  }
}

export default RouteInfo
