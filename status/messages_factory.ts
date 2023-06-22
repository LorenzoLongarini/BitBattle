import { CustomStatusCodes, Messages400, Messages500 } from './status_codes';
import { Response } from "express";
import { BadRequestMessage, InternalServerErrorMessage, NotFoundErrorMessage, OkMessage } from './messages_class';

export class MessageFactory {
    constructor() { };
    getStatusMessage(cases: CustomStatusCodes, res: Response, message: string): any {
        let oneCase = cases;
        let messageClass;
        switch (oneCase) {
            case (400):
                messageClass = new BadRequestMessage();
                return messageClass.setStatus(res, message);
            case (500):
                messageClass = new InternalServerErrorMessage();
                return messageClass.setStatus(res, message);
            case (404):
                messageClass = new NotFoundErrorMessage();
                return messageClass.setStatus(res, message);
            case (200):
                messageClass = new OkMessage();
                return messageClass.setStatus(res, message);
            default:
                return res.status(CustomStatusCodes.INTERNAL_SERVER_ERROR).json({ error: Messages500.InternalServerError });
        }

    }
}