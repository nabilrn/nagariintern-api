"use strict";

const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");
const moment = require("moment");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersData = [];

    // Generate 200 users with their related data
    for (let i = 0; i < 100; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const unitId = faker.number.int({ min: 1, max: 5 });

      usersData.push({
        
        email: faker.internet.email({ firstName, lastName }),
        password: await bcrypt.hash("password123", 10),
        roleId: 1,
        isVerified: true,
        siswaData: {
          name: `${firstName} ${lastName}`,
          nisn: faker.number.int({ min: 10000000, max: 99999999 }).toString(),
          no_hp: faker.phone.number("08##########"),
          alamat: faker.location.streetAddress(true),
        },
        permintaanData: {
          type: "siswa",
          tanggalMulai: moment()
            .add(faker.number.int({ min: 1, max: 30 }), "days")
            .format("YYYY-MM-DD"),
          tanggalSelesai: moment()
            .add(faker.number.int({ min: 60, max: 90 }), "days")
            .format("YYYY-MM-DD"),
          statusId: 3,
          unitKerjaId: unitId,
          penempatan: unitId,
          smkId: faker.number.int({ min: 1, max: 5 }),
          jurusanId: faker.number.int({ min: 1, max: 5 }),
          keterangan: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        },
      });
    }

    // Create Users
    const createdUsers = await queryInterface.bulkInsert(
      "users",
      usersData.map((user, index) => ({
        id: index + 2, // Explicit ID assignment
        email: user.email,
        password: user.password,
        roleId: user.roleId,
        isVerified: user.isVerified,
        createdAt: faker.date.recent({ days: 30 }),
        updatedAt: faker.date.recent({ days: 30 }),
      })),
      { returning: true }
    );

    // Create Siswa records
    await queryInterface.bulkInsert(
      "siswa",
      usersData.map((user, index) => ({
        name: user.siswaData.name,
        nisn: user.siswaData.nisn,
        no_hp: user.siswaData.no_hp,
        userId: index + 2,
        alamat: user.siswaData.alamat,
        createdAt: faker.date.recent({ days: 30 }),
        updatedAt: faker.date.recent({ days: 30 }),
      }))
    );

    // Create Permintaan records
    const permintaanRecords = await queryInterface.bulkInsert(
      "permintaan",
      usersData.map((user, index) => ({
        id: index + 2,
        userId: index + 2,
        type: user.permintaanData.type,
        smkId: user.permintaanData.smkId,
        jurusanId: user.permintaanData.jurusanId,
        tanggalMulai: user.permintaanData.tanggalMulai,
        tanggalSelesai: user.permintaanData.tanggalSelesai,
        unitKerjaId: user.permintaanData.unitKerjaId,
        penempatan: user.permintaanData.penempatan,
        statusId: user.permintaanData.statusId,
        statusState: ["completed", "rejected", "reject"][
          faker.number.int({ min: 0, max: 2 })
        ],
        keterangan: user.permintaanData.keterangan,
        createdAt: faker.date.recent({ days: 30 }),
        updatedAt: faker.date.recent({ days: 30 }),
      }))
    );

    // Create Dokumen records
    const dokumenData = [];
    usersData.forEach((user, index) => {
      const permintaanId = index + 2;
      const timestamp = Date.now();

      // CV Document
      dokumenData.push({
        permintaanId,
        tipe: "CV",
        url: `fileCv-${timestamp + index}-${faker.number.int({
          min: 100000000,
          max: 999999999,
        })}.pdf`,
        createdAt: faker.date.recent({ days: 30 }),
        updatedAt: faker.date.recent({ days: 30 }),
      });

      // KTP Document
      dokumenData.push({
        permintaanId,
        tipe: "KTP",
        url: `fileKtp-${timestamp + index}-${faker.number.int({
          min: 100000000,
          max: 999999999,
        })}.pdf`,
        createdAt: faker.date.recent({ days: 30 }),
        updatedAt: faker.date.recent({ days: 30 }),
      });
    });

    await queryInterface.bulkInsert("Dokumen", dokumenData);
  },

  down: async (queryInterface, Sequelize) => {
    // Delete in reverse order to maintain referential integrity
    await queryInterface.bulkDelete("Dokumen", null, {});
    await queryInterface.bulkDelete("permintaan", null, {});
    await queryInterface.bulkDelete("siswa", null, {});
    await queryInterface.bulkDelete("users", null, {});
  },
};