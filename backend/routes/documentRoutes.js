// documentRoutes.js — defines the URL paths for document operations
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getDocuments,
  createDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
  shareDocument,
} = require('../controllers/documentController');

// All document routes require a logged-in user
router.use(protect);

router.get('/', getDocuments);
router.post('/', createDocument);
router.get('/:id', getDocumentById);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);
router.post('/:id/share', shareDocument);

module.exports = router;