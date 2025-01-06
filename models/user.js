'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
    
    }
  }
  User.init({
    username: {
      type : DataTypes.STRING,
      allowNull : false,
      unique : true
      },
    password: {
      type : DataTypes.STRING,
      allowNull : false
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
    },
    refreshToken: {
      type : DataTypes.STRING
    }
    
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  });
  return User;
};