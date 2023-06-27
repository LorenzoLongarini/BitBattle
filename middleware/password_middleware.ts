import { Request, Response, NextFunction } from "express";
import { MessageFactory } from "../status/messages_factory";
import { CustomStatusCodes, Messages400 } from "../status/status_codes";

var statusMessage: MessageFactory = new MessageFactory();

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
export const checkPasswordBody = async (req: any, res: any, next: any) => {

    const password = req.body.password;
    if (isNaN(password)) {
        next();
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.IsANumber);
    }
}
