import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Button, ButtonGroup, IconButton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Container } from "@mui/system";
import TextField from "@mui/material/TextField";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import InputAdornment from "@mui/material/InputAdornment";
import Search from "@mui/icons-material/Search";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import Fuse from "fuse.js";
import { useNavigate } from "react-router-dom";

const SubCard = ({ sub, user, join, leave }) => {
	const navigate = useNavigate();

	return (
		<div className="sub-other-card" style={{ marginBottom: "30px" }}>
			<h4 style={{ backgroundColor: "#d16cf0", paddingLeft: "7px" }}>{sub?.name}</h4>

			<div className="flex space-between">
				<div className="sub-card-heading" style={{textAlign: "left"}}>members: </div>
				<div className="sub-card-content">{sub?.joined_users.length}</div>
			</div>
			<div className="flex space-between">
				<div className="sub-card-heading" style={{textAlign: "left"}}>posts</div>
				<div className="sub-card-content">{sub?.posts?.length}</div>
			</div>
			<div className="flex space-between">
				<div className="sub-card-heading" style={{textAlign: "left"}}>description: </div>
				<div className="sub-card-content">{sub?.description}</div>
			</div>
			<div className="flex space-between">
				<div className="sub-card-heading" style={{textAlign: "left"}}>banned keywords</div>
				<div className="sub-card-content">{sub?.blocked_keywords.join(", ")}</div>
			</div>
			<div className="card-action center-align">
				<ButtonGroup variant="contained" color="secondary" size="large">
					{sub?.joined_users.includes(user.username) ? (
						<Button onClick={() => leave(sub?.name)} disabled={sub?.creator === user.username}>
							Leave
						</Button>
					) : (
						<Button onClick={() => join(sub?.name)} disabled={user.req_subs.includes(sub?.name)}>Join</Button>
					)}
					<Button onClick={() => navigate(`/sub/${sub?.name}`)}>Open</Button>
				</ButtonGroup>
			</div>
		</div>
	);
};
const Subs = () => {
	const [user, setUser] = useState({});
	const [allSubs, setAllSubs] = useState([]);
	const [filteredSubs, setFilteredSubs] = useState([]);
	const [queryResults, setQueryResults] = useState([]);
	const [tags, setTags] = useState([]);
	const [fuse, setFuse] = useState();
	const [error, setError] = useState("");
	const [sort, setSort] = useState("ascending");

	if (error) console.log(error);

	useEffect(() => {
		if (localStorage.getItem("jwtToken") === null) navigate("/");
		else {
			const token = localStorage.getItem("jwtToken");
			const decoded = jwt_decode(token);

			axios.get("http://localhost:5000/api/user/userdetails", { params: { token: token, username: decoded.username } }).then((res) => {
				if (res.data.error) {
					setError(res.data.error);
					window.location.reload();
				} else {
					setUser(res.data);
				}
			});
		}

		axios.get("http://localhost:5000/api/subgreddiit/subs", { params: { token: localStorage.getItem("jwtToken") } }).then((res) => {
			setAllSubs(res.data);
			setFilteredSubs(res.data);
			let a = [];
			res.data.forEach((sub) => {
				sub.tags.forEach((tag) => {
					if (!a.some((b) => b.value === tag) && tag?.length) a.push({ value: tag, selected: false });
				});
			});

			setTags(a);
			setFuse(
				new Fuse(res.data, {
					keys: ["name"],
				})
			);
		});
	}, []);

	const query = (q) => {
		if (q === "") {
			setQueryResults([]);
		} else {
			setQueryResults(fuse.search(q).map((a) => a.item));
		}
	};

	const search = (e) => {
		e.preventDefault();
		if (queryResults.length === 0) return setFilteredSubs(allSubs);
		setFilteredSubs(queryResults);
		setQueryResults([]);
	};

	const leave = (sub) => {
		axios.post("http://localhost:5000/api/subgreddiit/leave", { token: localStorage.getItem("jwtToken"), sub: sub }).then((res) => {
			if (res.data.error) setError(res.data.error);
			else {
				setUser(res.data);
				window.location.reload();
			}
		});
	};

	const join = (sub) => {
		axios.post("http://localhost:5000/api/subgreddiit/join", { token: localStorage.getItem("jwtToken"), sub: sub })
			.then((res) => {
			setUser(res.data);
			window.location.reload();
		})
			.catch((err) => {
				setError(err.response.data.error);
				if (err.response.status === 405) 
					alert("You have either been kicked out of this sub or you've left it. You can't join it again")
		});
	};

	const changeTags = (e, newTags) => {
		let a = tags.map((tag) => {
			if (newTags.includes(tag.value)) return { value: tag.value, selected: true };
			else return { value: tag.value, selected: false };
		});
		setTags(a);
		setFilteredSubs(allSubs.filter((sub) => sub.tags.some((tag) => newTags.includes(tag))));
	};

	const changeSort = (e, newSort) => {
		setSort(newSort);
		if (newSort === "ascending") {
			setFilteredSubs([...filteredSubs].sort((a, b) => (a.name > b.name ? 1 : -1)));
		}
		if (newSort === "descending") {
			setFilteredSubs([...filteredSubs].sort((a, b) => (a.name < b.name ? 1 : -1)));
		}
		if (newSort === "followers") {
			setFilteredSubs([...filteredSubs].sort((a, b) => (a.followers < b.followers ? 1 : -1)));
		}
		if (newSort === "date") {
			setFilteredSubs([...filteredSubs].sort((a, b) => (a.created_at < b.created_at ? 1 : -1)));
		}
	};

	return (
		<div>
			<Navbar />
			<div className="filters">
				<h5>filters</h5>

				<ToggleButtonGroup orientation="vertical" onChange={changeTags} value={tags.map((a) => (a.selected ? a.value : null))}>
					{tags.map((tag) => (
						<ToggleButton value={tag.value} key={tag.value}>
							{tag.value}
						</ToggleButton>
					))}
				</ToggleButtonGroup>
			</div>
			<div className="sorts">
				<h5>sort</h5>

				<ToggleButtonGroup orientation="vertical" onChange={changeSort} value={sort} exclusive>
					<ToggleButton value="ascending">ascending</ToggleButton>
					<ToggleButton value="descending">descending</ToggleButton>
					<ToggleButton value="followers">followers</ToggleButton>
					<ToggleButton value="date">date</ToggleButton>
				</ToggleButtonGroup>
			</div>
			<div style={{ paddingTop: "50px" }} className="center-align">
				<div className="row">
					<div className="col s12 m3">
						<br></br>
					</div>
					<form className="col s12 m6" onSubmit={(e) => search(e)}>
						<TextField
							fullWidth
							autoComplete="off"
							id="search"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										{" "}
										<Search />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<IconButton type="submit">
											<ArrowForwardIosIcon />
										</IconButton>
									</InputAdornment>
								),
							}}
							onChange={(e) => query(e.target.value)}
						/>
						<div className="search-results ">
							{queryResults.length
								? queryResults.map((sub) => (
										<Link to={`/sub/${sub.name}`} className="search-result" key={sub._id}>
											{sub.name}
										</Link>
								  ))
								: ""}
						</div>
					</form>
					<div className="col s12 m3">
						<br></br>
					</div>
				</div>
				<Container maxWidth="md">
					{!filteredSubs.length ? (
						<h4>There are no subs yet</h4>
					) : (
						<div>
							{filteredSubs.every((a) => !a.joined_users.includes(user.username)) === undefined ? <h4>you haven't joined any subs yet</h4> : ""}

							<h3>joined subs</h3>
							{filteredSubs
								?.filter((a) => a.joined_users.includes(user.username))
								.map((sub) => (
									<SubCard join={join} leave={leave} user={user} key={sub._id} sub={sub} />
								))}

							{filteredSubs.every((a) => a.joined_users.includes(user.username)) === undefined ? (
								<h4>there are no subs that aren't made by you</h4>
							) : (
								<div>
									<h3>other subs</h3>
									{filteredSubs
										?.filter((a) => !a.joined_users.includes(user.username))
										.map((sub) => (
											<SubCard join={join} leave={leave} user={user} key={sub._id} sub={sub} />
										))}
								</div>
							)}
						</div>
					)}
					<br></br>
				</Container>
			</div>
		</div>
	);
};

export default Subs;