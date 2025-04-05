import React from 'react'
import '../Nav/Navbar.css'
import logo from  '../../assets/logo.png'

import { LuShoppingCart } from "react-icons/lu";
import { BsShop } from "react-icons/bs";
import { LuTextSearch } from "react-icons/lu";
import { MdOutlineNewspaper } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";

function Navbar() {
  return (
    <>
<nav class="navbar">
        <div></div> 
        <img src={logo} alt="Logo Tochi"/>
        <div class="nav-options">
            <a href="#" class="nav-item">
                <BsShop className='shop-icon' size={25} color="black" />
                Shop  
            </a>
            <a href="#" class="nav-item">
                <LuTextSearch className='search-icon' size={25} color="black" />
                Explore
            </a>
            <a href="#" class="nav-item">
                <MdOutlineNewspaper className='news-icon' size={25} color="black" />
                About
            </a>
            <a href="#" class="nav-item">
                <LuShoppingCart className='cart-icon' size={25} color="black" />
                Cart
            </a>
            <a href="#" class="nav-item">
                <IoPersonOutline className='account-icon' size={25} color="black" />
                Account
            </a>
        </div>
    </nav>    
    </>
  )
}

export default Navbar