/**
 * Constants for game aka width, height and total bombs;
 */

// Game constant.
var gameHandle;

/**
 * playBtn click handling, this draw the game canvas and start the game
 */
playBtn.addEventListener("click", function (e) {
  try {
    let selectedInput = document.querySelector(
      'input[name="gridSize"]:checked'
    );

    // User didn't choose a grid size before started.
    if (selectedInput == null) {
      throw "Select a grid size, then try again.";
    }

    // Get input value.
    let inputSize = selectedInput.value;

    // Create a new game handle (if not existed one).
    if (gameHandle instanceof Game) {
      gameHandle.destructor();
    }
    gameHandle = new Game(inputSize);
  } catch (error) {
    result.innerText = error;
    result.style.color = hasBombColour;
  }

  e.preventDefault();
});
