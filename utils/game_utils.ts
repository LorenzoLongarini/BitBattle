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