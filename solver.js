var sudoku = (function () {
    var saga = {};
    var rowNumber = 0;
    var columnNumber = 0; 
    var candidateBoard = createArray(9, 9);

    for (var i = 0; i < 9; i++){
            for (var j = 0; j < 9; j++){
                candidateBoard[i][j] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            }
        }
     function createArray(length){
        var arr = new Array(length || 0),
            i = length;

         if (arguments.length > 1){
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = createArray.apply(this, args);
         }

        return arr;
    }

    saga.iteration = function () {
        var currentCell = getCell(rowNumber, columnNumber);

        if (currentCell !== null){
            remove(rowNumber,columnNumber, currentCell);
            candidateBoard[rowNumber][columnNumber] = [-1 * currentCell];
            handleEliminationRules(); 
            setSolos();
            
        }

        columnNumber++;

        if (columnNumber == 9){
            columnNumber = 0;
            rowNumber++;
        }

        if (rowNumber == 9){
            columnNumber = 0;
            rowNumber = 0; 
        }

        function remove(row, column, numberToRemove){
            removeFromRow(row, numberToRemove);
            removeFromColumn(column, numberToRemove);
            removeFromGrid(row, column, numberToRemove);
        }

        function removeFromRow(row, numberToRemove){
            for(var i = 0; i < 9; i++){
                candidateBoard[row][i] = candidateBoard[row][i].filter(function(value){
                    return value != numberToRemove;   
                });
            }
        }

        function removeFromColumn(column, numberToRemove){
            for(var i = 0; i < 9; i++){
                candidateBoard[i][column] = candidateBoard[i][column].filter(function(value){
                    return value != numberToRemove;
                });
            }
        }

        function removeFromGrid(row, column, numberToRemove){
            var firstCellOfGridCoords = firstCellOfGridCoordinates(row, column);

            for (var i = 0; i < 3; i++){
                for (var j = 0; j < 3; j++){
                    var checkedRow = i + firstCellOfGridCoords[0];
                    var checkedColumn = j + firstCellOfGridCoords[1];

                    candidateBoard[checkedRow][checkedColumn] = candidateBoard[checkedRow][checkedColumn].filter(function(value){return value != numberToRemove;});
                }
            }
        }

        function firstCellOfGridCoordinates(row, column){
            var coordinates = [-1, -1];
            coordinates[0] = firstCellOfGridRowOrColumn(row);
            coordinates[1] = firstCellOfGridRowOrColumn(column);

            return coordinates; 
        }

        function firstCellOfGridRowOrColumn(rowOrColumn){
            var coordinate;
            if (rowOrColumn <= 2)
                coordinate = 0; 
            else if (rowOrColumn <=5)
                coordinate = 3; 
            else
                coordinate = 6;

            return coordinate; 
        }

        function setSolos(){
            while (returnFirstSolo()[0] != -1){
                var firstSolo = returnFirstSolo(); 
                var soloX = firstSolo[0];
                var soloY = firstSolo[1];
                var soloValue = firstSolo[2];

                remove(soloX, soloY, soloValue);
                candidateBoard[soloX][soloY] = [soloValue * -1];

                if(getCell(soloX, soloY) === null)
                    setCell(soloX, soloY, soloValue);
            }
        }

        function returnFirstSolo(){
            var soloCoordinatesAndValue = [-1, -1, -1];

            for (var row = 0; row < 9; row++){
                for (var column = 0; column < 9; column++){
                    var cell = candidateBoard[row][column];

                    if (cell.length == 1 && cell[0] > 0){
                        soloCoordinatesAndValue[0] = row;
                        soloCoordinatesAndValue[1] = column;
                        soloCoordinatesAndValue[2] = cell[0];

                        return soloCoordinatesAndValue;
                    }

                    cell.forEach(function(item){
                        if (item > 0){
                            if (isRowSolo(row, item) || isColumnSolo(column, item) || isGridSolo(row, column, item)){
                                soloCoordinatesAndValue[0] = row;
                                soloCoordinatesAndValue[1] = column;
                                soloCoordinatesAndValue[2] = item; 

                                return soloCoordinatesAndValue;
                            }
                        }
                        
                    });
                }
            }

            return soloCoordinatesAndValue;
        }

        function isRowSolo(row, number){
            var instances = 0;
            for(var column = 0; column < 9; column++){
                if (-1 != candidateBoard[row][column].indexOf(number))
                    instances++;

                if(instances > 1)
                    return false;
            }

            return true; 
        }

        function isColumnSolo(column, number){
            var instances = 0;
            for(var row = 0; row < 9; row++){
                if (-1 != candidateBoard[row][column].indexOf(number))
                    instances++;
                 
                if (instances > 1)
                    return false; 
            }

            return true; 
        }


        function isGridSolo(row, column, number){
            var firstCellOfGridCoords = firstCellOfGridCoordinates(row, column);
            var instances = 0; 

            for (var i = 0; i < 3; i++){
                for (var j = 0; j < 3; j++){
                    var curRow = i + firstCellOfGridCoords[0];
                    var curColumn = j + firstCellOfGridCoords[1];

                    if (-1 != candidateBoard[curRow][curColumn].indexOf(number))
                        instances++;

                    if (instances > 1)
                        return false; 
                }
            }

            return true;
        }

        function handleEliminationRules(){
            handleEliminationRulesFrom(findCandidateCellSetRow, removeFromRow);
            handleEliminationRulesFrom(findCandidateCellSetColumn, removeFromColumn);
        }

        function handleEliminationRulesFrom(finderFunction, removalFunction){
            for (var i = 0; i < 9; i++){
                var tripleSets = finderFunction(i, 3);
                var matchingTripleSubsets = findMatchingTripleSubsetsFromSet(tripleSets);
                removeSetsFrom(matchingTripleSubsets, removalFunction, i);
                var doubleSets = reduceCandidateSetsToDoubles(tripleSets);
                var matchingDoubles = findMatchingDoublesFromSet(doubleSets);
                removeSetsFrom(matchingDoubles, removalFunction, i);
                
                
            }
        }

        function removeSetsFrom(setsToRemove, removalFunction, removalIndex)
        {
            setsToRemove.forEach(function(candidateCellSet){
                    var numbersToRemoveArray = numbersToRemove(candidateCellSet);

                    numbersToRemoveArray.forEach(function(number){
                        removalFunction(removalIndex, number);
                    });

                    repopulateCandidateBoardFromSet(candidateCellSet);
                });
        }

        function findMatchingTripleSubsetsFromSet(candidateCellSet){
            var tripleSubsetArray = [];
            var potentialCandidateCell;

            while (candidateCellSet.length > 0){
                var currentCandidateCell = candidateCellSet.pop();
                
                if (currentCandidateCell.cell.length <= 3)
                {
                    candidateCellSet.forEach(function(checkedCandidateCell){

                        if(candidateCellArraysSubset(currentCandidateCell,checkedCandidateCell)){
                            if(potentialCandidateCell !== undefined && candidateCellArraysSubset(currentCandidateCell, potentialCandidateCell))
                                tripleSubsetArray.push([currentCandidateCell, potentialCandidateCell, checkedCandidateCell]);
                            else 
                                potentialCandidateCell = checkedCandidateCell;
                        }
                    });
                }
            }

            return tripleSubsetArray;
        }

        function candidateCellArraysSubset(candidateCell1, candidateCell2){
            if (candidateCellArraysEqual(candidateCell1, candidateCell2))
                return true;

            if (candidateCell1.cell.length == candidateCell2.cell.length){
                if (candidateCell1.cell.length == 3)
                    return false;
                else{
                    //TODO write the rest of this method.
                }

            }
        }


        function findMatchingDoublesFromSet(candidateCellSet){
            var doublesArray = [];

            while (candidateCellSet.length > 0){
                currentCandidateCell = candidateCellSet.pop();
                
                candidateCellSet.forEach(function(checkedCandidateCell){
                    
                    if (candidateCellArraysEqual(currentCandidateCell, checkedCandidateCell))
                        doublesArray.push([currentCandidateCell, checkedCandidateCell]);
                });
            }

            return doublesArray; 
        }

        function candidateCellArraysEqual(candidateCell1, candidateCell2){
            if (candidateCell1.cell.length != candidateCell2.cell.length)
                return false;

            for (var i = 0; i < candidateCell1.cell.length; i++){
                if(candidateCell1.cell[i] != candidateCell2.cell[i])
                    return false
            }

            return true;
        }   

        function numbersToRemove(candidateCellSet){
            var numbersArray = [];

            candidateCellSet.forEach(function(candidateCell){
                candidateCell.cell.forEach(function(number){
                    if (-1 == numbersArray.indexOf(number))
                        numbersArray.push(number);
                });
            });

            return numbersArray;
        }

        function repopulateCandidateBoardFromSet(candidateCellSet){
            candidateCellSet.forEach(function(candidateCell){
                candidateBoard[candidateCell.row][candidateCell.column] = candidateCell.cell;
            });
        }

        function findCandidateCellSetRow(row, setSize){
            var sets = []; 

            for (var column = 0; column < 9; column++){
                var candidateCell = candidateBoard[row][column];

                if (setSize >= candidateCell.length && 1 < candidateCell.length)
                    sets.push({row:row, column:column, cell:candidateCell});
            }

            return sets; 

        }

        function findCandidateCellSetColumn(column, setSize){
            var sets = [];

            for (var row = 0; row < 9; row++){
                var candidateCell = candidateBoard[row][column];

                if (setSize >= candidateCell.length && 1 < candidateCell.length)
                    sets.push({row:row, column:column, cell:candidateCell});
            }

            return sets;
        }

        function findCandidateCellSetGrid(row, column, setSize){
            var sets = [];
            var firstCellOfGridCoords = firstCellOfGridCoordinates(row, column);

            for (var i = 0; i < 3; i++){
                for (var j = 0; j < 3; j++){
                    var checkedRow = i + firstCellOfGridCoords[0];
                    var checkedColumn = j + firstCellOfGridCoords[1];
                    var candidateCell = candidateBoard[checkedRow][checkedColumn];

                     if (setSize >= candidateCell.length)
                    sets.push({row:row, column:column, cell:candidateCell});
                }
            }
            return sets;
        }

        function reduceCandidateSetsToDoubles(candidateCellSet){
            return candidateCellSet.filter(function(candidateCell){
                return candidateCell.cell.length <= 2; 
            });
        }
    };

    return saga;
}());