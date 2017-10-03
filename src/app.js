import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Map from './components/map'


class App extends Component {
  render() {
    return (
      <div>
        <h1 className='header'>Shipwell Challenge</h1>
        <Map/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
