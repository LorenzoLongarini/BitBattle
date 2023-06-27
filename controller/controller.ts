import { generateJwtService } from '../services/jwt_service';
import { createUserService, getTokensService, createGameService, getAllUsersService } from '../services/user_service';
import { getGameInfoService, getGamesService } from '../services/games_service';
import { Request, Response } from "express";
import { getGamesPdfService } from '../services/pdf_service';
import { downloadMovesService, getClassificationService, getMovesService, getUserStatsService } from '../services/stats_service';
import { doMoveServiceGlobal } from '../services/move_service';

export const login = (req: Request, res: Response) => {
    return generateJwtService(req, res);
};

export const getUserTokens = (req: Request, res: Response) => {
    return getTokensService(req, res);
};

export const createUser = (req: Request, res: Response) => {
    return createUserService(req, res);
};

export const getAllUsers = (req: Request, res: Response) => {
    return getAllUsersService(res);
};

export const getClassification = (req: Request, res: Response) => {
    return getClassificationService(req, res);
};

export const getAllGames = (req: Request, res: Response) => {
    return getGamesService(res);
};

export const createGame = (req: Request, res: Response) => {
    return createGameService(req, res);
};

export const insertMove = (req: Request, res: Response) => {
    return doMoveServiceGlobal(req, res);
};

export const getGameInfo = (req: Request, res: Response) => {
    return getGameInfoService(req, res);
};

export const getGamePdf = (req: Request, res: Response) => {
    return getGamesPdfService(req, res);
};

export const getStats = (req: Request, res: Response) => {
    return getUserStatsService(req, res);
}

export const getMoves = (req: Request, res: Response) => {
    return getMovesService(req, res);
};

export const downloadMoves = (req: Request, res: Response) => {
    return downloadMovesService(req, res);
};

