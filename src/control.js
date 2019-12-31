var gameClockInterval;

/**
 * Handle left click
 * (click a cell)
 */
function handleClick(e) {
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
 */
function handleRightClick(e) {
    // Get grid's position
    let x = Math.floor(e.offsetX / boxSize);
    let y = Math.floor(e.offsetY / boxSize);

    if (!opened[x][y] && !marked[x][y]) {
        // Mark that position has a bomb.
        setColourByPosition(x, y, "orange");
        // Mark that position has been marked.
        marked[x][y] = true;
        if (finished()) endGame(true);
    } else if (marked[x][y] && !opened[x][y]) {
        setColourByPosition(x, y, "white");
        marked[x][y] = false;
    }

    // Stop the context menu
    e.preventDefault();
    return false;
}

/**
 * Handle the "Play" button click
 */
function drawCanvas() {
    width  = grid_size.value;
    height = grid_size.value;

    // Resize the canvas html element
    grid.height = height * boxSize;
    grid.width  = width * boxSize;

    // Re-colour the result box
    result.style.color = "#000000";

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
 */
function showBomb() {
    for (let i = 0; i < width; ++i)
        for (let j = 0; j < height; ++j)
            if (bombs[i][j])  setColourByPosition(i, j, "red");
}

/**
 * Actions when the game is finished
 */
function endGame(state){
    if (state) { result.innerText = 'YOU WON!'; result.style.color = "#14eb6a";}
    else { result.innerText = 'YOU LOST!'; result.style.color = "#ff3300";}

    // THIS TO TELL USER THAT THE GAME IS ENDED.
    grid.removeEventListener('click', handleClick);
    grid.removeEventListener('contextmenu', handleRightClick);

    // Reset the clock
    clockReset();
}

/**
 * Check if user is won
 * Return true if no cell is uncheck, bomb cells are checked
 */
function finished() {
    for (let i = 0; i < width; ++i)
        for (let j = 0; j < height; ++j)
            if ((!bombs[i][j] && opened[i][j]) || (bombs[i][j] && marked[i][j])) continue;
            else return false;
    return true;
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
