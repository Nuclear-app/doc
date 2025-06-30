---
sidebar_position: 10
---

# Troubleshooting

Complete guide to diagnosing and resolving common issues in the Nuclear application development environment.

## 🚨 Common Issues & Solutions

### Development Server Issues

#### Port Already in Use
**Problem**: Development server won't start because port 3000 is occupied.

```bash
# Check what's using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Alternative: Use different port
bun coolDev --port 3001
```

#### Development Server Won't Start
**Problem**: `bun coolDev` fails to start or crashes immediately.

```bash
# Clear cache and restart
bun run clean
rm -rf .next
bun install
bun coolDev

# Check for TypeScript errors
bun run type-check

# Check for missing dependencies
bun install --force
```

#### Hot Reloading Not Working
**Problem**: Changes don't reflect automatically in the browser.

```bash
# Clear Next.js cache
rm -rf .next

# Restart development server
bun coolDev

# Check file watching limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Database Issues

#### Prisma Client Errors
**Problem**: TypeScript shows Prisma client errors or missing types.

```bash
# Regenerate Prisma client
bunx prisma generate

# Clear Prisma cache
rm -rf node_modules/.prisma

# Reinstall and regenerate
bun install
bunx prisma generate
```

#### Database Connection Failed
**Problem**: Cannot connect to database.

```bash
# Test database connection
bunx prisma db pull

# Check environment variables
echo $DATABASE_URL

# Verify database is running
# For local PostgreSQL:
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# For Supabase:
# Check project status in Supabase dashboard
```

#### Migration Issues
**Problem**: Database migrations fail or are out of sync.

```bash
# Check migration status
bunx prisma migrate status

# Reset database (development only)
bunx prisma migrate reset

# Force push schema (development only)
bunx prisma db push --force-reset

# Create fresh migration
bunx prisma migrate dev --name fresh_start
```

### TypeScript Issues

#### Type Errors
**Problem**: TypeScript compilation fails with type errors.

```bash
# Check for type errors
bun run type-check

# Clear TypeScript cache
rm -rf .next tsconfig.tsbuildinfo

# Restart TypeScript server in VS Code
# Cmd+Shift+P -> "TypeScript: Restart TS Server"

# Check tsconfig.json configuration
cat tsconfig.json
```

#### Missing Type Definitions
**Problem**: TypeScript can't find type definitions for packages.

```bash
# Install missing type definitions
bun add -d @types/node @types/react @types/react-dom

# Check if package has built-in types
bun add package-name

# Create custom type definitions
# Create types/package-name.d.ts
declare module 'package-name' {
  // Type definitions
}
```

### Build Issues

#### Build Failures
**Problem**: `bun run build` fails with errors.

```bash
# Clean and rebuild
bun run clean
bun install
bun run build

# Check for specific errors
bun run build 2>&1 | grep -i error

# Check bundle size
bun run build
# Check .next/analyze for bundle analysis
```

#### Memory Issues During Build
**Problem**: Build process runs out of memory.

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" bun run build

# For Windows
set NODE_OPTIONS=--max-old-space-size=4096
bun run build
```

### Dependency Issues

#### Package Installation Problems
**Problem**: `bun install` fails or packages are missing.

```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install

# Update Bun
bun upgrade

# Check for conflicting dependencies
bun pm ls

# Install specific version
bun add package-name@version
```

#### Version Conflicts
**Problem**: Package version conflicts or peer dependency warnings.

```bash
# Check for conflicts
bun pm ls

# Resolve conflicts manually
bun add package-name@compatible-version

# Use resolution in package.json
{
  "resolutions": {
    "package-name": "specific-version"
  }
}
```

## 🔍 Debugging Techniques

### Console Debugging

#### Structured Logging
```typescript
// ✅ Good - Structured logging
console.log('User creation:', {
  email: data.email,
  mode: data.mode,
  timestamp: new Date().toISOString()
});

// ✅ Good - Error logging with context
console.error('Failed to create user:', {
  error: error.message,
  data: data,
  stack: error.stack
});

// ❌ Avoid - Generic logging
console.log('Something happened');
```

#### Debug Levels
```typescript
// Development debugging
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Debug info:', data);
}

// Production logging
console.error('Production error:', error);
```

### Browser Debugging

#### React DevTools
```bash
# Install React DevTools browser extension
# Chrome: React Developer Tools
# Firefox: React Developer Tools

# Use in browser:
# - Component tree inspection
# - Props and state viewing
# - Performance profiling
```

#### Network Tab Debugging
```typescript
// Monitor API calls
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Response data:', data);
});
```

### Database Debugging

#### Prisma Query Logging
```typescript
// Enable query logging in development
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Monitor specific queries
const start = Date.now();
const users = await prisma.user.findMany();
const duration = Date.now() - start;
console.log(`Query took ${duration}ms`);
```

