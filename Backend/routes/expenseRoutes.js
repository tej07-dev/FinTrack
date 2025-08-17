const express = require("express");
const router = express.Router();
const multer = require("multer");
const verifyToken = require("../middleware/authMiddleware");
const { addExpense, getExpenses, getExpense, updateExpense, deleteExpense } = require("../controllers/expenseController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/add-expense", verifyToken, upload.single("receiptImage"), addExpense);
router.get("/get-expenses", verifyToken, getExpenses);
router.get("/get-expense/:id", verifyToken, getExpense);
router.put("/update-expense/:id", verifyToken, upload.single("receiptImage"), updateExpense);
router.delete("/delete-expense/:id", verifyToken, deleteExpense);

module.exports = router;
