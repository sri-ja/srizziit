import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Container, IconButton } from "@mui/material";
import jwt_decode from "jwt-decode";

import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete"
import axios from "axios";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
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
};

const Home = () => {
	const navigate = useNavigate();

	const [data, setData] = useState();
	const [editing, setEditing] = useState(false);
	const [error, setError] = useState("");
	const [view, setView] = useState("default");

	useEffect(() => {
		if (localStorage.getItem("jwtToken") === null) navigate("/");
		else {
			const token = localStorage.getItem("jwtToken");
			const decoded = jwt_decode(token);

			axios.get("http://localhost:5000/api/user/userdetails", { params: { token: token, username: decoded.username}}).then((res) => {
				if (res.data.error) {
					setError(res.data.error);
					window.location.reload();
				} else {
					setData(res.data);
				}
			});
		}
	}, []);

	const logout = () => {
		localStorage.clear();
		navigate("/");
	};

	const edit = (e) => {
		e.preventDefault();
		if (editing) {
			axios
				.post("http://localhost:5000/api/user/update", {
					token: localStorage.getItem("jwtToken"),
					data: data
				})
				.then((res) => {
					if (res.data.error) {
						setError(res.data.error);
						window.location.reload();
					} else {
						localStorage.setItem("jwtToken", res.data.token);
						setData(res.data.user);
					}
				});
		} else {
		}
		setEditing(!editing);
	};

	const remove = (person) => {
		axios.post("http://localhost:5000/api/user/update", { token: localStorage.getItem("jwtToken"), data: { ...data, [view]: data[view].filter((a) => a !== person) } }).then((res) => {
			if (res.data.error) {
				setError(res.data.error);
				window.location.reload();
			} else {
				localStorage.setItem("jwtToken", res.data.token);
				setData(res.data.user);
			}
		});
		
		axios.get("http://localhost:5000/api/user/userdetails", { params: { token: localStorage.getItem("jwtToken"), username: person}}).then((res) => {
			if (res.data.error) {
				setError(res.data.error);
				window.location.reload();
			} else {
				const user = res.data;
				const thingtoupdate = view === "followers" ? "following" : "followers";
				user[view === "followers" ? "following" : "followers"] = user[view === "followers" ? "following" : "followers"].filter((a) => a !== data.username);
				axios.post("http://localhost:5000/api/user/updateotheruser", { token: localStorage.getItem("jwtToken"), data: user , update: thingtoupdate}).then((res) => {
					if (res.data.error) {
						setError(res.data.error);
						window.location.reload();
					}
				});
			}
		});
	}; 

	return (
		<div className="home">
			<Navbar />
			<Modal open={view !== "default"} onClose={() => setView("default")} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h4" component="h2">
						{view === "followers" ? "Your followers" : "People you follow"}
					</Typography>
					{data &&
						view !== "default" &&
						data[view].map((person) => {
							return (
								<div className="follow" key={person}>
									<p>{person}</p>
									<IconButton onClick={() => remove(person)}>
										<DeleteIcon />
									</IconButton>
								</div>
							);
						})}
				</Box>
			</Modal>
			<div style={{ paddingTop: "20px" }} className="center-align">
				<Container maxWidth="lg">
					<img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Avatar" style={{ width: "200px", borderRadius: "100%"}} />
					<div>
						<h2>
							welcome to srizziit, <span style={{ color: "purple" }}>{data?.username}</span>!
						</h2>
						<h4>user details</h4>

						<form className="user-data" onSubmit={edit}>
							<div className="field">
								<PersonIcon />
								<input type="text" disabled={!editing} className="value" defaultValue={data?.fname} onChange={(e) => setData({ ...data, fname: e.target.value })} />
								<PersonIcon />
								<input type="text" disabled={!editing} className="value" defaultValue={data?.lname} onChange={(e) => setData({ ...data, lname: e.target.value })} />
							</div>
							<div className="field">
								<AlternateEmailIcon />
								<input type="text" disabled className="value" defaultValue={data?.username} onChange={(e) => setData({ ...data, username: e.target.value })} />
								<EmailIcon />
								<input type="text" disabled={!editing} className="value" defaultValue={data?.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
							</div>
							<div className="field">
								<LocalPhoneIcon />
								<input type="text" disabled={!editing} className="value" defaultValue={data?.contact} onChange={(e) => setData({ ...data, contact: e.target.value })} />
								<CalendarTodayIcon />
								<input type="text" disabled={!editing} className="value" defaultValue={data?.age} onChange={(e) => setData({ ...data, age: e.target.value })} />
							</div>
							<button type={editing ? "submit" : "button"} className="edit-button" onClick={edit}>
								{editing ? <SaveIcon /> : <EditIcon />}
							</button>
						</form>
					</div>

					<div>
						<h4>followers and following</h4>
						<div className="flex space-around w-700 mx-auto">
							<Button variant="text" sx={{ fontSize: "20px" }} size="large" color="secondary" onClick={() => setView("followers")}>
								Followers: {data?.followers.length}
							</Button>
							<Button variant="text" sx={{ fontSize: "20px" }} size="large" color="secondary" onClick={() => setView("following")}>
								Following: {data?.following.length}
							</Button>
						</div>
					</div>
					<p>
						<Button variant="contained" size="large" color="secondary" onClick={() => logout()}>
							logout
						</Button>
					</p>
				</Container>
			</div>
		</div>
	);
};

export default Home;