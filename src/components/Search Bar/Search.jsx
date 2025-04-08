import React, { useState } from 'react';
import { FiSearch } from "react-icons/fi";
import './Search.css';

function Search({ onSearch }) {
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <>
      <form>
        <div className="search">
          <FiSearch className='search-icon' size={20} />
          <input 
            className='search-input' 
            type='search' 
            placeholder='Buscar productos'
            value={searchValue}
            onChange={handleInputChange}
          />
        </div>    
      </form>   
    </>
  );
}

export default Search;