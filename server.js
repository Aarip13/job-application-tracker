const express = require("express");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Sample Data
let jobs = [
    {
        id: 1,
        company: "Google",
        role: "SDE",
        status: "Applied"
    },
    {
        id: 2,
        company: "Microsoft",
        role: "Frontend Developer",
        status: "Interview"
    }
];
app.get("/jobs", (req, res) => {
    res.json(jobs);
});

app.post("/jobs", (req, res) => {

    const newJob = {
        id: jobs.length + 1,
        company: req.body.company,
        role: req.body.role,
        status: req.body.status
    };

    jobs.push(newJob);

    res.status(201).json(newJob);
});

app.put("/jobs/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const job = jobs.find(j => j.id === id);

    if (!job) {
        return res.status(404).json({
            message: "Job not found"
        });
    }

    job.status = req.body.status;

    res.json(job);
});

app.delete("/jobs/:id", (req, res) => {

    const id = parseInt(req.params.id);

    jobs = jobs.filter(job => job.id !== id);

    res.json({
        message: "Job deleted successfully"
    });

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});