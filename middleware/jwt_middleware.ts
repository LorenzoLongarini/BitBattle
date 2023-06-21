import { StatusCodes } from "http-status-codes";
// import { findUser } from "../db/queries/user_queries"
import { decodeJwt } from "../services/jwt_service"
import { Request, Response, NextFunction } from "express";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const jwtBearerToken = req.headers.authorization;
    const jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;

    if (jwtDecode && jwtDecode.email) {
        // findUser(jwtDecode.email).then((user) => {
        //     req.body.user = user;
        next();
        // });
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
    }
};
