import { User } from '../model/user';

export async function findUser(req: any): Promise<any> {

    return await User.findAll({
        where: {
            email: req.body.email,
        }
    });

}

// export async function createUser(req: any): Promise<any> {

//     return await User.create({
//         email: req.body.email,
//         password: req.body.password,

//     });

// }

export async function updateUserTokensDb(req: any): Promise<any> {
    return await User.update({ tokens: req.body.tokens }, {
        where: {
            email: req.body.email
        }
    });
}

