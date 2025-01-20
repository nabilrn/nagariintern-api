const { UnitKerja } = require("../models/index");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

const getAllUnitKerja = async (req, res) => {
  try {
    const unitKerja = await UnitKerja.findAll();
    return res.status(200).json(unitKerja);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const editKuotaUnitKerja = async (req, res) => {
  try {
    const { id } = req.params;
    const { kuotaMhs, kuotaSiswa } = req.body;

    const unitKerja = await UnitKerja.findByPk(id);

    if (!unitKerja) {
      return res.status(404).json({ error: "Unit kerja tidak ditemukan." });
    }

    unitKerja.kuotaMhs = kuotaMhs;
    unitKerja.kuotaSiswa = kuotaSiswa;
    await unitKerja.save();

    return res.status(200).json({
      message: "Kuota unit kerja berhasil diperbarui.",
      unitKerja,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const generateLetter = async (req, res) => {
  // Load template
  const content = fs.readFileSync(
    path.resolve(__dirname, "template.docx"),
    "binary"
  );
  const zip = new PizZip(content);

  // Data contoh
  const data = {
    noSurat: "001/2024",
    pejabat: "Dekan Fakultas Teknik",
    institusi: "Universitas Negeri Padang",
    departemen: "Teknik Informatika",
    perihal: "Permohonan Magang Mahasiswa",
    students: [
      {
        nama_mahasiswa: "Budi Santoso",
        nim: "19104410001",
        penempatan: "Divisi IT",
        periode: "1 Jan - 31 Mar 2025",
      },
      {
        nama_mahasiswa: "Ani Widya",
        nim: "19104410002",
        penempatan: "Divisi Human Capital",
        periode: "1 Jan - 31 Mar 2025",
      },
      {
        nama_mahasiswa: "Charlie Putra",
        nim: "19104410003",
        penempatan: "Divisi Keuangan",
        periode: "1 Jan - 31 Mar 2025",
      },
    ],
  };

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Add row numbers to students
  const dataWithNumbers = {
    ...data,
    students: data.students.map((student, index) => ({
      no: index + 1,
      ...student,
    })),
  };

  // Render document
  doc.render(dataWithNumbers);

  // Generate buffer
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  // Save file
  const outputPath = `surat_magang_${Date.now()}.docx`;
  fs.writeFileSync(outputPath, buf);

  return outputPath;
};



module.exports = {
  getAllUnitKerja,
  editKuotaUnitKerja,
  generateLetter,
};
