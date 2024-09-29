const alphaBeta = require('../src/chess/alphaBeta');
const Board = require('../src/chess/board');

test('Alpha-beta pruning basic test', () => {
    let board = new Board();
    let bestMove = alphaBeta(board, 3, -Infinity, Infinity, true);
    expect(bestMove).toBeDefined();
});
