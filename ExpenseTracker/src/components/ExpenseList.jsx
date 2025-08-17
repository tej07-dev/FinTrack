import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './ExpenseList.css'
import API from "../api/axios";
export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  


  
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchExpenses();
    }
  }, [token, navigate]);

  
  const fetchExpenses = async () => {
    try {
      const response = await API.get('/api/expenses/get-expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Failed to fetch expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/expenses/delete-expense/${id}`);
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
      setError("Failed to delete expense.");
    }
  };

  const handleUpdate=async (id)=>{
    navigate(`/update-expense/${id}`); 
  }
  return (
    <div>
      <h2 className="text-center mb-4">My Expenses</h2>

      {loading ? (
        <p>Loading expenses...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : expenses.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        expenses.map((expense) => (
          <div key={expense._id} className="card-e mb-3">
            <div className="card-body">
              <h5 className="card-title">{expense.expenseName}</h5>
                                  <table class="expense-table">
                        <tr>
                            <th>Field</th>
                            <th>Details</th>
                        </tr>
                        <tr>
                            <td><b>Description</b></td>
                            <td>{expense.description}</td>
                        </tr>
                        <tr>
                            <td><b>Amount</b></td>
                            <td><span class="text-highlight"> {expense.amount}</span></td>
                        </tr>
                        <tr>
                            <td><b>Category</b></td>
                            <td>{expense.category}</td>
                        </tr>
                        <tr>
                            <td><b>Date</b></td>
                            <td>{new Date(expense.date).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td><b>Payment Method</b></td>
                            <td>{expense.paymentMethod}</td>
                        </tr>
                        <tr>
                            <td><b>Shared With</b></td>
                            <td>{expense.sharedWith ||"No one"}</td>
                        </tr>
                        <tr>
                            <td><b>Notes</b></td>
                            <td>{expense.notes || "No notes added"}</td>
                        </tr>
                        <tr>
                            <td><b>Is Recurring?</b></td>
                            <td>{expense.isRecurring ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                            <td><b>Budget Status</b></td>
                            <td>{expense.budgetStatus || "N/A"}</td>
                        </tr>
                        <tr>
                            <td><b>Expense Trend</b></td>
                            <td>{expense.expenseTrend}</td>
                        </tr>
                        <tr>
                            <td><b>Currency</b></td>
                            <td>{expense.currency || "INR"}</td>
                        </tr>
                        <tr>
                            <td><b>Location</b></td>
                            <td>{expense.location || "Not specified"}</td>
                        </tr>
                        <tr>
                          <td>Receipt Image</td>
                          <td>
                  {expense.receiptImage ? (
                    <img
                      src={`/api/expenses/uploads/${expense.receiptImage}`}
                      alt="Receipt"
                      width="400"
                      height="400"
                      className="img-thumbnail"
                    />
                  ) : (
                    "No Receipt"
                  )}
                </td>

                        </tr>
                    </table>


              <div className="d-flex justify-content-center gap-2">
                    <button className="btn-e btn-e-primary" onClick={() => handleUpdate(expense._id)}>
                      Update
                    </button>
                    <button className="btn-e btn-e-primary" onClick={() => handleDelete(expense._id)}>
                      Delete
                    </button>
                  </div>
         </div>
          </div>
        ))
      )}
    </div>
  );
}
