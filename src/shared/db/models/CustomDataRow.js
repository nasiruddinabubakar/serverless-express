const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const CustomDataRow = sequelize.define('CustomDataRow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  custom_data_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'custom_data',
      key: 'id',
    },
  },
  row_data: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
}, {
  tableName: 'custom_data_rows',
  timestamps: true,
  underscored: true,
});

module.exports = CustomDataRow;
