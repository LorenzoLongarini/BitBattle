import { MessageFactory } from "../status/messages_factory";
import { Request, Response } from "express";
import { getJwtEmail } from "./jwt_service";
import { CustomStatusCodes, Messages200, Messages400, Messages500 } from "../status/status_codes";
import { addMoveDb, findGameById } from "../db/queries/games_queries";
import { findShip, findShipHittable } from "../utils/game_utils";
import { updateUserTokensDb } from "../db/queries/admin_queries";
import { findUser } from "../db/queries/user_queries";
import { setGameOverStatus } from "./games_service";
import { gameFinishedLabel } from "../constants/game_constants";
import { aiPlayer } from "../constants/user_constants";

var statusMessage: MessageFactory = new MessageFactory();

/**
 * Gestisce l'esecuzione di una mossa nel game 1vAI.
 * Viene effettuata una serie di controlli per verificare la validità della mossa.
 * 
 * @param req - L'oggetto di richiesta HTTP contenente i dati della mossa e il token JWT del giocatore.
 * @param res - L'oggetto di risposta HTTP utilizzato per inviare la risposta al client.
 */
export async function doMoveAIService(req: Request, res: Response) {
    let targetMove = req.body.move;
    let jwtPlayerEmail = getJwtEmail(req)

    try {
        const searchGame: any = await findGameById(req.params.gameid);
        let nameGame = searchGame[0].dataValues.name;
        let movesPossible = searchGame[0].dataValues.possible_moves;
        let movesExecute = searchGame[0].dataValues.moves;

        let gridSizeCurr = searchGame[0].dataValues.grid_size;

        // Viene generata casualmente una mossa per l'AI.

        let xRand: number = Math.floor(Math.random() * gridSizeCurr + 1);
        let yRand: number = Math.floor(Math.random() * gridSizeCurr + 1);
        let targetRand = [xRand, yRand];

        // Vengono effettuati controlli per verificare se la mossa del giocatore è disponibile,
        // se è già stata eseguita e se è stata colpita una nave avversaria.

        let choose = true;
        let isAvailableUser = await findShip(movesPossible, targetMove, choose);
        let isExecuteUser = await findShip(movesExecute, targetMove, choose);
        let hitShipUser = await findShip(movesPossible, targetMove, !choose);
        let isHittableUser = await findShipHittable(movesPossible, targetMove, jwtPlayerEmail)

        let currentPlayer = await findUser(jwtPlayerEmail);
        let currentTokens = parseFloat(currentPlayer[0].dataValues.tokens)

        if (searchGame[0].dataValues.status !== gameFinishedLabel) {
            if (isAvailableUser && !isExecuteUser && isHittableUser) {

                let reducedMovesExecuteUser;
                let reducedMovesExecuteAi;

                // Crea la nuova mossa dell'utente da inserire nel database

                let newMoveUser = {
                    move: targetMove,
                    hit: hitShipUser,
                    player: jwtPlayerEmail
                };

                // Viene aggiunta la mossa del giocatore nella lista delle mosse eseguite 
                // e viene aggiornato il database.

                movesExecute.push(newMoveUser);
                await addMoveDb(nameGame, movesExecute);

                currentTokens = parseFloat(currentPlayer[0].dataValues.tokens)

                // Vengono scalati i tokens per effettuare la mossa da parte dell'utente

                let firstFee: number = currentTokens - 0.015;
                let totalFee: number = Number(firstFee.toFixed(3));

                let reducedMovesPossibleUser = searchGame[0].dataValues.possible_moves.filter(
                    (move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == aiPlayer)
                );
                let reducedMovesPossibleAi = searchGame[0].dataValues.possible_moves.filter(
                    (move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == jwtPlayerEmail)
                );

                movesPossible = searchGame[0].dataValues.possible_moves;
                movesExecute = searchGame[0].dataValues.moves;
                reducedMovesExecuteUser = searchGame[0].dataValues.moves.filter(
                    (move: any) => (move.hit && move.player == jwtPlayerEmail)
                );

                // Viene verificato che l'utente non abbia tutte le sue navi colpite

                if (reducedMovesPossibleUser.length != reducedMovesExecuteUser.length) {


                    // Vengono effettuati controlli per verificare se la mossa del AI è disponibile,
                    // se è già stata eseguita e se è stata colpita una nave avversaria
                    movesPossible = searchGame[0].dataValues.possible_moves;
                    let isHittableAi = await findShipHittable(movesPossible, targetRand, aiPlayer)
                    let isAvailableAi = await findShip(movesPossible, targetRand, choose);
                    let isExecuteAi = await findShip(movesExecute, targetRand, choose);
                    let hitShipAi = await findShip(movesPossible, targetRand, !choose);

                    // Genera casualmente una nuova mossa finché non viene trovata una mossa valida per l'AI

                    while (!(isAvailableAi && !isExecuteAi && isHittableAi)) {
                        xRand = Math.floor(Math.random() * gridSizeCurr + 1);
                        yRand = Math.floor(Math.random() * gridSizeCurr + 1);
                        targetRand = [xRand, yRand];
                        isAvailableAi = await findShip(movesPossible, targetRand, choose);
                        movesPossible = searchGame[0].dataValues.possible_moves;
                        movesExecute = searchGame[0].dataValues.moves;
                        isExecuteAi = await findShip(movesExecute, targetRand, choose);
                        isHittableAi = await findShipHittable(movesPossible, targetRand, aiPlayer)
                    }

                    hitShipAi = await findShip(movesPossible, targetRand, !choose);

                    // Crea la nuova mossa dell'AI da inserire nel database

                    let newMoveAi = {
                        move: targetRand,
                        hit: hitShipAi,
                        player: aiPlayer
                    };

                    // Viene aggiunta la mossa nella lista delle mosse eseguite e viene aggiornato il database.

                    movesExecute.push(newMoveAi);
                    await addMoveDb(nameGame, movesExecute);

                    // Vengono scalati i tokens per effettuare la mossa da parte dell'AI

                    let secondFee: number = firstFee - 0.015;
                    totalFee = Number(secondFee.toFixed(3));

                }

                // Viene aggiornato il numero di tokens del giocatore.

                await updateUserTokensDb(totalFee, jwtPlayerEmail);

                reducedMovesExecuteAi = searchGame[0].dataValues.moves.filter(
                    (move: any) => (move.hit && move.player == aiPlayer)
                );

                if (reducedMovesPossibleUser.length == reducedMovesExecuteUser.length) {

                    // Se l'utente ha tutte le navi colpite
                    // Imposta lo stato di fine game e aggiorna i punteggi dei giocatori.

                    setGameOverStatus(req, currentPlayer, jwtPlayerEmail, nameGame)
                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.UserWin);

                } else if (reducedMovesPossibleAi.length == reducedMovesExecuteAi.length) {

                    // Se l'AI ha tutte le navi colpite
                    // Imposta lo stato di fine game e aggiorna i punteggi dei giocatori.

                    setGameOverStatus(req, aiPlayer, jwtPlayerEmail, nameGame)
                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.AiWin);

                } else if (hitShipUser) {

                    // Se la mossa inserita contiene una nave, restituisce l'esito e il giocatore che è stato colpito

                    let message = JSON.parse(JSON.stringify({ esito: Messages200.Hit, hai_colpito: aiPlayer }));
                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, message);

                } else {

                    // Se la mossa inserita non contiene una nave, restituisce il valore "Acqua!"

                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.Flop);

                }
            } else if (!isHittableUser) {

                statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.MoveUnauthorized);

            } else if (isAvailableUser && isExecuteUser) {

                statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.MoveAlreadyDone);

            }
        } else {

            statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.GameIsEnded);
        }

    } catch (error) {

        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);

    }
}

