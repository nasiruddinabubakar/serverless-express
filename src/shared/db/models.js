const { DataTypes } = require('sequelize');
const { sequelize } = require('./config');

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

// CustomData Model
const CustomData = sequelize.define('CustomData', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'custom_data',
  timestamps: true,
  underscored: true,
});

// CustomDataField Model
const CustomDataField = sequelize.define('CustomDataField', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  custom_data_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'custom_data',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  field_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  length: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_required: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  key_field: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  filter: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  }
}, {
  tableName: 'custom_data_fields',
  timestamps: true,
  underscored: true,
});

// CustomDataValue Model
const CustomDataValue = sequelize.define('CustomDataValue', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  uuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  custom_data_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'custom_data',
      key: 'id',
    },
  },
  custom_field_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'custom_data_fields',
      key: 'id',
    },
  }
}, {
  tableName: 'custom_data_values',
  timestamps: true,
  underscored: true,
});

// Define associations
CustomData.hasMany(CustomDataField, {
  foreignKey: 'custom_data_id',
  as: 'fields',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

CustomDataField.belongsTo(CustomData, {
  foreignKey: 'custom_data_id',
  as: 'customData'
});

CustomData.hasMany(CustomDataValue, {
  foreignKey: 'custom_data_id',
  as: 'values',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

CustomDataValue.belongsTo(CustomData, {
  foreignKey: 'custom_data_id',
  as: 'customData'
});

CustomDataField.hasMany(CustomDataValue, {
  foreignKey: 'custom_field_id',
  as: 'values',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

CustomDataValue.belongsTo(CustomDataField, {
  foreignKey: 'custom_field_id',
  as: 'customField'
});

module.exports = {
  sequelize,
  User,
  CustomData,
  CustomDataField,
  CustomDataValue
};
