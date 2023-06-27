import { Request } from "express";

export function getAllMoves(gridSize: number): any {
    let possibleMoves: any = [];
    for (let i = 1; i <= gridSize; i++) {
        for (let j = 1; j <= gridSize; j++) {
            possibleMoves.push({ move: [i, j], ship: 0, owner: "" });
        }
    }
    return possibleMoves;
}

export function setShips(gridSize: number, req: Request, player0: string): any {

    let grid = getAllMoves(gridSize);

    let player1 = req.body.player1;
    let player2 = req.body.player2;

    let allPlayers = [player0];

    if (player1 !== "" && player2 !== "") {
        allPlayers.push(player1, player2);
    } else if (player1 !== "" && player2 === "") {
        allPlayers.push(player1);
    } else if (player1 === "" && player2 !== "") {
        allPlayers.push(player2);
    } else {
        allPlayers.push("AI");
    }

    let size1Ships = req.body.ships[0].size1;
    let size2Ships = req.body.ships[1].size2;
    let size3Ships = req.body.ships[2].size3;

    for (let i in allPlayers) {
        grid = populateGrid(grid, size3Ships, gridSize, 3, allPlayers[i]);
        grid = populateGrid(grid, size2Ships, gridSize, 2, allPlayers[i]);
        grid = populateGrid(grid, size1Ships, gridSize, 1, allPlayers[i]);
    }
    return grid;
}


function populateGrid(grid: any, size: number, gridSize: number, shipType: number, owner: string) {
    let gridDimension = gridSize * gridSize;

    for (let i = 0; i < size; i++) {
        let startIndex: number = Math.floor(Math.random() * gridDimension + 1);

        let currentPosEmpty = grid[startIndex].ship == 0;

        let xPosEmptySucc1 = (startIndex + gridSize < gridDimension) ? grid[startIndex + gridSize].ship == 0 : 0;
        let xPosEmptySucc2 = (startIndex + gridSize + gridSize < gridDimension) ? grid[startIndex + gridSize + gridSize].ship == 0 : 0;

        let xPosEmptyPrev1 = (startIndex - gridSize >= 0) ? grid[startIndex - gridSize].ship == 0 : 0;
        let xPosEmptyPrev2 = (startIndex - gridSize - gridSize >= 0) ? grid[startIndex - gridSize - gridSize].ship == 0 : 0;

        let yPosEmptySucc1 = (startIndex + 1 < gridDimension) ? grid[startIndex + 1].ship == 0 : 0;
        let yPosEmptySucc2 = (startIndex + 2 < gridDimension) ? grid[startIndex + 2].ship == 0 : 0;

        let yPosEmptyPrev1 = (startIndex - 1 >= 0) ? grid[startIndex - 1].ship == 0 : 0;
        let yPosEmptyPrev2 = (startIndex - 2 >= 0) ? grid[startIndex - 2].ship == 0 : 0;

        while (!currentPosEmpty) {
            if (xPosEmptySucc1) {
                startIndex += gridSize;
            } else if (yPosEmptySucc1) {
                startIndex += 1;
            } else if (xPosEmptyPrev1) {
                startIndex -= gridSize;
            } else if (yPosEmptyPrev2) {
                startIndex -= 1;
            } else {
                break;
            }
            currentPosEmpty = !grid[startIndex].ship;
            xPosEmptySucc1 = (startIndex + gridSize < gridDimension) ? grid[startIndex + gridSize].ship == 0 : false;
            xPosEmptySucc2 = (startIndex + gridSize + gridSize < gridDimension) ? grid[startIndex + gridSize + gridSize].ship == 0 : false;
            xPosEmptyPrev1 = (startIndex - gridSize >= 0) ? grid[startIndex - gridSize].ship == 0 : false;
            xPosEmptyPrev2 = (startIndex - gridSize - gridSize >= 0) ? grid[startIndex - gridSize - gridSize].ship == 0 : false;
            yPosEmptySucc1 = (startIndex + 1 < gridDimension) ? grid[startIndex + 1].ship == 0 : false;
            yPosEmptySucc2 = (startIndex + 2 < gridDimension) ? grid[startIndex + 2].ship == 0 : false;
            yPosEmptyPrev1 = (startIndex - 1 >= 0) ? grid[startIndex - 1].ship == 0 : false;
            yPosEmptyPrev2 = (startIndex - 2 >= 0) ? grid[startIndex - 2].ship == 0 : false;
        }

        if (shipType == 1) {
            if (currentPosEmpty) {
                grid[startIndex].ship = 1;
                grid[startIndex].owner = owner;
            }
        }
        else if (shipType == 2) {
            if (currentPosEmpty && xPosEmptySucc1 && xPosEmptyPrev1 && xPosEmptySucc2) {
                grid[startIndex].ship = 2;
                grid[startIndex + gridSize].ship = 2;
                grid[startIndex].owner = owner;
                grid[startIndex + gridSize].owner = owner;
            } else if (currentPosEmpty && yPosEmptySucc1) {
                grid[startIndex].ship = 2;
                grid[startIndex + 1].ship = 2;
                grid[startIndex].owner = owner;
                grid[startIndex + 1].owner = owner;
            } else if (currentPosEmpty && xPosEmptyPrev1) {
                grid[startIndex].ship = 2;
                grid[startIndex - 1].ship = 2;
                grid[startIndex].owner = owner;
                grid[startIndex - 1].owner = owner;
            } else if (currentPosEmpty && yPosEmptyPrev1) {
                grid[startIndex].ship = 2;
                grid[startIndex - 1].ship = 2;
                grid[startIndex].owner = owner;
                grid[startIndex - 1].owner = owner;
            }

        } else {
            if (currentPosEmpty && xPosEmptySucc1 && xPosEmptyPrev1) {
                grid[startIndex].ship = 3;
                grid[startIndex + gridSize].ship = 3;
                grid[startIndex - gridSize].ship = 3;
                grid[startIndex].owner = owner;
                grid[startIndex + gridSize].owner = owner;
                grid[startIndex - gridSize].owner = owner;
            } else if (currentPosEmpty && yPosEmptySucc1 && yPosEmptyPrev1) {
                grid[startIndex].ship = 3;
                grid[startIndex + 1].ship = 3;
                grid[startIndex - 1].ship = 3;
                grid[startIndex].owner = owner;
                grid[startIndex + 1].owner = owner;
                grid[startIndex - 1].owner = owner;
            } else if (currentPosEmpty && xPosEmptySucc1 && xPosEmptySucc2) {
                grid[startIndex].ship = 3;
                grid[startIndex + 1].ship = 3;
                grid[startIndex + 2].ship = 3;
                grid[startIndex].owner = owner;
                grid[startIndex + 1].owner = owner;
                grid[startIndex + 2].owner = owner;
            } else if (currentPosEmpty && xPosEmptyPrev1 && xPosEmptyPrev2) {
                grid[startIndex].ship = 3;
                grid[startIndex - 1].ship = 3;
                grid[startIndex - 2].ship = 3;
                grid[startIndex].owner = owner;
                grid[startIndex - 1].owner = owner;
                grid[startIndex - 2].owner = owner;
            } else if (currentPosEmpty && yPosEmptySucc1 && yPosEmptySucc2) {
                grid[startIndex].ship = 3;
                grid[startIndex + 1].ship = 3;
                grid[startIndex + 2].ship = 3;
                grid[startIndex].owner = owner;
                grid[startIndex + 1].owner = owner;
                grid[startIndex + 2].owner = owner;
            } else if (currentPosEmpty && yPosEmptyPrev1 && yPosEmptyPrev2) {
                grid[startIndex].ship = 3;
                grid[startIndex - 1].ship = 3;
                grid[startIndex - 2].ship = 3;
                grid[startIndex].owner = owner;
                grid[startIndex - 1].owner = owner;
                grid[startIndex - 2].owner = owner;
            }
        }
    }
    return grid;
}


