var $board = $('#board');
var revealedBoard = []
var rows = 9
var columns = 9
var mineCount = 10
var mineSquares = []
var initialClick = true

function newBoard(row, col) {
    $board.empty();
    for (let i = 0; i < row; i++) {
        const $row = $('<div>').addClass('row');
        for (let j = 0; j < col; j++) {
            const $col = $('<div>')
                .addClass('col unclicked')
                .attr('row-num', i)
                .attr('col-num', j);
            $row.append($col);
        }
        $board.append($row);
    }
}

function getNeighbors(row, col) {
    let neighbors = []
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let r = row + i
            let c = col + j
            if (r >= 0 && r < rows && c >= 0 && c < columns && (r != row || c != col)) {
                neighbors.push([r, c])
            }
        }
    }
    return neighbors
}

function setMines(row, col) {
    notValidMineLocation = getNeighbors(row, col)
    notValidMineLocation.push([row, col])
    mines = 0
    while (mines < mineCount) {
        randRow = Math.floor(Math.random() * rows);
        randCol = Math.floor(Math.random() * columns);
        let coords = JSON.stringify([randRow, randCol])
        let allCoords = JSON.stringify(notValidMineLocation)
        let coordsFound = allCoords.indexOf(coords)
        if (coordsFound == -1) {
            notValidMineLocation.push([randRow, randCol])
            mineSquares.push([randRow, randCol])
            let $cell = $(`.col[row-num=${randRow}][col-num=${randCol}]`)
            $cell.addClass('mine')
            revealedBoard[randRow][randCol] = "bomb"
            mines++
        }
    }
}

function setRevealedBoard() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (revealedBoard[i][j] == "undef") {
                let neighbors = getNeighbors(i, j)
                let nearbyMines = 0
                neighbors.forEach((neighbor) => {
                    if (revealedBoard[neighbor[0]][neighbor[1]] == "bomb") {
                        nearbyMines += 1
                    }
                })
                revealedBoard[i][j] = nearbyMines === 0 ? '' : nearbyMines;
            }
        }
    }
}

function initializeBoard(row, col) {
    for (let i = 0; i < rows; i++) {
        r = []
        for (let j = 0; j < columns; j++) {
            r.push("undef")
        }
        revealedBoard.push(r)
    }
    setMines(row, col)
    // console.log(mineSquares)
    console.log(revealedBoard)
    setRevealedBoard()
    console.log(revealedBoard)
}

function revealTile(row, col) {
    let $cell = $(`.col[row-num=${row}][col-num=${col}]`)
    $cell.removeClass('unclicked')
    $cell.addClass('clicked')
    let square = revealedBoard[row][col]
    if (square != "bomb") {
        $cell.text(square)
    }
    else {
        icon = 'fa fa-bomb';
        $cell.append(
            $('<i>').addClass(icon)
        );
    }
    console.log(square)
    if(square != '' && square != "bomb") {
        $cell.addClass("num" + square)
    }
}

$board.on('click', '.col.unclicked', function () {
    let $cell = $(this)
    if (initialClick) {
        initializeBoard(+$cell.attr('row-num'), +$cell.attr('col-num'))
        initialClick = false;
    }
    revealTile(+$cell.attr('row-num'), +$cell.attr('col-num'))
})

window.onload = function () {
    startGame();
}

function startGame() {
    document.getElementById("mines-count").innerText = mineCount;
    newBoard(rows, columns);
}