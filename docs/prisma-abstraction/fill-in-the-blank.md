---
sidebar_position: 8
---

# Fill-in-the-Blank

The Fill-in-the-Blank module provides comprehensive type-safe CRUD operations and utility functions for managing interactive fill-in-the-blank content in the Nuclear application. This module handles content creation, updates, deletion, and advanced search and random selection capabilities.

## Overview

The Fill-in-the-Blank module is located in `lib/fillInTheBlank.ts` and provides functions for:
- **CRUD Operations**: Create, read, update, and delete fill-in-the-blank items
- **Block Associations**: Link content to specific content blocks
- **Search and Filter**: Advanced search by sentence and answer content
- **Utility Functions**: Random selection, hints, and content validation
- **Validation**: Input validation and existence checks

## API Reference

### Core CRUD Functions

#### `getFillInTheBlankById(id: string): Promise<FillInTheBlank | null>`
Get a fill-in-the-blank by its unique ID.

```typescript
const fillInTheBlank = await getFillInTheBlankById('fitb-123');
if (fillInTheBlank) {
  console.log(`Found fill-in-the-blank: ${fillInTheBlank.sentence}`);
}
```

#### `getAllFillInTheBlanks(): Promise<FillInTheBlank[]>`
Get all fill-in-the-blank items in the system.

```typescript
const allFillInTheBlanks = await getAllFillInTheBlanks();
console.log(`Total fill-in-the-blanks: ${allFillInTheBlanks.length}`);
```

#### `createFillInTheBlank(data: CreateFillInTheBlankData): Promise<FillInTheBlank>`
Create a new fill-in-the-blank with validated input data.

**Parameters:**
- `data.sentence` (required): The sentence with blanks
- `data.answer` (required): The correct answer
- `data.blockId` (optional): ID of the associated block
- `data.hint` (optional): Hint for the answer
- `data.difficulty` (optional): Difficulty level

```typescript
const newFillInTheBlank = await createFillInTheBlank({
  sentence: 'Nuclear ___ is the process of combining atomic nuclei.',
  answer: 'fusion',
  blockId: 'block-123',
  hint: 'Think of the sun',
  difficulty: 'MEDIUM'
});

console.log(`Created fill-in-the-blank: ${newFillInTheBlank.id}`);
```

#### `updateFillInTheBlank(id: string, data: Partial<FillInTheBlank>): Promise<FillInTheBlank>`
Update an existing fill-in-the-blank's information.

```typescript
const updatedFillInTheBlank = await updateFillInTheBlank('fitb-123', {
  sentence: 'Nuclear ___ is the process of combining atomic nuclei to release energy.',
  hint: 'Think of the sun and stars',
  difficulty: 'HARD'
});

console.log(`Updated fill-in-the-blank: ${updatedFillInTheBlank.sentence}`);
```

#### `deleteFillInTheBlank(id: string): Promise<FillInTheBlank>`
Delete a fill-in-the-blank by its ID.

```typescript
const deletedFillInTheBlank = await deleteFillInTheBlank('fitb-123');
console.log(`Deleted fill-in-the-blank: ${deletedFillInTheBlank.sentence}`);
```

### Utility Functions

#### `fillInTheBlankExists(id: string): Promise<boolean>`
Check if a fill-in-the-blank exists by its ID.

```typescript
if (await fillInTheBlankExists('fitb-123')) {
  console.log('Fill-in-the-blank exists');
} else {
  console.log('Fill-in-the-blank not found');
}
```

### Relationship Queries

#### `getFillInTheBlankBlock(id: string): Promise<Block | null>`
Get the block associated with a fill-in-the-blank.

```typescript
const block = await getFillInTheBlankBlock('fitb-123');
if (block) {
  console.log(`Fill-in-the-blank block: ${block.title}`);
}
```

#### `getFillInTheBlanksByBlock(blockId: string): Promise<FillInTheBlank[]>`
Get all fill-in-the-blanks for a specific block.

