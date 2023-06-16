import { updateUserTokensDb } from '../db/queries/admin_queries';
import { findUser } from '../db/queries/user_queries';
export async function updateUserTokensService(req: any, res: any) {
    try {
        const user: any = await findUser(req);

        const tokens_ad = req.body.tokens;

        if (user.length != 0) {
            // const id = user[0].dataValues.id;
            res.json({ tokens: tokens_ad });

            await updateUserTokensDb(req.body.tokens, req.body.email);

        } else {
            res.json({ err: "Impossibile aggiungere token" });
        }

    } catch (error) {
        console.error('Error retrieving user token:', error);
        throw error;
    }
}