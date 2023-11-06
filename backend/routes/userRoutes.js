const express = require("express");
const {
	registerUser,
	authUser,
	allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//Endpoint ==> /api/user
router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
// router.route('/').get(allUsers); //We can group methods for same route like on line number 12

module.exports = router;
