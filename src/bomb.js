// Object to store a cell's info
var cellObjects = function (x, y) {
  this.x = x,
  this.y = y,
  this.bombsAround = 0,
  this.isOpened = false,
  this.isMarked = false,
  this.isBomb = false,

  // Method to check if a cell can be open automatically or not.
  // (using in DFS function).
  this.cannotOpen = function () {
    return (this.isOpened || this.isMarked || this.isBomb);
  }

  // Method to check if a cell clicked is safe.
  this.safeOpen = function () {
    return (!this.isBomb && !this.isMarked);
  }

  // Method to check if a cell clicked is a bomb.
  this.bombOpen = function () {
    return (this.isBomb && !this.isMarked);
  }

  // Method to check if a cell can be marked.
  this.canMark = function () {
    return (!this.isOpened && !this.isMarked);
  }

  // Method to check if a cell can be unmarked.
  this.canUnmark = function () {
    return (this.isMarked && !this.isOpened);
  }

  // Method to check if a bomb is defused.
  // (Marking only).
  this.hasDefused = function () {
    return (this.isMarked && this.isBomb);
  }
};

// Array of cellObjects.
var cell = [];

// This activate the game's clock.
var gameStarted = false;

// Number of bombs generated at the beginning.
var numberBomb;

// Number of bombs generated minus user-defused bombs.
var currentBombs;

// Number of bombs defused.
var defusedBombs;

/**
 * Generate a random number
 * between "min" and "max"
 *
 * @param {number} min minimum
 * @param {number} max maximum
 *
 * @return {number} Randomised number, between [min, max]
 */
function generateRandom (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * This function will initialise variables, generate bombs and count them.
 */
function initialise (gameConstant) {
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
function bombGenerator () {
  let bombX, bombY;

  // Update number of bombs currently and display it
  currentBombs = gameConstant.totalBombs;

  // Update number of bombs defused, currently 0.
  defusedBombs = 0;

  // Update result text.
  result.innerText = 'Bombs left: ' + currentBombs;

  for (let i = 0; i < gameConstant.totalBombs; ++i) {
    // Set the bomb at (bombX, bombY) position
    // if there is no bomb set at that position
    // and the position is still inside the grid.
    do {
      bombX = generateRandom(0, gameConstant.width);
      bombY = generateRandom(0, gameConstant.height);
    } while (cell[bombX][bombY].isBomb)

    // Set the position of the bomb
    cell[bombX][bombY].isBomb = true;
  }
}

/**
 * Count number of bombs around the grid (a grid consist of many cells).
 */
function countBombsInGraph () {
  for (let i = 0; i < gameConstant.width; ++i) {
    for (let j = 0; j < gameConstant.height; ++j) {
      countBombs(i, j);
    }
  }
}

/**
 * Check if the game is ended
 * The game only end when all bombs are marked.
 *
 * @return {boolean} True if the game is finished, False otherwise.
 */
function finished () {
  return (gameConstant.totalBombs === defusedBombs && currentBombs === 0);
}

/**
 * Assuming [x, y] is a bomb, we increase counting of all adjacent cells.
 * (Using DFS, of course).
 *
 * @param {number} x x-position
 * @param {number} y y-position
 */
function countBombs (x, y) {
  let count = 0;
  const dx = [1, -1, 0, 0, 1, -1, 1, -1];
  const dy = [0, 0, 1, -1, 1, -1, -1, 1];

  // If that cell is not a bomb.
  if (!cell[x][y].isBomb) {
    for (let i = 0; i < dx.length; ++i) {
      if (x + dx[i] >= 0 && x + dx[i] < gameConstant.width &&
          y + dy[i] >= 0 && y + dy[i] < gameConstant.height) {
        if (cell[x + dx[i]][y + dy[i]].isBomb) ++count;
      }
    }
  }

  // Cell number = count.
  cell[x][y].bombsAround = count;
}

/**
 * A simple Depth-first-search algorithm
 * Search the graph, open items have no number
 * Colour items have number, NOT open them.
 *
 * @param {number} x x-position
 * @param {number} y y-position
 */
function openSafeCells (x, y) {
  // If this is a bomb, this is marked or this has been opened
  // then leave it alone.
  if (cell[x][y].cannotOpen()) return;

  // Mark as visited
  cell[x][y].isOpened = true;
  setColourByPosition(x, y, noBombColour);

  // If this cell has bombs around a.k.a has number,
  // mark as visited and open it, but not DFS all cells nearby.
  if (cell[x][y].bombsAround !== 0) {
    setTextByPosition(x, y, cell[x][y].bombsAround);
    return;
  }

  const dx = [1, -1, 0, 0, 1, -1, -1, 1];
  const dy = [0, 0, 1, -1, 1, -1, 1, -1];

  // Check other nearby cells, if it does not contains a bomb
  // then open it.
  for (let i = 0; i < dx.length; ++i) {
    if (x + dx[i] >= 0 && x + dx[i] < gameConstant.width &&
        y + dy[i] >= 0 && y + dy[i] < gameConstant.height) {
      openSafeCells(x + dx[i], y + dy[i], gameConstant);
    }
  }
}
