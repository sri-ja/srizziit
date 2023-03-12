import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Submodnav from "./Submodnav";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useParams } from "react-router-dom";

const Submoduser = () => {
    const navigate = useNavigate();

    const subName = useParams().subName;
    const [sub, setSub] = useState({});

    useEffect(() => {
        if (localStorage.getItem("jwtToken") === null) navigate("/");
        else {
            const token = localStorage.getItem("jwtToken");
            const decoded = jwt_decode(token);

            axios.get(`http://localhost:5000/api/subgreddiit/getsub/${subName}`, { params: { token: token } }).then((res) => {
                if (res.data.error) {
                    alert(res.data.error);
                    window.location.reload();
                } else {
                    setSub(res.data);
                }
            });
        }
    }, []);

    return (
        <div>
            <Navbar />
            <Submodnav />
            <div style={{paddingTop: "10px"}} className="center-align">
                <div className="row">
                    <div className="col s12 m4">
                            <br></br>
                    </div>
                    <div className="col s12 m4">
                        <h3 style={{padding: "10px"}}>joined users</h3> 
                        
                        {sub.joined_users?.map((user) => {
                            return (
                                <div className="card horizontal" style={{backgroundColor: "#d496fa", paddingBottom: "20px"}} key={user}>
                                    <span className="card-content" style={{justifyContent: "center"}}> <span style={{color: "green"}}><i className="small material-icons">person</i> </span> <span style={{fontSize: "25px", paddingLeft: "30px", fontWeight: "500"}}>{user}</span> 
                                    </span>
                                </div>
                                );
                            }  
                        )} 
                        
                        <h3 style={{marginTop: "0px"}}>banned users</h3>  

                        {sub.blocked_users?.map((user) => {
                            return (
                                <div className="card horizontal" style={{backgroundColor: "#d496fa", paddingBottom: "20px"}} key={user}>
                                    <span className="card-content" style={{justifyContent: "center"}}> <span style={{color: "red"}}><i className="small material-icons">person</i> </span> <span style={{fontSize: "25px", paddingLeft: "30px", fontWeight: "500"}}>{user}</span> 
                                    </span>
                                </div>
                                );
                            }  
                        )} 
                    </div>
                    <div className="col s12 m4">
                            <br></br>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Submoduser;