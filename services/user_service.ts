import { findUser, createUserDb, createGameDb } from '../db/queries/user_queries';
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { MessageFactory } from '../status/messages_factory'
import { CustomStatusCodes, Messages400 } from '../status/status_codes'
import { getAllMoves } from '../utils/game_utils';

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
    try {
        let possibleMoves = getAllMoves(req.body.grid_size);
        console.log(req.body.grid_size);
        console.log(JSON.stringify(possibleMoves));
        const newGame: any = await createGameDb(req, possibleMoves);
        res.json({ game: newGame });

    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
}