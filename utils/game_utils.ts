import { Request } from "express";

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

    let grid = getAllMoves(gridSize);

    let size1Ships = req.body.ships[0].size1;
    let size2Ships = req.body.ships[1].size2
    let size3Ships = req.body.ships[2].size3


    grid = populateGrid(grid, size1Ships, gridSize, 1);
    grid = populateGrid(grid, size2Ships, gridSize, 2);
    grid = populateGrid(grid, size3Ships, gridSize, 3);
    return grid;
}


function populateGrid(grid: any, size: number, gridSize: number, shipType: number) {
    let gridDimension = gridSize * gridSize;

    for (let i = 0; i < size; i++) {
        let startIndex: number = Math.floor(Math.random() * gridDimension);


        let currentPosEmpty = !grid[startIndex].ship;

        let xPosEmptySucc1 = (startIndex + gridSize < gridDimension) ? !grid[startIndex + gridSize].ship : false;
        let xPosEmptySucc2 = (startIndex + gridSize + gridSize < gridDimension) ? !grid[startIndex + gridSize + gridSize].ship : false;

        let xPosEmptyPrev1 = (startIndex - gridSize >= 0) ? !grid[startIndex - gridSize].ship : false;
        let xPosEmptyPrev2 = (startIndex - gridSize - gridSize >= 0) ? !grid[startIndex - gridSize - gridSize].ship : false;

        let yPosEmptySucc1 = (startIndex + 1 < gridDimension) ? !grid[startIndex + 1].ship : false;
        let yPosEmptySucc2 = (startIndex + 2 < gridDimension) ? !grid[startIndex + 2].ship : false;

        let yPosEmptyPrev1 = (startIndex - 1 >= 0) ? !grid[startIndex - 1].ship : false;
        let yPosEmptyPrev2 = (startIndex - 2 >= 0) ? !grid[startIndex - 2].ship : false;


        while (!currentPosEmpty) {
            if (xPosEmptySucc1) {
                startIndex += 1;
            } else if (xPosEmptyPrev1) {
                startIndex += 1;
            } else if (yPosEmptySucc1) {
                startIndex += 1;
            } else if (yPosEmptyPrev2) {
                startIndex -= 1;
            } else {
                break;
            }
            currentPosEmpty = !grid[startIndex].ship;
            xPosEmptySucc1 = (startIndex + gridSize < gridDimension) ? !grid[startIndex + gridSize].ship : false;
            xPosEmptySucc2 = (startIndex + gridSize + gridSize < gridDimension) ? !grid[startIndex + gridSize + gridSize].ship : false;
            xPosEmptyPrev1 = (startIndex - gridSize >= 0) ? !grid[startIndex - gridSize].ship : false;
            xPosEmptyPrev2 = (startIndex - gridSize - gridSize >= 0) ? !grid[startIndex - gridSize - gridSize].ship : false;
            yPosEmptySucc1 = (startIndex + 1 < gridDimension) ? !grid[startIndex + 1].ship : false;
            yPosEmptySucc2 = (startIndex + 2 < gridDimension) ? !grid[startIndex + 2].ship : false;
            yPosEmptyPrev1 = (startIndex - 1 >= 0) ? !grid[startIndex - 1].ship : false;
            yPosEmptyPrev2 = (startIndex - 2 >= 0) ? !grid[startIndex - 2].ship : false;

        }
        let shiptype2 = shipType == 2;
        if (!(shipType == 3)) {
            if (currentPosEmpty && xPosEmptySucc1) {
                grid[startIndex].ship = true;
                (shiptype2) ? grid[startIndex + gridSize].ship = true : null;
            } else if (currentPosEmpty && yPosEmptySucc1) {
                grid[startIndex].ship = true;
                (shiptype2) ? grid[startIndex + 1].ship = true : null;
            } else if (currentPosEmpty && xPosEmptyPrev1) {
                grid[startIndex].ship = true;
                (shiptype2) ? grid[startIndex - 1].ship = true : null;
            } else if (currentPosEmpty && yPosEmptyPrev1) {
                grid[startIndex].ship = true;
                (shiptype2) ? grid[startIndex - 1].ship = true : null;
            }

        } else {
            if (currentPosEmpty && xPosEmptySucc1 && xPosEmptyPrev1) {
                grid[startIndex].ship = true;
                grid[startIndex + gridSize].ship = true;
                grid[startIndex - gridSize].ship = true;
            } else if (currentPosEmpty && yPosEmptySucc1 && yPosEmptyPrev1) {
                grid[startIndex].ship = true;
                grid[startIndex + 1].ship = true;
                grid[startIndex - 1].ship = true;
            } else if (currentPosEmpty && xPosEmptySucc1 && xPosEmptySucc2) {
                grid[startIndex].ship = true;
                grid[startIndex + 1].ship = true;
                grid[startIndex + 2].ship = true;
            } else if (currentPosEmpty && xPosEmptyPrev1 && xPosEmptyPrev2) {
                grid[startIndex].ship = true;
                grid[startIndex - 1].ship = true;
                grid[startIndex - 2].ship = true;
            } else if (currentPosEmpty && yPosEmptySucc1 && yPosEmptySucc2) {
                grid[startIndex].ship = true;
                grid[startIndex + 1].ship = true;
                grid[startIndex + 2].ship = true;
            } else if (currentPosEmpty && yPosEmptyPrev1 && yPosEmptyPrev2) {
                grid[startIndex].ship = true;
                grid[startIndex - 1].ship = true;
                grid[startIndex - 2].ship = true;
            }
        }
    }
    return grid;
}



export function findShip(move: any, move_now: any, choose: any): any {
    let shipHit;
    let isMovePresent = false;
    for (let i = 0; i < move.length; i++) {
        if (move[i].move[0] === move_now[0] && move[i].move[1] == move_now[1]) {
            shipHit = move[i].ship;
            isMovePresent = true;
            break;
        }
    }
    if (choose)
        return isMovePresent;
    else return shipHit;
}

export function turn(move: any): any {
    let last = move[move.length - 1].player;
    return last;
}