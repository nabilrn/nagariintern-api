'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
      User.hasMany(models.PermintaanMagang, { foreignKey: 'userId' });
    
    }
  }
  User.init({
    email: {
      type : DataTypes.STRING,
      unique : true,
    },
    password: {
      type : DataTypes.STRING,
      allowNull : false
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user',
      allowNull: false,
    },
    refreshToken: {
      type : DataTypes.STRING
    },
    nama: {
      type : DataTypes.STRING
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  });
 
  return User;
};