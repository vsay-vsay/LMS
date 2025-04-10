const express = require("express");
const { createUser, getUsers, editUser, deleteUser } = require("../controllers/userController");
const {protect} = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Only Admins can create, edit, and delete users in their domain
router.post("/create", protect, roleMiddleware(["Admin"]), createUser);
router.get("/", protect, roleMiddleware(["Admin"]), getUsers);
router.put("/:id", protect, roleMiddleware(["Admin"]), editUser);
router.delete("/:id", protect, roleMiddleware(["Admin"]), deleteUser);

module.exports = router;
