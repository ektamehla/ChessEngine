function alphaBeta(position, depth, alpha, beta, maximizingPlayer) {
    if(depth == 0 || position.isGameOver()) {
        return position.evaluate();
    }

    let moves = position.getLegalMoves();

    if(maximizingPlayer) {
        let maxEval = -Infinity;
        for(let move of moves) {
            let eval = alphaBeta(newPosition, depth -1, alpha,beta,false);
            maxEval = Math.max(maxEval,eval);
            alpha = Math.max(alpha,eval);

            if(beta <= alpha)
                break;
        }

        return maxEval;
    } else {
        let minEval = Infinity;
        for(let move of moves)
        {
            let newPosition = position.makeMove(move);
            let eval = alphaBeta(newPosition, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            if (beta <= alpha) break;  // alpha cutoff
        }

        return minEval;
    }
}

module.exports = alphaBeta;