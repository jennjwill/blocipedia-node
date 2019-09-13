const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//router.get("/users", userController.index);
router.get("/users/sign_up", userController.signUp);

module.exports = router;
