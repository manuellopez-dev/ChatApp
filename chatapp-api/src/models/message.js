const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Message = sequelize.define('Message', {
    id:         { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    content:    { type: DataTypes.TEXT, allowNull: false },
    room_id:    { type: DataTypes.INTEGER, allowNull: false },
    user_id:    { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

module.exports = Message;
