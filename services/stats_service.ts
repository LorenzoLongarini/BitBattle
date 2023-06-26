import { findAllUsers } from "../db/queries/user_queries";
import { Request, Response } from "express";
import { sortUsers } from "../utils/user_utils";
import { findAllPlayed0, findAllPlayed1, findAllPlayed2, findWinner } from "../db/queries/games_queries";
import { CustomStatusCodes, Messages400 } from "../status/status_codes";
import { decodeJwt } from "./jwt_service";
import { MessageFactory } from "../status/messages_factory";
// const Joi = require("joi").extend(require("@joi/date"));


let statusMessage: MessageFactory = new MessageFactory();

export async function getUserStatsService(req: Request, res: Response) {
    // const validateExpression = Joi.object()
    //     .keys({
    //         'startDate': Joi.date()
    //             .format("YYYY-MM-DD hh:mm:ss")
    //             .optional()
    //             .allow(''),
    //         'endDate': Joi.date()
    //             .format("YYYY-MM-DD  hh:mm:ss")
    //             .optional()
    //             .allow('')
    //             .min(Joi.ref('startDate'))
    //     });
    let jwtBearerToken = req.headers.authorization;
    let jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;
    let jwtPlayerEmail: any;
    if (jwtDecode && jwtDecode.email) {
        jwtPlayerEmail = jwtDecode.email;

        try {

            let stats = await generateStats(req, jwtPlayerEmail)
            res.json({ utente: stats });


        } catch (error) {
            console.error('Error :', error);
            throw error;
        }
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages400.UserNotFound);
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
        let type = (req.body.type == "ascendente") ? true : false;
        let sortedUsers: any = sortUsers(users, type)
        let classification: any = [];

        for (let i = 0; i < sortedUsers.length; i++) {
            let user = {
                email: sortedUsers[i].dataValues.email,
                points: sortedUsers[i].dataValues.points,
            };
            classification.push(user);
        }

        res.json({ utente: classification });

    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
}

export async function generateStats(req: Request, jwtPlayerEmail: string): Promise<any> {
    const totWin: any = await findWinner(jwtPlayerEmail);
    const numPlayer0 = await findAllPlayed0(jwtPlayerEmail);
    const numPlayer1 = await findAllPlayed1(jwtPlayerEmail);
    const numPlayer2 = await findAllPlayed2(jwtPlayerEmail);

    // let startDate = new Date(req.body.startDate);
    // let endDate = new Date(req.body.startDate);
    // let startDateMilli = startDate.getTime();
    // let endDateMilli = endDate.getTime();

    let totalLength = numPlayer0.length + numPlayer1.length + numPlayer2.length;
    let totalPlay: any = [];
    if (numPlayer0.length != 0) { totalPlay.push(numPlayer0); }
    if (numPlayer1.length != 0) { totalPlay.push(numPlayer1); }
    if (numPlayer2.length != 0) { totalPlay.push(numPlayer2); }

    let sigma = [];

    let totalLose = totalLength - totWin.length;

    let maxMoves: number = 0;
    let minMoves: number = totalPlay[0][0].dataValues.moves.filter((move: any) => move.player === jwtPlayerEmail).length;
    let totalMoves: number = 0;

    for (let i = 0; i < totalLength; i++) {
        let gameMoves = totalPlay[0][i].dataValues.moves.filter((move: any) => move.player === jwtPlayerEmail).length;
        totalMoves += gameMoves;
        sigma.push(gameMoves);
        maxMoves = maxMoves < gameMoves ? gameMoves : maxMoves;
        minMoves = minMoves < gameMoves ? minMoves : gameMoves;

    }

    let standardDev = standardDeviation(sigma);
    let meanStat = mean(sigma)

    let user = {
        email: jwtPlayerEmail,
        played: totalLength,
        win: totWin.length,
        lose: totalLose,
        totalMoves: totalMoves,
        maxMovesPerGame: maxMoves,
        minMovesPerGame: minMoves,
        standardDeviation: standardDev,
        mean: meanStat
    };
    return user;
}