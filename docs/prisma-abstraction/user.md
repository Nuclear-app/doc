---
sidebar_position: 2
---

# User Management

The User module provides comprehensive type-safe CRUD operations and utility functions for managing users in the Nuclear application. This module handles user creation, updates, deletion, and relationship queries.

## Overview

The User module is located in `lib/user.ts` and provides functions for:
- **CRUD Operations**: Create, read, update, and delete users
- **Lookup Functions**: Find users by ID, email, and other criteria
- **Relationship Queries**: Get user posts, folders, and related data
- **Validation**: Input validation and existence checks

## API Reference

### Core CRUD Functions

#### `getUserById(id: string): Promise<User | null>`
Get a user by their unique ID.

```typescript
const user = await getUserById('user-123');
if (user) {
  console.log(`Found user: ${user.name}`);
}
```

#### `getAllUsers(): Promise<User[]>`
Get all users in the system.

```typescript
const allUsers = await getAllUsers();
console.log(`Total users: ${allUsers.length}`);
```

#### `getUserByEmail(email: string): Promise<User | null>`
Get a user by their email address.

```typescript
const user = await getUserByEmail('user@example.com');
if (user) {
  console.log(`User found: ${user.name}`);
}
```

#### `createUser(data: CreateUserData): Promise<User>`
Create a new user with validated input data.

**Parameters:**
- `data.email` (required): User's email address
- `data.name` (optional): User's display name
- `data.mode` (optional): User mode ('STUDENT' | 'TEACHER' | 'ADMIN')

```typescript
const newUser = await createUser({
  email: 'john.doe@example.com',
  name: 'John Doe',
  mode: 'STUDENT'
});

console.log(`Created user: ${newUser.id}`);
```

#### `updateUser(id: string, data: Partial<User>): Promise<User>`
Update an existing user's information.

```typescript
const updatedUser = await updateUser('user-123', {
  name: 'Jane Doe',
  mode: 'TEACHER'
});

console.log(`Updated user: ${updatedUser.name}`);
```

#### `deleteUser(id: string): Promise<User>`
Delete a user by their ID.

```typescript
const deletedUser = await deleteUser('user-123');
console.log(`Deleted user: ${deletedUser.email}`);
```

### Utility Functions

#### `userExists(id: string): Promise<boolean>`
Check if a user exists by their ID.

```typescript
if (await userExists('user-123')) {
  console.log('User exists');
} else {
  console.log('User not found');
}
```

### Relationship Queries

#### `getUserPosts(id: string): Promise<Block[]>`
Get all blocks (posts) authored by a user.

```typescript
const userPosts = await getUserPosts('user-123');
console.log(`User has ${userPosts.length} posts`);
```

#### `getUserFolders(id: string): Promise<Folder[]>`
Get all folders owned by a user.

```typescript
const userFolders = await getUserFolders('user-123');
console.log(`User has ${userFolders.length} folders`);
```

