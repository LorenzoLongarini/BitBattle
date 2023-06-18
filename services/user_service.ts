import { findUser, createUserDb, findGames} from '../db/queries/user_queries';

export async function createUserService(req: any, res: any) {
    try {
        const user: any = await findUser(req);
        if (user.length == 0) {
            await createUserDb(req);
            res.json({ esito: "Utente aggiunto con successo" })
        }
        else (
            res.json({ esito: "Utente non aggiunto con successo" })
        );

    } catch (e) {
        //TODO:gestire errore
        res.json({ esito: "ERRORE" })
    }
}

export async function getTokens(req: any, res: any) {
    try {
        const user: any = await findUser(req);


        if (user.length != 0) {
            const tokens = parseFloat(user[0].dataValues.tokens);

            res.json({ tokens: tokens });
        } else {
            res.json({ tokens: "Token non disponibili" });
        }

    } catch (error) {
        console.error('Error retrieving user token:', error);
        throw error;
    }
}

export async function getGames(req: any, res: any) {
    try {
        const game1: any = await findGames(req);
        console.log(game1);
        res.json({ risultato: game1 });

    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
}
