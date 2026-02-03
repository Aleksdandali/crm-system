import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'manager', 'sales', 'viewer'),
      defaultValue: 'sales',
    },
    phone: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
    refreshToken: {
      type: DataTypes.TEXT,
    },
  }, {
    timestamps: true,
    tableName: 'users',
  });

  User.associate = (models) => {
    User.hasMany(models.Contact, {
      foreignKey: 'ownerId',
      as: 'contacts',
    });
    User.hasMany(models.Deal, {
      foreignKey: 'ownerId',
      as: 'deals',
    });
    User.hasMany(models.Task, {
      foreignKey: 'assigneeId',
      as: 'assignedTasks',
    });
    User.hasMany(models.Task, {
      foreignKey: 'creatorId',
      as: 'createdTasks',
    });
    User.hasMany(models.Activity, {
      foreignKey: 'userId',
      as: 'activities',
    });
    User.hasMany(models.Report, {
      foreignKey: 'userId',
      as: 'reports',
    });
  };

  return User;
};
