// import { generateJwt } from '../services/jwt';
import { generateJwtService } from '../services/jwt_service';
import { createUserService, getTokensService, createGameService } from '../services/user_service';
import { getGamesService, doMoveService} from '../services/games_service';

export const login = (req: any, res: any) => {
    return generateJwtService(req, res);
};

export const getUserTokens = (req: any, res: any) => {
    return getTokensService(req, res);
};

export const createUser = (req: any, res: any) => {
    return createUserService(req, res);
}

export const getAllGames = (req: any, res: any) => {
    return getGamesService(req, res);
};

export const createGame = (req: any, res: any) => {
    return createGameService(req, res);
};

export const insertMove = (req: any, res: any) => {
    return doMoveService(req, res);
};




