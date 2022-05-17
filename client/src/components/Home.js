import React, { useEffect, useState } from 'react';



import "../data.css";

function Home(props)
{
   
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
        },[])


        
        
      


       
        
    return(

        <>
        {Object.keys(got).map((key) =>(

            <>
           
            
                <div className="card" >
                
                    <div className="card-body">
                    <h5>{got[key].name}</h5>
                    <h3>{got[key].variety}</h3>
                    <p>{got[key].price}</p>
                    <button>add to cart</button>
                    </div>
                </div>
               

            </>


        ))}
        </>

    
        

    )
}
export default Home;