'use strict';
const { Model } = require('sequelize');
// const user_group = require('./index.js').user_group;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.user_group, {
        foreignKey: 'user_group_id',
      });
    }
  }
  User.init(
    {
      user_name: DataTypes.STRING,
      full_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      user_group_id: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
