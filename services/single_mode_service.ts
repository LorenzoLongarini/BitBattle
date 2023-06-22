import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { updateUserTokensDb } from "../db/queries/admin_queries";
import { findGame, addMoveDb, gameOver } from "../db/queries/games_queries";
import { findUser } from "../db/queries/user_queries";
import { turn, findShip } from "../utils/game_utils";
import { decodeJwt } from "./jwt_service";

export async function doMoveService(req: Request, res: Response) {
    let targetMove = req.body.move;
    let jwtBearerToken = req.headers.authorization;
    let jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;
    let player;
    if (jwtDecode && jwtDecode.email) {
        player = jwtDecode.email;

    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
    }

    try {
        let searchGame = await findGame(req.body.name);
        let movesPossible = searchGame[0].dataValues.possible_moves;
        let movesExecute = searchGame[0].dataValues.moves;

        let lastPlayer = "";
        if (movesExecute != 0) lastPlayer = turn(movesExecute);

        let choose = true;
        let isAvailable = await findShip(movesPossible, targetMove, choose);
        let isExecute = await findShip(movesExecute, targetMove, choose);

        let hitShip = await findShip(movesPossible, targetMove, !choose);
        let currentPlayer = await findUser(player);
        let currentTokens = parseFloat(currentPlayer[0].dataValues.tokens)

        if (searchGame[0].dataValues.status !== "finished") {
            if (isAvailable && !isExecute && lastPlayer != player) {

                let reducedMovesPossible = searchGame[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3));

                let reducedMovesExecute;

                let newMove = {
                    move: targetMove,
                    hit: hitShip,
                    player: player
                };

                movesExecute.push(newMove);
                await addMoveDb(req.body.name, movesExecute);
                reducedMovesExecute = searchGame[0].dataValues.moves.filter((move: any) => move.hit);
                let updatedTokens = currentTokens - 0.015;
                await updateUserTokensDb(updatedTokens, player);

                if (reducedMovesPossible.length == reducedMovesExecute.length) {
                    try {
                        await gameOver(req.body.name);
                        res.json({ esito: "Game Over" });
                    } catch (err) {
                        res.json({ errore: err });
                    };

                }
                res.json({ mossa: "Mossa eseguita" });
            } else if (lastPlayer == player) {
                res.json({ mossa: "Non è il tuo turno" });
            } else if (isAvailable && isExecute) {
                res.json({ mossa: "Mossa già eseguita" });
            }
        } else {
            res.json({ esito: "Partita finita" });
        }
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "La partita non esiste" });
    }
}