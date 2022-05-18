import React, { useEffect, useState } from 'react';

import { useLocation } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";

function Cart() {
    /*const navigate = useNavigate();
    const {state} = useLocation();
    const { id } = state; // Read values passed on state

    console.log("i am there",id);*/
    let [item, setitem] = useState(0);
    
    useEffect(() => {
        console.log("my token", localStorage.getItem('token'));
        const t = localStorage.getItem('token');
        fetch('http://127.0.0.1:9999/cart_items',

            {
                method: "POST",
                body: JSON.stringify({
                    token: t,
                    
                
                }),
        
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }

            }).then(response => response.json())
            .then(json => {
                setitem(json.data);
           
                console.log("hhhh", item);
            });

    },[])
  return (
      <>
          
          <h2>cart items</h2>


    {Object.keys(item).map((key) =>(

        <>


        <div className="card" >

            <div className="card-body">
                <h5>{item[key].name}</h5>
                <h3>{item[key].variety}</h3>
                <p>{item[key].price}</p>
                <p>{item[key]._id}</p>
                
                


            </div>
        </div>


        </>


    ))}

   

   
    </>
      

    
  
  )
}

export default Cart