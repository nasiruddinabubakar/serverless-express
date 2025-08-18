const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const CustomDataField = sequelize.define('CustomDataField', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  field_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  length: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_required: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  key_field: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  filter: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  }
}, {
  tableName: 'custom_data_fields',
  timestamps: true,
  underscored: true,
});

module.exports = CustomDataField;
