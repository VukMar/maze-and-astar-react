class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.TopWall = true;
        this.RightWall = true;
        this.BottomWall = true;
        this.LeftWall = true;
        this.isVisited = false;
        this.isStart = false;
        this.isEnd = false;
        this.isPath = false;
    }

    checkNeighbors(i,j,grid){
        var Neighbors = [];

        var top    = (i - 1 >= 0)?        grid[i-1][j] : null;
        var right  = (j + 1 < grid[i].length)? grid[i][j+1] : null;
        var bottom = (i + 1 < grid.length)?  grid[i+1][j] : null;
        var left   = (j - 1 >= 0)?        grid[i][j-1] : null;

        if(top && !top.isVisited){
            Neighbors.push(top);
        }
        if(right && !right.isVisited){
            Neighbors.push(right);
        }
        if(bottom && !bottom.isVisited){
            Neighbors.push(bottom);
        }
        if(left && !left.isVisited){
            Neighbors.push(left);
        }

        return Neighbors.length > 0 ? Neighbors[Math.floor(Math.random() * Neighbors.length)] : null;
    }

    removeWalls(a,grid){
        const iDif = this.i - a.i;
        const jDif = this.j - a.j;
    
        if(jDif === 1){
            grid[a.i][a.j].RightWall = false;
            grid[this.i][this.j].LeftWall = false;
        }else if(jDif === -1){
            grid[a.i][a.j].LeftWall = false;
            grid[this.i][this.j].RightWall = false;
        }
    
        if(iDif === 1){
            grid[a.i][a.j].BottomWall = false;
            grid[this.i][this.j].TopWall = false;
        }else if(iDif === -1){
            grid[a.i][a.j].TopWall = false;
            grid[this.i][this.j].BottomWall = false;
        }
    }

}

function createStartAndEnd(grid){
    var sides = ['T','B','L','R'];

    //Shuffle sides
    for (let i = sides.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sides[i], sides[j]] = [sides[j], sides[i]];
    }

    var Start = new Object();
    Start.isCreated = false;
    Start.i = 0;
    Start.j = 0;
    Start.side = '';
    var End = new Object();
    End.isCreated = false;
    End.i = 0;
    End.j = 0;
    End.side = '';

    var i = 0, j = 0, s = '';

    for (const side of sides){
        switch(side){
            case 'T':
                i = 0;
                j = Math.floor(Math.random() * grid[i].length);
                s = 'T';
                break;
            case 'B':
                i = grid.length - 1;
                j = Math.floor(Math.random() * grid[i].length);
                s = 'B';
                break;
            case 'R':
                i = Math.floor(Math.random() * grid.length);
                j = grid[i].length - 1;
                s = 'R';
                break;
            case 'L':
                i = Math.floor(Math.random() * grid.length);
                j = 0;
                s = 'L';
                break;
        }
        if(!Start.isCreated){
            Start.i = i;
            Start.j = j;
            Start.isCreated = true;
            Start.side = s;
        }else if(!End.isCreated){
            End.i = i;
            End.j = j;
            End.isCreated = true;
            End.side = s;
        }
    }

    grid[Start.i][Start.j].isStart = true;
    grid[End.i][End.j].isEnd = true;
    console.log(Start);
    console.log(End);

}

// Maze Generator
function GenerateMaze(rows, cols) {
    if(rows === 0 || cols === 0){
        return null;
    }
    const grid = new Array(cols).fill(null).map(() => new Array(rows).fill(null));
    for (let gi = 0; gi < cols; gi++) {
        for (let gj = 0; gj < rows; gj++) {
            grid[gi][gj] = new Cell(gi, gj);
        }
    }

    // Stack represents the visited nodes
    var stack = [grid[0][0]];
    while(stack.length !== 0){

        // Current is always the last node pushed
        var current = grid[stack[stack.length - 1].i][stack[stack.length - 1].j];
        grid[current.i][current.j].isVisited = true;
        var temp = current.checkNeighbors(current.i, current.j, grid);

        //This if else tells the program to backtrack every time it runs out of valid neighbors
        if(temp){
            //Removes the walls of two cells based on direction we came from
            temp.removeWalls(current,grid);
            stack.push(temp);
        }else{
            //Removes the cell with no neigbors to visit
            stack.pop();
        }
    }
    createStartAndEnd(grid);
    //When done we return the generated grid and render it the way we want
    return grid;
}

// Functions to make grid usable by the a star
function showCell(Cell){
    var CellVisual = new Array(3).fill(null).map(() => new Array(3).fill('█'));
        if (!Cell.TopWall) {
            CellVisual[0][1] = ' ';
        }
        if (!Cell.RightWall) {
            CellVisual[1][2] = ' ';
        }
        if (!Cell.BottomWall) {
            CellVisual[2][1] = ' ';
        }
        if (!Cell.LeftWall) {
            CellVisual[1][0] = ' ';
        }
        if(Cell.isStart){
            CellVisual[1][1] = 'S';
        }else if(Cell.isEnd){
            CellVisual[1][1] = 'E';
        }else{
            CellVisual[1][1] = ' ';
        }

        return CellVisual;
}

function MazeGrid (grid){
    var MazeGridReturn = [];
    for (let i = 0; i < grid.length; i++) {
        // Loop through each cell's inner representation
        for (let k = 0; k < 3; k++) {
            var gridcol = [];
            for (let j = 0; j < grid[0].length; j++) {
                const cell = showCell(grid[i][j]);
                gridcol.push(...cell[k]);
            }
            MazeGridReturn.push(gridcol);
        }
    }
    return MazeGridReturn;
}

export {MazeGrid, GenerateMaze};


