const Board = require('./chess/board');
const alphaBeta = require('./chess/alphaBeta');

function startGame() {
    let board = new Board();
    let depth = 3; // Depth of the search

    let bestMove = alphaBeta(board, depth, -Infinity, Infinity, true);
    console.log('Best Move:', bestMove);
}

startGame();
