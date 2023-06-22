import { CustomStatusCodes } from './status_codes';
import { MessageInterface } from './messages_interface';
import { Response } from "express";

export class BadRequestMessage implements MessageInterface {
    public setStatus(res: Response, messageType: string, errorType: CustomStatusCodes): Response {
        const errorTypeString = errorType.toString();
        return res.status(CustomStatusCodes.BAD_REQUEST).json({
            errorTypeString: messageType
        });
    };
}

export class InternalServerErrorMessage implements MessageInterface {
    public setStatus(res: Response, messageType: string, errorType: CustomStatusCodes): Response {
        const errorTypeString = errorType.toString();
        return res.status(CustomStatusCodes.INTERNAL_SERVER_ERROR).json({
            errorTypeString: messageType
        });
    };
}

export class NotFoundErrorMessage implements MessageInterface {
    public setStatus(res: Response, messageType: string, errorType: CustomStatusCodes): Response {
        const errorTypeString = errorType.toString();
        return res.status(CustomStatusCodes.NOT_FOUND).json({
            errorTypeString: messageType
        });
    };
}