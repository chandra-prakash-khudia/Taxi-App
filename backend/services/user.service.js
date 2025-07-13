const userModel = require("../models/user.model.js");

// Creates a new user with the provided details

module.exports.createUser = async ({
  firstname,
  lastname,
  email,
  password,
}) => {
  // Checks if required fields are present, throws an error if any are missing

  if (!firstname || !email || !password) {
    throw new Error("All fields are required");
  }
  // Creates a new user document in the database

  const user = userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });
  // Returns the created user
  return user;
};
