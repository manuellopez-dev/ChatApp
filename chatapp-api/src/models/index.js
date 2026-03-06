const User    = require('./user');
const Room    = require('./room');
const Message = require('./message');

User.hasMany(Message,    { foreignKey: 'user_id', as: 'messages' });
Message.belongsTo(User,  { foreignKey: 'user_id', as: 'user' });

Room.hasMany(Message,    { foreignKey: 'room_id', as: 'messages' });
Message.belongsTo(Room,  { foreignKey: 'room_id', as: 'room' });

User.hasMany(Room,       { foreignKey: 'created_by', as: 'rooms' });
Room.belongsTo(User,     { foreignKey: 'created_by', as: 'creator' });

module.exports = { User, Room, Message };