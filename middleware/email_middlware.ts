import { Request, Response, NextFunction } from "express";
import { MessageFactory } from "../status/messages_factory";
import { CustomStatusCodes, Messages400 } from "../status/status_codes";

var statusMessage: MessageFactory = new MessageFactory();

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

export const checkEmailBody = async (req: any, res: any, next: any) => {

    const email = req.body.email;
    if (isNaN(email)) {
        next();
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.IsANumber);
    }
};