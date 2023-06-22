import { user } from '../../model/user';

export async function updateUserTokensDb(tokens: number, email: any): Promise<any> {
    return await user.update({ tokens: tokens }, {
        where: {
            email: email
        }
    });
}