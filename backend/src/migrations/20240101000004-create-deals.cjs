'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('deals', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      value: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'UAH',
      },
      stage: {
        type: Sequelize.ENUM(
          'qualification',
          'proposal',
          'negotiation',
          'closing',
          'won',
          'lost'
        ),
        defaultValue: 'qualification',
      },
      probability: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      expectedCloseDate: {
        type: Sequelize.DATE,
      },
      actualCloseDate: {
        type: Sequelize.DATE,
      },
      contactId: {
        type: Sequelize.UUID,
        references: {
          model: 'contacts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      companyId: {
        type: Sequelize.UUID,
        references: {
          model: 'companies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      ownerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      description: {
        type: Sequelize.TEXT,
      },
      lostReason: {
        type: Sequelize.STRING,
      },
      customFields: {
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
    await queryInterface.dropTable('deals');
  },
};
