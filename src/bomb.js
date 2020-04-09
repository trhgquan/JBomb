var cells = [];
var opened = [];
var bombs = [];
var marked = [];

var gameStarted = false; // This activate the game's clock
var numberBomb; // Number of bombs generated at the beginning
var currentBombs; // Number of bombs generated minus user-defused bombs.

/**
 * Generate a random number
 * between "min" and "max"
 * 
 * @param {number} min
 * @param {number} max
 * 
 * @return {number} Randomised number, between [min, max]
 */
function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
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
    }
}

/**
 * Count number of bombs around the grid (a grid consist of many cells).
 */
function numberGenerator() {
    for (let i = 0; i < width; i++)
        for (let j = 0; j < height; j++)
    		countBombs(i, j);
}


/**
 * Check if the game is ended
 * The game only end when all bombs are checked and all cells are opened.
 * 
 * @return {boolean}
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
 * Count number of bombs around a cell.
 * (Using DFS, of course).
 * 
 * @param {number} x
 * @param {number} y
 */
function countBombs(x, y) {
    let count = 0;

    // If that cell is not a bomb.
    if (!bombs[x][y]) {
        if (x + 1 < width &&
            bombs[x + 1][y]) count++;
        if (x - 1 >= 0 &&
            bombs[x - 1][y]) count++;
        if (y + 1 < height &&
            bombs[x][y + 1]) count++;
        if (y - 1 >= 0 &&
            bombs[x][y - 1]) count++;
        if (x + 1 < width &&
            y + 1 < height &&
            bombs[x + 1][y + 1]) count++;
        if (x - 1 >= 0 &&
            y - 1 >= 0 &&
            bombs[x - 1][y - 1]) count++;
        if (x + 1 < width &&
            y - 1 >= 0 &&
            bombs[x + 1][y - 1]) count++;
        if (x - 1 >= 0 &&
            y + 1 < height &&
            bombs[x - 1][y + 1]) count++;
    }

    // Cell number = count.
    cells[x][y] = count;
}

/**
 * A simple Depth-first-search algorithm
 * Search the graph, open items have no number
 * Colour items have number, NOT open them.
 * 
 * @param {number} x
 * @param {number} y
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
