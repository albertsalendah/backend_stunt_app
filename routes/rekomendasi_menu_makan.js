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

router.get("/list_rekomendasi_menu_makan", async (req, res) => {
  try {
    const { user_id } = req.body;
    const query = "SELECT * FROM rekomendasi_menu_makan WHERE user_id = ? ";
    db.query(query, [user_id], (error, results) => {
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

router.get("/rekomendasi_menu_makan", async (req, res) => {
  const query1 =
    "SELECT * FROM (SELECT * FROM rekomendasi_menu_makan WHERE menu_makan = 1 ORDER BY RAND() LIMIT 1) AS result1";
  const query2 =
    "SELECT * FROM (SELECT * FROM rekomendasi_menu_makan WHERE menu_makan = 2 ORDER BY RAND() LIMIT 1) AS result2";
  const query3 =
    "SELECT * FROM (SELECT * FROM rekomendasi_menu_makan WHERE menu_makan = 3 ORDER BY RAND() LIMIT 1) AS result3";

  const results = [];

  db.query(query1, (err, result1) => {
    if (err) throw err;
    results.push(result1[0]);

    db.query(query2, (err, result2) => {
      if (err) throw err;
      results.push(result2[0]);

      db.query(query3, (err, result3) => {
        if (err) throw err;
        results.push(result3[0]);

        res.json(results);
      });
    });
  });
});

router.post("/tambah_rekomendasi_menu_makan", async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];
    const {
      user_id,
      menu_makan,
      jam_makan,
      makanan_pokok,
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
      "INSERT INTO `rekomendasi_menu_makan`(`id_menu`, `user_id`, `menu_makan`, `tanggal`, `jam_makan`, `makanan_pokok`, `jumlah_mk`, `satuan_mk`, `sayur`, `jumlah_sayur`, `satuan_sayur`, `lauk_hewani`, `jumlah_lauk_hewani`, `satuan_lauk_hewani`, `lauk_nabati`, `jumlah_lauk_nabati`, `satuan_lauk_nabati`, `buah`, `jumlah_buah`, `satuan_buah`, `minuman`, `jumlah_minuman`, `satuan_minuman`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(
      query,
      [
        makeid(32),
        user_id,
        menu_makan,
        currentDate,
        jam_makan,
        makanan_pokok,
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

router.post("/update_rekomendasi_menu_makan", async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];
    const {
      id_menu,
      menu_makan,
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
      "UPDATE `rekomendasi_menu_makan` SET `menu_makan` = ?,`tanggal` = ?,`jam_makan` = ?,`makanan_pokok` = ?,`jumlah_mk` = ?,`satuan_mk` = ?,`sayur` = ?,`jumlah_sayur` = ?,`satuan_sayur` = ?,`lauk_hewani` = ?,`jumlah_lauk_hewani` = ?,`satuan_lauk_hewani` = ?,`lauk_nabati` = ?,`jumlah_lauk_nabati` = ?,`satuan_lauk_nabati` = ?,`buah` = ?,`jumlah_buah` = ?,`satuan_buah` = ?,`minuman` = ?,`jumlah_minuman` = ?,`satuan_minuman` = ? WHERE id_menu = ?";
    db.query(
      query,
      [
        menu_makan,
        currentDate,
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
