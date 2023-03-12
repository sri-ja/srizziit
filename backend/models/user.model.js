const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fname: { type: String, required: true, trim: true },
  lname: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  age: { type: Number, required: true },
  contact: { type: Number, required: true },
  password: { type: String, required: true, trim: true },

  followers: { type: [String], required: true },
  following: { type: [String], required: true },

  own_subs: { type: [String], required: true },
  joined_subs: { type: [String], required: true },
  left_subs: { type: [String], required: true },
  req_subs: { type: [String], required: true },
  
  posts: { type: [Schema.Types.ObjectId], required: true },
  upvoted: { type: [Schema.Types.ObjectId], required: true },
	downvoted: { type: [Schema.Types.ObjectId], required: true },
  reports: { type: [Schema.Types.ObjectId], required: true },
});

const user = mongoose.model("User", userSchema);

module.exports = user;
