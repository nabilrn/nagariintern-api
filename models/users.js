'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.belongsTo(models.Roles, { foreignKey: 'roleId' });
      Users.hasMany(models.Mahasiswa, { foreignKey: 'userId' });
      Users.hasMany(models.Siswa, { foreignKey: 'userId' });
      Users.hasMany(models.Permintaan, { foreignKey: 'userId' });
      Users.hasMany(models.Karyawan, { foreignKey: 'userId' });
    }
  }
  Users.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id',
      },
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
    timestamps: true,
  });
  return Users;
};