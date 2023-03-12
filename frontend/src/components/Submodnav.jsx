import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";

const style = {
    color: "white",
    fontSize: "22px",
    fontWeight: "bold",
    textDecoration: "none",
    padding: "10px 15px",
    "&:hover": {
        backgroundColor: "#a038f5",
        color: "white",
        textDecoration: "none",
    }
}

const Submodnav = () => {
    const subName = useParams().subName;

    return (
        <nav style={{backgroundColor: "#b05ef2", height: "62px", paddingTop: "0px"}}>
            <div className="nav-fixed">
            <ul id="nav-mobile" className="center">
                <li style={{paddingLeft: "10px"}}><NavLink to={"/sub/" + subName} variant="text"><span style={style}><span style={{color: "pink"}}>HOME PAGE</span></span></NavLink></li>
                <li><NavLink to={"/mod/" + subName + "/users"} variant="text"><span style={style}>USERS</span></NavLink></li>
                <li><NavLink to={"/mod/" + subName + "/joins"} variant="text"><span style={style}>JOIN REQUESTS</span></NavLink></li>
                <li><NavLink to={"/mod/" + subName + "/stats"} variant="text"><span style={style}>STATS</span></NavLink></li>
                <li><NavLink to={"/mod/" + subName + "/reports"} variant="text"><span style={style}>REPORTS</span></NavLink></li>
            </ul>
            </div>
        </nav>
    )
}

export default Submodnav;