import { Request } from "express";
import { minGridSize, minGridDimension } from "../model/game_constants";

export function getAllMoves(gridSize: number): any {
    let possibleMoves: any = [];
    for (let i = 1; i <= gridSize; i++) {
        for (let j = 1; j <= gridSize; j++) {
            possibleMoves.push({ move: [i, j], ship: false });
        }
    }
    return possibleMoves;
}

export function setShips(gridSize: number, req: Request): any {

    const grid = getAllMoves(gridSize);
    let gridDimension = gridSize * gridSize;

    let size1ShipsReq = req.body.ships[0].size1;
    let size2ShipsReq = req.body.ships[1].size2
    let size3ShipsReq = req.body.ships[2].size3

    let maxShipPieces: number = Math.floor(gridDimension / minGridDimension);

    let size1Ships = size1ShipsReq < maxShipPieces ? size1ShipsReq : maxShipPieces;
    let size2Ships = size2ShipsReq < maxShipPieces ? size2ShipsReq : maxShipPieces;
    let size3Ships = size3ShipsReq < maxShipPieces ? size3ShipsReq : maxShipPieces;

    for (let i = 0; i < size3Ships; i++) {
        let xStart: number = Math.floor(Math.random() * gridSize + 1);
        let yStart: number = Math.floor(Math.random() * gridSize + 1);

        for (let j = 0; j < gridDimension; j++) {
            console.log(j - gridSize);
            let currentPosEmpty = grid[j].move[0] == xStart && grid[j].move[1] == yStart && !grid[j].ship;

            let xPosEmptySucc = (j + gridSize < gridDimension) ? grid[j + gridSize].move[0] == xStart + 1 && grid[j + gridSize].move[1] == yStart && !grid[j + gridSize].ship : false;
            let xPosEmptyPrev = (j - gridSize > 0) ? grid[j - gridSize].move[0] == xStart - 1 && grid[j - gridSize].move[1] == yStart && !grid[j - gridSize].ship : false;

            let yPosEmptySucc = (j + 1 < gridDimension) ? grid[j + 1].move[0] == xStart && grid[j + 1].move[1] == yStart + 1 && !grid[j + 1].ship : false;
            let yPosEmptyPrev = (j - 1 > 0) ? grid[j - 1].move[0] == xStart && grid[j - 1].move[1] == yStart - 1 && !grid[j - 1].ship : false;

            if (currentPosEmpty && xPosEmptySucc && xPosEmptyPrev) {
                grid[j].ship = true;
                grid[j + gridSize].ship = true;
                grid[j - gridSize].ship = true;
            } else if (currentPosEmpty && yPosEmptySucc && yPosEmptyPrev) {
                grid[j].ship = true;
                grid[j + 1].ship = true;
                grid[j - 1].ship = true;
            } else if (xPosEmptySucc) {
                xStart++;
            } else if (xPosEmptyPrev) {
                xStart--;
            } else if (yPosEmptySucc) {
                yStart++;
            } else if (yPosEmptyPrev) {
                yStart--;
            }

        }
        return grid;
    }
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