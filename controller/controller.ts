var express = require('express');
// import { Request, Response } from 'express';
// import { getErrorMessage } from '../utils/errors.util';
import * as service from '../services/jwt';
// import { CustomRequest } from '../middleware/auth';

export const login = (req: Request, res: Response) => {
    return service.generateJwt(express.req, express.res);
}