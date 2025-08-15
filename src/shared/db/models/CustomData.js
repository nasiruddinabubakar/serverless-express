const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const CustomData = sequelize.define('CustomData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'custom_data',
  timestamps: true,
  underscored: true,
});

module.exports = CustomData;