export function findShip(move: any, move_now: any, choose: any): any {
    let shipHit = false;
    let isMovePresent = false;
    for (let i = 0; i < move.length; i++) {
        if (move[i].move[0] === move_now[0] && move[i].move[1] == move_now[1]) {
            let shipValue = move[i].ship;
            if (Number.isInteger(shipValue) && shipValue >= 1 && shipValue <= 3) {
                shipHit = true;
            }
            isMovePresent = true;
            break;
        }
    }
    if (choose)
        return isMovePresent;
    else return shipHit;
}

export function findShipHittable(move: any, move_now: any, player: string): any {
    let isHittable = true;
    for (let i = 0; i < move.length; i++) {
        if (move[i].move[0] === move_now[0] && move[i].move[1] == move_now[1]) {
            let shipValue = move[i].ship;
            let ownerValue = move[i].owner;
            if (Number.isInteger(shipValue) && shipValue >= 1 && shipValue <= 3 && ownerValue == player) {
                isHittable = false;
            }
        }
    }
    return isHittable;
}

export function findOwner(move: any, move_now: any): any {
    let owner;
    for (let i = 0; i < move.length; i++) {
        if (move[i].move[0] === move_now[0] && move[i].move[1] == move_now[1]) {
            owner = move[i].owner;
        }
    }
    return owner;
}

export function turn(move: any): any {
    let last = move[move.length - 1].player;
    return last;
}