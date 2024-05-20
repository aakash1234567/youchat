const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/", auth, admin, userController.createUser);
router.get("/", auth, userController.searchUsers);
router.put("/:id", auth, admin, userController.editUser);

module.exports = router;
