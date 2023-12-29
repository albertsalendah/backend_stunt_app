const express = require("express");
const router = express.Router();
const { db } = require("../utils/connections");

router.post("/jadwalvaksin", async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];
    const { userID, id_anak } = req.body;
    const query =
      "SELECT * FROM jadwal_vaksin WHERE userID = ? AND id_anak = ? AND tanggal_vaksin >= ?";
    db.query(query, [userID, id_anak, currentDate], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/daftarvaksin", async (req, res) => {
  try {
    const { umur } = req.body;
    const query =
      "SELECT * FROM daftar_vaksin WHERE umur_mulai <= ? AND umur_selesai >= ?";
    db.query(query, [umur, umur], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/tambah_jadwal_vaksin", async (req, res) => {
  try {
    const { id_anak, userID, lokasi, tanggal_vaksin, tipe_vaksin } = req.body;
    const query =
      "INSERT INTO jadwal_vaksin (id_anak,userID, lokasi, tanggal_vaksin, tipe_vaksin) VALUES (?,?, ?, ?, ?)";
    db.query(
      query,
      [id_anak, userID, lokasi, tanggal_vaksin, tipe_vaksin],
      (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
        res.status(200).json({ message: "Jadwal Vaksin Berhasil Disimpan" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

router.get("/listkota", async (req, res) => {
  try {
    const query = "SELECT * FROM kota";
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
