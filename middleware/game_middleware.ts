import { Request, Response, NextFunction } from "express";
import { decodeJwt } from "../services/jwt_service";
import { CustomStatusCodes, Messages400 } from "../status/status_codes";
import { MessageFactory } from "../status/messages_factory";
import { findUserCreatorService } from "../services/games_service";


export const checkGameCreator = async (req: Request, res: Response, next: NextFunction) => {
    let statusMessage: MessageFactory = new MessageFactory();
    const jwtBearerToken = req.headers.authorization;
    const jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;
    if (jwtDecode && jwtDecode.email) {
        let creator = await findUserCreatorService(jwtDecode.email, res)
        if (creator) { next(); } else {
            statusMessage.getStatusMessage(CustomStatusCodes.UNAUTHORIZED, res, Messages400.Unauthorized);
        }
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.UNAUTHORIZED, res, Messages400.Unauthorized);
    }
};