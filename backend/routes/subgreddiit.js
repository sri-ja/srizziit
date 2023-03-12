const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const subGreddiit = require("../models/subgreddiit.model");
const User = require("../models/user.model");
const { Post, Comment } = require("../models/post.model");
const { default: mongoose } = require("mongoose");

router.post("/create", (req, res) => {
	jwt.verify(req.body.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		} else {
			subGreddiit.findOne({ name: req.body.data.name }).then((subgreddiit) => {
				if (subgreddiit) {
					return res.status(409).json({ name: "SubGreddiit with this name already exists" });
				} else {
					const newSubGreddiit = new subGreddiit({
						creator: decoded.username,
						name: req.body.data.name,
						description: req.body.data.description,
						tags: req.body.data.tags.map((tag) => tag.toLowerCase()),
						blocked_keywords: req.body.data.blocked_keywords.map((keyword) => keyword.toLowerCase()),
						joined_users: decoded.username,
					});

					newSubGreddiit
						.save()
						.then((subgreddiit) => res.json(subgreddiit))
						.catch((err) => console.log(err));
				}
			});
		}
	});
});

router.get("/subdetails/:username", (req, res) => {
	jwt.verify(req.query.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		} else {
			subGreddiit.find({ creator: req.params.username }).then((subgreddiits) => {
				if (!subgreddiits) {
					return res.json({ subs: [] });
				} else {
					res.json(subgreddiits);
				}
			});
		}
	});
});

router.delete("/delete", (req, res) => {
	jwt.verify(req.body.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		} else {
			subGreddiit.findOne({ name: req.body.sub }).then((subgreddiit) => {
				if (!subgreddiit) return res.status(404).json({ error: "SubGreddiit not found" });
				if (subgreddiit.creator !== decoded.username) return res.status(401).json({ error: "You are not the creator of this subgreddiit" });
                
				subgreddiit.deleteOne();
				return res.status(200).json({ success: "SubGreddiit deleted successfully" });
			});
		}
	});
});

router.get("/sub/:subName", (req, res) => {
	jwt.verify(req.query.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		} else {
			subGreddiit.findOne({ name: req.params.subName }).then((foundSub) => {
				if (!foundSub) return res.status(404).json({ error: "sub not found" });
				Post.find({ sub: req.params.subName }).then((foundPosts) => {
					if (foundSub.creator !== decoded.username) {
						foundPosts = foundPosts.map((post) => (foundSub.blocked_users.includes(post.posted_by) ? { ...post.toJSON(), posted_by: "Blocked User" } : post));
					}
					res.json({ ...foundSub.toJSON(), posts: foundPosts });
				});
			});
		}
	});
});

router.get("/getsub/:subName", (req, res) => {
	jwt.verify(req.query.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		} else {
			subGreddiit.findOne({ name: req.params.subName }).then((foundSub) => {
				if (!foundSub) return res.status(404).json({ error: "sub not found" });
				res.json(foundSub);
			});
		}
	});
});

router.get("/getjoinreqs/:subName", (req, res) => {
	jwt.verify(req.query.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		} else {
			subGreddiit.findOne({ name: req.params.subName }).then(async (foundSub) => {
				if (!foundSub) return res.status(404).json({ error: "sub not found" });
				if (foundSub.creator !== decoded.username) return res.status(401).json({ error: "You are not the creator of this subgreddiit" });

				User.find({ req_subs: req.params.subName }).then((foundUsers) => {
					if (!foundUsers) return res.json({ users: [] });

					res.json(foundUsers);
				})
			});
		}
	});
});

router.post("/update", (req, res) => {
	jwt.verify(req.body.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		} else {
			subGreddiit.findOne({ name: req.body.sub }).then((subgreddiit) => {
				if (!subgreddiit) return res.status(404).json({ error: "SubGreddiit not found" });
				if (subgreddiit.creator !== decoded.username) return res.status(401).json({ error: "You are not the creator of this subgreddiit" });

				subgreddiit.joined_users = req.body.data.joined_users;
				subgreddiit.blocked_users = req.body.data.blocked_users;

				subgreddiit.save().then((sub) => res.json(sub));
			});
		}
	});
});

router.get("/subs", (req, res) => {
	jwt.verify(req.query.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		} else {
			subGreddiit.find({}).then((foundSubs) => {
				if (!foundSubs) return res.status(404).json([]);
				res.json(foundSubs);
			});
		}
	});
});

router.post("/leave", (req, res) => {
	jwt.verify(req.body.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		} else {
			subGreddiit.findOne({ name: req.body.sub }).then((foundSub) => {
				if (!foundSub) return res.status(404).json({ error: "SubGreddiit not found" });

				foundSub.joined_users = foundSub.joined_users.filter((user) => user !== decoded.username);
				foundSub.save();
			})

			User.findOne({ username: decoded.username }).then((foundUser) => {
				if (!foundUser) return res.status(404).json({ error: "User not found" });

				foundUser.joined_subs = foundUser.joined_subs.filter((sub) => sub !== req.body.sub);
				foundUser.left_subs.push(req.body.sub);
				foundUser.save().then((user) => res.json(user));
			});
		}
	});
});

router.post("/join", (req, res) => {
	jwt.verify(req.body.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		} else {
			User.findOne({ username: decoded.username }).then((foundUser) => {
				if (!foundUser) return res.status(404).json({ error: "User not found" });

				if (foundUser.left_subs.includes(req.body.sub)) return res.status(405).json({ error: "You have already left this subgreddiit" });
				
				foundUser.req_subs.push(req.body.sub);
				foundUser.save().then((user) => res.json(user));
			});
		}
	});
});

router.post("/blockuser", (req, res) => {
	jwt.verify(req.body.token, keys.secretOrKey, (err, decoded) => {
		if (err) return res.status(400).json({ error: "Invalid token" });
		subGreddiit.findOne({ name: req.body.sub }).then((foundSub) => {
			if (!foundSub) return res.status(404).json({ error: "Sub not found" });
			if (foundSub.creator !== decoded.username) return res.status(401).json({ error: "You are not the creator of this subgreddiit" });
			if (foundSub.blocked_users.includes(req.body.user)) return res.status(405).json({ error: "User is already blocked" });
			foundSub.blocked_users.push(req.body.user);
			foundSub.joined_users.splice(foundSub.joined_users.indexOf(req.body.user), 1);
			foundSub.save().then((sub) => res.json(sub));
		});
		User.findOne({ username: req.body.user }).then((foundUser) => {
			if (!foundUser) return res.status(404).json({ error: "User not found" });
			foundUser.joined_subs.splice(foundUser.joined_subs.indexOf(req.body.sub), 1);
			foundUser.left_subs.push(req.body.sub);
			foundUser.save();
		});
		Report.findById(req.body.report).then((foundReport) => {
			foundReport.blocked = true;
			foundReport.save();
		});
	});
});

module.exports = router;