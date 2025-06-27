---
sidebar_position: 6
---

# Question Management

The Question module provides comprehensive type-safe CRUD operations and utility functions for managing questions in the Nuclear application. This module handles question creation, updates, deletion, and relationship queries with blocks.

## Overview

The Question module is located in `lib/question.ts` and provides functions for:
- **CRUD Operations**: Create, read, update, and delete questions
- **Block Associations**: Link questions to specific content blocks
- **Question Management**: Handle question content and metadata
- **Validation**: Input validation and existence checks

## API Reference

### Core CRUD Functions

#### `getQuestionById(id: string): Promise<Question | null>`
Get a question by its unique ID.

```typescript
const question = await getQuestionById('question-123');
if (question) {
  console.log(`Found question: ${question.text}`);
}
```

#### `getAllQuestions(): Promise<Question[]>`
Get all questions in the system.

```typescript
const allQuestions = await getAllQuestions();
console.log(`Total questions: ${allQuestions.length}`);
```

#### `createQuestion(data: CreateQuestionData): Promise<Question>`
Create a new question with validated input data.

**Parameters:**
- `data.text` (required): Question text/content
- `data.blockId` (optional): ID of the associated block
- `data.type` (optional): Question type (e.g., 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER')
- `data.difficulty` (optional): Question difficulty level
- `data.points` (optional): Points awarded for correct answer

```typescript
const newQuestion = await createQuestion({
  text: 'What is nuclear fusion?',
  blockId: 'block-123',
  type: 'MULTIPLE_CHOICE',
  difficulty: 'MEDIUM',
  points: 5
});

console.log(`Created question: ${newQuestion.id}`);
```

#### `updateQuestion(id: string, data: Partial<Question>): Promise<Question>`
Update an existing question's information.

```typescript
const updatedQuestion = await updateQuestion('question-123', {
  text: 'What is the process of nuclear fusion?',
  difficulty: 'HARD',
  points: 10
});

console.log(`Updated question: ${updatedQuestion.text}`);
```

#### `deleteQuestion(id: string): Promise<Question>`
Delete a question by its ID.

```typescript
const deletedQuestion = await deleteQuestion('question-123');
console.log(`Deleted question: ${deletedQuestion.text}`);
```

### Utility Functions

#### `questionExists(id: string): Promise<boolean>`
Check if a question exists by its ID.

```typescript
if (await questionExists('question-123')) {
  console.log('Question exists');
} else {
  console.log('Question not found');
}
```

### Relationship Queries

#### `getQuestionBlock(id: string): Promise<Block | null>`
Get the block associated with a question.

```typescript
const block = await getQuestionBlock('question-123');
if (block) {
  console.log(`Question block: ${block.title}`);
}
```

### Filtering and Search Functions

#### `getQuestionsByBlock(blockId: string): Promise<Question[]>`
Get all questions for a specific block.

```typescript
const blockQuestions = await getQuestionsByBlock('block-123');
console.log(`Block has ${blockQuestions.length} questions`);
```

## Data Types

### Question Model
```typescript
interface Question {
  id: string;
  text: string;
  blockId?: string;
  type?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  points?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### CreateQuestionData
```typescript
interface CreateQuestionData {
  text: string;
  blockId?: string;
  type?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  points?: number;
}
```

## Error Handling

The Question module defines a custom error class for consistent error handling:

```typescript
class QuestionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuestionError';
  }
}
```

### Common Error Scenarios

1. **Question Not Found**
```typescript
try {
  const question = await getQuestionById('non-existent-id');
  if (!question) {
    throw new QuestionError('Question not found');
  }
} catch (error) {
  if (error instanceof QuestionError) {
    console.error('Question error:', error.message);
  }
}
```

2. **Invalid Block Association**
```typescript
try {
  const question = await createQuestion({
    text: 'Test question',
    blockId: 'non-existent-block'
  });
} catch (error) {
  if (error instanceof QuestionError) {
    console.error('Block validation error:', error.message);
  }
}
```

3. **Invalid Question Text**
```typescript
try {
  const question = await createQuestion({
    text: '', // Empty question text
    blockId: 'block-123'
  });
} catch (error) {
  if (error instanceof QuestionError) {
    console.error('Validation error:', error.message);
  }
}
```

## Usage Examples

### Complete Question Management Workflow

```typescript
async function manageQuestion() {
  try {
    // Create a new question
    const newQuestion = await createQuestion({
      text: 'What are the main components of an atomic nucleus?',
      blockId: 'block-123',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      points: 5
    });

    // Update question content
    const updatedQuestion = await updateQuestion(newQuestion.id, {
      text: 'What are the fundamental components of an atomic nucleus?',
      difficulty: 'HARD',
      points: 8
    });

    // Get question relationships
    const block = await getQuestionBlock(updatedQuestion.id);

    console.log(`Question: "${updatedQuestion.text}"`);
    console.log(`Block: ${block?.title}, Difficulty: ${updatedQuestion.difficulty}, Points: ${updatedQuestion.points}`);

    // Check if question exists before operations
    if (await questionExists(updatedQuestion.id)) {
      const question = await getQuestionById(updatedQuestion.id);
      console.log(`Question created: ${question?.createdAt}`);
    }

  } catch (error) {
    if (error instanceof QuestionError) {
      console.error('Question management error:', error.message);
    }
  }
}
```

### Question Bank Creation

```typescript
async function createQuestionBank() {
  try {
    // Define question bank structure
    const questionBank = [
      {
        text: 'What is the atomic number of hydrogen?',
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        points: 2
      },
      {
        text: 'Explain the difference between nuclear fusion and fission.',
        type: 'SHORT_ANSWER',
        difficulty: 'MEDIUM',
        points: 5
      },
      {
        text: 'What is the binding energy of a nucleus?',
        type: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        points: 8
      },
      {
        text: 'True or False: Nuclear fusion releases more energy than nuclear fission.',
        type: 'TRUE_FALSE',
        difficulty: 'MEDIUM',
        points: 3
      },
      {
        text: 'Calculate the mass defect for a helium nucleus.',
        type: 'CALCULATION',
        difficulty: 'HARD',
        points: 10
      }
    ];

    const createdQuestions = [];
    for (const questionData of questionBank) {
      const question = await createQuestion({
        ...questionData,
        blockId: 'block-123' // Associate with a specific block
      });
      createdQuestions.push(question);
      console.log(`Created question: ${question.text.substring(0, 50)}...`);
    }

    console.log(`Created ${createdQuestions.length} questions for the question bank`);

  } catch (error) {
    if (error instanceof QuestionError) {
      console.error('Question bank creation error:', error.message);
    }
  }
}
```

### Block Question Analysis

```typescript
async function analyzeBlockQuestions(blockId: string) {
  try {
    // Get all questions for the block
    const questions = await getQuestionsByBlock(blockId);
    
    // Analyze question distribution
    const analysis = {
      totalQuestions: questions.length,
      questionsByType: {},
      questionsByDifficulty: {
        EASY: 0,
        MEDIUM: 0,
        HARD: 0
      },
      totalPoints: 0,
      averagePoints: 0
    };

    // Calculate statistics
    for (const question of questions) {
      // Count by type
      const type = question.type || 'UNKNOWN';
      analysis.questionsByType[type] = (analysis.questionsByType[type] || 0) + 1;

      // Count by difficulty
      if (question.difficulty) {
        analysis.questionsByDifficulty[question.difficulty]++;
      }

      // Sum points
      if (question.points) {
        analysis.totalPoints += question.points;
      }
    }

    // Calculate average points
    if (questions.length > 0) {
      analysis.averagePoints = analysis.totalPoints / questions.length;
    }

    console.log('Block Question Analysis:', analysis);
    return analysis;

  } catch (error) {
    if (error instanceof QuestionError) {
      console.error('Analysis error:', error.message);
    }
    throw error;
  }
}
```

### Difficulty-Based Question Management

```typescript
async function manageDifficultyLevels(blockId: string) {
  try {
    // Get all questions for the block
    const questions = await getQuestionsByBlock(blockId);
    
    // Group questions by difficulty
    const easyQuestions = questions.filter(q => q.difficulty === 'EASY');
    const mediumQuestions = questions.filter(q => q.difficulty === 'MEDIUM');
    const hardQuestions = questions.filter(q => q.difficulty === 'HARD');

    console.log(`Difficulty breakdown: Easy: ${easyQuestions.length}, Medium: ${mediumQuestions.length}, Hard: ${hardQuestions.length}`);

    // Create additional questions if needed for balanced difficulty
    if (easyQuestions.length < 3) {
      const easyQuestion = await createQuestion({
        text: 'What is the basic structure of an atom?',
        blockId: blockId,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        points: 2
      });
      console.log(`Created easy question: ${easyQuestion.text.substring(0, 30)}...`);
    }

    if (mediumQuestions.length < 5) {
      const mediumQuestion = await createQuestion({
        text: 'Explain the concept of nuclear binding energy.',
        blockId: blockId,
        type: 'SHORT_ANSWER',
        difficulty: 'MEDIUM',
        points: 5
      });
      console.log(`Created medium question: ${mediumQuestion.text.substring(0, 30)}...`);
    }

    if (hardQuestions.length < 2) {
      const hardQuestion = await createQuestion({
        text: 'Calculate the energy released in a nuclear fusion reaction.',
        blockId: blockId,
        type: 'CALCULATION',
        difficulty: 'HARD',
        points: 10
      });
      console.log(`Created hard question: ${hardQuestion.text.substring(0, 30)}...`);
    }

  } catch (error) {
    if (error instanceof QuestionError) {
      console.error('Difficulty management error:', error.message);
    }
  }
}
```

### Question Type Management

```typescript
async function manageQuestionTypes(blockId: string) {
  try {
    // Get all questions for the block
    const questions = await getQuestionsByBlock(blockId);
    
    // Analyze question types
    const typeAnalysis = {};
    for (const question of questions) {
      const type = question.type || 'UNKNOWN';
      typeAnalysis[type] = (typeAnalysis[type] || 0) + 1;
    }

    console.log('Question types in block:', typeAnalysis);

    // Ensure variety in question types
    const requiredTypes = ['MULTIPLE_CHOICE', 'SHORT_ANSWER', 'TRUE_FALSE'];
    
    for (const requiredType of requiredTypes) {
      if (!typeAnalysis[requiredType] || typeAnalysis[requiredType] < 2) {
        const question = await createQuestion({
          text: `Sample ${requiredType.toLowerCase().replace('_', ' ')} question`,
          blockId: blockId,
          type: requiredType,
          difficulty: 'MEDIUM',
          points: 5
        });
        console.log(`Created ${requiredType} question: ${question.text}`);
      }
    }

  } catch (error) {
    if (error instanceof QuestionError) {
      console.error('Question type management error:', error.message);
    }
  }
}
```

## Best Practices

### 1. Validate Question Content
```typescript
// ✅ Good - Validate question text quality
if (!data.text.trim()) {
  throw new QuestionError('Question text cannot be empty');
}

