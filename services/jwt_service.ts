var jwt = require('jsonwebtoken');
import { findUser } from '../db/queries/user_queries';
import { Request, Response } from "express";
import { MessageFactory } from '../status/messages_factory';
import { CustomStatusCodes, Messages400, Messages500 } from '../status/status_codes';

const PRIVATE_KEY = process.env.PRIVATE_KEY;
var statusMessage: MessageFactory = new MessageFactory();


export async function generateJwtService(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user: any = await findUser(req.body.email);

        if (user) {
            const payload = {
                email: email,
                password: password,
                user: user[0].dataValues.id
            };

            const jwtBearerToken = jwt.sign(payload, PRIVATE_KEY);
            let message = JSON.parse(JSON.stringify({ jwt: jwtBearerToken }));
            statusMessage.getStatusMessage(CustomStatusCodes.OK, res, message);
        }
        else {
            statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages400.UserNotFound);

        }
    } catch (e) {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);

    }
}

export function decodeJwt(auth: any) {
    const token = auth.split(" ")[1]
    return jwt.verify(token, process.env.PRIVATE_KEY);
}

export function getJwtEmail(req: Request): string {
    let jwtBearerToken = req.headers.authorization;
    let jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;
    let jwtPlayerEmail: any;
    jwtPlayerEmail = jwtDecode.email;
    return jwtPlayerEmail;
}