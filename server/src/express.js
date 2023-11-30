const express = require("express");

const PORT = process.env.PORT || 3000;
const app = express();
const path = require("path");

app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log("ASDasdasd");

  // res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/play/:roomId", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`express server running on port ${PORT}`);
});
