const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",  // Referencing the User model
        required: true 
      },
    
  expenseName: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  paymentMethod: { type: String, required: true },
  sharedWith: { type: String, default: "" },
  notes: { type: String, default: "" },
  isRecurring: { type: Boolean, default: false },
  budgetStatus: { type: String, default: "Within Budget" },
  expenseTrend: { type: String, default: "Stable" },
  currency: { type: String, default: "USD" },
  location: { type: String, default: "" },
  receiptImage: { type: String, default: null }, 
}, { timestamps: true });

module.exports = mongoose.model("Expense", ExpenseSchema);
