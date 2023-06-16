import { findUser } from "../db/queries/user_queries";
import { decodeJwt } from "../services/jwt_service";
import { StatusCodes } from "http-status-codes";


export const isAdmin = async (req: any, res: any, next: any) => {
    try {
        const jwtBearerToken = req.headers.authorization;
        const jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;

        if (jwtDecode && jwtDecode.email) {
            const user = await findUser(jwtDecode.email);
            if (user && user[0].dataValues.role) {
                req.user = user;
                next();
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};