import { findAllGames, findGame, addMoveDb, gameOver } from '../db/queries/games_queries';
import { findShip, turn } from '../utils/game_utils';
import { Request, Response } from "express";
import { MessageFactory } from '../status/messages_factory'
import { CustomStatusCodes, Messages400 } from '../status/status_codes'

export async function getGamesService(req: Request, res: Response) {
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
        let isAvailable = await findShip(movesPossible, targetMove, choose);
        let isExecute = await findShip(movesExecute, targetMove, choose);
        let hitShip = await findShip(movesPossible, targetMove, !choose);
        if (isAvailable && !isExecute && lastPlayer != player) {
            let newMove = {
                move: targetMove,
                hit: hitShip,
                player: player
            };
            movesExecute.push(newMove);
            await addMoveDb(req.body.name, movesExecute);
            let reducedMovesPossible = searchGame[0].dataValues.possible_moves.filter((move: any) => move.ship);
            let reducedMovesExecute = searchGame[0].dataValues.moves.filter((move: any) => move.hit);
            console.log(JSON.stringify(reducedMovesPossible), JSON.stringify(reducedMovesExecute));
            console.log(reducedMovesPossible, reducedMovesExecute);
            if (reducedMovesPossible.length == reducedMovesExecute.length) {
                console.log(reducedMovesPossible, reducedMovesExecute);
                try {
                    await gameOver(req.body.name);
                    res.json({ esito: "Game Over" });
                } catch (err) { res.json({ errore: err }); };
            }
            res.json({ mossa: "Mossa eseguita" });
        } else if (isAvailable && isExecute) {
            res.json({ mossa: "Mossa già eseguita" });
        } else { res.json({ mossa: "Mossa non ammissibile" }); }


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
            errorMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.NotExistingGame);
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