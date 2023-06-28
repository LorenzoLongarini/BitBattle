import { updateUserTokensService } from '../services/admin_service';

/**
 * Aggiorna i token dell'utente.
 * Richiama il servizio updateUserTokensService per l'aggiornamento dei token.
 *
 * @param req - Oggetto della richiesta.
 * @param res - Oggetto della risposta.
 * @returns
 */
export const updateTokens = (req: any, res: any) => {
    return updateUserTokensService(req, res);
};