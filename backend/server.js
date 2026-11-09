
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/taskmanager")
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.log("MongoDB Error:", err));

// Task Schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "InProgress", "Completed"],
        default: "Pending"
    }
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

// Get all tasks
app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Add task
app.post("/tasks", async (req, res) => {
    const task = new Task({ title: req.body.title });
    const savedTask = await task.save();
    res.json(savedTask);
});

// Update task
app.patch("/tasks/:id", async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
    );
    res.json(updatedTask);
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
