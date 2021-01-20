'use strict'

const MINE = '💣';
const EMPTY = '';

var gBoard = buildBoard();
renderBoard(gBoard)

function buildBoard() {
    var board = [];
    for (var i = 0; i < 4; i++) {
        board[i] = [];
        for (var j = 0; j < 4; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true
            }
        }
    }
    board[0][0].isMine = true;
    board[2][2].isMine = true;
    console.log(board);
    return board;
}

function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var minesCount = setMinesNegsCount(board, i, j)
            var cellContent;
            if (currCell.isShown) {
                if (!currCell.isMine) {
                    cellContent = minesCount;
                } else {
                    cellContent = MINE;
                }
            } else {
                cellContent = EMPTY;
            }
            var tdId = `currCell-${i}-${j}`;

            strHTML += `<td id="${tdId}" class="cell-${i}-${j}" onclick="cellClicked(${i},${j})"> ${cellContent} </td>`;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function cellClicked(indexI, indexJ) {
    var elCell = document.querySelector(`.cell-${indexI}-${indexJ}`);
    var currCell = gBoard[indexI][indexJ]
    var value = (currCell.isMine) ? MINE : currCell.minesAroundCount;
    elCell.innerText = value;
}

function setMinesNegsCount(board, cellI, cellJ) {
    var minesAroundCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine){
                minesAroundCount++
                board[cellI][cellJ].minesAroundCount++
            }    
        }
    }
    return minesAroundCount;
}