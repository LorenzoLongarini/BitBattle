import { MessageFactory } from "../status/messages_factory";
import { Request, Response } from "express";
import { decodeJwt } from "./jwt_service";
import { CustomStatusCodes, Messages200, Messages400 } from "../status/status_codes";
import { addMoveDb, findGame, gameOver } from "../db/queries/games_queries";
import { findShip, findShipHittable } from "../utils/game_utils";
import { updateUserTokensDb } from "../db/queries/admin_queries";
import { findUser, updateUserPoints } from "../db/queries/user_queries";


export async function doMoveAIService(req: Request, res: Response) {
    let statusMessage: MessageFactory = new MessageFactory();
    let targetMove = req.body.move;
    let jwtBearerToken = req.headers.authorization;
    let jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;
    let player: any;
    if (jwtDecode && jwtDecode.email) {
        player = jwtDecode.email;

    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages400.UserNotFound);
    }
    try {
        let searchGame = await findGame(req.body.name);
        let movesPossible = searchGame[0].dataValues.possible_moves;
        let movesExecute = searchGame[0].dataValues.moves;

        let gridSizeCurr = searchGame[0].dataValues.grid_size;
        let xRand: number = Math.floor(Math.random() * gridSizeCurr + 1);
        let yRand: number = Math.floor(Math.random() * gridSizeCurr + 1);
        let targetRand = [xRand, yRand];

        let choose = true;
        let isAvailableUser = await findShip(movesPossible, targetMove, choose);
        let isExecuteUser = await findShip(movesExecute, targetMove, choose);
        let hitShipUser = await findShip(movesPossible, targetMove, !choose);
        let isHittableUser = await findShipHittable(movesPossible, targetMove, player)

        let isAvailableAi = await findShip(movesPossible, targetRand, choose);
        let isExecuteAi = await findShip(movesExecute, targetRand, choose);
        let hitShipAi = await findShip(movesPossible, targetRand, !choose);
        let isHittableAi = await findShipHittable(movesPossible, targetRand, "AI")

        let currentPlayer = await findUser(player);
        let currentTokens = parseFloat(currentPlayer[0].dataValues.tokens)
        let currentPoints = parseFloat(currentPlayer[0].dataValues.points)

        if (searchGame[0].dataValues.status !== "finished") {
            if (isAvailableUser && !isExecuteUser && isHittableUser) {

                let reducedMovesExecuteUser;
                let reducedMovesExecuteAi;

                let newMoveUser = {
                    move: targetMove,
                    hit: hitShipUser,
                    player: player
                };

                movesExecute.push(newMoveUser);
                await addMoveDb(req.body.name, movesExecute);

                currentTokens = parseFloat(currentPlayer[0].dataValues.tokens)

                let firstFee: number = currentTokens - 0.015;
                let secondFee: number = 0;
                let totalFee: number = Number(firstFee.toFixed(3));

                let reducedMovesPossibleUser = searchGame[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == "AI"));
                let reducedMovesPossibleAi = searchGame[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == player));

                movesPossible = searchGame[0].dataValues.possible_moves;
                movesExecute = searchGame[0].dataValues.moves;
                reducedMovesExecuteUser = searchGame[0].dataValues.moves.filter((move: any) => (move.hit && move.player == player));
                if (reducedMovesPossibleUser.length != reducedMovesExecuteUser.length) {
                    while (!isAvailableAi && isExecuteAi && !isHittableAi) {
                        xRand = Math.floor(Math.random() * gridSizeCurr + 1);
                        yRand = Math.floor(Math.random() * gridSizeCurr + 1);
                        targetRand = [xRand, yRand];
                        isAvailableAi = await findShip(movesPossible, targetRand, choose);
                        isExecuteAi = await findShip(movesExecute, targetRand, choose);
                    }

                    hitShipAi = await findShip(movesPossible, targetRand, !choose);

                    let newMoveAi = {
                        move: targetRand,
                        hit: hitShipAi,
                        player: 'AI'
                    };

                    movesExecute.push(newMoveAi);
                    await addMoveDb(req.body.name, movesExecute);
                    let secondFee = firstFee - 0.015;
                    totalFee = Number(secondFee.toFixed(3));

                }
                await updateUserTokensDb(totalFee, player);

                reducedMovesExecuteAi = searchGame[0].dataValues.moves.filter((move: any) => (move.hit && move.player == "AI"));

                if (reducedMovesPossibleUser.length == reducedMovesExecuteUser.length) {
                    try {
                        await gameOver(req.body.name);
                        let newPoints = currentPoints + 10;
                        await updateUserPoints(newPoints, player)
                        statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.UserWin);
                    } catch (error) {
                        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages400.GameNotFound);
                    };
                } else if (reducedMovesPossibleAi.length == reducedMovesExecuteAi.length) {
                    try {
                        await gameOver(req.body.name);
                        statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.AiWin);
                    } catch (err) {
                        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages400.GameNotFound);
                    };
                } else {
                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.MoveOk);
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
        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages400.GameNotFound);
    }
}