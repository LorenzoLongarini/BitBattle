import { Response } from "express";

export interface MessageInterface {
    setStatus(res: Response, msg: string): any;
}

