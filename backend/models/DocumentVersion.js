// DocumentVersion.js — Mongoose schema for a saved snapshot of a document's history
const mongoose = require('mongoose');

const documentVersionSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  ast: {
    type: mongoose.Schema.Types.Mixed, // full snapshot of the AST at this point in time
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  summary: {
    type: String,
    default: '', // short human-readable note, e.g. "Added code block"
  },
}, {
  timestamps: true, // createdAt tells us when this version was saved
});

module.exports = mongoose.model('DocumentVersion', documentVersionSchema);