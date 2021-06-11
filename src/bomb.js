/**
 * Positions to traverse.
 */
const dx = [1, -1, 0, 0, 1, -1, 1, -1];
const dy = [0, 0, 1, -1, 1, -1, -1, 1];

/**
 * Flags for a bomb.
 */
const FLAG_OPENED = 1 << 0;
const FLAG_MARKED = 1 << 1;
const FLAG_BOMB = 1 << 2;

/**
 * Store a cell's info.
 */
class bombCell {
  _x;
  _y;
  _bombsAround;
  _flag;

  /**
   * Constructor for bombCell
   * @param {int} x 
   * @param {int} y 
   */
  constructor(x, y) {
    this._x = x;
    this._y = y;
    this._bombsAround = 0;
    this._flag = 0;
  }

  /**
   * Check if a cell is forbidded to open.
   * @returns boolean
   */
  cannotOpen = function () {
    return ((this._flag & FLAG_OPENED) ||
            (this._flag & FLAG_MARKED) ||
            (this._flag & FLAG_BOMB));
  }

  /**
   * Check if currently opening a safe cell.
   * @returns boolean
   */
  safeOpen = function () {
    return (!(this._flag & FLAG_BOMB) &&
            !(this._flag & FLAG_MARKED));
  }

  /**
   * Check if currently opening a bomb.
   * @returns boolean
   */
  bombOpen = function () {
    return ((this._flag & FLAG_BOMB) &&
            !(this._flag & FLAG_MARKED));
  }

  /**
   * Check if a cell can be marked.
   * @returns boolean
   */
  canMark = function () {
    return (!(this._flag & FLAG_OPENED) &&
            !(this._flag & FLAG_MARKED));
  }

  /**
   * Check if a cell can be unmarked.
   * @returns boolean
   */
  canUnmark = function () {
    return ((this._flag & FLAG_MARKED) &&
            !(this._flag & FLAG_OPENED));
  }

  /**
   * Check if this is a bomb and has been defused.
   * @returns boolean
   */
  hasDefused = function () {
    return ((this._flag & FLAG_MARKED) &&
            (this._flag & FLAG_BOMB));
  }

  /**
   * Check if this cell is opened or not.
   * @returns boolean
   */
  isOpened = function () {
    return this._flag & FLAG_OPENED;
  }

  /**
   * Set a cell to be opened.
   * @param {boolean} isOpened 
   */
  setOpened = function(isOpened) {
    if (isOpened) {
      this._flag |= FLAG_OPENED;
    }

    else {
      this._flag &= ~FLAG_OPENED;
    }
  }

  /**
   * Check if this cell is a bomb or not.
   * @returns boolean
   */
  isBomb = function() {
    return this._flag & FLAG_BOMB;
  }

  /**
   * Set a cell to become a bomb or not.
   * @param {boolean} isBomb 
   */
  setBomb = function(isBomb) {
    if (isBomb) {
      this._flag |= FLAG_BOMB;
    }

    else {
      this._flag &= ~FLAG_BOMB;
    }
  }

  /**
   * Check if this cell is marked or not.
   * @returns boolean
   */
  isMarked = function() {
    return this._flag & FLAG_MARKED;
  }

  /**
   * Set a cell to be marked or not.
   * @param {boolean} isMarked 
   */
  setMarked = function(isMarked) {
    if (isMarked) {
      this._flag |= FLAG_MARKED;
    }

    else {
      this._flag &= ~FLAG_MARKED;
    }
  }

  /**
   * Get total bombs around this cell.
   * @returns int
   */
  getBombsAround = function() {
    return this._bombsAround;
  }

  /**
   * Set total bombs around this cell.
   * @param {int} bombsAround 
   */
  setBombsAround = function(bombsAround) {
    this._bombsAround = bombsAround;
  }
};

/**
 * Bombs control.
 */
class BombsControl {
  _cellArray;
  _currentBombs;
  _defusedBombs;
  _width;
  _height;

  /**
   * Constructor for BombsControl
   * @param {int} width 
   * @param {int} height 
   * @param {int} maxBombs 
   */
  constructor(width, height, maxBombs) {
    this._cellArray = [];
    this._currentBombs = maxBombs;
    this._defusedBombs = 0;
    this._width = width; this._height = height;

    // Create bombs vector.
    for (let i = 0; i < this._width; ++i) {
      this._cellArray[i] = [];
      for (let j = 0; j < this._height; ++j) {
        this._cellArray[i][j] = new bombCell(i, j);
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
        x = this.randomInt(0, this._width);
        y = this.randomInt(0, this._height);
      } while (this._cellArray[x][y].isBomb());

      this._cellArray[x][y].setBomb(true);
    }
  }

  /**
   * Count all bombs in graph.
   */
  count = function() {
    for (let x = 0; x < this._width; ++x) {
      for (let y = 0; y < this._height; ++y) {
        let bombsAround = 0;

        if (!this._cellArray[x][y].isBomb()) {
          // Count bombs around this cell;
          for (let k = 0; k < dx.length; ++k) {
            if (x + dx[k] >= 0 && x + dx[k] < this._width &&
              y + dy[k] >= 0 && y + dy[k] < this._height &&
              this._cellArray[x + dx[k]][y + dy[k]].isBomb()) {
              ++bombsAround;
            }
          }

          this._cellArray[x][y].setBombsAround(bombsAround);
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
    return this._cellArray[x][y];
  }

  /**
   * Open a cell
   * @param {int} x 
   * @param {int} y 
   */
  openCell = function(x, y) {
    this._cellArray[x][y].setOpened(true);
  }

  /**
   * Get total defused bombs
   * @returns int
   */
  getDefusedBombs = function() {
    return this._defusedBombs;
  }

  /**
   * Set total defused bombs
   * @param {int} defusedBombs 
   */
  setDefusedBombs = function(defusedBombs) {
    this._defusedBombs = defusedBombs;
  }

  /**
   * Set current bombs
   * @returns int
   */
  getCurrentBombs = function() {
    return this._currentBombs;
  }

  /**
   * Get current bombs
   * @param {int} currentBombs 
   */
  setCurrentBombs = function(currentBombs) {
    this._currentBombs = currentBombs;
  }
}