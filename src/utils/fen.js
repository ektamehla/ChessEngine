function parseFEN(fen) {
    const [position, turn, castling, enPassant, halfMoveClock, fullMoveNumber] = fen.split(' ');
    const board = [];
    const ranks = position.split('/');

    ranks.forEach(rank => {
        const row = [];
        for (let char of rank) {
            if (isNaN(char)) {
                row.push(char);
            } else {
                for (let i = 0; i < parseInt(char); i++) {
                    row.push(' ');
                }
            }
        }
        board.push(row);
    });

    return {
        board,     
        turn,            
        castling,        
        enPassant,       
        halfMoveClock,   
        fullMoveNumber   
    };
}

module.exports = parseFEN;
