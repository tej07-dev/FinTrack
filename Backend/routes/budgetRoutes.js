const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { setBudget, getBudget } = require("../controllers/budgetController");

router.post("/set-budget", verifyToken, setBudget);
router.get("/get-budget", verifyToken, getBudget);

module.exports = router;
