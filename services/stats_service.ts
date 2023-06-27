import { findAllUsers } from "../db/queries/user_queries";
import { Request, Response } from "express";
import { sortUsers } from "../utils/user_utils";
import { findAllPlayed0, findAllPlayed1, findAllPlayed2, findGame, findGameById, findWinner } from "../db/queries/games_queries";
import { CustomStatusCodes, Messages400 } from "../status/status_codes";
import { getJwtEmail } from "./jwt_service";
import { MessageFactory } from "../status/messages_factory";
import { classificationTypeAsc } from "../model/constants/game_constants";
import moment from 'moment';

var statusMessage: MessageFactory = new MessageFactory();
const dateFormat = 'YYYY-MM-DD';

export async function getUserStatsService(req: Request, res: Response) {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    let startDateValid;
    let endDateValid;
    if (startDate !== "") { startDateValid = moment(startDate, dateFormat, true).isValid(); }
    if (endDate !== "") { endDateValid = moment(endDate, dateFormat, true).isValid(); }

    let jwtPlayerEmail = getJwtEmail(req);

    try {
        let stats;
        if ((startDate !== "" && endDate !== "") && (startDateValid && endDateValid)) {
            if (startDate === endDate) {
                statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.InvalidDateSame);
            } else {
                stats = await generateStats(jwtPlayerEmail, startDate, endDate, res)
            }
        } else if ((startDate === "" && endDate !== "") && endDateValid) {
            stats = await generateStats(jwtPlayerEmail, "", endDate, res)
        } else if ((startDate !== "" && endDate === "") && startDateValid) {
            stats = await generateStats(jwtPlayerEmail, startDate, "", res)
        } else if ((startDate === "" && endDate === "")) {
            stats = await generateStats(jwtPlayerEmail, "", "", res)
        } else {
            statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages400.StatsNotAvalaible);
        }
        let message = JSON.parse(JSON.stringify({ utente: stats }))
        statusMessage.getStatusMessage(CustomStatusCodes.OK, res, message);
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages400.StatsNotAvalaible);
    }
}

const standardDeviation = (arr: number[]): number => {
    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    return Math.sqrt(
        arr
            .reduce((acc, val) => acc + (val - mean) ** 2, 0) /
        (arr.length - 1)
    );
};

const mean = (arr: number[]): number => { const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length; return mean; }

export async function getClassificationService(req: Request, res: Response) {
    try {
        const users: any = await findAllUsers();
        let type = (req.body.type == classificationTypeAsc) ? true : false;
        let sortedUsers: any = sortUsers(users, type)
        let classification: any = [];

        for (let i = 0; i < sortedUsers.length; i++) {
            let user = {
                email: sortedUsers[i].dataValues.email,
                points: sortedUsers[i].dataValues.points,
            };
            classification.push(user);
        }

        let message = JSON.parse(JSON.stringify({ utente: classification }))
        statusMessage.getStatusMessage(CustomStatusCodes.OK, res, message);

    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages400.UserNotFound);
    }
}

export async function generateStats(jwtPlayerEmail: string, startDate: any, endDate: any, res: Response): Promise<any> {

    const totWin = await findWinner(jwtPlayerEmail);
    const numPlayer0 = await findAllPlayed0(jwtPlayerEmail);
    const numPlayer1 = await findAllPlayed1(jwtPlayerEmail);
    const numPlayer2 = await findAllPlayed2(jwtPlayerEmail);
    let wins: any = [];
    wins.push(totWin);

    let totalWins: any = [];
    let totalPlay: any = [];
    let totalPlayFiltered: any = [];

    let startDateMilli: number = 0;
    let endDateMilli: number = 0;
    if (startDate !== "") { startDateMilli = moment(startDate, dateFormat).valueOf(); }
    if (endDate !== "") { endDateMilli = moment(endDate, dateFormat).valueOf(); }

    if (numPlayer0.length != 0) { totalPlay.push(numPlayer0); }
    if (numPlayer1.length != 0) { totalPlay.push(numPlayer1); }
    if (numPlayer2.length != 0) { totalPlay.push(numPlayer2); }

    let filteredData;
    let winnerFilter;
    if (startDate !== "" && endDate === "") {
        filteredData = totalPlay[0].filter((value: any) => Number(value.dataValues.created_at) >= startDateMilli);
        winnerFilter = wins[0].filter((value: any) => Number(value.dataValues.created_at) >= startDateMilli);
    } else if (startDate === "" && endDate !== "") {
        filteredData = totalPlay[0].filter((value: any) => Number(value.dataValues.created_at) <= endDateMilli);
        winnerFilter = wins[0].filter((value: any) => Number(value.dataValues.created_at) <= endDateMilli);
    } else if (startDate !== "" && endDate !== "") {
        if (startDateMilli > endDateMilli) { statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.InvalidDate); }
        else {
            filteredData = totalPlay[0].filter((value: any) => (Number(value.dataValues.created_at) >= startDateMilli) && (Number(value.dataValues.created_at) <= endDateMilli));
            winnerFilter = wins[0].filter((value: any) => (Number(value.dataValues.created_at) >= startDateMilli) && (Number(value.dataValues.created_at) <= endDateMilli));
        }
    } else if (startDate === "" && endDate === "") {
        filteredData = totalPlay[0];
        winnerFilter = wins[0];
    }
    if (filteredData.length != 0) { totalPlayFiltered.push(filteredData); }
    if (filteredData.length != 0) { totalWins.push(winnerFilter); }

    let sigma = [];
    let totalLose = totalPlayFiltered[0].length - totalWins[0].length;

    let maxMoves: number = 0;
    let minMoves: number = totalPlayFiltered[0][0].dataValues.moves.filter((move: any) => move.player === jwtPlayerEmail).length;
    let totalMoves: number = 0;

    for (let i = 0; i < totalPlayFiltered[0].length; i++) {
        let gameMoves = totalPlayFiltered[0][i].dataValues.moves.filter((move: any) => move.player === jwtPlayerEmail).length;
        totalMoves += gameMoves;
        sigma.push(gameMoves);
        maxMoves = maxMoves < gameMoves ? gameMoves : maxMoves;
        minMoves = minMoves < gameMoves ? minMoves : gameMoves;
    }

    let standardDev = standardDeviation(sigma);
    let meanStat = mean(sigma);

    let user = {
        email: jwtPlayerEmail,
        played: totalPlayFiltered[0].length,
        win: totalWins[0].length,
        lose: totalLose,
        totalMoves: totalMoves,
        maxMovesPerGame: maxMoves,
        minMovesPerGame: minMoves,
        standardDeviation: standardDev,
        mean: meanStat
    };
    return user;
}

export async function getMoves(req: Request, res: Response) {
    try {
        const game: any = await findGameById(req.params.gameid);
        let moves = game[0].dataValues.moves;
        let message = JSON.parse(JSON.stringify({ moves: moves }))
        statusMessage.getStatusMessage(CustomStatusCodes.OK, res, message);
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages400.GameNotFound);
    }
}
