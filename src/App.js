import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var easymetrologic = require('../libs/easymetrologic.js');

class App extends Component {
  render() {
	let computeShortestRoute = (e)  => {
		easymetrologic.parseLinesSpec('test');
	};
	
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Easy Metro</h2>
        </div>
        <div className="App-body">
		    <div className="App-col1">
			    <div><label htmlFor="txtLines">Lines (top to bottom, left to right):</label></div>
				<div><textarea id="edtLines"></textarea></div>
			</div>
			<div className="App-col2">
			    <div><label htmlFor="txtFrom" className="from-to">From:</label> <input type="text" id="txtFrom" /></div>
				<div><label htmlFor="txtTo" className="from-to">To:</label> <input type="text" id="txtTo" /></div>
				<div><input type="button" value="Compute shortest route" onClick={computeShortestRoute} /></div>
				
				<div className="div-shortest-route">
				    <div><label>Shortest Route:</label></div>
					<div><textarea id="edtShortestRoute"></textarea></div>
				</div>
			</div>
		</div>
      </div>
    );
  }
}

export default App;
