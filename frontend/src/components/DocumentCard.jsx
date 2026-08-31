// DocumentCard.jsx — a single document tile shown in the dashboard grid
import './DocumentCard.css';

const statusStyles = {
  'In progress': { bg: 'var(--color-accent-bg)', text: 'var(--color-accent-text)' },
  'Draft': { bg: 'var(--color-status-draft-bg)', text: 'var(--color-status-draft-text)' },
  'Shared': { bg: 'var(--color-status-shared-bg)', text: 'var(--color-status-shared-text)' },
};

const iconColors = {
  paragraph: '#378ADD',
  code: '#D85A30',
  notes: '#639922',
};

function DocumentCard({ title, updatedAt, status = 'Draft', iconType = 'paragraph', onClick }) {
  const statusStyle = statusStyles[status] || statusStyles['Draft'];
  const iconColor = iconColors[iconType] || iconColors['paragraph'];

  return (
    <div className="doc-card" onClick={onClick} style={{ borderTopColor: iconColor }}>
      <div className="doc-card-icon" style={{ color: iconColor }}>📄</div>
      <p className="doc-card-title">{title}</p>
      <div className="doc-card-footer">
        <span
          className="doc-card-status"
          style={{ background: statusStyle.bg, color: statusStyle.text }}
        >
          {status}
        </span>
        <span className="doc-card-time">{updatedAt}</span>
      </div>
    </div>
  );
}

export default DocumentCard;