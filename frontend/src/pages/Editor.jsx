// Editor.jsx — the main document editing page
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BlockEditor from '../components/BlockEditor';
import { getDocumentById, updateDocument } from '../services/documentService';
import { getCurrentUser } from '../services/authService';
import './Editor.css';

function Editor() {
  const { id } = useParams(); // document id from the URL, e.g. /editor/abc123
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
  const [error, setError] = useState('');

  const saveTimeoutRef = useRef(null);

  // Load the document when the page opens
  useEffect(() => {
    const loadDocument = async () => {
      try {
        const doc = await getDocumentById(id);
        setTitle(doc.title);
        setBlocks(doc.ast.children || []);
      } catch (err) {
        setError('Unable to load this document.');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id]);

  // Auto-save: whenever blocks change, wait 1 second of no further changes, then save
  const handleBlocksChange = useCallback((newBlocks) => {
    setBlocks(newBlocks);
    setSaveStatus('saving');

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateDocument(id, {
          ast: { type: 'document', children: newBlocks },
        });
        setSaveStatus('saved');
      } catch (err) {
        setSaveStatus('error');
      }
    }, 1000);
  }, [id]);

  const handleTitleChange = async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSaveStatus('saving');

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateDocument(id, { title: newTitle });
        setSaveStatus('saved');
      } catch (err) {
        setSaveStatus('error');
      }
    }, 1000);
  };

  if (loading) {
    return <div className="editor-loading">Loading document...</div>;
  }

  if (error) {
    return (
      <div className="editor-loading">
        {error} <Link to="/dashboard">Back to dashboard</Link>
      </div>
    );
  }

  const saveStatusText = {
    saved: '✓ Saved',
    saving: 'Saving...',
    error: '⚠ Could not save',
  };

  return (
    <div className="editor-page">
      <header className="editor-topbar">
        <Link to="/dashboard" className="editor-back">← SyncDoc</Link>
        <input
          className="editor-title-input"
          value={title}
          onChange={handleTitleChange}
        />
        <span className={`editor-save-status editor-save-status-${saveStatus}`}>
          {saveStatusText[saveStatus]}
        </span>
      </header>

      <BlockEditor
        initialBlocks={blocks}
        onBlocksChange={handleBlocksChange}
        currentUser={currentUser?.id || 'unknown'}
      />
    </div>
  );
}

export default Editor;