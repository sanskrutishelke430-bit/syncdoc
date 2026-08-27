// Document.js — Mongoose schema for a collaborative document
const mongoose = require('mongoose');

// A single node in the AST (matches CONTRACT.md)
const astNodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: [
      'paragraph', 'heading1', 'heading2', 'heading3',
      'bulletList', 'numberedList', 'quote', 'codeBlock',
      'divider', 'image',
    ],
  },
  content: { type: String, default: '' },
  attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
  children: { type: [mongoose.Schema.Types.Mixed], default: [] },
  createdBy: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
}, { _id: false });

// The overall AST wrapper (a document node containing top-level children)
const astSchema = new mongoose.Schema({
  type: { type: String, default: 'document' },
  children: { type: [astNodeSchema], default: [] },
}, { _id: false });

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled Document',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  ast: {
    type: astSchema,
    default: () => ({ type: 'document', children: [] }),
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Document', documentSchema);