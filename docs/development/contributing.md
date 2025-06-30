---
sidebar_position: 11
---

# Contributing Guide

Complete guide to contributing to the Nuclear application, including code standards, pull request process, and community guidelines.

## 🤝 Welcome Contributors!

Thank you for your interest in contributing to the Nuclear application! This guide will help you get started and ensure your contributions are valuable and well-integrated.

### How to Contribute
- **Bug Reports** - Help us identify and fix issues
- **Feature Requests** - Suggest new functionality
- **Code Contributions** - Submit pull requests
- **Documentation** - Improve guides and examples
- **Testing** - Help ensure code quality

## 🚀 Getting Started

### Prerequisites
- **Bun** - JavaScript runtime and package manager
- **Node.js** - For some tooling compatibility
- **Git** - Version control
- **PostgreSQL** - Database (local or cloud)

### Quick Setup
```bash
# Fork and clone the repository
git clone https://github.com/your-username/nuclear-app.git
cd nuclear-app

# Install dependencies
bun install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up database
bunx prisma generate
bunx prisma migrate dev

# Start development server
bun coolDev
```

### Development Environment
```bash
# Verify setup
bun run type-check  # TypeScript validation
bun run lint        # Code quality check
bun test            # Run tests
```

## 📋 Contribution Guidelines

### Code Standards

#### TypeScript Standards
```typescript
// ✅ Good - Explicit types and interfaces
interface CreateUserData {
  email: string;
  name?: string;
  mode: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

const createUser = async (data: CreateUserData): Promise<User> => {
  // Implementation
};

// ❌ Avoid - Any types and implicit returns
const createUser = async (data: any) => {
  // Implementation
};
```

#### Naming Conventions
```typescript
// ✅ Good - Clear, descriptive names
const getUserById = async (userId: string): Promise<User | null> => {
  // Implementation
};

const isUserActive = (user: User): boolean => {
  return user.status === 'ACTIVE';
};

// ❌ Avoid - Unclear or abbreviated names
const get = async (id: string) => {
  // Implementation
};

const check = (u: User) => {
  return u.s === 'A';
};
```

#### File Organization
```typescript
// ✅ Good - Single responsibility
// lib/user/validation.ts
export const validateUserData = (data: CreateUserData): void => {
  // Validation logic
};

// lib/user/operations.ts
export const createUser = async (data: CreateUserData): Promise<User> => {
  // User creation logic
};

// ❌ Avoid - Multiple responsibilities in one file
// lib/user.ts - Everything user-related mixed together
```

### Code Style

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
    "no-var": "error",
    "no-console": "warn"
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
  "tabWidth": 2,
  "useTabs": false
}
```

### Testing Standards

#### Unit Tests
```typescript
// __tests__/user.test.ts
import { createUser, getUserById } from '@/lib/user';

describe('User Operations', () => {
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

#### Integration Tests
```typescript
// __tests__/integration/user-block.test.ts
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

## 🔄 Pull Request Process

### Before Submitting

#### 1. **Check Existing Issues**
```bash
# Search for existing issues
# Check if your feature/bug is already reported
# Look for similar pull requests
```

#### 2. **Create Feature Branch**
```bash
# Create a new branch from main
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b bugfix/bug-description
```

#### 3. **Make Your Changes**
```bash
# Make your code changes
# Follow the coding standards
# Write tests for new functionality
# Update documentation if needed
```

#### 4. **Test Your Changes**
```bash
# Run all tests
bun test

# Check code quality
bun run lint
bun run type-check

# Test the application
bun coolDev
# Verify functionality in browser
```

#### 5. **Commit Your Changes**
```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: add user profile management

- Add profile editing functionality
- Implement avatar upload
- Add profile validation
- Include unit tests

Closes #123"
```

### Pull Request Template

#### Create Pull Request
```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring (no functional changes)

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] All existing tests still pass

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Branch is up to date with main

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information or context.
```

### Code Review Process

#### 1. **Review Checklist**
- [ ] Code follows project standards
- [ ] Tests are included and pass
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Error handling is appropriate

#### 2. **Review Comments**
```markdown
# Example review comment
This looks good overall! A few suggestions:

1. Consider adding validation for the email format
2. The error message could be more descriptive
3. Maybe add a test case for the edge case you mentioned

Let me know if you'd like me to clarify any of these points.
```

#### 3. **Addressing Feedback**
```bash
# Make requested changes
git add .
git commit -m "Address review feedback

- Add email validation
- Improve error message
- Add edge case test"
git push origin feature/your-feature-name
```

## 🐛 Bug Reports

### Bug Report Template
```markdown
## Bug Description
Clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 120]
- Node.js: [e.g., 18.0.0]
- Bun: [e.g., 1.0.0]

