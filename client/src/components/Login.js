import React, { useEffect, useState } from 'react';

import { useNavigate, Link } from "react-router-dom";

function Login(props) {
    let [token,settoken]=useState(null); 
    
    const navigate = useNavigate();
    function logout()
    {
        localStorage.removeItem('token');
        alert("logged out successfully");
        navigate('/');

    }
    


    
    
                
    useEffect(() => {
        const form = document.getElementById('login')
        form.addEventListener('submit', login)

        async function login(event) {
            event.preventDefault()
            const name = document.getElementById('name').value
            const password = document.getElementById('password').value

            const result = await fetch('http://127.0.0.1:5000/login', {
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
                alert('logged in successfully');
                
                settoken = result.data;
                // everythign went fine
                console.log('Got the token: ', result.data)
                localStorage.setItem('token', result.data)
                //alert('Success')
                navigate('/');
            } else {
                alert(result.status);
                //alert(result.error)
            }

            
            // everythign went fine
            

            //alert('Success')
            
        }
    });
    
        
        
    
    

    

    return(
        <>
            <h2>Login page</h2>
            
            <form id="login">
                Username:<input type="text" autocomplete="off" id="name" placeholder="Username" /><br></br>
			    Password:<input type="text" autocomplete="off" id="password" placeholder="Password" /><br></br><br></br>
                <input type="submit" value="Login" />
            </form>
            <p>if dont have account please register!</p>
            <a href="/register">Register</a>

            <button class="button" onClick={logout}>logout</button>
            
        
        </>
    

    )
}

export default Login;