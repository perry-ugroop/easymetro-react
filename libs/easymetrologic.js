'use strict';

class Station {
    constructor(stationName) {
        this._name = stationName;
        this._lines = [];
        this._neighborStations = [];
    }

    getName() {
        return this._name;
    }
    
    getNeighborStations() {
        return this._neighborStations;
    }
    
    addNeighborStation(stationObj) {
        this._neighborStations.push(stationObj);
    }

    addLine(lineName) {
        this._lines.push(lineName);
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
    
    _makeStationKey(stationName) {
        return `${stationName}`;
    }
    
    _getLineIndex(lineName) {
        let ret = -1;
        
        for(let i = 0; i < this._lines.length; i++) {
            if(this._lines[i].name === lineName) {
                ret = i;
                break;
            }
        }

        return ret;     
    }
    
    _registerStations(arrStationNames, lineName, startingPrevStation) {
        let prevStation = startingPrevStation;
        
        for(let i in arrStationNames) {
            let stationName = arrStationNames[i];
            let key = this._makeStationKey(stationName);

            if(!this._stations[key]) {
                this._stations[key] = new Station(stationName);
            }

            this._stations[key].addLine(lineName);
            
            if(prevStation) {
                this._stations[key].addNeighborStation(prevStation);
                prevStation.addNeighborStation(this._stations[key]);
            }
            
            prevStation = this._stations[key];
        }       
    }
    
    addLine(lineName, arrStationNames) {
        let lineObj = { 'name': lineName, 'stations': arrStationNames};
        this._lines.push(lineObj);
        
        let prevStation = null;
        this._registerStations(arrStationNames, lineName, prevStation);
    }
    
    addStationNamesToLine(arrStationNames, lineName) {
        let index = this._getLineIndex(lineName);
        
        if(index !== -1) {
            let lineObj  = this._lines[index];          
        
            let prevStation = null;
        
            if(lineObj.stations.length > 1) {
                let prevStationName = lineObj.stations[lineObj.stations.length - 1];
                prevStation = this.getStationInfo(prevStationName);           
            }
    
            for(let i in arrStationNames) {
                lineObj.stations.push(arrStationNames[i]);
            }
            
            this._registerStations(arrStationNames, lineName, prevStation);
        }
    }
    
    existLine(lineName) {
        return (this._getLineIndex(lineName) !== -1);
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
    
    getStationInfo(stationName) {
        let key = this._makeStationKey(stationName);
        return this._stations[key];
    }
}

module.exports = {  
    parseLinesSpec: function(str) {
        let retVal = {};
        
        if(str) {
            str = str.trim();
            
            if(str) {
                retVal = new LineNetwork;
                
                let lines = str.split(/\s*\r?\n\s*/);
                
                for(let j in lines) {
                    let theLine = lines[j].trim();
                    
                    let lineName = theLine;
                    let stations = [];
                    
                    let colonPos = theLine.indexOf(':');
                    if(colonPos > -1) {
                        lineName = theLine.substr(0, colonPos);
                        let stationStr = theLine.substr(colonPos + 1).trim();
                        let splitted = stationStr.split(/\s*,\s*/);
                        
                        for(let i in splitted) {
                            let stn = splitted[i].trim();
                            
                            if(stn) {
                                stations.push(stn);
                            }
                        }
                    }
                    
                    if(!retVal.existLine(lineName)) {
                        retVal.addLine(lineName, stations);
                    } else {
                        retVal.addStationNamesToLine(stations, lineName);
                    }
                }       
            }
            
            
        }
        
        return retVal;
    },
    
};
