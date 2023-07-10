import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../data.css';

function Search(props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  function handleChange(event) {
    setSearch(event.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/search', { state: { name: search } });
  }

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Search item"
          value={search}
          onChange={handleChange}
        />
        <button type="submit" className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </form>
      <select name="cars" id="cars">
      <a class="dropdown-item" href="#">Action</a>
     </select>

      <div className="link-button-container">
        {/*<a href="/login" className="link-button">
          Login
        </a>*/}

        <a href="/cart" className="link-button">
          Cart
        </a>

        
      </div>
    </div>
  );
}

export default Search;
