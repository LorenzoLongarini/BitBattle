import { Request, Response, NextFunction } from "express";
import { decodeJwt } from "../services/jwt_service";
import { CustomStatusCodes, Messages400, Messages500 } from "../status/status_codes";
import { MessageFactory } from "../status/messages_factory";
import { findPlayer1Service, findPlayer2Service, findUserCreatorService } from "../services/games_service";
import { findGameById } from "../db/queries/games_queries";

var statusMessage: MessageFactory = new MessageFactory();

/**
 * Middleware che controlla se un giocatore è autorizzato ad accedere a una partita.
 * Verifica se l'utente è il creatore della partita o uno dei giocatori assegnati.
 * Se l'autenticazione tramite token JWT fallisce, restituisce un errore 500.
 * Se l'autenticazione ha successo ma l'utente non è autorizzato, restituisce un errore 401.
 *
 * @param req - Oggetto della richiesta HTTP.
 * @param res - Oggetto della risposta HTTP.
 * @param next - Funzione di callback per passare alla prossima operazione.
 */
export const checkGamePlayer = async (req: Request, res: Response, next: NextFunction) => {
    const game = await findGameById(req.params.gameid);
    const gameName = game[0].dataValues.name;
    const jwtBearerToken = req.headers.authorization;
    const jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;
    if (jwtDecode && jwtDecode.email && jwtDecode.password) {
        let creator = await findUserCreatorService(gameName, jwtDecode.email, res)
        let player1 = await findPlayer1Service(gameName, jwtDecode.email, res)
        let player2 = await findPlayer2Service(gameName, jwtDecode.email, res)
        if (creator || player1 || player2) { next(); } else {
            statusMessage.getStatusMessage(CustomStatusCodes.UNAUTHORIZED, res, Messages400.Unauthorized);
        }
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};

/**
 * Controlla la validità di una mossa di gioco.
 * Verifica se la mossa è composta da indici numerici validi all'interno delle dimensioni della griglia di gioco.
 * Restituisce un errore 400 se la mossa non è valida o non è un numero.
 *
 * @param req - Oggetto della richiesta HTTP.
 * @param res - Oggetto della risposta HTTP.
 * @param next - Funzione di callback per passare alla prossima operazione.
 */
export const checkMove = async (req: Request, res: Response, next: NextFunction) => {
    const move = req.body.move
    const firstIndex = move[0];
    const secondIndex = move[1];
    const game = await findGameById(req.params.gameid);
    const gridSize = game[0].dataValues.grid_size;

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

/**
 * Controlla il formato delle navi specificate nella richiesta.
 * Verifica che la richiesta contenga un array di navi e che sia nel formato corretto.
 * Restituisce un errore 400 se il formato delle navi non è corretto.
 *
 * @param req - Oggetto della richiesta HTTP.
 * @param res - Oggetto della risposta HTTP.
 * @param next - Funzione di callback per passare alla prossima operazione.
 */
export const checkShipFormat = async (req: Request, res: Response, next: NextFunction) => {
    const ships = req.body.ships;
    if (req.body.ships && Array.isArray(req.body.ships)) {
        if (ships.length === 3) {
            if (ships[0].size1 !== undefined && ships[1].size2 !== undefined && ships[2].size3 !== undefined) {
                const size1 = parseInt(ships[0].size1)
                const size2 = parseInt(ships[1].size2)
                const size3 = parseInt(ships[2].size3)
                if (
                    Number.isInteger(size1) &&
                    Number.isInteger(size2) &&
                    Number.isInteger(size3) &&
                    size1 >= 0 && size1 <= 3 &&
                    size2 >= 0 && size2 <= 2 &&
                    size3 >= 0 && size3 <= 2
                ) {
                    next();
                } else {
                    statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.MalformedNumber);
                }
            } else {
                statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.MalformedSize);

            }
        } else {
            statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.MalformedFields);
        }
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.MalformedArray);
    }
};

/**
 * Controlla la dimensione della griglia di gioco specificata nella richiesta.
 * Verifica se la dimensione è un numero intero compreso tra 5 e 10.
 * Restituisce un errore 400 se la dimensione non è valida.
 *
 * @param req - Oggetto della richiesta HTTP.
 * @param res - Oggetto della risposta HTTP.
 * @param next - Funzione di callback per passare alla prossima operazione.
 */
export const checkGridSize = async (req: Request, res: Response, next: NextFunction) => {
    const gridSize = req.body.grid_size;

    if (!isNaN(gridSize) && Number.isInteger(gridSize)) {
        if (gridSize >= 5 || gridSize <= 10) {
            next();
        } else {
            statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.NotANumber);
        }
    } else {
        statusMessage.getStatusMessage(CustomStatusCodes.BAD_REQUEST, res, Messages400.OutOfBoundGrid);
    }
};