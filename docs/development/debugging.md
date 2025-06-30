---
sidebar_position: 12
---

# Debugging Guide

Complete guide to debugging the Nuclear application, including tools, techniques, and best practices for identifying and resolving issues.

## 🔍 Debugging Overview

### Debugging Philosophy
- **Systematic Approach** - Follow a structured debugging process
- **Evidence-Based** - Use data and logs to identify root causes
- **Reproducible** - Create minimal test cases to reproduce issues
- **Documentation** - Document findings and solutions

### Common Debugging Scenarios
- **Runtime Errors** - JavaScript exceptions and crashes
- **Database Issues** - Query problems and connection errors
- **Performance Problems** - Slow operations and bottlenecks
- **UI/UX Issues** - Rendering problems and user experience issues
- **Authentication Problems** - Login and session issues

## 🛠️ Debugging Tools

### Browser Developer Tools

#### Chrome DevTools
```bash
# Open DevTools
F12 or Ctrl+Shift+I (Windows/Linux)
Cmd+Option+I (macOS)

# Key panels for debugging:
# - Console: JavaScript errors and logs
# - Sources: Breakpoint debugging
# - Network: API calls and requests
# - Application: Storage and session data
# - Performance: Performance profiling
```

#### Console Debugging
```typescript
// Basic logging
console.log('User data:', user);
console.error('Error occurred:', error);
console.warn('Warning message');

// Structured logging
console.table(users);
console.group('User Operations');
console.log('Creating user...');
console.log('User created successfully');
console.groupEnd();

// Performance timing
console.time('userCreation');
await createUser(userData);
console.timeEnd('userCreation');
```

#### Breakpoint Debugging
```typescript
// Set breakpoints in code
function createUser(data: CreateUserData) {
  debugger; // Browser will pause here
  console.log('Creating user with data:', data);
  
  // Step through code line by line
  const validatedData = validateUserData(data);
  const user = await prisma.user.create({ data: validatedData });
  
  return user;
}
```

### React Developer Tools

#### Installation
```bash
# Chrome Extension
# Search for "React Developer Tools" in Chrome Web Store

# Firefox Extension
# Search for "React Developer Tools" in Firefox Add-ons
```

#### Usage
```typescript
// Component inspection
// - View component tree
// - Inspect props and state
// - Monitor re-renders
// - Profile performance

// Example component with debugging
function UserProfile({ user }: { user: User }) {
  // Monitor component renders
  console.log('UserProfile rendered with user:', user);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Database Debugging

#### Prisma Studio
```bash
# Open database browser
bunx prisma studio

# Features:
# - View all tables and data
# - Edit data directly
# - Execute custom queries
# - Monitor relationships
```

#### Query Logging
```typescript
// Enable query logging in development
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Monitor specific queries
const start = Date.now();
const users = await prisma.user.findMany({
  include: { blocks: true, folders: true }
});
const duration = Date.now() - start;
console.log(`Query took ${duration}ms`);
```

#### Database Connection Testing
```bash
# Test database connection
bunx prisma db pull

# Check migration status
bunx prisma migrate status

