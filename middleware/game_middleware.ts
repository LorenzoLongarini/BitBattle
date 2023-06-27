import { Request, Response, NextFunction } from "express";
import { decodeJwt } from "../services/jwt_service";
import { CustomStatusCodes, Messages400, Messages500 } from "../status/status_codes";
import { MessageFactory } from "../status/messages_factory";
import { findPlayer1Service, findPlayer2Service, findUserCreatorService } from "../services/games_service";
import { findGameById } from "../db/queries/games_queries";

let statusMessage: MessageFactory = new MessageFactory();

export const checkGamePlayer = async (req: Request, res: Response, next: NextFunction) => {
    let game = await findGameById(req.params.gameid);
    let gameName = game[0].dataValues.name;
    const jwtBearerToken = req.headers.authorization;
    const jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;
    if (jwtDecode && jwtDecode.email) {
        let creator = await findUserCreatorService(gameName, jwtDecode.email, res, req)
        let player1 = await findPlayer1Service(gameName, jwtDecode.email, res, req)
        let player2 = await findPlayer2Service(gameName, jwtDecode.email, res, req)
        if (creator || player1 || player2) { next(); } else {
            statusMessage.getStatusMessage(CustomStatusCodes.UNAUTHORIZED, res, Messages400.Unauthorized);
        }
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};

export const checkMove = async (req: Request, res: Response, next: NextFunction) => {
    const move = req.body.move
    const firstIndex = move[0];
    const secondIndex = move[1];
    let game = await findGameById(req.params.gameid);
    let gridSize = game[0].dataValues.grid_size;
    console.log(game)
    console.log(firstIndex, secondIndex, gridSize)
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