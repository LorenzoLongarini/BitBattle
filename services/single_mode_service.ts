import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { updateUserTokensDb } from "../db/queries/admin_queries";
import { findGame, addMoveDb, gameOver } from "../db/queries/games_queries";
import { findUser, updateUserPoints } from "../db/queries/user_queries";
import { turn, findShip, findShipHittable, findOwner } from "../utils/game_utils";
import { decodeJwt } from "./jwt_service";
import { MessageFactory } from "../status/messages_factory";
import { CustomStatusCodes, Messages200, Messages400 } from "../status/status_codes";
import { setGameOverStatus } from "./games_service";

export async function doMoveService(req: Request, res: Response) {
    let statusMessage: MessageFactory = new MessageFactory();
    let targetMove = req.body.move;
    let jwtBearerToken = req.headers.authorization;
    let jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;
    let jwtPlayerEmail: any;
    if (jwtDecode && jwtDecode.email) {
        jwtPlayerEmail = jwtDecode.email;
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages400.UserNotFound);
    }
    try {
        let searchGame = await findGame(req.body.name);

        let player0 = searchGame[0].dataValues.player0;
        let player1 = searchGame[0].dataValues.player1;

        let movesPossible = searchGame[0].dataValues.possible_moves;
        let movesExecute = searchGame[0].dataValues.moves;

        let lastPlayer: any;
        if (movesExecute != 0) lastPlayer = turn(movesExecute);

        let choose = true;
        let isAvailable = await findShip(movesPossible, targetMove, choose);
        let isExecute = await findShip(movesExecute, targetMove, choose);
        let isHittable = await findShipHittable(movesPossible, targetMove, jwtPlayerEmail);
        let hitShip = await findShip(movesPossible, targetMove, !choose);

        let currentPlayer = await findUser(jwtPlayerEmail);
        let creatorPlayer = await findUser(player0);

        let currentTokens = parseFloat(creatorPlayer[0].dataValues.tokens)

        let canMove = (isAvailable && !isExecute && isHittable && lastPlayer != jwtPlayerEmail)

        let owner = await findOwner(movesPossible, targetMove);

        if (searchGame[0].dataValues.status !== "finished") {
            if (canMove) {

                let newMove = {
                    move: targetMove,
                    hit: hitShip,
                    player: jwtPlayerEmail,
                    owner: owner
                };

                movesExecute.push(newMove);
                await addMoveDb(req.body.name, movesExecute);

                let updatedTokens = currentTokens - 0.015;
                await updateUserTokensDb(updatedTokens, player0);

                let reducedMovesPossible = searchGame[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner != jwtPlayerEmail));
                let reducedMovesExecute = searchGame[0].dataValues.moves.filter((move: any) => move.hit && move.owner != jwtPlayerEmail);

                console.log(reducedMovesPossible.length, reducedMovesExecute.length)

                if (reducedMovesPossible.length == reducedMovesExecute.length) {
                    try {

                        setGameOverStatus(req, currentPlayer, player0, player1)

                        statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.Win);
                    } catch (err) {
                        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages400.GameNotFound);
                    };
                } else if (hitShip) {
                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.Hit);
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
        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages400.GameNotFound);
    }
}