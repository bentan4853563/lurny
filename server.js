// /* eslint-disable no-undef */
const path = require("path");
const fs = require("fs");
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

connectDB();

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Redirect www.lurny.net to lurny.net
app.use((req, res, next) => {
  if (req.hostname === "www.lurny.net") {
    res.redirect(301, `https://lurny.net${req.url}`);
  } else {
    next();
  }
});

app.use("/api/lurny", require("./routes/api/lurnyRoutes"));
app.use("/api/auth", require("./routes/api/newAuth"));
app.use("/api/study", require("./routes/api/studyRouter"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 443;

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
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

// app.use("/api/lurny", require("./routes/api/lurnyRoutes"));
// app.use("/api/auth", require("./routes/api/newAuth"));
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
