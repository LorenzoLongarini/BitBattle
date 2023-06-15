// import { generateJwt } from '../services/jwt';
import { generateJwt } from '../services/jwt';
// const express = require('express');

export const login = (req: any, res: any) => {
    return generateJwt(req, res);
};