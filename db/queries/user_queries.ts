import { resolve } from 'path';
import { user } from '../../model/user';
import { game } from '../../model/game';
import { Request } from "express";

export async function findUser(email: any): Promise<any> {

    return await user.findAll({
        where: {
            email: email,
        }
    });

}

export async function createUserDb(req: any): Promise<any> {

    return await user.create({
        email: req.body.email,
        password: req.body.password,
        tokens: req.body.token,
        isadmin: req.body.isadmin,
        isplaying: req.body.isplaying
    });

}

export async function userIsPlayingDb(email: string): Promise<any> {
    return await user.update({ isplaying: true }, {
        where: {
            email: email
        }
    });
}
export async function userIsNotPlayingDb(email: string): Promise<any> {
    return await user.update({ isplaying: false }, {
        where: {
            email: email
        }
    });
}

export async function createGameDb(req: Request, possibleMoves: any[]): Promise<any> {

    return await game.create({
        name: req.body.name,
        mod: req.body.mod,
        grid_size: req.body.grid_size,
        ships: req.body.ships,
        possible_moves: possibleMoves,
        moves: '[]',
        status: "started",
        result: '[]',
        score: '[]'
    });
}



