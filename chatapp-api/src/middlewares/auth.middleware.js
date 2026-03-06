const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado.' });
    }
    const token   = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findByPk(decoded.id, {
      attributes: ['id', 'username', 'email', 'avatar']
    });
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado.' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};