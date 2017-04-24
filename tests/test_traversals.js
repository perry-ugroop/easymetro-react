'use strict';

var assert = require('assert');
var easymetrologic = require('../libs/easymetrologic.js');
var utils = require('../libs/utils.js');

var network = `A: A1, A2, A3, AB, A5, AC, A7
B: B1, B2, AB, B4, B5, BC, B7
C: C1, C2, BC, C4, C5, C6, C7, AC, C9`;

describe('Test traversing the line network', () => {
    describe(`Parsing the following network:\n${network}`, () => {
        let result = easymetrologic.parseLinesSpec(network);

        it('Station AB should have the following neighbors: A3, B2, A5, B4', () => {
            let stnAB = result.getStationInfo('AB');           
            let neighborStations = stnAB.getNeighborStations();
            
            let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
            assert(utils.isEqualObject(neighStns, ['A3', 'A5', 'B2', 'B4']));
        });

        it('Station BC should have the following neighbors: B5, C2, B7, C4', () => {
            let stnBC = result.getStationInfo('BC');           
            let neighborStations = stnBC.getNeighborStations();
            
            let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
            assert(utils.isEqualObject(neighStns, ['B5', 'B7', 'C2', 'C4']));
        });

        it('Station AC should have the following neighbors: A5, A7, C7, C9', () => {
            let stnAC = result.getStationInfo('AC');           
            let neighborStations = stnAC.getNeighborStations();
            
            let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
            assert(utils.isEqualObject(neighStns, ['A5', 'A7', 'C7', 'C9']));
        });
    });
});

