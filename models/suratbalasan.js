'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SuratBalasan extends Model {
    static associate(models) {
      SuratBalasan.belongsTo(models.Permintaan, { foreignKey: 'permintaanId' });
    }

    static async createSuratBalasan(permintaanId, url) {
      return await this.create({
        permintaanId: permintaanId,
        url: url,
      });
    }

    static async createMultipleSuratBalasan(dataArray) {
      return await this.bulkCreate(dataArray);
    }
  }

  SuratBalasan.init({
    permintaanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Permintaan',
        key: 'id'
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SuratBalasan',
    tableName: 'suratbalasan',
    timestamps: true,
  });

  return SuratBalasan;
};