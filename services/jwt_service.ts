var jwt = require('jsonwebtoken');
import { findUser } from '../db/queries/user_queries';

const PRIVATE_KEY = process.env.PRIVATE_KEY;

export async function generateJwt(req: any, res: any) {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user: any = await findUser(req);

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
            res.sendStatus(404);
        }
    } catch (e) {
        //TODO:gestire errore
        res.json({ email: email, password: password })
    }
}

export function decodeJwt(auth: any) {
    const token = auth.split(" ")[1]
    return jwt.verify(token, process.env.PRIVATE_KEY);
}