import React, { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import './Pages.css'

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data)
    //  const userId=data.userId;
      if (!response.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userName", data.name);
       console.log(data.userId);
       console.log(data.token);
       console.log(data.email);
       console.log(data.name);
       setIsLoggedIn(true); // Update state

      navigate("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.log(err)
    }
  };

  return (
    
    <div className="container mt-5">
       <div className="logo">
      <h1>💰</h1><br/>
      <h1>FinTrack</h1>
      </div>
      <h2><b>Login</b></h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <p className="mt-3">
        Don't have an account? <Link to="/login">Login here</Link>

      </p>
    </div>
  );
};

export default Login;
