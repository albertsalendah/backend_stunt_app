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
const tabel_data_status_gizi = require("./routes/tabel_data_status_gizi")
const vaksin = require("./routes/vaksin");
const menajemen_gizi = require("./routes/menajemen_gizi");
const rekomendasi_menu_makan = require("./routes/rekomendasi_menu_makan");


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
// Serve static files from the Flutter web app build directory
//app.use(express.static('foto'))

io.on("connection", (socket) => {
  console.log("connected");
  console.log("User : " + socket.id);
  socket.on("test", (msg) => {
    console.log(msg);
  });
});

(async () => {
  app.use("/", loginRoute);
  app.use("/", sendMessage);

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
