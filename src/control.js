var gameClockInterval;

/**
 * playBtn click handling, this draw the game canvas and start the game
 */
playBtn.addEventListener('click', function(e) {
    drawCanvas();
    e.preventDefault;
});

/**
 * Handle left click
 * (click a cell)
 * 
 * @param {EventListenerObject} e Event Listener Object
 */
function handleLeftClick(e) {
    // If there is not a bomb
    // Get grid's position
    let x = Math.floor(e.offsetX / boxSize);
    let y = Math.floor(e.offsetY / boxSize);

    // Click that element
    if (!bombs[x][y] && !marked[x][y]) {
        DFS(x, y);
        if (finished()) endGame(true);
    } else if (bombs[x][y] && !marked[x][y]) {
        // Show locations of the bombs.
        showBomb();
        endGame(false);
    }
}

/**
 * Handle right click
 * (Mark a cell as bomb)
 * 
 * @param {EventListenerObject} e Event Object
 */
function handleRightClick(e) {
    // Get grid's position
    let x = Math.floor(e.offsetX / boxSize);
    let y = Math.floor(e.offsetY / boxSize);

    if (!opened[x][y] && !marked[x][y]) {
        // Mark that position has a bomb.
        setColourByPosition(x, y, markedColour);
        // Mark that position has been marked.
        marked[x][y] = true;
        // Decrease number of bombs left
        --currentBombs;

        // Check if the game is finished
        if (finished()) {
            endGame(true);
            return;
        }
    } else if (marked[x][y] && !opened[x][y]) {
        // Unmark that position
        setColourByPosition(x, y, unmarkColour);
        marked[x][y] = false;

        // Increase number of bombs left
        ++currentBombs;
    }

    // Update number of bombs left.
    result.innerText = 'Bombs left: ' + currentBombs;

    // Stop the context menu
    e.preventDefault();
    return;
}

/**
 * Handle the 'Play' button click
 */
function drawCanvas() {
    width  = grid_size.value;
    height = grid_size.value;

    // Break the process if the size is invalid.
    if (width < 5) {
        result.innerText = 'Grid size is invalid';   
        return;
    }

    // Resize the canvas html element
    grid.height = height * boxSize;
    grid.width  = width * boxSize;

    // Re-colour the result box
    result.style.color = 'white';

    // Draw canvas
    drawBox(width, height);
    bombGenerator();
    numberGenerator();

    // If the game has started already,
    // and the player restart it then restart the clock,
    if (gameStarted) clockReset();
    clockStart();
}

/**
 * Show locations of the bombs
 * (After finished)
 */
function showBomb() {
    for (let i = 0; i < width; ++i)
        for (let j = 0; j < height; ++j)
            if (bombs[i][j]) setColourByPosition(i, j, hasBombColour);
}

/**
 * Actions when the game is finished
 * 
 * @param {boolean} state True if user won, False if user lost.
 */
function endGame(state){
    if (state) {
        result.innerText = 'YOU WON!';
        result.style.color = noBombColour;
    } else {
        result.innerText = 'YOU LOST!';
        result.style.color = hasBombColour;
    }

    // THIS TO TELL USER THAT THE GAME IS ENDED.
    grid.removeEventListener('click', handleLeftClick);
    grid.removeEventListener('contextmenu', handleRightClick);

    // Reset the clock
    clockReset();
}

/**
 * Start the clock
 */
function clockStart() {
    // Clock text
    clock.innerText = 0;

    // Start the clock
    gameClockInterval = setInterval(function() {
        let gameClockinnerText = Number(clock.innerText) + 1;
        clock.innerText = gameClockinnerText;
    }, 1000);

    // Mark the clock started
    gameStarted = true;
}

/**
 * Reset the clock
 */
function clockReset() {
    // THIS TO STOP THE GAME CLOCK
    clearInterval(gameClockInterval);
    // mark as not started so the clock will be reset next time.
    gameStarted = false;
}
