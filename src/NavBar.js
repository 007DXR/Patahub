import React from 'react';
import Logo from "./Logo.js";
import { Link } from 'react-router-dom';
import "./NavBar.css";

function NavBar(){
    return (
        <nav className="NavBar-container">
            <Link to="/"><Logo /></Link>
        </nav>
    );
}

export default NavBar;
