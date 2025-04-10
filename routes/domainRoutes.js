const express = require("express");
const { createDomain, checkDomain } = require("../controllers/domainController");
const {protect} = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/create-domain", protect, roleMiddleware(["super-admin"]), createDomain);
router.post("/check-domain", checkDomain);

module.exports = router;
