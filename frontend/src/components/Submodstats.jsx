import React, { useState } from "react";
import Navbar from "./Navbar";
import Submodnav from "./Submodnav";

const Submodstats = () => {
    return (
        <div>
            <Navbar />
            <Submodnav />
            <div style={{paddingTop: "50px"}} className="center-align">
                <h1>yooo this is the moderator's view of a sub - stats page</h1>
            </div>
        </div>
    )
}

export default Submodstats;