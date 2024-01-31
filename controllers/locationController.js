const schema = require("../config/database.schema");
const Location = schema.Location;

const isValidCoordinates = (latitude, longitude) => {
  return (
    typeof latitude === "number" &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === "number" &&
    longitude >= -180 &&
    longitude <= 180
  );
};

const addLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!isValidCoordinates(latitude, longitude)) {
      return res.status(400).json({ error: "Invalid latitude or longitude." });
    }

    const existingLocation = await Location.findOne({ latitude, longitude });

    if (existingLocation) {
      return res.status(400).json({ error: "Location already exists." });
    }

    const newLocation = new Location({ latitude, longitude });
    await newLocation.save();

    res.status(201).json({ message: "Location added successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const calculateDistance = async (req, res) => {
  try {
    const { startLatitude, startLongitude, endLatitude, endLongitude } =
      req.body;

    if (
      !isValidCoordinates(startLatitude, startLongitude) ||
      !isValidCoordinates(endLatitude, endLongitude)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid start or end coordinates." });
    }

    const earthRadius = 6371;
    const toRadians = (angle) => (angle * Math.PI) / 180;

    const dLat = toRadians(endLatitude - startLatitude);
    const dLon = toRadians(endLongitude - startLongitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(startLatitude)) *
        Math.cos(toRadians(endLatitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    res.status(200).json({ distance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const findClosestLocation = async (req, res) => {
  try {
    const { targetLatitude, targetLongitude } = req.body;

    if (!isValidCoordinates(targetLatitude, targetLongitude)) {
      return res.status(400).json({ error: "Invalid target coordinates." });
    }

    const allLocations = await Location.find(
      {},
      { _id: 0, latitude: 1, longitude: 1 }
    );

    let closestLocation;
    let minDistance = Number.MAX_VALUE;

    allLocations.forEach((location) => {
      const distance = haversineDistance(
        targetLatitude,
        targetLongitude,
        location.latitude,
        location.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestLocation = location;
      }
    });

    if (!closestLocation) {
      return res.status(404).json({ error: "No locations found." });
    }

    res.status(200).json({ closestLocation, distance: minDistance });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal Server Error.", details: error.message });
  }
};

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

module.exports = { addLocation, calculateDistance, findClosestLocation };
