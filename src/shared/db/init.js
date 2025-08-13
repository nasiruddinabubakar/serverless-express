const { sequelize, User, CustomData, CustomDataField, CustomDataValue } = require('./models');

const initializeDatabase = async () => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models with the database
    // In production, you should use migrations instead of sync
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully.');

    return true;
  } catch (error) {
    console.error('Unable to connect to the database or sync models:', error);
    throw error;
  }
};

const closeDatabase = async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed successfully.');
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
};

module.exports = {
  initializeDatabase,
  closeDatabase,
  sequelize
};
