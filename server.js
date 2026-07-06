require("dotenv").config();
require("./database");

const express = require("express");

const app = express();
const PORT = 5000;
const Job = require("./Job");


// Middleware
app.use(express.json());


app.get("/jobs", async (req, res) => {
    try {
        const { status } = req.query;

        let jobs;

        if (status) {
            jobs = await Job.find({ status: status });
        } else {
            jobs = await Job.find();
        }

        res.status(200).json(jobs);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

app.get("/jobs/:id", async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json(job);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

app.post("/jobs", async (req, res) => {
    try {
        const newJob = new Job({
            company: req.body.company,
            role: req.body.role,
            status: req.body.status,
            notes: req.body.notes,
            link: req.body.link
        });

        const savedJob = await newJob.save();

        res.status(201).json(savedJob);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

app.put("/jobs/:id", async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        );

        if (!updatedJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json(updatedJob);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

app.delete("/jobs/:id", async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);

        if (!deletedJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            message: "Job deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});