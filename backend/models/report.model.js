const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    reporter: { type: String, required: true },
    reported: { type: String, required: true },
    reason: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, required: true },
    blocked: { type: Boolean, required: true },
    timer: { type: Number, required: true },
    moderator: { type: String, required: true },
    ignored: { type: Boolean, required: true },
    postText: { type: String, required: true }, 
    sub: { type: String, required: true },
}, {
    timestamps: true,
});

const report = mongoose.model("Report", reportSchema);

module.exports = report;
