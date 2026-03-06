# ChatApp 💬

Aplicación de mensajería en tiempo real desarrollada con Angular 16, Node.js y Socket.io como proyecto de portafolio full-stack.

![Angular](https://img.shields.io/badge/Angular-16-DD0031?style=flat&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![Socket.io](https://img.shields.io/badge/Socket.io-4.0-010101?style=flat&logo=socket.io)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens)

---

## Funcionalidades

- 🔐 Registro y login con JWT
- 💬 Mensajería en tiempo real con Socket.io
- 🏠 Salas de chat — crea y únete a múltiples salas
- ✍️ Indicador de "escribiendo..." en tiempo real
- 🟢 Lista de usuarios conectados en tiempo real
- 😊 Avatares emoji personalizables al registrarse
- 📜 Historial de mensajes persistente en MySQL
- 📱 Diseño responsive con tema oscuro

---

## Demo

| Login | Chat |
|-------|------|
| Registro con avatar emoji | Mensajes en tiempo real entre usuarios |

---

## Arquitectura

```
Angular (client) ←──── Socket.io ────→ Node.js/Express (chatapp-api)
                  ←──── REST API ────→          │
                                                 └──→ MySQL
```

- El frontend se conecta al backend por HTTP para auth y carga de datos
- Socket.io maneja toda la comunicación en tiempo real
- JWT autentica tanto las peticiones HTTP como las conexiones de socket

---

## Instalación

### Backend

```bash
cd chatapp-api
npm install
cp .env.example .env
# Configurar credenciales de BD y JWT
npm run dev
```

Al arrancar correctamente:
```
✅  Base de datos conectada
✅  Servidor corriendo en puerto 3002
✅  Socket.io listo
```

### Base de datos

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(10) DEFAULT '😊',
  is_online BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  room_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Frontend

```bash
cd client
npm install
ng serve
# Abrir http://localhost:4200
```

### Variables de entorno

```env
PORT=3002
DB_HOST=tu_host
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=chat_app
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES=1d
FRONTEND_URL=http://localhost:4200
```

---

## Estructura del proyecto

```
ChatApp/
├── chatapp-api/
│   └── src/
│       ├── config/        # database.js
│       ├── controllers/   # auth, room
│       ├── middlewares/   # auth, validate
│       ├── models/        # user, room, message
│       ├── routes/        # auth, room
│       └── socket/        # chat.socket.js (Socket.io events)
└── client/
    └── src/app/
        ├── core/          # guards, interceptors, services
        └── features/
            ├── auth/      # login, register
            └── chat/      # chat-home, message-input
```

---

## Eventos Socket.io

| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `room:join` | cliente → servidor | Unirse a una sala |
| `room:leave` | cliente → servidor | Salir de una sala |
| `message:send` | cliente → servidor | Enviar mensaje |
| `message:received` | servidor → cliente | Nuevo mensaje en sala |
| `typing:start` | cliente → servidor | Empezar a escribir |
| `typing:stop` | cliente → servidor | Dejar de escribir |
| `typing:update` | servidor → cliente | Estado de escritura de usuario |
| `users:online` | servidor → cliente | Lista de usuarios conectados |

---

## Stack

- **Frontend**: Angular 16, Angular Material, CSS3, Socket.io-client
- **Backend**: Node.js, Express, Socket.io, Sequelize ORM
- **Base de datos**: MySQL 8
- **Auth**: JWT + bcrypt
- **Tiempo real**: Socket.io con rooms y eventos personalizados

---

## Licencia

Proyecto de portafolio — uso libre para referencia y aprendizaje.
