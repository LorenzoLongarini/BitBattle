import { user } from '../../model/user';

export async function updateUserTokensDb(tokens: any, email: any): Promise<any> {
    return await user.update({ tokens: tokens }, {
        where: {
            email: email
        }
    });
}