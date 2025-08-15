const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const CustomDataValue = sequelize.define('CustomDataValue', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  uuid: {
    type: DataTypes.UUID,
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
  custom_field_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'custom_data_fields',
      key: 'id',
    },
  }
}, {
  tableName: 'custom_data_values',
  timestamps: true,
  underscored: true,
});

module.exports = CustomDataValue;
