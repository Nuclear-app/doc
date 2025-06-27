---
sidebar_position: 7
---

# Topic Management

The Topic module provides comprehensive type-safe CRUD operations and utility functions for managing topics in the Nuclear application. This module handles topic creation, updates, deletion, and advanced search and filtering capabilities.

## Overview

The Topic module is located in `lib/topic.ts` and provides functions for:
- **CRUD Operations**: Create, read, update, and delete topics
- **Block Associations**: Link topics to specific content blocks
- **Search and Filter**: Advanced search by name and content filtering
- **Utility Functions**: Random selection, examples, and quiz associations
- **Validation**: Input validation and existence checks

## API Reference

### Core CRUD Functions

#### `getTopicById(id: string): Promise<Topic | null>`
Get a topic by its unique ID.

```typescript
const topic = await getTopicById('topic-123');
if (topic) {
  console.log(`Found topic: ${topic.name}`);
}
```

#### `getAllTopics(): Promise<Topic[]>`
Get all topics in the system.

```typescript
const allTopics = await getAllTopics();
console.log(`Total topics: ${allTopics.length}`);
```

#### `createTopic(data: CreateTopicData): Promise<Topic>`
Create a new topic with validated input data.

**Parameters:**
- `data.name` (required): Topic name
- `data.description` (optional): Topic description
- `data.blockId` (optional): ID of the associated block
- `data.examples` (optional): Example content for the topic

```typescript
const newTopic = await createTopic({
  name: 'Nuclear Fusion',
  description: 'The process of combining atomic nuclei',
  blockId: 'block-123',
  examples: 'Sun fusion, hydrogen bombs, fusion reactors'
});

console.log(`Created topic: ${newTopic.id}`);
```

#### `updateTopic(id: string, data: Partial<Topic>): Promise<Topic>`
Update an existing topic's information.

```typescript
const updatedTopic = await updateTopic('topic-123', {
  name: 'Advanced Nuclear Fusion',
  description: 'Advanced concepts in nuclear fusion',
  examples: 'ITER project, magnetic confinement, inertial confinement'
});

console.log(`Updated topic: ${updatedTopic.name}`);
```

#### `deleteTopic(id: string): Promise<Topic>`
Delete a topic by its ID.

```typescript
const deletedTopic = await deleteTopic('topic-123');
console.log(`Deleted topic: ${deletedTopic.name}`);
```

### Utility Functions

#### `topicExists(id: string): Promise<boolean>`
Check if a topic exists by its ID.

```typescript
if (await topicExists('topic-123')) {
  console.log('Topic exists');
} else {
  console.log('Topic not found');
}
```

### Relationship Queries

#### `getTopicBlock(id: string): Promise<Block | null>`
Get the block associated with a topic.

```typescript
const block = await getTopicBlock('topic-123');
if (block) {
  console.log(`Topic block: ${block.title}`);
}
```

#### `getTopicQuizzes(id: string): Promise<Quiz[]>`
Get all quizzes for a topic.

```typescript
const topicQuizzes = await getTopicQuizzes('topic-123');
console.log(`Topic has ${topicQuizzes.length} quizzes`);
```

#### `getTopicsByBlock(blockId: string): Promise<Topic[]>`
Get all topics for a specific block.

```typescript
const blockTopics = await getTopicsByBlock('block-123');
console.log(`Block has ${blockTopics.length} topics`);
```

### Advanced Functions

#### `getTopicWithRelations(id: string)`
Get a topic with all related data.

```typescript
const topicWithRelations = await getTopicWithRelations('topic-123');
console.log(`Topic: ${topicWithRelations.name}`);
console.log(`Block: ${topicWithRelations.block?.title}`);
console.log(`Quizzes: ${topicWithRelations.quizzes.length}`);
```

### Search and Filter Functions

#### `searchTopicsByName(searchTerm: string): Promise<Topic[]>`
Search topics by name (case-insensitive).

```typescript
const searchResults = await searchTopicsByName('nuclear');
console.log(`Found ${searchResults.length} topics containing 'nuclear'`);
```

