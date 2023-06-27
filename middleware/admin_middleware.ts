import { findUser } from "../db/queries/user_queries";
import { decodeJwt } from "../services/jwt_service";
import { MessageFactory } from "../status/messages_factory";
import { CustomStatusCodes, Messages400, Messages500 } from "../status/status_codes";

var statusMessage: MessageFactory = new MessageFactory();

export const checkIsAdmin = async (req: any, res: any, next: any) => {
    try {
        const jwtBearerToken = req.headers.authorization;
        const jwtDecode = jwtBearerToken != null ? decodeJwt(jwtBearerToken) : null;

        if (jwtDecode != null) {
            const user = await findUser(jwtDecode.email);
            if (user.length != 0 && user[0].dataValues.isadmin) {
                next();
            } else {
                statusMessage.getStatusMessage(CustomStatusCodes.UNAUTHORIZED, res, Messages400.Unauthorized);
            }
        } else {
            statusMessage.getStatusMessage(CustomStatusCodes.UNAUTHORIZED, res, Messages400.Unauthorized);
        }
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};