## Additional Context
- Screenshots
- Console errors
- Network tab information
- Any other relevant details
```

### Bug Fix Process
```bash
# Create bug fix branch
git checkout -b bugfix/bug-description

# Reproduce the bug
# Write a test that fails
# Fix the bug
# Verify the test passes
# Update documentation if needed

# Commit and submit PR
git add .
git commit -m "fix: resolve user creation error

The user creation was failing due to missing validation.
Added proper email validation and improved error handling.

Fixes #456"
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear and concise description of the feature.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How would you like this feature to work?

## Alternative Solutions
Any alternative solutions you've considered.

## Additional Context
- Use cases
- Mockups or wireframes
- Related issues
```

### Feature Development Process
```bash
# Create feature branch
git checkout -b feature/feature-name

# Plan the implementation
# Break down into smaller tasks
# Implement incrementally
# Write tests for each component
# Update documentation

# Submit PR when ready
git add .
git commit -m "feat: implement user profile management

- Add profile editing UI
- Implement backend API
- Add validation and error handling
- Include comprehensive tests
- Update documentation

Closes #789"
```

## 📚 Documentation Contributions

### Documentation Standards

#### Markdown Guidelines
```markdown
# Use clear, descriptive headings
## Use proper heading hierarchy
### Keep headings concise

Use **bold** for emphasis and `code` for inline code.

```typescript
// Code blocks should be properly formatted
const example = 'code';
```

- Use bullet points for lists
- Keep paragraphs short and focused
- Include examples where helpful
```

#### API Documentation
```typescript
/**
 * Creates a new user in the system
 * @param data - User creation data
 * @returns Promise resolving to the created user
 * @throws {ValidationError} When data is invalid
 * @throws {ConflictError} When email already exists
 * 
 * @example
 * ```typescript
 * const user = await createUser({
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   mode: 'STUDENT'
 * });
 * ```
 */
export async function createUser(data: CreateUserData): Promise<User> {
  // Implementation
}
```

### Documentation Types

#### Code Documentation
- **JSDoc comments** for functions and classes
- **README files** for modules and packages
- **Type definitions** with clear descriptions
- **Examples** for complex functionality

#### User Documentation
- **Getting started guides**
- **Tutorials and walkthroughs**
- **API reference documentation**
- **Troubleshooting guides**

## 🧪 Testing Contributions

### Test Standards

#### Test Organization
```typescript
// __tests__/unit/user.test.ts
describe('User Model', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Test implementation
    });

    it('should throw error for invalid email', async () => {
      // Test implementation
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      // Test implementation
    });
  });
});
```

#### Test Data Management
```typescript
// __tests__/fixtures/users.ts
export const mockUsers = {
  student: {
    email: 'student@example.com',
    name: 'Student User',
    mode: 'STUDENT' as const
  },
  teacher: {
    email: 'teacher@example.com',
    name: 'Teacher User',
    mode: 'TEACHER' as const
  }
};

// __tests__/helpers/test-utils.ts
export const createTestUser = async (data = mockUsers.student) => {
  return await createUser(data);
};
```

### Test Coverage
```bash
# Run tests with coverage
bun test --coverage

