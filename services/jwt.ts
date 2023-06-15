var jwt = require('jsonwebtoken');
import findUser from './user_query';
// var express = require('express');
// import { Request, Response } from 'express';
// const { user } = require('./model/user.ts');
// const { isNewExpression } = require('typescript');
// var app = express();
// import * as fs from "fs";


const PRIVATE_KEY = 'bitbattle'; //fs.readFileSync('./demos/private.key');

export async function generateJwt(req: any, res: any) {
    try {
        const user: any = await findUser(req.body.email, req.body.password);

        if (user) {
            console.log(user);
            const payload = {
                email: user.email,
                password: user.password,
                user: user.id
            };

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
        }
        else {
            // send status 401 Unauthorized
            res.sendStatus(401);
        }
    } catch (error) {
        res.json({ error: error });
    }
}
