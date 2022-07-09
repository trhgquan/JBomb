import * as GameConst from "./const.js";
import { BombsControl, dx, dy } from "./bomb.js";
import CanvasControl from "./canvas.js";

class Game {
  _canvasControl;
  _bombsControl;
  _totalBombs;
  _clockHandle;
  _width;
  _height;

  /**
   * Constructor for Game
   * @param {int} gameSize
   */
  constructor(gameSize) {
    this.setGameSize(gameSize);
    this.startGame();
    this.initClock();
  }

  /**
   * Set the game size.
   * @param {int} gameSize
   */
  setGameSize = function (gameSize) {
    switch (gameSize) {
      case "8x":
        this._totalBombs = 10;
        this._width = 8;
        this._height = 8;
        break;

      case "16x":
        this._totalBombs = 40;
        this._width = 16;
        this._height = 16;
        break;

      case "30x":
        this._totalBombs = 99;
        this._width = 30;
        this._height = 30;
        break;

      default:
        throw "Grid size is not valid.";
    }
  };

  /**
   * Start a new game.
   */
  startGame = function () {
    // Create a new canvas, with width, height and default boxSize
    this._canvasControl = new CanvasControl(this._width, this._height);

    // Create a new bombs control.
    this._bombsControl = new BombsControl(
      this._width,
      this._height,
      this._totalBombs
    );

    this.leftClickHandleBinded = this.leftClickHandle.bind(this);
    this.rightClickHandleBinded = this.rightClickHandle.bind(this);

    // Update total bombs.
    this._canvasControl.writeBombsLeft(this._bombsControl.getCurrentBombs());
    GameConst.result.style.color = GameConst.textColour;

    // Enable event for grid
    GameConst.grid.addEventListener("click", this.leftClickHandleBinded);
    GameConst.grid.addEventListener("contextmenu", this.rightClickHandleBinded);
  };

  /**
   * Handle left click.
   * @param {EventListener} e
   */
  leftClickHandle = function (e) {
    let x = Math.floor(e.offsetX / this._canvasControl.getBoxSize());
    let y = Math.floor(e.offsetY / this._canvasControl.getBoxSize());

    let currentCell = this._bombsControl.getCell(x, y);

    if (currentCell.safeOpen()) {
      this.openSafeCells(x, y);

      if (this.isFinished()) {
        this.endGame();
      }
    } else if (currentCell.bombOpen()) {
      this.endGame();
    }

    e.preventDefault();
  };

  /**
   * Handle right click.
   * @param {EventListener} e
   */
  rightClickHandle = function (e) {
    let x = Math.floor(e.offsetX / this._canvasControl.getBoxSize());
    let y = Math.floor(e.offsetY / this._canvasControl.getBoxSize());

    let currentCell = this._bombsControl.getCell(x, y);

    if (currentCell.canMark()) {
      this._canvasControl.setColour(x, y, GameConst.markedColour);

      currentCell.setMarked(true);

      this._bombsControl.setCurrentBombs(
        this._bombsControl.getCurrentBombs() - 1
      );

      if (currentCell.isBomb()) {
        this._bombsControl.setDefusedBombs(
          this._bombsControl.getDefusedBombs() + 1
        );
      }

      if (this.isFinished()) {
        this.endGame();
        return;
      }
    } else if (currentCell.canUnmark()) {
      this._canvasControl.setColour(x, y, GameConst.unmarkColour);

      currentCell.setMarked(false);

      this._bombsControl.setCurrentBombs(
        this._bombsControl.getCurrentBombs() + 1
      );

      if (currentCell.isBomb()) {
        this._bombsControl.setDefusedBombs(
          this._bombsControl.getDefusedBombs() - 1
        );
      }
    }

    this._canvasControl.writeBombsLeft(this._bombsControl.getCurrentBombs());

    e.preventDefault();
  };

  /**
   * Actions when winning.
   */
  winning = function () {
    // Write winning
    this._canvasControl.writeWinning(this._totalBombs);
  };

  /**
   * Actions when losing.
   */
  losing = function () {
    // Write losing.
    this._canvasControl.writeLosing(this._bombsControl.getDefusedBombs());
  };

  /**
   * Ending a game.
   */
  endGame = function () {
    this.destroyClock();

    if (this.isFinished()) {
      this.winning();
    } else {
      this.losing();
    }

    // Show locations of all bombs.
    for (let i = 0; i < this._width; ++i) {
      for (let j = 0; j < this._height; ++j) {
        let currentCell = this._bombsControl.getCell(i, j);

        if (currentCell.isBomb()) {
          this._canvasControl.setColour(
            i,
            j,
            currentCell.hasDefused() ? GameConst.defusedColour : GameConst.hasBombColour
          );
        }
      }
    }

    this.destructor();
  };

  /**
   * Open safe cells from cell (x, y)
   * @param {int} x
   * @param {int} y
   */
  openSafeCells = function (x, y) {
    let currentCell = this._bombsControl.getCell(x, y);

    // Open that cell.
    this._bombsControl.openCell(x, y);

    // And set colour to opened.
    this._canvasControl.setColour(x, y, GameConst.noBombColour);

    // If around this cell is bombs, then set the bomb count
    // and break the loops.
    if (currentCell.getBombsAround() > 0) {
      this._canvasControl.setText(x, y, currentCell.getBombsAround());
      return;
    }

    for (let i = 0; i < dx.length; ++i) {
      if (
        x + dx[i] < this._width &&
        x + dx[i] >= 0 &&
        y + dy[i] < this._height &&
        y + dy[i] >= 0 &&
        !this._bombsControl.getCell(x + dx[i], y + dy[i]).cannotOpen()
      ) {
        this.openSafeCells(x + dx[i], y + dy[i]);
      }
    }
  };

  /**
   * Check if the game is finished.
   * @returns bool
   */
  isFinished = function () {
    return (
      this._totalBombs == this._bombsControl.getDefusedBombs() &&
      this._bombsControl.getCurrentBombs() == 0
    );
  };

  /**
   * Create a clock.
   */
  initClock = function () {
    if (this._clockHandle) {
      this.destroyClock();
    }

    GameConst.clock.innerText = 0;

    this._clockHandle = setInterval(function () {
      GameConst.clock.innerText = Number(GameConst.clock.innerText) + 1;
    }, 1000);
  };

  /**
   * Destroy this clock.
   */
  destroyClock = function () {
    clearInterval(this._clockHandle);

    this._clockHandle = false;
  };

  /**
   * Destructor.
   */
  destructor = function () {
    this.destroyClock();

    GameConst.grid.removeEventListener("click", this.leftClickHandleBinded);
    GameConst.grid.removeEventListener("contextmenu", this.rightClickHandleBinded);

    this._bombsControl = {};
    this._canvasControl = {};
  };
}

export default Game;