/**
 * Global constants, DOM Elements mostly.
 */
const result = document.getElementById('result'),
      grid_size = document.getElementById('grid_size'),
      grid_size_display = document.getElementById('grid_size_display'),
      grid = document.getElementById('grid'),
      clock = document.getElementById('clock');
      playBtn = document.getElementById('playBtn');

/**
 * Game Canvas constants, colour mostly
 */
const unmarkColour  = '#808080',
      markedColour  = '#ffa500',
      noBombColour  = '#53d16e',
      hasBombColour = '#f00000';


// Some elements, canvas art mostly.
var canvas,
    boxSize = 40,
    width, height;

/**
 * Draw a grid.
 * 
 * @param {number} width
 * @param {number} height
 */
function drawBox(width, height) {
    // Canvas Initialize
    canvas = grid.getContext('2d');

    // These codeblocks generate a (width * height) grid.
    canvas.beginPath();
    canvas.fillStyle = unmarkColour;            // At the beginning, cell is colored white
    canvas.lineWidth = 3;                       // Canvas stroke's width
    canvas.strokeStyle = 'black';               // At the beginning, stroke color is black.
    canvas.font = '20px Times';                 // Text font

    for (let row = 0; row < width; row++) {
        // Declare variables for algorithm
        // a.k.a declare a 2D array in Js.
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
 * @param {number} x
 * @param {number} y
 * @param {string} colour Colour string
 */
function setColourByPosition (x, y, colour) {
    canvas.fillStyle = colour;
    canvas.fillRect((x * boxSize) + 2, (y * boxSize) + 2, boxSize - 4, boxSize - 4);
}

/**
 * Write a text to a cell [x, y]
 * 
 * @param {number} x
 * @param {number} y
 * @param {string} txt
 */
function setTextByPosition (x, y, txt) {
    canvas.fillStyle = 'black';
    canvas.fillText(txt, (boxSize * x) + (boxSize / 2.5), (boxSize * y) + (boxSize / 1.75));
}
