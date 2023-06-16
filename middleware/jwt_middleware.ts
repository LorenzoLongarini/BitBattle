import { StatusCodes } from "http-status-codes";
import { findUser } from "../db/queries/user_queries"
import { decodeJwt } from "../services/jwt_service"

export const checkEmailJwt = (req: any, res: any, next: any) => {
    const jwtBearerToken = req.headers.authorization;
    const jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;

    if (jwtDecode && jwtDecode.email) {
        console.log(jwtDecode.email);

        findUser(jwtDecode.email).then((user) => {
            req.user = user;
            next();
        });
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
    }
};
