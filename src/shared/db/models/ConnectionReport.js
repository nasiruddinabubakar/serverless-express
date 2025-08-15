const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const ConnectionReport = sequelize.define('ConnectionReport', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  connection_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  report_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  report_name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'connection_reports',
  timestamps: true,
  underscored: true,
});

module.exports = ConnectionReport;
