class Piece {
    constructor(type, color) {
        this.type = type;
        this.color = color;
    }

    getValue() {
        const values = {
            'pawn': 1,
            'knight': 3,
            'bishop': 3,
            'rook': 5,
            'queen': 9,
            'king': 0 // King has no value
        };
        return values[this.type];
    }
}

module.exports = Piece;
