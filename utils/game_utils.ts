import { Request } from "express";

/**
 * Ottiene tutte le mosse possibili sulla griglia a partire dalla sua dimensione.
 * @param gridSize - La dimensione della griglia.
 * @returns Un array contenente tutte le mosse possibili sulla griglia.
 */
export function getAllMoves(gridSize: number): any {
    let possibleMoves: any = [];
    for (let i = 1; i <= gridSize; i++) {
        for (let j = 1; j <= gridSize; j++) {
            possibleMoves.push({ move: [i, j], ship: 0, owner: "" });
        }
    }
    return possibleMoves;
}

/**
 * Imposta le navi sulla griglia per tutti i giocatori.
 * @param gridSize - La dimensione della griglia.
 * @param req - L'oggetto di richiesta HTTP contenente i dati dei giocatori e delle navi.
 * @param player0 - Il nome del giocatore che ha creato il game.
 * @returns La griglia con le navi impostate per tutti i giocatori.
 */
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

/**
 * Popola la griglia con le navi in base alle dimensioni delle navi e al giocatore.
 * @param grid - La griglia di gioco.
 * @param size - La dimensione della nave.
 * @param gridSize - La dimensione della griglia.
 * @param shipType - Il tipo di nave.
 * @param owner - Il proprietario della nave.
 * @returns La griglia di gioco con le navi posizionate.
 */
function populateGrid(grid: any, size: number, gridSize: number, shipType: number, owner: string) {
    let gridDimension = gridSize * gridSize;

    for (let i = 0; i < size; i++) {
        let startIndex: number = Math.floor(Math.random() * gridDimension + 1);

        // calcola la posizione iniziale

        let currentPosEmpty = grid[startIndex].ship == 0;

        // calcola le due posizioni successive e precedenti a quella iniziale lungo x e y

        let xPosEmptySucc1 = (startIndex + gridSize < gridDimension) ? grid[startIndex + gridSize].ship == 0 : false;
        let xPosEmptySucc2 = (startIndex + gridSize + gridSize < gridDimension) ? grid[startIndex + gridSize + gridSize].ship == 0 : false;

        let xPosEmptyPrev1 = (startIndex - gridSize >= 0) ? grid[startIndex - gridSize].ship == 0 : false;
        let xPosEmptyPrev2 = (startIndex - gridSize - gridSize >= 0) ? grid[startIndex - gridSize - gridSize].ship == 0 : false;

        let yPosEmptySucc1 = (startIndex + 1 < gridDimension) ? grid[startIndex + 1].ship == 0 : false;
        let yPosEmptySucc2 = (startIndex + 2 < gridDimension) ? grid[startIndex + 2].ship == 0 : false;

        let yPosEmptyPrev1 = (startIndex - 1 >= 0) ? grid[startIndex - 1].ship == 0 : false;
        let yPosEmptyPrev2 = (startIndex - 2 >= 0) ? grid[startIndex - 2].ship == 0 : false;


        // setta la nuova posizione corrente dove non ci sono navi
        while (!currentPosEmpty) {
            if (xPosEmptySucc1) {
                startIndex += gridSize;
            } else if (yPosEmptySucc1) {
                startIndex += 1;
            } else if (xPosEmptyPrev1) {
                startIndex -= gridSize;
            } else if (yPosEmptyPrev1) {
                startIndex -= 1;
            } else {
                break;
            }

            //aggiorna le posizioni 

            currentPosEmpty = grid[startIndex].ship == 0;
            xPosEmptySucc1 = (startIndex + gridSize < gridDimension) ? grid[startIndex + gridSize].ship == 0 : false;
            xPosEmptySucc2 = (startIndex + gridSize + gridSize < gridDimension) ? grid[startIndex + gridSize + gridSize].ship == 0 : false;
            xPosEmptyPrev1 = (startIndex - gridSize >= 0) ? grid[startIndex - gridSize].ship == 0 : false;
            xPosEmptyPrev2 = (startIndex - gridSize - gridSize >= 0) ? grid[startIndex - gridSize - gridSize].ship == 0 : false;
            yPosEmptySucc1 = (startIndex + 1 < gridDimension) ? grid[startIndex + 1].ship == 0 : false;
            yPosEmptySucc2 = (startIndex + 2 < gridDimension) ? grid[startIndex + 2].ship == 0 : false;
            yPosEmptyPrev1 = (startIndex - 1 >= 0) ? grid[startIndex - 1].ship == 0 : false;
            yPosEmptyPrev2 = (startIndex - 2 >= 0) ? grid[startIndex - 2].ship == 0 : false;
        }
        // settiamo le navi in base al tipo
        if (shipType == 1) {
            if (currentPosEmpty) {
                grid[startIndex].ship = 1;
                grid[startIndex].owner = owner;
            }
        }
        else if (shipType == 2) {
            if (currentPosEmpty && xPosEmptySucc1) {
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
                grid[startIndex - gridSize].ship = 2;
                grid[startIndex].owner = owner;
                grid[startIndex - gridSize].owner = owner;
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
                grid[startIndex + gridSize].ship = 3;
                grid[startIndex + gridSize + gridSize].ship = 3;
                grid[startIndex].owner = owner;
                grid[startIndex + gridSize].owner = owner;
                grid[startIndex + gridSize + gridSize].owner = owner;
            } else if (currentPosEmpty && xPosEmptyPrev1 && xPosEmptyPrev2) {
                grid[startIndex].ship = 3;
                grid[startIndex - gridSize].ship = 3;
                grid[startIndex - gridSize - gridSize].ship = 3;
                grid[startIndex].owner = owner;
                grid[startIndex - gridSize].owner = owner;
                grid[startIndex - gridSize - gridSize].owner = owner;
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

/**
 * Trova una nave nella lista di mosse in base alla mossa effettuata e verifica se è stata colpita.
 * @param move - La lista di mosse.
 * @param move_now - La mossa effettuata.
 * @param choose - Indica se è necessario ritornare isMovePresent o shipHit
 * @returns Ritorna se la mossa è presente o meno, oppure se nella mossa è presente una nave.
 */
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

/**
 * Verifica se una nave può essere colpita nella lista di mosse in base alla mossa effettuata e al giocatore che la effettua.
 * @param move - La lista di mosse.
 * @param move_now - La mossa effettuata.
 * @param player - Il giocatore che sta effettuando la mossa.
 * @returns Ritorna se la mossa è effettuabile, colui che fa la mossa non può attaccare una propria nave.
 */
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

/**
 * Trova il proprietario di una mossa nella lista di mosse in base alla mossa effettuata.
 * @param move - La lista di mosse.
 * @param move_now - La mossa effettuata.
 * @returns Il proprietario della mossa.
 */
export function findOwner(move: any, move_now: any): any {
    let owner;
    for (let i = 0; i < move.length; i++) {
        if (move[i].move[0] === move_now[0] && move[i].move[1] == move_now[1]) {
            owner = move[i].owner;
        }
    }
    return owner;
}

/**
 * Restituisce il giocatore corrente che ha effettuato l'ultima mossa.
 * @param move - La lista di mosse.
 * @returns Il giocatore corrente.
 */
export function turn(move: any): any {
    let last = move[move.length - 1].player;
    return last;
}