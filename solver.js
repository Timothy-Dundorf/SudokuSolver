var sudoku = (function () {
    var saga = {};
    var rowNumber = 0;
    var columnNumber = 0; 
    var grid = createArray(9, 9);

    for (var i = 0; i < 9; i++){
            for (var j = 0; j < 9; j++){
                grid[i][j] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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

        if (currentCell !== null)
        {
            
            remover(rowNumber,columnNumber, currentCell);
            grid[rowNumber][columnNumber] = [-1 * currentCell]; 

            while (returnFirstSolo()[0] != -1)
            {
                var firstSolo = returnFirstSolo(); 
                var soloX = firstSolo[0];
                var soloY = firstSolo[1];
                var soloValue = firstSolo[2];

                remover(soloX, soloY, soloValue);
                grid[soloX][soloY] = [soloValue * -1];

                if(getCell(soloX, soloY) === null)
                    setCell(soloX, soloY, soloValue);

            }
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


       

        function remover(row, column, numberToRemove){
            removeFromRow(row, numberToRemove);
            removeFromColumn(column, numberToRemove);
            removeFromGrid(row, column, numberToRemove);
        }

        function removeFromRow(row, numberToRemove){
            for(var i = 0; i < 9; i++){
                grid[row][i] = grid[row][i].filter(function(value){
                    return value != numberToRemove;   
                });
            }
        }

        function removeFromColumn(column, numberToRemove){
            for(var i = 0; i < 9; i++){
                grid[i][column] = grid[i][column].filter(function(value){
                    return value != numberToRemove;
                });
            }
        }

        function removeFromGrid(row, column, numberToRemove){
            var gridRow = 0;
            var gridColumn = 0;
            if (row <= 2)
                gridRow = 0; 
            else if (row <=5)
                gridRow = 3; 
            else
                gridRow = 6;

            if (column <= 2)
                gridColumn = 0;
            else if (column <= 5)
                gridColumn = 3;
            else 
                gridColumn = 6;

            for (var i = 0; i < 3; i++){
                for (var j = 0; j < 3; j++){
                    grid[gridRow + i][gridColumn + j] = grid[gridRow + i][gridColumn + j].filter(function(value){
                        return value != numberToRemove;
                    });
                }
            }
        }

        function returnFirstSolo()
        {
            var soloCoordinates = createArray(3);
            soloCoordinates[0] = -1;
            soloCoordinates[1] = -1;
            soloCoordinates[2] = -1;

            for (var i = 0; i < 9; i++){
                for (var j = 0; j < 9; j++){
                    var cell = grid[i][j];

                    if (cell.length == 1 && cell[0] > 0){
                        soloCoordinates[0] = i;
                        soloCoordinates[1] = j;
                        soloCoordinates[2] = cell[0];

                        return soloCoordinates;
                    }

                    cell.forEach(function(item){
                        if (item > 0)
                        {
                            if (isRowSolo(i, item) || isColumnSolo(j, item) || isGridSolo(i, j, item)){
                                soloCoordinates[0] = i;
                                soloCoordinates[1] = j;
                                soloCoordinates[2] = item; 

                                return soloCoordinates;
                            }
                        }
                        
                    });
                }
            }

            return soloCoordinates;
        }

        function isRowSolo(row, number)
        {
            var instances = 0;
            for(var i = 0; i < 9; i++){
                if (-1 != grid[row][i].indexOf(number))
                    instances++;

                if(instances > 1)
                    return false;
            }

            return true; 
        }

        function isColumnSolo(column, number)
        {
            var instances = 0;
            for(var i = 0; i < 9; i++){
                if (-1 != grid[i][column].indexOf(number))
                    instances++;
                 
                if (instances > 1)
                    return false; 
            }

            return true; 
        }


        function isGridSolo(row, column, number){
            var gridRow = 0;
            var gridColumn = 0;
            var instances = 0; 

            if (row <= 2)
                gridRow = 0; 
            else if (row <=5)
                gridRow = 3; 
            else
                gridRow = 6;

            if (column <= 2)
                gridColumn = 0;
            else if (column <= 5)
                gridColumn = 3;
            else 
                gridColumn = 6;

            for (var i = 0; i < 3; i++){
                for (var j = 0; j < 3; j++){
                    if (-1 != grid[i + gridRow][j + gridColumn].indexOf(number))
                        instances++;

                    if (instances > 1)
                        return false; 
                }
            }

            return true;
        }

    };

    return saga;
}());