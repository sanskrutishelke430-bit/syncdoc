// Block.jsx — renders and edits a single block, based on its type
import './Block.css';
import BlockToolbar from './BlockToolbar';

function Block({ block, onChange, onKeyDown, onFocus, autoFocus, onTypeChange }) {  const handleInput = (e) => {
    onChange(block.id, e.target.value);
  };

  // Different placeholder text depending on block type — helps guide the user
  const placeholders = {
    paragraph: "Type '/' for commands, or just start writing...",
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    quote: 'Quote',
    codeBlock: '// code here',
    bulletList: 'List item',
    numberedList: 'List item',
  };

  const className = `block block-${block.type}`;

  // Code blocks and quotes get a distinct visual treatment via CSS classes,
  // but all types share the same underlying editable text area for now.
    return (
    <div className={className}>
      <div className="block-toolbar-wrapper">
        <BlockToolbar onSelectType={(newType) => onTypeChange(block.id, newType)} />
      </div>
      <textarea
        className="block-input"
        value={block.content}
        onChange={handleInput}
        onKeyDown={(e) => onKeyDown(e, block.id)}
        onFocus={() => onFocus && onFocus(block.id)}
        placeholder={placeholders[block.type] || 'Type something...'}
        rows={1}
        autoFocus={autoFocus}
      />
    </div>
  );
}

export default Block;