# Validate schema
bunx prisma validate
```

## 🔧 Debugging Techniques

### Error Tracking

#### Error Boundaries
```typescript
// components/ErrorBoundary.tsx
import React from 'react';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to external service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <p className="text-red-600 mt-2">
            {this.state.error?.message || 'An error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

#### Global Error Handling
```typescript
// lib/error-handler.ts
export function setupGlobalErrorHandling() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Log to external service
  });

  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);
    // Log to external service
  });
}

// Usage in app
setupGlobalErrorHandling();
```

### Performance Debugging

#### Performance Monitoring
```typescript
// lib/performance.ts
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now();
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const end = performance.now();
      console.log(`Performance: ${name} took ${end - start}ms`);
    });
  } else {
    const end = performance.now();
    console.log(`Performance: ${name} took ${end - start}ms`);
    return result;
  }
}

// Usage
const users = await measurePerformance('Fetch users', () => 
  prisma.user.findMany()
);
```

#### React Performance Profiling
```typescript
// components/UserList.tsx
import { Profiler } from 'react';

function UserList({ users }: { users: User[] }) {
  const onRenderCallback = (
    id: string,
    phase: string,
    actualDuration: number
  ) => {
    if (actualDuration > 16) { // Longer than one frame
      console.warn(`Slow render detected: ${id} took ${actualDuration}ms`);
    }
  };

  return (
    <Profiler id="UserList" onRender={onRenderCallback}>
      <div>
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </Profiler>
  );
}
```

### Network Debugging

#### API Request Monitoring
```typescript
// lib/api-monitor.ts
export function monitorApiRequests() {
  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    const start = Date.now();
    const [url, options] = args;
    
    try {
      const response = await originalFetch(...args);
      const duration = Date.now() - start;
      
      console.log(`API Request: ${url}`, {
        method: options?.method || 'GET',
        status: response.status,
        duration: `${duration}ms`,
      });
      
      return response;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`API Error: ${url}`, {
        method: options?.method || 'GET',
        error: error.message,
        duration: `${duration}ms`,
      });
      throw error;
    }
  };
}

// Usage
monitorApiRequests();
```

#### Network Tab Analysis
```typescript
// Monitor specific requests
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
})
.then(response => {
  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);
  return response.json();
})
.then(data => {
  console.log('Response data:', data);
})
.catch(error => {
  console.error('Request failed:', error);
});
```

## 🐛 Common Issues & Solutions

### TypeScript Errors

#### Type Errors
```typescript
// Problem: Type mismatch
const user: User = {
  id: '123',
  email: 'user@example.com',
  // Missing required fields
};

// Solution: Add missing fields or use partial type
const user: Partial<User> = {
  id: '123',
  email: 'user@example.com',
};

// Or fix the type definition
interface User {
  id: string;
  email: string;
  name?: string; // Make optional
}
```

#### Import Errors
```typescript
// Problem: Module not found
import { createUser } from '@/lib/user';

// Solution: Check file path and exports
// lib/user.ts
export { createUser } from './user/operations';

// Or use relative imports
import { createUser } from '../lib/user';
```

### Database Issues

#### Connection Problems
```bash
# Problem: Database connection failed
# Solution: Check environment variables
echo $DATABASE_URL

# Test connection
bunx prisma db pull

# Check if database is running
# For local PostgreSQL:
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux
```

#### Query Issues
```typescript
// Problem: Slow queries
const users = await prisma.user.findMany({
  include: { blocks: true, folders: true }
});

// Solution: Optimize query
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    blocks: {
      select: {
        id: true,
        title: true,
        createdAt: true
      },
      take: 10, // Limit results
      orderBy: { createdAt: 'desc' }
    }
  }
});
```

### React Issues

#### State Management Problems
```typescript
// Problem: State not updating
const [users, setUsers] = useState<User[]>([]);

const addUser = (user: User) => {
  setUsers([...users, user]); // This might not work as expected
};

// Solution: Use functional update
const addUser = (user: User) => {
  setUsers(prevUsers => [...prevUsers, user]);
};

// Or use useCallback for stability
const addUser = useCallback((user: User) => {
  setUsers(prevUsers => [...prevUsers, user]);
}, []);
```

#### Re-rendering Issues
```typescript
// Problem: Excessive re-renders
function UserList({ users }: { users: User[] }) {
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// Solution: Memoize components
const UserCard = React.memo(({ user }: { user: User }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});
```

## 🔍 Advanced Debugging

### Custom Debugging Hooks

#### useDebug Hook
```typescript
// hooks/useDebug.ts
import { useEffect, useRef } from 'react';

export function useDebug(componentName: string, props: any) {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    console.log(`${componentName} rendered ${renderCount.current} times`);
  });

  useEffect(() => {
    console.log(`${componentName} props changed:`, props);
  }, [componentName, props]);
}

// Usage
function MyComponent(props: any) {
  useDebug('MyComponent', props);
  return <div>Component content</div>;
}
```

#### usePerformance Hook
```typescript
// hooks/usePerformance.ts
import { useEffect, useRef } from 'react';

export function usePerformance(componentName: string) {
  const renderStart = useRef(performance.now());
  
  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    
    if (renderTime > 16) { // Longer than one frame
      console.warn(`${componentName} took ${renderTime}ms to render`);
    }
    
    renderStart.current = performance.now();
  });
}

// Usage
function ExpensiveComponent() {
  usePerformance('ExpensiveComponent');
  return <div>Expensive content</div>;
}
```

### Debugging Utilities

#### Debug Logger
```typescript
// lib/debug-logger.ts
class DebugLogger {
  private isEnabled = process.env.NODE_ENV === 'development';
  
  log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    if (!this.isEnabled) return;
    
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      data,
    };
    
    switch (level) {
      case 'info':
        console.log(`[${timestamp}] INFO: ${message}`, data);
        break;
      case 'warn':
        console.warn(`[${timestamp}] WARN: ${message}`, data);
        break;
      case 'error':
        console.error(`[${timestamp}] ERROR: ${message}`, data);
        break;
    }
  }
  
  info(message: string, data?: any) {
    this.log('info', message, data);
  }
  
  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }
  
  error(message: string, data?: any) {
    this.log('error', message, data);
  }
}

export const debugLogger = new DebugLogger();
```

#### Debug Context
```typescript
// lib/debug-context.ts
import { createContext, useContext } from 'react';

interface DebugContextType {
  isDebugMode: boolean;
  logDebug: (message: string, data?: any) => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: React.ReactNode }) {
  const isDebugMode = process.env.NODE_ENV === 'development';
  
  const logDebug = (message: string, data?: any) => {
    if (isDebugMode) {
      console.log(`[DEBUG] ${message}`, data);
    }
  };
  
  return (
    <DebugContext.Provider value={{ isDebugMode, logDebug }}>
      {children}
    </DebugContext.Provider>
  );
}

export function useDebug() {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within DebugProvider');
  }
  return context;
}
```

## 📊 Debugging Workflow

### Systematic Debugging Process

#### 1. **Reproduce the Issue**
```typescript
// Create minimal test case
const testCase = {
  input: { email: 'test@example.com', name: 'Test User' },
  expectedOutput: { id: '123', email: 'test@example.com', name: 'Test User' },
  actualOutput: null,
  error: null
};

// Test the function
try {
  testCase.actualOutput = await createUser(testCase.input);
} catch (error) {
  testCase.error = error;
}

console.log('Test case result:', testCase);
```

#### 2. **Identify the Root Cause**
```typescript
// Add debugging points
function createUser(data: CreateUserData) {
  console.log('1. Input data:', data);
  
  const validatedData = validateUserData(data);
  console.log('2. Validated data:', validatedData);
  
  const user = await prisma.user.create({ data: validatedData });
  console.log('3. Created user:', user);
  
  return user;
}
```

#### 3. **Implement the Fix**
```typescript
// Fix the issue
function createUser(data: CreateUserData) {
  // Add proper validation
  if (!data.email || !data.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  
  // Add error handling
  try {
    return await prisma.user.create({ data });
  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error('User creation failed');
  }
}
```

#### 4. **Verify the Fix**
```typescript
// Test the fix
const testCases = [
  { email: 'valid@example.com', name: 'Valid User' },
  { email: 'invalid-email', name: 'Invalid User' },
  { email: '', name: 'Empty Email' }
];

for (const testCase of testCases) {
  try {
    const result = await createUser(testCase);
    console.log('✅ Success:', result);
  } catch (error) {
    console.log('❌ Expected error:', error.message);
  }
}
```

## 📚 Related Documentation

- **[Troubleshooting](./troubleshooting)** - Common issues and solutions
- **[Development Workflow](./workflow)** - Debugging in daily workflow
- **[Performance Optimization](./workflow#performance-considerations)** - Performance debugging
- **[Testing Strategy](./workflow#testing-strategy)** - Debugging with tests

---

**Master debugging techniques to become a more effective developer!** 🔧 