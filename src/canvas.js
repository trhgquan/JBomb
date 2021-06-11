/**
 * Global constants, DOM Elements mostly.
 */

// Result is updated and write to this element
const result = document.getElementById('result');

// Grid size will be display here
const grid_size_display = document.getElementById('grid_size_display');

// Grid will be draw here
const grid = document.getElementById('grid');

// Clock will be draw here
const clock = document.getElementById('clock');

// Play button is here
const playBtn = document.getElementById('playBtn');

/**
 * Game Canvas constants, colour mostly
 */
const unmarkColour  = '#808080';
const markedColour  = '#ffa500';
const noBombColour  = '#53d16e';
const hasBombColour = '#f00000';
const defusedColour = '#00ffff';
const lineColour    = '#000000';
const textColour    = '#000000';
const resultColour  = '#ffffff';

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
  draw = function() {
    grid.height = this._height * this._boxSize;
    grid.width = this._width * this._boxSize;

    this._canvas = grid.getContext('2d');

    // These codeblocks generate a (width * height) grid.
    this._canvas.beginPath();

    // Colour of the cell.
    this._canvas.fillStyle = unmarkColour;

    // Line width.
    this._canvas.lineWidth = 3;

    // Line colour.
    this._canvas.strokeStyle = lineColour;

    // Text font.
    this._canvas.font = '20px Times';

    for (let row = 0; row < this._width; ++row) {
      for (let column = 0; column < this._height; ++column) {
        // Canvas draw here.
        this._canvas.rect(
          column * this._boxSize, 
          row * this._boxSize, 
          this._boxSize, this._boxSize
        );
        this._canvas.fill();
        this._canvas.stroke();
      }
    }

    this._canvas.closePath();

    this.writeSize();
  }

  getBoxSize = function() {
    return this._boxSize;
  }

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
      (x * this._boxSize) + 2, 
      (y * this._boxSize) + 2, 
      this._boxSize - 4, this._boxSize - 4
    );
  }

  /**
   * Write a text to a cell has position (x, y)
   *
   * @param {number} x   x-position
   * @param {number} y   y-position
   * @param {string} txt text
   */
  setText = function (x, y, txt) {
    this._canvas.fillStyle = textColour;
    this._canvas.fillText(
      txt, 
      (this._boxSize * x) + (this._boxSize / 2.5), 
      (this._boxSize * y) + (this._boxSize / 1.75)
    );
  }

  /**
   * Write the grid size to the zone.
   */
   writeSize = function() {
    // Tell the user the grid_size.
    grid_size_display.innerHTML = 'Grid size: ' + 
                                  this._width + 
                                  ' &times; ' + 
                                  this._height;
  }

  /**
   * Write bombs count to screen.
   * @param {int} bombsCount 
   */
  writeBombsLeft = function(bombsCount) {
    result.innerText = 'Bombs left: ' + bombsCount;
  }

  /**
   * Write when won.
   * @param {int} bombsCount 
   */
  writeWinning = function(bombsCount) {
    const newNode = document.createTextNode('Bombs defused: ' + bombsCount);

    result.innerText = 'Status: WON / ';
    result.style.color = noBombColour;
    result.appendChild(newNode);
  }

  /**
   * Write when lose.
   * @param {int} bombsCount 
   */
  writeLosing = function(bombsCount) {
    const newNode = document.createTextNode('Bombs defused: ' + bombsCount);

    result.innerText = 'Status: LOST / ';
    result.style.color = hasBombColour;
    result.appendChild(newNode);
  }
}