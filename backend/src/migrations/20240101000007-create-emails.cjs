'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emails', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      messageId: {
        type: Sequelize.STRING,
        unique: true,
      },
      threadId: {
        type: Sequelize.STRING,
      },
      from: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      to: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      cc: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      bcc: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      subject: {
        type: Sequelize.STRING,
      },
      body: {
        type: Sequelize.TEXT,
      },
      htmlBody: {
        type: Sequelize.TEXT,
      },
      direction: {
        type: Sequelize.ENUM('inbound', 'outbound'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('draft', 'sent', 'received', 'failed'),
        defaultValue: 'received',
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
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      attachments: {
        type: Sequelize.JSON,
      },
      opened: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      openedAt: {
        type: Sequelize.DATE,
      },
      clicked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      sentAt: {
        type: Sequelize.DATE,
      },
      receivedAt: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('emails');
  },
};
