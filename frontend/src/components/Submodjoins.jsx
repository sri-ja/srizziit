import React, { useState } from "react";
import Navbar from "./Navbar";
import Submodnav from "./Submodnav";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";

const Submodjoins = () => {
    const navigate = useNavigate();

    const [sub, setSub] = useState({});
    const subName = useParams().subName;
    const [users, setUsers] = useState([]);

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

            axios.get(`http://localhost:5000/api/subgreddiit/getjoinreqs/${subName}`, { params: { token: token } }).then((res) => {
                if (res.data.error) {
                    alert(res.data.error);
                    window.location.reload();
                } else {
                    setUsers(res.data);
                }
            });
        }
    }, []);

    const allowUser = (username) => {
        axios.post("http://localhost:5000/api/subgreddiit/update", { token: localStorage.getItem("jwtToken"), sub: subName, data: { ...sub, joined_users: [...sub.joined_users, username] } }).then((res) => {
            if (res.data.error) {
                alert(res.data.error);
                window.location.reload();
            } else {
                setSub(res.data);
            }
        });

        axios.get("http://localhost:5000/api/user/userdetails", { params: { token: localStorage.getItem("jwtToken"), username: username } }).then((res) => {
            if (res.data.error) {
                alert(res.data.error);
                window.location.reload();
            } else {
                console.log(res.data);

                axios.post("http://localhost:5000/api/user/updateotheruser", { token: localStorage.getItem("jwtToken"), data: { ...res.data, joined_subs: [...res.data.joined_subs, subName], req_subs: res.data.req_subs.filter((s) => s !== subName) }, update: "submod" }).then((res) => {
                    if (res.data.error) {
                        alert(res.data.error);
                        window.location.reload();
                    } else {
                        setUsers(users.filter((user) => user.username !== username));
                    }
                });
            }
        });
    }

    const deleteUser = (username) => {
        axios.get("http://localhost:5000/api/user/userdetails", { params: { token: localStorage.getItem("jwtToken"), username: username } }).then((res) => {
            if (res.data.error) {
                alert(res.data.error);
                window.location.reload();
            } else {
                console.log(res.data);

                axios.post("http://localhost:5000/api/user/updateotheruser", { token: localStorage.getItem("jwtToken"), data: { ...res.data, req_subs: res.data.req_subs.filter((s) => s !== subName) }, update: "submod" }).then((res) => {
                    if (res.data.error) {
                        alert(res.data.error);
                        window.location.reload();
                    } else {
                        setUsers(users.filter((user) => user.username !== username));
                    }
                });
            }
        });
    }

    return (
        <div>
            <Navbar />
            <Submodnav />
            <div style={{paddingTop: "10px"}} className="center-align">
                <div className="row">
                    <h3 style={{padding: "10px"}}>users who have requested to join your sub</h3> 
                    <div className="col s12 m4">
                            <br></br>
                    </div>
                    <div className="col s12 m4">

                        {users.map((user) => {
                            return (
                                <div className="card left-align" style={{backgroundColor: "#d496fa", marginBottom: "20px"}} key={user?.username}>
                                    <div className="card-heading" style={{justifyContent: "center", padding: "10px"}}> 
                                        <span style={{fontSize: "30px", fontWeight: "500", color: "purple", paddingLeft: "10px"}}>{user?.username}: </span> <span style={{fontWeight: "300", fontSize: "25px"}}>{user?.fname} {user?.lname}</span>
                                    </div>
                                    <div className="card-content" style={{padding: "15px 25px"}}>
                                        <div style={{paddingBottom: "10px"}}>
                                            <span style=
                                            {{fontSize: "18px", fontWeight: "500"}}>Followers: </span>
                                            <span style={{fontSize: "18px", fontWeight: "300"}}>{user?.followers.length}</span>
                                        </div>
                                        <div style={{paddingBottom: "10px"}}>
                                            <span style=
                                            {{fontSize: "18px", fontWeight: "500"}}>Following: </span>
                                            <span style={{fontSize: "18px", fontWeight: "300"}}>{user?.following.length}</span>
                                        </div>
                                    </div>
                                    <div className="card-action center-align" style={{backgroundColor: "#cf73fa"}}>
                                    <ButtonGroup variant="contained" color="secondary" size="large">
                                        <Button onClick={() => allowUser(user.username)}>Allow</Button>
                                        <Button onClick={() => deleteUser(user.username)}>Delete</Button>
                                    </ButtonGroup>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                    <div className="col s12 m4">
                            <br></br>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Submodjoins;