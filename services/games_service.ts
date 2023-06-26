import { findAllGames, findGame, addMoveDb, gameOver, updateWinner, findPlayer0, findPlayer1, findPlayer2, updateScore } from '../db/queries/games_queries';
import { findShip, turn, findShipHittable, findOwner } from '../utils/game_utils';
import { Request, Response } from "express";
import { findUser, setIsNotPlayingDb, updateUserPoints, updateUserStatus } from '../db/queries/user_queries';
import { updateUserTokensDb } from '../db/queries/admin_queries';
import { MessageFactory } from '../status/messages_factory'
import { CustomStatusCodes, Messages200, Messages400, Messages500 } from '../status/status_codes'
import { decodeJwt } from './jwt_service';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';

var statusMessage: MessageFactory = new MessageFactory();

export async function getGamesService(req: Request, res: Response) {
    try {
        const game: any = await findAllGames();
        res.json({ game: game });

    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
}

export async function findUserCreatorService(player0: string, res: Response, req: Request): Promise<boolean> {
    let exist = false;
    try {
        let creator = await findPlayer0(req.body.name, player0);
        if (creator.length != 0) return true;
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages500.InternalServerError);
    }
    return exist;
}

export async function findPlayer1Service(player1: string, res: Response, req: Request): Promise<boolean> {
    let exist = false;
    try {
        let creator = await findPlayer1(req.body.name, player1);
        if (creator.length != 0) return true;
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages500.InternalServerError);
    }
    return exist;
}

