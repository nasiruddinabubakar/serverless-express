const { sequelize } = require('../config');

// Import all models
const User = require('./User');
const CustomData = require('./CustomData');
const CustomDataField = require('./CustomDataField');
const CustomDataValue = require('./CustomDataValue');

// Define associations
CustomData.hasMany(CustomDataField, {
  foreignKey: 'custom_data_id',
  as: 'fields',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

CustomDataField.belongsTo(CustomData, {
  foreignKey: 'custom_data_id',
  as: 'customData'
});

CustomData.hasMany(CustomDataValue, {
  foreignKey: 'custom_data_id',
  as: 'values',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

CustomDataValue.belongsTo(CustomData, {
  foreignKey: 'custom_data_id',
  as: 'customData'
});

CustomDataField.hasMany(CustomDataValue, {
  foreignKey: 'custom_field_id',
  as: 'values',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

CustomDataValue.belongsTo(CustomDataField, {
  foreignKey: 'custom_field_id',
  as: 'customField'
});

module.exports = {
  sequelize,
  User,
  CustomData,
  CustomDataField,
  CustomDataValue
};
