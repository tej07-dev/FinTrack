import React from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Home.css';

function Navbar() {

  const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName"); // Get logged-in user email
  
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      navigate("/login");
  };



  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">💰FinTrack</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {token && (
           <>

            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>   
            <li className="nav-item">
              <Link className="nav-link" to="/addexpense">Add Expense</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/expenselist">Expense List</Link>
            </li>
            </>
                        )}
          </ul>
          <ul className="navbar-nav ms-auto">
                        {token ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">Welcome, {userName}</span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn" onClick={handleLogout}>Logout</button>
                                    
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                            </>
                        )}
                    </ul>


        </div>
      </div>
    </nav>
  );
}

export default Navbar;
