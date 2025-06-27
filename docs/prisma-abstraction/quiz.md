---
sidebar_position: 5
---

# Quiz System

The Quiz module provides comprehensive type-safe CRUD operations and utility functions for managing quizzes in the Nuclear application. This module handles quiz creation, updates, deletion, and complex relationship queries with blocks and topics.

## Overview

The Quiz module is located in `lib/quiz.ts` and provides functions for:
- **CRUD Operations**: Create, read, update, and delete quizzes
- **Topic Associations**: Link quizzes to specific topics
- **Block Relationships**: Associate quizzes with content blocks
- **Quiz Management**: Handle quiz metadata and settings
- **Validation**: Input validation and existence checks

## API Reference

### Core CRUD Functions

#### `getQuizById(id: string): Promise<Quiz | null>`
Get a quiz by its unique ID.

```typescript
const quiz = await getQuizById('quiz-123');
if (quiz) {
  console.log(`Found quiz: ${quiz.title}`);
}
```

#### `getAllQuizzes(): Promise<Quiz[]>`
Get all quizzes in the system.

```typescript
const allQuizzes = await getAllQuizzes();
console.log(`Total quizzes: ${allQuizzes.length}`);
```

#### `createQuiz(data: CreateQuizData): Promise<Quiz>`
Create a new quiz with validated input data.

**Parameters:**
- `data.title` (required): Quiz title
- `data.description` (optional): Quiz description
- `data.blockId` (optional): ID of the associated block
- `data.topicId` (optional): ID of the associated topic
- `data.timeLimit` (optional): Time limit in minutes
- `data.passingScore` (optional): Minimum score to pass

```typescript
const newQuiz = await createQuiz({
  title: 'Nuclear Physics Fundamentals',
  description: 'Test your knowledge of basic nuclear physics concepts',
  blockId: 'block-123',
  topicId: 'topic-456',
  timeLimit: 30,
  passingScore: 70
});

console.log(`Created quiz: ${newQuiz.id}`);
```

#### `updateQuiz(id: string, data: Partial<Quiz>): Promise<Quiz>`
Update an existing quiz's information.

```typescript
const updatedQuiz = await updateQuiz('quiz-123', {
  title: 'Advanced Nuclear Physics Quiz',
  timeLimit: 45,
  passingScore: 80
});

console.log(`Updated quiz: ${updatedQuiz.title}`);
```

#### `deleteQuiz(id: string): Promise<Quiz>`
Delete a quiz by its ID.

```typescript
const deletedQuiz = await deleteQuiz('quiz-123');
console.log(`Deleted quiz: ${deletedQuiz.title}`);
```

### Utility Functions

#### `quizExists(id: string): Promise<boolean>`
Check if a quiz exists by its ID.

```typescript
if (await quizExists('quiz-123')) {
  console.log('Quiz exists');
} else {
  console.log('Quiz not found');
}
```

### Relationship Queries

#### `getQuizBlock(id: string): Promise<Block | null>`
Get the block associated with a quiz.

```typescript
const block = await getQuizBlock('quiz-123');
if (block) {
  console.log(`Quiz block: ${block.title}`);
}
```

#### `getQuizTopic(id: string): Promise<Topic | null>`
Get the topic associated with a quiz.

```typescript
const topic = await getQuizTopic('quiz-123');
if (topic) {
  console.log(`Quiz topic: ${topic.name}`);
}
```

### Filtering and Search Functions

#### `getQuizzesByBlock(blockId: string): Promise<Quiz[]>`
Get all quizzes for a specific block.

```typescript
const blockQuizzes = await getQuizzesByBlock('block-123');
console.log(`Block has ${blockQuizzes.length} quizzes`);
```

#### `getQuizzesByTopic(topicId: string): Promise<Quiz[]>`
Get all quizzes for a specific topic.

```typescript
const topicQuizzes = await getQuizzesByTopic('topic-456');
console.log(`Topic has ${topicQuizzes.length} quizzes`);
```

## Data Types

