import React, { useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Container } from '@mui/system';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import NearMeIcon from "@mui/icons-material/NearMe";

import { Box, Modal, TextField, Button, IconButton } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	backgroundColor: "#d496fa",
	boxShadow: 24,
	p: 4,
	paddingTop: 0,
};
 
const Mysubs = () => {
    const navigate = useNavigate();

    const [data, setData] = useState({});
    const [mysubs, setSubs] = useState([]);
    const [newSub, setNewSub] = useState({ creator: "", name: "", description: "", tags: [], blocked_keywords: [] });
    
    useEffect(() => {
        if (localStorage.getItem("jwtToken") === null) navigate("/");
        else {
            const token = localStorage.getItem("jwtToken");
            const decoded = jwt_decode(token);

            axios.get("http://localhost:5000/api/user/userdetails", { params: { token: token, username: decoded.username}}).then((res) => {
				if (res.data.error) {
					alert(res.data.error);
					window.location.reload();
				} else {
					setData(res.data);
                    axios.get(`http://localhost:5000/api/subgreddiit/subdetails/${decoded.username}`, {params: {token: token}}).then((resp) => {
                        if (resp.data.error) {
                            setError(resp.data.error);
                            window.location.reload();
                        } else {
                            setSubs(resp.data);
                        }
			        });
				}
			});
        }
    }, []);

    const closeModal = () => {
		setNewSub({ creator: "", name: "", description: "", tags: "", blocked_keywords: "" });
	};

    const createSub = (e) => {
		e.preventDefault();
		if (!newSub.name.length || !newSub.description.length) return alert("Please enter a name and description for your new sub");
		axios
			.post("http://localhost:5000/api/subgreddiit/create", { token: localStorage.getItem("jwtToken"), data: newSub })
			.then((res) => {
				setSubs([...mysubs, res.data]);

				axios.post("http://localhost:5000/api/user/update", { token: localStorage.getItem("jwtToken"), data: {...data, own_subs: [...data.own_subs, res.data.name] } })
				.then((res) => {
					if (res.data.error) {
						alert(res.data.error);
						window.location.reload();
					} else {
						localStorage.setItem("jwtToken", res.data.token);
						setData(res.data.user)
					}
				});

				closeModal();
			})
			.catch((err) => {
				if (err.response && err.response.status === 409) alert("A sub with this name already exists");
				else console.log(err);
			});
	};

	const deleteSub = (sub) => {
		axios.delete("http://localhost:5000/api/subgreddiit/delete", { data: { token: localStorage.getItem("jwtToken"), sub } }).then(() => {
			setSubs(mysubs.filter((a) => a.name !== sub));

			axios.post("http://localhost:5000/api/user/update", { token: localStorage.getItem("jwtToken"), data: {...data, own_subs: data.own_subs.filter((a) => a !== sub) } })
				.then((res) => {
					if (res.data.error) {
						alert(res.data.error);
						window.location.reload();
					} else {
						localStorage.setItem("jwtToken", res.data.token);
						setData(res.data.user)
					}
				});
		});
	};

    return (
        <div>
            <Navbar />
            <Modal open={newSub.creator.length ? true : false} onClose={() => closeModal()}>
				<Box sx={style}>
					<h3>create a new sub</h3>
					<form className="new-sub">
						<TextField margin="dense" fullWidth className="sub" label="name" onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} multiline />

						<TextField margin="dense" fullWidth className="sub" label="description" onChange={(e) => setNewSub({ ...newSub, description: e.target.value })} multiline minRows={2} />

						<TextField margin="dense" fullWidth className="sub" label="tags (separated by spaces)" onChange={(e) => setNewSub({ ...newSub, tags: e.target.value.split(" ") })} multiline />

						<TextField margin="dense" fullWidth className="sub" label="blocked keywords (separated by spaces)" onChange={(e) => setNewSub({ ...newSub, blocked_keywords: e.target.value.split(" ") })} multiline />

						<Button sx={{marginTop: "12px"}} variant="contained" disabled={!newSub.name || !newSub.description || !newSub.tags || !newSub.blocked_keywords} size="large" color="secondary" onClick={(e) => createSub(e)}>
							create sub
						</Button>
					</form>
				</Box>
			</Modal>

            <div className="center-align">
				<div className="row" style={{ paddingTop: "20px" }}>
					<div className="col s1 m2 l4">
						<br></br>
					</div>
					<div className="col s10 m8 l4">
						<div className="card">
							<div className="card-image">
								<img src="https://media.discordapp.net/attachments/845613955660644402/1078183964252057610/image.png" />
								<a role="button" onClick={() => setNewSub({ ...newSub, creator: data.username })} className="btn-floating btn-large halfway-fab waves-effect waves-light purple">
									<i className="material-icons" style={{ fontSize: "2.5rem" }}>
										add
									</i>
								</a>
							</div>
							<div className="card-content" style={{ backgroundColor: "#d496fa" }}>
								<span className="card-title" style={{fontWeight: "400"}}>create a new sub</span>
								<p>have a fun idea for a sub? create your own sub here!</p>
							</div>
						</div>
					</div>
					<div className="col s1 m2 l4">
						<br></br>
					</div>
				</div>
			</div>
            <div>
            <Container maxWidth="lg">
					<h2 className="center-align">your subs</h2>
					<div className="sub-card-container">
						{mysubs.map((sub) => {
							return (
								<div className="sub-card" key={sub.name} style={{marginBottom: "30px"}}>
									<h3 style={{backgroundColor: "#d16cf0", paddingLeft: "7px"}}>{sub.name}</h3>

									<div className="flex space-between">
										<div className="sub-card-heading">members</div>
										<div className="sub-card-content">{sub.joined_users?.length}</div>
									</div>
									<div className="flex space-between">
										<div className="sub-card-heading">posts</div>
										<div className="sub-card-content">{sub.posts?.length}</div>
									</div>
									<div className="flex space-between">
										<div className="sub-card-heading">description</div>
										<div className="sub-card-content">{sub?.description}</div>
									</div>
									<div className="flex space-between">
										<div className="sub-card-heading">banned keywords</div>
										<div className="sub-card-content">{sub?.blocked_keywords.join(", ")}</div>
									</div>
									<div className="center-align">
										<IconButton size="large" onClick={() => navigate(`/mod/${sub.name}/users`)}>
											<NearMeIcon fontSize='large' />
										</IconButton>

										<IconButton size="large" onClick={() => deleteSub(sub.name)}>
											<Delete fontSize='large' />
										</IconButton>
									</div>
								</div>
							);
						})}
					</div>
				</Container>
            </div>
        </div>
    )
}

export default Mysubs;