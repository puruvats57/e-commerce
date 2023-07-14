import React, { useEffect, useState } from 'react';
import { FaTimes, FaSearch, FaCartPlus } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Data1(props) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { name } = state; // Read values passed on state

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [mi, setMi] = useState(0);
  const [ma, setMa] = useState(0);
  const [get, setGet] = useState(0);
  const [filter2, setFilter2] = useState('');
  const [brands, setBrands] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState([]);

  console.log('i am there', name);

  useEffect(() => {
    console.log('hye from get fetch');
    fetch(`${process.env.REACT_APP_BACKEND_LIVE_URL}/fetch`, {
      method: 'POST',
      body: JSON.stringify({
        search: name
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then((response) => response.json())
      .then((json) => {
        setGet(json.data);
        setBrands(json.brands);
        setMin(json.min);
        setMax(json.max);
      });
  }, [name]);

  function addtocart(e, id, q) {
    e.preventDefault();

    console.log('my token', localStorage.getItem('token'));
    const t = localStorage.getItem('token');

    fetch(`${process.env.REACT_APP_BACKEND_LIVE_URL}/addtocart`, {
      method: 'POST',
      body: JSON.stringify({
        token: t,
        id: id,
        q: q
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'login') {
          console.log('uid=', data.token);
          toast.success('Successfully added', {
            position: toast.POSITION.TOP_RIGHT
          });
        } else {
          console.log('oh yes');
          alert('login first');
          navigate('/login');
        }
      });
  }

  const brand = (e) => {
      e.preventDefault();
      
      console.log('id', e.target.id);
      
    let updatedMi = mi;
      let updatedMa = ma;
      if (e.target.id == 'clear') {
          console.log("clear", e.target.id);
          updatedMi = 0;
          updatedMa = 0;
    }

    if (e.target.id === '1') {
      updatedMi = 0;
      updatedMa = min + 15;
    }
    if (e.target.id === '2') {
      updatedMi = min + 15;
      updatedMa = Math.floor((min + max) / 2);
    }
    if (e.target.id === '3') {
      updatedMi = Math.floor((min + max) / 2);
      updatedMa = max;
      }
    

    setMi(updatedMi);
    setMa(updatedMa);

    let allCheckBox = document.querySelectorAll('.check');
    let selected = [];

    for (let i = 0; i < allCheckBox.length; i++) {
      if (allCheckBox[i].checked) {
        selected.push(allCheckBox[i].value);
      }
    }

    setSelectedBrands(selected);

    fetch(`${process.env.REACT_APP_BACKEND_LIVE_URL}/brand`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        brand: selected,
        min: updatedMi,
        max: updatedMa
      })
    })
      .then((res) => res.json())
      .then((json) => {
        setGet(json.data);
      });
  };

  

  return (
    <>
      <div className='container'>
      <div className="ok">
        <div className="row">
          {Object.keys(get).map((key) => (
            <div className="column" key={key}>
              <div className="card">
                <div className="card-body">
                  <h3>name: {get[key].name}</h3>
                  <h3>brand: {get[key].brand}</h3>
                  <h3>variety: {get[key].variety}</h3>
                  <p>price: {get[key].price}</p>
                  <button onClick={(e) => addtocart(e, get[key]._id, 0)}>add to cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="side-left">
        <u>
          <h2>filter</h2>
        </u>
        
              
    {ma !== 0 && (
    <div className="filter-range">
    <div className="filter-range-content">
      <span id="clear" className="cross-button" onClick={(e) => brand(e)}>
        &#10005;
      </span>
      <span className="filter-range-text">
        Price:{mi}-{ma}
      </span>
    </div>
    </div>
  )}



        
              <h4>brands</h4>
{Object.keys(brands).map((key) => (
  <div className="in" key={key}>
    <label className="check-label">
      <input
        type="checkbox"
        className="check"
        value={brands[key]}
        checked={selectedBrands.includes(brands[key])}
        onChange={brand}
      />
      {brands[key]}
    </label>
  </div>
))}


        <h4>Price-Range</h4>
        Under:<a id="1" className="hover" onClick={(e) => brand(e)}>
          {min + 15}
        </a>
        <br />
        <a id="2" className="hover" onClick={(e) => brand(e)}>
          {min + 15}-{Math.floor((min + max) / 2)}
        </a>
        <br />
        <a id="3" className="hover" onClick={(e) => brand(e)}>
          {Math.floor((min + max) / 2)}-{max}
        </a>
        <br />
        </div>
        </div>
      <ToastContainer />
    </>
  );
}

export default Data1;
