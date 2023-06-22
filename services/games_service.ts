import { findAllGames, findGame, addMoveDb, gameOver, findPlayer1, findPlayer2 } from '../db/queries/games_queries';
import { findShip, findShipHittable, turn } from '../utils/game_utils';
import { Request, Response } from "express";
import { findUser, updateUserPoints, userIsNotPlayingDb } from '../db/queries/user_queries';
import { updateUserTokensDb } from '../db/queries/admin_queries';
import { MessageFactory } from '../status/messages_factory'
import { CustomStatusCodes, Messages200, Messages400, Messages500 } from '../status/status_codes'
import { decodeJwt } from './jwt_service';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';

export async function getGamesService(req: Request, res: Response) {
    try {
        const game: any = await findAllGames();
        res.json({ game: game });

    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
}






export async function statusService(req: Request, res: Response) {
    let errorMessage: MessageFactory = new MessageFactory();
    try {
        const game: any = await findGame(req.body.game_name);
        if (game.length === 0) {
            errorMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages400.GameNotFound);
        } else {
            if (game[0].dataValues.status == "finished")
                res.json({ statusGame: game[0].dataValues.status, winnerGame: game[0].dataValues.winner });
            else {
                res.json({ statusGame: game[0].dataValues.status });

            }
        }

    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
}