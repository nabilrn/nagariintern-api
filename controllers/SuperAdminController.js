const { UnitKerja } = require('../models/index');

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

module.exports = {
    getAllUnitKerja,
    editKuotaUnitKerja
    
    };