```typescript
const blockFillInTheBlanks = await getFillInTheBlanksByBlock('block-123');
console.log(`Block has ${blockFillInTheBlanks.length} fill-in-the-blanks`);
```

### Advanced Functions

#### `getFillInTheBlankWithRelations(id: string)`
Get a fill-in-the-blank with all related data.

```typescript
const fillInTheBlankWithRelations = await getFillInTheBlankWithRelations('fitb-123');
console.log(`Fill-in-the-blank: ${fillInTheBlankWithRelations.sentence}`);
console.log(`Block: ${fillInTheBlankWithRelations.block?.title}`);
```

### Search and Filter Functions

#### `searchFillInTheBlanksBySentence(searchTerm: string): Promise<FillInTheBlank[]>`
Search fill-in-the-blanks by sentence content (case-insensitive).

```typescript
const searchResults = await searchFillInTheBlanksBySentence('nuclear');
console.log(`Found ${searchResults.length} fill-in-the-blanks containing 'nuclear'`);
```

#### `searchFillInTheBlanksByAnswer(searchTerm: string): Promise<FillInTheBlank[]>`
Search fill-in-the-blanks by answer content (case-insensitive).

```typescript
const answerResults = await searchFillInTheBlanksByAnswer('fusion');
console.log(`Found ${answerResults.length} fill-in-the-blanks with answer 'fusion'`);
```

#### `getRandomFillInTheBlank(): Promise<FillInTheBlank | null>`
Get a random fill-in-the-blank.

```typescript
const randomFillInTheBlank = await getRandomFillInTheBlank();
if (randomFillInTheBlank) {
  console.log(`Random fill-in-the-blank: ${randomFillInTheBlank.sentence}`);
}
```

#### `getRandomFillInTheBlankByBlock(blockId: string): Promise<FillInTheBlank | null>`
Get a random fill-in-the-blank for a specific block.

```typescript
const randomBlockFillInTheBlank = await getRandomFillInTheBlankByBlock('block-123');
if (randomBlockFillInTheBlank) {
  console.log(`Random block fill-in-the-blank: ${randomBlockFillInTheBlank.sentence}`);
}
```

#### `getFillInTheBlanksWithHints(): Promise<FillInTheBlank[]>`
Get all fill-in-the-blanks that have hints.

```typescript
const fillInTheBlanksWithHints = await getFillInTheBlanksWithHints();
console.log(`Found ${fillInTheBlanksWithHints.length} fill-in-the-blanks with hints`);
```

## Data Types

### FillInTheBlank Model
```typescript
interface FillInTheBlank {
  id: string;
  sentence: string;
  answer: string;
  blockId?: string;
  hint?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  createdAt: Date;
  updatedAt: Date;
}
```

### CreateFillInTheBlankData
```typescript
interface CreateFillInTheBlankData {
  sentence: string;
  answer: string;
  blockId?: string;
  hint?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
}
```

## Error Handling

The Fill-in-the-Blank module defines a custom error class for consistent error handling:

```typescript
class FillInTheBlankError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FillInTheBlankError';
  }
}
```

### Common Error Scenarios

1. **Fill-in-the-Blank Not Found**
```typescript
try {
  const fillInTheBlank = await getFillInTheBlankById('non-existent-id');
  if (!fillInTheBlank) {
    throw new FillInTheBlankError('Fill-in-the-blank not found');
  }
} catch (error) {
  if (error instanceof FillInTheBlankError) {
    console.error('Fill-in-the-blank error:', error.message);
  }
}
```

2. **Invalid Block Association**
```typescript
try {
  const fillInTheBlank = await createFillInTheBlank({
    sentence: 'Test sentence with ___.',
    answer: 'blank',
    blockId: 'non-existent-block'
  });
} catch (error) {
  if (error instanceof FillInTheBlankError) {
    console.error('Block validation error:', error.message);
  }
}
```

