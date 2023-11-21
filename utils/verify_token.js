const jwt = require("jsonwebtoken");
require('dotenv').config()

function verifyToken(req, res, next) {
  const token = req.headers.authorization || req.headers["x-access-token"];; // You can pass the token in the header
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token is not valid" });
    }
    req.userID = decoded.userID; // Attach the userID to the request for later use
    next();
  });
}

module.exports = verifyToken;

