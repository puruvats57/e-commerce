import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setName } from '../store';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../data.css'; // Import the CSS file

function Login(props) {
 
  const dispatch = useDispatch();
  let [token, setToken] = useState(null);
  const navigate = useNavigate();

  function handleRegisterClick() {
    navigate('/register');
  }

  useEffect(() => {
    const form = document.getElementById('login')
    form.addEventListener('submit', login)

    async function login(event) {
      event.preventDefault()
      const name = document.getElementById('name').value
      const password = document.getElementById('password').value

      const result = await fetch(`${process.env.REACT_APP_BACKEND_LIVE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          password
        })
      }).then((res) => res.json())

      if (result.status === 'ok') {
        dispatch(setName(name));
        //alert('Logged in successfully');
        await toast.success('Successfully added', {
            position: toast.POSITION.TOP_RIGHT,
          });  
        setToken(result.data);
        localStorage.setItem('token', result.data);
        navigate('/');
      } else {
        alert(result.status);
      }
    }
  }, []);

    return (
      <>
    <div className="login-container">
      <h2>Login page</h2>
      <form id="login" className="login-form">
        <label htmlFor="name">Username:</label>
        <input type="text" autoComplete="off" id="name" placeholder="Username" />

        <label htmlFor="password">Password:</label>
            <input type="password" autoComplete="off" id="password" placeholder="Password" />

            <input type="submit" value="Login" />
            <a href='/email'>Forgot password</a>
      </form>

      

      
      </div>
      <ToastContainer/>
      </>
  );
}

export default Login;
