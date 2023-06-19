import { CustomStatusCodes } from './status_codes';
import { Response } from "express";
import { MessageInterface } from './messages_interface';
import { BadRequestMessage } from './messages_class';

export class MessageFactory {
    constructor() { };
    getStatusMessage(cases: CustomStatusCodes, res: Response, message: string): any {
        let messageClass: MessageInterface;
        switch (cases) {
            case CustomStatusCodes.BAD_REQUEST:
                messageClass = new BadRequestMessage();
                return messageClass.setStatus(res, message, cases);
        }

    }
}