import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setName } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../data.css'; // Import the CSS file

function Login(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [token, setToken] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const form = document.getElementById('login');
    form.addEventListener('submit', login);

    async function login(event) {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const password = document.getElementById('password').value;

      const result = await fetch(`${process.env.REACT_APP_BACKEND_LIVE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          password
        })
      }).then((res) => res.json());

      if (result.status === 'ok') {
        dispatch(setName(name));
        setIsLogged(true);
        setToken(result.data);
        localStorage.setItem('token', result.data);
        setTimeout(() => {
          navigate('/');
        }, 2000); // Wait for 2 seconds (adjust as needed)
      } else {
        alert(result.status);
        if (result.status == 'You are not Registered with us') {
          navigate('/register');
        }
      }
    }
  }, []);

  return (
    <>
      <div className="login-container">
        {isLogged ? (
          <div id="success-message">
            <FontAwesomeIcon icon={faCheckCircle} className="tick-icon" />
            Logged in successfully
          </div>
        ) : (
          <>
            <h2>Login page</h2>
            <form id="login" className="login-form">
              <label htmlFor="name">Username:</label>
              <input type="text" autoComplete="off" id="name" placeholder="Username" />

              <label htmlFor="password">Password:</label>
              <input type="password" autoComplete="off" id="password" placeholder="Password" />

              <input type="submit" value="Login" />
              <a href="/email">Forgot password</a>
            </form>
          </>
        )}
      </div>
    </>
  );
}

export default Login;
