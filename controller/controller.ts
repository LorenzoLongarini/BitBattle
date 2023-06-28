import { generateJwtService } from '../services/jwt_service';
import { createUserService, getTokensService, createGameService, getAllUsersService } from '../services/user_service';
import { getGameInfoService, getGamesService } from '../services/games_service';
import { Request, Response } from "express";
import { getGamesPdfService } from '../services/pdf_service';
import { downloadMovesService, getClassificationService, getMovesService, getUserStatsService } from '../services/stats_service';
import { doMoveServiceGlobal } from '../services/move_service';

/**
 * Gestisce la richiesta di login dell'utente.
 * Richiama il servizio generateJwtService per generare il token JWT.
 *
 * @param req - Oggetto della richiesta.
 * @param res - Oggetto della risposta.
 * @returns
 */
export const login = (req: Request, res: Response) => {
    return generateJwtService(req, res);
};

/**
 * Ottiene i token dell'utente.
 * Richiama il servizio getTokensService per ottenere i token dell'utente.
 *
 * @param req - Oggetto della richiesta.
 * @param res - Oggetto della risposta.
 * @returns
 */
export const getUserTokens = (req: Request, res: Response) => {
    return getTokensService(req, res);
};

/**
 * Crea un nuovo utente.
 * Richiama il servizio createUserService per creare un nuovo utente.
 *
 * @param req - Oggetto della richiesta.
 * @param res - Oggetto della risposta.
 * @returns
 */
export const createUser = (req: Request, res: Response) => {
    return createUserService(req, res);
};

/**
 * Ottiene tutti gli utenti.
 * Richiama il servizio getAllUsersService per ottenere tutti gli utenti registrati.
 *
 * @param req - Oggetto della richiesta.
 * @param res - Oggetto della risposta.
 * @returns
 */
export const getAllUsers = (req: Request, res: Response) => {
    return getAllUsersService(res);
};

/**
 * Ottiene la classifica degli utenti.
 * Richiama il servizio getClassificationService per ottenere la classifica degli utenti.
 *
 * @param req - Oggetto della richiesta.
 * @param res - Oggetto della risposta.
 * @returns
 */
export const getClassification = (req: Request, res: Response) => {
    return getClassificationService(req, res);
};

/**
 * Ottiene tutti i games.
 * Richiama il servizio getGamesService per ottenere tutti i games registrati.
 *
 * @param req - Oggetto della richiesta.
 * @param res - Oggetto della risposta.
 * @returns
 */
export const getAllGames = (req: Request, res: Response) => {
    return getGamesService(res);
};

/**
 * Crea un nuovo game.
 * Richiama il servizio createGameService per creare un nuovo game.
 *
 * @param req - Oggetto della richiesta.
 * @param res - Oggetto della risposta.
 * @returns
 */
export const createGame = (req: Request, res: Response) => {
    return createGameService(req, res);
};

/**
 * Inserisce una mossa in un game.
 * Richiama il servizio doMoveServiceGlobal per inserire una mossa in un game.
 *
 * @param req - Oggetto della richiesta.
 * @param res - Oggetto della risposta.
 * @returns
 */
export const insertMove = (req: Request, res: Response) => {
    return doMoveServiceGlobal(req, res);
};

/**
 * Ottiene le informazioni di un game.
 * Richiama il servizio getGameInfoService per ottenere le informazioni di un game.
 *
 * @param req - Oggetto della richiesta.
 * @param res - Oggetto della risposta.
 * @returns 
 */
export const getGameInfo = (req: Request, res: Response) => {
    return getGameInfoService(req, res);
};

/**
 * Ottiene il PDF delle statistiche di un utente.
 * Richiama il servizio getGamesPdfService per ottenere il PDF dei delle statistiche di un utente.
 *
 * @param req - Oggetto della richiesta.
 * @param res - Oggetto della risposta.
 * @returns 
 */
export const getGamePdf = (req: Request, res: Response) => {
    return getGamesPdfService(req, res);
};

/**
 * Ottiene le statistiche di un utente.
 * Richiama il servizio getUserStatsService per ottenere le statistiche di un utente.
 *
 * @param req - Oggetto della richiesta.
 * @param res - Oggetto della risposta.
 * @returns 
 */
export const getStats = (req: Request, res: Response) => {
    return getUserStatsService(req, res);
};

/**
 * Ottiene lo storico delle mosse di un gioco.
 * Richiama il servizio getMovesService per ottenere le mosse di un gioco.
 *
 * @param req - Oggetto della richiesta.
 * @param res - Oggetto della risposta.
 * @returns 
 */
export const getMoves = (req: Request, res: Response) => {
    return getMovesService(req, res);
};

/**
 * Scarica le mosse di un gioco in formato JSON.
 * Richiama il servizio downloadMovesService per scaricare le mosse di un gioco.
 *
 * @param req - Oggetto della richiesta.
 * @param res - Oggetto della risposta.
 * @returns
 */
export const downloadMoves = (req: Request, res: Response) => {
    return downloadMovesService(req, res);
};

