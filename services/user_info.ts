import { findUser } from './basic_query';

export async function getTokens(req: any, res: any) {
    try {
        const user: any = await findUser(req);


        if (user.length != 0) {
            const tokens = user[0].dataValues.tokens;

            res.json({ tokens: tokens });
        } else {
            res.json({ tokens: "Token non disponibili" });
        }

    } catch (error) {
        console.error('Error retrieving user token:', error);
        throw error;
    }
}