3. **Invalid Sentence Format**
```typescript
try {
  const fillInTheBlank = await createFillInTheBlank({
    sentence: 'Sentence without blanks',
    answer: 'test'
  });
} catch (error) {
  if (error instanceof FillInTheBlankError) {
    console.error('Sentence format error:', error.message);
  }
}
```

## Usage Examples

### Complete Fill-in-the-Blank Management Workflow

```typescript
async function manageFillInTheBlank() {
  try {
    // Create a new fill-in-the-blank
    const newFillInTheBlank = await createFillInTheBlank({
      sentence: 'The atomic nucleus contains ___ and ___.',
      answer: 'protons, neutrons',
      blockId: 'block-123',
      hint: 'Think of the basic particles in an atom',
      difficulty: 'MEDIUM'
    });

    // Update fill-in-the-blank content
    const updatedFillInTheBlank = await updateFillInTheBlank(newFillInTheBlank.id, {
      sentence: 'The atomic nucleus contains ___ and ___, which are collectively called nucleons.',
      hint: 'Think of the basic particles in an atom - protons and neutrons',
      difficulty: 'HARD'
    });

    // Get fill-in-the-blank relationships
    const block = await getFillInTheBlankBlock(updatedFillInTheBlank.id);

    console.log(`Fill-in-the-blank: "${updatedFillInTheBlank.sentence}"`);
    console.log(`Answer: ${updatedFillInTheBlank.answer}`);
    console.log(`Block: ${block?.title}, Difficulty: ${updatedFillInTheBlank.difficulty}`);
    console.log(`Hint: ${updatedFillInTheBlank.hint}`);

    // Check if fill-in-the-blank exists before operations
    if (await fillInTheBlankExists(updatedFillInTheBlank.id)) {
      const fillInTheBlank = await getFillInTheBlankById(updatedFillInTheBlank.id);
      console.log(`Fill-in-the-blank created: ${fillInTheBlank?.createdAt}`);
    }

  } catch (error) {
    if (error instanceof FillInTheBlankError) {
      console.error('Fill-in-the-blank management error:', error.message);
    }
  }
}
```

### Content Bank Creation

```typescript
async function createFillInTheBlankBank() {
  try {
    // Define fill-in-the-blank content bank
    const contentBank = [
      {
        sentence: 'Nuclear ___ releases energy by splitting heavy nuclei.',
        answer: 'fission',
        hint: 'Think of splitting atoms',
        difficulty: 'EASY'
      },
      {
        sentence: 'The ___ number determines the element.',
        answer: 'atomic',
        hint: 'It\'s in the name of the number',
        difficulty: 'EASY'
      },
      {
        sentence: '___ energy is the energy that holds the nucleus together.',
        answer: 'binding',
        hint: 'It binds the particles together',
        difficulty: 'MEDIUM'
      },
      {
        sentence: 'Nuclear ___ occurs in the sun and stars.',
        answer: 'fusion',
        hint: 'Think of combining atoms',
        difficulty: 'MEDIUM'
      },
      {
        sentence: 'The ___ effect explains why some nuclei are unstable.',
        answer: 'tunnel',
        hint: 'Quantum mechanical phenomenon',
        difficulty: 'HARD'
      }
    ];

    const createdFillInTheBlanks = [];
    for (const contentData of contentBank) {
      const fillInTheBlank = await createFillInTheBlank({
        ...contentData,
        blockId: 'block-123' // Associate with a specific block
      });
      createdFillInTheBlanks.push(fillInTheBlank);
      console.log(`Created fill-in-the-blank: ${fillInTheBlank.sentence.substring(0, 50)}...`);
    }

    console.log(`Created ${createdFillInTheBlanks.length} fill-in-the-blanks for the content bank`);

  } catch (error) {
    if (error instanceof FillInTheBlankError) {
      console.error('Content bank creation error:', error.message);
    }
  }
}
```

