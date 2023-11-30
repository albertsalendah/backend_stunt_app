require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const port = process.env.PORT;
const server = http.createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");
var io = require("socket.io")(server, { cors: { origin: "*" } });

const verifyToken = require("./utils/verify_token");
const loginRoute = require("./routes/login_register");
const sendMessage = require("./routes/message");
const data_anak = require("./routes/data_anak");
const akun = require("./routes/akun");
const tabel_data_status_gizi = require("./routes/tabel_data_status_gizi");
const vaksin = require("./routes/vaksin");
const menajemen_gizi = require("./routes/menajemen_gizi");
const rekomendasi_menu_makan = require("./routes/rekomendasi_menu_makan");
const sendEmail = require("./routes/send_email");
const { log } = require("console");

app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// Serve static files from ProfilePicture directory
app.use('/ProfilePicture',express.static('ProfilePicture'))
app.use('/messages_file',express.static('messages_file'))
// app.use((req, res, next) => {
//   console.log(`Received request: ${req.method} ${req.url}`);
//   next();
// });

var socketClients = {};

io.on("connection", (socket) => {
  socket.on("signIn", (clientID) => {
    socketClients[clientID] = socket;
    //console.log("User " + clientID + " is Connected");

    // Use socket.broadcast.emit to exclude the sender
    socket.broadcast.emit("userConnected", { userId: clientID });
  });

  socket.on("disconnect", () => {
    // Get the disconnected user's ID
    const disconnectedUserId = Object.keys(socketClients).find(
      (id) => socketClients[id] === socket
    );
    //console.log("User " + disconnectedUserId + " is DisConnected");
    if (disconnectedUserId) {
      // Remove the disconnected user from the list
      delete socketClients[disconnectedUserId];

      // Broadcast the disconnection event to all connected clients
      socket.broadcast.emit("userDisconnected", { userId: disconnectedUserId });
    }
  });

  socket.on("typing", (type) => {
    let senderID = type.senderID;
    let receiverID = type.receiverID;
    let isTyping = type.isTyping;
    if (socketClients[receiverID])
      socketClients[receiverID].emit("typing", {
        isTyping: isTyping,
        senderID: senderID,
      });
  });

  socket.on("messageReceive", (msg) => {
    let messageId = msg.messageId;
    let senderID = msg.senderID;
    let receiverID = msg.receiverID;
    if (socketClients[receiverID])
      socketClients[receiverID].emit("messageReceive", {
        messageId: messageId,
        senderID: senderID,
        receiverID: receiverID,
      });
  });

  socket.on("messageRead", (msg) => {
    let messageId = msg.messageId;
    let senderID = msg.senderID;
    let receiverID = msg.receiverID;
    if (socketClients[receiverID])
      socketClients[receiverID].emit("messageRead", {
        messageId: messageId,
        senderID: senderID,
        receiverID: receiverID,
      });
  });

  socket.on("messageReadList", (data) => {
    let updates = data.updates;
    let receiverID = data.receiverID;

    if (socketClients[receiverID])
      socketClients[receiverID].emit("messageReadList", {
        datas: updates,
      });
  });
});


(async () => {
  app.use("/", loginRoute);
  app.use("/", sendMessage);
  app.use("/", sendEmail);

  app.use(verifyToken);
  app.use("/", akun);
  app.use("/", data_anak);
  app.use("/", tabel_data_status_gizi);
  app.use("/", vaksin);
  app.use("/", menajemen_gizi);
  app.use("/", rekomendasi_menu_makan);

  server.listen(port, "0.0.0.0", function () {
    console.log("App running on *: " + port);
  });
})();
