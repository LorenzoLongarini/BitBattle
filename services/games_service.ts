import { findAllGames, findGame, addMoveDb, gameOver, updateWinner, findPlayer0, findPlayer1, findPlayer2 } from '../db/queries/games_queries';
import { findShip, turn, findShipHittable, findOwner } from '../utils/game_utils';
import { Request, Response } from "express";
import { findUser, setIsNotPlayingDb } from '../db/queries/user_queries';
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

export async function findUserCreatorService(player0: string, res: Response): Promise<boolean> {
    let statusMessage: MessageFactory = new MessageFactory();
    let exist = false;
    try {
        let creator = await findPlayer0(player0);
        if (creator.length != 0) return true;
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages500.InternalServerError);
    }
    return exist;
}

export async function findPlayer1Service(player1: string, res: Response): Promise<boolean> {
    let statusMessage: MessageFactory = new MessageFactory();
    let exist = false;
    try {
        let creator = await findPlayer1(player1);
        if (creator.length != 0) return true;
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages500.InternalServerError);
    }
    return exist;
}

export async function findPlayer2Service(player2: string, res: Response): Promise<boolean> {
    let statusMessage: MessageFactory = new MessageFactory();
    let exist = false;
    try {
        let creator = await findPlayer2(player2);
        if (creator.length != 0) return true;
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages500.InternalServerError);
    }
    return exist;
}


export async function doMoveMultiplayerService(req: Request, res: Response) {
    let targetMove = req.body.move;
    let jwtBearerToken = req.headers.authorization;
    let jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;
    let player: any;
    if (jwtDecode && jwtDecode.email) {
        player = jwtDecode.email;

    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
    }

    try {
        let searchGame = await findGame(req.body.name);
        let movesPossible = searchGame[0].dataValues.possible_moves;
        let movesExecute = searchGame[0].dataValues.moves;

        let emailplayer0 = searchGame[0].dataValues.player0;
        let emailplayer1 = searchGame[0].dataValues.player1;
        let emailplayer2 = searchGame[0].dataValues.player2;
        let currentPlayer0 = await findUser(emailplayer0);
        let currentPlayer1 = await findUser(emailplayer1);
        let currentPlayer2 = await findUser(emailplayer2);
        let isPlaying0 = currentPlayer0[0].dataValues.isplaying;
        let isPlaying1 = currentPlayer1[0].dataValues.isplaying;
        let isPlaying2 = currentPlayer2[0].dataValues.isplaying;


        let movesEmail = []
        if (movesExecute.length != 0)
            for (let i in movesExecute) {
                movesEmail.push(searchGame[0].dataValues.moves[i].player);
            }

        const turnOrder = ["loris@bitbattle.it", "prova@bitbattle.it",
            "lorenzo@bitbattle.it", "prova@bitbattle.it",
            "loris@bitbattle.it", "lorenzo@bitbattle.it"];
        const nextMove = [["loris@bitbattle.it", "prova@bitbattle.it"],
        ["prova@bitbattle.it", "lorenzo@bitbattle.it"],
        ["lorenzo@bitbattle.it", "prova@bitbattle.it"],
        ["prova@bitbattle.it", "loris@bitbattle.it"],
        ["loris@bitbattle.it", "lorenzo@bitbattle.it"],
        ["lorenzo@bitbattle.it", "loris@bitbattle.it"]];

        let choose = true;
        let isAvailable = await findShip(movesPossible, targetMove, choose);
        let isExecute = await findShip(movesExecute, targetMove, choose);

        let hitShip = await findShip(movesPossible, targetMove, !choose);
        let currentPlayer = await findUser(player);

        let owner = await findOwner(movesPossible, targetMove);

        let mod = (isPlaying0 && isPlaying1 && isPlaying2);


        let reducedMovesP1 = searchGame[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == emailplayer0));
        let reducedMovesP2 = searchGame[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == emailplayer1));
        let reducedMovesP3 = searchGame[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == emailplayer2));

        console.log(reducedMovesP1, reducedMovesP2, reducedMovesP3)


        let is = await findShipHittable(movesPossible, targetMove, player);

        let emailchigioca = await isTurn(emailplayer0, emailplayer1, emailplayer2, movesEmail, mod, isPlaying0, isPlaying1, isPlaying2, nextMove);

        let currentTokens = parseFloat(currentPlayer[0].dataValues.tokens)
        if (searchGame[0].dataValues.status !== "finished") {
            if (isAvailable && !isExecute && emailchigioca == player && is) {

                let newMove = {
                    move: targetMove,
                    hit: hitShip,
                    player: player,
                    owner: owner
                };

                movesExecute.push(newMove);
                await addMoveDb(req.body.name, movesExecute);
                let updatedTokens = currentTokens - 0.015;
                await updateUserTokensDb(updatedTokens, emailplayer0);

                let reducedMoves1 = movesExecute.filter((move: any) => (move.owner == emailplayer0));
                let reducedMoves2 = movesExecute.filter((move: any) => (move.owner == emailplayer1));
                let reducedMoves3 = movesExecute.filter((move: any) => (move.owner == emailplayer2));

                console.log(reducedMoves1, reducedMoves2, reducedMoves3)

                if (reducedMovesP1.length == reducedMoves1.length) {
                    await setIsNotPlayingDb(emailplayer0)

                }
                if (reducedMovesP2.length == reducedMoves2.length) {
                    await setIsNotPlayingDb(emailplayer1)

                }
                if (reducedMovesP3.length == reducedMoves3.length) {
                    await setIsNotPlayingDb(emailplayer2)

                }



                if (reducedMovesP1.length == reducedMoves1.length && reducedMovesP2.length == reducedMoves2.length) {
                    try {
                        await gameOver(req.body.name);
                        await updateWinner(req.body.name, emailplayer2);
                        res.json({ esito: "Game Over" });

                    } catch (err) { res.json({ errore: err }); };
                } else if (reducedMovesP2.length == reducedMoves2.length && reducedMovesP3.length == reducedMoves3.length) {
                    try {
                        await gameOver(req.body.name);
                        await updateWinner(req.body.name, emailplayer0);
                        res.json({ esito: "Game Over" });

                    } catch (err) { res.json({ errore: err }); };
                } else if (reducedMovesP3.length == reducedMoves3.length && reducedMovesP1.length == reducedMoves1.length) {
                    try {
                        await gameOver(req.body.name);
                        await updateWinner(req.body.name, emailplayer1);
                        res.json({ esito: "Game Over" });

                    } catch (err) { res.json({ errore: err }); };
                }
                res.json({ mossa: "Mossa eseguita" });
            } else if (emailchigioca != player) {
                res.json({ mossa: "Non è il tuo turno" });
            } else if (!is) {
                res.json({ mossa: "Non puoi attaccare la tua nave" });
            } else if (isAvailable && isExecute) {
                res.json({ mossa: "Mossa già eseguita" });
            }
        } else {
            res.json({ esito: "Partita finita" });
        }
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "La partita non esiste" });
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



