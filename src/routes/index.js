const express = require("express");
const router = express.Router();

const PORT = process.env.PORT || 3000;
const app = express();
const path = require("path");

router.use(express.static("public"));

router.get("/", (req, res) => {
  console.log("ASDasdasd");

  // res.sendFile(path.join(__dirname, "/public/index.html"));
});

router.get("/play/:roomId", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/public/index.html"));
});

module.exports = router;
