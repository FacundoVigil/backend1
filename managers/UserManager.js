import UserRepository from '../repositories/UserRepository.js';
import bcrypt from 'bcrypt';

const userRepo = new UserRepository();

export default class UserManager {
    async register(data) {
    data.password = bcrypt.hashSync(data.password, 10);
    return userRepo.create(data);
    }

    async login(email, password) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error('Usuario no encontrado');
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) throw new Error('Contraseña incorrecta');
    return user;
    }

    async recoverPassword(email) {
    return userRepo.findByEmail(email);
    }

    async updatePassword(userId, newHash) {
    return userRepo.updatePassword(userId, newHash);
    }

    async getById(id) {
    return userRepo.findById(id);
    }
}
