'use strict';

class LineNetwork {
	constructor() {
		this._lines = [];
	}
	
	addLine(lineName, arrStationNames) {
		let lineObj = { 'name': lineName, 'stations': []};
		this._lines.push(lineObj);
	}
	
	getLineCount() {
		return this._lines.length;
	}
	
	getLineName(index) {
		return this._lines[index].name;
	}
	
	getLineStationNames(index) {
		
	}
}

module.exports = {	
	parseLinesSpec: function(str) {
		let retVal = {};
		
		if(str) {
			str = str.trim();
			
			if(str) {
				let lineName = str;
				
				let colonPos = str.indexOf(':');
				if(colonPos > -1) {
				    lineName = str.substr(0, colonPos);
				}
				
				retVal = new LineNetwork;
				retVal.addLine(lineName, ['a', 'b', 'c', 'd']);
				
			    return retVal;	
			}
			
			
		}
		
		return retVal;
	},
	
};