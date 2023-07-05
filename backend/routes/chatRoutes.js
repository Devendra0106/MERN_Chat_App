const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats } = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
// router.route("/group").post(protect, createGroup);
// router.route("/grouprename").put(protect, renameGroup);
// router.route("/groupremove").post(protect, removeFromGroup);
// router.route("/groupadd").post(protect, addToGroup);

module.exports = router;
