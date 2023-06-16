var jwt = require('jsonwebtoken');
import { findUser } from './basic_query';

const PRIVATE_KEY = 'bitbattle';

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
