const express = require("express");
const router = express.Router();
const { db } = require("../utils/connections");
const nodemailer = require("nodemailer");
const emailExistence = require("email-existence");
const bcrypt = require("bcrypt");

const config = {
  service: "gmail",
  host: "smtp.gmail.com",
  post: "587",
  secure: false,
  auth: {
    user: process.env.EMAIL_HOST,
    pass: process.env.MAILPASS,
  },
};

router.post("/send_email", async (req, res) => {
  const { to, code,  subject} = req.body;

  emailExistence.check(to, function (err, ress) {
    if (err) {
      console.log("res: " + ress+" => "+to);
      //res.status(200).json({ status: false });
    }
    const data = {
      from: process.env.EMAIL_SEND,
      to: to,
      subject: subject,
      text: `Copy dan Paste Kode Ini Ke Aplikasi StuntApp : ${code}`,
    };
    const transporter = nodemailer.createTransport(config);
    transporter.sendMail(data, (err, info) => {
      if (err) {
        console.log(`Email Error : ${err}`);
        res.status(200).json({ status: false });
      } else {
        res.status(200).json({ status: true });
      }
    });
  });
});

router.post("/get_user_byNo", async (req, res) => {
  try {
    const { noHp } = req.body;
    const query =
      "SELECT userID, nama, no_hp, email, fcm_token, keterangan, health_worker FROM users WHERE no_hp = ?";
    db.query(query, noHp, (error, results) => {
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

router.post("/reset_password", async (req, res) => {
  try {
    const { userID, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "UPDATE users SET password=? WHERE userID = ?";
    db.query(query, [hashedPassword, userID], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
        return;
      }
      res.status(200).json({ message: "Password Berhasil Diubah" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
