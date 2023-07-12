import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setName } from '../store';
import '../data.css';
import { FaTimes,FaSearch, FaCartPlus } from 'react-icons/fa';



function Search(props) {
  const dispatch = useDispatch();
  const name = useSelector((state) => state.name);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  function handleChange(event) {
    setSearch(event.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/search', { state: { name: search } });
  }
  const handleClear = () => {
    setSearch('');
  };

  function login() {
    navigate('/login');
  }

  function logout() {
    dispatch(setName('User'));
    localStorage.removeItem('token');
    alert('Logged out successfully');
    navigate('/');
  }

  return (
    
    <nav className="navbar">
  <div className="logo">
    <Link to="/" className="logo-link">
      MyShop
    </Link>
  </div>
  <div className="search-input-container">
    <form className="search-form" onSubmit={handleSubmit}>
          <input
          type="text"
          name="name"
          placeholder="Search item"
          value={search}
          onChange={handleChange}
          className="search-input"
          
            
              
        />
          {search && (
            <button type="button" className="clear-button" onClick={handleClear}>
              <FaTimes />
            </button>
          )}
      <button type="submit" className="search-button">
        <FaSearch />
      </button>
    </form>
  </div>

  <div className="dropdown">
    <span className="dropdown-name">Hello, {name}</span>
    <div className="dropdown-content">
      {name === 'User' ? (
        <>
          <button className="button" onClick={login}>
            Sign in
          </button>
          <br />
          <div className="new-user-link">
            New User? <Link to="/register">Register here</Link>
          </div>
        </>
      ) : (
        <button className="button" onClick={logout}>
          Logout
        </button>
      )}
    </div>
  </div>

  <div className="cart-icon-container">
    <Link to="/cart" className="cart-icon-link">
      <FaCartPlus className="cart-icon" />
    </Link>
    <span className="cart-text">Cart</span>
  </div>
</nav>

      
  );
}

export default Search;