#### `getTopicsWithExamples(): Promise<Topic[]>`
Get all topics that have examples.

```typescript
const topicsWithExamples = await getTopicsWithExamples();
console.log(`Found ${topicsWithExamples.length} topics with examples`);
```

#### `getRandomTopic(): Promise<Topic | null>`
Get a random topic.

```typescript
const randomTopic = await getRandomTopic();
if (randomTopic) {
  console.log(`Random topic: ${randomTopic.name}`);
}
```

#### `getRandomTopicByBlock(blockId: string): Promise<Topic | null>`
Get a random topic for a specific block.

```typescript
const randomBlockTopic = await getRandomTopicByBlock('block-123');
if (randomBlockTopic) {
  console.log(`Random block topic: ${randomBlockTopic.name}`);
}
```

#### `getTopicsWithQuizzes(): Promise<Topic[]>`
Get all topics that have quizzes.

```typescript
const topicsWithQuizzes = await getTopicsWithQuizzes();
console.log(`Found ${topicsWithQuizzes.length} topics with quizzes`);
```

## Data Types

### Topic Model
```typescript
interface Topic {
  id: string;
  name: string;
  description?: string;
  blockId?: string;
  examples?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### CreateTopicData
```typescript
interface CreateTopicData {
  name: string;
  description?: string;
  blockId?: string;
  examples?: string;
}
```

## Error Handling

The Topic module defines a custom error class for consistent error handling:

```typescript
class TopicError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TopicError';
  }
}
```

### Common Error Scenarios

1. **Topic Not Found**
```typescript
try {
  const topic = await getTopicById('non-existent-id');
  if (!topic) {
    throw new TopicError('Topic not found');
  }
} catch (error) {
  if (error instanceof TopicError) {
    console.error('Topic error:', error.message);
  }
}
```

2. **Invalid Block Association**
```typescript
try {
  const topic = await createTopic({
    name: 'Test Topic',
    blockId: 'non-existent-block'
  });
} catch (error) {
  if (error instanceof TopicError) {
    console.error('Block validation error:', error.message);
  }
}
```

3. **Duplicate Topic Name**
```typescript
try {
  const topic = await createTopic({
    name: 'Existing Topic Name',
    description: 'This name already exists'
  });
} catch (error) {
  if (error instanceof TopicError) {
    console.error('Duplicate name error:', error.message);
  }
}
```

## Usage Examples

### Complete Topic Management Workflow

```typescript
async function manageTopic() {
  try {
    // Create a new topic
    const newTopic = await createTopic({
      name: 'Nuclear Fission',
      description: 'The process of splitting atomic nuclei',
      blockId: 'block-123',
      examples: 'Nuclear power plants, atomic bombs, uranium decay'
    });

    // Update topic information
    const updatedTopic = await updateTopic(newTopic.id, {
      description: 'The process of splitting atomic nuclei to release energy',
      examples: 'Nuclear power plants, atomic bombs, uranium decay, chain reactions'
    });

    // Get topic relationships
    const block = await getTopicBlock(updatedTopic.id);
    const quizzes = await getTopicQuizzes(updatedTopic.id);

    console.log(`Topic: "${updatedTopic.name}"`);
    console.log(`Block: ${block?.title}, Quizzes: ${quizzes.length}`);
    console.log(`Examples: ${updatedTopic.examples}`);

    // Check if topic exists before operations
    if (await topicExists(updatedTopic.id)) {
      const topic = await getTopicById(updatedTopic.id);
      console.log(`Topic created: ${topic?.createdAt}`);
    }

  } catch (error) {
    if (error instanceof TopicError) {
      console.error('Topic management error:', error.message);
    }
  }
}
```

### Topic Search and Discovery

```typescript
async function discoverTopics() {
  try {
    // Search for topics by name
    const nuclearTopics = await searchTopicsByName('nuclear');
    console.log(`Found ${nuclearTopics.length} nuclear-related topics`);

    // Get topics with examples
    const topicsWithExamples = await getTopicsWithExamples();
    console.log(`Found ${topicsWithExamples.length} topics with examples`);

    // Get topics with quizzes
    const topicsWithQuizzes = await getTopicsWithQuizzes();
    console.log(`Found ${topicsWithQuizzes.length} topics with quizzes`);

    // Get random topics for exploration
    const randomTopic = await getRandomTopic();
    if (randomTopic) {
      console.log(`Random topic to explore: ${randomTopic.name}`);
      console.log(`Description: ${randomTopic.description}`);
    }

    // Search results analysis
    for (const topic of nuclearTopics) {
      const quizzes = await getTopicQuizzes(topic.id);
      console.log(`${topic.name}: ${quizzes.length} quizzes, Examples: ${topic.examples ? 'Yes' : 'No'}`);
    }

  } catch (error) {
    if (error instanceof TopicError) {
      console.error('Topic discovery error:', error.message);
    }
  }
}
```

### Block Topic Organization

```typescript
async function organizeBlockTopics(blockId: string) {
  try {
    // Get all topics for the block
    const blockTopics = await getTopicsByBlock(blockId);
    
    console.log(`Block has ${blockTopics.length} topics`);

    // Analyze topic distribution
    const analysis = {
      totalTopics: blockTopics.length,
      topicsWithExamples: blockTopics.filter(t => t.examples).length,
      topicsWithQuizzes: 0,
      averageDescriptionLength: 0
    };

    // Calculate statistics
    let totalDescriptionLength = 0;
    for (const topic of blockTopics) {
      const quizzes = await getTopicQuizzes(topic.id);
      analysis.topicsWithQuizzes += quizzes.length;
      
      if (topic.description) {
        totalDescriptionLength += topic.description.length;
      }
    }

    if (blockTopics.length > 0) {
      analysis.averageDescriptionLength = totalDescriptionLength / blockTopics.length;
    }

    console.log('Block Topic Analysis:', analysis);

    // Create additional topics if needed
    if (blockTopics.length < 5) {
      const additionalTopics = [
        { name: 'Basic Concepts', description: 'Fundamental principles' },
        { name: 'Advanced Applications', description: 'Real-world applications' },
        { name: 'Historical Context', description: 'Historical development' }
      ];

      for (const topicData of additionalTopics) {
        if (!blockTopics.find(t => t.name === topicData.name)) {
          const topic = await createTopic({
            ...topicData,
            blockId: blockId
          });
          console.log(`Created topic: ${topic.name}`);
        }
      }
    }

  } catch (error) {
    if (error instanceof TopicError) {
      console.error('Block topic organization error:', error.message);
    }
  }
}
```

### Topic Content Enhancement

```typescript
async function enhanceTopicContent() {
  try {
    // Get all topics
    const allTopics = await getAllTopics();
    
    // Find topics that need enhancement
    const topicsNeedingExamples = allTopics.filter(topic => !topic.examples);
    const topicsNeedingDescription = allTopics.filter(topic => !topic.description);

    console.log(`Topics needing examples: ${topicsNeedingExamples.length}`);
    console.log(`Topics needing descriptions: ${topicsNeedingDescription.length}`);

    // Enhance topics with missing examples
    for (const topic of topicsNeedingExamples) {
      const enhancedTopic = await updateTopic(topic.id, {
        examples: `Examples for ${topic.name}: Real-world applications, case studies, demonstrations`
      });
      console.log(`Enhanced topic "${enhancedTopic.name}" with examples`);
    }

    // Enhance topics with missing descriptions
    for (const topic of topicsNeedingDescription) {
      const enhancedTopic = await updateTopic(topic.id, {
        description: `Comprehensive overview of ${topic.name} including key concepts and applications`
      });
      console.log(`Enhanced topic "${enhancedTopic.name}" with description`);
    }

    // Get random topics for content review
    const randomTopics = [];
    for (let i = 0; i < 3; i++) {
      const randomTopic = await getRandomTopic();
      if (randomTopic) {
        randomTopics.push(randomTopic);
      }
    }

    console.log('Random topics for content review:');
    for (const topic of randomTopics) {
      console.log(`- ${topic.name}: ${topic.description || 'No description'}`);
    }

  } catch (error) {
    if (error instanceof TopicError) {
      console.error('Topic enhancement error:', error.message);
    }
  }
}
```

### Topic Quiz Integration

```typescript
async function integrateTopicQuizzes() {
  try {
    // Get all topics
    const allTopics = await getAllTopics();
    
    // Find topics without quizzes
    const topicsWithoutQuizzes = [];
    for (const topic of allTopics) {
      const quizzes = await getTopicQuizzes(topic.id);
      if (quizzes.length === 0) {
        topicsWithoutQuizzes.push(topic);
      }
    }

    console.log(`Found ${topicsWithoutQuizzes.length} topics without quizzes`);

    // Create quizzes for topics that don't have them
    for (const topic of topicsWithoutQuizzes) {
      // This would integrate with the Quiz module
      console.log(`Creating quiz for topic: ${topic.name}`);
      
      // Example quiz creation (would need Quiz module integration)
      // const quiz = await createQuiz({
      //   title: `${topic.name} Assessment`,
      //   description: `Quiz for topic: ${topic.name}`,
      //   topicId: topic.id,
      //   timeLimit: 15,
      //   passingScore: 70
      // });
    }

    // Get topics with multiple quizzes
    const topicsWithMultipleQuizzes = [];
    for (const topic of allTopics) {
      const quizzes = await getTopicQuizzes(topic.id);
      if (quizzes.length > 1) {
        topicsWithMultipleQuizzes.push({
          topic,
          quizCount: quizzes.length
        });
      }
    }

    console.log(`Topics with multiple quizzes: ${topicsWithMultipleQuizzes.length}`);
    for (const item of topicsWithMultipleQuizzes) {
      console.log(`${item.topic.name}: ${item.quizCount} quizzes`);
    }

  } catch (error) {
    if (error instanceof TopicError) {
      console.error('Topic quiz integration error:', error.message);
    }
  }
}
```

## Best Practices

### 1. Validate Topic Content
```typescript
// ✅ Good - Validate topic name quality
if (!data.name.trim()) {
  throw new TopicError('Topic name cannot be empty');
}

