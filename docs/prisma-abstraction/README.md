---
sidebar_position: 1
---

# Prisma Abstraction Layer

The Prisma abstraction layer provides a comprehensive, type-safe interface for all database operations in Nuclear. This layer abstracts away the complexity of direct Prisma queries while maintaining full type safety and providing additional utility functions.

## Overview

Our Prisma abstraction is organized into focused modules, each handling a specific domain of your application:

### 📁 Core Modules

| Module | Purpose | Key Features |
|--------|---------|--------------|
| **[User](./user)** | User management and authentication | CRUD operations, email lookups, relationship queries |
| **[Block](./block)** | Content block management | Post creation, author relationships, folder organization |
| **[Folder](./folder)** | Hierarchical organization | Nested folder structure, parent-child relationships |
| **[Quiz](./quiz)** | Quiz system management | Quiz creation, topic associations, block relationships |
| **[Question](./question)** | Question management | Question CRUD, block associations |
| **[Topic](./topic)** | Topic organization | Topic management, examples, quiz associations |
| **[Fill-in-the-Blank](./fill-in-the-blank)** | Interactive content | Search utilities, random selection, hints |
| **[Points Update](./points-update)** | Points tracking system | Aggregation, date ranges, totals |

## Architecture Principles

### 🔒 Type Safety
All functions use Prisma-generated types, ensuring compile-time safety and excellent IDE support:

```typescript
// Full type safety with Prisma types
const user: User = await createUser({
  email: 'user@example.com',
  name: 'John Doe'
});
```

### 🛡️ Error Handling
Each module defines custom error classes for consistent error management:

```typescript
try {
  const user = await getUserById('invalid-id');
} catch (error) {
  if (error instanceof UserError) {
    console.error('User operation failed:', error.message);
  }
}
```

### ⚡ Performance
Optimized queries with proper indexing and relationship handling:

```typescript
// Efficient relationship queries
const userWithPosts = await getUserPosts(userId);
const blockWithAuthor = await getBlockAuthor(blockId);
```

### 🔍 Utility Functions
Built-in utilities for common operations:

```typescript
// Search functionality
const searchResults = await searchTopicsByName('nuclear');
const randomQuiz = await getRandomTopicByBlock(blockId);

// Aggregation
const totalPoints = await getTotalPointsForBlock(blockId);
```

## Common Patterns

### Creating Records
All creation functions validate input and return the created record:

```typescript
const newUser = await createUser({
  email: 'user@example.com',
  name: 'John Doe',
  mode: 'STUDENT'
});
```

### Updating Records
Update functions accept partial data and return the updated record:

```typescript
const updatedUser = await updateUser(userId, {
  name: 'Jane Doe',
  mode: 'TEACHER'
});
```

### Fetching Related Data
Each module provides functions to fetch related data:

```typescript
// Get all posts by a user
const userPosts = await getUserPosts(userId);

// Get the author of a block
const blockAuthor = await getBlockAuthor(blockId);

// Get all quizzes for a topic
const topicQuizzes = await getTopicQuizzes(topicId);
```

### Existence Checks
Quick existence checks for validation:

```typescript
if (await userExists(userId)) {
  // User exists, proceed with operation
}
```

## Error Handling

All functions throw custom errors that extend a base error class:

```typescript
class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserError';
  }
}
```

Common error scenarios:
- **Not Found**: When a record doesn't exist
- **Validation**: When input data is invalid
- **Relationship**: When related records don't exist
- **Database**: When database operations fail

## Best Practices

### 1. Always Handle Errors
```typescript
try {
  const user = await getUserById(id);
  if (!user) {
    throw new UserError('User not found');
  }
} catch (error) {
  // Handle error appropriately
}
```

### 2. Use Type-Safe Functions
```typescript
// ✅ Good - Type-safe
const user = await getUserByEmail(email);

// ❌ Avoid - Direct Prisma queries
const user = await prisma.user.findUnique({ where: { email } });
```

### 3. Leverage Utility Functions
```typescript
// ✅ Good - Use built-in utilities
const randomQuiz = await getRandomTopicByBlock(blockId);

// ❌ Avoid - Manual random selection
const allTopics = await getAllTopics();
const randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)];
```

### 4. Check Existence Before Operations
```typescript
// ✅ Good - Check existence first
if (await userExists(userId)) {
  await updateUser(userId, data);
}

// ❌ Avoid - Let it fail
await updateUser(userId, data); // Might throw error
```

## Getting Started

1. **Choose a module** that matches your needs
2. **Review the API reference** for available functions
3. **Check the examples** for common use cases
4. **Understand error handling** patterns
5. **Explore utility functions** for advanced features

Each module's documentation includes:
- Complete API reference
- Code examples
- Error handling patterns
- Utility functions
- Best practices

---

Ready to explore? Start with any module that interests you, or follow the recommended order: [User Management](./user) → [Block Management](./block) → [Folder Organization](./folder). 