import { updateUserTokensService } from '../services/admin_service';

export const updateTokens = (req: any, res: any) => {
    return updateUserTokensService(req, res);
};