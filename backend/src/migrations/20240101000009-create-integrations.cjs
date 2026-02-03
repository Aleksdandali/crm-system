'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('integrations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('1c', 'shine_shop', 'other'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'error'),
        defaultValue: 'inactive',
      },
      configuration: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      lastSync: {
        type: Sequelize.DATE,
      },
      lastError: {
        type: Sequelize.TEXT,
      },
      syncLog: {
        type: Sequelize.JSON,
      },
      metadata: {
        type: Sequelize.JSON,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('integrations');
  },
};
