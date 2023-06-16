// import { generateJwt } from '../services/jwt';
import { generateJwt } from '../services/jwt_service';
import { getTokens } from '../services/user_service';
import { createUserService } from '../services/user_service'
// const express = require('express');

export const login = (req: any, res: any) => {
    return generateJwt(req, res);
};

export const getUserTokens = (req: any, res: any) => {
    return getTokens(req, res);
};

// export const updateCredits = (req: any, res: any) => {
//     let user = await findUser(req.body.email)
//     updateUserCredits(req.body.credits, user[0].dataValues.id)
//         .then(() => res.status(StatusCodes.OK).json(Utils.getReasonPhrase(StatusCodes.OK, successMsg.UPDATE_CREDITS)))
//         .catch((err) => res.status(StatusCodes.BAD_REQUEST).json(Utils.getReasonPhrase(StatusCodes.BAD_REQUEST, exceptionMsg.ERR_UPDATE_CREDITS + err)))

// }


export const createUser = (req: any, res: any) => {
    return createUserService(req, res);
}
