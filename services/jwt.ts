var jwt = require('jsonwebtoken');
import { findUser } from './user_query';

const PRIVATE_KEY = 'bitbattle';

export async function generateJwt(req: any, res: any) {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user: any = await findUser(req);

        if (user) {
            console.log(user);
            const payload = {
                email: email,
                password: password,
                user: user.id
            };

            const jwtBearerToken = jwt.sign(payload, PRIVATE_KEY);
            res.json({ jwt: jwtBearerToken });
        }
        else {
            //TODO:gestire errore
            res.json({ user: user });
            res.sendStatus(404);
        }
    } catch (e) {
        //TODO:gestire errore
        res.json({ email: email, password: password })
    }
}
