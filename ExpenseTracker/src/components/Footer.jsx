import React from 'react';
import './Home.css';

function Footer() {
  return (
    <footer className="footer11">
      <div className="container text-center py-4">
        <div className="row">
          
          <div className="col-md-4 f1">
            <h5>Quick Links</h5>
            <ul className="list-group">
              <li className="list-item"><a href="/dashboard">Dashboard</a></li>
              <li className="list-item"><a href="/addexpense">Add Expense</a></li>
              <li className="list-item"><a href="/expenselist">Expense List</a></li>
            </ul>
          </div>

        
          <div className="col-md-4 f1">
            <h5>About Us</h5>
            <p>FinTrack : Expense Tracker that helps you manage your expenses efficiently with saving recommendations.</p>
          </div>

        
          <div className="col-md-4 f1">
            <h5>Contact Us</h5>
            <p>Email: fintracksupport@gmail.com</p>
            <p>Phone: 1234567890</p>
          </div>
        </div>

        <hr />
        <p className="f1">Copyrights © 2025 Expense Tracker. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
