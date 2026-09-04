// blockUtils.js — helper functions for creating and managing blocks
// (matches the AST node shape from CONTRACT.md)

// Generates a simple unique ID for a new block
export const generateBlockId = () => {
  return 'block-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();
};

// Creates a new empty block of a given type
export const createBlock = (type = 'paragraph', createdBy = 'unknown') => {
  return {
    id: generateBlockId(),
    type,
    content: '',
    attributes: {},
    children: [],
    createdBy,
    updatedAt: new Date().toISOString(),
  };
};

// Updates a block's content, returning a new array (doesn't mutate the original)
export const updateBlockContent = (blocks, blockId, newContent) => {
  return blocks.map((block) =>
    block.id === blockId
      ? { ...block, content: newContent, updatedAt: new Date().toISOString() }
      : block
  );
};

// Updates a block's type (e.g. paragraph -> heading1)
export const updateBlockType = (blocks, blockId, newType) => {
  return blocks.map((block) =>
    block.id === blockId ? { ...block, type: newType } : block
  );
};

// Inserts a new block right after a given block's position
export const insertBlockAfter = (blocks, afterBlockId, newBlock) => {
  const index = blocks.findIndex((b) => b.id === afterBlockId);
  if (index === -1) return [...blocks, newBlock]; // fallback: add at the end

  const newBlocks = [...blocks];
  newBlocks.splice(index + 1, 0, newBlock);
  return newBlocks;
};

// Removes a block by id
export const deleteBlock = (blocks, blockId) => {
  return blocks.filter((block) => block.id !== blockId);
};

// Moves a block up or down by one position
export const moveBlock = (blocks, blockId, direction) => {
  const index = blocks.findIndex((b) => b.id === blockId);
  if (index === -1) return blocks;

  const newIndex = direction === 'up' ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= blocks.length) return blocks; // can't move past the edges

  const newBlocks = [...blocks];
  [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
  return newBlocks;
};

// Finds a block by id
export const findBlockById = (blocks, blockId) => {
  return blocks.find((block) => block.id === blockId);
};