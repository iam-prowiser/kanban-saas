const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    workspace: { type: mongoose.Schema.ObjectId, ref: 'workspace', required: true },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
},{ 
    timestamps: true
})

module.exports = mongoose.model('Project', ProjectSchema)
