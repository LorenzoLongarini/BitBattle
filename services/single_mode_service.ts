import { Request, Response } from "express";
import { updateUserTokensDb } from "../db/queries/admin_queries";
import { addMoveDb, findGameById } from "../db/queries/games_queries";
import { findUser } from "../db/queries/user_queries";
import { turn, findShip, findShipHittable, findOwner } from "../utils/game_utils";
import { getJwtEmail } from "./jwt_service";
import { MessageFactory } from "../status/messages_factory";
import { CustomStatusCodes, Messages200, Messages400, Messages500 } from "../status/status_codes";
import { setGameOverStatus } from "./games_service";
import { gameFinishedLabel } from "../constants/game_constants";

var statusMessage: MessageFactory = new MessageFactory();

/**
 * Gestisce l'esecuzione di una mossa nel game 1v1.
 * @param req La richiesta HTTP contenente i dati della mossa.
 * @param res La risposta HTTP da inviare.
 */
export async function doMoveSingleService(req: Request, res: Response) {

    let targetMove = req.body.move;
    let jwtPlayerEmail = getJwtEmail(req)

    try {
        const searchGame: any = await findGameById(req.params.gameid);
        let nameGame = searchGame[0].dataValues.name;

        let player0 = searchGame[0].dataValues.player0;
        let player1 = searchGame[0].dataValues.player1;

        let movesPossible = searchGame[0].dataValues.possible_moves;
        let movesExecute = searchGame[0].dataValues.moves;

        let lastPlayer: any;
        if (movesExecute != 0) { lastPlayer = turn(movesExecute); } else { lastPlayer = player1; }


        let choose = true;

        // Verifica se la mossa target è disponibile, eseguita, colpita e colpibile

        let isAvailable = await findShip(movesPossible, targetMove, choose);
        let isExecute = await findShip(movesExecute, targetMove, choose);
        let isHittable = await findShipHittable(movesPossible, targetMove, jwtPlayerEmail);
        let hitShip = await findShip(movesPossible, targetMove, !choose);

        let currentPlayer = await findUser(jwtPlayerEmail);
        let creatorPlayer = await findUser(player0);

        let currentTokens = parseFloat(creatorPlayer[0].dataValues.tokens)

        let canMove = (isAvailable && !isExecute && isHittable && lastPlayer != jwtPlayerEmail)

        let owner = await findOwner(movesPossible, targetMove);

        if (searchGame[0].dataValues.status !== gameFinishedLabel) {

            if (canMove) {

                // Crea la nuova mossa da inserire nel database

                let newMove = {
                    move: targetMove,
                    hit: hitShip,
                    player: jwtPlayerEmail,
                    owner: owner
                };

                //Viene aggiunta la mossa nella lista delle mosse eseguite e viene aggiornato il database.

                movesExecute.push(newMove);
                await addMoveDb(nameGame, movesExecute);

                //Vengono scalati i tokens per effettuare la mossa e viene aggiornato il numero di tokens nel databse

                let updatedTokens = currentTokens - 0.015;
                await updateUserTokensDb(updatedTokens, player0);

                let reducedMovesPossible = searchGame[0].dataValues.possible_moves.filter(
                    (move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner != jwtPlayerEmail)
                );
                let reducedMovesExecute = searchGame[0].dataValues.moves.filter(
                    (move: any) => (move.hit && move.owner != jwtPlayerEmail)
                );

                // Se l'utente ha tutte le navi colpite imposta lo stato di fine game e aggiorna i punteggi dei giocatori.

                if (reducedMovesPossible.length == reducedMovesExecute.length) {
                    try {
                        setGameOverStatus(req, currentPlayer, player0, nameGame, player1)
                        statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.Win);

                    } catch (err) {
                        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages400.GameNotFound);

                    };
                } else if (hitShip) {

                    // Se la mossa inserita contiene una nave, restituisce l'esito e il giocatore che è stato colpito

                    let message = JSON.parse(JSON.stringify({ esito: Messages200.Hit, hai_colpito: owner }));
                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, message);

                } else {

                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.Flop);

                }
            } else if (!isHittable) {

                statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.MoveUnauthorized);

            } else if (lastPlayer == jwtPlayerEmail) {

                statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.NotYourTurn);

            } else if (isAvailable && isExecute) {

                statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.MoveAlreadyDone);

            }
        } else {
            statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.GameIsEnded);

        }
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
}