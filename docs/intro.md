---
sidebar_position: 1
---

# Welcome to Nuclear Documentation

Welcome to the comprehensive documentation for Nuclear, a powerful application built with modern web technologies. This documentation covers everything you need to know about the Prisma abstraction layer and how to effectively use it in your projects.

## What is Nuclear?

Nuclear is a sophisticated application that provides a robust abstraction layer over Prisma ORM, offering type-safe database operations with comprehensive error handling and utility functions.

## Documentation Structure

### 🗂️ Prisma Abstraction Layer
Our Prisma abstraction provides type-safe CRUD operations and utility functions for all database models:

- **[User Management](./prisma-abstraction/user)** - Complete user CRUD operations and utilities
- **[Block Management](./prisma-abstraction/block)** - Content block operations and relationships
- **[Quiz System](./prisma-abstraction/quiz)** - Quiz creation, management, and topic associations
- **[Question Management](./prisma-abstraction/question)** - Question CRUD and block relationships
- **[Folder Organization](./prisma-abstraction/folder)** - Hierarchical folder structure management
- **[Fill-in-the-Blank](./prisma-abstraction/fill-in-the-blank)** - Interactive content with search and random utilities
- **[Topic Management](./prisma-abstraction/topic)** - Topic organization with examples and quizzes
- **[Points System](./prisma-abstraction/points-update)** - Points tracking and aggregation utilities

### 🚀 Getting Started

Each module provides:
- **Type-safe functions** with full TypeScript support
- **Comprehensive error handling** with custom error classes
- **Relationship queries** for fetching related data
- **Utility functions** for common operations like search and aggregation
- **Input validation** to ensure data integrity

### 📚 Quick Examples

```typescript
// Create a new user
const user = await createUser({
  email: 'user@example.com',
  name: 'John Doe',
  mode: 'STUDENT'
});

// Get user with all their posts
const userPosts = await getUserPosts(user.id);

// Create a block with content
const block = await createBlock({
  title: 'Introduction to Nuclear',
  content: 'Welcome to the course...',
  authorId: user.id,
  folderId: folder.id
});
```

## Key Features

- **🔒 Type Safety**: All functions use Prisma-generated types
- **⚡ Performance**: Optimized queries with proper indexing
- **🛡️ Error Handling**: Custom error classes for consistent error management
- **🔍 Search & Filter**: Built-in search and filtering capabilities
- **📊 Aggregation**: Utility functions for data aggregation and analysis
- **🔄 Relationships**: Easy access to related data across models

## Getting Help

If you need assistance with any part of the Prisma abstraction layer:

1. Check the specific module documentation
2. Review the code examples provided
3. Look at the error handling patterns
4. Explore the utility functions for advanced use cases

---

Ready to dive in? Start with the [User Management](./prisma-abstraction/user) documentation or explore any specific module that interests you!
