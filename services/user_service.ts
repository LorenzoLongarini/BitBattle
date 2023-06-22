import { findUser, createUserDb, createGameDb, } from '../db/queries/user_queries';
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { MessageFactory } from '../status/messages_factory'
import { CustomStatusCodes, Messages400, Messages500 } from '../status/status_codes'
import { setShips } from '../utils/game_utils';
import { piecesOneMin, piecesTwoMin, piecesThreeMin } from "../model/game_constants";
import { updateUserTokensDb } from '../db/queries/admin_queries';
import { findGame } from '../db/queries/games_queries';

export async function createUserService(req: Request, res: Response) {
    try {
        const user: any = await findUser(req.body.email);
        if (user.length == 0) {
            await createUserDb(req);
            res.status(StatusCodes.OK).send({ esito: "Utente aggiunto con successo" })

        }
        else {
            let badRequest: MessageFactory = new MessageFactory();
            badRequest.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.UnauthorizedUser);
        };

    } catch (e) {
        //TODO:gestire errore
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
}

export async function getTokensService(req: any, res: any) {
    try {
        const user: any = await findUser(req.body.email);


        if (user.length != 0) {
            const tokens = parseFloat(user[0].dataValues.tokens);

            res.status(StatusCodes.OK).json({ tokens: tokens });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "Impossibile visualizzare token, l\'utente non esiste" });
        }

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        throw error;
    }
}


export async function createGameService(req: Request, res: Response) {

    let gridSize = req.body.grid_size;
    let gridDimension = gridSize * gridSize;
    let size1ShipsReq = req.body.ships[0].size1;
    let size2ShipsReq = req.body.ships[1].size2
    let size3ShipsReq = req.body.ships[2].size3

    let maxShipPiecesOne: number = Math.floor(gridDimension / piecesOneMin);
    let maxShipPiecesTwo: number = gridDimension >= piecesTwoMin ? Math.floor(gridDimension / piecesTwoMin) : 0;
    let maxShipPiecesThree: number = gridDimension >= piecesThreeMin ? Math.floor(gridDimension / piecesThreeMin) : 0;

    let errorMessage: MessageFactory = new MessageFactory();
    // try {
    //     // let player
    // } catch (e) { }
    try {
        let game = await findGame(req.body.name);
        if (game.length !== 0) {
            errorMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.GameAlreadyExists);
        }
    } catch (err) { };

    try {
        let userCreator = await findUser(req.body.email);
        let currentTokens = parseFloat(userCreator[0].dataValues.tokens)

        if (req.body.grid_size < 3 || req.body.grid_size > 10) {
            errorMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.OutOfBoundGrid);
        } else if (size1ShipsReq > maxShipPiecesOne || size2ShipsReq > maxShipPiecesTwo || size3ShipsReq > maxShipPiecesThree) {
            errorMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.OutOfBoundShips);
        } else if (userCreator && currentTokens < 0.45) {
            errorMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.NoTokens);
        } else {
            let updatedTokens = currentTokens - 0.45;
            await updateUserTokensDb(updatedTokens, req.body.email);
            let possibleMoves = setShips(req.body.grid_size, req);

            let player1 = req.body.player1;
            let player2 = req.body.player2;

            let mod: string;

            if (player1 !== "" && player2 !== "") {
                mod = "1v2";
            } else if (player1 !== "" || player2 !== "") {
                mod = "1v1";
            } else {
                mod = "1vAI";
            }
            const newGame: any = await createGameDb(req, possibleMoves, mod);
            res.json({ game: newGame });
        }

    } catch (error) {
        errorMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.ImpossibileCreation);
    }
}