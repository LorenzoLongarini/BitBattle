import { User } from '../model/user';

export async function findUser(email: String, password: String): Promise<any> {
    try {
        return await User.findAll({
            where: {
                email: email,
                password: password
            }
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}