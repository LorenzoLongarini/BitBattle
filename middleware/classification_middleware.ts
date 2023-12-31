import { classificationTypeAsc, classificationTypeDesc } from "../constants/game_constants";
import { MessageFactory } from "../status/messages_factory";
import { CustomStatusCodes, Messages400 } from "../status/status_codes";
import { Request, Response, NextFunction } from "express";

var statusMessage: MessageFactory = new MessageFactory();

/**
 * Controlla il tipo di classificazione specificato nella richiesta.
 * Verifica se il tipo è valido e non rappresenta un numero.
 * Restituisce un errore 400 se il tipo non è valido o è un numero.
 *
 * @param req - Oggetto della richiesta HTTP.
 * @param res - Oggetto della risposta HTTP.
 * @param next - Funzione di callback per passare alla prossima operazione.
 */
export const checkClafficationType = async (req: Request, res: Response, next: NextFunction) => {

    const type = req.body.type;
    if (isNaN(type)) {
        if (type === classificationTypeAsc || type === classificationTypeDesc) {
            next();
        } else { statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.TypeInvalid); }
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.IsANumber);
    }

};