if (data.name.length > 100) {
  throw new TopicError('Topic name too long');
}

// ✅ Good - Validate description length
if (data.description && data.description.length > 1000) {
  throw new TopicError('Topic description too long');
}
```

### 2. Handle Relationships Properly
```typescript
// ✅ Good - Check block exists before creating topic
if (blockId && !await blockExists(blockId)) {
  throw new TopicError('Block does not exist');
}
```

### 3. Use Efficient Queries
```typescript
// ✅ Good - Use Promise.all for parallel queries
const [block, quizzes] = await Promise.all([
  getTopicBlock(topicId),
  getTopicQuizzes(topicId)
]);

// ❌ Avoid - Sequential queries
const block = await getTopicBlock(topicId);
const quizzes = await getTopicQuizzes(topicId);
```

### 4. Implement Topic Validation
```typescript
// ✅ Good - Validate topic completeness
async function validateTopic(topicId: string) {
  const topic = await getTopicById(topicId);
  if (!topic) {
    throw new TopicError('Topic not found');
  }

  if (!topic.name.trim()) {
    throw new TopicError('Topic must have a name');
  }

  if (topic.description && topic.description.length > 1000) {
    throw new TopicError('Topic description too long');
  }

  return true;
}
```

## Performance Considerations

- **Indexing**: Ensure blockId field is indexed
- **Search Indexing**: Index topic names for fast search
- **Batch Operations**: Use `getAllTopics()` for bulk operations
- **Caching**: Consider caching frequently accessed topic data
- **Pagination**: For large topic lists, implement pagination

## Related Modules

- **[Block Management](./block)** - Associate topics with content blocks
- **[Quiz System](./quiz)** - Create quizzes for topics
- **[Question Management](./question)** - Add questions to topic quizzes
- **[User Management](./user)** - Track topic creators

---

Next: [Fill-in-the-Blank](./fill-in-the-blank) - Learn how to create interactive fill-in-the-blank content with search and random utilities. 