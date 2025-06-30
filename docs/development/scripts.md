---
sidebar_position: 4
---

# Available Scripts

Complete reference for all development, build, and utility scripts available in the Nuclear application.

## 🚀 Development Scripts

### Development Server

#### `bun coolDev` (Linux/Mac)
Start the development server with hot reloading on Linux and macOS.

```bash
bun coolDev
```

**What it does:**
- Starts Next.js development server
- Enables hot reloading for instant updates
- Runs TypeScript compilation in watch mode
- Displays compilation errors in real-time
- Serves the application at `http://localhost:3000`

**Features:**
- **Hot Reloading** - Changes reflect immediately in the browser
- **TypeScript Checking** - Real-time type error detection
- **Error Overlay** - Visual error display in browser
- **Fast Refresh** - Preserves component state during updates

#### `bun winDev` (Windows)
Start the development server optimized for Windows systems.

```bash
bun winDev
```

**Windows-specific optimizations:**
- Cross-platform compatibility
- Windows path handling
- Process management for Windows
- File watching optimized for Windows

### Database Scripts

#### `bunx prisma generate`
Regenerate the Prisma client after schema changes.

```bash
bunx prisma generate
```

**When to use:**
- After modifying `prisma/schema.prisma`
- After pulling database changes
- When TypeScript shows Prisma type errors
- Before running the application

**What it does:**
- Reads the Prisma schema
- Generates TypeScript types
- Creates the Prisma client
- Updates type definitions

#### `bunx prisma migrate dev`
Create and apply database migrations.

```bash
bunx prisma migrate dev
```

**What it does:**
- Detects schema changes
- Creates new migration files
- Applies migrations to database
- Regenerates Prisma client
- Seeds database (if configured)

**Options:**
```bash
# Create migration with custom name
bunx prisma migrate dev --name add_user_table

# Skip seeding
bunx prisma migrate dev --skip-seed

# Reset database before migration
bunx prisma migrate dev --reset
```

#### `bunx prisma db pull`
Pull database schema changes into Prisma schema.

```bash
bunx prisma db pull
```

**When to use:**
- Database structure changed externally
- Working with existing database
- Syncing schema with production database
- After manual database changes

#### `bunx prisma studio`
Open Prisma Studio - a visual database browser.

```bash
bunx prisma studio
```

**Features:**
- Visual database browser
- Edit data directly
- View relationships
- Export data
- Runs on `http://localhost:5555`

#### `bunx prisma migrate reset`
Reset the database and apply all migrations.

```bash
bunx prisma migrate reset
```

**⚠️ Warning: This will delete all data!**

**What it does:**
- Drops all tables
- Recreates database schema
- Applies all migrations
- Runs seed script
- Regenerates Prisma client

## 🏗️ Build Scripts

### Production Build

#### `bun run build`
Build the application for production.

```bash
bun run build
```

**What it does:**
- Compiles TypeScript
- Bundles JavaScript and CSS
- Optimizes assets
- Generates static files
- Creates production-ready build

**Output:**
- `.next/` directory with optimized build
- Static assets in `public/`
- Server-side code optimization
- Client-side code splitting

#### `bun start`
Start the production server.

```bash
bun start
```

**Prerequisites:**
- Must run `bun run build` first
- Requires production environment variables

**What it does:**
- Starts optimized Next.js server
- Serves production build
- Enables caching and compression
- Runs on configured port (default: 3000)

### Utility Scripts

#### `bun run clean`
Clean build artifacts and cache.

```bash
bun run clean
```

**What it removes:**
- `.next/` build directory
- `node_modules/.cache/`
- TypeScript build info
- Temporary files

**When to use:**
- After dependency changes
- When build issues occur
- Before fresh build
- Disk space cleanup

## 📦 Package Management Scripts

### Dependency Management

#### `bun install`
Install all dependencies.

```bash
bun install
```

**What it does:**
- Reads `package.json`
- Installs all dependencies
- Creates `bun.lockb` lock file
- Optimizes installation

#### `bun add <package>`
Add a new dependency.

```bash
# Add production dependency
bun add react-query

# Add development dependency
bun add -d @types/node

# Add specific version
bun add react@18.2.0
```

#### `bun remove <package>`
Remove a dependency.

```bash
bun remove unused-package
```

#### `bun update`
Update dependencies to latest versions.

```bash
bun update
```

## 🔧 Custom Scripts

