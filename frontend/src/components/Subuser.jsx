import React, { useState } from "react";
import Navbar from "./Navbar";
import { Box, Modal, TextField, Button, Container, ToggleButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useParams } from "react-router-dom";

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

const Subuser = () => {
	const navigate = useNavigate();

	const [sub, setSub] = useState({});
	const [error, setError] = useState("");
	const [newPost, setNewPost] = useState({ text: "", posted_by: "" });
	const [user, setUser] = useState({});
	const [comments, setComments] = useState({ openPost: "", comments: [] });
	const [newComment, setNewComment] = useState("");
	const [newReport, setNewReport] = useState({ reporter: "", reported: "" , reason: "", post: "", sub: "", blocked: false, timer: 10, moderator: "" , ignored: false, postText: ""});

	if (error) {
		console.log(error);
	}

	const closeModal = () => {
		setNewPost({ text: "", posted_by: "" });
		setComments({ openPost: "", comments: [] });
		setNewReport({ reporter: "", reported: "" , reason: "", post: "", sub: sub.name, blocked: false, timer: 10, moderator: sub.creator , ignored: false, postText: ""});
	};

	const { subName } = useParams();

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

		axios
			.get(`http://localhost:5000/api/subgreddiit/sub/${subName}`, { params: { token: localStorage.getItem("jwtToken") } })
			.then((res) => {
				setSub(res.data);
			})
			.catch((err) => {
				if (err.response.status === 404) navigate("/404");
				setError(err.response.data);
			});
	}, []);

	const createPost = (e) => {
		e.preventDefault();
		axios.post("http://localhost:5000/api/post/createpost", { token: localStorage.getItem("jwtToken"), ...newPost, sub: sub.name }).then((res) => {
			setSub({ ...sub, posts: [...sub.posts, res.data] });
			setNewPost({ text: "", posted_by: "" });
		});
	};

	const createReport = (e) => {
		e.preventDefault();
		axios.post("http://localhost:5000/api/report/createreport", { token: localStorage.getItem("jwtToken"), data: newReport }).then((res) => {
			setNewReport({ reporter: "", reported: "" , reason: "", post: "", sub: sub.name, blocked: false, timer: 10, moderator: sub.creator , ignored: false, postText: ""});

			let reports = user.reports;
			reports.push(res.data.post);

			axios.post("http://localhost:5000/api/user/update", { token: localStorage.getItem("jwtToken"), data: { ...user, reports } }).then((res) => {
				setUser(res.data.user);
			})
			.catch((err) => setError(err.response.data));
		})
	};

	const upvote = (postID) => {
		let upvoted = user.upvoted;
		let downvoted = user.downvoted;

		if (user.upvoted.includes(postID)) {
			upvoted = upvoted.filter((id) => id !== postID);
		} else {
			upvoted.push(postID);
		}

		if (user.downvoted.includes(postID)) downvoted = downvoted.filter((id) => id !== postID);
		axios
			.post("http://localhost:5000/api/user/update", { token: localStorage.getItem("jwtToken"), data: { ...user, upvoted, downvoted } })
			.then((res) => {
				setUser(res.data.user);
			})
			.catch((err) => setError(err.response.data));
	};

	const downvote = (postID) => {
		let upvoted = user.upvoted;
		let downvoted = user.downvoted;

		if (user.downvoted.includes(postID)) {
			downvoted = downvoted.filter((id) => id !== postID);
		} else {
			downvoted.push(postID);
		}

		if (user.upvoted.includes(postID)) upvoted = upvoted.filter((id) => id !== postID);
		axios
			.post("http://localhost:5000/api/user/update", { token: localStorage.getItem("jwtToken"), data: { ...user, upvoted, downvoted } })
			.then((res) => {
				setUser(res.data.user);
			})
			.catch((err) => setError(err.response.data));
	};

	const follow = (followee) => {
		let following = user.following;
		if (following.includes(followee)) {
			following = following.filter((id) => id !== followee);
		} else {
			following.push(followee);
		}

		axios.post("http://localhost:5000/api/user/update", { token: localStorage.getItem("jwtToken"), data: { ...user, following } }).then((res) => {
			setUser(res.data.user);

			axios.get("http://localhost:5000/api/user/userdetails", { params: { token: localStorage.getItem("jwtToken"), username: followee}}).then((res) => {
			if (res.data.error) {
				setError(res.data.error);
				window.location.reload();
			} else {
				const otherUser = res.data;
				let followers = otherUser.followers;
				if (followers.includes(user.username)) {
					followers = followers.filter((id) => id !== user.username);
				} else {
					followers.push(user.username);
				}
				
				axios.post("http://localhost:5000/api/user/updateotheruser", { token: localStorage.getItem("jwtToken"), data: { ...otherUser, followers} , update: "followers"}).then((res) => {
					if (res.data.error) {
						setError(res.data.error);
						window.location.reload();
					}
				});
				}
			});
		});
	};

	const save = (postID) => {
		let posts = user.posts;
		if (posts.includes(postID)) posts = posts.filter((id) => id !== postID);
		else posts.push(postID);

		axios.post("http://localhost:5000/api/user/update", { token: localStorage.getItem("jwtToken"), data: { ...user, posts } }).then((res) => {
			setUser(res.data.user);

			axios.post("http://localhost:5000/api/post/updatesaved", { token: localStorage.getItem("jwtToken"), postID: postID }).then((res) => {
				if (res.data.error) {
					setError(res.data.error);
					window.location.reload();
				}
			});
		});
	};

	const openComments = (postID) => {
		axios
			.get(`http://localhost:5000/api/post/comments/${postID}`, { params: { token: localStorage.getItem("jwtToken") } })
			.then((res) => {
				setComments({ openPost: postID, comments: res.data });
			})
			.catch((err) => setError(err));
	};

	const createComment = (e) => {
		e.preventDefault();
		let newComments = comments.comments;
		axios
			.post(`http://localhost:5000/api/post/createcomment`, {
				token: localStorage.getItem("jwtToken"),
				post: comments.openPost,
				text: newComment,
				sub: sub.name,
			})
			.then((res) => {
				newComments.push(res.data);
				setComments({ ...comments, comments: newComments });
			});
	};
	return (
		<div>
			<Navbar />
			<Modal open={newPost.posted_by?.length ? true : false} onClose={() => closeModal()}>
				<Box sx={style}>
					<h3>create a new post</h3>
					<form className="new-post">
						<TextField margin="dense" fullWidth className="post" label="text" onChange={(e) => setNewPost({ ...newPost, text: e.target.value })} multiline minRows={3} />

						<Button sx={{ marginTop: "12px" }} variant="contained" disabled={!newPost.text} size="large" color="secondary" onClick={(e) => createPost(e)}>
							create post
						</Button>
					</form>
				</Box>
			</Modal>

			<Modal open={newReport.reporter?.length ? true : false} onClose={() => closeModal()}>
				<Box sx={style}>
					<h3>report this post</h3>
					<form className="new-post">
						<TextField margin="dense" fullWidth className="post" label="reason" onChange={(e) => setNewReport({ ...newReport, reason: e.target.value })} multiline minRows={3} />

						<Button sx={{ marginTop: "12px" }} variant="contained" size="large" disabled={!newReport.reason} color="secondary" onClick={(e) => createReport(e)}>
							report
						</Button>
					</form>
				</Box>
			</Modal>

			<Modal open={comments?.openPost?.length ? true : false} onClose={() => closeModal()}>
				<Box sx={style}>
					<h3>Comments</h3>
					<div className="comments-container">
						{comments.comments.map((comment) => (
							<div className="comment" key={comment._id}>
								<h5 className="comment-author" style={{color: "purple", fontSize: "20px", marginBottom: "3px", fontStyle: "italic"}}>{comment.posted_by}</h5>
								<p className="comment-text" style={{fontSize: "20px", marginTop: "0px"}}>{comment.text}</p>
							</div>
						))}
					</div>
					<form className="new-post">
						<TextField margin="dense" fullWidth className="post" label="text" onChange={(e) => setNewComment(e.target.value)} multiline minRows={2} />

						<Button sx={{ marginTop: "12px" }} variant="contained" size="large" color="secondary" onClick={(e) => createComment(e)}>
							create comment
						</Button>
					</form>
				</Box>
			</Modal>

			<div style={{ paddingTop: "30px" }} className="container">
				<div className="row">
					<div className="col m4">
						<img src="https://media.discordapp.net/attachments/845613955660644402/1078563600630816839/image.png" alt="subImage" style={{ width: "100%", borderRadius: "15px" }} />
					</div>
					<div className="col m8" style={{ paddingLeft: "50px" }}>
						<h1>
							Welcome to <span style={{ color: "purple" }}>{sub?.name}</span>
						</h1>

						<p style={{ fontSize: "20px", paddingLeft: "5px" }}>{sub.description}</p>

						<Button variant="contained" size="large" color="secondary" sx={{ marginTop: "20px" }} onClick={() => setNewPost({ ...newPost, posted_by: user.username })}>
							Create Post
						</Button>
					</div>
				</div>
			</div>

			<Container maxWidth="lg">
				<h2 className="center-align">posts</h2>
				{sub.posts?.map((post) => (
					<div className="row" key={post._id}>
						<div className="col m12">
							<div className="sub-card w-100">
								<div className="card-content">
									<p style={{ fontSize: "25px" }}>{post.text}</p>
								</div>
								<div className="card-action">
									<p style={{ color: "purple", fontStyle: "italic", fontSize: "18px" }}>posted by {post.posted_by}</p>
									<ToggleButton className="disable-color" value="upvote" selected={user.upvoted.includes(post._id)} onClick={() => upvote(post._id)}>
										<i className="material-icons">thumb_up</i>
									</ToggleButton>
									<ToggleButton className="disable-color" value="downvote" selected={user.downvoted.includes(post._id)} onClick={() => downvote(post._id)}>
										<i className="material-icons">thumb_down</i>
									</ToggleButton>
									<ToggleButton className="disable-color" value="follow" selected={user.following.includes(post.posted_by)} onClick={() => follow(post.posted_by)} disabled={user.username === post.posted_by}>
										<i className="material-icons">person_add</i>
									</ToggleButton>
									<ToggleButton className="disable-color" value="save" selected={user.posts.includes(post._id)} onClick={() => save(post._id)}>
										<i className="material-icons">save</i>
									</ToggleButton>
									<ToggleButton value="comments" onClick={() => openComments(post._id)}>
										<i className="material-icons">comment</i>
									</ToggleButton>
									<ToggleButton value="report" onClick={() => setNewReport({...newReport, reporter: user.username, reported: post?.posted_by, post: post?._id, postText: post?.text, moderator: sub.creator, sub: sub.name})} className="disable-color" disabled={user.reports.includes(post?._id) || user.username === post?.posted_by}>
										<i className="material-icons">report</i>
									</ToggleButton>
								</div>
							</div>
						</div>
					</div>
				))}
			</Container>
		</div>
	);
};

export default Subuser;