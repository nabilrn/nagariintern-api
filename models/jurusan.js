'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jurusan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Jurusan.belongsTo(models.Institusi, { foreignKey: 'institusiId' });
      Jurusan.hasMany(models.PermintaanMagang, { foreignKey: 'jurusanId' });
    }
  }
  Jurusan.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    institusiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Institusi',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Jurusan',
    tableName: 'jurusan',
    timestamps: true
  });
  return Jurusan;
};