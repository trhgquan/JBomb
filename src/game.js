class Game {
  totalBombs;
  canvasControl;
  bombsControl;
  width;
  height;
  clock;

  constructor(gameSize) {
    this.setGameSize(gameSize);
    this.startNewGame();

    // Update total bombs.
    result.innerText = "Bombs left: " + this.totalBombs;
  }

  /**
   * Set the game size.
   * @param {int} gameSize 
   */
  setGameSize(gameSize) {
    switch (gameSize) {
      case '8x':
        this.totalBombs = 10;
        this.width      = 8;
        this.height     = 8;
        break;
  
      case '16x':
        this.totalBombs = 40;
        this.width      = 16;
        this.height     = 16;
        break;
  
      case '30x':
        this.totalBombs = 99;
        this.width      = 30;
        this.height     = 30;
        break;
  
      default:
        throw 'Grid size is not valid.';
    }
  }

  /**
   * Start a new game.
   */
  startNewGame = function() {
    // Create a new canvas, with width, height and default boxSize
    this.canvasControl = new CanvasControl(this.width, this.height); 
    this.bombsControl  = new BombsControl(this.width, this.height, this.totalBombs);
  }

  /**
   * Get total bombs of this round.
   * @returns int
   */
  getTotalBombs = function() {
    return this.totalBombs;
  }

  /**
   * Get this round's width
   * @returns int
   */
  getWidth = function() {
    return this.width;
  }

  /**
   * Get this round's height
   * @returns int
   */
  getHeight = function() {
    return this.height;
  }

  /**
   * Open safe cells from cell (x, y)
   * @param {int} x 
   * @param {int} y 
   */
  openSafeCells = function(x, y) { 
    let currentCell = this.bombsControl.getCell(x, y);
    
    // Open that cell.
    this.bombsControl.openCell(x, y);

    // And set colour to opened.
    this.canvasControl.setColour(x, y, noBombColour);

    // If around this cell is bombs, then set the bomb count
    // and break the loops.
    if (currentCell.getBombsAround() > 0) {
      this.canvasControl.setText(
        x, y,
        currentCell.getBombsAround()
      );
      return;
    }

    for (let i = 0; i < dx.length; ++i) {
      if (x + dx[i] < this.width && x + dx[i] >= 0 &&
          y + dy[i] < this.height && y + dy[i] >= 0 &&
          !this.bombsControl
              .getCell(x + dx[i], y + dy[i])
              .cannotOpen()) {
            this.openSafeCells(x + dx[i], y + dy[i]);
          }
    }
  }
}