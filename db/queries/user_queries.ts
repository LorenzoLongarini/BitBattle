import { resolve } from 'path';
import { User } from '../../model/user';
import { game } from '../../model/game';

export async function findUser(req: any): Promise<any> {

    return await User.findAll({
        where: {
            email: req.body.email,
        }
    });

}

export async function createUserDb(req: any): Promise<any> {

    return await User.create({
        email: req.body.email,
        password: req.body.password,
        tokens: req.body.token,
        role: req.body.role,
        isplaying: req.body.isplaying
    });

}

export async function findGames(req: any): Promise<any> {

    return await game.findAll();

}