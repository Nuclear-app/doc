# Nuclear Documentation

Comprehensive documentation for the Nuclear application, featuring a robust Prisma abstraction layer that provides type-safe database operations with comprehensive error handling and utility functions.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) version 18.0 or above
- [Bun](https://bun.sh/) (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nuclear-app/doc.git
cd doc
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Start the development server:
```bash
bun run start
# or
npm run start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Documentation Structure

### Overview
- **[Introduction](./docs/intro.md)** - Welcome and getting started guide
- **[Prisma Abstraction Layer](./docs/prisma-abstraction/README.md)** - Complete overview of the abstraction layer

### Core Modules

#### User Management
- **[User Module](./docs/prisma-abstraction/user.md)** - Complete user CRUD operations and utilities
- User creation, updates, deletion, and relationship queries
- Email lookups and existence checks
- User posts and folder management

#### Content Management
- **[Block Module](./docs/prisma-abstraction/block.md)** - Content block operations and relationships
- **[Folder Module](./docs/prisma-abstraction/folder.md)** - Hierarchical folder structure management
- **[Topic Module](./docs/prisma-abstraction/topic.md)** - Topic organization with examples and quizzes

#### Interactive Content
- **[Quiz System](./docs/prisma-abstraction/quiz.md)** - Quiz creation, management, and topic associations
- **[Question Management](./docs/prisma-abstraction/question.md)** - Question CRUD and block relationships
- **[Fill-in-the-Blank](./docs/prisma-abstraction/fill-in-the-blank.md)** - Interactive content with search and random utilities

#### Progress Tracking
- **[Points System](./docs/prisma-abstraction/points-update.md)** - Points tracking and aggregation utilities

## 🔧 Key Features

### Type Safety
All functions use Prisma-generated types, ensuring compile-time safety and excellent IDE support.

### Error Handling
Each module defines custom error classes for consistent error management across the application.

### Performance
Optimized queries with proper indexing and relationship handling for efficient database operations.

### Utility Functions
Built-in utilities for common operations like search, random selection, and data aggregation.

## 📖 Usage Examples

### Basic User Management
```typescript
import { createUser, getUserById, updateUser } from './lib/user';

// Create a new user
const user = await createUser({
  email: 'user@example.com',
  name: 'John Doe',
  mode: 'STUDENT'
});

// Get user by ID
const foundUser = await getUserById(user.id);

// Update user information
const updatedUser = await updateUser(user.id, {
  name: 'Jane Doe',
  mode: 'TEACHER'
});
```

### Content Creation
```typescript
import { createBlock, createTopic, createQuiz } from './lib';

// Create a content block
const block = await createBlock({
  title: 'Introduction to Nuclear Physics',
  content: 'Nuclear physics is the study of atomic nuclei...',
  authorId: user.id,
  folderId: folder.id
});

// Create a topic
const topic = await createTopic({
  name: 'Nuclear Fusion',
  description: 'The process of combining atomic nuclei',
  blockId: block.id
});

// Create a quiz
const quiz = await createQuiz({
  title: 'Nuclear Fusion Quiz',
  description: 'Test your knowledge of nuclear fusion',
  blockId: block.id,
  topicId: topic.id,
  timeLimit: 30,
  passingScore: 70
});
```

### Interactive Learning
```typescript
import { createFillInTheBlank, getRandomFillInTheBlank } from './lib/fillInTheBlank';

// Create interactive content
const fillInTheBlank = await createFillInTheBlank({
  sentence: 'Nuclear ___ is the process of combining atomic nuclei.',
  answer: 'fusion',
  hint: 'Think of the sun',
  difficulty: 'MEDIUM'
});

// Get random content for practice
const randomItem = await getRandomFillInTheBlank();
```

### Progress Tracking
```typescript
import { createPointsUpdate, getTotalPointsForBlock } from './lib/pointsUpdate';

// Award points for completion
await createPointsUpdate({
  points: 25,
  blockId: block.id,
  reason: 'Completed quiz successfully',
  userId: user.id
});

// Get total points for a block
const totalPoints = await getTotalPointsForBlock(block.id);
```

## 🛠️ Development

### Building for Production
```bash
bun run build
# or
npm run build
```

### Running Tests
```bash
bun run test
# or
npm run test
```

### Linting
```bash
bun run lint
# or
npm run lint
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🤝 Support

- **Documentation Issues**: [GitHub Issues](https://github.com/nuclear-app/doc/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/nuclear-app/doc/discussions)
- **General Questions**: [GitHub Discussions](https://github.com/nuclear-app/doc/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Docusaurus](https://docusaurus.io/)
- Powered by [Prisma](https://www.prisma.io/)
- TypeScript for type safety
- Modern JavaScript/TypeScript best practices

---

**Nuclear Documentation** - Empowering developers with comprehensive, type-safe database operations.
