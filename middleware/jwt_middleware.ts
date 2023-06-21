import { StatusCodes } from "http-status-codes";
import { decodeJwt } from "../services/jwt_service"
import { Request, Response, NextFunction } from "express";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const jwtBearerToken = req.headers.authorization;
    const jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;

    if (jwtDecode && jwtDecode.email) {
        next();
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
    }
};
