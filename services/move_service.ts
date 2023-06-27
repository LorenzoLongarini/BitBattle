import { Request, Response } from "express";
import { findGame, findGameById } from "../db/queries/games_queries";
import { GameMode } from "../model/constants/game_constants";
import { doMoveAIService } from "./ai_mode_service";
import { doMoveService } from "./single_mode_service";
import { doMoveMultiplayerService } from "./multiplayer_service";
import { CustomStatusCodes, Messages500 } from "../status/status_codes";
import { MessageFactory } from "../status/messages_factory";

let statusMessage: MessageFactory = new MessageFactory();

export async function doMoveServiceGlobal(req: Request, res: Response) {
    //let searchGame = await findGame(req.body.name);
    try {
        const searchGame: any = await findGameById(req.params.gameid);
        let modGame = searchGame[0].dataValues.mod;
        console.log("modalitaaaaaaaaaaaaaa" + modGame);

        if (modGame === GameMode.mode1) {
            console.log("Sei nella modalità 1vAI ")
            doMoveAIService(req, res);

        } else if (modGame === GameMode.mode2) {
            console.log("Sei nella modalità 1v1 ")
            doMoveService(req, res);

        } else if (modGame === GameMode.mode3) {
            console.log("Sei nella modalità 1v2 ")
            doMoveMultiplayerService(req, res);
        }
    }
    catch {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);

    }

}