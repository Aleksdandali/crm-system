import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium',
    },
    dueDate: {
      type: DataTypes.DATE,
    },
    completedAt: {
      type: DataTypes.DATE,
    },
    assigneeId: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    creatorId: {
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
    category: {
      type: DataTypes.STRING,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    reminder: {
      type: DataTypes.DATE,
    },
  }, {
    timestamps: true,
    tableName: 'tasks',
  });

  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: 'assigneeId',
      as: 'assignee',
    });
    Task.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'creator',
    });
    Task.belongsTo(models.Contact, {
      foreignKey: 'contactId',
      as: 'contact',
    });
    Task.belongsTo(models.Deal, {
      foreignKey: 'dealId',
      as: 'deal',
    });
  };

  return Task;
};
