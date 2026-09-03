// BlockEditor.jsx — manages the full list of blocks: rendering, adding,
// deleting, and keyboard navigation between them
import { useState, useRef } from 'react';
import Block from './Block';
import {
  createBlock,
  updateBlockContent,
  insertBlockAfter,
  deleteBlock,
  findBlockById,
} from '../utils/blockUtils';
import './BlockEditor.css';

function BlockEditor({ initialBlocks = [], onBlocksChange, currentUser = 'user' }) {
  // Start with at least one empty paragraph block if none were provided
  const [blocks, setBlocks] = useState(
    initialBlocks.length > 0 ? initialBlocks : [createBlock('paragraph', currentUser)]
  );
  const [focusedBlockId, setFocusedBlockId] = useState(null);

  // Whenever blocks change, update our own state AND notify the parent
  // (the parent will eventually save this to the backend / sync via Yjs)
  const updateBlocks = (newBlocks) => {
    setBlocks(newBlocks);
    if (onBlocksChange) onBlocksChange(newBlocks);
  };

  const handleChange = (blockId, newContent) => {
    updateBlocks(updateBlockContent(blocks, blockId, newContent));
  };

  const handleFocus = (blockId) => {
    setFocusedBlockId(blockId);
  };

  const handleKeyDown = (e, blockId) => {
    // Enter (without Shift) creates a new paragraph block right after this one
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const newBlock = createBlock('paragraph', currentUser);
      const newBlocks = insertBlockAfter(blocks, blockId, newBlock);
      updateBlocks(newBlocks);
      setFocusedBlockId(newBlock.id);
      return;
    }

    // Backspace on an empty block deletes it (unless it's the only block left)
    if (e.key === 'Backspace') {
      const block = findBlockById(blocks, blockId);
      if (block && block.content === '' && blocks.length > 1) {
        e.preventDefault();
        const index = blocks.findIndex((b) => b.id === blockId);
        const newBlocks = deleteBlock(blocks, blockId);
        updateBlocks(newBlocks);
        // Move focus to the previous block
        const previousBlock = newBlocks[Math.max(0, index - 1)];
        if (previousBlock) setFocusedBlockId(previousBlock.id);
      }
    }
  };

  return (
    <div className="block-editor">
      {blocks.map((block) => (
        <Block
          key={block.id}
          block={block}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          autoFocus={block.id === focusedBlockId}
        />
      ))}
    </div>
  );
}

export default BlockEditor;