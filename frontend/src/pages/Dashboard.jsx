// Dashboard.jsx — main dashboard page, brings together Sidebar and document cards
import Sidebar from '../components/Sidebar';
import DocumentCard from '../components/DocumentCard';
import './Dashboard.css';

function Dashboard() {
  // Placeholder data for now — we'll connect this to real API data
  // (GET /api/documents) once the page itself looks right.
  const documents = [
    { id: 1, title: 'Technical Specification', updatedAt: '2h ago', status: 'In progress', iconType: 'paragraph' },
    { id: 2, title: 'API Documentation', updatedAt: 'Yesterday', status: 'Draft', iconType: 'code' },
    { id: 3, title: 'Project Architecture', updatedAt: '3 days ago', status: 'Shared', iconType: 'notes' },
  ];

  return (
    <div className="dashboard">
      <Sidebar activeItem="documents" />

      <main className="dashboard-main">
        <h1 className="dashboard-title">Welcome back</h1>
        <p className="dashboard-subtitle">{documents.length} documents updated this week</p>

        <p className="dashboard-section-label">Recent</p>
        <div className="dashboard-grid">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              title={doc.title}
              updatedAt={doc.updatedAt}
              status={doc.status}
              iconType={doc.iconType}
              onClick={() => console.log('Open document', doc.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;