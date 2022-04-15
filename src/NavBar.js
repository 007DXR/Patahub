import React from 'react';
import Logo from "./Logo.js";
import "./NavBar.css";

function NavBar(){
    return (
        <nav className="NavBar-container">
            <Logo />
        </nav>
    );
}

export default NavBar;
