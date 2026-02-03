import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Integration = sequelize.define('Integration', {
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
      type: DataTypes.ENUM('1c', 'shine_shop', 'other'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'error'),
      defaultValue: 'inactive',
    },
    configuration: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    lastSync: {
      type: DataTypes.DATE,
    },
    lastError: {
      type: DataTypes.TEXT,
    },
    syncLog: {
      type: DataTypes.JSON,
    },
    metadata: {
      type: DataTypes.JSON,
    },
  }, {
    timestamps: true,
    tableName: 'integrations',
  });

  Integration.associate = (models) => {
    // No direct associations for now
  };

  return Integration;
};
