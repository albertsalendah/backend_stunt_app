const express = require("express");
const router = express.Router();
const { db } = require("../utils/connections");

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

router.post("/list_menu_makan", async (req, res) => {
  try {
    const { userID, id_anak, tanggal } = req.body;
    const query =
      "SELECT * FROM menu_makan WHERE userID = ? AND id_anak = ? AND tanggal BETWEEN DATE_SUB(?, INTERVAL 3 DAY) AND DATE_ADD(?, INTERVAL 3 DAY)";
    db.query(query, [userID, id_anak, tanggal, tanggal], (error, results) => {
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

router.post("/tambah_menu_makan", async (req, res) => {
  try {
    const {
      id_anak,
      userID,
      menu_makan,
      tanggal,
      jam_makan,
      makan_pokok,
      jumlah_mk,
      satuan_mk,
      sayur,
      jumlah_sayur,
      satuan_sayur,
      lauk_hewani,
      jumlah_lauk_hewani,
      satuan_lauk_hewani,
      lauk_nabati,
      jumlah_lauk_nabati,
      satuan_lauk_nabati,
      buah,
      jumlah_buah,
      satuan_buah,
      minuman,
      jumlah_minuman,
      satuan_minuman,
    } = req.body;
    const query =
      "INSERT INTO `menu_makan`(`id_menu`, `id_anak`, `userID`, `menu_makan`, `tanggal`, `jam_makan`,`makan_pokok`, `jumlah_mk`, `satuan_mk`, `sayur`, `jumlah_sayur`, `satuan_sayur`, `lauk_hewani`, `jumlah_lauk_hewani`, `satuan_lauk_hewani`, `lauk_nabati`, `jumlah_lauk_nabati`, `satuan_lauk_nabati`, `buah`, `jumlah_buah`, `satuan_buah`, `minuman`, `jumlah_minuman`, `satuan_minuman`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(
      query,
      [
        makeid(32),
        id_anak,
        userID,
        menu_makan,
        tanggal,
        jam_makan,
        makan_pokok,
        jumlah_mk,
        satuan_mk,
        sayur,
        jumlah_sayur,
        satuan_sayur,
        lauk_hewani,
        jumlah_lauk_hewani,
        satuan_lauk_hewani,
        lauk_nabati,
        jumlah_lauk_nabati,
        satuan_lauk_nabati,
        buah,
        jumlah_buah,
        satuan_buah,
        minuman,
        jumlah_minuman,
        satuan_minuman,
      ],
      (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
        res.status(200).json({ message: "Menu Makan Berhasil Disimpan" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

router.post("/update_menu_makan", async (req, res) => {
  try {
    const {
      id_menu,
      jam_makan,
      makan_pokok,
      jumlah_mk,
      satuan_mk,
      sayur,
      jumlah_sayur,
      satuan_sayur,
      lauk_hewani,
      jumlah_lauk_hewani,
      satuan_lauk_hewani,
      lauk_nabati,
      jumlah_lauk_nabati,
      satuan_lauk_nabati,
      buah,
      jumlah_buah,
      satuan_buah,
      minuman,
      jumlah_minuman,
      satuan_minuman,
    } = req.body;
    const query =
      "UPDATE menu_makan SET jam_makan=?, makan_pokok=?,jumlah_mk=?,satuan_mk=?,sayur=?,jumlah_sayur=?,satuan_sayur=?," +
      "lauk_hewani=?,jumlah_lauk_hewani=?,satuan_lauk_hewani=?,lauk_nabati=?,jumlah_lauk_nabati=?,satuan_lauk_nabati=?,buah=?,jumlah_buah=?," +
      "satuan_buah=?,minuman=?,jumlah_minuman=?,satuan_minuman=? WHERE id_menu= ?";
    db.query(
      query,
      [
        jam_makan,
        makan_pokok,
        jumlah_mk,
        satuan_mk,
        sayur,
        jumlah_sayur,
        satuan_sayur,
        lauk_hewani,
        jumlah_lauk_hewani,
        satuan_lauk_hewani,
        lauk_nabati,
        jumlah_lauk_nabati,
        satuan_lauk_nabati,
        buah,
        jumlah_buah,
        satuan_buah,
        minuman,
        jumlah_minuman,
        satuan_minuman,
        id_menu,
      ],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: "An error occurred" });
          return;
        }
        res.status(200).json({ message: "Data Berhasil Diubah" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
