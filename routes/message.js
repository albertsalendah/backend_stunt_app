var admin = require("firebase-admin");
const express = require("express");
const router = express.Router();
const sharp = require("sharp");
const { db } = require("../utils/connections");
const multer = require("multer");
const upload = multer({ dest: "messages_file/" });
const fs = require("fs");

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

var serviceAccount = require("../utils/stuntapp-cd51d-firebase-adminsdk-ducyj-f28976e08f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.post("/send_message", upload.single("image"), async (req, res) => {
  try {
    const {
      id_message,
      conversation_id,
      id_sender,
      id_receiver,
      tanggal_kirim,
      jam_kirim,
      message,
      messageRead,
      fcm_token,
      title,
    } = req.body;
    let fotoPath = ""; // Initialize the file path
    if (req.file) {
      const imagePath = req.file.path;
      const compressedBuffer = await sharp(imagePath)
        .jpeg({ quality: 100 })
        .toBuffer();
      const newFileName = `${id_message}.jpg`;
      const newPath = `messages_file/${newFileName}`;
      await fs.promises.writeFile(newPath, compressedBuffer);
      fotoPath = newPath;
      await fs.promises.unlink(imagePath);
    }
    const query =
      "INSERT INTO `messages`(`id_message`, `conversation_id`,`id_sender`, `id_receiver`, `tanggal_kirim`, `jam_kirim`, `message`, `image`, `messageRead`) VALUES (?,?,?,?,?,?,?,?,?)";
    db.query(
      query,
      [
        id_message,
        conversation_id,
        id_sender,
        id_receiver,
        tanggal_kirim,
        jam_kirim,
        message,
        fotoPath,
        messageRead,
      ],
      async (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
        getFcmTokenByUserId(id_receiver)
          .then(async (fcmToken) => {
            const messages = {
              notification: {
                title: title,
                body: message,
              },
              data: {
                id_message: id_message,
                senderID: id_receiver,
                receiverID: id_sender,
              },
              token: fcmToken,
            };
            await admin
              .messaging()
              .send(messages)
              .then((response) => {
                //console.log("Successfully sent message:", response);
                res.status(200).json({ message: "Pesan Terkirim" });
              })
              .catch((error) => {
                console.error("Error sending message:", error);
                res.status(500).json({ error: error });
              });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

function getFcmTokenByUserId(userId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT fcm_token FROM users WHERE userID = ?";

    db.query(query, userId, (error, results) => {
      if (error) {
        console.error(error);
        reject(error);
        return;
      }

      resolve(results.length > 0 ? results[0].fcm_token : null);
    });
  });
}

router.get("/get_list_health_worker", async (req, res) => {
  try {
    const query = "SELECT * FROM users WHERE health_worker = 1";
    db.query(query, (error, results) => {
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

router.get("/get_latest_self_message", async (req, res) => {
  try {
    const { userID } = req.body;
    const query = `SELECT m.*, DATE_FORMAT(m.tanggal_kirim, '%Y-%m-%d %H:%i:%s') AS tanggal_kirim
    FROM messages m
    JOIN (
      SELECT conversation_id, MAX(tanggal_kirim) AS max_date
      FROM messages
      WHERE conversation_id LIKE ?
      GROUP BY conversation_id
    ) latest
    ON m.conversation_id = latest.conversation_id AND m.tanggal_kirim = latest.max_date
    ORDER BY m.tanggal_kirim DESC;`;

    db.query(query, [`%${userID}%`], (error, messagesResults) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: error });
        return;
      }
      res.status(200).json(messagesResults);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

router.get("/get_data_user_message", async (req, res) => {
  try {
    const { userID } = req.body;

    const placeholders = userID.map(() => "?").join(",");
    const query = `SELECT * FROM users WHERE userID IN (${placeholders})`;

    db.query(query, userID, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

router.post("/delete_conversation", async (req, res) => {
  try {
    const { conversation_id } = req.body;
    const queryAkun = "DELETE FROM `messages` WHERE conversation_id = ?;";
    db.query(queryAkun, conversation_id, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
        return;
      }
      res.status(200).json({ message: "Chat Berhasil Dihapus" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/delete_single_chat", async (req, res) => {
  try {
    const { id_message } = req.body;
    const queryAkun = "DELETE FROM `messages` WHERE id_message = ?;";
    db.query(queryAkun, id_message, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
        return;
      }
      fs.readdir("./messages_file", (err, files) => {
        if (err) {
          console.error("Error reading directory:", err);
          return;
        }
        const filePath = `./messages_file/${id_message}.jpg`;
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("File deletion error:", err);
            }
          });
        }
      });
      res.status(200).json({ message: "Chat Berhasil Dihapus" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
