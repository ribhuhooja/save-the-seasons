export const [boardHeight, boardWidth] = [8,8];

export const Seasons = {
    FALL:'fall',
    WINTER:'winter',
    SPRING:'spring',
    SUMMER:'summer'
}

export const TreeType = {
    NOTHING:'nothing',      // no tree
    ACORN:'acorn',          // an acorn
    TREE:'tree',            // a normal tree
    BURNING:'burning'       // burning tree
}

export class GameState {
    constructor(prev){
        if (prev === null){
            this.initialize();
        }
        else {
            this.copyState(prev);
        }
    }
    
    initialize(){
        // The game board
        // Not using nested fill because that produces shallow reference
        this.board = Array.from({length : boardHeight}, () => Array(boardWidth).fill(new Tile()));
        
        // The current season
        this.season = Seasons.FALL;
        
        // The special pieces for each season
        this.homecoming = true;
        this.carnival = true;
        this.green_key = true;

        this.initialPopulate()
    }
    
    copyState(prev) {
        this.board = GameState.copyBoard(prev);
        this.season = prev.season;
        this.homecoming = prev.homecoming;
        this.carnival = prev.carnival;
        this.green_key = prev.green_key;
    }

    // Sets the initial tile conditions
    initialPopulate(){

    }

    // copy the board of the previous
    static copyBoard(prev){
        let newBoard = Array.from({length : boardHeight}, () => Array(boardWidth).fill(new Tile()));
        return newBoard;
    }
}

export class Tile {
    constructor() {
        this.trees = Array(4).fill(TreeType.NOTHING); // the trees on this tile
        this.permafrost = false; // whether this tile has permafrost
        this.storm = 0; // the remaining years of storm on this tile
        this.barren = false; // whether this tile is barren
    }
    
    copyTile(prev){
        this.trees = prev.trees;
        this.permafrost = prev.permafrost;
        this.storm = prev.storm;
        this.barren = prev.barren;
    }

    // Used to initialize the tile with a set number of trees
    initTrees(numTrees){
        if (numTrees > 4 || numTrees < 0) throw "Too many trees";
        for (let i = 0; i<numTrees;i++){
            this.trees[i] = TreeType.TREE;
        }
    }
}

// For a tile (i,j), return the indices of all adjacent tile
// Takes care of annoying edge cases
export function getNeighborIndices(i,j){
    let neighbors = Array();
    for (let x=Math.max(i-1,0);x<Math.min(i+2, boardHeight);x++){
        for (let y=Math.max(j-1,0);y<Math.min(j+2, boardWidth);y++){
            // A tile is not its own neighbor
            if (!(x===i&&y===j)){         
                neighbors.push([x,y])
            }

        }
    }
    return neighbors;
}

// Initial tree distribution
// Simple for now, later will do a more complex probability distribution
export function initialTreeDistribution(){
    
    // 40% chance of 1, 40% chance of 2, 20% chance of 3
    function randomNumTrees(){
        let percent = Math.floor(100*Math.random()); // 0 to 99
        if (percent < 40){
            return 1;
        } else if (percent < 80){
            return 2;
        }
        else return 3;
    }
    
    let res = Array.from({length : boardHeight}, () => Array(boardWidth).fill(0));
    for (let i=0;i<boardHeight;i++){
        for (let j=0;j<boardWidth;j++){
            res[i][j] = randomNumTrees();
        }
    }

    // Hardcoded special locations
    // The fall, winter, spring corners
   [res[0][0], res[boardHeight-1][boardWidth-1], res[0][boardWidth-1]] = [4,4,4];
    
    // The summer corner
    res[boardHeight-1][0] = 0;
    res[boardHeight-1][0].barren = true;
    for (let [i,j] of getNeighborIndices(boardHeight-1, 0)){
        res[i][j] = 0;
        res[i][j].barren = true;
        for (let [p,q] of getNeighborIndices(i,j)){
            res[p][q] = 0;
        }
    }

    return res;
}