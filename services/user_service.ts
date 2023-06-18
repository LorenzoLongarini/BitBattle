import { findUser, createUserDb } from '../db/queries/user_queries';
import { StatusCodes } from "http-status-codes";

export async function createUserService(req: any, res: any) {
    try {
        const user: any = await findUser(req.body.email);
        if (user.length == 0) {
            await createUserDb(req);
            res.status(StatusCodes.OK).send({ esito: "Utente aggiunto con successo" })

        }
        else (
            res.status(StatusCodes.BAD_REQUEST).send({ esito: "Non è possibile creare l'utente perchè è già esistente" })
        );

    } catch (e) {
        //TODO:gestire errore
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
}

export async function getTokensService(req: any, res: any) {
    try {
        const user: any = await findUser(req.body.email);


        if (user.length != 0) {
            const tokens = parseFloat(user[0].dataValues.tokens);

            res.status(StatusCodes.OK).json({ tokens: tokens });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "Impossibile visualizzare token, l\'utente non esiste" });
        }

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        throw error;
    }
}
