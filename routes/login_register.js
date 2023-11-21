require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

router.post("/register", async (req, res) => {
  try {
    const {
      nama,
      no_hp,
      email,
      password,
      fcm_token,
      foto,
      keterangan,
      health_worker,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO users (userID, nama, no_hp, email, password,fcm_token,foto,keterangan,health_worker) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [
        makeid(32),
        nama,
        no_hp,
        email,
        hashedPassword,
        fcm_token,
        foto,
        keterangan,
        health_worker,
      ],
      (error, results) => {
        if (error) {
          console.error(error);
          if (error.code == "ER_DUP_ENTRY") {
            res.status(500).json({ error: "Nomer Whatsapp Sudah Terdaftar" });
          } else {
            res.status(500).json({ error: "An error occurred" });
          }
          return;
        }
        res.status(200).json({ message: "Registrasi Berhasil" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { no_hp, password, health_worker } = req.body;
    const query = "SELECT * FROM users WHERE no_hp = ? AND health_worker = ?";
    db.query(query, [no_hp, health_worker], async (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
        return;
      }
      const user = results[0];
      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const token = jwt.sign({ userID: user.userID }, process.env.TOKEN_KEY, {
        expiresIn: 60 * 30,
      }); //(60*30) Change
      res.status(200).json({ token, user });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/update_token_fcm", async (req, res) => {
  try {
    const { userID, fcm_token } = req.body;
    const query = "UPDATE users SET fcm_token=? WHERE userID = ?";
    db.query(query, [fcm_token, userID], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
        return;
      }
      res.status(200).json({ message: "Data Berhasil Diubah" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
