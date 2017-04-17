'use strict';

class Station {
	constructor(stationName, lineName) {
		this._name = stationName;
		this._lineName = lineName;
		this._neighborStations = [];
	}
	
	getName() {
		return this._name;
	}
	
	getLineName() {
		return this._lineName;
	}
	
	getNeighborStations() {
		return this._neighborStations;
	}
	
	addNeighborStation(stationObj) {
		this._neighborStations.push(stationObj);
	}
	
}

class LineNetwork {
	constructor() {
		this._lines = [];
		this._stations = {};
	}
	
	_cloneObj(s) {
		return JSON.parse(JSON.stringify(s));
	}
	
	_makeStationKey(stationName, lineName) {
		return `${stationName}|${lineName}`;
	}
	
	addLine(lineName, arrStationNames) {
		let lineObj = { 'name': lineName, 'stations': arrStationNames};
		this._lines.push(lineObj);
		
		let prevStation = null;
		for(let i in arrStationNames) {
			let stationName = arrStationNames[i];
			let key = this._makeStationKey(stationName, lineName);
			this._stations[key] = new Station(stationName, lineName);
			
			if(prevStation) {
			    this._stations[key].addNeighborStation(prevStation);
                prevStation.addNeighborStation(this._stations[key]);
			}
			
			prevStation = this._stations[key];
		}
	}
	
	getLineCount() {
		return this._lines.length;
	}
	
	getLineName(index) {
		return this._lines[index].name;
	}
	
	getLineStationNames(index) {
		let stns = this._lines[index].stations;
		return this._cloneObj(stns);
	}
	
	getStationInfo(stationName, lineName) {
		let key = this._makeStationKey(stationName, lineName);
		return this._stations[key];
	}
}

module.exports = {	
	parseLinesSpec: function(str) {
		let retVal = {};
		
		if(str) {
			str = str.trim();
			
			if(str) {
				let lineName = str;
				let stations = [];
				
				let colonPos = str.indexOf(':');
				if(colonPos > -1) {
				    lineName = str.substr(0, colonPos);
					let stationStr = str.substr(colonPos + 1).trim();
					let splitted = stationStr.split(/\s*,\s*/);
					
					for(let i in splitted) {
						let stn = splitted[i].trim();
						
						if(stn) {
						    stations.push(stn);
						}
					}
				}
				
				retVal = new LineNetwork;
				retVal.addLine(lineName, stations);
				
			    return retVal;	
			}
			
			
		}
		
		return retVal;
	},
	
};