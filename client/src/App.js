import React, { useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store';
import Search from "./components/Search";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Data1 from "./components/Data1";
import Pay from "./components/Pay";

import 'bootstrap/dist/css/bootstrap.min.css';
import Email from './components/Email';

//jjnjfkk



function App() {
  
  
  
  
  
  const getdata = (data) =>{

    console.log("i am data",data);
  
    
    
    
  
  }

  //let [get,setget]=useState(g);
  
  return (
    
       <Provider store={store}>
      <Search onsearch={getdata}/>
   
    
    <Routes>
    
        <Route path='/' element={<Home/>} />
        <Route path='/search' element={<Data1/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/register' element={<Register />} />
        <Route path='/pay' element={<Pay />} />
        <Route path='/email' element={<Email />} />

        
        
        

        </Routes>
        </Provider>
      
);
}

export default App;
