// Simple database service for backward compatibility
// Individual repositories should import models directly
const { User, CustomData, CustomDataField, CustomDataValue } = require('./models');

module.exports = {
  User,
  CustomData,
  CustomDataField,
  CustomDataValue
};
