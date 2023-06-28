import { findAllUsers, findUser } from "../db/queries/user_queries";
import { MessageFactory } from '../status/messages_factory'
import { CustomStatusCodes, Messages400 } from '../status/status_codes'
import { Response } from "express";

let statusMessage: MessageFactory = new MessageFactory();

/**
 * Verifica se l'utente esiste nel sistema.
 * @param email - L'indirizzo email dell'utente da verificare.
 * @param res - L'oggetto di risposta HTTP utilizzato per inviare la risposta al client.
 * @param isPresent - Flag che indica se l'utente è presente o meno nel sistema.
 * @returns Una Promise che restituisce true se l'utente è presente, altrimenti false.
 */
export async function verifyIsUser(email: string, res: Response, isPresent: Boolean) {
    let existing = await findUser(email);
    if (existing.length == 0) {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.UserNotFound);
        isPresent = false;
    }
    return isPresent;
}

/**
* Verifica se due utenti sono diversi, tramite un confronto su email.
* @param email1 - La prima email da confrontare.
* @param email2 - La seconda email da confrontare.
* @param res - L'oggetto di risposta HTTP utilizzato per inviare la risposta al client.
* @param isDifferent - Flag che indica se le due email sono diverse o meno.
* @returns Una Promise che restituisce true se le due email sono diverse, altrimenti false.
*/
export async function verifyDifferentUser(email1: string, email2: string, res: Response, isDifferent: Boolean) {
    if (email1 == email2) {
        isDifferent = false;
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.SameUser);
    }
    return isDifferent;
}

/**
 * Verifica se l'utente sta giocando.
 * @param email - L'indirizzo email dell'utente da verificare.
 * @param res - L'oggetto di risposta HTTP utilizzato per inviare la risposta al client.
 * @param isCreator - Flag che indica se l'utente è il creatore della partita.
 * @returns Una Promise che restituisce true se l'utente sta giocando, altrimenti false.
 */
export async function verifyIsPlaying(email: string, res: Response, isCreator: Boolean) {
    let user = await findUser(email);
    let userPlaying = user[0].dataValues.isplaying;
    if (userPlaying == true && !isCreator) {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.UserNotAvailable);
    }
    return userPlaying
}

/**
 * Ordina un array di utenti in base al punteggio.
 * @param users - L'array di utenti da ordinare.
 * @param ascendant - Flag che indica se l'ordinamento è ascendente o discendente.
 * @returns Una Promise che restituisce l'array di utenti ordinato.
 */
export function sortUsers(users: any, ascendant: boolean): Promise<any> {
    if (!ascendant) {
        users.sort((a: { points: number; }, b: { points: number; }) => a.points - b.points);
    } else {
        users.sort((a: { points: number; }, b: { points: number; }) => b.points - a.points);
    }
    return users;
}