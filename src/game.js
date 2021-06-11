class Game {
  totalBombs;
  canvasControl;
  bombsControl;
  width;
  height;
  clockHandle;

  constructor(gameSize) {
    this.setGameSize(gameSize);
    this.startGame();
    this.initClock();

    // Update total bombs.
    this.canvasControl.writeBombsLeft(this.bombsControl.getCurrentBombs());
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
  startGame = function() {
    // Create a new canvas, with width, height and default boxSize
    this.canvasControl = new CanvasControl(this.width, this.height); 
    
    // Create a new bombs control.
    this.bombsControl  = new BombsControl(
      this.width, this.height, 
      this.totalBombs
    );
  }

  /**
   * Actions when winning.
   */
  winning = function() {
    // Write winning
    this.canvasControl.writeWinning(this.totalBombs);
  }

  /**
   * Actions when losing.
   */
  losing = function() {
    // Write losing.
    this.canvasControl.writeLosing(this.bombsControl.getCurrentBombs());
  }

  /**
   * Ending a game.
   */
  endGame = function() {
    this.destroyClock();

    if (this.isFinished()) {
      this.winning();
    }

    else {
      this.losing();
    }

    // Show locations of all bombs.
    for (let i = 0; i < this.width; ++i) {
      for (let j = 0; j < this.height; ++j) {
        let currentCell = this.bombsControl.getCell(i, j);

        if (currentCell.isBomb()) {
          this.canvasControl.setColour(
            i, j,
            currentCell.hasDefused() ? defusedColour : hasBombColour
          );
        }
      }
    }
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

  /**
   * Check if the game is finished.
   * @returns bool
   */
  isFinished = function() {
    return (this.totalBombs == this.bombsControl.getDefusedBombs() &&
            this.bombsControl.getCurrentBombs() == 0);
  }

  /**
   * Create a clock.
   */
  initClock = function() {
    if (this.clockHandle) {
      this.destroyClock();
    }

    this.clockHandle = setInterval(function() {
      clock.innerText = Number(clock.innerText) + 1;
    }, 1000);
  }

  /**
   * Destroy this clock.
   */
  destroyClock = function() {
    clearInterval(this.clockHandle);

    clock.innerText = 0;

    this.clockHandle = false;
  }

  destructor() {
    this.destroyClock();
    this.bombsControl = {};
    this.canvasControl = {};
  }
}