import { generateJwtService } from '../services/jwt_service';
import { createUserService, getTokensService, createGameService, getAllUsersService } from '../services/user_service';
import { getGamesService, statusService, turnService } from '../services/games_service';
import { doMoveAIService } from '../services/ai_mode_service';
import { Request, Response } from "express";
import { doMoveService } from '../services/single_mode_service';
import { getGamesPdfService } from '../services/pdf_service';
import { getClassificationService, getUserStatsService } from '../services/stats_service';
import { doMoveMultiplayerService } from '../services/multiplayer_service';
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

export const insertMoveMultiplayer = (req: Request, res: Response) => {
    return doMoveMultiplayerService(req, res);
}

export const insertMoveSingle = (req: Request, res: Response) => {
    return doMoveService(req, res);
};

export const insertMoveAi = (req: Request, res: Response) => {
    return doMoveAIService(req, res);
};

export const insertMove = (req: Request, res: Response) => {
    return doMoveServiceGlobal(req, res);
};

export const getStatus = (req: Request, res: Response) => {
    return statusService(req, res);
};


export const getGamePdf = (req: Request, res: Response) => {
    return getGamesPdfService(req, res);
};

export const getStats = (req: Request, res: Response) => {
    return getUserStatsService(req, res);
}

export const getTurn = (req: Request, res: Response) => {
    return turnService(req, res);
};