### Interactive Learning System

```typescript
async function interactiveLearningSystem() {
  try {
    // Get random fill-in-the-blanks for practice
    const practiceItems = [];
    for (let i = 0; i < 5; i++) {
      const randomItem = await getRandomFillInTheBlank();
      if (randomItem) {
        practiceItems.push(randomItem);
      }
    }

    console.log('Practice Session:');
    for (let i = 0; i < practiceItems.length; i++) {
      const item = practiceItems[i];
      console.log(`${i + 1}. ${item.sentence}`);
      console.log(`   Hint: ${item.hint || 'No hint available'}`);
      console.log(`   Difficulty: ${item.difficulty || 'Not specified'}`);
      console.log('');
    }

    // Search for specific content
    const nuclearContent = await searchFillInTheBlanksBySentence('nuclear');
    const fusionAnswers = await searchFillInTheBlanksByAnswer('fusion');

    console.log(`Found ${nuclearContent.length} nuclear-related items`);
    console.log(`Found ${fusionAnswers.length} items with 'fusion' as answer`);

    // Get items with hints for guided learning
    const itemsWithHints = await getFillInTheBlanksWithHints();
    console.log(`Found ${itemsWithHints.length} items with helpful hints`);

  } catch (error) {
    if (error instanceof FillInTheBlankError) {
      console.error('Interactive learning error:', error.message);
    }
  }
}
```

### Block Content Analysis

```typescript
async function analyzeBlockFillInTheBlanks(blockId: string) {
  try {
    // Get all fill-in-the-blanks for the block
    const fillInTheBlanks = await getFillInTheBlanksByBlock(blockId);
    
    // Analyze content distribution
    const analysis = {
      totalItems: fillInTheBlanks.length,
      itemsWithHints: fillInTheBlanks.filter(item => item.hint).length,
      itemsByDifficulty: {
        EASY: 0,
        MEDIUM: 0,
        HARD: 0
      },
      averageSentenceLength: 0,
      averageAnswerLength: 0
    };

    // Calculate statistics
    let totalSentenceLength = 0;
    let totalAnswerLength = 0;

    for (const item of fillInTheBlanks) {
      // Count by difficulty
      if (item.difficulty) {
        analysis.itemsByDifficulty[item.difficulty]++;
      }

      // Calculate lengths
      totalSentenceLength += item.sentence.length;
      totalAnswerLength += item.answer.length;
    }

    // Calculate averages
    if (fillInTheBlanks.length > 0) {
      analysis.averageSentenceLength = totalSentenceLength / fillInTheBlanks.length;
      analysis.averageAnswerLength = totalAnswerLength / fillInTheBlanks.length;
    }

    console.log('Block Fill-in-the-Blank Analysis:', analysis);

    // Get random item for preview
    const randomItem = await getRandomFillInTheBlankByBlock(blockId);
    if (randomItem) {
      console.log('Sample item:');
      console.log(`Sentence: ${randomItem.sentence}`);
      console.log(`Answer: ${randomItem.answer}`);
      console.log(`Hint: ${randomItem.hint || 'No hint'}`);
    }

  } catch (error) {
    if (error instanceof FillInTheBlankError) {
      console.error('Analysis error:', error.message);
    }
    throw error;
  }
}
```

### Difficulty-Based Content Management

