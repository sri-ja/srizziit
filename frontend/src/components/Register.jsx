import React, { useState } from "react";
import Button from '@mui/material/Button';
import axios from 'axios';


export const Register = (props) => {

    const [data, setData] = useState({fname: "", lname: "", username: "", email: "", age: "", contact: "", password: ""});

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/user/register', data)
            .then(res => {
            props.onFormSwitch('login')
        })
        .catch(err => {
            alert("Invalid credentials")
        })
    }

    return (
        <div>
            <h1>register here</h1>
            <br></br><br></br>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className = "row">
                    <div className = "input-field col s6">
                        <label htmlFor="fname">first name</label>
                        <input type="text" value={data.fname} onChange={(e) => setData({...data, fname: e.target.value})} id="fname" name="fname" />
                    </div>
                    <div className = "input-field col s6">
                        <label htmlFor="lname">last name</label>
                        <input type="text" value={data.lname} onChange={(e) => setData({...data, lname: e.target.value})} id="lname" name="lname" />
                    </div>
                </div>

                <div className = "row">
                    <div className = "input-field col s12">
                        <label htmlFor="username">username</label>
                        <input type="text" value={data.username} onChange={(e) => setData({...data, username: e.target.value})} id="username" name="username" />
                    </div>
                </div>

                <div className = "row">
                    <div className = "input-field col s12">
                        <label htmlFor="email">email</label>
                        <input type="email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})} id="email" name="email"/>
                    </div>
                </div>

                <div className = "row">
                    <div className = "input-field col s6">
                        <label htmlFor="contact">contact</label>
                        <input type="text" value={data.contact} onChange={(e) => setData({...data, contact: e.target.value})} id="contact" name="contact" />
                    </div>

                    <div className = "input-field col s6">
                        <label htmlFor="age">age</label>
                        <input type="text" value={data.age} onChange={(e) => setData({...data, age: e.target.value})} id="age" name="age" />
                    </div>
                </div>

                <div className = "row">
                    <div className = "input-field col s12">
                        <label htmlFor="password">password</label>
                        <input type="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} id="password" name="password"/>
                    </div>
                </div>
                
                <br></br>
                <Button type="submit" variant="contained" size="large" color = "secondary" disabled={!data.fname || !data.lname || !data.username || !data.email || !data.contact || !data.age || !data.password}>Create Account</Button>
            </form>
            <br></br>
            <Button sx={{ minHeight: 0, minWidth: 0, padding: 0 }} variant="text" size="medium" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here
            </Button>
        </div>
    )
};