// App.jsx — TEMPORARY: previewing the BlockEditor
import BlockEditor from './components/BlockEditor';

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Block Editor Test</h2>
      <BlockEditor
        currentUser="test-user"
        onBlocksChange={(blocks) => console.log('Blocks updated:', blocks)}
      />
    </div>
  );
}

export default App;