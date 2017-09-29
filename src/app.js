import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Map from './components/map'


class App extends Component {
  render() {
    return (

      <Map/>


    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