### Quiz Model
```typescript
interface Quiz {
  id: string;
  title: string;
  description?: string;
  blockId?: string;
  topicId?: string;
  timeLimit?: number;
  passingScore?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### CreateQuizData
```typescript
interface CreateQuizData {
  title: string;
  description?: string;
  blockId?: string;
  topicId?: string;
  timeLimit?: number;
  passingScore?: number;
}
```

## Error Handling

The Quiz module defines a custom error class for consistent error handling:

```typescript
class QuizError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuizError';
  }
}
```

### Common Error Scenarios

1. **Quiz Not Found**
```typescript
try {
  const quiz = await getQuizById('non-existent-id');
  if (!quiz) {
    throw new QuizError('Quiz not found');
  }
} catch (error) {
  if (error instanceof QuizError) {
    console.error('Quiz error:', error.message);
  }
}
```

2. **Invalid Block Association**
```typescript
try {
  const quiz = await createQuiz({
    title: 'Test Quiz',
    blockId: 'non-existent-block'
  });
} catch (error) {
  if (error instanceof QuizError) {
    console.error('Block validation error:', error.message);
  }
}
```

3. **Invalid Time Limit**
```typescript
try {
  const quiz = await createQuiz({
    title: 'Test Quiz',
    timeLimit: -5 // Invalid negative time
  });
} catch (error) {
  if (error instanceof QuizError) {
    console.error('Time limit error:', error.message);
  }
}
```

## Usage Examples

### Complete Quiz Management Workflow

```typescript
async function manageQuiz() {
  try {
    // Create a new quiz
    const newQuiz = await createQuiz({
      title: 'Nuclear Fusion Basics',
      description: 'Test understanding of nuclear fusion concepts',
      blockId: 'block-123',
      topicId: 'topic-456',
      timeLimit: 25,
      passingScore: 75
    });

    // Update quiz settings
    const updatedQuiz = await updateQuiz(newQuiz.id, {
      timeLimit: 30,
      passingScore: 80
    });

    // Get quiz relationships
    const block = await getQuizBlock(updatedQuiz.id);
    const topic = await getQuizTopic(updatedQuiz.id);

    console.log(`Quiz "${updatedQuiz.title}" for block "${block?.title}"`);
    console.log(`Topic: ${topic?.name}, Time: ${updatedQuiz.timeLimit}min, Pass: ${updatedQuiz.passingScore}%`);

    // Check if quiz exists before operations
    if (await quizExists(updatedQuiz.id)) {
      const quiz = await getQuizById(updatedQuiz.id);
      console.log(`Quiz created: ${quiz?.createdAt}`);
    }

  } catch (error) {
    if (error instanceof QuizError) {
      console.error('Quiz management error:', error.message);
    }
  }
}
```

### Quiz Creation for Course Modules

```typescript
async function createCourseQuizzes() {
  try {
    // Define quiz structure for a course
    const quizStructure = [
      {
        title: 'Introduction Quiz',
        description: 'Basic concepts and terminology',
        topicId: 'topic-intro',
        timeLimit: 15,
        passingScore: 70
      },
      {
        title: 'Nuclear Structure Quiz',
        description: 'Understanding atomic nuclei',
        topicId: 'topic-structure',
        timeLimit: 20,
        passingScore: 75
      },
      {
        title: 'Fusion Reactions Quiz',
        description: 'Nuclear fusion processes',
        topicId: 'topic-fusion',
        timeLimit: 25,
        passingScore: 80
      },
      {
        title: 'Final Assessment',
        description: 'Comprehensive course evaluation',
        topicId: 'topic-final',
        timeLimit: 45,
        passingScore: 85
      }
    ];

    const createdQuizzes = [];
    for (const quizData of quizStructure) {
      const quiz = await createQuiz(quizData);
      createdQuizzes.push(quiz);
      console.log(`Created quiz: ${quiz.title}`);
    }

    console.log(`Created ${createdQuizzes.length} quizzes for the course`);

  } catch (error) {
    if (error instanceof QuizError) {
      console.error('Course quiz creation error:', error.message);
    }
  }
}
```

### Quiz Analysis and Reporting

```typescript
async function analyzeQuizzes() {
  try {
    // Get all quizzes
    const allQuizzes = await getAllQuizzes();
    
    // Analyze quiz distribution
    const analysis = {
      totalQuizzes: allQuizzes.length,
      quizzesWithTimeLimit: allQuizzes.filter(q => q.timeLimit).length,
      quizzesWithPassingScore: allQuizzes.filter(q => q.passingScore).length,
      averageTimeLimit: 0,
      averagePassingScore: 0,
      quizzesByTopic: {},
      quizzesByBlock: {}
    };

    // Calculate averages
    const timeLimits = allQuizzes.filter(q => q.timeLimit).map(q => q.timeLimit!);
    const passingScores = allQuizzes.filter(q => q.passingScore).map(q => q.passingScore!);

    if (timeLimits.length > 0) {
      analysis.averageTimeLimit = timeLimits.reduce((sum, time) => sum + time, 0) / timeLimits.length;
    }

    if (passingScores.length > 0) {
      analysis.averagePassingScore = passingScores.reduce((sum, score) => sum + score, 0) / passingScores.length;
    }

    // Group quizzes by topic and block
    for (const quiz of allQuizzes) {
      if (quiz.topicId) {
        analysis.quizzesByTopic[quiz.topicId] = (analysis.quizzesByTopic[quiz.topicId] || 0) + 1;
      }
      if (quiz.blockId) {
        analysis.quizzesByBlock[quiz.blockId] = (analysis.quizzesByBlock[quiz.blockId] || 0) + 1;
      }
    }

    console.log('Quiz Analysis:', analysis);
    return analysis;

  } catch (error) {
    if (error instanceof QuizError) {
      console.error('Analysis error:', error.message);
    }
    throw error;
  }
}
```

### Topic-Based Quiz Management

```typescript
async function manageTopicQuizzes(topicId: string) {
  try {
    // Get all quizzes for a topic
    const topicQuizzes = await getQuizzesByTopic(topicId);
    
    console.log(`Topic has ${topicQuizzes.length} quizzes`);

    // Analyze quiz difficulty
    const easyQuizzes = topicQuizzes.filter(q => (q.passingScore || 0) <= 70);
    const mediumQuizzes = topicQuizzes.filter(q => (q.passingScore || 0) > 70 && (q.passingScore || 0) <= 85);
    const hardQuizzes = topicQuizzes.filter(q => (q.passingScore || 0) > 85);

    console.log(`Difficulty breakdown: Easy: ${easyQuizzes.length}, Medium: ${mediumQuizzes.length}, Hard: ${hardQuizzes.length}`);

    // Create additional quizzes if needed
    if (easyQuizzes.length === 0) {
      const easyQuiz = await createQuiz({
        title: 'Basic Topic Quiz',
        description: 'Fundamental concepts assessment',
        topicId: topicId,
        timeLimit: 15,
        passingScore: 65
      });
      console.log(`Created easy quiz: ${easyQuiz.title}`);
    }

    if (hardQuizzes.length === 0) {
      const hardQuiz = await createQuiz({
        title: 'Advanced Topic Quiz',
        description: 'Advanced concepts assessment',
        topicId: topicId,
        timeLimit: 30,
        passingScore: 90
      });
      console.log(`Created hard quiz: ${hardQuiz.title}`);
    }

  } catch (error) {
    if (error instanceof QuizError) {
      console.error('Topic quiz management error:', error.message);
    }
  }
}
```

### Block Quiz Integration

```typescript
async function integrateBlockQuizzes(blockId: string) {
  try {
    // Get existing quizzes for the block
    const existingQuizzes = await getQuizzesByBlock(blockId);
    
    // Get block topics
    const block = await getBlockById(blockId);
    if (!block) {
      throw new QuizError('Block not found');
    }

    const topics = await getBlockTopics(blockId);
    
    console.log(`Block "${block.title}" has ${existingQuizzes.length} quizzes and ${topics.length} topics`);

    // Create quizzes for topics that don't have them
    for (const topic of topics) {
      const topicQuizzes = existingQuizzes.filter(q => q.topicId === topic.id);
      
      if (topicQuizzes.length === 0) {
        const quiz = await createQuiz({
          title: `${topic.name} Assessment`,
          description: `Quiz for topic: ${topic.name}`,
          blockId: blockId,
          topicId: topic.id,
          timeLimit: 20,
          passingScore: 75
        });
        console.log(`Created quiz for topic "${topic.name}": ${quiz.title}`);
      }
    }

    // Update block quiz settings
    for (const quiz of existingQuizzes) {
      if (!quiz.timeLimit) {
        await updateQuiz(quiz.id, {
          timeLimit: 20
        });
        console.log(`Added time limit to quiz: ${quiz.title}`);
      }
    }

  } catch (error) {
    if (error instanceof QuizError) {
      console.error('Block quiz integration error:', error.message);
    }
  }
}
```

## Best Practices

### 1. Validate Quiz Settings
```typescript
// ✅ Good - Validate time limits
if (timeLimit && (timeLimit < 1 || timeLimit > 180)) {
  throw new QuizError('Time limit must be between 1 and 180 minutes');
}

