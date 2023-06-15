// var express = require('express');
import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
// const { user } = require('../model/user.ts');
const { queries } = require('../user_query.ts');
const { isNewExpression } = require('typescript');
// var app = express();
import * as fs from "fs";


const PRIVATE_KEY = 'bitbattle'; //fs.readFileSync('./demos/private.key');

export async function generateJwt(req: Request, res: Response) {

    var user;
    if (req.body != null) {
        user = await queries.findUser(req.body.email, req.body.password);
    }
    if (user) {
        const payload = {
            email: user.email,
            password: user.password,
            user: user.id
        }
    }
    const jwtBearerToken = jwt.sign({
        email: user.email,
        password: user.password,
        user: user.id
    }, PRIVATE_KEY, {
        algorithm: 'RS256',
        // expiresIn: 120,
        subject: user.id
    });
    res.json({ jwt: jwtBearerToken });

    // else {
    //     // send status 401 Unauthorized
    //     res.sendStatus(401);
    // }
}
