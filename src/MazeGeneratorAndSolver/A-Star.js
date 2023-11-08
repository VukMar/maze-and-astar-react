class Node {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.TopWall = true;
        this.BottomWall = true;
        this.RightWall = true;
        this.LeftWall = true;
        this.neighbors = [];
        this.previous = null;
    }
}

function addNeighbors(Node, grid) {
    
    const i = Node.i;
    const j = Node.j;
    const cols = grid.length;
    const rows = grid[0].length;


    //Neighbors
    if (j > 0){
        if(!Node.LeftWall)
            Node.neighbors.push(grid[i][j - 1]);
    } 
    if (j < rows - 1){
        if(!Node.RightWall){
            Node.neighbors.push(grid[i][j + 1]);
        }
    }
    if (i > 0){
        if(!Node.TopWall){
            Node.neighbors.push(grid[i - 1][j]);
        }
    } 
    if (i < cols - 1){
        if(!Node.BottomWall){
            Node.neighbors.push(grid[i + 1][j]);
        }
    } 

}


function removeFromArray(arr, element) {
    const index = arr.indexOf(element);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}

function heuristic(nodeA, nodeB) {
    // Calculate the Manhattan distance as a heuristic
    return Math.abs(nodeA.i - nodeB.i) + Math.abs(nodeA.j - nodeB.j);
}

function aStar(grid) {
    var start,end;
    var PathGrid = new Array(grid.length).fill(null).map(el => new Array(grid[0].length).fill(null));
    for(var i = 0; i < PathGrid.length; i++){
        for(var j = 0; j < PathGrid[0].length; j++){
            PathGrid[i][j] = new Node(i,j);
            PathGrid[i][j].TopWall = grid[i][j].TopWall;
            PathGrid[i][j].BottomWall = grid[i][j].BottomWall;
            PathGrid[i][j].LeftWall = grid[i][j].LeftWall;
            PathGrid[i][j].RightWall = grid[i][j].RightWall;
            if(grid[i][j].isEnd){
                end = PathGrid[i][j];
            }
            if(grid[i][j].isStart){
                start = PathGrid[i][j];
            }
        }
    }

    const openSet = [start];
    const closedSet = [];

    while (openSet.length > 0) {
        let current = openSet[0];

        for (let i = 1; i < openSet.length; i++) {
            if (openSet[i].f < current.f || (openSet[i].f === current.f && openSet[i].h < current.h)) {
                current = openSet[i];
            }
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        if (current === end) {
            // Path found, reconstruct and return the path
            const path = [];
            let temp = current;
            path.push(temp);
            while (temp.previous) {
                path.push(temp.previous);
                temp = temp.previous;
            }
            return path;
        }

        addNeighbors(current,PathGrid);

        for (const neighbor of current.neighbors) {
            if (!closedSet.includes(neighbor)) {
                    const tempG = current.g + 1;
                    if (!openSet.includes(neighbor) || tempG < neighbor.g) {
                        neighbor.g = tempG;
                        neighbor.h = heuristic(neighbor, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;

                        if (!openSet.includes(neighbor)) {
                            openSet.push(neighbor);
                        }
                    }
            }
        }
    }

    // No path found
    return null;
}

export default aStar;
