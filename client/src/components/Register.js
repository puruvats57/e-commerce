import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import "../data.css"; // Import the CSS file

function Register() {
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_LIVE_URL;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUserExists, setIsUserExists] = useState(false); // State for user existence check

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (response.status === 409) {
        setIsUserExists(true); // Set user existence state to true
        document.getElementById("email").value = ""; // Clear email field
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      {!isSubmitted ? (
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Email"
              className={isUserExists ? "error-input" : ""}
            />
            {isUserExists && (
              <span className="error-message">
                User already exists. Please try a different email.
              </span>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
            />
          </div>
          <button className="register-button" type="submit">
            Register
          </button>
        </form>
      ) : (
        <div id="success-message">
            <FontAwesomeIcon icon={faCheckCircle} className="tick-icon" />
            <h3>Registered Successfully!Welcome to our Platform:)</h3>
          </div>
      )}
    </div>
  );
}

export default Register;
