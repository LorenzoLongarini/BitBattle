import { Request, Response, NextFunction } from "express";
import { decodeJwt } from "../services/jwt_service";
import { CustomStatusCodes, Messages400 } from "../status/status_codes";
import { MessageFactory } from "../status/messages_factory";
import { findPlayer1Service, findPlayer2Service, findUserCreatorService } from "../services/games_service";

let statusMessage: MessageFactory = new MessageFactory();

export const checkGameCreatorAi = async (req: Request, res: Response, next: NextFunction) => {
    const jwtBearerToken = req.headers.authorization;
    const jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;
    if (jwtDecode && jwtDecode.email) {
        let creator = await findUserCreatorService(jwtDecode.email, res, req)
        if (creator) { next(); } else {
            statusMessage.getStatusMessage(CustomStatusCodes.UNAUTHORIZED, res, Messages400.Unauthorized);
        }
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.UNAUTHORIZED, res, Messages400.Unauthorized);
    }
};

export const checkGamePlayer = async (req: Request, res: Response, next: NextFunction) => {
    const jwtBearerToken = req.headers.authorization;
    const jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;
    if (jwtDecode && jwtDecode.email) {
        let creator = await findUserCreatorService(jwtDecode.email, res, req)
        let player1 = await findPlayer1Service(jwtDecode.email, res, req)
        let player2 = await findPlayer2Service(jwtDecode.email, res, req)
        if (creator || player1 || player2) { next(); } else {
            statusMessage.getStatusMessage(CustomStatusCodes.UNAUTHORIZED, res, Messages400.Unauthorized);
        }
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.UNAUTHORIZED, res, Messages400.Unauthorized);
    }
};

export const checkMove = async (req: Request, res: Response, next: NextFunction) => {
    const firstIndex = req.body.move[0];
    const secondIndex = req.body.move[1];
    const gridSize = req.body.gridSize;
    if (!isNaN(gridSize) && !isNaN(firstIndex) && !isNaN(secondIndex)) {
        if (firstIndex < 0 || secondIndex < 0) {
            statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.OutInvalid);
        } else if (firstIndex > gridSize || secondIndex > gridSize) {
            statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.OutOfBound);
        } else {
            next();
        }
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.NotANumber);
    }
};