import { findAllGames, findGame, gameOver, updateWinner, findPlayer0, findPlayer1, findPlayer2, updateScore, findGameById } from '../db/queries/games_queries';
import { Request, Response } from "express";
import { findUser, setIsNotPlayingDb, updateUserPoints, updateUserStatus } from '../db/queries/user_queries';
import { MessageFactory } from '../status/messages_factory'
import { CustomStatusCodes, Messages400, Messages500 } from '../status/status_codes'
import { aiPlayer } from '../constants/user_constants';
import { GameMode, gameFinishedLabel } from '../constants/game_constants';
import { turn } from '../utils/game_utils';
import { getJwtEmail } from './jwt_service';

var statusMessage: MessageFactory = new MessageFactory();

export async function getGamesService(res: Response) {
    try {
        const game: any = await findAllGames();
        let message = JSON.parse(JSON.stringify({ game: game }));
        statusMessage.getStatusMessage(CustomStatusCodes.OK, res, message);

    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages400.GameNotFound);
    }
}

export async function findUserCreatorService(gameName: string, player0: string, res: Response, req: Request): Promise<boolean> {
    let exist = false;
    try {
        let creator = await findPlayer0(gameName, player0);
        if (creator.length != 0) return true;
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages500.InternalServerError);
    }
    return exist;
}

export async function findPlayer1Service(gameName: string, player1: string, res: Response, req: Request): Promise<boolean> {
    let exist = false;
    try {
        let creator = await findPlayer1(gameName, player1);
        if (creator.length != 0) return true;
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages500.InternalServerError);
    }
    return exist;
}

export async function findPlayer2Service(gameName: string, player2: string, res: Response, req: Request): Promise<boolean> {

    let exist = false;
    try {
        let creator = await findPlayer2(gameName, player2);
        if (creator.length != 0) return true;
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages500.InternalServerError);
    }
    return exist;
}

export async function setGameOverStatus(req: Request, winner: any, emailplayer0: string, nameGame: string, emailplayer1?: string,
    emailplayer2?: string, firstLooser?: string) {

    await gameOver(nameGame);
    let searchGame = await findGame(nameGame);
    let scores = searchGame[0].dataValues.score;
    let winnerEmail;
    let scoreWinner;

    if (winner != aiPlayer) {
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
        console.log(winnerEmail)
        scoreWinner = {
            player: emailplayer0,
            score: 0,
        };
        scores.push(scoreWinner);
        await updateUserStatus(false, emailplayer0)
    }

    await updateWinner(nameGame, winnerEmail);

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
    }
    await setIsNotPlayingDb(emailplayer0);
    if (emailplayer0 != winnerEmail && winnerEmail != aiPlayer) {
        let scorePlayer0 = await updateMultiplayerStatus(emailplayer0, score0);
        scores.push(scorePlayer0);
    }
    if (emailplayer1 != null && emailplayer1 != winnerEmail) {
        let scorePlayer1 = await updateMultiplayerStatus(emailplayer1, score1);
        scores.push(scorePlayer1);
    }
    if (emailplayer2 != null && emailplayer2 != winnerEmail) {
        let scorePlayer2 = await updateMultiplayerStatus(emailplayer2, score2);
        scores.push(scorePlayer2);
    }
    await updateScore(nameGame, scores)
}



async function updateMultiplayerStatus(emailPlayer: string, score: any) {
    await updateUserStatus(false, emailPlayer);

    let scorePlayer = {
        player: emailPlayer,
        score: score,
    };
    let user = await findUser(emailPlayer)
    let currentPoints = parseFloat(user[0].dataValues.points)
    let winnerPoints = currentPoints + score;

    await updateUserPoints(winnerPoints, emailPlayer);
    return scorePlayer;

}



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
                console.log('Errore');
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

export async function getGameInfoService(req: Request, res: Response) {
    try {
        const game: any = await findGameById(req.params.gameid);
        let emailplayer0 = game[0].dataValues.player0;
        let emailplayer1 = game[0].dataValues.player1;
        let emailplayer2 = game[0].dataValues.player2;

        let name = game[0].dataValues.name;
        let gridSize = game[0].dataValues.grid_size;
        let statusGame = game[0].dataValues.status;
        let winner = game[0].dataValues.winner;
        let score = game[0].dataValues.score;

        let movesExecute = game[0].dataValues.moves;
        let modGame = game[0].dataValues.mod;
        if (modGame === GameMode.mode1) {
            let currTurn = game[0].dataValues.status !== gameFinishedLabel ? emailplayer0 : null
            let message = JSON.parse(JSON.stringify({ name: name, grid_size: gridSize, player0: emailplayer0, mod: GameMode.mode1, statusGame: statusGame, turn: currTurn, winnerGame: winner, score: score }));
            statusMessage.getStatusMessage(CustomStatusCodes.OK, res, message)
        } else if (modGame === GameMode.mode2) {
            let jwtPlayerEmail = getJwtEmail(req);
            let nextTurn: string;
            if (movesExecute != 0) {
                let lastPlayer = turn(movesExecute);
                if (lastPlayer !== jwtPlayerEmail) {
                    nextTurn = jwtPlayerEmail;
                } else {
                    nextTurn = emailplayer1;
                }
            } else { nextTurn = emailplayer0; }
            let currTurn = game[0].dataValues.status !== gameFinishedLabel ? nextTurn : null
            let message = JSON.parse(JSON.stringify({ name: name, grid_size: gridSize, player0: emailplayer0, player1: emailplayer1, mod: GameMode.mode2, statusGame: statusGame, turn: currTurn, winnerGame: winner, score: score }));
            statusMessage.getStatusMessage(CustomStatusCodes.OK, res, message);
        } else if (modGame === GameMode.mode3) {
            let movesEmail = []
            if (movesExecute.length != 0)
                for (let i in movesExecute) {
                    movesEmail.push(game[0].dataValues.moves[i].player);
                }

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

            if (reducedMovesP0.length == reducedMoves0.length) { pl0 = false; }
            if (reducedMovesP1.length == reducedMoves1.length) { pl1 = false; }
            if (reducedMovesP2.length == reducedMoves2.length) { pl2 = false; }

            let mod = pl0 && pl1 && pl2;
            let nextTurn = await isTurn(emailplayer0, emailplayer1, emailplayer2, movesEmail, mod, pl0, pl1, pl2, nextMove);
            let currTurn = game[0].dataValues.status !== gameFinishedLabel ? nextTurn : null
            let message = JSON.parse(JSON.stringify({ name: name, grid_size: gridSize, player0: emailplayer0, player1: emailplayer1, player2: emailplayer2, mod: GameMode.mode3, statusGame: statusGame, turn: currTurn, winnerGame: winner, score: score }));
            statusMessage.getStatusMessage(CustomStatusCodes.OK, res, message);
        }
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages500.InternalServerError);
    }
}