import React from "react";
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav style={{backgroundColor: "#a038f5", height: "80px"}}>
            <div className="nav-fixed">
            < NavLink to="/home" className="brand-logo" style={{color: "white", textDecoration: "none", paddingLeft: "25px", fontSize: "50px"}}> srizziit </NavLink>
            <ul id="nav-mobile" className="right">
                <li><NavLink to="/home" style = {{padding: "10px 15px"}}><PersonSharpIcon fontSize="large"/></NavLink></li>
                <li><NavLink to="/mysubs" style = {{padding: "10px 15px"}}><AutoAwesomeIcon fontSize="large"/></NavLink></li>
                <li><NavLink to="/subs" style = {{padding: "10px 15px"}}><SearchIcon fontSize="large"/></NavLink></li>
                <li><NavLink to="/bookmarks" style = {{padding: "10px 15px"}}><BookmarkIcon fontSize="large"/></NavLink></li>
            </ul>
            </div>
        </nav>
    );
}

export default Navbar;