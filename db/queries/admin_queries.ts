import { User } from '../../model/user';

export async function updateUserTokensDb(tokens: any, email: any): Promise<any> {
    return await User.update({ tokens: tokens }, {
        where: {
            email: email
        }
    });
}