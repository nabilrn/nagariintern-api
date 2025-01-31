'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('unit_kerja', [
      { name: 'CABANG ALAHAN PANJANG', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG BANDUNG', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG BATUSANGKAR', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG BUKITTINGGI', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG JAKARTA', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG KOTO BARU', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG LINTAU', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG LUBUK ALUNG', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG LUBUK BASUNG', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG LUBUK GADANG', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG LUBUK SIKAPING', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG MATRAMAN JAKARTA', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG MENTAWAI', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG MUARA LABUH', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG PADANG PANJANG', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG PAINAN', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG PANGKALAN', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG PARIAMAN', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG PASAR RAYA PADANG', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG PAYAKUMBUH', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG PEKANBARU', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG PULAU PUNJUNG', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG SAWAHLUNTO', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG SIJUNJUNG', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG SIMPANG EMPAT', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG SITEBA', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG SOLOK', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG SYARIAH PADANG', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG SYARIAH PAYAKUMBUH', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG SYARIAH SOLOK', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG TAPAN', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG TAPUS', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG UJUNG GADING', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CABANG UTAMA PADANG', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'KANTOR PUSAT-Divisi Dana & Treasury', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'KANTOR PUSAT-Divisi Kredit & Mikro Banking', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'KANTOR PUSAT-Divisi Penyelamatan Kredit & Pembiayaan', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'KANTOR PUSAT-Divisi Pemasaran', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'KANTOR PUSAT-Divisi Usaha Syariah', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'KANTOR PUSAT-Divisi Audit Internal', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'KANTOR PUSAT-Divisi Kepatuhan', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'KANTOR PUSAT-Divisi Perencanaan Strategis', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'KANTOR PUSAT-Divisi Sekretaris Perusahaan', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'KANTOR PUSAT-Divisi Keuangan & Informasi', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'KANTOR PUSAT-Divisi Human Capital', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'KANTOR PUSAT-Divisi Teknologi & Digitalisasi', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'KANTOR PUSAT-Divisi Umum', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'KANTOR PUSAT-Divisi Manajemen Resiko', kuotaMhs: 0, kuotaSiswa: 0, createdAt: new Date(), updatedAt: new Date() },
      
    ], {}); 
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('unit_kerja', null, {});
  } 
};

