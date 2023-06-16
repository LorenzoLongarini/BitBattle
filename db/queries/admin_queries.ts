import { User } from '../../model/user';

export async function updateUserTokensDb(req: any): Promise<any> {
    return await User.update({ tokens: req.body.tokens }, {
        where: {
            email: req.body.email
        }
    });
}