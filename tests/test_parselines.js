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
                let stn1 = result.getStationInfo('Station1');           
                let neighborStations = stn1.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn1 = neighborStations[0];
                assert(neighStn1.getName() === 'Station2', 'Station name is not Station2');
            });

            it('Station2 should have two neighboring stations: Station1 and Station3', () => {
                let stn2 = result.getStationInfo('Station2');           
                let neighborStations = stn2.getNeighborStations();
                
                assert(neighborStations.length === 2, 'Neighboring station count is not 2');
                
                let neighStns = [];
                for(let i in neighborStations) {
                    neighStns.push(neighborStations[i].getName());                  
                }
                neighStns.sort();
                
                assert(JSON.stringify(neighStns) === JSON.stringify(['Station1', 'Station3']), 'Station names are neither Station1 nor Station3');
            });

            it('Station3 should have only one neighboring station: Station2', () => {
                let stn3 = result.getStationInfo('Station3');           
                let neighborStations = stn3.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn3 = neighborStations[0];
                assert(neighStn3.getName() === 'Station2', 'Station name is not Station2');
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
            assert(JSON.stringify(stations) === JSON.stringify(['Station1']));
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
            assert(JSON.stringify(stations) === JSON.stringify(['S1', 'S2', 'S3']));
        });

        it('Stations of the second line should be S4, S5 and S6', () => {
            let index = 1;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(JSON.stringify(stations) === JSON.stringify(['S4', 'S5', 'S6']));
        }); 

        describe('Stations of the first line should have correct locations relative to each other', () => { 
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S1 should have only one neighboring station: S2', () => {
                let stn1 = result.getStationInfo('S1');            
                let neighborStations = stn1.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn1 = neighborStations[0];
                assert(neighStn1.getName() === 'S2', 'Station name is not S2');
            });

            it('S2 should have two neighboring stations: S1 and S3', () => {
                let stn2 = result.getStationInfo('S2');            
                let neighborStations = stn2.getNeighborStations();
                
                assert(neighborStations.length === 2, 'Neighboring station count is not 2');
                
                let neighStns = [];
                for(let i in neighborStations) {
                    neighStns.push(neighborStations[i].getName());                  
                }
                neighStns.sort();
                
                assert(JSON.stringify(neighStns) === JSON.stringify(['S1', 'S3']), 'Station names are neither S1 nor S3');
            });

            it('S3 should have only one neighboring station: S2', () => {
                let stn3 = result.getStationInfo('S3');            
                let neighborStations = stn3.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn3 = neighborStations[0];
                assert(neighStn3.getName() === 'S2', 'Station name is not S2');
            });         
        }); 
        
        describe('Stations of the second line should have correct locations relative to each other', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S4 should have only one neighboring station: S5', () => {
                let stn1 = result.getStationInfo('S4');            
                let neighborStations = stn1.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn1 = neighborStations[0];
                assert(neighStn1.getName() === 'S5', 'Station name is not S5');
            });

            it('S5 should have two neighboring stations: S4 and S6', () => {
                let stn2 = result.getStationInfo('S5');            
                let neighborStations = stn2.getNeighborStations();
                
                assert(neighborStations.length === 2, 'Neighboring station count is not 2');
                
                let neighStns = [];
                for(let i in neighborStations) {
                    neighStns.push(neighborStations[i].getName());                  
                }
                neighStns.sort();
                
                assert(JSON.stringify(neighStns) === JSON.stringify(['S4', 'S6']), 'Station names are neither S4 nor S6');
            });

            it('S6 should have only one neighboring station: S5', () => {
                let stn3 = result.getStationInfo('S6');            
                let neighborStations = stn3.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn3 = neighborStations[0];
                assert(neighStn3.getName() === 'S5', 'Station name is not S5');
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
            assert(JSON.stringify(stations) === JSON.stringify(['S1', 'S2', 'S3', 'S4', 'S5', 'S6']));
        });

        describe('Stations of the first line should have correct locations relative to each other', () => { 
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S1 should have only one neighboring station: S2', () => {
                let stn1 = result.getStationInfo('S1');            
                let neighborStations = stn1.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn1 = neighborStations[0];
                assert(neighStn1.getName() === 'S2', 'Station name is not S2');
            });

            it('S2 should have two neighboring stations: S1 and S3', () => {
                let stn2 = result.getStationInfo('S2');            
                let neighborStations = stn2.getNeighborStations();
                
                assert(neighborStations.length === 2, 'Neighboring station count is not 2');
                
                let neighStns = [];
                for(let i in neighborStations) {
                    neighStns.push(neighborStations[i].getName());                  
                }
                neighStns.sort();
                
                assert(JSON.stringify(neighStns) === JSON.stringify(['S1', 'S3']), 'Station names are neither S1 nor S3');
            });

            it('S3 should have two neighboring stations: S2 and S4', () => {
                let stn3 = result.getStationInfo('S3');            
                let neighborStations = stn3.getNeighborStations();
                
                assert(neighborStations.length === 2, 'Neighboring station count is not 2');
                
                let neighStns = [];
                for(let i in neighborStations) {
                    neighStns.push(neighborStations[i].getName());                  
                }
                neighStns.sort();
                
                assert(JSON.stringify(neighStns) === JSON.stringify(['S2', 'S4']), 'Station names are neither S2 nor S4');
            }); 

            it('S4 should have two neighboring stations: S3 and S5', () => {
                let stn4 = result.getStationInfo('S4');            
                let neighborStations = stn4.getNeighborStations();
                
                assert(neighborStations.length === 2, 'Neighboring station count is not 2');
                
                let neighStns = [];
                for(let i in neighborStations) {
                    neighStns.push(neighborStations[i].getName());                  
                }
                neighStns.sort();
                
                assert(JSON.stringify(neighStns) === JSON.stringify(['S3', 'S5']), 'Station names are neither S3 nor S5');
            });         

            it('S5 should have two neighboring stations: S4 and S6', () => {
                let stn5 = result.getStationInfo('S5');            
                let neighborStations = stn5.getNeighborStations();
                
                assert(neighborStations.length === 2, 'Neighboring station count is not 2');
                
                let neighStns = [];
                for(let i in neighborStations) {
                    neighStns.push(neighborStations[i].getName());                  
                }
                neighStns.sort();
                
                assert(JSON.stringify(neighStns) === JSON.stringify(['S4', 'S6']), 'Station names are neither S4 nor S6');
            });         

            it('S6 should have only one neighboring station: S5', () => {
                let stn6 = result.getStationInfo('S6');            
                let neighborStations = stn6.getNeighborStations();
                        
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                    
                let neighStn6 = neighborStations[0];
                assert(neighStn6.getName() === 'S5', 'Station name is not S5');
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
            assert(JSON.stringify(stations) === JSON.stringify(['S1', 'S3', 'SX']));
        });

        it('Stations of the second line should be S4, SX and S6', () => {
            let index = 1;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(JSON.stringify(stations) === JSON.stringify(['S4', 'S6', 'SX']));
        }); 

        describe('Stations of the first line should have correct locations relative to each other', () => { 
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S1 should have only one neighboring station: SX', () => {
                let stn1 = result.getStationInfo('S1');            
                let neighborStations = stn1.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn1 = neighborStations[0];
                assert(neighStn1.getName() === 'SX', 'Station name is not SX');
            });

            it('SX should have four neighboring stations: S1, S3, S4, S6', () => {
                let stnx = result.getStationInfo('SX');            
                let neighborStations = stnx.getNeighborStations();
                
                assert(neighborStations.length === 4, 'Neighboring station count is not 4');
                
                let neighStns = [];
                for(let i in neighborStations) {
                    neighStns.push(neighborStations[i].getName());                  
                }
                neighStns.sort();

                assert(JSON.stringify(neighStns) === JSON.stringify(['S1', 'S3', 'S4', 'S6']), 'Station names are neither S1, S3, S4, nor S6');
            });

            it('S3 should have only one neighboring station: SX', () => {
                let stn3 = result.getStationInfo('S3');            
                let neighborStations = stn3.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn3 = neighborStations[0];
                assert(neighStn3.getName() === 'SX', 'Station name is not SX');
            });         
        }); 
        
        describe('Stations of the second line should have correct locations relative to each other', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S4 should have only one neighboring station: SX', () => {
                let stn4 = result.getStationInfo('S4');            
                let neighborStations = stn4.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn1 = neighborStations[0];
                assert(neighStn1.getName() === 'SX', 'Station name is not SX');
            });

            it('S6 should have only one neighboring station: SX', () => {
                let stn6 = result.getStationInfo('S6');            
                let neighborStations = stn6.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn3 = neighborStations[0];
                assert(neighStn3.getName() === 'SX', 'Station name is not SX');
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
            assert(JSON.stringify(stations) === JSON.stringify(['S2', 'S3', 'SX']));
        });

        it('Stations of the second line should be SX, S5 and S6', () => {
            let index = 1;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(JSON.stringify(stations) === JSON.stringify(['S5', 'S6', 'SX']));
        }); 

        describe('Stations of the first line should have correct locations relative to each other', () => { 
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('SX should have two neighboring stations: S2, S5', () => {
                let stnx = result.getStationInfo('SX');            
                let neighborStations = stnx.getNeighborStations();
                
                assert(neighborStations.length === 2, 'Neighboring station count is not 2');
                
                let neighStns = [];
                for(let i in neighborStations) {
                    neighStns.push(neighborStations[i].getName());                  
                }
                neighStns.sort();

                assert(JSON.stringify(neighStns) === JSON.stringify(['S2', 'S5']), 'Station names are neither S2, nor S5');
            });

            it('S2 should have two neighboring stations: SX and S3', () => {
                let stn2 = result.getStationInfo('S2');            
                let neighborStations = stn2.getNeighborStations();
                
                assert(neighborStations.length === 2, 'Neighboring station count is not 2');
                
                let neighStns = [];
                for(let i in neighborStations) {
                    neighStns.push(neighborStations[i].getName());                  
                }
                neighStns.sort();
                
                assert(JSON.stringify(neighStns) === JSON.stringify(['S3', 'SX']), 'Station names are neither SX nor S3');
            });

            it('S3 should have only one neighboring station: S2', () => {
                let stn3 = result.getStationInfo('S3');            
                let neighborStations = stn3.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn3 = neighborStations[0];
                assert(neighStn3.getName() === 'S2', 'Station name is not S2');
            });         
        }); 
        
        describe('Stations of the second line should have correct locations relative to each other', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S5 should have two neighboring stations: SX and S6', () => {
                let stn2 = result.getStationInfo('S5');            
                let neighborStations = stn2.getNeighborStations();
                
                assert(neighborStations.length === 2, 'Neighboring station count is not 2');
                
                let neighStns = [];
                for(let i in neighborStations) {
                    neighStns.push(neighborStations[i].getName());                  
                }
                neighStns.sort();
                
                assert(JSON.stringify(neighStns) === JSON.stringify(['S6', 'SX']), 'Station names are neither SX nor S6');
            });

            it('S6 should have only one neighboring station: S5', () => {
                let stn3 = result.getStationInfo('S6');            
                let neighborStations = stn3.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn3 = neighborStations[0];
                assert(neighStn3.getName() === 'S5', 'Station name is not S5');
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
            assert(JSON.stringify(stations) === JSON.stringify(['S1', 'S3', 'SX']));
        });

        it('Stations of the second line should be SX, S5 and S6', () => {
            let index = 1;
            let stations = result.getLineStationNames(index);
            stations.sort();            
            assert(JSON.stringify(stations) === JSON.stringify(['S5', 'S6', 'SX']));
        }); 

        describe('Stations of the first line should have correct locations relative to each other', () => { 
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S1 should have only one neighboring station: SX', () => {
                let stn1 = result.getStationInfo('S1');            
                let neighborStations = stn1.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn1 = neighborStations[0];
                assert(neighStn1.getName() === 'SX', 'Station name is not SX');
            });

            it('SX should have three neighboring stations: S1, S3 and S5', () => {
                let stnx = result.getStationInfo('SX');            
                let neighborStations = stnx.getNeighborStations();
                
                assert(neighborStations.length === 3, 'Neighboring station count is not 3');
                
                let neighStns = [];
                for(let i in neighborStations) {
                    neighStns.push(neighborStations[i].getName());                  
                }
                neighStns.sort();
                
                assert(JSON.stringify(neighStns) === JSON.stringify(['S1', 'S3', 'S5']), 'Station names are neither S1, S3 nor S5');
            });

            it('S3 should have only one neighboring station: SX', () => {
                let stn3 = result.getStationInfo('S3');            
                let neighborStations = stn3.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn3 = neighborStations[0];
                assert(neighStn3.getName() === 'SX', 'Station name is not SX');
            });         
        }); 
        
        describe('Stations of the second line should have correct locations relative to each other', () => {
            let index = 0;
            let stations = result.getLineStationNames(index);

            it('S5 should have two neighboring stations: SX and S6', () => {
                let stn5 = result.getStationInfo('S5');            
                let neighborStations = stn5.getNeighborStations();
                
                assert(neighborStations.length === 2, 'Neighboring station count is not 2');
                
                let neighStns = [];
                for(let i in neighborStations) {
                    neighStns.push(neighborStations[i].getName());                  
                }
                neighStns.sort();
                
                assert(JSON.stringify(neighStns) === JSON.stringify(['S6', 'SX']), 'Station names are neither SX nor S6');
            });

            it('S6 should have only one neighboring station: S5', () => {
                let stn6 = result.getStationInfo('S6');            
                let neighborStations = stn6.getNeighborStations();
                
                assert(neighborStations.length === 1, 'Neighboring station count is not 1');
                
                let neighStn3 = neighborStations[0];
                assert(neighStn3.getName() === 'S5', 'Station name is not S5');
            });         
        }); 
    }); 
});
