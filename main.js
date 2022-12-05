var $board = $('#board');
var revealedBoard = []
var rows = 9
var columns = 9
var mineCount = 10
var initialMineCount = 10
var mineSquares = []
var initialClick = true
var revealedTiles = []
var gameOver = false
var flagSet = false

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
    setRevealedBoard()
}

function revealTile(row, col) {
    let $cell = $(`.col[row-num=${row}][col-num=${col}]`)
    if ($cell.hasClass('unclicked')) {
        $cell.removeClass('unclicked')
        $cell.addClass('clicked')
        let square = revealedBoard[row][col]
        if (square != "bomb") {
            revealedTiles.push(`${row} ${col}`)
            if (revealedTiles.length == rows * columns - initialMineCount) {
                gameOver = !gameOver
                alert("YOU WIN!")
            }
            $cell.text(square)
        }
        else {
            icon = 'fa fa-bomb';
            $cell.append(
                $('<i>').addClass(icon)
            );
            if (!gameOver) {
                gameOver = !gameOver
                revealMines()
                alert("YOU LOSE!")
                $cell.css("background-color", "red")
            }
        }
        if (square != '' && square != "bomb") {
            $cell.addClass("num" + square)
        }
    }
}

function pressTile(row, col) {
    revealTile(row, col)
    if (revealedBoard[row][col] == '') {
        let neighbors = getNeighbors(row, col)
        neighbors.forEach((neighbor) => {
            let allCoords = JSON.stringify(revealedTiles)
            let coords = JSON.stringify(`${neighbor[0]} ${neighbor[1]}`)
            let coordsFound = allCoords.indexOf(coords)
            if (coordsFound == -1) {
                return pressTile(neighbor[0], neighbor[1])
            }
        })
    }
}

function revealMines() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (revealedBoard[i][j] == "bomb")
                revealTile(i, j);
        }
    }
}

$board.on('click', '.col.unclicked', function () {
    let $cell = $(this)
    if (initialClick) {
        initializeBoard(+$cell.attr('row-num'), +$cell.attr('col-num'))
        initialClick = false;
    }
    if(!gameOver) {
        if (flagSet) {
            if ($cell.text() == '') {
                $cell.css("font-size", 30)
                $cell.text('🚩')
                
            }
            else {
                $cell.text('')
            }
        }
        else {
            pressTile(+$cell.attr('row-num'), +$cell.attr('col-num'))
        }
    }
})

window.onload = function () {
    startGame();
}

function startGame() {
    document.getElementById("mines-count").innerText = mineCount;
    newBoard(rows, columns);
}

$('#reset-btn').click( function () {
    revealedBoard = []
    mineCount = 10
    mineSquares = []
    initialClick = true
    revealedTiles = []
    gameOver = false
    startGame()
})

$('#flag-btn').click( function () {
    let $cell = $(this)
    if(flagSet) {
        $cell.css("background-color", "lightgray")
    }
    else {
        $cell.css("background-color", "darkgray")
    }
    flagSet = !flagSet
})