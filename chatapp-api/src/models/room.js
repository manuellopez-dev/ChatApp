const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Room = sequelize.define('Room', {
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name:        { type: DataTypes.STRING(100), allowNull: false, unique: true },
  description: { type: DataTypes.STRING(255) },
  created_by:  { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName:  'rooms',
  timestamps: true,
  createdAt:  'created_at',
  updatedAt:  'updated_at',
});

module.exports = Room;