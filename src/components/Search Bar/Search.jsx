import React from 'react'
import { FiSearch } from "react-icons/fi";
import './Search.css'


function Search() {
  return (
    <>
    
        <form>
            <div class="search">
                <FiSearch className='search-icon' size={20} />
                <input className='search-input' type='search' placeholder='Search'></input>
            </div>    
        </form>   
    </>
  )
}

export default Search