// documentController.js — handles create/read/update/delete for documents
const Document = require('../models/Document');
const User = require('../models/User');

// GET /api/documents — list all documents the logged-in user owns or collaborates on
const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({
      $or: [{ owner: req.userId }, { collaborators: req.userId }],
    })
      .select('title owner collaborators createdAt updatedAt') // skip the heavy "ast" field for the list view
      .populate('owner', 'name email')
      .sort({ updatedAt: -1 });

    res.json(documents);
  } catch (error) {
    next(error);
  }
};

// POST /api/documents — create a new document
const createDocument = async (req, res, next) => {
  try {
    const { title } = req.body;

    const document = await Document.create({
      title: title || 'Untitled Document',
      owner: req.userId,
      ast: { type: 'document', children: [] },
    });

    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
};

// GET /api/documents/:id — get one document, including full AST
const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('collaborators', 'name email');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check the user is allowed to view this document
    const isOwner = document.owner._id.toString() === req.userId;
    const isCollaborator = document.collaborators.some((c) => c._id.toString() === req.userId);

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(document);
  } catch (error) {
    next(error);
  }
};

// PUT /api/documents/:id — update title and/or AST
const updateDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const isOwner = document.owner.toString() === req.userId;
    const isCollaborator = document.collaborators.some((c) => c.toString() === req.userId);

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.body.title !== undefined) document.title = req.body.title;
    if (req.body.ast !== undefined) document.ast = req.body.ast;

    await document.save();

    res.json(document);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/documents/:id — only the owner can delete
const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the owner can delete this document' });
    }

    await document.deleteOne();

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// POST /api/documents/:id/share — add a collaborator by email
const shareDocument = async (req, res, next) => {
  try {
    const { email } = req.body;

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the owner can share this document' });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: 'No user found with that email' });
    }

    if (!document.collaborators.includes(userToAdd._id)) {
      document.collaborators.push(userToAdd._id);
      await document.save();
    }

    res.json(document);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDocuments,
  createDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
  shareDocument,
};