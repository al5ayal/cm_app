'use strict';
const { Model } = require('sequelize');
const User = require('./index').User;
module.exports = (sequelize, DataTypes) => {
  class user_group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_group.hasMany(models.User, {
        foreignKey: 'user_group_id',
      });
    }
  }
  user_group.init(
    {
      name: DataTypes.STRING,
      group_permision: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'user_group',
    }
  );

  return user_group;
};
