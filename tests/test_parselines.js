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
	});	
	
});
