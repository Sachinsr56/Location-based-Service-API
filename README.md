```markdown
# Geolocation API

This project implements a simple Geolocation API with endpoints for adding locations, calculating distances, and finding the closest location to a given point.

## Getting Started

### Prerequisites

- Node.js (>=14.x)
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   cd geolocation
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the project root and add the following:

   ```env
   MONGO_URI=your-mongodb-connection-string
   ```

4. Start the server:

   ```bash
   npm start
   ```

   The server will be running on `http://localhost:3000`.

## API Endpoints

### 1. Add Location

- **Endpoint:** `POST /api/addLocation`
- **Request Body:**

  ```json
  {
    "latitude": 37.7749,
    "longitude": -122.4194
  }
  ```

- **Response:**

  ```json
  {
    "message": "Location added successfully."
  }
  ```

### 2. Calculate Distance

- **Endpoint:** `POST /api/calculateDistance`
- **Request Body:**

  ```json
  {
    "startLatitude": 37.7749,
    "startLongitude": -122.4194,
    "endLatitude": 40.7128,
    "endLongitude": -74.0060
  }
  ```

- **Response:**

  ```json
  {
    "distance": 4151.33
  }
  ```

### 3. Find Closest Location

- **Endpoint:** `POST /api/findClosestLocation`
- **Request Body:**

  ```json
  {
    "targetLatitude": 40.7128,
    "targetLongitude": -74.0060
  }
  ```

- **Response:**

  ```json
  {
    "closestLocation": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "distance": 4151.33
  }
  ```

## Testing

Run tests using:

```bash
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

Replace `<repository-url>` with the actual URL of your repository. Copy the entire content and paste it into your README.md file.