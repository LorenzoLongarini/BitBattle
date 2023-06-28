import { Request, Response, NextFunction } from "express";
import { MessageFactory } from "../status/messages_factory";
import { CustomStatusCodes, Messages400 } from "../status/status_codes";

var statusMessage: MessageFactory = new MessageFactory();

/**
 * Controlla la validità del formato dell'indirizzo email specificato nella richiesta.
 * Verifica se l'indirizzo email è non vuoto e rispetta il formato standard.
 * Restituisce un errore 400 se l'indirizzo email non è valido.
 *
 * @param req - Oggetto della richiesta HTTP.
 * @param res - Oggetto della risposta HTTP.
 * @param next - Funzione di callback per passare alla prossima operazione.
 */
export const checkEmail = (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (email.length != 0) {
        let checker: boolean = expression.test(email);
        if (checker) {
            next();
        } else {
            statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.EmailCheck);
        }

    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.EmailEmpty);
    }
};

/**
 * Controlla se il campo email nella richiesta non è un numero.
 * Restituisce un errore 400 se l'email è un numero.
 *
 * @param req - Oggetto della richiesta HTTP.
 * @param res - Oggetto della risposta HTTP.
 * @param next - Funzione di callback per passare alla prossima operazione.
 */
export const checkEmailBody = async (req: any, res: any, next: any) => {
    const email = req.body.email;
    if (isNaN(email)) {
        next();
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.IsANumber);
    }
};