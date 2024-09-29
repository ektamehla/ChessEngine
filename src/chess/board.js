const parseFEN = require('../utils/fen');

class Board {
    constructor(fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
        const parsed = parseFEN(fen);
        this.board = parsed.board; 
        this.turn = parsed.turn;            // 'w' or 'b' to indicate turn
        this.castlingRights = parsed.castling;  // Castling rights
        this.enPassant = parsed.enPassant;  
        this.halfMoveClock = parsed.halfMoveClock;
        this.fullMoveNumber = parsed.fullMoveNumber;
    }

    getLegalMoves() {
        const legalMoves = [];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece !== ' ' && this.isWhitePiece(piece) === (this.turn === 'w')) {
                    const moves = this.getPieceMoves(piece, row, col);
                    legalMoves.push(...moves);
                }
            }
        }

        return legalMoves;
    }

    getPieceMoves(piece, row, col) {
        const moves = [];

        switch (piece.toLowerCase()) {
            case 'p': // Pawn moves
                this.getPawnMoves(piece, row, col, moves);
                break;
            case 'r': // Rook moves
                this.getRookMoves(row, col, moves);
                break;
            case 'n': // Knight moves
                this.getKnightMoves(row, col, moves);
                break;
            case 'b': // Bishop moves
                this.getBishopMoves(row, col, moves);
                break;
            case 'q': // Queen moves (rook + bishop)
                this.getRookMoves(row, col, moves);
                this.getBishopMoves(row, col, moves);
                break;
            case 'k': // King moves
                this.getKingMoves(row, col, moves);
                break;
        }

        return moves;
    }

    makeMove(move) {
        const { from, to, piece } = move;
        const [fromRow, fromCol] = this.parsePosition(from);
        const [toRow, toCol] = this.parsePosition(to);

        const newBoard = this.board.map(row => [...row]);

        // Move the piece
        newBoard[toRow][toCol] = piece;
        newBoard[fromRow][fromCol] = ' ';

        // Return the new board state
        const newBoardState = new Board();
        newBoardState.board = newBoard;
        newBoardState.turn = this.turn === 'w' ? 'b' : 'w';  // Switch turns

        return newBoardState;
    }

    isGameOver() {
        const legalMoves = this.getLegalMoves();
        return legalMoves.length === 0 || this.isCheckmate() || this.isStalemate();
    }

    isCheckmate() {
        const kingPosition = this.findKing(this.turn);
        return this.isInCheck(kingPosition) && this.getLegalMoves().length === 0;
    }

    isStalemate() {
        return this.getLegalMoves().length === 0 && !this.isInCheck(this.findKing(this.turn));
    }

    isInCheck(kingPosition) {
        const opponentMoves = this.getLegalMovesForOpponent();
        return opponentMoves.some(move => move.to === kingPosition);
    }

    getLegalMovesForOpponent() {
        const legalMoves = [];
        const opponentTurn = this.turn === 'w' ? 'b' : 'w';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece !== ' ' && this.isWhitePiece(piece) !== (this.turn === 'w')) {
                    const moves = this.getPieceMoves(piece, row, col);
                    legalMoves.push(...moves);
                }
            }
        }

        return legalMoves;
    }

    evaluate() {
        return this.getMaterialScore();
    }

    getMaterialScore() {
        const pieceValues = {
            'p': 1, 'r': 5, 'n': 3, 'b': 3, 'q': 9, 'k': 0, // Black pieces
            'P': 1, 'R': 5, 'N': 3, 'B': 3, 'Q': 9, 'K': 0  // White pieces
        };

        let score = 0;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece !== ' ') {
                    score += pieceValues[piece] * (piece === piece.toUpperCase() ? 1 : -1);
                }
            }
        }

        return score;
    }

    getPawnMoves(piece, row, col, moves) {
        const direction = piece === 'P' ? -1 : 1;
        const nextRow = row + direction;

        if (this.isEmptySquare(nextRow, col)) {
            moves.push({ from: this.formatPosition(row, col), to: this.formatPosition(nextRow, col), piece });
        }

        if (col > 0 && this.isOpponentPiece(nextRow, col - 1)) {
            moves.push({ from: this.formatPosition(row, col), to: this.formatPosition(nextRow, col - 1), piece });
        }

        if (col < 7 && this.isOpponentPiece(nextRow, col + 1)) {
            moves.push({ from: this.formatPosition(row, col), to: this.formatPosition(nextRow, col + 1), piece });
        }
    }

    getRookMoves(row, col, moves) {
        this.getSlidingMoves(row, col, moves, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
    }

    getBishopMoves(row, col, moves) {
        this.getSlidingMoves(row, col, moves, [[1, 1], [-1, -1], [1, -1], [-1, 1]]);
    }

    getQueenMoves(row, col, moves) {
        this.getSlidingMoves(row, col, moves, [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]);
    }

    getKingMoves(row, col, moves) {
        const directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];

        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            if (this.isValidSquare(newRow, newCol) && !this.isSameColorPiece(newRow, newCol)) {
                moves.push({ from: this.formatPosition(row, col), to: this.formatPosition(newRow, newCol), piece: this.board[row][col] });
            }
        }
    }

    getKnightMoves(row, col, moves) {
        const knightMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];

        for (const [dx, dy] of knightMoves) {
            const newRow = row + dx;
            const newCol = col + dy;
            if (this.isValidSquare(newRow, newCol) && !this.isSameColorPiece(newRow, newCol)) {
                moves.push({ from: this.formatPosition(row, col), to: this.formatPosition(newRow, newCol), piece: this.board[row][col] });
            }
        }
    }

    getSlidingMoves(row, col, moves, directions) {
        for (const [dx, dy] of directions) {
            let newRow = row + dx;
            let newCol = col + dy;

            while (this.isValidSquare(newRow, newCol) && this.isEmptySquare(newRow, newCol)) {
                moves.push({ from: this.formatPosition(row, col), to: this.formatPosition(newRow, newCol), piece: this.board[row][col] });
                newRow += dx;
                newCol += dy;
            }

            if (this.isValidSquare(newRow, newCol) && this.isOpponentPiece(newRow, newCol)) {
                moves.push({ from: this.formatPosition(row, col), to: this.formatPosition(newRow, newCol), piece: this.board[row][col] });
            }
        }
    }

    findKing(turn) {
        const king = turn === 'w' ? 'K' : 'k';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === king) {
                    return this.formatPosition(row, col);
                }
            }
        }
        return null; // if the king is not found
    }

    isOpponentPiece(row, col) {
        const piece = this.board[row][col];
        return piece !== ' ' && this.isWhitePiece(piece) !== (this.turn === 'w');
    }

    isEmptySquare(row, col) {
        return this.board[row][col] === ' ';
    }

    isValidSquare(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    isSameColorPiece(row, col) {
        const piece = this.board[row][col];
        return piece !== ' ' && this.isWhitePiece(piece) === (this.turn === 'w');
    }

    isWhitePiece(piece) {
        return piece === piece.toUpperCase();
    }

    formatPosition(row, col) {
        const files = 'abcdefgh';
        return files[col] + (8 - row);
    }

    parsePosition(position) {
        const files = 'abcdefgh';
        const file = position[0];
        const rank = position[1];
        const col = files.indexOf(file);
        const row = 8 - parseInt(rank, 10);
        return [row, col];
    }
}

module.exports = Board;