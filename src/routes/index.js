const express = require("express");
const router = express.Router();

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
  console.log("Static js");
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "index.js"));
});

router.get("/play/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "styles.css"));
});

// dynamic
router.get("/play/:id", (req, res) => {
  console.log("Dynamic Index.html route");
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "dynamic", "index.html"));
});

router.get("/play/:id/index.js", (req, res) => {
  console.log("Dynamic Index.js route");
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "dynamic", "index.js"));
});

router.get("/play/:id/styles.css", (req, res) => {
  console.log("Dynamic Styles.css route");
  res.sendFile(path.join(__dirname, "..", "..", "public", "play", "dynamic", "styles.css"));
});

module.exports = router;
