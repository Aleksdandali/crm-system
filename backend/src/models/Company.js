import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
    },
    industry: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.JSON,
    },
    description: {
      type: DataTypes.TEXT,
    },
    taxId: {
      type: DataTypes.STRING,
    },
    ownerId: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    customFields: {
      type: DataTypes.JSON,
    },
  }, {
    timestamps: true,
    tableName: 'companies',
  });

  Company.associate = (models) => {
    Company.hasMany(models.Contact, {
      foreignKey: 'companyId',
      as: 'contacts',
    });
    Company.hasMany(models.Deal, {
      foreignKey: 'companyId',
      as: 'deals',
    });
    Company.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'owner',
    });
  };

  return Company;
};
