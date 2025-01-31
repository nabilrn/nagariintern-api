'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tipe_dokumen', [
      { name: 'CV', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Surat Pengantar', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Transkip Nilai', createdAt: new Date(), updatedAt: new Date() },
      { name: 'KTP', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Surat Balasan', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Surat Keterangan Kampus', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Surat Keterangan Pribadi', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Surat Pengantar Divisi', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sertifikat', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Buku Tabungan', createdAt: new Date(), updatedAt: new Date() },

    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipe_dokumen', null, {});
  }
};
