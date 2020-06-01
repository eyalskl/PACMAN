const PACMAN = '&#9786;';
const PACMAN_IMAGE = `<img class="pacman" src="imgs/pacman.png"/>`;

var gPacman;

function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5
    },
    isSuper: false,
    dir: '0deg'
  };
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
}


function checkVictory() {
  return gFoodCount === 1;
}

function movePacman(eventKeyboard) {
  if (!gGame.isOn) return;
  var nextLocation = getNextLocation(eventKeyboard);

  // User pressed none-relevant key in the keyboard
  if (!nextLocation) return;
  var nextCell = gBoard[nextLocation.i][nextLocation.j];
  // Hitting a WALL, not moving anywhere

  switch (nextCell) {
    case WALL:
      return;
    case FOOD:
      updateScore(1);
      gFoodCount--;
      break;
    case GHOST:
      if (gPacman.isSuper) {
        var ghost = findGhost(nextLocation)
        ghost.isEaten = true;
        break;
      } else {
        gameOver()
        renderCell(gPacman.location, EMPTY);
        return;
      }
    case SUPER_FOOD:
      if (gPacman.isSuper) {
        return;
      } else {
        gPacman.isSuper = true;
        renderGhosts()
        setTimeout(function () {
          gPacman.isSuper = false
          renderGhostsAndRevive();
        }, 5000);
      }
      break;
    case CHERRY:
      updateScore(10);
  }
  // Update the model to reflect movement
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
  // Update the DOM
  renderCell(gPacman.location, EMPTY);
  // Update the pacman MODEL to new location  
  gPacman.location = nextLocation;
  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
  // Render updated model to the DOM
  renderCell(gPacman.location, getPacmanHTML());
  if (checkVictory()) {
    gameWon();
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    renderCell(gPacman.location, EMPTY);
  }
}

function getNextLocation(keyboardEvent) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j
  };
  switch (keyboardEvent.code) {
    case 'ArrowUp':
      nextLocation.i--;
      gPacman.dir = '270deg';
      break;
    case 'ArrowDown':
      nextLocation.i++;
      gPacman.dir = '90deg';
      break;
    case 'ArrowLeft':
      nextLocation.j--;
      gPacman.dir = '180deg';
      break;
    case 'ArrowRight':
      nextLocation.j++;
      gPacman.dir = '0deg';
      break;
    case 'KeyN':
      init();
    default: return null;
  }
  return nextLocation;
}

function getPacmanHTML() {
  return `<div style="transform: rotate(${gPacman.dir})">${PACMAN_IMAGE}</div>`
}

function findGhost(pos) {
  for (let i = 0; i < gGhosts.length; i++) {
    var currGhost = gGhosts[i];
    if (pos.i === currGhost.location.i && pos.j === currGhost.location.j) return currGhost;
  }
}