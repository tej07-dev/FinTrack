const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
    try {
        const {
            expenseName,
            description,
            amount,
            category,
            date,
            paymentMethod,
            sharedWith,
            notes,
            isRecurring,
            budgetStatus,
            expenseTrend,
            currency,
            location,
        } = req.body;

        if (!expenseName || !description || !amount || !date) {
            return res.status(400).json({ message: "Please fill in all required fields." });
        }

        const newExpense = new Expense({
            userId: req.userId,
            expenseName,
            description,
            amount,
            category,
            date,
            paymentMethod,
            sharedWith,
            notes,
            isRecurring,
            budgetStatus,
            expenseTrend,
            currency,
            location,
            receiptImage: req.file ? req.file.filename : null,
        });

        await newExpense.save();
        res.status(201).json({ message: "Expense added successfully!", expense: newExpense });
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.userId });
        res.json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Error fetching expenses" });
    }
};

exports.getExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findById(id);
        res.json(expense);
    } catch (error) {
        console.error("Error fetching expenses:", error);
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        console.log("Expense ID:", id);
        console.log("User ID:", userId);
        console.log("Request Body:", req.body);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        const updatedExpenseData = { ...req.body };
        if (req.file) {
            updatedExpenseData.receiptImage = `/uploads/${req.file.filename}`;
        }

        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: id, userId },
            updatedExpenseData,
            { new: true, runValidators: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found or unauthorized" });
        }

        res.json({ message: "Expense updated successfully", expense: updatedExpense });
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const deletedExpense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!deletedExpense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        res.json({ message: "Expense deleted successfully", deletedExpense });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: "Error deleting expense" });
    }
};
