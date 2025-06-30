---
sidebar_position: 6
---

# Development Workflow

Complete guide to the daily development workflow, code quality practices, testing strategies, and Git workflow for the Nuclear application.

## 🔄 Daily Development Workflow

### Morning Setup

1. **Pull Latest Changes**
   ```bash
   git pull origin main
   bun install  # If dependencies changed
   ```

2. **Start Development Environment**
   ```bash
   bun coolDev  # Start development server
   ```

3. **Check for Issues**
   ```bash
   bun run type-check  # TypeScript validation
   bun run lint        # Code quality check
   ```

### Development Session

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code with TypeScript
   - Use Prisma abstractions for database operations
   - Follow component patterns
   - Test changes in browser

3. **Regular Checks**
   ```bash
   # Check types (in separate terminal)
   bun run type-check

   # Format code before committing
   bun run format
   bun run lint
   ```

### End of Session

1. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add user profile functionality"
   ```

2. **Push to Remote**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Go to GitHub repository
   - Create new pull request
   - Add description and labels
   - Request review

## 🧪 Testing Strategy

### Testing Levels

#### 1. **Unit Tests**
Test individual functions and components in isolation.

```typescript
// Example unit test for user creation
import { createUser } from '@/lib/user';

describe('createUser', () => {
  it('should create a user with valid data', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      mode: 'STUDENT' as const
    };

    const user = await createUser(userData);

    expect(user.email).toBe(userData.email);
    expect(user.name).toBe(userData.name);
    expect(user.mode).toBe(userData.mode);
  });

  it('should throw error for invalid email', async () => {
    const userData = {
      email: 'invalid-email',
      name: 'Test User'
    };

    await expect(createUser(userData)).rejects.toThrow('Invalid email format');
  });
});
```

#### 2. **Integration Tests**
Test interactions between components and database operations.

```typescript
// Example integration test
import { createUser, createBlock, getUserPosts } from '@/lib';

describe('User-Block Integration', () => {
  it('should create block and associate with user', async () => {
    // Create user
    const user = await createUser({
      email: 'author@example.com',
      name: 'Author'
    });

    // Create block
    const block = await createBlock({
      title: 'Test Block',
      content: 'Test content',
      authorId: user.id
    });

    // Verify relationship
    const userPosts = await getUserPosts(user.id);
    expect(userPosts).toHaveLength(1);
    expect(userPosts[0].id).toBe(block.id);
  });
});
```

#### 3. **End-to-End Tests**
Test complete user workflows in the browser.

```typescript
// Example E2E test with Playwright
import { test, expect } from '@playwright/test';

test('user can create and publish a block', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Login
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'password');
  await page.click('[data-testid="login-button"]');

  // Create block
  await page.click('[data-testid="create-block"]');
  await page.fill('[data-testid="block-title"]', 'Test Block');
  await page.fill('[data-testid="block-content"]', 'Test content');
  await page.click('[data-testid="save-block"]');

  // Verify block was created
  await expect(page.locator('[data-testid="block-title"]')).toContainText('Test Block');
});
```

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test user.test.ts

# Run tests with coverage
bun test --coverage

# Run integration tests
bun test:integration

# Run E2E tests
bun test:e2e
```

## 📝 Code Quality

### TypeScript Best Practices

#### 1. **Strict Type Checking**
```typescript
// ✅ Good - Explicit types
interface CreateUserData {
  email: string;
  name?: string;
  mode?: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

const createUser = async (data: CreateUserData): Promise<User> => {
  // Implementation
};

// ❌ Avoid - Any types
const createUser = async (data: any): Promise<any> => {
  // Implementation
};
```

#### 2. **Type Guards**
```typescript
// ✅ Good - Type guards for validation
function isValidEmail(email: string): email is string {
  return email.includes('@') && email.includes('.');
}

const createUser = async (data: CreateUserData): Promise<User> => {
  if (!isValidEmail(data.email)) {
    throw new Error('Invalid email format');
  }
  // Implementation
};
```

#### 3. **Generic Types**
```typescript
// ✅ Good - Generic utility functions
async function findById<T>(id: string, model: string): Promise<T | null> {
  // Implementation
}

const user = await findById<User>('user-123', 'user');
```

### Code Style Guidelines

#### 1. **Naming Conventions**
```typescript
// ✅ Good - Clear, descriptive names
const getUserById = async (userId: string): Promise<User | null> => {
  // Implementation
};

const isUserActive = (user: User): boolean => {
  return user.status === 'ACTIVE';
};

// ❌ Avoid - Unclear names
const get = async (id: string) => {
  // Implementation
};

const check = (u: User) => {
  return u.s === 'A';
};
```

