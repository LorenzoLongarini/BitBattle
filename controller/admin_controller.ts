
import { updateUserTokensService } from '../services/admin_service';
// const express = require('express');

export const updateTokens = (req: any, res: any) => {
    return updateUserTokensService(req, res);
};