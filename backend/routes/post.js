const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const subGreddiit = require("../models/subgreddiit.model");
const { Post, Comment } = require("../models/post.model");
const { default: mongoose } = require("mongoose");

router.post("/createpost", (req, res) => {
	jwt.verify(req.body.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		} else {
			subGreddiit.findOne({ name: req.body.sub }, (err, foundSub) => {
				if (err) return res.json(err);
				if (!req.body.text.length) return res.status(401).json({ err: "Post cannot be empty" });

				if (req.body.text.length > 1000) return res.status(402).json({ err: "Post cannot be longer than 1000 characters" });

				if (!req.body.sub.length) return res.status(403).json({ err: "Subgreddiit cannot be empty" });

				if (!foundSub) return res.status(404).json({ err: "Subgreddiit not found" });

				if (foundSub.blocked_users.includes(decoded.username)) return res.status(405).json({ err: "You are banned from this subgreddiit" });

				if (!foundSub.joined_users.includes(decoded.username) || !foundSub.creator === decoded.username) return res.status(406).json({ err: "You are not a member of this subgreddiit" });
				
				let text = req.body.text;
				foundSub.blocked_keywords.forEach((word) => {
					text = text.replaceAll(word, "*".repeat(word.length));
				});

				const newPost = new Post({
					text,
					posted_by: decoded.username,
					sub: req.body.sub,
				});
				newPost
					.save()
					.then((subgreddiit) => res.json(subgreddiit))
					.catch((err) => console.log(err));
			});
		}
	});
});

router.post("/createcomment", (req, res) => {
	jwt.verify(req.body.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		} else {
			subGreddiit.findOne({ name: req.body.sub }, (err, foundSub) => {
				if (err) return res.json(err);
				if (!foundSub) return res.status(404).json({ err: "Subgreddiit not found" });
				if (foundSub.blocked_users.includes(decoded.username)) return res.status(400).json({ err: "You are banned from this subgreddiit" });
				if (!foundSub.joined_users.includes(decoded.username) || !foundSub.creator === decoded.username) return res.status(400).json({ err: "You are not a member of this subgreddiit" });
				const newComment = new Comment({
					text: req.body.text,
					posted_by: decoded.username,
					sub: req.body.sub,
					post: req.body.post,
				});

				newComment
					.save()
					.then((comment) => {
						res.json(comment);
					})
					.catch((err) => console.log(err));
			});
		}
	});
});

router.get("/comments/:postID", (req, res) => {
	jwt.verify(req.query.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		} else {
			Comment.find({ post: req.params.postID }).then((foundComments) => {
				if (!foundComments) return res.status(404).json([]);
				res.json(foundComments);
			});
		}
	});
});

router.post("/updatesaved", (req, res) => {
	jwt.verify(req.body.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		} else {
			Post.findOne({ _id: req.body.postID }).then((foundPost) => {
				if (!foundPost) return res.status(404).json({ error: "Post not found" });

				if (foundPost.saved_by.includes(decoded.username)) {
					foundPost.saved_by = foundPost.saved_by.filter((user) => user !== decoded.username);
				} else {
					foundPost.saved_by.push(decoded.username);
				}

				foundPost.save().then((post) => res.json(post));
			});
		}
	});
});

router.get("/bookmarks", (req, res) => {
	jwt.verify(req.query.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Invalid token" });
		} else {
			Post.find({ saved_by: decoded.username }).then((foundPosts) => {
				if (!foundPosts) return res.status(404).json([]);
				res.json(foundPosts);
			});
		}
	});
});

router.delete("/deletepost", (req, res) => {
	jwt.verify(req.body.token, keys.secretOrKey, (err, decoded) => {
		if (err) {
			return res.status(401).json({ error: "Invalid token" });
		} else {
			Post.findOne({ _id: req.body.postID }).then((foundPost) => {
				if (!foundPost) return res.status(404).json({ error: "Post not found" });
				if (req.body.mod !== decoded.username) return res.status(401).json({ error: "You are not a moderator of this subg" });

				foundPost.deleteOne();
				return res.status(200).json({ success: "Post deleted" });
			});
		}
	});
});

module.exports = router;