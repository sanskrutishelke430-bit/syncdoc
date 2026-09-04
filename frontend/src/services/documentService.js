// documentService.js — functions for creating/loading/saving documents
import apiRequest from './api';

export const getDocuments = () => apiRequest('/documents');

export const getDocumentById = (id) => apiRequest(`/documents/${id}`);

export const createDocument = (title) =>
  apiRequest('/documents', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });

export const updateDocument = (id, updates) =>
  apiRequest(`/documents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });

export const deleteDocument = (id) =>
  apiRequest(`/documents/${id}`, { method: 'DELETE' });