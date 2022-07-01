import React from "react";

function Register(props){
    


    

    return(
        <>
            <h2>register page</h2>
            
            <form action="http://127.0.0.1:5000/register" method="POST">
                <div className="input-group">
                <label for="name">name:</label>
                <input type="text" name="name" />
                </div>
                <div className="input-group">
                <label for="password">Password:</label>
                <input type="text" name="password" />
                </div>
                <button>register</button>
            </form>
            
            
        
        </>
    

    )
}

export default Register;