const { validationResult } = require("express-validator");
const getCoordinatesByAddress = require("../utils/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Obawole",
    description: "home",
    location: {
      lat: 6.65121,
      long: 3.33718,
    },
    address: "Obawole sha",
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    error = new Error("Something went wrong. Could not find a place");
    error.code = 500;
    return next(error);
  }
  if (!place) {
    const error = new Error("Could not find a place for the provided ID");
    error.code = 404;
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    error = new Error("Something went wrong. Could not find a place");
    error.code = 500;
    return next(error);
  }

  if (!places || places.length === 0) {
    const error = new Error("Could not find a place for the provided user ID");
    error.code = 404;
    throw error;
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Invalid inputs passed, Please check your data");
    error.code = 422;
    return next(error);
  }

  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordinatesByAddress(address);
  } catch (error) {
    error = new Error(
      "Could not get coordinates. Please ensure address is valid."
    );
    error.code = 422;
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    creator,
    image: "test-image",
  });
  try {
    await createdPlace.save();
  } catch (error) {
    error = new Error("Could not create place.");
    error.code = 500;
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Invalid inputs passed, Please check your data");
    error.code = 422;
    throw error;
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    error = new Error("Could not find place provided by this ID.");
    error.code = 500;
    return next(error);
  }

  place.title = title;
  place.description = description;

  const updatedPlace = await place.save();
  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = Place.findById(placeId);
  } catch (error) {
    error = new Error("Could not find a place with that ID");
    error.code = 404;
    return next(error);
  }
  try {
    await place.remove();
  } catch (error) {
    error = new Error("Could not find a place with that ID");
    error.code = 404;
    return next(error);
  }
  res.status(200).json({ message: `Place has been deleted` });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
