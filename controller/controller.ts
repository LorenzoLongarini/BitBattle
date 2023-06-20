// import { generateJwt } from '../services/jwt';
import { generateJwtService } from '../services/jwt_service';
import { createUserService, getTokensService, createGameService } from '../services/user_service';
import { getGamesService } from '../services/games_service';
import { Request, Response } from "express";

export const login = (req: Request, res: Response) => {
    return generateJwtService(req, res);
};

export const getUserTokens = (req: Request, res: Response) => {
    return getTokensService(req, res);
};

export const createUser = (req: Request, res: Response) => {
    return createUserService(req, res);
}

export const getAllGames = (req: Request, res: Response) => {
    return getGamesService(req, res);
};

export const createGame = (req: Request, res: Response) => {
    return createGameService(req, res);
};

