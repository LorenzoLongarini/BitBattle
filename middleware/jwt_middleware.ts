import { decodeJwt } from "../services/jwt_service"
import { Request, Response, NextFunction } from "express";
import { CustomStatusCodes, Messages400 } from "../status/status_codes";
import { MessageFactory } from "../status/messages_factory";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    let statusMessage: MessageFactory = new MessageFactory();
    const jwtBearerToken = req.headers.authorization;
    const jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;

    if (jwtDecode && jwtDecode.email && jwtDecode.password) {
        next();
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.UNAUTHORIZED, res, Messages400.Unauthorized);
    }
};
