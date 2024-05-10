const userService = require("../services/users.service");

const usersRoute = require("express").Router();

usersRoute.post("/", userService);

module.exports = usersRoute;
