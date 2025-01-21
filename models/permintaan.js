'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permintaan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Permintaan.belongsTo(models.Users, { foreignKey: 'userId' });
      Permintaan.belongsTo(models.PerguruanTinggi, { foreignKey: 'ptId' });
      Permintaan.belongsTo(models.Prodi, { foreignKey: 'prodiId' });
      Permintaan.belongsTo(models.Smk, { foreignKey: 'smkId' });
      Permintaan.belongsTo(models.Jurusan, { foreignKey: 'jurusanId' });
      // Tambahkan alias untuk relasi UnitKerja
      Permintaan.belongsTo(models.UnitKerja, { 
        foreignKey: 'unitKerjaId',
        as: 'UnitKerjaPengajuan'  // Alias untuk unit kerja yang diajukan
      });
      Permintaan.belongsTo(models.UnitKerja, { 
        foreignKey: 'penempatan',
        as: 'UnitKerjaPenempatan'  // Alias untuk unit kerja penempatan
      });
      Permintaan.belongsTo(models.Status, { foreignKey: 'statusId' });
      Permintaan.hasMany(models.Kehadiran, { foreignKey: 'permintaanId' });
      Permintaan.hasMany(models.Dokumen, { foreignKey: 'permintaanId' });
      Permintaan.hasMany(models.SuratBalasan, { foreignKey: 'permintaanId' }); 
    }
  }
  Permintaan.init({
    userId : {
      type : DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    type : {
      type : DataTypes.ENUM('mahasiswa', 'siswa'),
      allowNull: false,
    },
    ptId : {
      type : DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'PerguruanTinggi',
        key: 'id'
      }
    },
    prodiId : {
      type : DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Prodi',
        key: 'id'
      }
    },
    
    smkId : {
      type : DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Smk',
        key: 'id'
      }
    },
    jurusanId : {
      type : DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Jurusan',
        key: 'id'
      }
    },
    tanggalMulai: {
      type : DataTypes.DATE,
      allowNull: false,
    },
    tanggalSelesai: {
      type : DataTypes.DATE,
      allowNull: false,
    },
    unitKerjaId : {
      type : DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'UnitKerja',
        key: 'id'
      }
    },
    statusId : {
      type : DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Status',
        key: 'id'
      }
    },
    penempatan : {
      type : DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'UnitKerja',
        key: 'id'
      }
    },



  }, {
    sequelize,
    modelName: 'Permintaan',
    tableName : 'permintaan',
    timestamps: true,
  });
  return Permintaan;
};