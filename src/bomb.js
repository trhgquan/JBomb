var cells    = [], // This to count bombs around a cell.
    opened   = [], // This to mark that cell is opened.
    bombs    = [], // This to mark that cell has a bomb.
    marked   = [], // This to mark that cell is marked.
    bombList = []; // This contains positon holding bombs;
                   // The bomb list is used to prevent 2-for-loops.

var gameStarted = false; // This activate the game's clock.
var numberBomb;          // Number of bombs generated at the beginning.
var currentBombs;        // Number of bombs generated minus user-defused bombs.

/**
 * Generate a random number
 * between "min" and "max"
 * 
 * @param {number} min minimum
 * @param {number} max maximum
 * 
 * @return {number} Randomised number, between [min, max]
 */
function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * This function will initialise variables, generate bombs and count them.
 */
function initialise() {
    // Reset all variables
    resetVariables();

    // Generate bombs
    bombGenerator();

    // Count bombs in the graph
    countBombsInGraph();
}

/**
 * Generate bombs
 */
function bombGenerator() {
    // Calculate number of bombs.
    let maxBomb = Math.floor((width * height) / 2);
    let minBomb = width;

    // Number of bombs must larger than grid's width
    // and smaller than grid's size.
    do {
        numberBomb = generateRandom(minBomb, maxBomb);
    } while (numberBomb <= minBomb || numberBomb >= maxBomb);

    // Update number of bombs currently and display it
    currentBombs = numberBomb;

    result.innerText = 'Bombs left: ' + currentBombs;

    let bombX, bombY, inner = result.innerText;

    for (let i = 0; i < numberBomb; ++i) {
        // Set the bomb at (bombX, bombY) position
        // if there is no bomb set at that position
        // and the position is still inside the grid.
        do {
            bombX = generateRandom(0, Number(width));
            bombY = generateRandom(0, Number(height));
        } while (bombX > width || bombY > height || bombs[bombX][bombY]);

        // Set the position of the bomb
        bombs[bombX][bombY] = true;

        // Add bomb to the list
        bombList.push({bombX, bombY});
    }
}

/**
 * Count number of bombs around the grid (a grid consist of many cells).
 */
function countBombsInGraph() {
    for (let i = 0; i < numberBomb; ++i) {
        // Get the position of the bomb
        let x = bombList[i].bombX;
        let y = bombList[i].bombY;

        // Increase count of adjacent cells.
        countBombs(x, y);
    }
}

/**
 * Count number of bombs defused
 * Loop numberBomb times, only when the game is ended / player is dead.
 * 
 * @return {number} Number of bombs defused
 */
function countBombsDefused() {
    let defusedBombs = 0;
    
    for (let i = 0; i < numberBomb; ++i) {
        let x = bombList[i].bombX;
        let y = bombList[i].bombY;

        if (bombs[x][y] && marked[x][y]) ++defusedBombs;
    }

    return defusedBombs;
}

/**
 * Check if the game is ended
 * The game only end when all bombs are checked and all cells are opened.
 * 
 * @return {boolean} True if the game is finished, False otherwise.
 */
function finished() {
    for (let i = 0; i < width; ++i){
        for (let j = 0; j < height; ++j){
            if ((!bombs[i][j] && opened[i][j]) || (bombs[i][j] && marked[i][j])) continue;
            else return false;
        }
    }
    return true;
}

/**
 * Assuming [x, y] is a bomb, we increase counting of all adjacent cells.
 * (Using DFS, of course).
 * 
 * @param {number} x x-position
 * @param {number} y y-position
 */
function countBombs(x, y) {
    if (x + 1 < width &&
        !bombs[x + 1][y]) ++cells[x + 1][y];
    if (x - 1 >= 0 &&
        !bombs[x - 1][y]) ++cells[x - 1][y];
    if (y + 1 < height &&
        !bombs[x][y + 1]) ++cells[x][y + 1];
    if (y - 1 >= 0 &&
        !bombs[x][y - 1]) ++cells[x][y - 1];
    if (x + 1 < width &&
        y + 1 < height &&
        !bombs[x + 1][y + 1]) ++cells[x + 1][y + 1];
    if (x - 1 >= 0 &&
        y - 1 >= 0 &&
        !bombs[x - 1][y - 1]) ++cells[x - 1][y - 1];
    if (x + 1 < width &&
        y - 1 >= 0 &&
        !bombs[x + 1][y - 1]) ++cells[x + 1][y - 1];
    if (x - 1 >= 0 &&
        y + 1 < height &&
        !bombs[x - 1][y + 1]) ++cells[x - 1][y + 1];
}

/**
 * A simple Depth-first-search algorithm
 * Search the graph, open items have no number
 * Colour items have number, NOT open them.
 * 
 * @param {number} x x-position
 * @param {number} y y-position
 */
function DFS(x, y) {
    // If this is a bomb, this is marked or this has been opened
    // then leave it alone.
    if (bombs[x][y] || marked[x][y] || opened[x][y]) return;

    // Mark as visited
    opened[x][y] = true;
    setColourByPosition(x, y, noBombColour);

    // If this cell has bombs around a.k.a has number,
    // mark as visited and open it, but not DFS all cells nearby.
    if (cells[x][y] != 0) {
        setTextByPosition(x, y, cells[x][y]);
        return;
    }

    // Check other nearby cells, if it does not contains a bomb
    // then open it.
    if (x + 1 < width) DFS(x + 1, y);
    if (x - 1 >= 0) DFS(x - 1, y);
    if (y + 1 < height) DFS(x, y + 1);
    if (y - 1 >= 0) DFS(x, y - 1);
    if (x + 1 < width &&
        y + 1 < height) DFS(x + 1, y + 1);
    if (x - 1 >= 0 &&
        y - 1 >= 0) DFS(x - 1, y - 1);
    if (x + 1 < width &&
        y - 1 >= 0) DFS(x + 1, y - 1);
    if (x - 1 >= 0 &&
        y + 1 < height) DFS(x - 1, y + 1);
}

/**
 * Reset all variables after game finished
 */
function resetVariables() {
    // Only reset if that variable has value.
    if (bombList.length > 0){
        bombList.length = 0;
    }
}