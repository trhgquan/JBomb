var cells = [];
var opened = [];
var bombs = [];
var marked = [];

var gameResult = true;
var numberBomb;

/**
 * Generate a random number
 * between "max" and "min"
 */
function generateRandom(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Generate bombs
 */
function bombGenerator() {
    // Calculate number of bombs.
    var maxBomb = Math.floor((width * height) / 2);
    var minBomb = width;
    numberBomb = generateRandom(maxBomb, minBomb);

    // Number of bombs must larger than grid's width
    // and smaller than grid's size.
    do {
        numberBomb = generateRandom(maxBomb, minBomb);
    } while (numberBomb <= minBomb || numberBomb >= maxBomb);

    result.innerText = "Number of bombs: " + numberBomb;

    let bombX, bombY, inner = result.innerText;

    for (var i = 0; i < numberBomb; ++i) {
        do {
            bombX = generateRandom(Number(width), 0);
            bombY = generateRandom(Number(height), 0);
        } while (bombX > width || bombY > height || bombs[bombX][bombY]);

        // Set the position of the bomb
        bombs[bombX][bombY] = true;

        // Draw canvas (delete when it is done)
        // (These for debugging)
        // canvas.fillStyle = "red";
        // setColourByPosition(bombX, bombY, "red");
        // inner += '\t' + '[' + bombX + ', ' + bombY + ']';
        // result.innerText = inner;
    }
}

/**
 * Count number of bombs around the grid (a grid consist of many cells).
 */
function numberGenerator() {
    for (var i = 0; i < width; i++)
        for (var j = 0; j < height; j++)
    		countBombs(i, j);
}

/**
 * Count number of bombs around a cell.
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
 */
function DFS(x, y) {
    // If this is a bomb, this is marked or this has been opened
    // then leave it alone.
    if (bombs[x][y] || marked[x][y] || opened[x][y]) return false;

    // Mark as visited
    opened[x][y] = true;
	setColourByPosition(x, y, "green");

    // If this cell has bombs around a.k.a has number,
    // mark as visited and open it, but not DFS all cells nearby.
    if (cells[x][y] != 0) {
        setTextByPosition(x, y, cells[x][y]);
        return false;
    }

    // setColourByPosition(x, y, "green");

    // A simplify for DFS, must do when finished.
    // let xPos = {0, 0, 1, -1, 1, -1};
    // let yPos = {1, -1, 0, 0, -1, 1};
    // for (var i = 0; i < xPos.length; ++i)
    //     for (var j = 0; j < yPos.length; ++j)

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
