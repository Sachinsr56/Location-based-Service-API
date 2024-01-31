const express = require("express");
const colors = require("colors");
require("dotenv").config();
const connectDB = require("./config/db");

const locationRoutes = require("./routes/locationRoutes");

const app = express();
connectDB();
app.use(express.json());

app.use("/api", locationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`.yellow.bold);
});
