---
sidebar_position: 3
---

# Block Management

The Block module provides comprehensive type-safe CRUD operations and utility functions for managing content blocks (posts) in the Nuclear application. This module handles block creation, updates, deletion, and complex relationship queries.

## Overview

The Block module is located in `lib/block.ts` and provides functions for:
- **CRUD Operations**: Create, read, update, and delete content blocks
- **Relationship Queries**: Get block authors, folders, and related content
- **Content Associations**: Manage fill-in-the-blanks, points updates, questions, quizzes, and topics
- **Validation**: Input validation and existence checks

## API Reference

### Core CRUD Functions

#### `getBlockById(id: string): Promise<Block | null>`
Get a block by its unique ID.

```typescript
const block = await getBlockById('block-123');
if (block) {
  console.log(`Found block: ${block.title}`);
}
```

#### `getAllBlocks(): Promise<Block[]>`
Get all blocks in the system.

```typescript
const allBlocks = await getAllBlocks();
console.log(`Total blocks: ${allBlocks.length}`);
```

#### `createBlock(data: CreateBlockData): Promise<Block>`
Create a new content block with validated input data.

**Parameters:**
- `data.title` (required): Block title
- `data.content` (required): Block content
- `data.authorId` (required): ID of the block author
- `data.folderId` (optional): ID of the containing folder
- `data.published` (optional): Publication status

```typescript
const newBlock = await createBlock({
  title: 'Introduction to Nuclear Physics',
  content: 'Nuclear physics is the study of atomic nuclei...',
  authorId: 'user-123',
  folderId: 'folder-456',
  published: true
});

console.log(`Created block: ${newBlock.id}`);
```

#### `updateBlock(id: string, data: Partial<Block>): Promise<Block>`
Update an existing block's information.

```typescript
const updatedBlock = await updateBlock('block-123', {
  title: 'Updated Nuclear Physics Introduction',
  content: 'Revised content about nuclear physics...',
  published: false
});

console.log(`Updated block: ${updatedBlock.title}`);
```

#### `deleteBlock(id: string): Promise<Block>`
Delete a block by its ID.

```typescript
const deletedBlock = await deleteBlock('block-123');
console.log(`Deleted block: ${deletedBlock.title}`);
```

### Utility Functions

#### `blockExists(id: string): Promise<boolean>`
Check if a block exists by its ID.

```typescript
if (await blockExists('block-123')) {
  console.log('Block exists');
} else {
  console.log('Block not found');
}
```

### Relationship Queries

#### `getBlockAuthor(id: string): Promise<User | null>`
Get the author of a block.

```typescript
const author = await getBlockAuthor('block-123');
if (author) {
  console.log(`Block author: ${author.name}`);
}
```

#### `getBlockFolder(id: string): Promise<Folder | null>`
Get the folder containing a block.

```typescript
const folder = await getBlockFolder('block-123');
if (folder) {
  console.log(`Block folder: ${folder.name}`);
}
```

### Content Association Queries

#### `getBlockFillInTheBlanks(id: string): Promise<FillInTheBlank[]>`
Get all fill-in-the-blank items for a block.

```typescript
const fillInTheBlanks = await getBlockFillInTheBlanks('block-123');
console.log(`Block has ${fillInTheBlanks.length} fill-in-the-blank items`);
```

#### `getBlockPointsUpdates(id: string): Promise<PointsUpdate[]>`
Get all points updates for a block.

```typescript
const pointsUpdates = await getBlockPointsUpdates('block-123');
console.log(`Block has ${pointsUpdates.length} points updates`);
```

#### `getBlockQuestions(id: string): Promise<Question[]>`
Get all questions for a block.

```typescript
const questions = await getBlockQuestions('block-123');
console.log(`Block has ${questions.length} questions`);
```

#### `getBlockQuizzes(id: string): Promise<Quiz[]>`
Get all quizzes for a block.

```typescript
const quizzes = await getBlockQuizzes('block-123');
console.log(`Block has ${quizzes.length} quizzes`);
```

#### `getBlockTopics(id: string): Promise<Topic[]>`
Get all topics for a block.

```typescript
const topics = await getBlockTopics('block-123');
console.log(`Block has ${topics.length} topics`);
```

