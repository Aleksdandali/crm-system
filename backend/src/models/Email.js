import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Email = sequelize.define('Email', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    messageId: {
      type: DataTypes.STRING,
      unique: true,
    },
    threadId: {
      type: DataTypes.STRING,
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    to: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    cc: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    bcc: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    subject: {
      type: DataTypes.STRING,
    },
    body: {
      type: DataTypes.TEXT,
    },
    htmlBody: {
      type: DataTypes.TEXT,
    },
    direction: {
      type: DataTypes.ENUM('inbound', 'outbound'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'received', 'failed'),
      defaultValue: 'received',
    },
    contactId: {
      type: DataTypes.UUID,
      references: {
        model: 'contacts',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    attachments: {
      type: DataTypes.JSON,
    },
    opened: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    openedAt: {
      type: DataTypes.DATE,
    },
    clicked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sentAt: {
      type: DataTypes.DATE,
    },
    receivedAt: {
      type: DataTypes.DATE,
    },
  }, {
    timestamps: true,
    tableName: 'emails',
  });

  Email.associate = (models) => {
    Email.belongsTo(models.Contact, {
      foreignKey: 'contactId',
      as: 'contact',
    });
    Email.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Email;
};
