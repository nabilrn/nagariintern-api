'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    static associate(models) {
      Roles.hasMany(models.Users, { foreignKey: 'roleId' });
    }
  }
  Roles.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Roles',
    tableName: 'roles',
    timestamps: true,
  });
  return Roles;
};