'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('connection_reports', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      connection_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'connections', // table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // delete reports if connection is removed
      },
      report_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      report_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Optional indexes for performance
    await queryInterface.addIndex('connection_reports', ['connection_id']);
    await queryInterface.addIndex('connection_reports', ['report_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('connection_reports');
  }
};
