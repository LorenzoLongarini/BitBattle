import { Response } from "express";
import { CustomStatusCodes } from './status_codes';

export interface MessageInterface {
    setStatus(res: Response, msg: string, errorType: CustomStatusCodes): Response;
}

