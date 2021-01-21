'use strict'

const MINE = '💣';
const EMPTY = '';
const FLAG = '🚩';
const LOSE = '🤯';
const WIN = '😎';

var gBoard;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
};

function init() {
    gBoard = buildBoard(gLevel.SIZE, gLevel.MINES);
    renderBoard(gBoard)
}

function changeLevel(elBtn) {
    switch (elBtn.innerText) {
        case 'Beginner':
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            break
        case 'Medium':
            gLevel.SIZE = 8;
            gLevel.MINES = 12;
            break
        case 'Expert':
            gLevel.SIZE = 12;
            gLevel.MINES = 30;
            break
    }
    init()
}

function buildBoard(size, mines) {
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

    for (var i = 0; i < mines; i++) {
        var randomPos = randomMineLocation(board);
        if (board[randomPos.i][randomPos.j].isMine) {
            i--
        }
        else {
            board[randomPos.i][randomPos.j].isMine = true;
        }
        console.log(randomPos);
    }

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var count = setMinesNegsCount(board, i, j);
            board[i][j].minesAroundCount = count;

        }
    }

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

            strHTML += `<td id="${tdId}" class="cell-${i}-${j}" onclick="cellClicked(${i},${j})" oncontextmenu="markCell(this);return false;"> ${cellContent} </td>`;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// console.log(randomMineLocation());

function randomMineLocation(board) {
    var randomPos = {};
    var randomI = Math.floor(Math.random() * board.length);
    var randomJ = Math.floor(Math.random() * board.length);
    randomPos = { i: randomI, j: randomJ };
    return randomPos;

}

function cellClicked(indexI, indexJ) {
    var elCell = document.querySelector(`.cell-${indexI}-${indexJ}`);
    var currCell = gBoard[indexI][indexJ];
    var number = currCell.minesAroundCount;
    if (currCell.isMarked) return
    if (currCell.isShown) return
    currCell.isShown = true;
    if (currCell.isMine) {
        elCell.innerText = MINE;
    }
    else if (number > 0) {
        elCell.innerText = number;
        elCell.classList.add('shown');

    }
    else if (currCell.minesAroundCount === 0) {
        expandShown(gBoard, indexI, indexJ);
    }

}

function markCell(elCell) {

    if (elCell.innerText === FLAG) {
        elCell.innerText = '';
        gGame.markedCount--
    } else {
        elCell.innerText = FLAG;
        gGame.markedCount++
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
            currCell.isShown = true;

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



function setMinesNegsCount(board, cellI, cellJ) {

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



