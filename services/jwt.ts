var jwt = require('jsonwebtoken');
import { findUser } from './user_query';

const PRIVATE_KEY = 'bitbattle';

export async function generateJwt(req: any, res: any) {
    try {
        const user: any = await findUser(req.body.email, req.body.password);

        if (user) {
            console.log(user);
            const payload = {
                email: user.email,
                password: user.password,
                user: user.id
            };

            const jwtBearerToken = jwt.sign({
                email: user.email,
                password: user.password,
                user: user.id
            }, PRIVATE_KEY, {
                algorithm: 'RS256',
                // expiresIn: 120,
                subject: user.id
            });
            res.json({ jwt: jwtBearerToken });
        }
        else {
            // send status 401 Unauthorized
            res.sendStatus(401);
        }
    } catch (error) {
        res.json({ error: error });
    }
}
