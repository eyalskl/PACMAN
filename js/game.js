'use strict';
const WALL = '[⬛]';
const FOOD = '.';
const SUPER_FOOD = '●';
const CHERRY = '🍒';
const EMPTY = ' ';
const START_AUDIO = new Audio('sound/theme.mp3');

var gBoard;
var gGame = {};
var gFoodCount;
var gCherryInterval;

function init() {
  reset();
  gBoard = buildBoard();
  createPacman(gBoard);
  createGhosts(gBoard);
  printMat(gBoard, '.board-container');
  renderCell(gPacman.location, getPacmanHTML());
  renderGhosts();
  gGame.isOn = true;
  gCherryInterval = setInterval(placeCherryRandomlly, 15000);
  // START_AUDIO.play()
}

function reset() {
  document.querySelector('.modal').hidden = true;
  document.querySelector('header h3 span').innerText = 0;
  if (gIntervalGhosts) clearInterval(gIntervalGhosts);
  if (gCherryInterval) clearInterval(gCherryInterval);
  gGame.score = 0;
  gFoodCount = 0;
}

function placeCherryRandomlly() {
  var empties = getEmptyVals(gBoard);
  if (empties.length < 1) return;
  var randPos = empties[getRandomIntInclusive(0, empties.length - 1)];
  gBoard[randPos.i][randPos.j] = CHERRY;
  renderCell(randPos, CHERRY);
}

function buildBoard() {
  var SIZE = 12;
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      if ((i === 1 && j === 1) ||
        (i === 1 && j === SIZE - 2) ||
        (i === SIZE - 2 && j === 1) ||
        (i === SIZE - 2 && j === SIZE - 2)) board[i][j] = SUPER_FOOD;
      else {
        board[i][j] = FOOD;
        gFoodCount++;
      }
      if (i === 0 || i === SIZE - 1 ||
        j === 0 || j === SIZE - 1 ||
        (j === 3 && i > 4 && i < SIZE - 2)) {
        board[i][j] = WALL;
        gFoodCount--;
      }
    }
  }
  return board;
}

function updateScore(value) {
  // Update both the model and the dom for the score
  gGame.score += value;
  document.querySelector('header h3 span').innerText = gGame.score;
}


function gameOver() {
  document.querySelector('.modal').hidden = '';
  document.querySelector('.modal span').innerText = 'Game Over!';
  document.querySelector('.modal button').innerText = 'Restart';
  gGame.isOn = false;
  clearInterval(gIntervalGhosts);
  clearInterval(gCherryInterval);
  gIntervalGhosts = null;
  gCherryInterval = null;
}

function gameWon() {
  document.querySelector('.modal').hidden = '';
  document.querySelector('.modal span').innerText = 'Victorious!';
  document.querySelector('.modal button').innerText = 'Play Again';
  gGame.isOn = false;
  clearInterval(gIntervalGhosts);
  clearInterval(gCherryInterval);
  gCherryInterval = null;
  gIntervalGhosts = null;
}




