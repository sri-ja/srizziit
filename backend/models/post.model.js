const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: { type: String, required: true },
    posted_by: { type: String, required: true },
    sub: { type: String, required: true },
	post: { type: Schema.Types.ObjectId, required: true }
});

const postSchema = new Schema({
    text: { type: String, required: true },
    posted_by: { type: String, required: true },
    sub: { type: String, required: true },
    saved_by: { type: [String], required: true },
});

const Post = mongoose.model("Post", postSchema);
const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Post, Comment };