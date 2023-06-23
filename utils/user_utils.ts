import { findUser } from "../db/queries/user_queries";
import { MessageFactory } from '../status/messages_factory'
import { CustomStatusCodes, Messages400} from '../status/status_codes'
import { Response } from "express";


// aggiungere come tipo di ritorno della funzione :Promise<Boolean>
export async function verifyIsUser(email: string,  res: Response, isPresent:Boolean) {
    let statusMessage: MessageFactory = new MessageFactory();
    let existing = await findUser(email);
    if(existing.length == 0){
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.UserNotFound);
        isPresent = false;
    }
    return isPresent;
}

// aggiungere come tipo di ritorno della funzione :Promise<Boolean>
export async function verifyDifferentUser(email1: string, email2:string, res: Response, isDifferent:Boolean) {
    let statusMessage: MessageFactory = new MessageFactory();
    if (email1 == email2){
        isDifferent = false;
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.SameUser);
    }
    return isDifferent;
}