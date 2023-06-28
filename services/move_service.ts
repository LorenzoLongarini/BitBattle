import { Request, Response } from "express";
import { findGameById } from "../db/queries/games_queries";
import { GameMode } from "../constants/game_constants";
import { doMoveAIService } from "./ai_mode_service";
import { doMoveSingleService } from "./single_mode_service";
import { doMoveMultiplayerService } from "./multiplayer_service";
import { CustomStatusCodes, Messages500 } from "../status/status_codes";
import { MessageFactory } from "../status/messages_factory";

var statusMessage: MessageFactory = new MessageFactory();

/**
 * Esegue una mossa di gioco in base alla modalità di gioco corrente.
 * Viene cercata la partita corrispondente all'ID fornito nella richiesta tramite la funzione `findGameById`.
 * 
 * @param req - L'oggetto di richiesta HTTP contenente l'ID della partita.
 * @param res - L'oggetto di risposta HTTP utilizzato per inviare la risposta al client.
 */
export async function doMoveServiceGlobal(req: Request, res: Response) {
    try {
        const searchGame: any = await findGameById(req.params.gameid);
        let modGame = searchGame[0].dataValues.mod;

        if (modGame === GameMode.mode1) {
            doMoveAIService(req, res);

        } else if (modGame === GameMode.mode2) {
            doMoveSingleService(req, res);

        } else if (modGame === GameMode.mode3) {
            doMoveMultiplayerService(req, res);
        }
    }
    catch {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);

    }

}