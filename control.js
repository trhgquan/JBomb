
/**
 * Handle left click
 * (click a cell)
 */
function handleClick(e) {
    // If there is not a bomb
    // Get grid's position
    let x = Math.floor(e.offsetX / boxSize);
    let y = Math.floor(e.offsetY / boxSize);

    // result.innerText = x + ' ' + y;
    // result.innerText = "Number of bombs: " + numberBomb--;

    // Click that element
    if (!bombs[x][y] && !marked[x][y]) {
        // setTextByPosition(x, y, cells[x][y]);
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
    width  = grid_width.value;
    height = grid_width.value;

    // Resize the canvas html element
    grid.height = height * boxSize;
    grid.width  = width * boxSize;

    // Draw canvas
    drawBox(width, height);
    bombGenerator();
    numberGenerator();
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
    if (state) result.innerText = 'YOU WON!';
    else result.innerText = 'YOU LOST!';

    // THIS TO TELL USER THAT THE GAME IS ENDED.
    grid.removeEventListener('click', handleClick);
    grid.removeEventListener('contextmenu', handleRightClick);
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
