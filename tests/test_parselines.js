'use strict';

var assert = require('assert');
var easymetrologic = require('../libs/easymetrologic.js');

describe('Test parsing line specs', () => {
	it('Parsing a null should yield an empty object', () => {
		let result = easymetrologic.parseLinesSpec(null);
		assert(JSON.stringify(result) === JSON.stringify({}));
	});
	
	it('Parsing an empty string should yield an empty object', () => {
		let result = easymetrologic.parseLinesSpec('');
		assert(JSON.stringify(result) === JSON.stringify({}));
	});

	it('Parsing a series of whitespaces should yield an empty object', () => {
		let result = easymetrologic.parseLinesSpec('    ');
		assert(JSON.stringify(result) === JSON.stringify({}));
	});

	it('Parsing a series of empty lines should yield an empty object', () => {
		let result = easymetrologic.parseLinesSpec('\n\n\n\n');
		assert(JSON.stringify(result) === JSON.stringify({}));
	});

	describe('Parsing the string "LineName: Station1, Station2, Station3" should yield a valid line network object', () => {
		let result = easymetrologic.parseLinesSpec('LineName: Station1, Station2, Station3');
		
        it('Line count should be 1', () => {		    
		    assert(result.getLineCount() === 1);
		});
		
        it('First line should be named "LineName"', () => {
            let index = 0;		    
		    assert(result.getLineName(index) === 'LineName');
		});
		
        it('Stations of the first line should be Station1, Station2 and Station3', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);
            stations.sort();			
		    assert(JSON.stringify(stations) === JSON.stringify(['Station1', 'Station2', 'Station3']));
		});
		
        describe('Stations of the first line should have correct locations relative to each other', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('Station1 should have only one neighboring station: Station2', () => {
                let stn1 = result.getStationInfo('Station1', 'LineName');			
			    let neighborStations = stn1.getNeighborStations();
				
				assert(neighborStations.length === 1, 'Neighboring station count is not 1');
				
				let neighStn1 = neighborStations[0];
				assert(neighStn1.getName() === 'Station2', 'Station name is not Station2');
			});

            it('Station2 should have two neighboring stations: Station1 and Station3', () => {
                let stn1 = result.getStationInfo('Station1', 'LineName');			
			    let neighborStations = stn1.getNeighborStations();
				
				assert(neighborStations.length === 2, 'Neighboring station count is not 2');
				
				let neighStns = [];
				for(let i in neighborStations.length) {
					neighStns.push(neighborStations[i].getName());					
				}
				neighStns.sort();
				
				assert(JSON.stringify(neighStns) === JSON.stringify(['Station1', 'Station3']), 'Station names are neither Station1 nor Station3');
			});			
		});		
	});	
	
});
