// import { generateJwt } from '../services/jwt';
import { generateJwt } from '../services/jwt_service';
import { getTokens, getGames } from '../services/user_service';
import { createUserService } from '../services/user_service'
// const express = require('express');

export const login = (req: any, res: any) => {
    return generateJwt(req, res);
};

export const getUserTokens = (req: any, res: any) => {
    return getTokens(req, res);
};

export const createUser = (req: any, res: any) => {
    return createUserService(req, res);
}

export const getTotalGames = (req: any, res: any) => {
    return getGames(req, res);
};

