'use strict';

var assert = require('assert');
var easymetrologic = require('../libs/easymetrologic.js');
var utils = require('../libs/utils.js');

describe('Test parsing line specs', () => {
    it('Parsing a null should yield an empty object', () => {
        let result = easymetrologic.parseLinesSpec(null);
        assert(utils.isEqualObject(result, {}));
    });
    
    it('Parsing an empty string should yield an empty object', () => {
        let result = easymetrologic.parseLinesSpec('');
        assert(utils.isEqualObject(result, {}));
    });

    it('Parsing a series of whitespaces should yield an empty object', () => {
        let result = easymetrologic.parseLinesSpec('    ');
        assert(utils.isEqualObject(result, {}));
    });

    it('Parsing a series of empty lines should yield an empty object', () => {
        let result = easymetrologic.parseLinesSpec('\n\n\n\n');
        assert(utils.isEqualObject(result, {}));
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
            assert(utils.isEqualObject(stations, ['Station1', 'Station2', 'Station3']));
        });
        
        describe('Stations of the first line should have correct locations relative to each other', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('Station1 should have only one neighboring station: Station2', () => {
                let stn1 = result.getStationInfo('Station1');           
                let neighborStations = stn1.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['Station2']));
            });

            it('Station2 should have two neighboring stations: Station1 and Station3', () => {
                let stn2 = result.getStationInfo('Station2');           
                let neighborStations = stn2.getNeighborStations();

                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['Station1', 'Station3']));
            });

            it('Station3 should have only one neighboring station: Station2', () => {
                let stn3 = result.getStationInfo('Station3');           
                let neighborStations = stn3.getNeighborStations();

                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['Station2']));
            });         
        });     
    }); 
    
    describe('Parsing the string "LineName: Station1" should yield a valid line network object', () => {
        let result = easymetrologic.parseLinesSpec('LineName: Station1');
        
        it('Line count should be 1', () => {            
            assert(result.getLineCount() === 1);
        });
        
        it('First line should be named "LineName"', () => {
            let index = 0;          
            assert(result.getLineName(index) === 'LineName');
        });
        
        it('Stations of the first line should be only Station1', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(utils.isEqualObject(stations, ['Station1']));
        });
        
        describe('Stations of the first line should have correct locations relative to each other', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('Station1 should have no neighboring stations', () => {
                let stn1 = result.getStationInfo('Station1');           
                let neighborStations = stn1.getNeighborStations();
                
                assert(neighborStations.length === 0);
            }); 
        });     
    });

    describe('Parsing the string "A: S1, S2, S3[newline]B: S4, S5, S6" should yield a valid line network object', () => {
        let result = easymetrologic.parseLinesSpec('A: S1, S2, S3\nB: S4, S5, S6'); 
        
        it('Line count should be 2', () => {            
            assert(result.getLineCount() === 2);
        });
        
        it('First line should be named "A"', () => {
            let index = 0;          
            assert(result.getLineName(index) === 'A');
        });
        
        it('Second line should be named "B"', () => {
            let index = 1;          
            assert(result.getLineName(index) === 'B');
        });
        
        it('Stations of the first line should be S1, S2 and S3', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(utils.isEqualObject(stations, ['S1', 'S2', 'S3']));
        });

        it('Stations of the second line should be S4, S5 and S6', () => {
            let index = 1;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(utils.isEqualObject(stations, ['S4', 'S5', 'S6']));
        }); 

        describe('Stations of the first line should have correct locations relative to each other', () => { 
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S1 should have only one neighboring station: S2', () => {
                let stn1 = result.getStationInfo('S1');            
                let neighborStations = stn1.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S2']));
            });

            it('S2 should have two neighboring stations: S1 and S3', () => {
                let stn2 = result.getStationInfo('S2');            
                let neighborStations = stn2.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S1', 'S3']));
            });

            it('S3 should have only one neighboring station: S2', () => {
                let stn3 = result.getStationInfo('S3');            
                let neighborStations = stn3.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S2']));
            });         
        }); 
        
        describe('Stations of the second line should have correct locations relative to each other', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S4 should have only one neighboring station: S5', () => {
                let stn1 = result.getStationInfo('S4');            
                let neighborStations = stn1.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S5']));
            });

            it('S5 should have two neighboring stations: S4 and S6', () => {
                let stn2 = result.getStationInfo('S5');            
                let neighborStations = stn2.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S4', 'S6']));
            });

            it('S6 should have only one neighboring station: S5', () => {
                let stn3 = result.getStationInfo('S6');            
                let neighborStations = stn3.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S5']));
            });         
        }); 
    }); 

    describe('Parsing the string "A: S1, S2, S3[newline]A: S4, S5, S6" (same line names \'A\') should yield a valid line network object', () => {
        let result = easymetrologic.parseLinesSpec('A: S1, S2, S3\nA: S4, S5, S6'); 
        
        it('Line count should be 1', () => {            
            assert(result.getLineCount() === 1);
        });
        
        it('First line should be named "A"', () => {
            let index = 0;          
            assert(result.getLineName(index) === 'A');
        });
        
        it('Stations of the first line should be S1, S2, S3, S4, S5 and S6', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(utils.isEqualObject(stations, ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']));
        });

        describe('Stations of the first line should have correct locations relative to each other', () => { 
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S1 should have only one neighboring station: S2', () => {
                let stn1 = result.getStationInfo('S1');            
                let neighborStations = stn1.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S2']));
            });

            it('S2 should have two neighboring stations: S1 and S3', () => {
                let stn2 = result.getStationInfo('S2');            
                let neighborStations = stn2.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S1', 'S3']));
            });

            it('S3 should have two neighboring stations: S2 and S4', () => {
                let stn3 = result.getStationInfo('S3');            
                let neighborStations = stn3.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S2', 'S4']));
            }); 

            it('S4 should have two neighboring stations: S3 and S5', () => {
                let stn4 = result.getStationInfo('S4');            
                let neighborStations = stn4.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S3', 'S5']));
            });         

            it('S5 should have two neighboring stations: S4 and S6', () => {
                let stn5 = result.getStationInfo('S5');            
                let neighborStations = stn5.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S4', 'S6']));
            });         

            it('S6 should have only one neighboring station: S5', () => {
                let stn6 = result.getStationInfo('S6');            
                let neighborStations = stn6.getNeighborStations();
                        
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S5']));
            });         
        });
    });     

    describe('Parsing the string "A: S1, SX, S3[newline]B: S4, SX, S6" should yield a valid line network object', () => {
        let result = easymetrologic.parseLinesSpec('A: S1, SX, S3\nB: S4, SX, S6'); 
        
        it('Line count should be 2', () => {            
            assert(result.getLineCount() === 2);
        });
        
        it('First line should be named "A"', () => {
            let index = 0;          
            assert(result.getLineName(index) === 'A');
        });
        
        it('Second line should be named "B"', () => {
            let index = 1;          
            assert(result.getLineName(index) === 'B');
        });
        
        it('Stations of the first line should be S1, SX and S3', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(utils.isEqualObject(stations, ['S1', 'S3', 'SX']));
        });

        it('Stations of the second line should be S4, SX and S6', () => {
            let index = 1;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(utils.isEqualObject(stations, ['S4', 'S6', 'SX']));
        }); 

        describe('Stations of the first line should have correct locations relative to each other', () => { 
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S1 should have only one neighboring station: SX', () => {
                let stn1 = result.getStationInfo('S1');            
                let neighborStations = stn1.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['SX']));
            });

            it('SX should have four neighboring stations: S1, S3, S4, S6', () => {
                let stnx = result.getStationInfo('SX');            
                let neighborStations = stnx.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S1', 'S3', 'S4', 'S6']));
            });

            it('S3 should have only one neighboring station: SX', () => {
                let stn3 = result.getStationInfo('S3');            
                let neighborStations = stn3.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['SX']));
            });         
        }); 
        
        describe('Stations of the second line should have correct locations relative to each other', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S4 should have only one neighboring station: SX', () => {
                let stn4 = result.getStationInfo('S4');            
                let neighborStations = stn4.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['SX']));
            });

            it('S6 should have only one neighboring station: SX', () => {
                let stn6 = result.getStationInfo('S6');            
                let neighborStations = stn6.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['SX']));
            });         
        }); 
    }); 

    describe('Parsing the string "A: SX, S2, S3[newline]B: SX, S5, S6" should yield a valid line network object', () => {
        let result = easymetrologic.parseLinesSpec('A: SX, S2, S3\nB: SX, S5, S6'); 
        
        it('Line count should be 2', () => {            
            assert(result.getLineCount() === 2);
        });
        
        it('First line should be named "A"', () => {
            let index = 0;          
            assert(result.getLineName(index) === 'A');
        });
        
        it('Second line should be named "B"', () => {
            let index = 1;          
            assert(result.getLineName(index) === 'B');
        });
        
        it('Stations of the first line should be SX, S2 and S3', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(utils.isEqualObject(stations, ['S2', 'S3', 'SX']));
        });

        it('Stations of the second line should be SX, S5 and S6', () => {
            let index = 1;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(utils.isEqualObject(stations, ['S5', 'S6', 'SX']));
        }); 

        describe('Stations of the first line should have correct locations relative to each other', () => { 
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('SX should have two neighboring stations: S2, S5', () => {
                let stnx = result.getStationInfo('SX');            
                let neighborStations = stnx.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S2', 'S5']));
            });

            it('S2 should have two neighboring stations: SX and S3', () => {
                let stn2 = result.getStationInfo('S2');            
                let neighborStations = stn2.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S3', 'SX']));
            });

            it('S3 should have only one neighboring station: S2', () => {
                let stn3 = result.getStationInfo('S3');            
                let neighborStations = stn3.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S2']));
            });         
        }); 
        
        describe('Stations of the second line should have correct locations relative to each other', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S5 should have two neighboring stations: SX and S6', () => {
                let stn2 = result.getStationInfo('S5');            
                let neighborStations = stn2.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S6', 'SX']));
            });

            it('S6 should have only one neighboring station: S5', () => {
                let stn3 = result.getStationInfo('S6');            
                let neighborStations = stn3.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S5']));
            });         
        }); 
    }); 

    describe('Parsing the string "A: S1, SX, S3[newline]B: SX, S5, S6" should yield a valid line network object', () => {
        let result = easymetrologic.parseLinesSpec('A: S1, SX, S3\nB: SX, S5, S6'); 
        
        it('Line count should be 2', () => {            
            assert(result.getLineCount() === 2);
        });
        
        it('First line should be named "A"', () => {
            let index = 0;          
            assert(result.getLineName(index) === 'A');
        });
        
        it('Second line should be named "B"', () => {
            let index = 1;          
            assert(result.getLineName(index) === 'B');
        });
        
        it('Stations of the first line should be S1, SX and S3', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(utils.isEqualObject(stations, ['S1', 'S3', 'SX']));
        });

        it('Stations of the second line should be SX, S5 and S6', () => {
            let index = 1;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(utils.isEqualObject(stations, ['S5', 'S6', 'SX']));
        }); 

        describe('Stations of the first line should have correct locations relative to each other', () => { 
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S1 should have only one neighboring station: SX', () => {
                let stn1 = result.getStationInfo('S1');            
                let neighborStations = stn1.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['SX']));
            });

            it('SX should have three neighboring stations: S1, S3 and S5', () => {
                let stnx = result.getStationInfo('SX');            
                let neighborStations = stnx.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S1', 'S3', 'S5']));
            });

            it('S3 should have only one neighboring station: SX', () => {
                let stn3 = result.getStationInfo('S3');            
                let neighborStations = stn3.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['SX']));
            });         
        }); 
        
        describe('Stations of the second line should have correct locations relative to each other', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S5 should have two neighboring stations: SX and S6', () => {
                let stn5 = result.getStationInfo('S5');            
                let neighborStations = stn5.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S6', 'SX']));
            });

            it('S6 should have only one neighboring station: S5', () => {
                let stn6 = result.getStationInfo('S6');            
                let neighborStations = stn6.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S5']));
            });         
        }); 
    }); 

    describe('Parsing the string "A: S1, S2, SX[newline]B: S4, SX, S6" should yield a valid line network object', () => {
        let result = easymetrologic.parseLinesSpec('A: S1, S2, SX\nB: S4, SX, S6'); 
        
        it('Line count should be 2', () => {            
            assert(result.getLineCount() === 2);
        });
        
        it('First line should be named "A"', () => {
            let index = 0;          
            assert(result.getLineName(index) === 'A');
        });
        
        it('Second line should be named "B"', () => {
            let index = 1;          
            assert(result.getLineName(index) === 'B');
        });
        
        it('Stations of the first line should be S1, S2 and SX', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(JSON.stringify(stations) === JSON.stringify(['S1', 'S2', 'SX']));
        });

        it('Stations of the second line should be S4, SX and S6', () => {
            let index = 1;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(utils.isEqualObject(stations, ['S4', 'S6', 'SX']));
        }); 

        describe('Stations of the first line should have correct locations relative to each other', () => { 
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S1 should have only one neighboring station: S2', () => {
                let stn1 = result.getStationInfo('S1');            
                let neighborStations = stn1.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S2']));
            });

            it('S2 should have two neighboring stations: S1 and SX', () => {
                let stn2 = result.getStationInfo('S2');            
                let neighborStations = stn2.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S1', 'SX']));
            });

            it('SX should have three neighboring stations: S2, S4 and S6', () => {
                let stnx = result.getStationInfo('SX');            
                let neighborStations = stnx.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['S2', 'S4', 'S6']));
            });
        }); 
        
        describe('Stations of the second line should have correct locations relative to each other', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S4 should have only one neighboring station: SX', () => {
                let stn4 = result.getStationInfo('S4');            
                let neighborStations = stn4.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['SX']));
            });

            it('S6 should have only one neighboring station: SX', () => {
                let stn5 = result.getStationInfo('S6');            
                let neighborStations = stn5.getNeighborStations();
                
                let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
                assert(utils.isEqualObject(neighStns, ['SX']));
            });         
        }); 
    }); 

    describe('Parsing the string "A: S1, S2, S3, S4, S5, S1" should yield a valid circular line network object', () => {
        let result = easymetrologic.parseLinesSpec('A: S1, S2, S3, S4, S5, S1'); 

        it('S1 should have two neighboring stations: S2 and S5', () => {
            let stn1 = result.getStationInfo('S1');            
            let neighborStations = stn1.getNeighborStations();
            
            let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
            assert(utils.isEqualObject(neighStns, ['S2', 'S5']));
        });
        
    }); 

    describe('Parsing the string "A: S1, S2, S3, S4, S5, S6, S7, S8, S9, S2" should yield a valid circular line network object', () => {
        let result = easymetrologic.parseLinesSpec('A: S1, S2, S3, S4, S5, S6, S7, S8, S9, S2'); 

        it('S2 should have three neighboring stations: S1, S3 and S9', () => {
            let stn2 = result.getStationInfo('S2');            
            let neighborStations = stn2.getNeighborStations();
            
            let neighStns = utils.getSortedNamesOfNeighborStations(neighborStations);      
            assert(utils.isEqualObject(neighStns, ['S1', 'S3', 'S9']));
        });
        
    }); 
});
