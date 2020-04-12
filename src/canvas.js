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
      hasBombColour = '#f00000';


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
    canvas.fillStyle = unmarkColour;            // At the beginning, cell is colored unmarkColour
    canvas.lineWidth = 3;                       // Canvas stroke's width
    canvas.strokeStyle = 'black';               // At the beginning, stroke color is black.
    canvas.font = '20px Times';                 // Text font

    for (let row = 0; row < width; row++) {
        // Declare variables for algorithm
        // a.k.a declare a 2D array in JS.
        cells[row] = [];
        opened[row] = [];
        bombs[row] = [];
        marked[row] = [];

        for (let column = 0; column < height; column++) {
            // Declare variables for algorithm
            cells[row][column] = 0;
            opened[row][column] = false;
            bombs[row][column] = false;
            marked[row][column] = false;

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
    canvas.fillStyle = 'black';
    canvas.fillText(txt, (boxSize * x) + (boxSize / 2.5), (boxSize * y) + (boxSize / 1.75));
}
