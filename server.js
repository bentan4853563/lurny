const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/lurny.net/privkey.pem", "utf8"),
  ca: fs.readFileSync("/etc/letsencrypt/live/lurny.net/fullchain.pem", "utf8"),
  cert: fs.readFileSync("/etc/letsencrypt/live/lurny.net/cert.pem", "utf8"),
};

const app = express();
const httpApp = express(); // Create a separate Express instance for HTTP

connectDB();

// Apply middleware to HTTPS Express app
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Redirect www.lurny.net to lurny.net (HTTPS)
app.use((req, res, next) => {
  if (req.hostname === "www.lurny.net") {
    res.redirect(301, `https://lurny.net${req.url}`);
  } else {
    next();
  }
});

// Define routes for HTTPS
app.use("/api/auth", require("./routes/api/authRouter"));
app.use("/api/user", require("./routes/api/userRouter"));
app.use("/api/lurny", require("./routes/api/lurnyRouter"));
app.use("/api/study", require("./routes/api/studyRouter"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

// Redirect all HTTP traffic to HTTPS
httpApp.use((req, res) => {
  const host = req.headers.host.replace(/:\d+$/, ""); // Remove port number if present
  res.redirect(301, `https://${host}${req.url}`);
});

// Set up HTTP Server on port 80
const HTTP_PORT = 80;
http.createServer(httpApp).listen(HTTP_PORT, () => {
  console.log(`HTTP Server running on port ${HTTP_PORT}`);
});

// Set up HTTPS Server on port 443 or custom PORT
const HTTPS_PORT = process.env.PORT || 443;
https.createServer(options, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS Server started on port ${HTTPS_PORT}`);
});

// const path = require("path");
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// require("dotenv").config();

// const app = express();

// connectDB();

// app.use(express.json({ limit: "500mb" }));
// app.use(express.urlencoded({ extended: true }));

// app.use(cors());

// app.use("/api/auth", require("./routes/api/authRouter"));
// app.use("/api/user", require("./routes/api/userRouter"));
// app.use("/api/lurny", require("./routes/api/lurnyRouter"));
// app.use("/api/study", require("./routes/api/studyRouter"));

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/dist"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
//   });
// }

// const PORT = process.env.PORT || 5005;

// app.listen(PORT, () => {
//   console.log(`Server started on ${PORT}`);
// });
