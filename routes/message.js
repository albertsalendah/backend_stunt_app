var admin = require("firebase-admin");
const express = require("express");
const router = express.Router();
const sharp = require("sharp");
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

var serviceAccount = require("../utils/stuntapp-cd51d-firebase-adminsdk-ducyj-f28976e08f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.post("/send_message", async (req, res) => {
  try {
    const {
      id_sender,
      id_receiver,
      tanggal_kirim,
      jam_kirim,
      message,
      image,
      messageRead,
      fcm_token,
      title,
      //messageModel,
    } = req.body;
    let compressedBase64 = "";
    if (image !== null && image !== "") {
      const buffer = Buffer.from(image, "base64");
      const compressedBuffer = await sharp(buffer)
        //.resize({ width: 500 })
        .jpeg({ quality: 70 })
        .toBuffer();
      compressedBase64 = compressedBuffer.toString("base64");
      console.log("Image compressed successfully");
    } else {
      compressedBase64 = image;
    }
    const query =
      "INSERT INTO `messages`(`id_message`, `id_sender`, `id_receiver`, `tanggal_kirim`, `jam_kirim`, `message`, `image`, `messageRead`) VALUES (?,?,?,?,?,?,?,?)";
    db.query(
      query,
      [
        makeid(32),
        id_sender,
        id_receiver,
        tanggal_kirim,
        jam_kirim,
        message,
        image,
        messageRead,
      ],
      async (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
        const messages = {
          notification: {
            title: title,
            body: message,
          },
          data: { senderID: id_receiver, receiverID: id_sender },
          token: fcm_token,
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
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

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

// router.get("/get_latest_self_message", async (req, res) => {
//   try {
//     const { userID } = req.body;
//    const query =
//      "SELECT m.* FROM messages m JOIN ( SELECT id_sender, MAX(tanggal_kirim) AS max_tanggal_kirim FROM messages WHERE id_sender = ? GROUP BY id_receiver ) latest ON m.id_sender = latest.id_sender AND m.tanggal_kirim = latest.max_tanggal_kirim ORDER BY m.tanggal_kirim DESC;";
//    db.query(query, userID, (error, results) => {
//       if (error) {
//         console.error(error);
//         return;
//       }
//       res.status(200).json(results);
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error });
//   }
// });

router.get("/get_latest_self_message", async (req, res) => {
  try {
    const { userID } = req.body;

    const messagesQuery =
      "SELECT m.* FROM messages m JOIN ( SELECT id_sender, MAX(tanggal_kirim) AS max_tanggal_kirim FROM messages WHERE id_sender = ? GROUP BY id_receiver ) latest ON m.id_sender = latest.id_sender AND m.tanggal_kirim = latest.max_tanggal_kirim ORDER BY m.tanggal_kirim DESC;";

    db.query(messagesQuery, userID, (error, messagesResults) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: error });
        return;
      }

      // Extract id_receiver values from the messagesResults
      const idReceivers = messagesResults.map((message) => message.id_receiver);

      if (!idReceivers || idReceivers.length === 0) {
        // Handle the case where idReceivers is null or empty
        res.status(200).json([]);
        return;
      }

      const usersQuery =
        "SELECT userID, nama AS namaReceiver, keterangan AS ketReceiver, fcm_token AS fcm_token,foto AS fotoReceiver FROM users WHERE userID IN (?)";

      db.query(usersQuery, [idReceivers], (error, usersResults) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: error });
          return;
        }

        // Combine message results with user information based on id_receiver
        const combinedResults = messagesResults.map((message) => {
          const correspondingUser = usersResults.find(
            (user) => user.userID === message.id_receiver
          );
          return {
            ...message,
            namaReceiver: correspondingUser
              ? correspondingUser.namaReceiver
              : null,
            ketReceiver: correspondingUser
              ? correspondingUser.ketReceiver
              : null,
            fcm_token: correspondingUser ? correspondingUser.fcm_token : null,
            fotoReceiver: correspondingUser
              ? correspondingUser.fotoReceiver
              : null,
          };
        });

        res.status(200).json(combinedResults);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

router.get("/get_latest_self_message_doc", async (req, res) => {
  try {
    const { userID } = req.body;

    const messagesQuery =
      "SELECT m.* FROM messages m JOIN ( SELECT id_sender, MAX(tanggal_kirim) AS max_tanggal_kirim FROM messages WHERE id_receiver = ? GROUP BY  id_sender) latest ON m.id_sender = latest.id_sender AND m.tanggal_kirim = latest.max_tanggal_kirim ORDER BY m.tanggal_kirim DESC;";

    db.query(messagesQuery, userID, (error, messagesResults) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: error });
        return;
      }

      // Extract id_receiver values from the messagesResults
      const idSender = messagesResults.map((message) => message.id_sender);

      if (!idSender || idSender.length === 0) {
        // Handle the case where idReceivers is null or empty
        res.status(200).json([]);
        return;
      }

      const usersQuery =
        "SELECT userID, nama AS namaReceiver, keterangan AS ketReceiver, fcm_token AS fcm_token,foto AS fotoReceiver FROM users WHERE userID IN (?)";

      db.query(usersQuery, [idSender], (error, usersResults) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: error });
          return;
        }

        // Combine message results with user information based on id_receiver
        const combinedResults = messagesResults.map((message) => {
          const correspondingUser = usersResults.find(
            (user) => user.userID === message.id_sender
          );
          return {
            ...message,
            namaReceiver: correspondingUser
              ? correspondingUser.namaReceiver
              : null,
            ketReceiver: correspondingUser
              ? correspondingUser.ketReceiver
              : null,
            fcm_token: correspondingUser ? correspondingUser.fcm_token : null,
            fotoReceiver: correspondingUser
              ? correspondingUser.fotoReceiver
              : null,
          };
        });

        res.status(200).json(combinedResults);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

router.get("/get_individual_message", async (req, res) => {
  try {
    const { senderID, receiverID } = req.body;
    const query = `SELECT * FROM messages WHERE (id_sender = ? AND id_receiver = ?) OR (id_sender = ? AND id_receiver = ?) ORDER BY tanggal_kirim DESC;`;

    db.query(
      query,
      [senderID, receiverID, receiverID, senderID],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: error });
          return;
        }

        res.status(200).json(results);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