## Data Types

### Block Model
```typescript
interface Block {
  id: string;
  title: string;
  content: string;
  authorId: string;
  folderId?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### CreateBlockData
```typescript
interface CreateBlockData {
  title: string;
  content: string;
  authorId: string;
  folderId?: string;
  published?: boolean;
}
```

## Error Handling

The Block module defines a custom error class for consistent error handling:

```typescript
class BlockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlockError';
  }
}
```

### Common Error Scenarios

1. **Block Not Found**
```typescript
try {
  const block = await getBlockById('non-existent-id');
  if (!block) {
    throw new BlockError('Block not found');
  }
} catch (error) {
  if (error instanceof BlockError) {
    console.error('Block error:', error.message);
  }
}
```

2. **Invalid Author**
```typescript
try {
  const block = await createBlock({
    title: 'Test Block',
    content: 'Test content',
    authorId: 'non-existent-user'
  });
} catch (error) {
  if (error instanceof BlockError) {
    console.error('Author validation error:', error.message);
  }
}
```

3. **Missing Required Fields**
```typescript
try {
  const block = await createBlock({
    title: '', // Empty title
    content: 'Test content',
    authorId: 'user-123'
  });
} catch (error) {
  if (error instanceof BlockError) {
    console.error('Validation error:', error.message);
  }
}
```

## Usage Examples

### Complete Block Management Workflow

```typescript
async function manageBlock() {
  try {
    // Create a new block
    const newBlock = await createBlock({
      title: 'Advanced Nuclear Physics',
      content: 'This block covers advanced concepts...',
      authorId: 'user-123',
      folderId: 'folder-456',
      published: false
    });

    // Update block content
    const updatedBlock = await updateBlock(newBlock.id, {
      content: 'Updated advanced nuclear physics content...',
      published: true
    });

    // Get block relationships
    const author = await getBlockAuthor(updatedBlock.id);
    const folder = await getBlockFolder(updatedBlock.id);
    const topics = await getBlockTopics(updatedBlock.id);

    console.log(`Block "${updatedBlock.title}" by ${author?.name} in ${folder?.name}`);
    console.log(`Contains ${topics.length} topics`);

    // Check if block exists before operations
    if (await blockExists(updatedBlock.id)) {
      const block = await getBlockById(updatedBlock.id);
      console.log(`Block is ${block?.published ? 'published' : 'draft'}`);
    }

  } catch (error) {
    if (error instanceof BlockError) {
      console.error('Block management error:', error.message);
    }
  }
}
```

### Content Analysis Workflow

```typescript
async function analyzeBlockContent(blockId: string) {
  try {
    const block = await getBlockById(blockId);
    if (!block) {
      throw new BlockError('Block not found');
    }

    // Get all associated content
    const [fillInTheBlanks, pointsUpdates, questions, quizzes, topics] = await Promise.all([
      getBlockFillInTheBlanks(blockId),
      getBlockPointsUpdates(blockId),
      getBlockQuestions(blockId),
      getBlockQuizzes(blockId),
      getBlockTopics(blockId)
    ]);

    // Analyze content
    const analysis = {
      title: block.title,
      contentLength: block.content.length,
      wordCount: block.content.split(' ').length,
      interactiveElements: {
        fillInTheBlanks: fillInTheBlanks.length,
        questions: questions.length,
        quizzes: quizzes.length,
        topics: topics.length
      },
      totalPoints: pointsUpdates.reduce((sum, update) => sum + update.points, 0),
      author: await getBlockAuthor(blockId),
      folder: await getBlockFolder(blockId)
    };

    console.log('Block Analysis:', analysis);
    return analysis;

  } catch (error) {
    if (error instanceof BlockError) {
      console.error('Analysis error:', error.message);
    }
    throw error;
  }
}
```

### Bulk Block Operations

```typescript
async function bulkBlockOperations() {
  try {
    // Get all blocks
    const allBlocks = await getAllBlocks();
    
    // Filter by publication status
    const publishedBlocks = allBlocks.filter(block => block.published);
    const draftBlocks = allBlocks.filter(block => !block.published);
    
    console.log(`Total blocks: ${allBlocks.length}`);
    console.log(`Published: ${publishedBlocks.length}`);
    console.log(`Drafts: ${draftBlocks.length}`);

    // Analyze each block
    for (const block of allBlocks) {
      const topics = await getBlockTopics(block.id);
      const questions = await getBlockQuestions(block.id);
      
      console.log(`${block.title}: ${topics.length} topics, ${questions.length} questions`);
    }

    // Get blocks by author
    const authorId = 'user-123';
    const authorBlocks = allBlocks.filter(block => block.authorId === authorId);
    console.log(`Author ${authorId} has ${authorBlocks.length} blocks`);

  } catch (error) {
    if (error instanceof BlockError) {
      console.error('Bulk operation error:', error.message);
    }
  }
}
```

### Content Publishing Workflow

```typescript
async function publishBlock(blockId: string) {
  try {
    // Check if block exists
    if (!await blockExists(blockId)) {
      throw new BlockError('Block not found');
    }

    // Get block with all content
    const block = await getBlockById(blockId);
    const [topics, questions, quizzes] = await Promise.all([
      getBlockTopics(blockId),
      getBlockQuestions(blockId),
      getBlockQuizzes(blockId)
    ]);

    // Validate content completeness
    if (topics.length === 0) {
      throw new BlockError('Block must have at least one topic');
    }

    if (questions.length === 0) {
      throw new BlockError('Block must have at least one question');
    }

    // Publish the block
    const publishedBlock = await updateBlock(blockId, {
      published: true
    });

    console.log(`Published block: ${publishedBlock.title}`);
    console.log(`Content: ${topics.length} topics, ${questions.length} questions, ${quizzes.length} quizzes`);

    return publishedBlock;

  } catch (error) {
    if (error instanceof BlockError) {
      console.error('Publishing error:', error.message);
    }
    throw error;
  }
}
```

## Best Practices

### 1. Validate Content Before Creation
```typescript
// ✅ Good - Validate content quality
if (data.content.length < 100) {
  throw new BlockError('Content must be at least 100 characters');
}

