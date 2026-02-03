import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Report = sequelize.define('Report', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('dashboard', 'sales', 'contacts', 'custom'),
      allowNull: false,
    },
    configuration: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    schedule: {
      type: DataTypes.JSON,
    },
    lastRun: {
      type: DataTypes.DATE,
    },
  }, {
    timestamps: true,
    tableName: 'reports',
  });

  Report.associate = (models) => {
    Report.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Report;
};
