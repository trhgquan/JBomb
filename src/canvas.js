/**
 * Global constants, DOM Elements mostly.
 */
const result = document.getElementById('result'),
      grid_width = document.getElementById('grid_width'),
      grid_height = document.getElementById('grid_height'),
      grid = document.getElementById('grid'),
      clock = document.getElementById('clock');

// Some elements, canvas art mostly.
var canvas,
    boxSize = 40,
    width, height;

/**
 * Draw a grid
 */
function drawBox(width, height) {
    // Canvas Initialize
    canvas = grid.getContext("2d");

    // These codeblocks generate a (width * height) grid.
    canvas.beginPath();
    canvas.fillStyle = "white";     // Background colour: black
    canvas.lineWidth = 3;           // Canvas stroke's width
    canvas.strokeStyle = 'black';   // Canvas stroke
    canvas.font = "20px Arial red"; // Text font

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
    grid.addEventListener('click', handleClick);
    grid.addEventListener('contextmenu', handleRightClick);
}

/**
 * Color a cell
 * (by geometry position method)
 */
function setColourByPosition (x, y, color) {
    canvas.fillStyle = color;
    canvas.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
}

/**
 * Write a text to a cell [x, y]
 */
function setTextByPosition (x, y, txt) {
    canvas.fillStyle = "black";
    canvas.fillText(txt, (boxSize * x) + (boxSize / 2), (boxSize * y) + (boxSize / 2));
}
