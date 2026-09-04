// BlockToolbar.jsx — a small menu to change a block's type
import { useState } from 'react';
import './BlockToolbar.css';

const blockTypes = [
  { type: 'paragraph', label: 'Paragraph', icon: '¶' },
  { type: 'heading1', label: 'Heading 1', icon: 'H1' },
  { type: 'heading2', label: 'Heading 2', icon: 'H2' },
  { type: 'heading3', label: 'Heading 3', icon: 'H3' },
  { type: 'bulletList', label: 'Bullet list', icon: '•' },
  { type: 'numberedList', label: 'Numbered list', icon: '1.' },
  { type: 'quote', label: 'Quote', icon: '"' },
  { type: 'codeBlock', label: 'Code', icon: '</>' },
  { type: 'divider', label: 'Divider', icon: '—' },
];

function BlockToolbar({ onSelectType }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (type) => {
    onSelectType(type);
    setIsOpen(false);
  };

  return (
    <div className="block-toolbar">
      <button
        className="block-toolbar-trigger"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        +
      </button>

      {isOpen && (
        <div className="block-toolbar-menu">
          {blockTypes.map((bt) => (
            <button
              key={bt.type}
              className="block-toolbar-item"
              onClick={() => handleSelect(bt.type)}
              type="button"
            >
              <span className="block-toolbar-icon">{bt.icon}</span>
              <span>{bt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlockToolbar;