// /* eslint-disable no-undef */
const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

const HTTP_PORT = 80;
const HTTPS_PORT = 443;

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/lurny.net/privkey.pem", "utf8"),
  ca: fs.readFileSync("/etc/letsencrypt/live/lurny.net/fullchain.pem", "utf8"),
  cert: fs.readFileSync("/etc/letsencrypt/live/lurny.net/cert.pem", "utf8"),
};

connectDB();

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Redirect from HTTP to HTTPS
const httpApp = express();
httpApp.get("*", (req, res) => {
  res.redirect(`https://${req.headers.host}${req.url}`);
});

// Start HTTP server for redirection to HTTPS
const httpServer = http.createServer(httpApp);
httpServer.listen(HTTP_PORT, () => {
  console.log(
    `HTTP Server running on port ${HTTP_PORT} and redirecting to HTTPS`
  );
});

// Redirect www.lurny.net to lurny.net
app.use((req, res, next) => {
  if (req.hostname === "www.lurny.net") {
    res.redirect(301, `https://lurny.net${req.url}`);
  } else {
    next();
  }
});

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

const PORT = process.env.PORT || 443;

const httpsServer = https.createServer(options, app);
httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
});

/* eslint-disable no-undef */
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
