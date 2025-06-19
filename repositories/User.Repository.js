import { getDao } from '../data/daoFactory.js';
const UserDao = getDao('user');
export default class UserRepository {
    async create(data){ return UserDao.create(data); }
    async findById(id){ return UserDao.findById(id).lean(); }
    async findByEmail(email){ return UserDao.findOne({email}); }
    async updatePassword(id, hash){ return UserDao.findByIdAndUpdate(id,{password:hash}); }
}
