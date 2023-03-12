const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const validator = require("validator");

const User = require("../models/user.model");

// fname, lname, username, email, age, contact, password
router.post("/register", (req, res) => {
	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			return res.status(400).json({ email: "Email already exists" });
		} 
		else {
			User.findOne({ username: req.body.username }).then((user) => {
				if (user) {
					return res.status(400).json({ username: "Username already exists" });
				} 
				else {
					if (!validator.isEmail(req.body.email)) {
						return res.status(400).json({ email: "Invalid email" });
					}
					if (!validator.isMobilePhone(req.body.contact)) {
						return res.status(400).json({ contact: "Invalid contact" });
					}
					if (!validator.isLength(req.body.password, { min: 6, max: 30 })) {
						return res.status(400).json({ password: "Password must be at least 6 characters" });
					}
					
					const newUser = new User({
						fname: req.body.fname,
						lname: req.body.lname,
						username: req.body.username,
						email: req.body.email,
						age: req.body.age,
						contact: req.body.contact,
						password: req.body.password
					});

					bcrypt.genSalt(10, function (err, salt) {
						bcrypt.hash(newUser.password, salt, function (err, hash) {
							newUser.password = hash;
							newUser
								.save()
								.then((user) => res.json(user))
								.catch((err) => console.log(err));
						});
					});
				}
			});
		}
	});
});

// username and password
router.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	User.findOne({ username }).then((user) => {
		if (!user) {
			return res.status(404).json({ usernamenotfound: "Username not found" });
		}
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (isMatch) {
				jwt.sign(
					{username: user.username},
					keys.secretOrKey,
					(err, token) => {
						res.json({
							success: true,
							token:token,
						});
					}
				);
			} 
			else {
				return res
					.status(400)
					.json({ passwordincorrect: "Password incorrect" });
			}
		});
	});
});

// token and data
router.post("/update", (req, res) => {
	jwt.verify(req.body.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		}
		else {
			User.findOne({ username: decoded.username }).then((user) => {
				if (!user) {
				return res.status(404).json({ error: "User not found" });
				}
				else {
					user.fname = req.body.data.fname;
					user.lname = req.body.data.lname;
					user.username = req.body.data.username;
					user.email = req.body.data.email;
					user.age = req.body.data.age;
					user.contact = req.body.data.contact;
					user.followers = req.body.data.followers;
					user.following = req.body.data.following;
					user.own_subs = req.body.data.own_subs;
					user.joined_subs = req.body.data.joined_subs;
					user.left_subs = req.body.data.left_subs;
					user.req_subs = req.body.data.req_subs;
					user.posts = req.body.data.posts;
					user.upvoted = req.body.data.upvoted;
					user.downvoted = req.body.data.downvoted;
					user.reports = req.body.data.reports;

					user.save().then((user) => {
						jwt.sign({username: user.username}, keys.secretOrKey, (err, token) => {
							res.json({
								success: true,
								token: token,
								user: user
							});
						});
					});
				}
			});
		}
	});
});

// token and data of the other user and update (which tells me what to update)
router.post("/updateotheruser", (req, res) => {
	jwt.verify(req.body.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		}
		else {
			User.findOne({ username: req.body.data.username }).then((user) => {
				if (!user) {
					return res.status(404).json({ error: "User not found" });
				}
				else {
					if (req.body.update === "followers") {
						user.followers = req.body.data.followers;
						user.save().then((user) => {
							res.json({
								success: true,
								user: user
							});
						});
					}
					else if (req.body.update === "following") {
						if (user.following.includes(decoded.username)) {
							user.following = req.body.data.following;
							user.save().then((user) => {
								res.json({
									success: true,
									user: user
								});
							});
						} else {
							return res.status(400).json({ error: "Invalid update" });
						}
					}
					else if(req.body.update === "submod") {
						user.joined_subs = req.body.data.joined_subs;
						user.req_subs = req.body.data.req_subs;
						user.save().then((user) => {
							res.json({
								success: true,
								user: user
							});
						});
					} 
					else {
						return res.status(400).json({ error: "Invalid update" });
					}
				}	
			});
		}
	});
})

// token and username
router.get("/userdetails", (req, res) => {
	jwt.verify(req.query.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		}
		else {
			User.findOne({ username: req.query.username }).then((user) => {
				if (!user) {
					return res.status(404).json({ error: "User not found" });
				}
				else {
					res.json(user);
				}
			});
		}
	});
});


module.exports = router;