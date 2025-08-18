'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('custom_data_rows', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      custom_data_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'custom_data',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      row_data: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('custom_data_rows');
  },
};
