"use strict";

const faker = require("faker");

let users = [
  {
    username: "simonsimon",
    email: "simon@test.com",
    password: "123456",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "standard"
  },
  {
    username: "rogerroger",
    email: "roger@test.com",
    password: "123456",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "standard"
  },
  {
    username: "nicknick",
    email: "nick@test.com",
    password: "123456",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "standard"
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
