---
sidebar_position: 5
---

# Database & Prisma

Complete guide to database operations, Prisma schema management, and data modeling in the Nuclear application.

## 🗄️ Database Overview

### Technology Stack
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Schema Location**: `prisma/schema.prisma`
- **Generated Client**: `lib/generated/prisma/`

### Key Features
- **Type Safety** - Full TypeScript integration
- **Migrations** - Version-controlled schema changes
- **Relationships** - Foreign key relationships between models
- **Indexing** - Performance optimization
- **Constraints** - Data integrity enforcement

## 📊 Database Schema

### Core Models

#### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  mode      UserMode @default(STUDENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  blocks    Block[]
  folders   Folder[]
  pointsUpdates PointsUpdate[]

  @@map("users")
}
```

#### Block Model (Content)
```prisma
model Block {
  id        String   @id @default(cuid())
  title     String
  content   String
  authorId  String
  folderId  String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  author    User     @relation(fields: [authorId], references: [id])
  folder    Folder?  @relation(fields: [folderId], references: [id])
  questions Question[]
  quizzes   Quiz[]
  topics    Topic[]
  fillInTheBlanks FillInTheBlank[]
  pointsUpdates PointsUpdate[]

  @@map("blocks")
}
```

#### Folder Model (Organization)
```prisma
model Folder {
  id          String   @id @default(cuid())
  name        String
  description String?
  authorId    String
  parentId    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  author      User     @relation(fields: [authorId], references: [id])
  parent      Folder?  @relation("FolderHierarchy", fields: [parentId], references: [id])
  children    Folder[] @relation("FolderHierarchy")
  blocks      Block[]

  @@map("folders")
}
```

#### Quiz Model
```prisma
model Quiz {
  id           String   @id @default(cuid())
  title        String
  description  String?
  blockId      String?
  topicId      String?
  timeLimit    Int?
  passingScore Int?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relationships
  block        Block?   @relation(fields: [blockId], references: [id])
  topic        Topic?   @relation(fields: [topicId], references: [id])

  @@map("quizzes")
}
```

#### Question Model
```prisma
model Question {
  id         String   @id @default(cuid())
  text       String
  blockId    String?
  type       String?
  difficulty QuestionDifficulty?
  points     Int?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relationships
  block      Block?   @relation(fields: [blockId], references: [id])

  @@map("questions")
}
```

#### Topic Model
```prisma
model Topic {
  id          String   @id @default(cuid())
  name        String
  description String?
  blockId     String?
  examples    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  block       Block?   @relation(fields: [blockId], references: [id])
  quizzes     Quiz[]

  @@map("topics")
}
```

#### FillInTheBlank Model
```prisma
model FillInTheBlank {
  id         String   @id @default(cuid())
  sentence   String
  answer     String
  blockId    String?
  hint       String?
  difficulty FillInTheBlankDifficulty?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relationships
  block      Block?   @relation(fields: [blockId], references: [id])

  @@map("fill_in_the_blanks")
}
```

#### PointsUpdate Model
```prisma
model PointsUpdate {
  id       String   @id @default(cuid())
  points   Int
  blockId  String?
  reason   String?
  userId   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  block    Block?   @relation(fields: [blockId], references: [id])
  user     User?    @relation(fields: [userId], references: [id])

  @@map("points_updates")
}
```

### Enums

```prisma
enum UserMode {
  STUDENT
  TEACHER
  ADMIN
}

enum QuestionDifficulty {
  EASY
  MEDIUM
  HARD
}

