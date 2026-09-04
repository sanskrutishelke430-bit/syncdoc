// Editor.jsx — the main document editing page, connected to real-time sync
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import BlockEditor from '../components/BlockEditor';
import { getDocumentById, updateDocument } from '../services/documentService';
import { getCurrentUser } from '../services/authService';
import useCollaboration from '../hooks/useCollaboration';
import './Editor.css';

function Editor() {
  const { id } = useParams(); // document id from the URL, e.g. /editor/abc123
  const currentUser = getCurrentUser();

  const [title, setTitle] = useState('');
  const [loadedBlocks, setLoadedBlocks] = useState(null); // blocks fetched from the database, before sync takes over
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
        setLoadedBlocks(doc.ast.children || []);
      } catch (err) {
        setError('Unable to load this document.');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id]);

  // Only start the collaboration connection once we've loaded the initial blocks
  const { blocks, updateSharedBlocks, isConnected } = useCollaboration(
    !loading ? id : null,
    loadedBlocks
  );

  // Auto-save: whenever blocks change, update the shared (synced) copy immediately,
  // then wait 1 second of no further changes before saving to the database
  const handleBlocksChange = useCallback((newBlocks) => {
    updateSharedBlocks(newBlocks);
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
  }, [id, updateSharedBlocks]);

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
        <span className={`editor-connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '● Live' : '○ Connecting...'}
        </span>
        <span className={`editor-save-status editor-save-status-${saveStatus}`}>
          {saveStatusText[saveStatus]}
        </span>
      </header>

      <BlockEditor
        key={blocks.length > 0 ? blocks[0]?.id : 'empty'}
        initialBlocks={blocks}
        onBlocksChange={handleBlocksChange}
        currentUser={currentUser?.id || 'unknown'}
      />
    </div>
  );
}

export default Editor;