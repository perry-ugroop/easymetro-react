'use strict';

class LineNetwork {
	constructor() {
		this._lines = [];
		this._stations = [];
	}
	
	_cloneObj(s) {
		return JSON.parse(JSON.stringify(s));
	}
	
	addLine(lineName, arrStationNames) {
		let lineObj = { 'name': lineName, 'stations': arrStationNames};
		this._lines.push(lineObj);
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