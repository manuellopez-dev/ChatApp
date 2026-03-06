const { Room, Message, User } = require('../models');

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: [{ model: User, as: 'creator', attributes: ['username', 'avatar'] }],
      order: [['created_at', 'ASC']],
    });
    return res.json(rooms);
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.createRoom = async (req, res) => {
  try {
    console.log('Usuario:', req.user);
    const { name, description } = req.body;

    const existing = await Room.findOne({ where: { name } });
    if (existing) return res.status(400).json({ message: 'Ya existe una sala con ese nombre.' });

    const room = await Room.create({ name, description, created_by: req.user.id });
    return res.status(201).json(room);
  } catch (error) {
    console.error('Error al crear sala:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.findAll({
      where: { room_id: roomId },
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }],
      order: [['created_at', 'ASC']],
      limit: 50,
    });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};