#### Prisma Studio
```bash
# Open database browser
bunx prisma studio

# Useful for:
# - Viewing data relationships
# - Debugging database issues
# - Manual data inspection
# - Testing queries
```

## 🛠️ Performance Issues

### Slow Development Server

#### File Watching Issues
```bash
# Check file watching limits
cat /proc/sys/fs/inotify/max_user_watches  # Linux

# Increase limits
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# For macOS
echo kern.maxfiles=65536 | sudo tee -a /etc/sysctl.conf
echo kern.maxfilesperproc=65536 | sudo tee -a /etc/sysctl.conf
```

#### Large Bundle Size
```bash
# Analyze bundle size
bun run build
# Check .next/analyze for detailed breakdown

# Identify large packages
bun pm ls --depth=0

# Use dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

### Database Performance

#### Slow Queries
```typescript
// Monitor query performance
const start = Date.now();
const result = await prisma.user.findMany({
  include: { blocks: true, folders: true }
});
const duration = Date.now() - start;
console.log(`Query took ${duration}ms`);

// Optimize queries
const users = await prisma.user.findMany({
  select: { id: true, name: true }, // Only select needed fields
  take: 20, // Use pagination
  orderBy: { createdAt: 'desc' }
});
```

#### Missing Indexes
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_blocks_author_id ON blocks(author_id);
CREATE INDEX idx_blocks_published_created ON blocks(published, created_at);
CREATE INDEX idx_users_email ON users(email);
```

## 🔧 Environment Issues

### Environment Variables

#### Missing Environment Variables
**Problem**: Application fails due to missing environment variables.

```bash
# Check environment file
cat .env

# Verify variables are loaded
echo $DATABASE_URL

# Set variables manually
export DATABASE_URL="your-database-url"
export NEXTAUTH_SECRET="your-secret"

# Restart development server
bun coolDev
```

#### Environment Variable Types
**Problem**: TypeScript errors for environment variables.

```typescript
// Create environment type definitions
// types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;
      SUPABASE_URL?: string;
      SUPABASE_ANON_KEY?: string;
    }
  }
}

export {};
```

### Platform-Specific Issues

#### Windows Issues
```bash
# Path issues
# Use forward slashes in imports
import { Button } from '@/components/ui/Button';

# Line ending issues
git config --global core.autocrlf true

# Permission issues
# Run terminal as administrator
```

#### macOS Issues
```bash
# Permission issues
sudo chown -R $(whoami) /usr/local/lib/node_modules

# File watching limits
echo kern.maxfiles=65536 | sudo tee -a /etc/sysctl.conf
echo kern.maxfilesperproc=65536 | sudo tee -a /etc/sysctl.conf
```

#### Linux Issues
```bash
# File watching limits
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Permission issues
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER ~/.bun
```

## 🚀 Advanced Debugging

### Error Boundaries
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
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <p className="text-red-600 mt-2">
            {this.state.error?.message || 'An error occurred'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Custom Hooks for Debugging
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

### Performance Monitoring
```typescript
// utils/performance.ts
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now();
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const end = performance.now();
      console.log(`${name} took ${end - start}ms`);
    });
  } else {
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
    return result;
  }
}

// Usage
const users = await measurePerformance('Fetch users', () => 
  prisma.user.findMany()
);
```

## 📞 Getting Help

### Before Asking for Help

1. **Check the logs** - Look for error messages in terminal and browser console
2. **Search existing issues** - Check GitHub issues for similar problems
3. **Try basic troubleshooting** - Restart server, clear cache, reinstall dependencies
4. **Document the issue** - Note exact error messages, steps to reproduce, environment details

### When Creating Issues

#### Issue Template
```markdown
## Description
Brief description of the problem.

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- OS: [e.g., macOS 12.0]
- Node.js: [e.g., 18.0.0]
- Bun: [e.g., 1.0.0]
- Database: [e.g., PostgreSQL 14]

## Error Messages
```
Exact error messages from console/logs
```

## Additional Context
Any other relevant information.
```

### Useful Commands for Debugging

```bash
# System information
uname -a                    # Linux/macOS
systeminfo                  # Windows

# Node.js information
node --version
bun --version

# Package information
bun pm ls
bun pm ls --depth=0

# Environment information
echo $NODE_ENV
echo $DATABASE_URL

# Process information
ps aux | grep node          # Linux/macOS
tasklist | findstr node     # Windows
```

## 📚 Related Documentation

- **[Development Setup](./setup)** - Initial environment setup
- **[Available Scripts](./scripts)** - Development commands
- **[Database & Prisma](./database)** - Database operations
- **[Development Workflow](./workflow)** - Daily development practices

---

**Master these troubleshooting techniques to become a debugging expert!** 🔧 