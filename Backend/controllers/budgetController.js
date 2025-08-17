const Budget = require("../models/Budget");

exports.setBudget = async (req, res) => {
    try {
        const { budget } = req.body;
        const userId = req.userId;

        if (!budget || budget < 0) {
            return res.status(400).json({ message: "Invalid budget value." });
        }

        let userBudget = await Budget.findOne({ userId });
        if (userBudget) {
            userBudget.budget = budget;
        } else {
            userBudget = new Budget({ userId, budget });
        }

        await userBudget.save();
        res.json({ message: "Budget set successfully!", budget: userBudget.budget });
    } catch (error) {
        console.error("Error setting budget:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getBudget = async (req, res) => {
    try {
        const userBudget = await Budget.findOne({ userId: req.userId });

        if (!userBudget) {
            return res.status(404).json({ message: "Budget not set yet." });
        }

        res.json({ budget: userBudget.budget });
    } catch (error) {
        console.error("Error fetching budget:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
