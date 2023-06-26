import { MessageFactory } from "../status/messages_factory";
import { CustomStatusCodes, Messages400 } from "../status/status_codes";

var statusMessage: MessageFactory = new MessageFactory();

export const checkEmailBody = async (req: any, res: any, next: any) => {

    const email = req.body.email;
    if (!isNaN(email)) {
        next();
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.NotANumber);
    }
};

export const checkPasswordBody = async (req: any, res: any, next: any) => {

    const password = req.body.password;
    if (!isNaN(password)) {
        next();
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.NotANumber);
    }
}