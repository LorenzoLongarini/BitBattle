import { User } from '../model/user';

export async function findUser(email: any): Promise<any> {
    try {
        return await User.findAll({
            where: {
                email: email,
            }
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}