// import { generateJwt } from '../services/jwt';
import { generateJwt } from '../services/jwt';
import {createUserService} from '../services/user_info'
// const express = require('express');

export const login = (req: any, res: any) => {
    return generateJwt(req, res);
};

export const createUser = (req:any, res:any) => {
    return createUserService(req,res);
}