// ✅ Good - Validate passing scores
if (passingScore && (passingScore < 0 || passingScore > 100)) {
  throw new QuizError('Passing score must be between 0 and 100');
}
```

### 2. Handle Relationships Properly
```typescript
// ✅ Good - Check block exists before creating quiz
if (blockId && !await blockExists(blockId)) {
  throw new QuizError('Block does not exist');
}

// ✅ Good - Check topic exists before creating quiz
if (topicId && !await topicExists(topicId)) {
  throw new QuizError('Topic does not exist');
}
```

### 3. Use Efficient Queries
```typescript
// ✅ Good - Use Promise.all for parallel queries
const [block, topic] = await Promise.all([
  getQuizBlock(quizId),
  getQuizTopic(quizId)
]);

// ❌ Avoid - Sequential queries
const block = await getQuizBlock(quizId);
const topic = await getQuizTopic(quizId);
```

### 4. Implement Quiz Validation
```typescript
// ✅ Good - Validate quiz completeness
async function validateQuiz(quizId: string) {
  const quiz = await getQuizById(quizId);
  if (!quiz) {
    throw new QuizError('Quiz not found');
  }

  if (!quiz.title.trim()) {
    throw new QuizError('Quiz must have a title');
  }

  if (quiz.timeLimit && quiz.timeLimit < 1) {
    throw new QuizError('Time limit must be at least 1 minute');
  }

  return true;
}
```

## Performance Considerations

- **Indexing**: Ensure blockId and topicId fields are indexed
- **Batch Operations**: Use `getAllQuizzes()` for bulk operations
- **Caching**: Consider caching frequently accessed quiz data
- **Pagination**: For large quiz lists, implement pagination
- **Selective Loading**: Only load related data when needed

## Related Modules

- **[Block Management](./block)** - Associate quizzes with content blocks
- **[Topic Management](./topic)** - Link quizzes to specific topics
- **[Question Management](./question)** - Add questions to quizzes
- **[User Management](./user)** - Track quiz creators and participants

---

Next: [Question Management](./question) - Learn how to create and manage questions for quizzes and blocks. 