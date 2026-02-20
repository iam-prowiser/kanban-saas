const mongoose = require('mongoose');

const Task = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    project: { type: mongoose.Schema.ObjectId, ref: "Project" },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    status: { type: String, enum: ['todo', 'in-progress', 'done'] }
}, {
    timestamps: true
})

module.exports = mongoose.model("Task", Task)