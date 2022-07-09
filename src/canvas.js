import * as GameConst from "./const.js";

/**
 * Definition of the canvas control.
 */
class CanvasControl {
  _canvas;
  _width;
  _height;
  _boxSize;

  /**
   * Constructor for CanvasControl
   * @param {int} width
   * @param {int} height
   * @param {int} boxSize
   */
  constructor(width, height, boxSize = 40) {
    this._width = width;
    this._height = height;
    this._boxSize = boxSize;

    this.draw();
  }

  /**
   * Draw graphic grid.
   */
  draw = function () {
    GameConst.grid.height = this._height * this._boxSize;
    GameConst.grid.width = this._width * this._boxSize;

    this._canvas = GameConst.grid.getContext("2d");

    // These codeblocks generate a (width * height) grid.
    this._canvas.beginPath();

    // Colour of the cell.
    this._canvas.fillStyle = GameConst.unmarkColour;

    // Line width.
    this._canvas.lineWidth = 3;

    // Line colour.
    this._canvas.strokeStyle = GameConst.lineColour;

    // Text font.
    this._canvas.font = "20px Times";

    for (let row = 0; row < this._width; ++row) {
      for (let column = 0; column < this._height; ++column) {
        // Canvas draw here.
        this._canvas.rect(
          column * this._boxSize,
          row * this._boxSize,
          this._boxSize,
          this._boxSize
        );
        this._canvas.fill();
        this._canvas.stroke();
      }
    }

    this._canvas.closePath();

    this.writeSize();
  };

  getBoxSize = function () {
    return this._boxSize;
  };

  /**
   * Color a cell (by geometry position method).
   *
   * @param {number} x      x-position
   * @param {number} y      y-position
   * @param {string} colour Colour string
   */
  setColour = function (x, y, colour) {
    this._canvas.fillStyle = colour;
    this._canvas.fillRect(
      x * this._boxSize + 2,
      y * this._boxSize + 2,
      this._boxSize - 4,
      this._boxSize - 4
    );
  };

  /**
   * Write a text to a cell has position (x, y)
   *
   * @param {number} x   x-position
   * @param {number} y   y-position
   * @param {string} txt text
   */
  setText = function (x, y, txt) {
    this._canvas.fillStyle = GameConst.textColour;
    this._canvas.fillText(
      txt,
      this._boxSize * x + this._boxSize / 2.5,
      this._boxSize * y + this._boxSize / 1.75
    );
  };

  /**
   * Write the grid size to the zone.
   */
  writeSize = function () {
    // Tell the user the grid_size.
    GameConst.grid_size_display.innerHTML =
      "Grid size: " + this._width + " &times; " + this._height;
  };

  /**
   * Write bombs count to screen.
   * @param {int} bombsCount
   */
  writeBombsLeft = function (bombsCount) {
    GameConst.result.innerText = "Bombs left: " + bombsCount;
  };

  /**
   * Write when won.
   * @param {int} bombsCount
   */
  writeWinning = function (bombsCount) {
    const newNode = document.createTextNode("Bombs defused: " + bombsCount);

    GameConst.result.innerText = "Status: WON / ";
    GameConst.result.style.color = GameConst.noBombColour;
    GameConst.result.appendChild(newNode);
  };

  /**
   * Write when lose.
   * @param {int} bombsCount
   */
  writeLosing = function (bombsCount) {
    const newNode = document.createTextNode("Bombs defused: " + bombsCount);

    GameConst.result.innerText = "Status: LOST / ";
    GameConst.result.style.color = GameConst.hasBombColour;
    GameConst.result.appendChild(newNode);
  };
}

export default CanvasControl;
