const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validation = require("./validation");

//router.get("/users", userController.index);
router.get("/users/sign_up", userController.signUp);

router.post("/users/sign_up", validation.validateUsers, userController.create);

module.exports = router;
