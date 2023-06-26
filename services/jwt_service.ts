var jwt = require('jsonwebtoken');
import { findUser } from '../db/queries/user_queries';
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

const PRIVATE_KEY = process.env.PRIVATE_KEY;

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
            res.json({ jwt: jwtBearerToken });
        }
        else {
            //TODO:gestire errore
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Utente non trovato" });
        }
    } catch (e) {
        //TODO:gestire errore
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
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