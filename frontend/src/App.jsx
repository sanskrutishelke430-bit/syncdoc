// App.jsx — TEMPORARY: minimal test to prove real-time sync works.
// We'll replace this with the real app (routing, pages, etc.) once sync is confirmed.
import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

function App() {
  const [text, setText] = useState('');

  useEffect(() => {
    // Create a Yjs document — this holds the shared, syncable data
    const ydoc = new Y.Doc();

    // Connect to our backend's WebSocket relay.
    // "test-room" is the shared "room" name — anyone connecting with
    // this same name will sync together, just like a real document ID would.
    const provider = new WebsocketProvider('ws://localhost:5000', 'test-room', ydoc);

    // A shared text type — Yjs's special data structure for collaborative text
    const ytext = ydoc.getText('shared-text');

    // Whenever the shared text changes (by us OR another connected user), update our display
    const updateText = () => setText(ytext.toString());
    ytext.observe(updateText);
    updateText(); // set initial value

    // Cleanup when the component unmounts
    return () => {
      ytext.unobserve(updateText);
      provider.destroy();
      ydoc.destroy();
    };
  }, []);

  const handleChange = (e) => {
    // This is a simplified way to update shared text —
    // we'll use a proper editor binding later for the real block editor
    const ydoc = window.__ydoc; // placeholder, replaced below
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>SyncDoc — Real-Time Sync Test</h1>
      <p>Open this same page in two browser windows and type below. Both should update live.</p>
      <SyncTextBox />
    </div>
  );
}

// Separated into its own component so the Yjs binding logic is self-contained
function SyncTextBox() {
  const [text, setText] = useState('');
  const [ydocRef, setYdocRef] = useState(null);
  const [ytextRef, setYtextRef] = useState(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:5000', 'test-room', ydoc);
    const ytext = ydoc.getText('shared-text');

    const updateText = () => setText(ytext.toString());
    ytext.observe(updateText);
    updateText();

    setYdocRef(ydoc);
    setYtextRef(ytext);

    return () => {
      ytext.unobserve(updateText);
      provider.destroy();
      ydoc.destroy();
    };
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (!ytextRef) return;

    // Replace the entire shared text with the new value.
    // (Simple approach for this test — the real editor will do smarter, position-based edits.)
    ytextRef.delete(0, ytextRef.length);
    ytextRef.insert(0, newValue);
  };

  return (
    <textarea
      value={text}
      onChange={handleChange}
      rows={10}
      style={{ width: '100%', maxWidth: '600px', fontSize: '16px', padding: '10px' }}
      placeholder="Type here..."
    />
  );
}

export default App;