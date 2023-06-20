import { findAllGames, findGame, addMoveDb } from '../db/queries/games_queries';
import { findShip, turn } from '../utils/game_utils';
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

        let lastPlayer = "";
        if (movesExecute != 0) lastPlayer = turn(movesExecute);

        let choose = true;
        let isAvailable = await findShip(movesPossible, targetMove,choose);
        let isExecute = await findShip(movesExecute, targetMove,choose);
        let hitShip = await findShip(movesPossible, targetMove,!choose);
        if (isAvailable && !isExecute && lastPlayer != player) {
            let newMove = {
                move: targetMove,
                hit: hitShip,
                player: player
            };
            movesExecute.push(newMove);
            await addMoveDb(req.body.name, movesExecute);
            res.json({ mossa: "Mossa eseguita" });
        } else if (isAvailable && isExecute) {
            res.json({ mossa: "Mossa già eseguita" });
        } else { res.json({ mossa: "Mossa non ammissibile" }); }

    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
}