enum FillInTheBlankDifficulty {
  EASY
  MEDIUM
  HARD
}
```

## 🔧 Prisma Operations

### Schema Management

#### Generate Prisma Client
```bash
bunx prisma generate
```

**When to use:**
- After schema changes
- After pulling database changes
- When TypeScript shows Prisma errors
- Before running the application

#### Create Migration
```bash
bunx prisma migrate dev --name descriptive_name
```

**What it does:**
- Detects schema changes
- Creates migration file
- Applies migration to database
- Regenerates Prisma client
- Seeds database (if configured)

#### Apply Migrations
```bash
bunx prisma migrate deploy
```

**For production:**
- Applies pending migrations
- No schema generation
- Safe for production use

#### Reset Database
```bash
bunx prisma migrate reset
```

**⚠️ Warning: Destructive operation!**
- Drops all tables
- Recreates schema
- Applies all migrations
- Runs seed script

### Database Operations

#### Pull Schema Changes
```bash
bunx prisma db pull
```

**When to use:**
- Database changed externally
- Working with existing database
- Syncing with production schema

#### Push Schema Changes
```bash
bunx prisma db push
```

**Development only:**
- Pushes schema to database
- No migration files created
- Useful for prototyping

#### Validate Schema
```bash
bunx prisma validate
```

**What it checks:**
- Schema syntax
- Model relationships
- Field types
- Constraints

### Database GUI

#### Prisma Studio
```bash
bunx prisma studio
```

**Features:**
- Visual database browser
- Edit data directly
- View relationships
- Export data
- Runs on `http://localhost:5555`

## 📝 Migration Workflow

### Creating Schema Changes

1. **Modify Schema**
   ```prisma
   // prisma/schema.prisma
   model User {
     id        String   @id @default(cuid())
     email     String   @unique
     name      String?
     // Add new field
     avatar    String?
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

2. **Create Migration**
   ```bash
   bunx prisma migrate dev --name add_user_avatar
   ```

3. **Verify Changes**
   ```bash
   bunx prisma studio
   ```

### Migration Best Practices

#### Naming Conventions
```bash
# Good names
bunx prisma migrate dev --name add_user_avatar
bunx prisma migrate dev --name update_quiz_time_limit
bunx prisma migrate dev --name create_topic_index

# Avoid generic names
bunx prisma migrate dev --name migration
bunx prisma migrate dev --name update
```

#### Testing Migrations
```bash
# Test on development database first
bunx prisma migrate dev

# Verify data integrity
bunx prisma studio

# Check application functionality
bun coolDev
```

#### Production Migrations
```bash
# Create migration file only
bunx prisma migrate dev --create-only

# Review migration file
# Edit if needed

# Apply to production
bunx prisma migrate deploy
```

## 🔍 Database Queries

### Using Prisma Client

#### Basic Queries
```typescript
import { prisma } from '@/lib/generated/prisma';

// Find single record
const user = await prisma.user.findUnique({
  where: { id: 'user-123' }
});

// Find many records
const users = await prisma.user.findMany({
  where: { mode: 'STUDENT' }
});

// Create record
const newUser = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    mode: 'STUDENT'
  }
});

// Update record
const updatedUser = await prisma.user.update({
  where: { id: 'user-123' },
  data: { name: 'Jane Doe' }
});

// Delete record
const deletedUser = await prisma.user.delete({
  where: { id: 'user-123' }
});
```

#### Relationship Queries
```typescript
// Include related data
const userWithBlocks = await prisma.user.findUnique({
  where: { id: 'user-123' },
  include: {
    blocks: true,
    folders: true
  }
});

// Nested includes
const blockWithAuthor = await prisma.block.findUnique({
  where: { id: 'block-123' },
  include: {
    author: {
      select: {
        id: true,
        name: true,
        email: true
      }
    },
    topics: true,
    questions: true
  }
});
```

#### Advanced Queries
```typescript
// Complex where conditions
const publishedBlocks = await prisma.block.findMany({
  where: {
    published: true,
    author: {
      mode: 'TEACHER'
    },
    createdAt: {
      gte: new Date('2024-01-01')
    }
  },
  include: {
    author: true,
    topics: true
  },
  orderBy: {
    createdAt: 'desc'
  },
  take: 10
});

