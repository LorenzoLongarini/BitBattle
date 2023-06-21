import { findAllGames, findGame, addMoveDb, gameOver, findPlayer } from '../db/queries/games_queries';
import { findShip, turn } from '../utils/game_utils';
import { Request, Response } from "express";
import { findUser, userIsNotPlayingDb } from '../db/queries/user_queries';
import { updateUserTokensDb } from '../db/queries/admin_queries';

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
    let targetMove = req.body.move;
    let player = req.body.player;

    try {
        let searchGame = await findGame(req.body.name);
        let movesPossible = searchGame[0].dataValues.possible_moves;
        let movesExecute = searchGame[0].dataValues.moves;

        let lastPlayer = "";
        if (movesExecute != 0) lastPlayer = turn(movesExecute);

        let choose = true;
        let isAvailable = await findShip(movesPossible, targetMove, choose);
        let isExecute = await findShip(movesExecute, targetMove, choose);
        let hitShip = await findShip(movesPossible, targetMove, !choose);
        let currentPlayer = await findUser(req.body.player);
        let currentTokens = parseFloat(currentPlayer[0].dataValues.tokens)

        if (isAvailable && !isExecute && lastPlayer != player) {

            let reducedMovesPossible = searchGame[0].dataValues.possible_moves.filter((move: any) => move.ship);
            let reducedMovesExecute = searchGame[0].dataValues.moves.filter((move: any) => move.hit);

            let newMove = {
                move: targetMove,
                hit: hitShip,
                player: player
            };
            if (searchGame[0].dataValues.status !== "finished") {
                movesExecute.push(newMove);
                await addMoveDb(req.body.name, movesExecute);

                let updatedTokens = currentTokens - 0.015;
                await updateUserTokensDb(updatedTokens, req.body.player);

            }
            if (reducedMovesPossible.length == reducedMovesExecute.length) {

                try {
                    await gameOver(req.body.name);
                    // let allPlayers =
                    //     await findPlayer(req.body.players)
                    // await userIsNotPlayingDb()
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
