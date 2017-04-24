'use strict';

module.exports = {  
    isEqualObject: (a, b) => (JSON.stringify(a) === JSON.stringify(b)),

    getSortedNamesOfNeighborStations: (neighborStations) => {
        let neighStns = [];
        for(let i in neighborStations) {
            neighStns.push(neighborStations[i].getName());                  
        }
        neighStns.sort();

        return neighStns;
    },
};

