import { resolve } from 'path';
import { User } from '../../model/user';

export async function findUser(email: any): Promise<any> {

    return await User.findAll({
        where: {
            email: email,
        }
    });

}

export async function createUserDb(req: any): Promise<any> {

    return await User.create({
        email: req.body.email,
        password: req.body.password,
        tokens: req.body.token,
        isadmin: req.body.isadmin,
        isplaying: req.body.isplaying
    });

}

