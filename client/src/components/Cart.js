import React, { useEffect, useState } from 'react';

import { useLocation } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";

function Cart() {
    const [search,setsearch]=useState(null);
    const navigate = useNavigate();
    /*const navigate = useNavigate();
    const {state} = useLocation();
    const { id } = state; // Read values passed on state

    console.log("i am there",id);*/
    let [item, setitem] = useState(0);
    let [pay, setpay] = useState(0);
    let [total, settotal] = useState(0);
    
    useEffect(() => {
        console.log("my token", localStorage.getItem('token'));
        const t = localStorage.getItem('token');
        fetch('http://127.0.0.1:5000/cart_items',

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
                if (json.data != "login") {
                   
                    setitem(json.data);
                
           
                    console.log("hhhh", item);
                    
                }
                else {
                    alert('login first');
                    navigate('/login');
                    
                }
                
            });
        
            fetch('http://127.0.0.1:5000/payment',

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
                if (json.data != "login") {
                   
                    setpay(json.data);
                    settotal(json.total);
           
                    console.log("hhhh", pay);
                    
                }
                else {
                    
                    
                }
                
        });
            
        

    }, []);


    function addq(e, id)
    {
        e.preventDefault();
        
        console.log("my token", localStorage.getItem('token'));
        const t = localStorage.getItem('token');

        fetch('http://127.0.0.1:5000/addmore',
            {
                method: "POST",
                body: JSON.stringify({
                    token: t,
                    id: id,
                    q:search
                
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
                
            
        }).then(response => response.json())
            .then(json => {
                console.log(json);
            });

        


    }
    
    function removecart(e, id) {

        e.preventDefault();
    
        //console.log("id",id);

        console.log("my token", localStorage.getItem('token'));
        const t = localStorage.getItem('token');


        //remove item from cart

        fetch('http://127.0.0.1:5000/remove_item',
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
                if (json.data == "good")
                {
                    console.log("cart deleted");
                    
                    
                }
                    
                
           
            });
    }

    function handleChange(event) {
        setsearch(event.target.value);
    }
    function pa()
    {
        navigate('/pay');
        


    }


  return (
      <>
          
          <h2>cart items</h2>
    <div className="row">

    {Object.keys(item).map((key) =>(

        <>
        <div className="column">

        <div className="card" >

            <div className="card-body">
                <h5>{item[key].name}</h5>
                <h3>{item[key].variety}</h3>
                <p>price:{item[key].price}</p>
        
                <input 
                        type="text"
                        name="name"
                        onChange={handleChange}
                />

                <button onClick={(e) => addq(e,item[key]._id)}>want to add more</button>
                <button onClick={(e) => removecart(e,item[key]._id)}>remove from cart</button>
                
                
                


            </div>
        </div>
        </div>
        


        </>


    ))}
        </div>  

          <h2>payment</h2>

<div className='bottom'>
{Object.keys(pay).map((key) =>(

    <>
    
        <h5>{pay[key].name}({pay[key].price}) , quantity-{pay[key].quantity}</h5>
            
    </>

))}
              <h5>total price : {total}</h5>
              <button onClick={pa}>pay now</button>

</div>
          
        

   

   
    </>
      

    
  
  )
}

export default Cart