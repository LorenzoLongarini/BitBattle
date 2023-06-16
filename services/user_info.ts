import { createUserDb, findUser } from './user_query';


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

