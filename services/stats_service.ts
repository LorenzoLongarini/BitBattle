import { findAllUsers } from "../db/queries/user_queries";
import { Request, Response } from "express";
import { sortUsers } from "../utils/user_utils";
import { findAllPlayed0, findAllPlayed1, findAllPlayed2, findPlayer0, findPlayer1, findPlayer2, findWinner } from "../db/queries/games_queries";
import { CustomStatusCodes, Messages400 } from "../status/status_codes";
import { decodeJwt } from "./jwt_service";
import { MessageFactory } from "../status/messages_factory";

let statusMessage: MessageFactory = new MessageFactory();

export async function getUserStatsService(req: Request, res: Response) {

    let jwtBearerToken = req.headers.authorization;
    let jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;
    let jwtPlayerEmail: any;
    if (jwtDecode && jwtDecode.email) {
        jwtPlayerEmail = jwtDecode.email;

        try {
            const totWin: any = await findWinner(jwtPlayerEmail);
            const numPlayer0 = await findAllPlayed0(jwtPlayerEmail);
            const numPlayer1 = await findAllPlayed1(jwtPlayerEmail);
            const numPlayer2 = await findAllPlayed2(jwtPlayerEmail);

            let totalPlay = numPlayer0.length + numPlayer1.length + numPlayer2.length;

            let totalLose = totalPlay - totWin.length;

            let stats: any = [];

            let user = {
                email: jwtPlayerEmail,
                played: totalPlay,
                win: totWin.length,
                lose: totalLose,
            };
            stats.push(user);

            res.json({ utente: stats });

        } catch (error) {
            console.error('Error :', error);
            throw error;
        }
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages400.UserNotFound);
    }
}

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