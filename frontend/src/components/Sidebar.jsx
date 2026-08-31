// Sidebar.jsx — left navigation for the dashboard
import './Sidebar.css';

function Sidebar({ activeItem = 'documents' }) {
  const navItems = [
    { id: 'documents', label: 'My documents', icon: '📄' },
    { id: 'shared', label: 'Shared with me', icon: '👥' },
    { id: 'favorites', label: 'Favorites', icon: '⭐' },
    { id: 'trash', label: 'Trash', icon: '🗑️' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">📘</span>
        <span className="sidebar-logo-text">SyncDoc</span>
      </div>

      <button className="sidebar-new-doc">
        <span>＋</span> New document
      </button>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-nav-item ${activeItem === item.id ? 'active' : ''}`}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;