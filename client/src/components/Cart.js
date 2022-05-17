import React, { useEffect, useState } from 'react';

import { useLocation } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";

function Cart() {
    const navigate = useNavigate();
    const {state} = useLocation();
    const { id } = state; // Read values passed on state

    console.log("i am there",id);
  return (
    <p>{id }</p>
  )
}

export default Cart