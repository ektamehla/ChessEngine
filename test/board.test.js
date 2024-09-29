const Board = require('../src/chess/board');

describe('Board', () => {
    
    test('should initialize the board correctly', () => {
        const board = new Board();
        expect(board.board).toEqual([
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ]);
    });

    test('should get legal moves (simplified, returns empty array for now)', () => {
        const board = new Board();
        const legalMoves = board.getLegalMoves();
        expect(legalMoves).toEqual([]);
    });

    test('should make a move and return a new board state', () => {
        const board = new Board();
        const newBoard = board.makeMove({ from: 'e2', to: 'e4', piece: 'P' });
        expect(newBoard).not.toBe(board);
    });

    test('should detect if the game is over (simplified, returns false for now)', () => {
        const board = new Board();
        const isGameOver = board.isGameOver();
        expect(isGameOver).toBe(false);
    });

    test('should evaluate the board state correctly (simple material evaluation)', () => {
        const board = new Board();
        const score = board.evaluate();
        expect(score).toBe(0); 
    });

    test('should calculate material score correctly', () => {
        const board = new Board();
        const materialScore = board.getMaterialScore();
        expect(materialScore).toBe(0); 
    });
});
