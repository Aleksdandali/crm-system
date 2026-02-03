import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Contact = sequelize.define('Contact', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.STRING,
    },
    companyId: {
      type: DataTypes.UUID,
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    source: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('lead', 'prospect', 'customer', 'inactive'),
      defaultValue: 'lead',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    notes: {
      type: DataTypes.TEXT,
    },
    address: {
      type: DataTypes.JSON,
    },
    customFields: {
      type: DataTypes.JSON,
    },
    lastContactDate: {
      type: DataTypes.DATE,
    },
  }, {
    timestamps: true,
    tableName: 'contacts',
  });

  Contact.associate = (models) => {
    Contact.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company',
    });
    Contact.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'owner',
    });
    Contact.hasMany(models.Deal, {
      foreignKey: 'contactId',
      as: 'deals',
    });
    Contact.hasMany(models.Activity, {
      foreignKey: 'contactId',
      as: 'activities',
    });
    Contact.hasMany(models.Email, {
      foreignKey: 'contactId',
      as: 'emails',
    });
  };

  return Contact;
};
