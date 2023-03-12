const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subGreddiitSchema = new Schema({
    creator: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true },
    blocked_keywords: { type: [String], required: true },
    
    joined_users: { type: [String], required: true },
    blocked_users: { type: [String], required: true },
}, {
    timestamps: true,
});

const subgreddiit = mongoose.model("subGreddiit", subGreddiitSchema);

module.exports = subgreddiit;
