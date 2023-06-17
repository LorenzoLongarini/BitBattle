import { updateUserTokensDb } from '../db/queries/admin_queries';
import { findUser } from '../db/queries/user_queries';
import { StatusCodes } from "http-status-codes";


export async function updateUserTokensService(req: any, res: any) {
    try {
        const user: any = await findUser(req.body.email);

        const tokens = req.body.tokens;

        if (user.length != 0) {
            res.json({ tokens: tokens });

            await updateUserTokensDb(req.body.tokens, req.body.email);

        } else {
            res.status(StatusCodes.BAD_REQUEST).send({ esito: "Impossibile aggiungere token, l\'utente non esiste" })
        }

    } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });

    }
}