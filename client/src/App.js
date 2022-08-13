import React, { useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Search from "./components/Search";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Data1 from "./components/Data1";
import Pay from "./components/Pay";



function App() {
  
  
  
  
  
  const getdata = (data) =>{

    console.log("i am data",data);
  
    
    
    
  
  }

  //let [get,setget]=useState(g);
  
  return (
    <>
      
      <Search onsearch={getdata}/>
   
    
    <Routes>
    
        <Route path='/' element={<Home/>} />
        <Route path='/search' element={<Data1/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/register' element={<Register />} />
        <Route path='/pay' element={<Pay />} />
        
        

    </Routes>
      
    

     
    </>
      
      
      
    
  );
}

export default App;
