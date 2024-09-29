class Move {
    constructor(from, to, piece) {
        this.from = from; // e.g. 'e2'
        this.to = to; // e.g. 'e4'
        this.piece = piece;
    }
}

module.exports = Move;
