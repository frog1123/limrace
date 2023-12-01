const express = require("express");
const router = express.Router({ strict: true });

const path = require("path");

// router.use(express.static((__dirname, "..", "..", "public")));

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "index.html"));
});

router.get("/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "index.js"));
});

router.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "styles.css"));
});

router.get("/play", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "index.html"));
});

router.get("/play/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "index.js"));
});

router.get("/play/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "styles.css"));
});

// dynamic
router.get("/play/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "dynamic", "index.html"));
});

router.get("/play/dynamic/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "dynamic", "index.js"));
});

router.get("/play/dynamic/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "dynamic", "styles.css"));
});

module.exports = router;
