const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const auth = require("../middleware/auth");

router.post("/", auth, groupController.createGroup);
router.delete("/:id", auth, groupController.deleteGroup);
router.get("/", auth, groupController.searchGroups);
router.post("/add-member", auth, groupController.addMember);

module.exports = router;
