import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import API from "../api/axios";
const UpdateExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [originalExpense, setOriginalExpense] = useState(null);
  const [updatedExpense, setUpdatedExpense] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await API.get(`/api/expenses/get-expense/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOriginalExpense(response.data);
      } catch (error) {
        console.error("Error fetching expense:", error);
      }
    };

    fetchExpense();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setUpdatedExpense((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(updatedExpense).length === 0) {
        setAlert({ message: "No changes made!", type: "warning" });
        return;
    }

    setLoading(true);
    setAlert({ message: "", type: "" });

    try {
        const formData = new FormData();
        Object.keys(updatedExpense).forEach((key) => {
            formData.append(key, updatedExpense[key]);
        });


      
        const token = localStorage.getItem("token");
        if (!token) {
            setAlert({ message: "Authentication failed: No token", type: "danger" });
            setLoading(false);
            return;
        }

        await API.put(`/api/expenses/update-expense/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`, 
            },
        });

        setAlert({ message: "Expense updated successfully!", type: "success" });
        setTimeout(() => navigate("/expenselist"), 1500);
    } catch (error) {
        console.error("Error updating expense:", error.response?.data || error.message);
        setAlert({ message: "Failed to update expense. Please try again!", type: "danger" });
    }

    setLoading(false);
};

  if (!originalExpense) return <p>Loading expense details...</p>;

  return (
    <div className="container-a mt-4">
      <h2 className="text-center">Update Expense</h2>
      {alert.message && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <form className="card-a p-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Expense Name</label>
          <input
            type="text"
            className="form-control"
            name="expenseName"
            defaultValue={originalExpense.expenseName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            name="description"
            defaultValue={originalExpense.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            name="amount"
            defaultValue={originalExpense.amount}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select className="form-select" name="category" defaultValue={originalExpense.category} onChange={handleChange}>
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
            defaultValue={originalExpense.date}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Payment Method</label>
          <select className="form-select" name="paymentMethod" defaultValue={originalExpense.paymentMethod} onChange={handleChange}>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Not Done">Not Done</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea className="form-control" name="notes" defaultValue={originalExpense.notes} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Is Recurring?</label>
          <select className="form-select" name="isRecurring" value={originalExpense.isRecurring} onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
     
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Expense"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateExpense;
