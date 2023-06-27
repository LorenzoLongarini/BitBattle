import { MessageFactory } from "../status/messages_factory";
import { Request, Response } from "express";
import { getJwtEmail } from "./jwt_service";
import { CustomStatusCodes, Messages200, Messages400, Messages500 } from "../status/status_codes";
import { addMoveDb, findGameById } from "../db/queries/games_queries";
import { findShip, findShipHittable } from "../utils/game_utils";
import { updateUserTokensDb } from "../db/queries/admin_queries";
import { findUser } from "../db/queries/user_queries";
import { setGameOverStatus } from "./games_service";
import { gameFinishedLabel } from "../model/constants/game_constants";
import { aiPlayer } from "../model/constants/user_constants";

var statusMessage: MessageFactory = new MessageFactory();

export async function doMoveAIService(req: Request, res: Response) {
    let targetMove = req.body.move;
    let jwtPlayerEmail = getJwtEmail(req)

    try {
        const searchGame: any = await findGameById(req.params.gameid);
        let nameGame = searchGame[0].dataValues.name;
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
        let isHittableUser = await findShipHittable(movesPossible, targetMove, jwtPlayerEmail)

        let isAvailableAi = await findShip(movesPossible, targetRand, choose);
        let isExecuteAi = await findShip(movesExecute, targetRand, choose);
        let hitShipAi = await findShip(movesPossible, targetRand, !choose);
        let isHittableAi = await findShipHittable(movesPossible, targetRand, aiPlayer)

        let currentPlayer = await findUser(jwtPlayerEmail);
        let currentTokens = parseFloat(currentPlayer[0].dataValues.tokens)

        if (searchGame[0].dataValues.status !== gameFinishedLabel) {
            if (isAvailableUser && !isExecuteUser && isHittableUser) {

                let reducedMovesExecuteUser;
                let reducedMovesExecuteAi;

                let newMoveUser = {
                    move: targetMove,
                    hit: hitShipUser,
                    player: jwtPlayerEmail
                };

                movesExecute.push(newMoveUser);
                await addMoveDb(nameGame, movesExecute);

                currentTokens = parseFloat(currentPlayer[0].dataValues.tokens)

                let firstFee: number = currentTokens - 0.015;
                let totalFee: number = Number(firstFee.toFixed(3));

                let reducedMovesPossibleUser = searchGame[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == aiPlayer));
                let reducedMovesPossibleAi = searchGame[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == jwtPlayerEmail));

                movesPossible = searchGame[0].dataValues.possible_moves;
                movesExecute = searchGame[0].dataValues.moves;
                reducedMovesExecuteUser = searchGame[0].dataValues.moves.filter((move: any) => (move.hit && move.player == jwtPlayerEmail));

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
                        player: aiPlayer
                    };

                    movesExecute.push(newMoveAi);
                    await addMoveDb(nameGame, movesExecute);
                    let secondFee: number = firstFee - 0.015;
                    totalFee = Number(secondFee.toFixed(3));

                }

                await updateUserTokensDb(totalFee, jwtPlayerEmail);

                reducedMovesExecuteAi = searchGame[0].dataValues.moves.filter((move: any) => (move.hit && move.player == aiPlayer));

                if (reducedMovesPossibleUser.length == reducedMovesExecuteUser.length) {

                    setGameOverStatus(req, currentPlayer, jwtPlayerEmail, nameGame)
                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.UserWin);

                } else if (reducedMovesPossibleAi.length == reducedMovesExecuteAi.length) {

                    setGameOverStatus(req, aiPlayer, jwtPlayerEmail, nameGame)
                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.AiWin);

                } else if (hitShipUser) {

                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.Hit);

                } else {

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

