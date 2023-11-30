const express = require("express");
const router = express.Router();
const { db } = require("../utils/connections");
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const multer = require("multer");
const upload = multer({ dest: "ProfilePicture/" });
const fs = require("fs");

router.get("/get_data_user", async (req, res) => {
  try {
    const { userID } = req.body;
    const query = "SELECT * FROM users WHERE userID = ?";
    db.query(query, userID, (error, results) => {
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

router.post("/update_foto", upload.single("foto"), async (req, res) => {
  try {
    const { userID, oldpath } = req.body;
    if (oldpath != null && oldpath != "") {
      if (fs.existsSync(oldpath)) {
        fs.unlink(oldpath, (err) => {
          if (err) {
            console.error("File deletion error:", err);
          }
        });
      }
    }
    let fotoPath = ""; // Initialize the file path
    if (req.file) {
      const imagePath = req.file.path;
      const compressedBuffer = await sharp(imagePath)
        .jpeg({ quality: 40 })
        .toBuffer();
      const currentDate = new Date();
      const dateString = currentDate.toISOString().replace(/[-T:]/g, "");
      const newFileName = `${userID}_${dateString}.jpg`;
      const newPath = `ProfilePicture/${newFileName}`;
      await fs.promises.writeFile(newPath, compressedBuffer);
      fotoPath = newPath;
      await fs.promises.unlink(imagePath);
    }
    const query = "UPDATE users SET foto=? WHERE userID = ?";
    db.query(query, [fotoPath, userID], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
        return;
      }
      res.status(200).json({ message: "Foto Berhasil Diubah" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/update_keterangan", async (req, res) => {
  try {
    const { userID, keterangan } = req.body;
    const query = "UPDATE users SET keterangan=? WHERE userID = ?";
    db.query(query, [keterangan, userID], (error, results) => {
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

router.post("/update_nomor", async (req, res) => {
  try {
    const { userID, no_hp } = req.body;
    const query = "UPDATE users SET no_hp=? WHERE userID = ?";
    db.query(query, [no_hp, userID], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Nomer Sudah Digunakan" });
        return;
      }
      res.status(200).json({ message: "Data Berhasil Diubah" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/update_email", async (req, res) => {
  try {
    const { userID, email } = req.body;
    const query = "UPDATE users SET email=? WHERE userID = ?";
    db.query(query, [email, userID], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Email Sudah Digunakan" });
        return;
      }
      res.status(200).json({ message: "Data Berhasil Diubah" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/update_password", async (req, res) => {
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
      res.status(200).json({ message: "Data Berhasil Diubah" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/cek_password", async (req, res) => {
  try {
    const { no_hp, password } = req.body;
    const query = "SELECT * FROM users WHERE no_hp = ?";
    db.query(query, [no_hp], async (error, results) => {
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
      //console.log(`${isPasswordValid} => ${password}`);
      res.status(200).json({ message: "Password Valid" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/hapus_akun", async (req, res) => {
  try {
    const { userID } = req.body;
    const queryAkun = "DELETE FROM users WHERE userID = ?";
    const queryDataAnak = "DELETE FROM data_anak WHERE userID = ?";
    const queryMenuMakan = "DELETE FROM menu_makan WHERE userID = ?";
    const queryVaksin = "DELETE FROM jadwal_vaksin WHERE userID = ?";
    db.query(queryDataAnak, userID, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
        return;
      }
      db.query(queryAkun, userID, (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: "An error occurred" });
          return;
        }
        db.query(queryMenuMakan, userID, (error, results) => {
          if (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred" });
            return;
          }
          db.query(queryVaksin, userID, (error, results) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error: "An error occurred" });
              return;
            }

            fs.readdir('./ProfilePicture', (err, files) => {
              if (err) {
                console.error('Error reading directory:', err);
                return;
              }
            
              // Filter files based on the search string
              const matchingFiles = files.filter(file => file.includes(userID));
            
              // Delete each matching file
              matchingFiles.forEach(file => {
                const filePath = `./ProfilePicture/${file}`;
            
                fs.unlink(filePath, err => {
                  if (err) {
                    console.error('Error deleting file:', err);
                  } else {
                    console.log(`File ${file} deleted successfully.`);
                  }
                });
              });
            });
            res.status(200).json({ message: "Data Akun Berhasil Dihapus" });
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
