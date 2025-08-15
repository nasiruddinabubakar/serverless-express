const { Sequelize } = require('sequelize');
const path = require('path');

// Load config.json
const configPath = path.resolve(__dirname, 'config', 'config.json');
const configs = require(configPath);

// Determine current environment
const env = process.env.NODE_ENV || 'development';
const currentConfig = configs[env];

// Create Sequelize instance using the config.json values
const sequelize = new Sequelize(
  currentConfig.database,
  currentConfig.username,
  currentConfig.password,
  currentConfig
);

module.exports = currentConfig;
module.exports.sequelize = sequelize;
