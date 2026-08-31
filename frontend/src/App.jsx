// App.jsx — TEMPORARY: previewing the Sidebar component
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar activeItem="documents" />
      <div style={{ padding: '2rem' }}>
        <h1>Main content area will go here</h1>
      </div>
    </div>
  );
}

export default App;