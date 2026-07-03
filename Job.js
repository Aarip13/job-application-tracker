const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["applied", "interview", "offer", "rejected"],
        default: "applied"
    },

    appliedDate: {
        type: Date,
        default: Date.now
    },

    notes: {
        type: String
    },

    link: {
        type: String
    }
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
//mongodb+srv://madhu:<db_password>@cluster.dtuump7.mongodb.net/?appName=Cluster