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

export async function findAllUsers(): Promise<any> {

    return await user.findAll();

}

export async function createUserDb(req: any): Promise<any> {

    return await user.create({
        email: req.body.email,
        password: req.body.password,
        tokens: 10,
        isadmin: false,
        isplaying: false,
        points: 0,
    });

}

export async function setIsPlayingDb(email: string): Promise<any> {
    return await user.update({ isplaying: true }, {
        where: {
            email: email
        }
    });
}
export async function setIsNotPlayingDb(email: string): Promise<any> {
    return await user.update({ isplaying: false }, {
        where: {
            email: email
        }
    });
}


export async function createGameDb(req: Request, possibleMoves: any[], mod: string, player: string): Promise<any> {

    return await game.create({
        name: req.body.name,
        mod: mod,
        grid_size: req.body.grid_size,
        ships: req.body.ships,
        possible_moves: possibleMoves,
        moves: [],
        status: "started",
        result: [],
        player0: player,
        player1: req.body.player1,
        player2: req.body.player2,
        score: []
    });
}


export async function updateUserStatus(status: boolean, email: string): Promise<any> {
    return await user.update({ isplaying: status }, {
        where: {
            email: email
        }
    });
}

export async function updateUserPoints(points: number, email: string): Promise<any> {
    return await user.update({ points: points }, {
        where: {
            email: email
        }
    });
}
