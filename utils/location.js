const API_KEY = "AIzaSyDtJowibGMBL_dmqLZaoFGISpZxqrleCp4";

const axios = require("axios");

const getCoordinatesByAddress = async (address) => {
  const coordinatesResp = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = coordinatesResp.data;
  if (!data || data.status === "ZERO_RESULTS") {
    error = new Error("Coordinates could not befound for this address");
    error.code = 404;
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
};

module.exports = getCoordinatesByAddress;
