const express = require("express");
const router = express.Router();
const userController = require("../contollers/userController");
const { validateEmail } = require("../middleware/validate");

router.post("/", validateEmail, userController.createUser);

router.get("/", userController.getUsers);

router.get("/:id", userController.getUserById);

router.put("/:id", validateEmail, userController.updateUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;
