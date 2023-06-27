import { classificationTypeAsc, classificationTypeDesc } from "../model/constants/game_constants";
import { MessageFactory } from "../status/messages_factory";
import { CustomStatusCodes, Messages400 } from "../status/status_codes";

var statusMessage: MessageFactory = new MessageFactory();

export const checkClafficationType = async (req: any, res: any, next: any) => {

    const type = req.body.type;
    if (isNaN(type)) {
        if (type === classificationTypeAsc || type === classificationTypeDesc) {
            next();
        } else { statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.TypeInvalid); }
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.IsANumber);
    }

};