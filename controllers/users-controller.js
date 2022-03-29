const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");
const User = require("../models/user");

let DUMMY_USERS = [
  {
    id: 1,
    username: "MT",
    email: "test@test.com",
    password: "test1",
  },
];
const getUsers = (req, res, next) => {
  res.status(200).json({ DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Invalid inputs passed, Please check your data");
    error.code = 422;
    return next(error);
  }
  const { username, password, email, places } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new Error("Signing up failed. Please try again later.");
    error.code = 422;
    return next(error);
  }
  if (existingUser) {
    const error = new Error("User already exists. Input new email.");
    error.code = 422;
    return next(error);
  }

  const createdUser = new User({
    email,
    password,
    username,
    image: "test-user-image",
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new Error("Invalid inputs passed, Please check your data");
    error.code = 422;
    return next(error);
  }

  res.status(200).json({ user: createdUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    error = new Error("Invalid credentials");
    error.code = 401;
    throw error;
  }
  res.status(200).json({ message: "Logged In" });
};

module.exports = { getUsers, signup, login };
