const dx = [1, -1, 0, 0, 1, -1, 1, -1];
const dy = [0, 0, 1, -1, 1, -1, -1, 1];

/**
 * Store a cell's info.
 */
class bombCell {
  x;
  y;
  bombsAround;
  opened;
  marked;
  bomb;

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.bombsAround = 0;
    this.opened = false;
    this.marked = false;
    this.bomb = false;
  }

  /**
   * Check if a cell is forbidded to open.
   * @returns boolean
   */
  cannotOpen = function () {
    return (this.opened || this.marked || this.bomb);
  }

  /**
   * Check if currently opening a safe cell.
   * @returns boolean
   */
  safeOpen = function () {
    return (!this.bomb && !this.marked);
  }

  /**
   * Check if currently opening a bomb.
   * @returns boolean
   */
  bombOpen = function () {
    return (this.bomb && !this.marked);
  }

  /**
   * Check if a cell can be marked.
   * @returns boolean
   */
  canMark = function () {
    return (!this.opened && !this.marked);
  }

  /**
   * Check if a cell can be unmarked.
   * @returns boolean
   */
  canUnmark = function () {
    return (this.marked && !this.opened);
  }

  /**
   * Check if this is a bomb and has been defused.
   * @returns boolean
   */
  hasDefused = function () {
    return (this.marked && this.bomb);
  }

  /**
   * Check if this cell is opened or not.
   * @returns boolean
   */
  isOpened = function () {
    return this.opened;
  }

  /**
   * Set a cell to be opened.
   * @param {boolean} isOpened 
   */
  setOpened = function(isOpened) {
    this.opened = isOpened;
  }

  /**
   * Check if this cell is a bomb or not.
   * @returns boolean
   */
  isBomb = function() {
    return this.bomb;
  }

  /**
   * Set a cell to become a bomb or not.
   * @param {boolean} isBomb 
   */
  setBomb = function(isBomb) {
    this.bomb = isBomb;
  }

  /**
   * Check if this cell is marked or not.
   * @returns boolean
   */
  isMarked = function() {
    return this.marked;
  }

  /**
   * Set a cell to be marked or not.
   * @param {boolean} isMarked 
   */
  setMarked = function(isMarked) {
    this.marked = isMarked;
  }

  /**
   * Get total bombs around this cell.
   * @returns int
   */
  getBombsAround = function() {
    return this.bombsAround;
  }

  /**
   * Set total bombs around this cell.
   * @param {int} bombsAround 
   */
  setBombsAround = function(bombsAround) {
    this.bombsAround = bombsAround;
  }
};

/**
 * Bombs control.
 */
class BombsControl {
  cellArray;
  currentBombs;
  defusedBombs;
  width;
  height;

  constructor(width, height, maxBombs) {
    this.cellArray = [];
    this.currentBombs = maxBombs;
    this.defusedBombs = 0;
    this.width = width; this.height = height;

    // Create bombs vector.
    for (let i = 0; i < this.width; ++i) {
      this.cellArray[i] = [];
      for (let j = 0; j < this.height; ++j) {
        this.cellArray[i][j] = new bombCell(i, j);
      }
    }

    // Generate bombs.
    this.generate(maxBombs);

    // Count bombs of all cells.
    this.count();
  }

  /**
   * Generate a random integer in [min, max]
   * @param {int} max 
   * @param {int} min 
   * @returns integer
   */
  randomInt = function(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * Generate bombs inside a BombsControl
   * @param {int} maxBombs 
   */
  generate = function(maxBombs) {
    let x, y;
    for (let i = 0; i < maxBombs; ++i) {
      do {
        x = this.randomInt(0, this.width);
        y = this.randomInt(0, this.height);
      } while (this.cellArray[x][y].isBomb());

      this.cellArray[x][y].setBomb(true);
    }
  }

  /**
   * Count all bombs in graph.
   */
  count = function() {
    for (let x = 0; x < this.width; ++x) {
      for (let y = 0; y < this.height; ++y) {
        let bombsAround = 0;

        if (!this.cellArray[x][y].isBomb()) {
          // Count bombs around this cell;
          for (let k = 0; k < dx.length; ++k) {
            if (x + dx[k] >= 0 && x + dx[k] < this.width &&
              y + dy[k] >= 0 && y + dy[k] < this.height &&
              this.cellArray[x + dx[k]][y + dy[k]].isBomb()) {
              ++bombsAround;
            }
          }

          this.cellArray[x][y].setBombsAround(bombsAround);
        }
      }
    }
  }

  /**
   * Get a cell
   * @param {int} x 
   * @param {int} y 
   * @returns BombCell
   */
  getCell = function(x, y) {
    return this.cellArray[x][y];
  }

  /**
   * Open a cell
   * @param {int} x 
   * @param {int} y 
   */
  openCell = function(x, y) {
    this.cellArray[x][y].setOpened(true);
  }

  /**
   * Get total defused bombs
   * @returns int
   */
  getDefusedBombs = function() {
    return this.defusedBombs;
  }

  /**
   * Set total defused bombs
   * @param {int} defusedBombs 
   */
  setDefusedBombs = function(defusedBombs) {
    this.defusedBombs = defusedBombs;
  }

  /**
   * Set current bombs
   * @returns int
   */
  getCurrentBombs = function() {
    return this.currentBombs;
  }

  /**
   * Get current bombs
   * @param {int} currentBombs 
   */
  setCurrentBombs = function(currentBombs) {
    this.currentBombs = currentBombs;
  }
}