'use strict';

const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const moment = require('moment');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersData = [];
    
    // Generate 100 users with their related data
    for (let i = 101; i < 201; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      
      usersData.push({
        email: faker.internet.email({ firstName, lastName }),
        password: await bcrypt.hash('password123', 10),
        roleId: 1,
        isVerified: true,
        mahasiswaData: {
          name: `${firstName} ${lastName}`,
          nim: `20${faker.number.int({ min: 10000, max: 99999 })}`, // Format: 20XXXXX
          no_hp: faker.phone.number('08##########'),
          alamat: faker.location.streetAddress(true),
          rekening: parseInt(faker.finance.accountNumber(8)) // 8 digit account number
        },
        permintaanData: {
          type: 'mahasiswa',
          tanggalMulai: moment().add(faker.number.int({ min: 1, max: 30 }), 'days').format('YYYY-MM-DD'),
          tanggalSelesai: moment().add(faker.number.int({ min: 60, max: 90 }), 'days').format('YYYY-MM-DD'),
          statusId: 1, // Diproses
          unitKerjaId: faker.number.int({ min: 1, max: 5 }),
          ptId: faker.number.int({ min: 6, max: 9 }), // Perguruan Tinggi ID
          prodiId: faker.number.int({ min: 1, max: 5 }), // Program Studi ID
          keterangan: faker.datatype.boolean() ? faker.lorem.sentence() : null
        }
      });
    }

    // Create Users
    const createdUsers = await queryInterface.bulkInsert('users', 
      usersData.map((user, index) => ({
        id: index + 101,
        email: user.email,
        password: user.password,
        roleId: user.roleId,
        isVerified: user.isVerified,
        createdAt: faker.date.recent({ days: 30 }),
        updatedAt: faker.date.recent({ days: 30 })
      })),
      { returning: true }
    );

    // Create Mahasiswa records
    await queryInterface.bulkInsert('mahasiswa',
      usersData.map((user, index) => ({
        name: user.mahasiswaData.name,
        nim: user.mahasiswaData.nim,
        no_hp: user.mahasiswaData.no_hp,
        userId: index + 101,
        alamat: user.mahasiswaData.alamat,
        rekening: user.mahasiswaData.rekening,
        createdAt: faker.date.recent({ days: 30 }),
        updatedAt: faker.date.recent({ days: 30 })
      }))
    );

    // Create Permintaan records
    const permintaanRecords = await queryInterface.bulkInsert('permintaan',
      usersData.map((user, index) => ({
        id: index + 101,
        userId: index + 101,
        type: user.permintaanData.type,
        ptId: user.permintaanData.ptId,
        prodiId: user.permintaanData.prodiId,
        tanggalMulai: user.permintaanData.tanggalMulai,
        tanggalSelesai: user.permintaanData.tanggalSelesai,
        unitKerjaId: user.permintaanData.unitKerjaId,
        statusId: user.permintaanData.statusId,
        statusState: ['completed', 'rejected', 'reject'][faker.number.int({ min: 0, max: 2 })],
        keterangan: user.permintaanData.keterangan,
        createdAt: faker.date.recent({ days: 30 }),
        updatedAt: faker.date.recent({ days: 30 })
      }))
    );

    // Create Dokumen records
    const dokumenData = [];
    usersData.forEach((user, index) => {
      const permintaanId = index + 1;
      const timestamp = Date.now();
      
      // CV Document
      dokumenData.push({
        permintaanId,
        tipe: 'CV',
        url: `fileCv-${timestamp + index}-${faker.number.int({ min: 100000000, max: 999999999 })}.pdf`,
        createdAt: faker.date.recent({ days: 30 }),
        updatedAt: faker.date.recent({ days: 30 })
      });
      
      // KTP Document
      dokumenData.push({
        permintaanId,
        tipe: 'KTP',
        url: `fileKtp-${timestamp + index}-${faker.number.int({ min: 100000000, max: 999999999 })}.pdf`,
        createdAt: faker.date.recent({ days: 30 }),
        updatedAt: faker.date.recent({ days: 30 })
      });

      // Optional: Add Transkrip for mahasiswa
      dokumenData.push({
        permintaanId,
        tipe: 'Transkrip',
        url: `fileTranskrip-${timestamp + index}-${faker.number.int({ min: 100000000, max: 999999999 })}.pdf`,
        createdAt: faker.date.recent({ days: 30 }),
        updatedAt: faker.date.recent({ days: 30 })
      });
    });
    
    await queryInterface.bulkInsert('Dokumen', dokumenData);
  },

  down: async (queryInterface, Sequelize) => {
    // Delete in reverse order to maintain referential integrity
    await queryInterface.bulkDelete('Dokumen', null, {});
    await queryInterface.bulkDelete('permintaan', null, {});
    await queryInterface.bulkDelete('mahasiswa', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};