export function isTurn(player1: any, player2: any, player3: any, move: any, mod: any,
    isplay1: any, isplay2: any, isplay3: any, nextMove: any) {
    if (move.length === 0 && mod) {
        //move.push("loris@bitbattle.it");
        return player1;
    }
    else if (move.length === 1 && mod) {
        //move.push("prova@bitbattle.it");
        return player3;
    } else if (mod) {
        let lastMoves = [move[move.length - 2], move[move.length - 1]]
        switch (true) {
            case (lastMoves.every((value, index) => value === nextMove[0][index])): return player2
            case (lastMoves.every((value, index) => value === nextMove[1][index])): return player3
            case (lastMoves.every((value, index) => value === nextMove[2][index])): return player1
            case (lastMoves.every((value, index) => value === nextMove[3][index])): return player2
            case (lastMoves.every((value, index) => value === nextMove[4][index])): return player1
            case (lastMoves.every((value, index) => value === nextMove[5][index])): return player3
            default:
                console.log('errore');
        }
    }
    else if (!mod) {
        let x1 = isplay1;
        let x2 = isplay2;
        let x3 = isplay3;
        let play1, play2;
        let lastMoves1 = move[move.length - 1]
        if (x1 && x2) {
            play1 = player1
            play2 = player2
        } else if (x2 && x3) {
            play1 = player2
            play2 = player3
        } else {
            play1 = player1
            play2 = player3
        }

        if (lastMoves1 == play1) {
            return play2;
        } else {
            return play1;
        }
    }
}