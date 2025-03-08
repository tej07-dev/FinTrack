import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import './Dashboard.css';

export default function Dashboard() {
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [budget, setBudget] = useState(0);
    const [remainingBudget, setRemainingBudget] = useState(0);
    const [recommendations, setRecommendations] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [summary, setSummary] = useState({ total: 0, categoryTotals: {} });
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName") || "User";
    const userEmail = localStorage.getItem("userEmail") || "user@gmail.com";
    const [wantsToSetBudget, setWantsToSetBudget] = useState(null);
    const [isBudgetLoaded, setIsBudgetLoaded] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchBudget();
            fetchExpenses();
        }
    }, [token, navigate]);

    useEffect(() => {
        if (isBudgetLoaded) {
            setRemainingBudget(budget - totalExpenses);
        }
    }, [budget, totalExpenses, isBudgetLoaded]);

    useEffect(() => {
        if (isBudgetLoaded) {
            generateRecommendations(totalExpenses);
        }
    }, [totalExpenses, budget, isBudgetLoaded]);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get("http://localhost:3000/get-expenses", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setExpenses(response.data);
            calculateSummary(response.data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const fetchBudget = async () => {
        try {
            const response = await axios.get("http://localhost:3000/get-budget", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBudget(response.data.budget);
            setIsBudgetLoaded(true);
        } catch (error) {
            console.error("Error fetching budget:", error);
        }
    };

    const calculateSummary = (expenses) => {
        let total = 0;
        const categoryTotals = {};

        expenses.forEach((expense) => {
            total += expense.amount;
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        setTotalExpenses(total);
        setSummary({ total, categoryTotals });
    };

    const generateRecommendations = (total) => {
        let newRecommendations = [];

        if (total > budget * 0.9) {
            newRecommendations.push("🚨 Budget Overload! You're above 90% of your budget. Time for a 'No Spend' Challenge?");
        }
        if (total > budget * 0.75) {
            newRecommendations.push("⚠️ Warning! You're at 75% of your budget. Try meal-prepping instead of takeout this week!");
        }
        if (total > budget * 0.6) {
            newRecommendations.push("🍽️ Cut down on dining out! Homemade meals = Healthy wallet + Happy tummy.");
        }
        if (total > budget * 0.4 && total < budget * 0.6) {
            newRecommendations.push("💡 You're managing well! Consider setting aside extra savings for unexpected expenses.");
        }
        if (budget - total < 500) {
            newRecommendations.push("⏳ Low on funds! Try a 'Cash Only' weekend to limit spending.");
        }
        if (budget - total > 1000 && budget - total < 3000) {
            newRecommendations.push("💰 You're doing great! Why not move ₹500 to an emergency fund?");
        }
        if (total < budget * 0.3) {
            newRecommendations.push("🌟 Impressive! You're spending wisely. Time to explore investment options?");
        }
        if (total < budget * 0.2) {
            newRecommendations.push("🎉 Amazing! You're way under budget. Treat yourself to a small reward!");
        }
        if (total === 0) {
            newRecommendations.push("📅 No expenses recorded yet. Keep track of your spending for better financial control.");
        }

        setRecommendations(newRecommendations);
    };

    const saveBudgetToDatabase = async () => {
        if (isNaN(budget) || budget <= 0) {
            alert("Please enter a valid budget amount.");
            return;
        }

        try {
            await axios.post("http://localhost:3000/set-budget", { budget }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Budget saved successfully!");
        } catch (error) {
            console.error("Error saving budget:", error);
        }
    };

    const handleBudgetChange = (e) => {
        const newBudget = parseInt(e.target.value) || 0;
        setBudget(newBudget);
    };

    const pieChartData = Object.keys(summary.categoryTotals || {}).map((category) => ({
        name: category,
        value: summary.categoryTotals[category],
    }));

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

    return (
        <div className="container-d mt-5">
            <h2 className="text-center mb-4">Expense Management Dashboard</h2>

            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card-d p-3 shadow-sm text-center">
                        <h4 className="mt-2">Welcome, {userName}</h4>
                        <p>Email: {userEmail}</p>
                    </div>
                </div>
            </div>

            <div>
                <div className="col-md-6 offset-md-3">
                    <div className="card-d p-3 shadow-sm text-center">
                        <h5>Do you want to set a budget? or Do you want to update budget?</h5>
                        <div className="d-flex justify-content-center mt-2">
                            <button className="btn btn-success me-2" onClick={() => setWantsToSetBudget(true)}>Yes</button>
                            <button className="btn btn-danger" onClick={() => setWantsToSetBudget(false)}>No</button>
                        </div>
                    </div>
                </div>
            </div>

            {wantsToSetBudget && (
                <div className="row mt-3">
                    <div className="col-md-6 offset-md-3">
                        <div className="card-d p-3 shadow-sm">
                            <h5>Set Your Budget</h5>
                            <input type="number" className="form-control" value={budget} onChange={handleBudgetChange} />
                            <button className="btn btn-primary mt-2" onClick={saveBudgetToDatabase}>Save Budget</button>
                        </div>
                    </div>
                </div>
            )}

            
            
           <div className="row">
                <div className="col-md-4">
                    <div className="card-d p-3 shadow-sm bg-light">
                        <h5>Budget</h5>
                        <h4 className="text-success">Rs. {budget}</h4>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card-d p-3 shadow-sm bg-light">
                        <h5>Total Expenses</h5>
                        <h4 className="text-danger">Rs. {totalExpenses}</h4>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card-d p-3 shadow-sm bg-light">
                        <h5>Remaining Budget</h5>
                        <h4 className="text-success">Rs. {remainingBudget}</h4>
                    </div>
                </div>
            </div>
           
            <div className="row mt-4">
                <div className="col-md-12">
                     <div className="card p-4 shadow-sm">
                         <h4>Saving Recommendations</h4>
                         <ul className="list-group">
                             {recommendations.length > 0 ? (
                                 recommendations.map((rec, index) => (
                                     <li key={index} className="list-group-item">{rec}</li>
                                 ))
                             ) : (
                                <li className="list-group-item">🎉 You're managing expenses well! Keep it up.</li>
                            )}
                        </ul>
                    </div>
                </div>
             </div>
                         <div className="chart-container text-center mt-4">
                 <PieChart width={400} height={300}>
                     <Pie data={pieChartData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                         {pieChartData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                     </Pie>
                     <Tooltip />
                     <Legend />
                 </PieChart>
             </div>
            
             <div className="row mt-4">
                 <div className="col-md-12">
                     <div className="card-d p-4 shadow-sm">
                         <h4>Recent Expenses</h4>
                         <table className="table table-striped">
                             <thead>
                                 <tr>
                                     <th>Description</th>
                                     <th>Amount</th>
                                     <th>Category</th>
                                     <th>Date</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {expenses.length > 0 ? (
                                     expenses.map((expense, index) => (
                                         <tr key={index}>
                                             <td>{expense.description}</td>
                                             <td>Rs. {expense.amount}</td>
                                             <td>{expense.category}</td>
                                             <td>{new Date(expense.date).toLocaleDateString()}</td>
                                         </tr>
                                     ))
                                 ) : (
                                     <tr>
                                         <td colSpan="4" className="text-center text-muted">No expenses recorded yet.</td>
                                     </tr>
                                 )}
                             </tbody>
                        </table>
                    </div>
                </div>
            </div> 

        </div>
    );
}
