import React, { useEffect, useState } from 'react';



import { useLocation } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";





function Data1(props)
{
    const navigate = useNavigate();
    let [get,setget]=useState(0);
    const {state} = useLocation();
    const { name } = state; // Read values passed on state
    let [uid, setuid] = useState();

    console.log("i am there", name);
    

    useEffect(() =>{
        console.log("hye from get fetch");
        fetch('http://127.0.0.1:9999/fetch',

        {
            method:"POST",
            body: JSON.stringify({
                search:name
            
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }

        }).then(response => response.json())
            .then(json =>{
                setget(json.data);
               
               console.log("hhhh",get);
            });
    }, [name])
    
    function gotocart(e,id)
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
                    id: id
                
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
                
            
        }).then(response => response.json())
            .then(json => {
                console.log("uid=", json.token);
                setuid(json.token);
            
           
            });
        console.log("uid of get_id=", uid);


        
        /*fetch('http://127.0.0.1:9999/cart',

        {
            method:"POST",
            body: JSON.stringify({
                uid:uid,
                id: id
            
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }

        }*//*).then(response => response.json())
            .then(json =>{
                
               
               console.log(json);
            });*/


        
        //navigate('/cart', { state: {id:id } });


    }

    
    
    return (
        
        <>


        {Object.keys(get).map((key) =>(

            <>


            <div className="card" >
    
                <div className="card-body">
                    <h5>{get[key].name}</h5>
                    <h3>{get[key].variety}</h3>
                    <p>{get[key].price}</p>
                    <p>{get[key]._id}</p>
                    <button onClick={(e) => gotocart(e,get[key]._id)}>add to cart</button>
                    


                </div>
            </div>
   

            </>


        ))}

       

       
        </>
        
    )
}

export default Data1 ;