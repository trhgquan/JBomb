/**
 * Global constants, DOM Elements mostly.
 */
const result            = document.getElementById('result'),            // Result is updated and write to this element
      grid_size         = document.getElementById('grid_size'),         // Grid size get from this element
      grid_size_display = document.getElementById('grid_size_display'), // Grid size will be display here
      grid              = document.getElementById('grid'),              // Grid will be draw here
      clock             = document.getElementById('clock'),             // Clock will be draw here
      playBtn           = document.getElementById('playBtn');           // Play button is here

/**
 * Game Canvas constants, colour mostly
 */
const unmarkColour  = '#808080',
      markedColour  = '#ffa500',
      noBombColour  = '#53d16e',
      hasBombColour = '#f00000',
      lineColour    = '#000000',
      textColour    = '#000000';


// Some elements, canvas art mostly.
var canvas;         // Canvas drawing variable
var width, height;  // Canvas width and height
var boxSize = 40;   // Canvas's box size

/**
 * Draw a grid.
 *
 * @param {number} width  width of the grid
 * @param {number} height height of the grid
 */
function drawBox(width, height) {
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
            let x = column * boxSize;
            let y = row * boxSize;
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
 * Write a text to a cell [x, y]
 *
 * @param {number} x   x-position
 * @param {number} y   y-position
 * @param {string} txt text
 */
function setTextByPosition (x, y, txt) {
    canvas.fillStyle = textColour;
    canvas.fillText(txt, (boxSize * x) + (boxSize / 2.5), (boxSize * y) + (boxSize / 1.75));
}
