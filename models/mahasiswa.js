'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mahasiswa extends Model {
   
    static associate(models) {
      Mahasiswa.belongsTo(models.Users , { foreignKey : 'userId'  });

    }
  }
  Mahasiswa.init({
    name: {
      type : DataTypes.STRING,
      allowNull: false,
    },
    nim: {
      type : DataTypes.STRING,
      allowNull: false,
    },
    no_hp: {
      type : DataTypes.STRING,
      allowNull: false,
    },
    userId : {
      type : DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    alamat: {
      type : DataTypes.STRING,
      allowNull: false,
    },
    rekening: {
      type : DataTypes.INTEGER,
      allowNull: true,
    },

  }, {
    sequelize,
    modelName: 'Mahasiswa',
    tableName : 'mahasiswa',
    timestamps: true,
  });
  return Mahasiswa;
};