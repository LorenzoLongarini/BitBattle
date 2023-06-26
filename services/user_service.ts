import { findUser, createUserDb, createGameDb, setIsPlayingDb, findAllUsers } from '../db/queries/user_queries';
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { MessageFactory } from '../status/messages_factory'
import { CustomStatusCodes, Messages200, Messages400, Messages500 } from '../status/status_codes'
import { setShips } from '../utils/game_utils';
import { piecesOneMin, piecesTwoMin, piecesThreeMin, GameMode } from "../model/constants/game_constants";
import { updateUserTokensDb } from '../db/queries/admin_queries';
import { findGame } from '../db/queries/games_queries';
import { decodeJwt } from './jwt_service';
import { verifyIsUser, verifyDifferentUser, verifyIsPlaying } from '../utils/user_utils';

let statusMessage: MessageFactory = new MessageFactory();

export async function getAllUsersService(res: Response) {
    try {
        const users: any = await findAllUsers();
        let message = JSON.parse(JSON.stringify({ users: users }));
        statusMessage.getStatusMessage(CustomStatusCodes.OK, res, message);

    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
}


export async function createUserService(req: Request, res: Response) {
    try {
        const user: any = await findUser(req.body.email);
        if (user.length == 0) {
            await createUserDb(req);
            statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.UserCreateSuccess);
        }
        else {
            statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.UnauthorizedUser);
        };
    } catch (e) {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
}

export async function getTokensService(req: any, res: any) {
    try {
        const user: any = await findUser(req.body.email);
        if (user.length != 0) {
            const tokens = parseFloat(user[0].dataValues.tokens);
            res.status(StatusCodes.OK).json({ tokens: tokens });
        } else {
            statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.UserNotFound);
        }
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
}


export async function createGameService(req: Request, res: Response) {

    let player;
    let jwtBearerToken = req.headers.authorization;
    let jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;
    if (jwtDecode && jwtDecode.email) {
        player = jwtDecode.email;

        let gridSize = req.body.grid_size;
        let gridDimension = gridSize * gridSize;
        let size1ShipsReq = req.body.ships[0].size1;
        let size2ShipsReq = req.body.ships[1].size2
        let size3ShipsReq = req.body.ships[2].size3

        let maxShipPiecesOne: number = Math.floor(gridDimension / piecesOneMin);
        let maxShipPiecesTwo: number = gridDimension >= piecesTwoMin ? Math.floor(gridDimension / piecesTwoMin) : 0;
        let maxShipPiecesThree: number = gridDimension >= piecesThreeMin ? Math.floor(gridDimension / piecesThreeMin) : 0;


        try {
            let game = await findGame(req.body.name);
            if (game.length !== 0) {
                statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.GameAlreadyExists);
            } else {
                let userCreator = await findUser(player);

                let currentTokens = parseFloat(userCreator[0].dataValues.tokens)

                if (req.body.grid_size < 3 || req.body.grid_size > 10) {
                    statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.OutOfBoundGrid);
                } else if (size1ShipsReq > maxShipPiecesOne || size2ShipsReq > maxShipPiecesTwo || size3ShipsReq > maxShipPiecesThree) {
                    statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.OutOfBoundShips);
                } else if (userCreator && currentTokens < 0.45) {
                    statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.NoTokens);
                } else {
                    let possibleMoves = setShips(req.body.grid_size, req, player);
                    let player1 = req.body.player1;
                    let player2 = req.body.player2;
                    let mod: string;
                    let event: number;
                    let isPresent: Boolean = true;
                    let isDifferent: Boolean = true;
                    let isCreator: Boolean = true;
                    let arePlaying: Boolean = false;
                    let isPlayingCreator = await verifyIsPlaying(player, res, isCreator)

                    if (!isPlayingCreator) {
                        if (player1 !== "" && player2 !== "") {
                            isDifferent = await verifyDifferentUser(player, player1, res, isDifferent) && await verifyDifferentUser(player, player2, res, isDifferent)
                                && await verifyDifferentUser(player1, player2, res, isDifferent);
                            isPresent = await verifyIsUser(player1, res, isPresent) && await verifyIsUser(player2, res, isPresent);
                            arePlaying = await verifyIsPlaying(player1, res, !isCreator) && await verifyIsPlaying(player2, res, !isCreator);
                            mod = GameMode.mode3;
                            event = 1;
                        } else if (player1 !== "" && player2 == "") {
                            isDifferent = await verifyDifferentUser(player, player1, res, isDifferent);
                            isPresent = await verifyIsUser(player1, res, isPresent);
                            arePlaying = await verifyIsPlaying(player1, res, !isCreator);
                            mod = GameMode.mode2;
                            event = 2;
                        } else if (player1 == "" && player2 !== "") {
                            isDifferent = await verifyDifferentUser(player, player2, res, isDifferent);
                            isPresent = await verifyIsUser(player2, res, isPresent);
                            arePlaying = await verifyIsPlaying(player2, res, !isCreator);
                            mod = GameMode.mode2;
                            event = 3;
                        } else {
                            mod = GameMode.mode1;
                            event = 4;
                        }

                        if (isPresent && isDifferent && !arePlaying) {

                            let updatedTokens = currentTokens - 0.45;
                            await updateUserTokensDb(updatedTokens, player);

                            await setIsPlayingDb(player);
                            if (event === 1) {
                                await setIsPlayingDb(player1);
                                await setIsPlayingDb(player2);
                            } else if (event === 2) {
                                await setIsPlayingDb(player1);
                            } else if (event === 3) {
                                await setIsPlayingDb(player2);
                            }

                            if (player1 == "" && player2 != "") {
                                player1 = player2;
                                player2 = "";
                            }
                            const newGame: any = await createGameDb(req, possibleMoves, mod, player, player1, player2);
                            let message = JSON.parse(JSON.stringify({ game: newGame }));
                            statusMessage.getStatusMessage(CustomStatusCodes.OK, res, message);
                        }
                    }
                    else {
                        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.CreatorNotAvailable)
                    }
                }
            }
        } catch (error) {
            statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.ImpossibileCreation);
        }
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
}