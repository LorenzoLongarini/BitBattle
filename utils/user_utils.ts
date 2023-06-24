import { findAllUsers, findUser } from "../db/queries/user_queries";
import { MessageFactory } from '../status/messages_factory'
import { CustomStatusCodes, Messages400 } from '../status/status_codes'
import { Response } from "express";

let statusMessage: MessageFactory = new MessageFactory();

// aggiungere come tipo di ritorno della funzione :Promise<Boolean>
export async function verifyIsUser(email: string, res: Response, isPresent: Boolean) {
    let existing = await findUser(email);
    if (existing.length == 0) {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.UserNotFound);
        isPresent = false;
    }
    return isPresent;
}

// aggiungere come tipo di ritorno della funzione :Promise<Boolean>
export async function verifyDifferentUser(email1: string, email2: string, res: Response, isDifferent: Boolean) {
    if (email1 == email2) {
        isDifferent = false;
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.SameUser);
    }
    return isDifferent;
}

export async function verifyIsPlaying(email: string, res: Response, isCreator: Boolean) {
    let user = await findUser(email);
    let userPlaying = user[0].dataValues.isplaying;
    if (userPlaying == true && !isCreator) {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.UserNotAvailable);
    }
    return userPlaying
}


export async function sortUsers(users: any, ascendant: boolean): Promise<any> {
    if (!ascendant) {
        users.sort((a: { tokens: number; }, b: { tokens: number; }) => a.tokens - b.tokens);
        console.log(users)
    } else {
        users.sort((a: { tokens: number; }, b: { tokens: number; }) => b.tokens - a.tokens);
        console.log(users)
    }
    return users;
}