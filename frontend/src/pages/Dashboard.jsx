// Dashboard.jsx — main dashboard page, now connected to real backend data
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DocumentCard from '../components/DocumentCard';
import { getDocuments, createDocument } from '../services/documentService';
import './Dashboard.css';

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docs = await getDocuments();
        setDocuments(docs);
      } catch (err) {
        console.error('Failed to load documents', err);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const handleNewDocument = async () => {
    try {
      const doc = await createDocument('Untitled Document');
      navigate(`/editor/${doc._id}`);
    } catch (err) {
      console.error('Failed to create document', err);
    }
  };

  const formatTimeAgo = (dateString) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="dashboard">
      <Sidebar activeItem="documents" />

      <main className="dashboard-main">
        <h1 className="dashboard-title">Welcome back</h1>
        <p className="dashboard-subtitle">
          {documents.length} document{documents.length !== 1 ? 's' : ''}
        </p>

        <button className="dashboard-new-doc-inline" onClick={handleNewDocument}>
          + New document
        </button>

        {loading ? (
          <p className="dashboard-empty">Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="dashboard-empty">No documents yet. Create your first one above.</p>
        ) : (
          <>
            <p className="dashboard-section-label">All documents</p>
            <div className="dashboard-grid">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  title={doc.title}
                  updatedAt={formatTimeAgo(doc.updatedAt)}
                  status="In progress"
                  iconType="paragraph"
                  onClick={() => navigate(`/editor/${doc._id}`)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;