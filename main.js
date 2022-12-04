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
            if(r >= 0 && r < rows && c >= 0 && c < columns && (r != row || c != col)) {
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
    while(mines < mineCount) {
        randRow = Math.floor(Math.random() * rows);
        randCol = Math.floor(Math.random() * columns);
        let coords = JSON.stringify([randRow, randCol])
        let allCoords = JSON.stringify(notValidMineLocation)
        let coordsFound = allCoords.indexOf(coords)
        if (coordsFound == -1) {
            notValidMineLocation.push([randRow, randCol])
            mineSquares.push([randRow, randCol])
            let $cell = $(`.col.unclicked[row-num=${randRow}][col-num=${randCol}]`)
            $cell.addClass('mine')
            mines++
        }
    }
}

function initializeBoard(row, col) {
    setMines(row, col)
    console.log(mineSquares)
    
}

$board.on('click', '.col.unclicked', function () {
    let $cell = $(this)
    $cell.removeClass('unclicked')
    $cell.addClass('clicked')
    if(initialClick) {
        initializeBoard(+$cell.attr('row-num'),+$cell.attr('col-num'))
        initialClick = false;
    }
})

window.onload = function () {
    startGame();
}

function startGame() {
    document.getElementById("mines-count").innerText = mineCount;
    newBoard(rows, columns);
}