import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AddExpense from "./components/AddExpense.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import Carousel from "./components/Corousel.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/login.jsx";
import Register from './pages/register.jsx';
import ProtectedRoute from "./ProtectedRoute.jsx";
import UpdateExpense from './components/UpdateExpense.jsx'
import VideoCard from './components/VideoCard.jsx'
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);


  return (
    <Router>
      <Routes>
        

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <>
                <Navbar isLoggedIn={isLoggedIn} />
                <Carousel />
                <div className="video-gallery">
                  <VideoCard
                    videoSrc=""
                    title="Expense Tracking Overview"
                    description="Learn how to track and manage your expenses effectively."
                  />
                  <VideoCard
                    videoSrc=""
                    title="Budget Planning Tips"
                    description="Discover practical budgeting tips to save money."
                  />
                </div>

              <Footer />
              </>
            </ProtectedRoute>
          } 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navbar isLoggedIn={isLoggedIn} />
                <Dashboard />
                <Footer />

              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/addexpense"
          element={
            <ProtectedRoute>
              <>
                <Navbar isLoggedIn={isLoggedIn} />
                <AddExpense />
                <Footer />

              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenselist"
          element={
            <ProtectedRoute>
              <>
                <Navbar isLoggedIn={isLoggedIn} />
                <ExpenseList />
                <Footer />

              </>
            </ProtectedRoute>
          }
        />
    

  
        <Route
          path="/update-expense/:id"
          element={
            <ProtectedRoute>
              <>
                <Navbar isLoggedIn={isLoggedIn} />
                <UpdateExpense />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
