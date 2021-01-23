'use strict'

const MINE = '💣';
const EMPTY = '';
const FLAG = '🚩';
const SMILE = '😃';
const LOSE = '🤯';
const WIN = '😎';

var gBoard;

var gFirsClick;
var gSafeClick = 0;

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    livesCount: 3,
    secsPassed: 0
}
var gTimeInterval;

function timer() {
    gGame.secsPassed++
    var elTimer = document.querySelector('.timer');
    elTimer.innerHTML = gGame.secsPassed;
}

var gLevel = {
    SIZE: 4,
    MINES: 2
};

function init() {
    gGame.isOn = true;
    gFirsClick = true;
    var elH2 = document.querySelector('h2');
    elH2.innerText = SMILE;
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = 0;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gGame.livesCount = 3;
    gSafeClick = 0;
    var elLives = document.querySelector('.lives');
    elLives.innerText = '❤️ ❤️ ❤️';
    clearInterval(gTimeInterval)
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard)
}

function changeLevel(elBtn) {
    switch (elBtn.innerText) {
        case 'Beginner':
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            document.querySelector('.lives').innerText = '❤️ ❤️ ❤️';
            document.querySelector(`.safe-click`).style.visibility = 'visible';
            break
        case 'Medium':
            gLevel.SIZE = 8;
            gLevel.MINES = 12;
            document.querySelector('.lives').innerText = '❤️ ❤️ ❤️';
            document.querySelector(`.safe-click`).style.visibility = 'visible';
            break
        case 'Expert':
            gLevel.SIZE = 12;
            gLevel.MINES = 30;
            document.querySelector('.lives').innerText = '❤️ ❤️ ❤️';
            document.querySelector(`.safe-click`).style.visibility = 'visible';
            break
    }
    init()
}

function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    setMines(board, gLevel.MINES)
    console.log(board);
    return board;
}


function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var cellContent;
            if (currCell.isShown) {
                if (!currCell.isMine) {
                    cellContent = board[i][j].minesAroundCount;
                } else {
                    cellContent = MINE;
                }
            } else {
                cellContent = EMPTY;
            }
            var tdId = `currCell-${i}-${j}`;
            strHTML += `<td id="${tdId}" class="cell-${i}-${j}" onclick="cellClicked(${i},${j})" oncontextmenu="markCell(this,${i},${j});return false;"> ${cellContent} </td>`;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function renderCell(indexI, indexJ, val) {
    var elCell = document.querySelector(`.cell-${indexI}-${indexJ}`);
    elCell.innerHTML = val;
}

function randomMineLocation(board) {
    var randomPos = {};
    var randomI = Math.floor(Math.random() * board.length);
    var randomJ = Math.floor(Math.random() * board.length);
    randomPos = { i: randomI, j: randomJ };
    return randomPos;

}

function cellClicked(indexI, indexJ) {
    if (gFirsClick) {
        while (gBoard[indexI][indexJ].isMine) {
            gBoard = buildBoard(gLevel.SIZE);
        }
        gTimeInterval = setInterval(timer, 1000);
        gFirsClick = false;
    }
    if (!gGame.isOn) return;
    var elCell = document.querySelector(`.cell-${indexI}-${indexJ}`);

    var currCell = gBoard[indexI][indexJ];
    var number = currCell.minesAroundCount;
    if (currCell.isMarked) return
    if (currCell.isShown) return
    currCell.isShown = true;
    gGame.shownCount++

    if (currCell.isMine) {

        currCell.isShown = true;
        currCell.isMine = true;
        elCell.innerText = MINE;
        if (gGame.livesCount === 3) {
            gGame.livesCount--
            document.querySelector('.lives').innerText = '❤️ ❤️';
        } else if (gGame.livesCount === 2) {
            if (gLevel.SIZE === 4) {
                elCell.style.backgroundColor = 'red';
                showAllMines();
                gameOver()
            }
            gGame.livesCount--
            document.querySelector('.lives').innerText = '❤️ ';
        } else if (gGame.livesCount === 1) {
            gGame.livesCount--
            document.querySelector('.lives').innerText = '';
        }

        if (gGame.livesCount === 0) {
            elCell.style.backgroundColor = 'red';
            showAllMines();
            gameOver()

        }

    }

    else if (number > 0) {

        elCell.innerText = number;
        elCell.classList.add('shown');
    }

    else if (currCell.minesAroundCount === 0) {
        elCell.classList.add('shown');
        expandShown(gBoard, indexI, indexJ);
    }



    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === gLevel.SIZE ** 2 - gLevel.MINES) {
        gameVictory();
    }



}

