require("dotenv").config();
require("./database");

const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = process.env.PORT || 5000;
const Job = require("./Job");
const User = require("./User");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const authMiddleware = require("./authMiddleware");


// Middleware
app.use(express.json());
app.use(cors());
app.use("/jobs", authMiddleware);


app.get("/jobs", async (req, res) => {
    try {
        const { status } = req.query;

        const filter = {
            userId: req.user.id
        };

        if (status) {
            filter.status = status;
        }

        const jobs = await Job.find(filter);

        res.status(200).json(jobs);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.get("/jobs/:id", async (req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

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
            link: req.body.link,
            userId: req.user.id
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
        const updatedJob = await Job.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                status: req.body.status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json(updatedJob);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

app.delete("/jobs/:id", async (req, res) => {
    try {
        const deletedJob = await Job.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!deletedJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json({
            message: "Job deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

app.post("/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            userId: savedUser._id
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token: token
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
