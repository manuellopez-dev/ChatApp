const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    const existingEmail    = await User.findOne({ where: { email } });
    if (existingEmail) return res.status(400).json({ message: 'El email ya está registrado.' });

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hash, avatar: avatar || '😊' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

    return res.status(201).json({
      token,
      user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar }
    });
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciales incorrectas.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Credenciales incorrectas.' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

    return res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.me = async (req, res) => {
  return res.json(req.user);
};