// Aggregation
const userStats = await prisma.user.aggregate({
  where: { mode: 'STUDENT' },
  _count: {
    blocks: true,
    folders: true
  },
  _sum: {
    pointsUpdates: {
      points: true
    }
  }
});
```

## 🚀 Performance Optimization

### Indexing Strategy

#### Primary Indexes
```prisma
model User {
  id    String @id @default(cuid())
  email String @unique  // Automatic index
  // ...
}
```

#### Custom Indexes
```prisma
model Block {
  id        String   @id @default(cuid())
  title     String
  authorId  String
  published Boolean  @default(false)
  createdAt DateTime @default(now())

  // Custom indexes
  @@index([authorId])
  @@index([published, createdAt])
  @@index([title])
}
```

#### Composite Indexes
```prisma
model PointsUpdate {
  id       String   @id @default(cuid())
  points   Int
  blockId  String?
  userId   String?
  createdAt DateTime @default(now())

  // Composite index for efficient queries
  @@index([userId, createdAt])
  @@index([blockId, createdAt])
}
```

### Query Optimization

#### Select Only Needed Fields
```typescript
// Efficient - only select needed fields
const userNames = await prisma.user.findMany({
  select: {
    id: true,
    name: true
  }
});

// Avoid selecting all fields unless needed
const allUserData = await prisma.user.findMany(); // Less efficient
```

#### Use Pagination
```typescript
// Paginated queries
const blocks = await prisma.block.findMany({
  take: 20,
  skip: 40, // Page 3 (20 * 2)
  orderBy: {
    createdAt: 'desc'
  }
});
```

#### Batch Operations
```typescript
// Batch create
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' },
    { email: 'user3@example.com', name: 'User 3' }
  ]
});

// Batch update
const updatedBlocks = await prisma.block.updateMany({
  where: { published: false },
  data: { published: true }
});
```

## 🔒 Data Integrity

### Constraints

#### Unique Constraints
```prisma
model User {
  id    String @id @default(cuid())
  email String @unique  // Ensures unique emails
  // ...
}
```

#### Required Fields
```prisma
model Block {
  id       String @id @default(cuid())
  title    String  // Required field
  content  String  // Required field
  authorId String  // Required field
  // ...
}
```

#### Foreign Key Constraints
```prisma
model Block {
  id       String @id @default(cuid())
  authorId String
  folderId String?

  // Foreign key relationships
  author User @relation(fields: [authorId], references: [id])
  folder Folder? @relation(fields: [folderId], references: [id])
}
```

### Validation

#### Field Validation
```prisma
model User {
  id    String @id @default(cuid())
  email String @unique @db.VarChar(255)
  name  String? @db.VarChar(100)
  // ...
}
```

#### Custom Validation
```typescript
// In your application code
const createUser = async (data: CreateUserData) => {
  // Validate email format
  if (!data.email.includes('@')) {
    throw new Error('Invalid email format');
  }

  // Validate name length
  if (data.name && data.name.length > 100) {
    throw new Error('Name too long');
  }

  return await prisma.user.create({ data });
};
```

## 🔍 Monitoring & Debugging

### Query Logging

#### Enable Query Logging
```typescript
// In development
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

#### Performance Monitoring
```typescript
// Measure query performance
const start = Date.now();
const users = await prisma.user.findMany();
const duration = Date.now() - start;
console.log(`Query took ${duration}ms`);
```

### Common Issues

#### Connection Issues
```bash
# Test database connection
bunx prisma db pull

# Check environment variables
echo $DATABASE_URL

# Verify database is running
# (Check your database service)
```

#### Migration Issues
```bash
# Check migration status
bunx prisma migrate status

# Reset if needed (development only)
bunx prisma migrate reset

# Force push schema (development only)
bunx prisma db push --force-reset
```

#### Type Issues
```bash
# Regenerate Prisma client
bunx prisma generate

# Clear TypeScript cache
rm -rf .next tsconfig.tsbuildinfo
bunx tsc --noEmit
```

## 📚 Related Documentation

- **[Prisma Abstraction Layer](../prisma-abstraction/)** - Type-safe database operations
- **[Development Setup](./setup)** - Database setup instructions
- **[Available Scripts](./scripts)** - Database-related scripts
- **[Troubleshooting](./troubleshooting)** - Common database issues

---

**Master database operations to build robust applications!** 🗄️ 