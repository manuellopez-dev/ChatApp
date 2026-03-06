require('dotenv').config();

const express    = require('express');
const http       = require('http');
const cors       = require('cors');
const { Server } = require('socket.io');
const sequelize  = require('./src/config/database');
const chatSocket = require('./src/socket/chat.socket');

const authRoutes = require('./src/routes/authroutes');
const roomRoutes = require('./src/routes/roomroutes');

const app    = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:  process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
  }
});

// ── Middlewares ───────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// ── Rutas HTTP ────────────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ── Socket.io ─────────────────────────────────────────────────
chatSocket(io);

// ── Base de datos + Servidor ──────────────────────────────────
const PORT = process.env.PORT || 3002;

sequelize.authenticate()
  .then(() => {
    console.log('Base de datos conectada');
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`Socket.io listo`);
    });
  })
  .catch(err => console.error('Error al conectar BD:', err));