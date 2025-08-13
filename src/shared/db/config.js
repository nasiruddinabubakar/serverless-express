const { Sequelize } = require('sequelize');
require('dotenv').config();

// Sequelize CLI configuration
const config = {
  development: {
    username: process.env.DB_USER || 'local',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'comp360-sc',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USER || 'local',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'comp360-sc',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: process.env.DB_USER || 'local',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'comp360-sc',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

// Create sequelize instance for the current environment
const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

module.exports = config;
module.exports.sequelize = sequelize;
