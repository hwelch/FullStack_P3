var $board = $('#board');
var rows = 9
var columns = 9
var mineCount = 10
var mineSquares = []
var initialClick = true

function newBoard(row, col) {
  $board.empty();
  for(let i = 0; i < row; i++) {
    const $row = $('<div>').addClass('row');
    for(let j = 0; j < col; j++) {
      const $col = $('<div>')
        .addClass('col unclicked')
        .attr('row-num', i)
        .attr('col-num', j);
      $row.append($col);
    }
    $board.append($row);
  }
}


newBoard(rows, columns);