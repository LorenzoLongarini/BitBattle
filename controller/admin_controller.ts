
import { updateUserTokensService } from '../services/admin_query';
// const express = require('express');

export const updateTokens = (req: any, res: any) => {
    return updateUserTokensService(req, res);
};