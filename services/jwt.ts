var jwt = require('jsonwebtoken');
import { findUser } from './user_query';

const PRIVATE_KEY = 'bitbattle';

export async function generateJwt(req: any, res: any) {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user: any = await findUser(email);

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
            // send status 401 Unauthorized
            res.json({ user: user });
            res.sendStatus(404);
        }
    } catch (e) {
        res.json({ email: email, password: password })
        // res.json({ password: password });
        // res.json({ error: e });
    }
}