function markCell(elCell, indexI, indexJ) {
    if (!gGame.isOn) return;
    if (gFirsClick) {
        while (gBoard[indexI][indexJ].isMine) {
            gBoard = buildBoard(gLevel.SIZE);
        }
        gTimeInterval = setInterval(timer, 1000);
        gFirsClick = false;
    }

    var currCell = gBoard[indexI][indexJ];
    if (currCell.isShown) return;
    if (elCell.innerText === FLAG) {
        currCell.isMarked = false;
        elCell.innerText = '';
        gGame.markedCount--
    } else {
        currCell.isMarked = true;
        elCell.innerText = FLAG;
        gGame.markedCount++
    }
    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === gLevel.SIZE ** 2 - gLevel.MINES) {
        gameVictory();
    }

}

function expandShown(board, cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > board.length - 1) continue;
            var currCell = board[i][j];

            if (currCell.isMine) continue;
            if (currCell.isMarked) continue;
            if (currCell.isShown) continue;
            currCell.isShown = true;
            gGame.shownCount++

            var elCell = document.querySelector(`.cell-${i}-${j}`);
            elCell.classList.add('shown');

            if (currCell.minesAroundCount === 0) {
                elCell.innerText = EMPTY;
            } else {
                elCell.innerText = currCell.minesAroundCount;
            }
        }
    }
}

function showAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine) {
                renderCell(i, j, MINE);
            }
        }
    }
}

function gameOver() {
    var elH2 = document.querySelector('h2');
    elH2.innerText = LOSE;
    gGame.isOn = false;
    clearInterval(gTimeInterval);
}

function gameVictory() {
    var elH2 = document.querySelector('h2');
    elH2.innerText = WIN;
    gGame.isOn = false;
    clearInterval(gTimeInterval);

}

function setMines(board, mines) {
    for (var i = 0; i < mines; i++) {
        var randomPos = randomMineLocation(board);
        if (board[randomPos.i][randomPos.j].isMine || board[randomPos.i][randomPos.j].isShown) {
            i--
        } else {
            board[randomPos.i][randomPos.j].isMine = true;
        }
        console.log(randomPos);
    }
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var count = countNegs(board, i, j);
            board[i][j].minesAroundCount = count;

        }
    }

}

function countNegs(board, cellI, cellJ) {

    var minesAroundCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine) {
                minesAroundCount++
            }
        }
    }
    return minesAroundCount;
}


function safeClick(elBtn) {
    gSafeClick++
    var safeCell = getEmptyCell();

    if (gSafeClick <= 3) {
        var randomIdx = getRandomInt(0, safeCell.length)
        markSafeCell(safeCell[randomIdx].i, safeCell[randomIdx].j,'safe');
        setTimeout(function () {
            markSafeCell(safeCell[randomIdx].i, safeCell[randomIdx].j,'');
        }, 2000)
    } else {
        elBtn.style.visibility = 'hidden';
    }
}

function markSafeCell(indexI, indexJ,val) {
    var elCell = document.querySelector(`.cell-${indexI}-${indexJ}`);
    elCell.innerText = val;
}

function getEmptyCell() {
    var emptyCell = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            if (!currCell.isMine && !currCell.isShown) {
                emptyCell.push({ i: i, j: j });
            }
        }
    }
    return emptyCell;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

