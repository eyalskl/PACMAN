const GHOST = '&#9781;';

var gIntervalGhosts;
var gGhosts;
var gEatenGhosts = []

function createGhost(board) {
    var empties = getEmptyValsForGhost(gBoard);
    var ghost = {
        location: empties[getRandomIntInclusive(0, empties.length - 1)],
        currCellContent: FOOD,
        color: getRandomColor(),
        isEaten: false
    };
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST;
}

function createGhosts(board) {
    gGhosts = [];
    // empty the gGhosts array, create some ghosts
    createGhost(board)
    createGhost(board)
    createGhost(board)
    //  and run the interval to move them
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function renderGhosts() {
    for (let i = 0; i < gGhosts.length; i++) {
        const currGhost = gGhosts[i];
        renderCell(currGhost.location, getGhostHTML(currGhost));
    }
}
function renderGhostsAndRevive() {
    for (let i = 0; i < gGhosts.length; i++) {
        const currGhost = gGhosts[i];
        renderCell(currGhost.location, getGhostHTML(currGhost));
        currGhost.isEaten = false
    }
}


function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        // if the ghost is eaten it cant move
        if (ghost.isEaten) continue
        // Create the moveDiff
        var moveDiff = getMoveDiff();
        var nextLocation =
        {
            i: ghost.location.i + moveDiff.i,
            j: ghost.location.j + moveDiff.j
        }
        // console.log('ghost.location', ghost.location, 'nextLocation', nextLocation, 'moveDiff', moveDiff)
        var nextCel = gBoard[nextLocation.i][nextLocation.j]
        // if WALL - give up
        switch (nextCel) {
            case WALL:
                continue
            case GHOST:
                continue
            case PACMAN:
                if (gPacman.isSuper) continue;
                gameOver();
                return;
        }
        // set back what we stepped on: update Model, DOM
        gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
        renderCell(ghost.location, ghost.currCellContent)
        // move the ghost
        ghost.location = nextLocation
        // keep the contnet of the cell we are going to
        ghost.currCellContent = gBoard[nextLocation.i][nextLocation.j]
        // move the ghost and update model and dom
        gBoard[ghost.location.i][ghost.location.j] = GHOST
        renderCell(ghost.location, getGhostHTML(ghost))
    }
}

function getMoveDiff() {
    var randNum = getRandomIntInclusive(0, 100)
    if (randNum < 25) {
        return { i: 0, j: 1 }
    } else if (randNum < 50) {
        return { i: -1, j: 0 }
    } else if (randNum < 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}


function getGhostHTML(ghost) {
    if (gPacman.isSuper) return `<span class="ghost" style="color:blue">${GHOST}</span>`
    return `<span class="ghost" style="color:${ghost.color}">${GHOST}</span>`
}






