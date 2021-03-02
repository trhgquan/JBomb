/**
 * Constants for game aka width, height and total bombs;
 */
var gameConstants = function(gameSize) {
  this.totalBombs = 0;
  this.width      = 0;
  this.height     = 0;

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

// Game constant.
var gameConstant;

// Clock interval variable
var gameClockInterval;

/**
 * playBtn click handling, this draw the game canvas and start the game
 */
playBtn.addEventListener('click', function (e) {
  let inputSize = document.querySelector('input[name="gridSize"]:checked').value;

  try {
    gameConstant = new gameConstants(inputSize);
    startNewGame();
  } catch (error) {
    result.innerText = error;
  }

  e.preventDefault();
});

/**
 * Handle left click
 * (click a cell)
 *
 * @param {EventListenerObject} e Event Listener Object
 */
function handleLeftClick (e) {
  // If there is not a bomb
  // Get grid's position
  let x = Math.floor(e.offsetX / boxSize);
  let y = Math.floor(e.offsetY / boxSize);

  // Click that element
  if (cell[x][y].safeOpen()) {
    // DFS all the cells nearby.
    openSafeCells(x, y, gameConstant);

    // Finished the game with true flag - user won.
    if (finished()) endGame(true);
  } else if (cell[x][y].bombOpen()) {
    // Show locations of the bombs.
    showBomb();

    // End game with false flag - user lost.
    endGame(false);
  }
}

/**
 * Handle right click
 * (Mark a cell as bomb)
 *
 * @param {EventListenerObject} e Event Object
 */
function handleRightClick (e) {
  // Get grid's position
  let x = Math.floor(e.offsetX / boxSize);
  let y = Math.floor(e.offsetY / boxSize);

  if (cell[x][y].canMark()) {
    // Mark that position has a bomb.
    setColourByPosition(x, y, markedColour);

    // Mark that position has been marked.
    cell[x][y].isMarked = true;

    // Decrease number of bombs left
    --currentBombs;

    // If that cell is a bomb, increse defused.
    if (cell[x][y].isBomb) ++defusedBombs;

    // Check if the game is finished
    if (finished()) {
      endGame(true);
      return;
    }
  } else if (cell[x][y].canUnmark()) {
    // Unmark that position
    setColourByPosition(x, y, unmarkColour);

    // Unmark that position
    cell[x][y].isMarked = false;

    // If that cell is a bomb, decrease defused.
    if (cell[x][y].isBomb) --defusedBombs;

    // Increase number of bombs left
    ++currentBombs;
  }

  // Update number of bombs left.
  result.innerText = 'Bombs left: ' + currentBombs;

  // Stop the context menu
  e.preventDefault();
}

/**
 * Handle the 'Play' button click
 */
function startNewGame () {
  // Resize the canvas html element
  grid.height = gameConstant.height * boxSize;
  grid.width  = gameConstant.width * boxSize;

  // Re-colour the result box
  result.style.color = resultColour;

  // Draw canvas
  drawBox(gameConstant.width, gameConstant.height);

  // Generate bombs
  bombGenerator();

  // Count bombs in the graph
  // Actually this add text to a cell, mentioning how many bombs around it.
  countBombsInGraph();

  // If the game has started already,
  // and the player restart it then restart the clock,
  if (gameStarted) clockReset();
  clockStart();
}

/**
 * Show locations of the bombs
 * (After finished)
 */
function showBomb () {
  for (let i = 0; i < gameConstant.width; ++i) {
    for (let j = 0; j < gameConstant.height; ++j) {
      if (cell[i][j].isBomb) {
        if (cell[i][j].hasDefused()) {
          setColourByPosition(i, j, defusedColour);
        } else setColourByPosition(i, j, hasBombColour);
      }
    }
  }
}

/**
 * Actions when the game is finished
 *
 * @param {boolean} state True if user won, False if user lost.
 */
function endGame (state) {
  // Total bombs defused is written to a node
  const bombsDefusedElement = document.createTextNode('Bombs defused: ' + defusedBombs);

  // Update text, winning status and bombs defused.
  result.innerText = (state) ? 'Status: WON / ' : 'Status: LOST / ';
  result.style.color = (state) ? noBombColour : hasBombColour;
  result.appendChild(bombsDefusedElement);

  // If player won, show all defused bombs.
  if (state) showBomb();

  // Remove event listener when the game is finished
  // to stop any clicking actions.
  grid.removeEventListener('click', handleLeftClick);
  grid.removeEventListener('contextmenu', handleRightClick);

  // Reset the clock
  clockReset();
}

/**
 * Start the clock
 */
function clockStart () {
  // Clock text
  clock.innerText = 0;

  // Start the clock
  gameClockInterval = setInterval(function () {
    clock.innerText = Number(clock.innerText) + 1;
  }, 1000);

  // Mark the clock started
  gameStarted = true;
}

/**
 * Reset the clock
 */
function clockReset () {
  // Stop the game clock.
  clearInterval(gameClockInterval);

  // mark as not started so the clock will be reset next time.
  gameStarted = false;
}
