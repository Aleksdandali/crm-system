import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Deal = sequelize.define('Deal', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'UAH',
    },
    stage: {
      type: DataTypes.ENUM(
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
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    expectedCloseDate: {
      type: DataTypes.DATE,
    },
    actualCloseDate: {
      type: DataTypes.DATE,
    },
    contactId: {
      type: DataTypes.UUID,
      references: {
        model: 'contacts',
        key: 'id',
      },
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
    description: {
      type: DataTypes.TEXT,
    },
    lostReason: {
      type: DataTypes.STRING,
    },
    customFields: {
      type: DataTypes.JSON,
    },
  }, {
    timestamps: true,
    tableName: 'deals',
  });

  Deal.associate = (models) => {
    Deal.belongsTo(models.Contact, {
      foreignKey: 'contactId',
      as: 'contact',
    });
    Deal.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company',
    });
    Deal.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'owner',
    });
    Deal.hasMany(models.Activity, {
      foreignKey: 'dealId',
      as: 'activities',
    });
    Deal.hasMany(models.Task, {
      foreignKey: 'dealId',
      as: 'tasks',
    });
  };

  return Deal;
};
