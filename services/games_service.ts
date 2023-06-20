import { findAllGames, findGame, addMoveDb } from '../db/queries/games_queries';
import { moveIsPresent } from '../utils/game_utils';
import { Request, Response } from "express";

export async function getGamesService(req: any, res: any) {
    try {
        const game: any = await findAllGames();
        res.json({ game: game });

    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
}

export async function doMoveService(req: Request, res: Response) {
    try {
        let targetMove = req.body.move;
        let player = req.body.player;
        let searchGame = await findGame(req.body.name);
        let movesPossible = searchGame[0].dataValues.possible_moves;
        let movesExecute = searchGame[0].dataValues.moves;

        let isAvailable = await moveIsPresent(movesPossible, targetMove);
        let isExecute = await moveIsPresent(movesExecute, targetMove);
        if (isAvailable && !isExecute) {
            let newMove = {
                move: targetMove,
                hit: false,
                player: player
            };
            movesExecute.push(newMove);
            await addMoveDb(req.body.name, movesExecute);
            res.json({ mossa: "Mossa ammissibile" });
        } else if (isAvailable && isExecute) {
            res.json({ mossa: "Mossa già eseguita" });
        } else { res.json({ mossa: "Mossa non ammissibile" }); }

    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
}
