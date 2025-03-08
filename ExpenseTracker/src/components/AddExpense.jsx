import React from 'react'
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import axios from 'axios'
import './AddExpense.css'
const AddExpense = () => {
  const [expense, setExpense] = useState({
    expenseName: "",
    description: "",
    amount: "",
    category: "Food",
    date: "",
    paymentMethod: "Credit Card",
    sharedWith: "",
    notes: "",
    isRecurring: false,
    budgetStatus: "Within Budget",
    expenseTrend: "Stable",
    currency: "INR",
    location: "",
    receiptImage:null,
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    
    const { name, value, type, checked, files } = e.target;
    setExpense({
      ...expense,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!expense.expenseName || !expense.description || !expense.amount || !expense.date) {
      setAlert({ message: "Please fill in all required fields!", type: "danger" });
      return;
    }

    setLoading(true);
    setAlert({ message: "", type: "" });

    try {
      const formData = new FormData();
      Object.keys(expense).forEach((key) => {
        formData.append(key, expense[key]);
      });

      const response = await axios.post("http://localhost:3000/add-expense", formData, {
        headers: { "Content-Type": "multipart/form-data",Authorization:`Bearer ${localStorage.getItem("token")}`},
      });

      setAlert({ message: "Expense added successfully!", type: "success" });
      setExpense({
        expenseName: "",
        description: "",
        amount: "",
        category: "Food",
        date: "",
        paymentMethod: "Credit Card",
        sharedWith: "",
        notes: "",
        isRecurring: false,
        budgetStatus: "Within Budget",
        expenseTrend: "Stable",
        currency: "USD",
        location: "",
        receiptImage: null,
      });
    } catch (error) {
      setAlert({ message: "Failed to add expense. Please try again!", type: "danger" });
    }

    setLoading(false);
  };


  return (
    <div className="container-a mt-4">
      <h2 className="text-center">Add Expense</h2>
      {alert.message && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <form className="card-a p-4" onSubmit={handleSubmit}>
      <div class="mb-3">
            <label class="form-label">Name</label>
            <input type="text" class="form-control" name="expenseName" placeholder="Enter expense name" value={expense.expenseName} onChange={handleChange} required/>
        </div>

        
        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            name="description"
            value={expense.description}
            onChange={handleChange}
            required
            placeholder="Enter expense description"
          />
        </div>

        
        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            name="amount"
            value={expense.amount}
            onChange={handleChange}
            required
            placeholder="Enter amount"
          />
        </div>

        
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select className="form-select" name="category" value={expense.category} onChange={handleChange} required>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
        </div>

      
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="datetime-local"
            className="form-control"
            name="date"
            value={expense.date}
            onChange={handleChange}
            required
          />
        </div>

      
        <div className="mb-3">
          <label className="form-label">Payment Method</label>
          <select className="form-select" name="paymentMethod" value={expense.paymentMethod} onChange={handleChange} required>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Not Done">Not Done</option>
          </select>
        </div>

        <div className="mb-3">
              <label className="form-label">Shared With (Optional)</label>
              <input type="text" className="form-control" name="sharedWith" value={expense.sharedWith} onChange={handleChange} />
            </div>

        
        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea className="form-control" name="notes" value={expense.notes} onChange={handleChange} placeholder="Additional details"></textarea>
        </div>
 
        
       
        <div className="mb-3">
          <label className="form-label">Is Recurring?</label>
          <select className="form-select" name="isRecurring" value={expense.isRecurring} onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
     
        <div class="mb-3">
            <label class="form-label">Budget Status</label>
            <select class="form-select" name="budgetStatus" value={expense.budgetStatus} onChange={handleChange}>
                <option value="Within Budget">Within Budget</option>
                <option value="Over Budget">Over Budget</option>
                <option value="Under Budget">Under Budget</option>
            </select>
        </div>

        <div class="mb-3">
            <label class="form-label">Expense Trend</label>
            <select class="form-select" name="expenseTrend" value={expense.expenseTrend} onChange={handleChange}>
                <option value="Increased">Increased</option>
                <option value="Decreased">Decreased</option>
                <option value="Stable">Stable</option>
            </select>
        </div>

        
      
        <div className="mb-3">
          <label className="form-label">Currency</label>
          <select className="form-select" name="currency" value={expense.currency} onChange={handleChange}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="other">other</option>
          </select>
        </div>

        <div class="mb-3">
            <label class="form-label">Location (Optional)</label>
            <input type="text" class="form-control" name="location" placeholder="Enter location" value={expense.location} onChange={handleChange} />
        </div>

        <div class="mb-3">
            <label for="receiptImage" class="form-label">Upload Receipt (Optional)</label>
            <input type="file" class="form-control" name="receiptImage" onChange={handleChange}/>
       </div>

       <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Saving..." : "Add Expense"}
            </button>
          
      </form>
    </div>
  );
};

export default AddExpense;