#### 2. **Function Organization**
```typescript
// ✅ Good - Single responsibility
const validateUserData = (data: CreateUserData): void => {
  if (!data.email) throw new Error('Email is required');
  if (!isValidEmail(data.email)) throw new Error('Invalid email format');
};

const createUser = async (data: CreateUserData): Promise<User> => {
  validateUserData(data);
  return await prisma.user.create({ data });
};

// ❌ Avoid - Multiple responsibilities
const createUser = async (data: CreateUserData): Promise<User> => {
  // Validation, database operation, and business logic all mixed
  if (!data.email) throw new Error('Email is required');
  if (!data.email.includes('@')) throw new Error('Invalid email');
  const user = await prisma.user.create({ data });
  await sendWelcomeEmail(user);
  return user;
};
```

#### 3. **Error Handling**
```typescript
// ✅ Good - Custom error classes
class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserError';
  }
}

const createUser = async (data: CreateUserData): Promise<User> => {
  try {
    return await prisma.user.create({ data });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new UserError('Email already exists');
    }
    throw new UserError('Failed to create user');
  }
};

// ❌ Avoid - Generic error handling
const createUser = async (data: CreateUserData): Promise<User> => {
  try {
    return await prisma.user.create({ data });
  } catch (error) {
    throw new Error('Something went wrong');
  }
};
```

### Linting and Formatting

#### ESLint Configuration
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

#### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 🔄 Git Workflow

### Branch Strategy

#### 1. **Main Branch**
- `main` - Production-ready code
- Protected branch
- Requires pull request and review
- Automatic deployment trigger

#### 2. **Development Branch**
- `develop` - Integration branch
- Feature branches merge here
- Pre-production testing
- Staging deployment

#### 3. **Feature Branches**
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Critical fixes

### Commit Message Convention

#### Format
```
type(scope): description

[optional body]

[optional footer]
```

#### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

#### Examples
```bash
# Feature commit
git commit -m "feat(user): add user profile management

- Add profile editing functionality
- Implement avatar upload
- Add profile validation

Closes #123"

# Bug fix commit
git commit -m "fix(auth): resolve login redirect issue

The login redirect was not working properly on mobile devices.
This fix ensures proper redirect handling across all platforms."

# Documentation commit
git commit -m "docs(api): update API documentation

- Add missing endpoint documentation
- Update request/response examples
- Fix typos in descriptions"
```

### Pull Request Process

#### 1. **Create Pull Request**
- Clear title describing the change
- Detailed description of changes
- Link to related issues
- Add appropriate labels

#### 2. **Pull Request Template**
```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

#### 3. **Code Review Process**
- At least one approval required
- Address all review comments
- Update PR if requested
- Merge only after approval

## 🚀 Performance Considerations

### Development Performance

#### 1. **Hot Reloading Optimization**
```typescript
// ✅ Good - Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});

// ✅ Good - Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

#### 2. **Bundle Size Management**
```typescript
// ✅ Good - Dynamic imports for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>
});

// ✅ Good - Tree shaking friendly imports
import { Button } from '@/components/ui/Button';
// Instead of
import { Button } from '@/components/ui';
```

#### 3. **Database Query Optimization**
```typescript
// ✅ Good - Select only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
  }
});

// ✅ Good - Use pagination
const blocks = await prisma.block.findMany({
  take: 20,
  skip: 0,
  orderBy: { createdAt: 'desc' }
});
```

### Production Performance

#### 1. **Build Optimization**
```bash
# Analyze bundle size
bun run build
# Check .next/analyze for bundle analysis

# Optimize images
# Use Next.js Image component
# Implement proper caching strategies
```

#### 2. **Database Optimization**
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_blocks_author_id ON blocks(author_id);
CREATE INDEX idx_blocks_published_created ON blocks(published, created_at);

-- Monitor slow queries
-- Use Prisma query logging in development
```

## 🔍 Debugging Workflow

### Development Debugging

#### 1. **Console Logging**
```typescript
// ✅ Good - Structured logging
console.log('User creation:', { email: data.email, mode: data.mode });

// ✅ Good - Error logging
console.error('Failed to create user:', { error, data });

// ❌ Avoid - Generic logging
console.log('Something happened');
```

#### 2. **Browser DevTools**
- Use React DevTools for component debugging
- Use Network tab for API debugging
- Use Console for error tracking
- Use Sources for breakpoint debugging

#### 3. **Prisma Studio**
```bash
# Open database browser
bunx prisma studio

# Useful for:
# - Viewing data relationships
# - Debugging database issues
# - Manual data inspection
```

### Error Tracking

#### 1. **Error Boundaries**
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

#### 2. **Global Error Handling**
```typescript
// API error handling
const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    // Handle unauthorized
    redirectToLogin();
  } else if (error.response?.status === 500) {
    // Handle server error
    showErrorMessage('Server error occurred');
  } else {
    // Handle other errors
    showErrorMessage('An error occurred');
  }
};
```

## 📚 Related Documentation

- **[Development Setup](./setup)** - Environment setup
- **[Available Scripts](./scripts)** - Development commands
- **[Database & Prisma](./database)** - Database operations
- **[Troubleshooting](./troubleshooting)** - Common issues

---

**Follow this workflow to maintain high code quality and efficient development!** 🚀 