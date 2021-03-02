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

// Some elements, canvas art mostly.
var canvas; // Canvas drawing variable
var width, height; // Canvas width and height
var boxSize = 40; // Canvas's box size

/**
 * Draw a grid.
 *
 * @param {number} width  width of the grid
 * @param {number} height height of the grid
 */
function drawBox (width, height) {
  // Canvas Initialize
  canvas = grid.getContext('2d');

  // These codeblocks generate a (width * height) grid.
  canvas.beginPath();

  // Colour of the cell.
  canvas.fillStyle = unmarkColour;

  // Line width.
  canvas.lineWidth = 3;

  // Line colour.
  canvas.strokeStyle = lineColour;

  // Text font.
  canvas.font = '20px Times';

  for (let row = 0; row < width; ++row) {
    // Declare a 2D array of cellObjects - the game board.
    cell[row] = [];

    for (let column = 0; column < height; ++column) {
      // Declare variables for algorithm
      cell[row][column] = new cellObjects(row, column);

      // Canvas draw here.
      const x = column * boxSize;
      const y = row * boxSize;
      canvas.rect(x, y, boxSize, boxSize);
      canvas.fill();
      canvas.stroke();
    }
  }

  canvas.closePath();

  // Add event for the game:
  // left-click and right-click
  grid.addEventListener('click', handleLeftClick);
  grid.addEventListener('contextmenu', handleRightClick);

  // Tell the user the grid_size.
  grid_size_display.innerText = 'Grid size: ' + width + ' x ' + height;
}

/**
 * Color a cell (by geometry position method).
 *
 * @param {number} x      x-position
 * @param {number} y      y-position
 * @param {string} colour Colour string
 */
function setColourByPosition (x, y, colour) {
  canvas.fillStyle = colour;
  canvas.fillRect((x * boxSize) + 2, (y * boxSize) + 2, boxSize - 4, boxSize - 4);
}

/**
 * Write a text to a cell has position (x, y)
 *
 * @param {number} x   x-position
 * @param {number} y   y-position
 * @param {string} txt text
 */
function setTextByPosition (x, y, txt) {
  canvas.fillStyle = textColour;
  canvas.fillText(txt, (boxSize * x) + (boxSize / 2.5), (boxSize * y) + (boxSize / 1.75));
}
