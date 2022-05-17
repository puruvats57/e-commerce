import React, { useEffect, useState } from 'react';

import { useNavigate, Link } from "react-router-dom";

function Login(props) {
    
    const navigate = useNavigate();
    


    useEffect(() => {
    
                
            
        const form = document.getElementById('login')
        form.addEventListener('submit', login)

        async function login(event) {
            event.preventDefault()
            const name = document.getElementById('name').value
            const password = document.getElementById('password').value

            const result = await fetch('http://127.0.0.1:9999/login', {
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
                // everythign went fine
                console.log('Got the token: ', result.data)
                localStorage.setItem('token', result.data)
                //alert('Success')
                navigate('/');
            } else {
                //alert(result.error)
            }

            
                // everythign went fine
            

                //alert('Success')
            
        }
    })
        
        
    
    

    

    return(
        <>
            <h2>Login page</h2>
            
            <form id="login">
                <input type="text" autocomplete="off" id="name" placeholder="Username" />
			    <input type="text" autocomplete="off" id="password" placeholder="Password" />
                <input type="submit" value="Submit Form" />
            </form>
            <p>if dont have account please register!</p>
            <a href="/register">Register</a>
            <a href='http://127.0.0.1:9999/logout'>Logout</a>
            
        
        </>
    

    )
}

export default Login;