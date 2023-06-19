// import { generateJwt } from '../services/jwt';
import { generateJwtService } from '../services/jwt_service';
import { getTokensService } from '../services/user_service';
import { createUserService, getGames } from '../services/user_service'
// const express = require('express');

export const login = (req: any, res: any) => {
    return generateJwtService(req, res);
};

export const getUserTokens = (req: any, res: any) => {
    return getTokensService(req, res);
};

export const createUser = (req: any, res: any) => {
    return createUserService(req, res);
}

export const getTotalGames = (req: any, res: any) => {
    return getGames(req, res);
};

