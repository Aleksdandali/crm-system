import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Activity = sequelize.define('Activity', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('call', 'meeting', 'email', 'note', 'task', 'deal_update'),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    duration: {
      type: DataTypes.INTEGER, // in minutes
    },
    outcome: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    contactId: {
      type: DataTypes.UUID,
      references: {
        model: 'contacts',
        key: 'id',
      },
    },
    dealId: {
      type: DataTypes.UUID,
      references: {
        model: 'deals',
        key: 'id',
      },
    },
    activityDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    metadata: {
      type: DataTypes.JSON,
    },
  }, {
    timestamps: true,
    tableName: 'activities',
  });

  Activity.associate = (models) => {
    Activity.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Activity.belongsTo(models.Contact, {
      foreignKey: 'contactId',
      as: 'contact',
    });
    Activity.belongsTo(models.Deal, {
      foreignKey: 'dealId',
      as: 'deal',
    });
  };

  return Activity;
};
