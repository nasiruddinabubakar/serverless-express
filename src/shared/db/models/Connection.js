const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Connection = sequelize.define('Connection', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  organization_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  organization_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instance_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  access_token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  token_expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  config: {
    type: DataTypes.JSON,
    allowNull: true,
  }
}, {
  tableName: 'connections',
  timestamps: true,
  underscored: true,
});

module.exports = Connection;