# Check coverage thresholds
# Aim for at least 80% coverage
# Focus on critical business logic
```

## 🔒 Security Contributions

### Security Guidelines

#### Security Best Practices
```typescript
// ✅ Good - Input validation
const createUser = async (data: CreateUserData): Promise<User> => {
  // Validate input
  if (!isValidEmail(data.email)) {
    throw new Error('Invalid email format');
  }
  
  // Sanitize data
  const sanitizedData = {
    ...data,
    name: sanitizeString(data.name)
  };
  
  return await prisma.user.create({ data: sanitizedData });
};

// ❌ Avoid - No validation
const createUser = async (data: any) => {
  return await prisma.user.create({ data });
};
```

#### Security Checklist
- [ ] Input validation and sanitization
- [ ] Authentication and authorization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Secure headers
- [ ] Environment variable security

### Security Reporting
```markdown
## Security Issue Report

**DO NOT** create a public issue for security vulnerabilities.

Please email security@your-domain.com with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours.
```

## 🎯 Performance Contributions

### Performance Guidelines

#### Code Optimization
```typescript
// ✅ Good - Efficient queries
const getUsersWithPosts = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      blocks: {
        select: {
          id: true,
          title: true,
          createdAt: true
        },
        take: 10,
        orderBy: { createdAt: 'desc' }
      }
    }
  });
};

// ❌ Avoid - N+1 queries
const getUsersWithPosts = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const blocks = await prisma.block.findMany({ where: { authorId: userId } });
  return { ...user, blocks };
};
```

#### Performance Checklist
- [ ] Database query optimization
- [ ] Code splitting and lazy loading
- [ ] Image optimization
- [ ] Caching strategies
- [ ] Bundle size optimization
- [ ] Memory usage optimization

## 🤝 Community Guidelines

### Code of Conduct

#### Our Standards
- **Be respectful** - Treat everyone with respect
- **Be inclusive** - Welcome contributors from all backgrounds
- **Be constructive** - Provide helpful, constructive feedback
- **Be patient** - Understand that everyone learns at their own pace

#### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Publishing private information
- Any conduct inappropriate in a professional setting

### Communication

#### GitHub Discussions
- Use **Discussions** for questions and ideas
- Use **Issues** for bugs and feature requests
- Use **Pull Requests** for code contributions

#### Communication Channels
- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Pull Request Reviews** - Code review discussions

### Recognition

#### Contributor Recognition
- **Contributors** - Listed in README.md
- **Code Reviewers** - Acknowledged in PRs
- **Documentation Contributors** - Credited in docs
- **Bug Reporters** - Thanked in issue resolutions

## 📋 Contribution Checklist

### Before Contributing
- [ ] Read the contributing guide
- [ ] Set up development environment
- [ ] Understand the codebase structure
- [ ] Check existing issues and PRs

### When Contributing
- [ ] Follow coding standards
- [ ] Write tests for new functionality
- [ ] Update documentation
- [ ] Test your changes thoroughly
- [ ] Use descriptive commit messages

### After Contributing
- [ ] Respond to review feedback
- [ ] Keep your branch up to date
- [ ] Help maintain the project
- [ ] Share knowledge with others

## 🎉 Getting Help

### Resources
- **Documentation** - Check the docs first
- **GitHub Issues** - Search existing issues
- **GitHub Discussions** - Ask questions
- **Code Examples** - Look at existing code

### Contact
- **General Questions** - GitHub Discussions
- **Bug Reports** - GitHub Issues
- **Security Issues** - Email security@your-domain.com
- **Feature Requests** - GitHub Issues

## 📚 Related Documentation

- **[Development Setup](./setup)** - Environment setup
- **[Development Workflow](./workflow)** - Daily development practices
- **[Code Standards](./workflow#code-quality)** - Coding guidelines
- **[Testing Strategy](./workflow#testing-strategy)** - Testing practices

---

**Thank you for contributing to Nuclear! Your contributions make this project better for everyone.** 🚀 