export async function findPlayer2Service(player2: string, res: Response, req: Request): Promise<boolean> {

    let exist = false;
    try {
        let creator = await findPlayer2(req.body.name, player2);
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
    let jwtPlayer: any;
    if (jwtDecode && jwtDecode.email) {
        jwtPlayer = jwtDecode.email;

        try {
            let searchGame = await findGame(req.body.name);
            let movesPossible = searchGame[0].dataValues.possible_moves;
            let movesExecute = searchGame[0].dataValues.moves;

            let emailplayer0 = searchGame[0].dataValues.player0;
            let emailplayer1 = searchGame[0].dataValues.player1;
            let emailplayer2 = searchGame[0].dataValues.player2;
            let currentPlayer0 = await findUser(emailplayer0);

            //TODO gestione nel caso in cui una partita singola viene fatta iniziare dalla rotta multiplayer
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

            const nextMove = [[emailplayer0, emailplayer2],
            [emailplayer2, emailplayer1],
            [emailplayer1, emailplayer2],
            [emailplayer2, emailplayer0],
            [emailplayer0, emailplayer1],
            [emailplayer1, emailplayer0]];

            let choose = true;
            let isAvailable = await findShip(movesPossible, targetMove, choose);
            let isExecute = await findShip(movesExecute, targetMove, choose);

            let hitShip = await findShip(movesPossible, targetMove, !choose);

            let owner = await findOwner(movesPossible, targetMove);


            let reducedMovesP0 = searchGame[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == emailplayer0));
            let reducedMovesP1 = searchGame[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == emailplayer1));
            let reducedMovesP2 = searchGame[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == emailplayer2));

            let isHittable = await findShipHittable(movesPossible, targetMove, jwtPlayer);


            let reducedMoves0 = movesExecute.filter((move: any) => (move.owner == emailplayer0));
            let reducedMoves1 = movesExecute.filter((move: any) => (move.owner == emailplayer1));
            let reducedMoves2 = movesExecute.filter((move: any) => (move.owner == emailplayer2));

            let pl0 = true;
            let pl1 = true;
            let pl2 = true;
            let firstLooser = "";


            if (reducedMovesP0.length == reducedMoves0.length && firstLooser === "") {
                pl0 = false;
                firstLooser = emailplayer0
            }
            if (reducedMovesP1.length == reducedMoves1.length && firstLooser === "") {
                pl1 = false;
                firstLooser = emailplayer1
            }
            if (reducedMovesP2.length == reducedMoves2.length && firstLooser === "") {
                pl2 = false;
                firstLooser = emailplayer2
            }

            console.log(firstLooser)

            let mod = pl0 && pl1 && pl2;

            let currentTurn = await isTurn(emailplayer0, emailplayer1, emailplayer2, movesEmail, mod, pl0, pl1, pl2, nextMove);

            let currentTokens = parseFloat(currentPlayer0[0].dataValues.tokens)
            if (searchGame[0].dataValues.status !== "finished") {
                if (isAvailable && !isExecute && currentTurn == jwtPlayer && isHittable) {

                    let newMove = {
                        move: targetMove,
                        hit: hitShip,
                        player: jwtPlayer,
                        owner: owner
                    };

                    movesExecute.push(newMove);
                    await addMoveDb(req.body.name, movesExecute);
                    let updatedTokens = currentTokens - 0.015;
                    await updateUserTokensDb(updatedTokens, emailplayer0);

                    reducedMoves0 = movesExecute.filter((move: any) => (move.owner == emailplayer0));
                    reducedMoves1 = movesExecute.filter((move: any) => (move.owner == emailplayer1));
                    reducedMoves2 = movesExecute.filter((move: any) => (move.owner == emailplayer2));

                    if (reducedMovesP0.length == reducedMoves0.length && reducedMovesP1.length == reducedMoves1.length) {
                        try {
                            setGameOverStatus(req, currentPlayer2, emailplayer0, emailplayer1, emailplayer2, firstLooser);
                            res.json({ esito: "Game Over" });

                        } catch (err) { res.json({ errore: err }); };
                    } else if (reducedMovesP1.length == reducedMoves1.length && reducedMovesP2.length == reducedMoves2.length) {
                        try {
                            setGameOverStatus(req, currentPlayer0, emailplayer0, emailplayer1, emailplayer2, firstLooser);
                            res.json({ esito: "Game Over" });

                        } catch (err) { res.json({ errore: err }); };
                    } else if (reducedMovesP2.length == reducedMoves2.length && reducedMovesP0.length == reducedMoves0.length) {
                        try {
                            setGameOverStatus(req, currentPlayer1, emailplayer0, emailplayer1, emailplayer2, firstLooser);
                            res.json({ esito: "Game Over" });

                        } catch (err) { res.json({ errore: err }); };
                    } else { res.json({ mossa: "Mossa eseguita" }); }

                } else if (currentTurn != jwtPlayer) {
                    res.json({ mossa: "Non è il tuo turno" });
                } else if (!isHittable) {
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
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
    }
}

//TODO accorpare la funzione con quella presente in AI e 1v1
export async function setGameOverStatus(req: Request, winner: any, emailplayer0: string, emailplayer1?: string, emailplayer2?: string, firstLooser?: string) {

    await gameOver(req.body.name);
    let searchGame = await findGame(req.body.name);
    let scores = searchGame[0].dataValues.score;
    let winnerEmail;
    let scoreWinner;

    if (winner != "AI") {
        winnerEmail = winner[0].dataValues.email;
        scoreWinner = {
            player: winnerEmail,
            score: 10,
        };
        await updateUserStatus(false, winnerEmail)

        let currentPoints = parseFloat(winner[0].dataValues.points)
        let winnerPoints = currentPoints + 10;
        await updateUserPoints(winnerPoints, winnerEmail);

        scores.push(scoreWinner);
    } else {
        winnerEmail = winner;
        scoreWinner = {
            player: emailplayer0,
            score: 0,
        };
        scores.push(scoreWinner);
        await updateUserStatus(false, emailplayer0)
    }

    await updateWinner(req.body.name, winnerEmail);

    let score0 = 0;
    let score1 = 0;
    let score2 = 0;

    switch (true) {
        case (firstLooser === emailplayer0 && emailplayer1 === winnerEmail): { score0 = 0; score1 = 10; score2 = 4; break; }
        case (firstLooser === emailplayer0 && emailplayer2 === winnerEmail): { score0 = 0; score1 = 4; score2 = 10; break; }
        case (firstLooser === emailplayer1 && emailplayer0 === winnerEmail): { score0 = 10; score1 = 0; score2 = 4; break; }
        case (firstLooser === emailplayer1 && emailplayer2 === winnerEmail): { score0 = 4; score1 = 0; score2 = 10; break; }
        case (firstLooser === emailplayer2 && emailplayer0 === winnerEmail): { score0 = 10; score1 = 4; score2 = 0; break; }
        case (firstLooser === emailplayer2 && emailplayer1 === winnerEmail): { score0 = 4; score1 = 10; score2 = 0; break; }
        default:
            console.log('errore');
    }

    await setIsNotPlayingDb(emailplayer0);
    if (emailplayer0 != winnerEmail) {
        await updateUserStatus(false, emailplayer0);
        let scorePlayer0 = {
            player: emailplayer0,
            score: score0,
        };

        let user0 = await findUser(emailplayer0)
        let currentPoints = parseFloat(user0[0].dataValues.points)
        let winnerPoints = currentPoints + score0;
        await updateUserPoints(winnerPoints, emailplayer0);
        scores.push(scorePlayer0);
    }
    if (emailplayer1 != null && emailplayer1 != winnerEmail) {
        await updateUserStatus(false, emailplayer1);
        let scorePlayer1 = {
            player: emailplayer1,
            score: score1,
        };

        let user1 = await findUser(emailplayer1)
        let currentPoints = parseFloat(user1[0].dataValues.points)
        let winnerPoints = currentPoints + score1;
        await updateUserPoints(winnerPoints, emailplayer1);
        scores.push(scorePlayer1);
    }
    if (emailplayer2 != null && emailplayer2 != winnerEmail) {
        await updateUserStatus(false, emailplayer2);
        let scorePlayer2 = {
            player: emailplayer2,
            score: score2,
        };

        let user2 = await findUser(emailplayer2)
        let currentPoints = parseFloat(user2[0].dataValues.points)
        let winnerPoints = currentPoints + score2;
        await updateUserPoints(winnerPoints, emailplayer2);
        scores.push(scorePlayer2);
    }
    await updateScore(req.body.name, scores)
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


//TODO verificare se possibile ridurre numero di parametri
export function isTurn(player1: any, player2: any, player3: any, move: any, mod: any,
    isplay1: any, isplay2: any, isplay3: any, nextMove: any) {
    if (move.length === 0 && mod) {
        return player1;
    }
    else if (move.length === 1 && mod) {
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


export async function turnService(req: Request, res: Response) {
    let errorMessage: MessageFactory = new MessageFactory();


    try {
        let nameGame = req.body.name;
        let game = await findGame(nameGame);

        if (game[0].dataValues.status !== "finished") {
            let movesExecute = game[0].dataValues.moves;

            let movesEmail = []
            if (movesExecute.length != 0)
                for (let i in movesExecute) {
                    movesEmail.push(game[0].dataValues.moves[i].player);
                }

            let emailplayer0 = game[0].dataValues.player0;
            let emailplayer1 = game[0].dataValues.player1;
            let emailplayer2 = game[0].dataValues.player2;

            let reducedMovesP0 = game[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == emailplayer0));
            let reducedMovesP1 = game[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == emailplayer1));
            let reducedMovesP2 = game[0].dataValues.possible_moves.filter((move: any) => (move.ship >= 1 && move.ship <= 3 && move.owner == emailplayer2));


            let reducedMoves0 = movesExecute.filter((move: any) => (move.owner == emailplayer0));
            let reducedMoves1 = movesExecute.filter((move: any) => (move.owner == emailplayer1));
            let reducedMoves2 = movesExecute.filter((move: any) => (move.owner == emailplayer2));

            const nextMove = [[emailplayer0, emailplayer2],
            [emailplayer2, emailplayer1],
            [emailplayer1, emailplayer2],
            [emailplayer2, emailplayer0],
            [emailplayer0, emailplayer1],
            [emailplayer1, emailplayer0]];

            let pl0 = true;
            let pl1 = true;
            let pl2 = true;

            if (reducedMovesP0.length == reducedMoves0.length) {pl0 = false;}
            if (reducedMovesP1.length == reducedMoves1.length) {pl1 = false;}
            if (reducedMovesP2.length == reducedMoves2.length) {pl2 = false;}

            let mod = pl0 && pl1 && pl2;

            let nextTurn = await isTurn(emailplayer0, emailplayer1, emailplayer2, movesEmail, mod, pl0, pl1, pl2, nextMove);

            res.json({ turn: nextTurn });
        }else {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "La partita è terminata" });

        }

    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
}