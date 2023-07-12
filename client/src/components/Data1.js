//after searching page

import React, { useEffect, useState } from 'react';



import { useLocation } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function Data1(props) {
    var d = [];
    let [checked, setChecked] = React.useState(false);
    const navigate = useNavigate();
    let [min, setmin] = useState(0);
    let [max, setmax] = useState(0);
    let [get, setget] = useState(0);
    let [brands, getbrand] = useState(0);
    const { state } = useLocation();
    const { name } = state; // Read values passed on state
    let [uid, setuid] = useState();

    console.log("i am there", name);
    

    useEffect(() => {
        console.log("hye from get fetch");
        fetch(`${process.env.REACT_APP_BACKEND_LIVE_URL}/fetch`,

            {
                method: "POST",
                body: JSON.stringify({
                    search: name
            
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }

            }).then(response => response.json())
            .then(json => {
                setget(json.data);
                getbrand(json.brands);
                setmin(json.min);
                setmax(json.max);
               
                
            });
            

            
    }, [name])
    
    function addtocart(e, id, q) {

        e.preventDefault();
    
        //console.log("id",id);

        console.log("my token", localStorage.getItem('token'));
        const t = localStorage.getItem('token');


        

        fetch(`${process.env.REACT_APP_BACKEND_LIVE_URL}/addtocart`,
            {
                method: "POST",
                body: JSON.stringify({
                    token: t,
                    id: id,
                    q: q
                
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
                
            
            }).then(response => response.json())
            .then(data => {
                if (data.status == "login") {
                    console.log("uid=",data.token);
                    setuid(data.token);
                    toast.success('Successfully added', {
                        position: toast.POSITION.TOP_RIGHT,
                      });
                    
                }
                else {
                    console.log("oh yes");
                    alert('login first');
                    
                    navigate('/login');
                    
                }
                    
                
           
            });
        console.log("uid of get_id=", uid);


        
    }

    const brand = (e,mi,ma) => {
    /*also handle if we want filter on more than one brand by storing all checked brand in
    array d*/
        //e.preventDefault();
        let allCheckBox = document.querySelectorAll('.check')
        
        for (var i = 0; i < allCheckBox.length; i++)
        {
            if (allCheckBox[i].checked)
            {
                
                d.push(allCheckBox[i].value);
                
                
            }
                
        }
        console.log("d", d);
        const result = fetch(`${process.env.REACT_APP_BACKEND_LIVE_URL}/brand`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    brand: d,
                    min:mi,
                    max:ma
                    
                })
            }).then((res) => res.json())
                .then(json => {
                    setget(json.data);
            
           
                    
                });
        
    }

    
    return (
        
        <>
            <div className='ok'>
            <div className="row">
                
            {Object.keys(get).map((key) => (

                <>

                <div className="column">
                    <div className="card" >
    
                        <div className="card-body">
                            <h3>name:     {get[key].name}</h3>
                            <h3>brand:    {get[key].brand}</h3>
                            <h3>variety:  {get[key].variety}</h3>
                            <p>price:     {get[key].price}</p>
                            
                            <button onClick={(e) => addtocart(e, get[key]._id, 0)}>add to cart</button>
                        </div>
                    </div>
                </div>
   

                </>
                


            ))}
               
            </div>
            </div>
            
            <div className="side-left" >
                <u><h2>filter</h2></u>
                <h4>brands</h4>
                {Object.keys(brands).map((key) => (

                    <>
                        <div className="in">
                    
                            <p>{brands[key]}: <input
                                type="checkbox"
                                className="check"
                                value={brands[key]}
                                onChange={brand}
                                
                
   
                            /></p>
                        </div>
                    </>
            
                )
          
                )}

                <h4>Price</h4>
                Under:<a className='hover' onClick={(e)=>brand(e,0,min+15)}>{min+15}</a><br></br>
                <a id='2' className='hover' onClick={(e)=>brand(e,min+15,Math.floor((min+max)/2))}>{min+15}-{Math.floor((min+max)/2)}</a><br></br>
                <a id='3' className='hover' onClick={(e)=>brand(e,Math.floor((min+max)/2),max)}>{Math.floor((min+max)/2)}-{ max}</a><br></br>

            </div>
            <ToastContainer/>
        </>

        
    )
}

export default Data1 ;