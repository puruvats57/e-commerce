import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomSection from './BottomSection';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../data.css';

function Cart() {
  const [search, setSearch] = useState(null);
  const navigate = useNavigate();
  const [item, setItem] = useState([]);
  const [pay, setPay] = useState([]);
  const [total, setTotal] = useState(0);
  const [fetchingItems, setFetchingItems] = useState(true); // Track whether cart items are being fetched
  const [fetchingPayment, setFetchingPayment] = useState(true); // Track whether payment details are being fetched
  const t = localStorage.getItem('token');

  useEffect(() => {
    if (fetchingItems) {
      fetchCartItems();
    }
    if (fetchingPayment) {
      fetchPaymentDetails();
    }
  }, [fetchingItems, fetchingPayment]);

  function fetchCartItems() {
    fetch('${process.env.BACKEND_LIVE_URL}/cart_items', {
      method: 'POST',
      body: JSON.stringify({
        token: t,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data !== 'login') {
          setItem(json.data);
        } else {
          alert('Login first');
          navigate('/login');
        }
        setFetchingItems(false); // Set fetchingItems to false after fetching cart items
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  function fetchPaymentDetails() {
    fetch('${process.env.BACKEND_LIVE_URL}/payment', {
      method: 'POST',
      body: JSON.stringify({
        token: t,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data !== 'login') {
          setPay(json.data);
          setTotal(json.total);
        } else {
          // Handle error
        }
        setFetchingPayment(false); // Set fetchingPayment to false after fetching payment details
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  async function addQ(e, id) {
    e.preventDefault();

    fetch('${process.env.BACKEND_LIVE_URL}/addmore', {
      method: 'POST',
      body: JSON.stringify({
        token: t,
        id: id,
        q: search,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
      });

    setFetchingItems(true); // Trigger fetching cart items after adding more
    setFetchingPayment(true); // Trigger fetching payment details after adding more
  }

  function removeCart(e, id) {
    e.preventDefault();

    fetch('${process.env.BACKEND_LIVE_URL}/remove_item', {
      method: 'POST',
      body: JSON.stringify({
        token: t,
        id: id,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data === 'good') {
          console.log('cart deleted');
          toast.success('Successfully Removed', {
            position: toast.POSITION.TOP_RIGHT,
          });
          setFetchingItems(true); // Trigger fetching cart items after removing from cart
          setFetchingPayment(true); // Trigger fetching payment details after removing from cart
        }
      });
  }

  function handleChange(event) {
    setSearch(event.target.value);
  }

  function pa() {
    navigate('/pay');
  }

  return (
    <>
      <div className='contain'>
      <div className="row">
        {item.map((cartItem) => (
          <div className="column" key={cartItem._id}>
             <div className="card" >
              <div className="card-body">
                <h5>{cartItem.name}</h5>
                <h3>{cartItem.variety}</h3>
                <p>Price: {cartItem.price}</p>
                <label>Qty:</label>
                <select id="qty" onChange={handleChange}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <br></br>
                <button onClick={(e) => addQ(e, cartItem._id)}>Want to add more</button>
                <button onClick={(e) => removeCart(e, cartItem._id)}>Remove from cart</button>
              </div>
              </div>
            </div>
           
        ))}
      </div>
      </div>
      
    

      <div className='payment'>
        <h2 className="cart-heading">Payment</h2>
    
      <BottomSection pay={pay} total={total} pa={pa} />
      </div>
      <ToastContainer/>
    </>
    
  );
}

export default Cart;
