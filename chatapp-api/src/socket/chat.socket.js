const jwt     = require('jsonwebtoken');
const { User, Message } = require('../models');

module.exports = (io) => {

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Token no proporcionado'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user    = await User.findByPk(decoded.id, {
        attributes: ['id', 'username', 'avatar']
      });
      if (!user) return next(new Error('Usuario no encontrado'));

      socket.user = user;
      next();
    } catch {
      next(new Error('Token inválido'));
    }
  });

  const onlineUsers = new Map();

  io.on('connection', async (socket) => {
    const user = socket.user;
    console.log(`✅ Conectado: ${user.username} (${socket.id})`);

    const userInfo = { id: user.id, username: user.username, avatar: user.avatar };
    onlineUsers.set(user.id, userInfo);
    await User.update({ is_online: true }, { where: { id: user.id } });
    io.emit('users:online', Array.from(onlineUsers.values()));

    socket.on('room:join', (roomId) => {
      socket.join(`room:${roomId}`);
      console.log(`🚪 ${user.username} se unió a room:${roomId}`);
      socket.to(`room:${roomId}`).emit('room:user_joined', {
        user: { id: user.id, username: user.username, avatar: user.avatar },
        roomId,
      });
    });

    socket.on('room:leave', (roomId) => {
      socket.leave(`room:${roomId}`);
      socket.to(`room:${roomId}`).emit('room:user_left', {
        user: { id: user.id, username: user.username },
        roomId,
      });
    });

    socket.on('message:send', async ({ roomId, content }) => {
      console.log(`📨 mensaje de ${user.username} en sala ${roomId}: ${content}`);
      const room = io.sockets.adapter.rooms.get(`room:${roomId}`);
      console.log(`👥 sockets en sala room:${roomId}:`, room ? Array.from(room) : 'VACÍA');

      if (!content?.trim() || !roomId) return;

      try {
        const message = await Message.create({
          content: content.trim(),
          room_id: roomId,
          user_id: user.id,
        });

        const payload = {
          id:         message.id,
          content:    message.content,
          room_id:    roomId,
          created_at: message.created_at,
          user: {
            id:       user.id,
            username: user.username,
            avatar:   user.avatar,
          }
        };

        io.to(`room:${roomId}`).emit('message:received', payload);
      } catch (error) {
        console.error('Error al guardar mensaje:', error);
      }
    });

    socket.on('typing:start', ({ roomId }) => {
      socket.to(`room:${roomId}`).emit('typing:update', {
        user: { id: user.id, username: user.username },
        isTyping: true,
        roomId,
      });
    });

    socket.on('typing:stop', ({ roomId }) => {
      socket.to(`room:${roomId}`).emit('typing:update', {
        user: { id: user.id, username: user.username },
        isTyping: false,
        roomId,
      });
    });

    socket.on('disconnect', async () => {
      console.log(`❌ Desconectado: ${user.username}`);
      onlineUsers.delete(user.id);
      await User.update({ is_online: false }, { where: { id: user.id } });
      io.emit('users:online', Array.from(onlineUsers.values()));
    });
  });
};