const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const { default: mongoose } = require("mongoose");
const Report = require("../models/report.model");

router.post("/createreport", (req, res) => {
    jwt.verify(req.body.token, keys.secretOrKey, (err, decoded) => {
        if (err) {
            return res.status(400).json({ error: "Invalid token" });
        } else {
            const newReport = new Report({
                reporter: req.body.data.reporter,
                reported: req.body.data.reported,
                reason: req.body.data.reason,
                post: req.body.data.post,
                blocked: req.body.data.blocked,
                timer: req.body.data.timer,
                moderator: req.body.data.moderator,
                ignored: req.body.data.ignored,
                postText: req.body.data.postText,
                sub: req.body.data.sub,
            });
            newReport
                .save()
                .then((report) => res.json(report))
                .catch((err) => console.log(err));
        }
    });
});

router.get("/getreports/:subName", (req, res) => {
    jwt.verify(req.query.token, keys.secretOrKey, (err, decoded) => {
        if (err) {
            return res.status(400).json({ error: "Invalid token" });
        } else {
            Report.find({ sub: req.params.subName })
                .then((reports) => res.json(reports))
                .catch((err) => console.log(err));
        }
    });
});

router.post("/updatereport", (req, res) => {
    jwt.verify(req.body.token, keys.secretOrKey, (err, decoded) => {
        if (err) {
            return res.status(400).json({ error: "Invalid token" });
        } else {
            Report.findOne({ _id: req.body.data._id })
                .then((report) => {
                    report.ignored = req.body.data.ignored;
                    report.blocked = req.body.data.blocked;

                    report
                        .save()
                        .then((report) => res.json(report))
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        }
    });
});

router.delete("/deletereport", (req, res) => {
    jwt.verify(req.body.token, keys.secretOrKey, (err, decoded) => {
        if (err) {
            return res.status(400).json({ error: "Invalid token" });
        } else {
            Report.findOne({ _id: req.body.data._id }).then((report) => {
                if (!report) {
                    return res.status(404).json({ error: "Report not found" });
                }
                if (report.ignored) {
                    return res.status(400).json({ error: "Report already ignored" });
                }
                if (report.moderator !== decoded.username) {
                    return res.status(400).json({ error: "You are not the moderator" });
                }

                report.deleteOne();
                return res.status(200).json({ success: "Report deleted" });
            });
        }
    });
});

module.exports = router;