if (!data.title.trim()) {
  throw new BlockError('Title cannot be empty');
}
```

### 2. Handle Relationships Properly
```typescript
// ✅ Good - Check author exists before creating block
if (!await userExists(authorId)) {
  throw new BlockError('Author does not exist');
}

// ✅ Good - Check folder exists if provided
if (folderId && !await folderExists(folderId)) {
  throw new BlockError('Folder does not exist');
}
```

### 3. Use Efficient Queries
```typescript
// ✅ Good - Use Promise.all for parallel queries
const [author, folder, topics] = await Promise.all([
  getBlockAuthor(blockId),
  getBlockFolder(blockId),
  getBlockTopics(blockId)
]);

// ❌ Avoid - Sequential queries
const author = await getBlockAuthor(blockId);
const folder = await getBlockFolder(blockId);
const topics = await getBlockTopics(blockId);
```

### 4. Implement Content Validation
```typescript
// ✅ Good - Validate content structure
async function validateBlockContent(blockId: string) {
  const [topics, questions] = await Promise.all([
    getBlockTopics(blockId),
    getBlockQuestions(blockId)
  ]);

  if (topics.length === 0) {
    throw new BlockError('Block must have topics');
  }

  if (questions.length === 0) {
    throw new BlockError('Block must have questions');
  }

  return true;
}
```

## Performance Considerations

- **Indexing**: Ensure authorId and folderId fields are indexed
- **Batch Operations**: Use `getAllBlocks()` for bulk operations
- **Caching**: Consider caching frequently accessed block data
- **Pagination**: For large block lists, implement pagination
- **Selective Loading**: Only load related data when needed

## Related Modules

- **[User Management](./user)** - Manage block authors
- **[Folder Organization](./folder)** - Organize blocks in folders
- **[Topic Management](./topic)** - Categorize block content
- **[Question Management](./question)** - Add questions to blocks
- **[Quiz System](./quiz)** - Create quizzes for blocks
- **[Fill-in-the-Blank](./fill-in-the-blank)** - Add interactive content
- **[Points System](./points-update)** - Track block completion

---

Next: [Folder Organization](./folder) - Learn how to organize blocks in hierarchical folder structures. 