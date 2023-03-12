import React, { useState } from "react";
import Navbar from "./Navbar";
import Submodnav from "./Submodnav";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useParams } from "react-router-dom";

const Submodreports = () => {
	const navigate = useNavigate();

	const subName = useParams().subName;
	const [sub, setSub] = useState({});
	const [reports, setReports] = useState([]);
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

			axios.get(`http://localhost:5000/api/report/getreports/${subName}`, { params: { token: token } }).then((res) => {
				if (res.data.error) {
					alert(res.data.error);
					window.location.reload();
				} else {
					setReports(res.data);
				}
			});
		}
	}, []);

	const ignored = (report) => {
		report.ignored = true;

		axios.post(`http://localhost:5000/api/report/updatereport`, { token: localStorage.getItem("jwtToken"), data: report }).then((res) => {
			if (res.data.error) {
				alert(res.data.error);
				window.location.reload();
			} else {
				window.location.reload();
			}
		});
	};

	const blocked = (report) => {
		const user = report.reported;

		axios.post(`http://localhost:5000/api/subgreddiit/blockuser`, { token: localStorage.getItem("jwtToken"), user: user, sub: report.sub, report: report._id }).then((res) => {
			if (res.data.error) alert(res.data.error);
			window.location.reload();
		});
	};

	const del = (report) => {
		const postID = report.post;
		const mod = report.moderator;

		axios.delete(`http://localhost:5000/api/post/deletepost`, { data: { token: localStorage.getItem("jwtToken"), postID: postID, mod: mod } }).then((res) => {
			if (res.data.error) {
				alert(res.data.error);
				window.location.reload();
			} else {
				window.location.reload();
			}
		});

		axios.delete("http://localhost:5000/api/report/deletereport", { data: { token: localStorage.getItem("jwtToken"), data: report } }).then((res) => {
			if (res.data.error) {
				alert(res.data.error);
				window.location.reload();
			} else {
				window.location.reload();
			}
		});
	};

	return (
		<div>
			<Navbar />
			<Submodnav />
			<div style={{ paddingTop: "10px" }} className="center-align">
				<div className="row">
					<h3 style={{ padding: "10px" }}>reports submitted to your sub</h3>
					<div className="col s12 m4">
						<br></br>
					</div>
					<div className="col s12 m4">
						{reports.map((report) => {
							return (
								<div className="card left-align" style={{ backgroundColor: "#d496fa", marginBottom: "20px" }} key={report._id}>
									<div className="card-heading" style={{ justifyContent: "center", padding: "10px" }}>
										<span style={{ fontSize: "30px", fontWeight: "500", color: "purple", paddingLeft: "10px" }}>report against: </span>
										<span style={{ fontWeight: "300", fontSize: "25px" }}>{report?.reported}</span>
									</div>
									<div className="card-content" style={{ padding: "15px 25px" }}>
										<div style={{ paddingBottom: "10px" }}>
											<span style={{ fontSize: "18px", fontWeight: "500" }}>Reported by: </span>
											<span style={{ fontSize: "18px", fontWeight: "300" }}>{report?.reporter}</span>
										</div>
										<div style={{ paddingBottom: "10px" }}>
											<span style={{ fontSize: "18px", fontWeight: "500" }}>Concern: </span>
											<span style={{ fontSize: "18px", fontWeight: "300" }}>{report?.reason}</span>
										</div>
										<div style={{ paddingBottom: "10px" }}>
											<span style={{ fontSize: "18px", fontWeight: "500" }}>Post: </span>
											<span style={{ fontSize: "18px", fontWeight: "300" }}>{report?.postText}</span>
										</div>
									</div>
									<div className="card-action center-align">
										<ButtonGroup variant="contained" color="secondary" size="large">
											<Button disabled={report?.ignored} onClick={() => blocked(report)}>
												Block User
											</Button>
											<Button disabled={report?.ignored} onClick={() => del(report)}>
												Delete Post
											</Button>
											<Button disabled={report?.ignored} onClick={() => ignored(report)}>
												Ignore
											</Button>
										</ButtonGroup>
									</div>
								</div>
							);
						})}
					</div>
					<div className="col s12 m4">
						<br></br>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Submodreports;