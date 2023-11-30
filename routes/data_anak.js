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

router.get("/get_data_anak", async (req, res) => {
  try {
    const { userID } = req.body;
    const query = "SELECT * FROM data_anak WHERE userID = ?";
    db.query(query, userID, (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

router.get("/get_detail_anak", async (req, res) => {
  try {
    const { userID, id_anak } = req.body;
    const query = "SELECT * FROM data_anak WHERE userID = ? AND id_anak = ?";
    db.query(query, [userID, id_anak], (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      res.status(200).json(results[0]);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

router.post("/insert_data_anak", async (req, res) => {
  try {
    const id_anak = makeid(32);
    const {
      userID,
      nama_anak,
      jenis_kelamin,
      tanggal_lahir,
      berat_badan,
      tinggi_badan,
      lingkar_kepala,
      pengukuran_terakhir,
    } = req.body;
    const query =
      "INSERT INTO data_anak (id_anak,userID, nama_anak, jenis_kelamin, tanggal_lahir, berat_badan,tinggi_badan,lingkar_kepala,pengukuran_terakhir) VALUES (?,?, ?, ?, ?, ?, ?, ?,?)";
    db.query(
      query,
      [
        id_anak,
        userID,
        nama_anak,
        jenis_kelamin,
        tanggal_lahir,
        berat_badan,
        tinggi_badan,
        lingkar_kepala,
        pengukuran_terakhir,
      ],
      (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
        const query =
          "SELECT * FROM data_anak WHERE userID = ? AND id_anak = ?";
        db.query(query, [userID, id_anak], (error, resultsAnak) => {
          if (error) {
            console.error(error);
            return;
          }
          res.status(200).json({
            message: "Data Anak Berhasil Disimpan",
            dataAnak: resultsAnak[0],
          });
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

router.post("/update_data_anak", async (req, res) => {
  try {
    const {
      id_anak,
      userID,
      nama_anak,
      jenis_kelamin,
      tanggal_lahir,
      berat_badan,
      tinggi_badan,
      lingkar_kepala,
      pengukuran_terakhir,
    } = req.body;
    const query =
      "UPDATE data_anak SET nama_anak=?,jenis_kelamin=?,tanggal_lahir=?,berat_badan=?,tinggi_badan=?,lingkar_kepala=?,pengukuran_terakhir=? WHERE id_anak = ? AND userID = ?";
    db.query(
      query,
      [
        nama_anak,
        jenis_kelamin,
        tanggal_lahir,
        berat_badan,
        tinggi_badan,
        lingkar_kepala,
        pengukuran_terakhir,
        id_anak,
        userID,
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
