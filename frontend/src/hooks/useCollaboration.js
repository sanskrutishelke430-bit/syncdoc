// useCollaboration.js — a custom hook that manages a Yjs-synced array of blocks
// for real-time collaboration on a specific document
import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// documentId becomes the "room" — anyone opening the same document
// connects to the same room and sees each other's changes live
function useCollaboration(documentId, initialBlocks) {
  const [blocks, setBlocks] = useState(initialBlocks || []);
  const [isConnected, setIsConnected] = useState(false);
  const ydocRef = useRef(null);
  const yarrayRef = useRef(null);
  const providerRef = useRef(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!documentId) return;

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      'ws://localhost:5000',
      `document:${documentId}`, // room name, matches CONTRACT.md
      ydoc
    );
    const yarray = ydoc.getArray('blocks');

    ydocRef.current = ydoc;
    yarrayRef.current = yarray;
    providerRef.current = provider;

    provider.on('status', (event) => {
      setIsConnected(event.status === 'connected');
    });

    // If the shared array is empty (first person to open this document
    // in this session), seed it with the blocks we loaded from the database
    const seedIfEmpty = () => {
      if (yarray.length === 0 && initialBlocks && initialBlocks.length > 0 && !hasInitialized.current) {
        hasInitialized.current = true;
        yarray.insert(0, initialBlocks);
      }
    };

    // Whenever the shared array changes (by us or another user), update our display
    const updateBlocks = () => {
      setBlocks(yarray.toArray());
    };

    yarray.observe(updateBlocks);

    provider.on('sync', (isSynced) => {
      if (isSynced) {
        seedIfEmpty();
        updateBlocks();
      }
    });

    return () => {
      yarray.unobserve(updateBlocks);
      provider.destroy();
      ydoc.destroy();
    };
  }, [documentId]);

  // Replaces the entire shared array with a new set of blocks.
  // Simple approach for now — good enough since Yjs still merges concurrent
  // replacements from different users without data loss at the array level.
  const updateSharedBlocks = (newBlocks) => {
    const yarray = yarrayRef.current;
    if (!yarray) return;

    yarray.delete(0, yarray.length);
    yarray.insert(0, newBlocks);
  };

  return { blocks, updateSharedBlocks, isConnected };
}

export default useCollaboration;