import { findUser, updateUserTokensDb } from './basic_query';

export async function updateUserTokensService(req: any, res: any) {
    try {
        const user: any = await findUser(req);


        if (user.length != 0) {
            // const id = user[0].dataValues.id;
            const tokens_ad = req.body.tokens;
            res.json({ tokens: tokens_ad });

            await updateUserTokensDb(req);

        } else {
            res.json({ err: "Impossibile aggiungere token" });
        }

    } catch (error) {
        console.error('Error retrieving user token:', error);
        throw error;
    }
}