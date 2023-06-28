import { findUser } from "../db/queries/user_queries";
import { decodeJwt } from "../services/jwt_service";
import { StatusCodes } from "http-status-codes";


/**
 * Verifica se l'utente è un amministratore.
 * Controlla se l'utente autenticato nell'autorizzazione JWT è un amministratore.
 * Restituisce un errore 401 se l'utente non è autorizzato o un errore 500 se si verifica un errore interno.
 *
 * @param req - Oggetto della richiesta HTTP.
 * @param res - Oggetto della risposta HTTP.
 * @param next - Funzione di callback per passare alla prossima operazione.
 */
export const checkIsAdmin = async (req: any, res: any, next: any) => {
    try {
        const jwtBearerToken = req.headers.authorization;
        const jwtDecode = jwtBearerToken != null ? decodeJwt(jwtBearerToken) : null;

        if (jwtDecode != null) {
            const user = await findUser(jwtDecode.email);
            if (user.length != 0 && user[0].dataValues.isadmin) {
                next();
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
            }
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};