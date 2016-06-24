var sudoku = (function () {
    var saga = {};
    var rowNumber = 0;
    var columnNumber = 0; 
    
    saga.iteration = function () {
        var grid = createArray(9, 9);

        grid.forEach(function(row){
            row.forEach(function(cell){
                cell = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            });
        });

        var currentCell = getCell(rowNumber, columnNumber);

        if (getCell != null)
        {
            remover(rowNumber,columnNumber, currentCell);

            while (returnFirstSolo() != [-1, -1])
            {
                var firstSolo = returnFirstSolo(); 
                var soloX = firstSolo[0];
                var soloY = firstSolo[1];
                var soloValue = grid[soloX][soloY];

                remover(soloX, soloY, soloValue);
                grid[soloX][soloY] = soloValue * -1;

                if(getCell(soloX, soloY) == null)
                    setCell(soloX, soloY, soloValue);

            }
        }

        columnNumber++;

        if (columnNumber == 9){
            columnNumber = 0;
            rowNumber++;
        }

        if (row == 9){
            columnNumber = 0;
            rowNumber = 0; 
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
                columnRow = 0;
            else if (column <= 5)
                coulmnRow = 2;
            else 
                columnRow = 6;

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
            var soloCoordinates = [-1, -1];
            for (var i = 0; i < 9; i++){
                for (var j = 0; j < 9; j++){
                    var cell = grid[i][j];
                    if (cell.length == 1 && cell[0] > 0){
                        soloCoordinates = [i, j];
                    }
                }
            }
            return soloCoordinates;
        }
    };

    return saga;
}());