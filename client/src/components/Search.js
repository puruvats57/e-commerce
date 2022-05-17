
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import "../data.css";

function Search(props){
  const navigate = useNavigate();


    const [search,setsearch]=useState(null);



   props.onsearch(search);

    
   /* useEffect(() => {
        console.log("runing",search);
        props.onsearch(search);
        

    })*/
    function handleChange(event) {
        setsearch(event.target.value);
      }

    async function get(e){

      
      e.preventDefault();

      navigate('/search', { state: {name:search } });

    
      
        
       
    }
    
    

    return(
        <>
        <input 
      type="text"
      name="name"
    
      onChange={handleChange}
       />

        <button className="get" onClick={(e) => get(e)}>
          search
        </button>
        
        <a href='/login'><button class="button">login</button></a>
        <a href='/cart'><button class="button">cart</button></a>

        
        </>
    

    )
}

export default Search;