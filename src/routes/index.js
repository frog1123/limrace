const express = require("express");
const router = express.Router({ strict: true });

const path = require("path");

// router.use(express.static((__dirname, "..", "..", "public")));

// root
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "index.html"));
});

router.get("/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "index.js"));
});

router.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "styles.css"));
});

// join-room
router.get("/join-room", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "join-room", "index.html"));
});

router.get("/join-room/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "join-room", "index.js"));
});

router.get("/join-room/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "join-room", "styles.css"));
});

router.get("/create-room", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "create-room", "index.html"));
});

router.get("/create-room/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "create-room", "index.js"));
});

router.get("/create-room/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "create-room", "styles.css"));
});

// dynamic
router.get("/room/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "room", "dynamic", "index.html"));
});

router.get("/room/dynamic/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "room", "dynamic", "index.js"));
});

router.get("/room/dynamic/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "room", "dynamic", "styles.css"));
});

// assets
router.get("/assets/logo.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "assets", "logo.ico"));
});

router.get("/assets/logo.svg", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "assets", "logo.svg"));
});

router.get("/assets/red_car.svg", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "assets", "red_car.svg"));
});

router.get("/assets/race_car.svg", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "assets", "race_car.svg"));
});

router.get("/assets/police_car.svg", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "assets", "police_car.svg"));
});

router.get("/assets/chevron-right.svg", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "assets", "chevron-right.svg"));
});

module.exports = router;
