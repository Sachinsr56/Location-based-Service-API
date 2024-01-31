const express = require("express");
const {
  addLocation,
  calculateDistance,
  findClosestLocation,
} = require("../controllers/locationController");

const router = express.Router();
router.post("/location", addLocation);
router.post("/distance", calculateDistance);
router.post("/closest", findClosestLocation);
module.exports = router;
