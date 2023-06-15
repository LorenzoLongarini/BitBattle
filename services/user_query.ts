const { user } = require('../model/user.ts');

export const findUser = async (email: String, password: String) => {
    return await user.findAll({
        where: {
            email: email,
            password: password
        }
    });
}