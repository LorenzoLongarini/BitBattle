// import { generateJwt } from '../services/jwt';
import { generateJwtService } from '../services/jwt_service';
import { createUserService, getTokensService, createGameService, getAllUsersService, getClassificationService } from '../services/user_service';
import { getGamesService, statusService, doMoveMultiplayerService } from '../services/games_service';
import { doMoveAIService } from '../services/ai_mode_service';
import { Request, Response } from "express";
import { doMoveService } from '../services/single_mode_service';

export const login = (req: Request, res: Response) => {
    return generateJwtService(req, res);
};

export const getUserTokens = (req: Request, res: Response) => {
    return getTokensService(req, res);
};

export const createUser = (req: Request, res: Response) => {
    return createUserService(req, res);
}
export const getAllUsers = (req: Request, res: Response) => {
    return getAllUsersService(req, res);
};
export const getClassification = (req: Request, res: Response) => {
    return getClassificationService(req, res);
};

export const getAllGames = (req: Request, res: Response) => {
    return getGamesService(req, res);
};

export const createGame = (req: Request, res: Response) => {
    return createGameService(req, res);
};

export const insertMoveMultiplayer = (req: any, res: any) => {
    return doMoveMultiplayerService(req, res);
}

export const insertMoveSingle = (req: any, res: any) => {
    return doMoveService(req, res);
};

export const insertMoveAi = (req: any, res: any) => {
    return doMoveAIService(req, res);
};

export const getStatus = (req: any, res: any) => {
    return statusService(req, res);
};




