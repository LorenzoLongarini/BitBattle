import { Request, Response } from "express";
import { updateUserTokensDb } from "../db/queries/admin_queries";
import { findGame, addMoveDb, findGameById } from "../db/queries/games_queries";
import { findUser } from "../db/queries/user_queries";
import { findShip, findOwner, findShipHittable } from "../utils/game_utils";
import { isTurn, setGameOverStatus } from "./games_service";
import { getJwtEmail } from "./jwt_service";
import { MessageFactory } from "../status/messages_factory";
import { gameFinishedLabel } from "../model/constants/game_constants";
import { CustomStatusCodes, Messages200, Messages400, Messages500 } from "../status/status_codes";

var statusMessage: MessageFactory = new MessageFactory();

/**
 * Gestisce l'esecuzione di una mossa nel game multiplayer.
 * @param req La richiesta HTTP.
 * @param res La risposta HTTP.
 */
export async function doMoveMultiplayerService(req: Request, res: Response) {

    let targetMove = req.body.move;
    let jwtPlayerEmail = getJwtEmail(req);

    try {
        const searchGame: any = await findGameById(req.params.gameid);
        let nameGame = searchGame[0].dataValues.name;

        let movesPossible = searchGame[0].dataValues.possible_moves;
        let movesExecute = searchGame[0].dataValues.moves;

        let emailplayer0 = searchGame[0].dataValues.player0;
        let emailplayer1 = searchGame[0].dataValues.player1;
        let emailplayer2 = searchGame[0].dataValues.player2;

        let currentPlayer0 = await findUser(emailplayer0);
        let currentPlayer1 = await findUser(emailplayer1);
        let currentPlayer2 = await findUser(emailplayer2);

        let movesEmail = []
        if (movesExecute.length != 0) {

            for (let i in movesExecute) {

                movesEmail.push(searchGame[0].dataValues.moves[i].player);
            }
        }

        // Definisce la turnazione dei giocatori specificando il giocatore che esegue una mossa e il successivo
        const nextMove = [[emailplayer0, emailplayer2],
        [emailplayer2, emailplayer1],
        [emailplayer1, emailplayer2],
        [emailplayer2, emailplayer0],
        [emailplayer0, emailplayer1],
        [emailplayer1, emailplayer0]];

        let choose = true;
        // Verifica se la mossa target è disponibile, eseguita e colpibile
        let isAvailable = await findShip(movesPossible, targetMove, choose);
        let isExecute = await findShip(movesExecute, targetMove, choose);
        let hitShip = await findShip(movesPossible, targetMove, !choose);
        let isHittable = await findShipHittable(movesPossible, targetMove, jwtPlayerEmail);

        let owner = await findOwner(movesPossible, targetMove);

        // Filtra le mosse possibili del giocatore, limitandoli a quelle relative con ship compreso tra 1 e 3
        // e che appartengono al giocatore con l'email specificata
        let reducedMovesP0 = searchGame[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == emailplayer0));
        let reducedMovesP1 = searchGame[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == emailplayer1));
        let reducedMovesP2 = searchGame[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == emailplayer2));

        // Filtra le mosse eseguite dal giocatore, limitandoli a quelle che appartengono al giocatore con l'email specificata
        let reducedMoves0 = movesExecute.filter((move: any) => (move.owner == emailplayer0));
        let reducedMoves1 = movesExecute.filter((move: any) => (move.owner == emailplayer1));
        let reducedMoves2 = movesExecute.filter((move: any) => (move.owner == emailplayer2));

        // Determina lo stato di avanzamento dei giocatori in base alle navi rimanenti
        let pl0 = true;
        let pl1 = true;
        let pl2 = true;
        let firstLooser = "";

        // Verifica che il numero di mosse eseguite dal giocatore sia uguale al numero di mosse possibili
        // e se il primo perdente non sia ancora stato identificato
        if (reducedMovesP0.length == reducedMoves0.length && firstLooser === "") {

            // Lo stato di avanzamento del giocatore viene messo a false quando tutte le sue navi sono state colpite
            pl0 = false;
            // Assegna l'email del giocatore come primo perdente
            firstLooser = emailplayer0
        }
        if (reducedMovesP1.length == reducedMoves1.length && firstLooser === "") {

            pl1 = false;
            firstLooser = emailplayer1
        }
        if (reducedMovesP2.length == reducedMoves2.length && firstLooser === "") {

            pl2 = false;
            firstLooser = emailplayer2
        }

        let mod = pl0 && pl1 && pl2;

        // Determina il prossimo giocatore in base allo stato di gioco.
        let currentTurn = await isTurn(emailplayer0, emailplayer1, emailplayer2, movesEmail, mod, pl0, pl1, pl2, nextMove);
        let currentTokens = parseFloat(currentPlayer0[0].dataValues.tokens)

        if (searchGame[0].dataValues.status !== gameFinishedLabel) {

            if (isAvailable && !isExecute && currentTurn == jwtPlayerEmail && isHittable) {

                //Crea la nuova mossa da inserire nel database
                let newMove = {
                    move: targetMove,
                    hit: hitShip,
                    player: jwtPlayerEmail,
                    owner: owner
                };

                //Viene aggiunta la mossa nella lista delle mosse eseguite e viene aggiornato il database.
                movesExecute.push(newMove);
                await addMoveDb(nameGame, movesExecute);

                //Vengono scalati i tokens per effettuare la mossa e viene aggiornato il numero di tokens nel database
                let updatedTokens = currentTokens - 0.015;
                await updateUserTokensDb(updatedTokens, emailplayer0);

                reducedMoves0 = movesExecute.filter((move: any) => (move.owner == emailplayer0));
                reducedMoves1 = movesExecute.filter((move: any) => (move.owner == emailplayer1));
                reducedMoves2 = movesExecute.filter((move: any) => (move.owner == emailplayer2));

                
                if (reducedMovesP0.length == reducedMoves0.length && reducedMovesP1.length == reducedMoves1.length) {
                    // Se l'utente 0 e l'utente 2 hanno tutte le navi colpite
                    // Imposta lo stato di fine game e aggiorna i punteggi dei giocatori.
                    setGameOverStatus(req, currentPlayer2, emailplayer0, nameGame, emailplayer1, emailplayer2, firstLooser);
                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.Win);

                } else if (reducedMovesP1.length == reducedMoves1.length && reducedMovesP2.length == reducedMoves2.length) {
                    // Se l'utente 1 e l'utente 2 hanno tutte le navi colpite
                    // Imposta lo stato di fine game e aggiorna i punteggi dei giocatori.
                    setGameOverStatus(req, currentPlayer0, emailplayer0, nameGame, emailplayer1, emailplayer2, firstLooser);
                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.Win);

                } else if (reducedMovesP2.length == reducedMoves2.length && reducedMovesP0.length == reducedMoves0.length) {
                    // Se l'utente 2 e l'utente 0 hanno tutte le navi colpite
                    // Imposta lo stato di fine game e aggiorna i punteggi dei giocatori.
                    setGameOverStatus(req, currentPlayer1, emailplayer0, nameGame, emailplayer1, emailplayer2, firstLooser);
                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.Win);

                } else if (hitShip) {
                    // Se la mossa inserita contiene una nave, restituisce l'esito e il giocatore che è stato colpito
                    let message = JSON.parse(JSON.stringify({ esito: Messages200.Hit, hai_colpito: owner }));
                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, message);

                } else {
                    // Se la mossa inserita non contiene una nave, restituisce il valore "Acqua!"
                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.Flop);

                }
            } else if (currentTurn != jwtPlayerEmail) {

                statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.NotYourTurn);

            } else if (!isHittable) {

                statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.MoveUnauthorized);

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