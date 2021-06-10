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
  canvas;
  width;
  height;
  boxSize;

  constructor(width, height, boxSize = 40) {
    this.width = width;
    this.height = height;
    this.boxSize = boxSize;

    this.draw();
  }

  draw = function() {
    grid.height = this.height * this.boxSize;
    grid.width = this.width * this.boxSize;

    this.canvas = grid.getContext('2d');

    // These codeblocks generate a (width * height) grid.
    this.canvas.beginPath();

    // Colour of the cell.
    this.canvas.fillStyle = unmarkColour;

    // Line width.
    this.canvas.lineWidth = 3;

    // Line colour.
    this.canvas.strokeStyle = lineColour;

    // Text font.
    this.canvas.font = '20px Times';

    for (let row = 0; row < this.width; ++row) {
      for (let column = 0; column < this.height; ++column) {
        // Canvas draw here.
        this.canvas.rect(
          column * this.boxSize, 
          row * this.boxSize, 
          this.boxSize, this.boxSize
        );
        this.canvas.fill();
        this.canvas.stroke();
      }
    }

    this.canvas.closePath();

    // Tell the user the grid_size.
    grid_size_display.innerHTML = 'Grid size: ' + this.width + ' &times; ' + this.height;
  }

  /**
   * Color a cell (by geometry position method).
   *
   * @param {number} x      x-position
   * @param {number} y      y-position
   * @param {string} colour Colour string
   */
  setColour = function (x, y, colour) {
    this.canvas.fillStyle = colour;
    this.canvas.fillRect(
      (x * this.boxSize) + 2, 
      (y * this.boxSize) + 2, 
      this.boxSize - 4, this.boxSize - 4
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
    this.canvas.fillStyle = textColour;
    this.canvas.fillText(
      txt, 
      (this.boxSize * x) + (this.boxSize / 2.5), 
      (this.boxSize * y) + (this.boxSize / 1.75)
    );
  }
}