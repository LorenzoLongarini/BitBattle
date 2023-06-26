import { MessageFactory } from "../status/messages_factory";
import { CustomStatusCodes, Messages400 } from "../status/status_codes";

var statusMessage: MessageFactory = new MessageFactory();

export const checkTokensBody = async (req: any, res: any, next: any) => {

    const tokens = req.body.tokens;
    if (!isNaN(tokens)) {
        if (tokens < 0) {
            statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.NegativeTokens);
        }
        next();
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.NotANumber);
    }

};