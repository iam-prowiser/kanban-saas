const mongoose = require('mongoose')

const WorkspaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true,
})

module.exports = mongoose.model('workspace', WorkspaceSchema)