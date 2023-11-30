const express = require("express");
const router = express.Router();

const path = require("path");

// router.use(express.static((__dirname, "..", "..", "public")));

router.get("/play", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "index.html"));
});

router.get("/play/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "index.js"));
});

router.get("/play/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "styles.css"));
});

// dynamic route
router.get("/play/:roomId", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "dynamic", "index.html"));
});

router.get("/play/:roomId/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "dynamic", "index.html"));
});

router.get("/play/:roomId/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "dynamic", "index.html"));
});

module.exports = router;