## Data Types

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  mode: 'STUDENT' | 'TEACHER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}
```

### CreateUserData
```typescript
interface CreateUserData {
  email: string;
  name?: string;
  mode?: 'STUDENT' | 'TEACHER' | 'ADMIN';
}
```

## Error Handling

The User module defines a custom error class for consistent error handling:

```typescript
class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserError';
  }
}
```

### Common Error Scenarios

1. **User Not Found**
```typescript
try {
  const user = await getUserById('non-existent-id');
  if (!user) {
    throw new UserError('User not found');
  }
} catch (error) {
  if (error instanceof UserError) {
    console.error('User error:', error.message);
  }
}
```

2. **Invalid Email Format**
```typescript
try {
  const user = await createUser({
    email: 'invalid-email',
    name: 'Test User'
  });
} catch (error) {
  if (error instanceof UserError) {
    console.error('Validation error:', error.message);
  }
}
```

3. **Duplicate Email**
```typescript
try {
  const user = await createUser({
    email: 'existing@example.com',
    name: 'Duplicate User'
  });
} catch (error) {
  if (error instanceof UserError) {
    console.error('Duplicate email error:', error.message);
  }
}
```

## Usage Examples

### Complete User Management Workflow

```typescript
async function manageUser() {
  try {
    // Create a new user
    const newUser = await createUser({
      email: 'student@example.com',
      name: 'Alice Student',
      mode: 'STUDENT'
    });

    // Update user information
    const updatedUser = await updateUser(newUser.id, {
      name: 'Alice Johnson',
      mode: 'TEACHER'
    });

    // Get user's content
    const userPosts = await getUserPosts(updatedUser.id);
    const userFolders = await getUserFolders(updatedUser.id);

    console.log(`User ${updatedUser.name} has ${userPosts.length} posts and ${userFolders.length} folders`);

    // Check if user exists before operations
    if (await userExists(updatedUser.id)) {
      // Perform additional operations
      const user = await getUserById(updatedUser.id);
      console.log(`Current user mode: ${user?.mode}`);
    }

  } catch (error) {
    if (error instanceof UserError) {
      console.error('User management error:', error.message);
    }
  }
}
```

### User Authentication Flow

```typescript
async function authenticateUser(email: string) {
  try {
    const user = await getUserByEmail(email);
    
    if (!user) {
      throw new UserError('User not found');
    }

    // Check user mode for authorization
    if (user.mode === 'ADMIN') {
      console.log('Admin access granted');
    } else if (user.mode === 'TEACHER') {
      console.log('Teacher access granted');
    } else {
      console.log('Student access granted');
    }

    return user;
  } catch (error) {
    if (error instanceof UserError) {
      console.error('Authentication failed:', error.message);
    }
    throw error;
  }
}
```

### Bulk User Operations

```typescript
async function bulkUserOperations() {
  try {
    // Get all users
    const allUsers = await getAllUsers();
    
    // Filter users by mode
    const students = allUsers.filter(user => user.mode === 'STUDENT');
    const teachers = allUsers.filter(user => user.mode === 'TEACHER');
    
    console.log(`Total users: ${allUsers.length}`);
    console.log(`Students: ${students.length}`);
    console.log(`Teachers: ${teachers.length}`);

    // Get content for each user
    for (const user of allUsers) {
      const posts = await getUserPosts(user.id);
      const folders = await getUserFolders(user.id);
      
      console.log(`${user.name}: ${posts.length} posts, ${folders.length} folders`);
    }

  } catch (error) {
    if (error instanceof UserError) {
      console.error('Bulk operation error:', error.message);
    }
  }
}
```

## Best Practices

### 1. Always Validate Input
```typescript
// ✅ Good - Validate email format
if (!email.includes('@')) {
  throw new UserError('Invalid email format');
}

// ✅ Good - Check for required fields
if (!data.email) {
  throw new UserError('Email is required');
}
```

### 2. Handle Errors Gracefully
```typescript
// ✅ Good - Comprehensive error handling
try {
  const user = await createUser(data);
  return user;
} catch (error) {
  if (error instanceof UserError) {
    // Handle user-specific errors
    console.error('User creation failed:', error.message);
  } else {
    // Handle other errors
    console.error('Unexpected error:', error);
  }
  throw error;
}
```

### 3. Use Existence Checks
```typescript
// ✅ Good - Check existence before operations
if (await userExists(userId)) {
  const user = await updateUser(userId, data);
  return user;
} else {
  throw new UserError('User not found');
}
```

### 4. Leverage Type Safety
```typescript
// ✅ Good - Use TypeScript for type safety
const user: User = await getUserById(id);
console.log(user.mode); // TypeScript knows this is 'STUDENT' | 'TEACHER' | 'ADMIN'

// ❌ Avoid - Manual type checking
const user = await getUserById(id);
if (user.mode === 'STUDENT' || user.mode === 'TEACHER' || user.mode === 'ADMIN') {
  // Manual validation
}
```

## Performance Considerations

- **Indexing**: Ensure email fields are indexed for fast lookups
- **Batch Operations**: Use `getAllUsers()` for bulk operations
- **Caching**: Consider caching frequently accessed user data
- **Pagination**: For large user lists, implement pagination

## Related Modules

- **[Block Management](./block)** - Manage user-created content
- **[Folder Organization](./folder)** - Organize user content
- **[Quiz System](./quiz)** - User quiz interactions
- **[Points System](./points-update)** - Track user progress

---

Next: [Block Management](./block) - Learn how to manage content blocks and their relationships with users. 