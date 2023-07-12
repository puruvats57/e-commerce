import React from "react";
import "../data.css"; // Import the CSS file

function Register(props) {
  const backendUrl = process.env.REACT_APP_BACKEND_LIVE_URL;
  return (
    <div className="login-container">
      <h2>Register page</h2>

      <form action={`${backendUrl}/register`} method="POST" className="register-form">
      <div className="input-group">
          <label htmlFor="name">Email:</label>
          <input type="text" name="email" id="email" placeholder="Email"/>
        </div>
        <div className="input-group">
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" id="name" placeholder="Username"/>
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" placeholder="Password" />
        </div>
        <button className="register-button">Register</button>
      </form>
    </div>
  );
}

export default Register;
