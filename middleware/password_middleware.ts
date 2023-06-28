import { Request, Response, NextFunction } from "express";
import { MessageFactory } from "../status/messages_factory";
import { CustomStatusCodes, Messages400 } from "../status/status_codes";

var statusMessage: MessageFactory = new MessageFactory();

/**
 * Controlla la validità della password specificata nella richiesta.
 * Verifica se la password è non vuota e rispetta i requisiti minimi di complessità.
 * Restituisce un errore 400 se la password non è valida.
 *
 * @param req - Oggetto della richiesta HTTP.
 * @param res - Oggetto della risposta HTTP.
 * @param next - Funzione di callback per passare alla prossima operazione.
 */
export const checkPassword = (req: Request, res: Response, next: NextFunction) => {
    const password = req.body.password;
    const expression: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/i;

    if (password.length != 0) {
        let checker: boolean = expression.test(password);
        if (checker) {
            next();
        } else {
            statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.PasswordCheck);
        }

    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.PasswordEmpty);
    }
};

/**
 * Controlla se il campo password nella richiesta non è un numero.
 * Verifica se il campo password è valido e non rappresenta un numero.
 * Restituisce un errore 400 se la password è un numero.
 *
 * @param req - Oggetto della richiesta HTTP.
 * @param res - Oggetto della risposta HTTP.
 * @param next - Funzione di callback per passare alla prossima operazione.
 */
export const checkPasswordBody = async (req: any, res: any, next: any) => {
    const password = req.body.password;
    if (isNaN(password)) {
        next();
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.IsANumber);
    }
};
