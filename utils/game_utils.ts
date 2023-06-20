export function getAllMoves(gridSize: number): any {
    let possibleMoves: any = [];
    for (let i = 1; i <= gridSize; i++) {
        for (let j = 1; j <= gridSize; j++) {
            possibleMoves.push({ move: [i, j], ship: false });
        }
    }
    return possibleMoves;
}

export function setShips(gridSize: number): any {
    let x_start: number = Math.floor(Math.random() * gridSize);
    let y_start: number = Math.floor(Math.random() * gridSize);

}

export function moveIsPresent(move: any, move_now: any): any {
    let isMovePresent = false;
    let moves = [];
    for (let i = 0; i < move.length; i++) {
        moves.push(move[i].move);
    };
    for (let i = 0; i < moves.length; i++) {
        if (moves[i][0] === move_now[0] && moves[i][1] === move_now[1]) {
            isMovePresent = true;
            break;
        }
    };
    return isMovePresent;

}