### Development Utilities

#### `bun run type-check`
Run TypeScript type checking without compilation.

```bash
bun run type-check
```

**What it does:**
- Checks TypeScript types
- Reports type errors
- No file generation
- Fast type validation

#### `bun run lint`
Run ESLint for code quality checks.

```bash
bun run lint
```

**What it checks:**
- Code style consistency
- Potential errors
- Best practices
- TypeScript rules

#### `bun run format`
Format code using Prettier.

```bash
bun run format
```

**What it formats:**
- TypeScript/JavaScript files
- JSON files
- CSS files
- Markdown files

## 📋 Script Reference Table

| Script | Command | Purpose | Platform |
|--------|---------|---------|----------|
| **Development Server** | `bun coolDev` | Start dev server | Linux/Mac |
| **Development Server** | `bun winDev` | Start dev server | Windows |
| **Production Build** | `bun run build` | Build for production | All |
| **Production Server** | `bun start` | Start production server | All |
| **Clean Build** | `bun run clean` | Clean artifacts | All |
| **Type Check** | `bun run type-check` | TypeScript validation | All |
| **Lint Code** | `bun run lint` | Code quality check | All |
| **Format Code** | `bun run format` | Code formatting | All |
| **Prisma Generate** | `bunx prisma generate` | Generate Prisma client | All |
| **Prisma Migrate** | `bunx prisma migrate dev` | Run migrations | All |
| **Prisma Studio** | `bunx prisma studio` | Database browser | All |
| **Prisma Reset** | `bunx prisma migrate reset` | Reset database | All |
| **Prisma Pull** | `bunx prisma db pull` | Pull schema changes | All |

## 🎯 Common Script Combinations

### Daily Development Workflow

```bash
# 1. Start development
bun coolDev

# 2. In another terminal, check types
bun run type-check

# 3. Format code before committing
bun run format
bun run lint
```

### Database Changes Workflow

```bash
# 1. Modify schema
# Edit prisma/schema.prisma

# 2. Generate client
bunx prisma generate

# 3. Create and apply migration
bunx prisma migrate dev --name descriptive_name

# 4. Restart development server
bun coolDev
```

### Production Deployment Workflow

```bash
# 1. Clean previous build
bun run clean

# 2. Install dependencies
bun install

# 3. Build for production
bun run build

# 4. Start production server
bun start
```

## 🔍 Script Troubleshooting

### Common Issues

#### Development Server Won't Start
```bash
# Check if port is in use
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process if needed
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Clear cache and restart
bun run clean
bun coolDev
```

#### Prisma Client Issues
```bash
# Clear Prisma cache
rm -rf node_modules/.prisma

# Regenerate client
bunx prisma generate

# If still having issues
bun install
bunx prisma generate
```

#### Build Failures
```bash
# Clean and rebuild
bun run clean
bun install
bun run build

# Check TypeScript errors
bun run type-check
```

#### Dependency Issues
```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install

# Update dependencies
bun update
```

## 📚 Script Configuration

### Package.json Scripts

The scripts are defined in `package.json`:

```json
{
  "scripts": {
    "coolDev": "bash scripts/dev.sh",
    "winDev": "scripts/dev.bat",
    "build": "next build",
    "start": "next start",
    "clean": "rm -rf .next && rm -rf node_modules/.cache",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write ."
  }
}
```

### Custom Script Files

#### `scripts/dev.sh` (Linux/Mac)
```bash
#!/bin/bash
# Development server script for Linux/Mac
echo "Starting development server..."
next dev
```

#### `scripts/dev.bat` (Windows)
```batch
@echo off
REM Development server script for Windows
echo Starting development server...
next dev
```

## 🚀 Performance Tips

### Development Performance
- **Use `bun coolDev`** for faster development
- **Enable TypeScript caching** in VS Code
- **Use Prisma Studio** for database operations
- **Run type checking** in separate terminal

### Build Performance
- **Clean before building** for fresh builds
- **Use production environment** for accurate builds
- **Monitor bundle size** with build output
- **Optimize images** before adding to public/

## 📖 Related Documentation

- **[Development Setup](./setup)** - Initial environment setup
- **[Database & Prisma](./database)** - Database operations
- **[Development Workflow](./workflow)** - Daily development practices
- **[Troubleshooting](./troubleshooting)** - Common issues and solutions

---

**Master these scripts to become a Nuclear development expert!** ⚡ 