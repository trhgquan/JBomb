// Clock interval variable
var gameClockInterval;

/**
 * playBtn click handling, this draw the game canvas and start the game
 */
playBtn.addEventListener('click', function (e) {
  startNewGame();
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
    openSafeCells(x, y);

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
  width = grid_size.value;
  height = grid_size.value;

  // Break the process if the size is invalid.
  if (width < 5) {
    result.innerText = 'Grid size is invalid';
    return;
  }

  // Resize the canvas html element
  grid.height = height * boxSize;
  grid.width = width * boxSize;

  // Re-colour the result box
  result.style.color = resultColour;

  // Draw canvas
  drawBox(width, height);

  // Generate bombs
  bombGenerator();

  // Count bombs in the graph
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
  for (let i = 0; i < width; ++i) {
    for (let j = 0; j < height; ++j) {
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