if (data.text.length < 10) {
  throw new QuestionError('Question text too short');
}

if (data.text.length > 1000) {
  throw new QuestionError('Question text too long');
}
```

### 2. Handle Relationships Properly
```typescript
// ✅ Good - Check block exists before creating question
if (blockId && !await blockExists(blockId)) {
  throw new QuestionError('Block does not exist');
}
```

### 3. Use Efficient Queries
```typescript
// ✅ Good - Use Promise.all for parallel queries
const [block, questions] = await Promise.all([
  getQuestionBlock(questionId),
  getQuestionsByBlock(blockId)
]);

// ❌ Avoid - Sequential queries
const block = await getQuestionBlock(questionId);
const questions = await getQuestionsByBlock(blockId);
```

### 4. Implement Question Validation
```typescript
// ✅ Good - Validate question completeness
async function validateQuestion(questionId: string) {
  const question = await getQuestionById(questionId);
  if (!question) {
    throw new QuestionError('Question not found');
  }

  if (!question.text.trim()) {
    throw new QuestionError('Question must have text');
  }

  if (question.points && question.points < 0) {
    throw new QuestionError('Points cannot be negative');
  }

  return true;
}
```

## Performance Considerations

- **Indexing**: Ensure blockId field is indexed
- **Batch Operations**: Use `getAllQuestions()` for bulk operations
- **Caching**: Consider caching frequently accessed question data
- **Pagination**: For large question lists, implement pagination
- **Selective Loading**: Only load related data when needed

## Related Modules

- **[Block Management](./block)** - Associate questions with content blocks
- **[Quiz System](./quiz)** - Use questions in quizzes
- **[Topic Management](./topic)** - Categorize questions by topics
- **[User Management](./user)** - Track question creators

---

Next: [Topic Management](./topic) - Learn how to organize content with topics and examples. 