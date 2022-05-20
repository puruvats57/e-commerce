import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";



import "../data.css";

function Home(props)
{
    const navigate = useNavigate();
   
    let [got,getall]=useState(0);
    


    
       


        
        

        useEffect(() =>{
        console.log("hye from get fetch");
        fetch('http://127.0.0.1:9999/fetch',

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
    
    
        function gotocart(e,id,q)
        {
    
            e.preventDefault();
        
            //console.log("id",id);
    
            console.log("my token", localStorage.getItem('token'));
            const t = localStorage.getItem('token');
    
    
            
    
            fetch('http://127.0.0.1:9999/get_id',
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
                    if (json.status != "login") {
                        console.log("uid=", json.token);
                        
                        
                    }
                    else {
                        alert('login first');
                        navigate('/login');
                        
                    }
                        
                    //setuid(json.token);
                
               
                });
            //console.log("uid of get_id=", uid);
    
    
            
           
    
    
        }


        
        
      


       
        
    return(

        <>
        {Object.keys(got).map((key) =>(

            <>
           
            
                <div className="card" >
                
                    <div className="card-body">
                    <h5>{got[key].name}</h5>
                    <h3>{got[key].variety}</h3>
                    <p>{got[key].price}</p>
                    <p>{got[key].quantity !=0 ? <p>in stock</p>: <p>not in stock</p> }</p>
                    <button onClick={(e) => gotocart(e,got[key]._id,0)}>add to cart</button>
                    </div>
                </div>
               

            </>


        ))}
        </>

    
        

    )
}
export default Home;