import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';


export const Login = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('jwtToken') !== null)
             navigate('/home')
     });

    const [data, setData] = useState({username: "", password: ""});

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/user/login', data)
            .then(res => {
                    localStorage.setItem('jwtToken', res.data.token);
                    navigate('/home')
            })
            .catch(err => {
                alert("Invalid username or password")
            })
    }

    return (
        <div>
            <h1>login here</h1>
            <br></br><br></br><br></br><br></br>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className = "row">
                    <div className = "input-field col s12">
                        <label htmlFor="username">username</label>
                        <input type="text" value={data.username} onChange={(e) => setData({...data, username: e.target.value})} id="username" name="username" />
                    </div>
                </div>

                <div className = "row">
                    <div className = "input-field col s12">
                        <label htmlFor="password">password</label>
                        <input type="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} id="password" name="password"/>
                    </div>
                </div>
                
                <br></br><br></br>
                <Button type="submit" variant="contained" size="large" color = "secondary" disabled={!data.username || !data.password}>Log In</Button>
            </form>
            <br></br>
            <Button variant="text" size="medium" sx={{ minHeight: 0, minWidth: 0, padding: 0 }} onClick={() => props.onFormSwitch('register')}> Don't have an account yet? Register here
            </Button>
        </div>
    )
};