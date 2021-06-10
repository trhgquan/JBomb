class Game {
  totalBombs;
  canvasControl;
  bombsControl;
  width;
  height;

  constructor(gameSize) {
    this.setGameSize(gameSize);
    this.startNewGame();

    
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
}