const mongoose = require("mongoose");
const {
  addLocation,
  calculateDistance,
  findClosestLocation,
} = require("./controllers/locationController");

beforeAll(async () => {
  try {
    const conn = await mongoose.connect(process.env.mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Test MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Test Error:${error.message}`);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Location API Endpoints", () => {
  describe("addLocation", () => {
    test("should add a new location to the database", async () => {
      const req = { body: { latitude: 37.7749, longitude: -122.4194 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      await addLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Location added successfully.",
      });
    }, 10000);

    test("should handle invalid coordinates", async () => {
      const req = { body: { latitude: 100, longitude: -200 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      await addLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid latitude or longitude.",
      });
    });

    test("should handle duplicate coordinates", async () => {
      const req = { body: { latitude: 37.7749, longitude: -122.4194 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      await addLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Location already exists.",
      });
    }, 10000);
  });

  describe("calculateDistance", () => {
    test("should calculate distance between two sets of coordinates", async () => {
      const req = {
        body: {
          startLatitude: 37.7749,
          startLongitude: -122.4194,
          endLatitude: 34.0522,
          endLongitude: -118.2437,
        },
      };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      await calculateDistance(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ distance: expect.any(Number) });
    });

    test("should handle invalid coordinates", async () => {
      const req = {
        body: {
          startLatitude: 37.7749,
          startLongitude: -122.4194,
          endLatitude: "invalid",
          endLongitude: -118.2437,
        },
      };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      await calculateDistance(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid start or end coordinates.",
      });
    });
  });

  describe("findClosestLocation", () => {
    test("should find the closest location to a given point", async () => {
      const req = {
        body: { targetLatitude: 40.7128, targetLongitude: -74.006 },
      };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      await findClosestLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        closestLocation: expect.any(Object),
        distance: expect.any(Number),
      });
    }, 10000);

    test("should handle invalid target coordinates", async () => {
      const req = {
        body: { targetLatitude: "invalid", targetLongitude: -74.006 },
      };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      await findClosestLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid target coordinates.",
      });
    });
  });
});
