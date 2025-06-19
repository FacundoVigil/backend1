import { getDao } from '../data/daoFactory.js';
const ProdDao = getDao('product');
export default class ProductRepository {
    async create(data){ return ProdDao.create(data); }
    async findAll(filter, opts){ return ProdDao.find(filter, null, opts).lean(); }
    async update(id, data){ return ProdDao.findByIdAndUpdate(id, data); }
    async delete(id){ return ProdDao.findByIdAndDelete(id); }
}
