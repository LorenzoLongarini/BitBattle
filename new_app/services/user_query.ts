import { User } from '../model/user';

export default async function findUser(email: String, password: String): Promise<Object> {
    return await User.findAll({
        where: {
            email: email,
            password: password
        }
    });
}