```typescript
async function manageDifficultyLevels(blockId: string) {
  try {
    // Get all fill-in-the-blanks for the block
    const fillInTheBlanks = await getFillInTheBlanksByBlock(blockId);
    
    // Group by difficulty
    const easyItems = fillInTheBlanks.filter(item => item.difficulty === 'EASY');
    const mediumItems = fillInTheBlanks.filter(item => item.difficulty === 'MEDIUM');
    const hardItems = fillInTheBlanks.filter(item => item.difficulty === 'HARD');

    console.log(`Difficulty breakdown: Easy: ${easyItems.length}, Medium: ${mediumItems.length}, Hard: ${hardItems.length}`);

    // Create additional items if needed for balanced difficulty
    if (easyItems.length < 3) {
      const easyItem = await createFillInTheBlank({
        sentence: 'An ___ is the smallest unit of an element.',
        answer: 'atom',
        blockId: blockId,
        hint: 'Basic building block of matter',
        difficulty: 'EASY'
      });
      console.log(`Created easy item: ${easyItem.sentence.substring(0, 30)}...`);
    }

    if (mediumItems.length < 5) {
      const mediumItem = await createFillInTheBlank({
        sentence: 'Nuclear ___ is used in power plants to generate electricity.',
        answer: 'fission',
        blockId: blockId,
        hint: 'Think of splitting atoms',
        difficulty: 'MEDIUM'
      });
      console.log(`Created medium item: ${mediumItem.sentence.substring(0, 30)}...`);
    }

    if (hardItems.length < 2) {
      const hardItem = await createFillInTheBlank({
        sentence: 'The ___ effect allows particles to escape from the nucleus.',
        answer: 'tunnel',
        blockId: blockId,
        hint: 'Quantum mechanical phenomenon',
        difficulty: 'HARD'
      });
      console.log(`Created hard item: ${hardItem.sentence.substring(0, 30)}...`);
    }

  } catch (error) {
    if (error instanceof FillInTheBlankError) {
      console.error('Difficulty management error:', error.message);
    }
  }
}
```

## Best Practices

### 1. Validate Content Quality
```typescript
// ✅ Good - Validate sentence format
if (!data.sentence.includes('___')) {
  throw new FillInTheBlankError('Sentence must contain blanks (___)');
}

if (!data.sentence.trim()) {
  throw new FillInTheBlankError('Sentence cannot be empty');
}

// ✅ Good - Validate answer quality
if (!data.answer.trim()) {
  throw new FillInTheBlankError('Answer cannot be empty');
}

if (data.answer.length > 100) {
  throw new FillInTheBlankError('Answer too long');
}
```

### 2. Handle Relationships Properly
```typescript
// ✅ Good - Check block exists before creating item
if (blockId && !await blockExists(blockId)) {
  throw new FillInTheBlankError('Block does not exist');
}
```

### 3. Use Efficient Queries
```typescript
// ✅ Good - Use Promise.all for parallel queries
const [block, items] = await Promise.all([
  getFillInTheBlankBlock(itemId),
  getFillInTheBlanksByBlock(blockId)
]);

// ❌ Avoid - Sequential queries
const block = await getFillInTheBlankBlock(itemId);
const items = await getFillInTheBlanksByBlock(blockId);
```

### 4. Implement Content Validation
```typescript
// ✅ Good - Validate fill-in-the-blank completeness
async function validateFillInTheBlank(itemId: string) {
  const item = await getFillInTheBlankById(itemId);
  if (!item) {
    throw new FillInTheBlankError('Fill-in-the-blank not found');
  }

  if (!item.sentence.includes('___')) {
    throw new FillInTheBlankError('Sentence must contain blanks');
  }

  if (!item.answer.trim()) {
    throw new FillInTheBlankError('Answer cannot be empty');
  }

  return true;
}
```

## Performance Considerations

- **Indexing**: Ensure blockId field is indexed
- **Search Indexing**: Index sentence and answer fields for fast search
- **Batch Operations**: Use `getAllFillInTheBlanks()` for bulk operations
- **Caching**: Consider caching frequently accessed content
- **Pagination**: For large content lists, implement pagination

## Related Modules

- **[Block Management](./block)** - Associate fill-in-the-blanks with content blocks
- **[Topic Management](./topic)** - Categorize content by topics
- **[User Management](./user)** - Track content creators
- **[Points System](./points-update)** - Award points for correct answers

---

Next: [Points System](./points-update) - Learn how to track points and progress with aggregation and date range utilities. 