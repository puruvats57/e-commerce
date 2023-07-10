import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../data.css";

function Home(props)
{
    const navigate = useNavigate();
   
    let [got, getall] = useState(0);
   
    useEffect(() => {
        
        
        fetch('${process.env.BACKEND_LIVE_URL}/fetch',

        {
            method:"GET",
            /*body: JSON.stringify({
                search:search
            
            }),*/
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }

        }).then(response => response.json())
            .then(json =>{
                getall(json.data);
               
               console.log("hhhh",got);
            });
        }, [])
    
    
        function addtocart(e,id,q)
        {
            e.preventDefault();
            //console.log("id",id);

        console.log("my token", localStorage.getItem('token'));
        const t = localStorage.getItem('token');


        

        fetch('${process.env.BACKEND_LIVE_URL}/addtocart',
            {
                method: "POST",
                body: JSON.stringify({
                    token: t,
                    id: id,
                    q:q
                
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
                
            
        }).then(response => response.json())
            .then(json => {
                if (json.data != "login") {
                    console.log("uid=", json.token);
                   // setuid(json.token);
                   toast.success('Successfully added', {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                    
                }
                else {
                    alert('login first');
                    navigate('/login');
                    
                }
                    
                
           
            });
       // console.log("uid of get_id=", uid);
    
            
        
    }
    return (

        <>
            <div className="row">
            
            
        {Object.keys(got).map((key) =>(

            <>
           
                
                <div className="column">
                <div className="card" >
                
                    <div className="card-body">
                    <h5>{got[key].name}</h5>
                    <h5>brand:{got[key].brand}</h5>
                    <h3>variety:{got[key].variety}</h3>
                    <p>price:{got[key].price}</p>
                    <p>{got[key].quantity !=0 ? <p>in stock</p>: <p>not in stock</p> }</p>
                    <button onClick={(e) => addtocart(e,got[key]._id,1)}>add to cart</button>
                    </div>
                </div>
                </div>
                  
               

            </>
              


        ))}
             
            </div>
            
            
        </>

    
        

    )
}
export default Home;