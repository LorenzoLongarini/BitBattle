import { updateUserTokensDb } from '../db/queries/admin_queries';
import { findUser } from '../db/queries/user_queries';
import { CustomStatusCodes, Messages400, Messages500 } from '../status/status_codes';
import { MessageFactory } from '../status/messages_factory';

var statusMessage: MessageFactory = new MessageFactory();

export async function updateUserTokensService(req: any, res: any) {
    try {
        const user: any = await findUser(req.body.email);

        const tokens = req.body.tokens;

        if (user.length != 0) {
            await updateUserTokensDb(req.body.tokens, req.body.email);
            let message = JSON.parse(JSON.stringify({ tokens: tokens }));
            statusMessage.getStatusMessage(CustomStatusCodes.OK, res, message);

        } else {
            statusMessage.getStatusMessage(CustomStatusCodes.NOT_FOUND, res, Messages400.UserNotFound);
        }

    } catch (e) {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);

    }
}