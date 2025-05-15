import mongoose from 'mongoose';

export function validateObjectId(req, res, next) {
  const { cid, pid } = req.params;

  if (cid && !mongoose.Types.ObjectId.isValid(cid)) {
    return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
  }
  if (pid && !mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ status: 'error', message: 'ID de producto inválido' });
  }

  next();
}
