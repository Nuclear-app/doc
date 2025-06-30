---
sidebar_position: 3
---

# Project Structure

Understanding the Nuclear application's codebase organization and key directories.

## 📁 Root Directory Overview

```
app/
├── lib/                    # Core utilities and abstractions
├── app/                    # Next.js app directory (pages & API routes)
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── prisma/                 # Database schema and migrations
├── scripts/                # Development and build scripts
├── public/                 # Static assets
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## 🗂️ Core Directories

### `/lib` - Core Utilities & Abstractions

The heart of the application's data layer, containing type-safe Prisma abstractions.

```
lib/
├── generated/prisma/       # Auto-generated Prisma client
├── user.ts                # User model operations
├── block.ts               # Block model operations
├── quiz.ts                # Quiz model operations
├── question.ts            # Question model operations
├── folder.ts              # Folder model operations
├── fillInTheBlank.ts      # FillInTheBlank model operations
├── topic.ts               # Topic model operations
└── pointsUpdate.ts        # PointsUpdate model operations
```

**Key Files:**
- **`user.ts`** - Complete user CRUD operations, email lookups, relationship queries
- **`block.ts`** - Content block management with author and folder relationships
- **`quiz.ts`** - Quiz system with topic associations and block relationships
- **`question.ts`** - Question management with block associations
- **`folder.ts`** - Hierarchical folder structure with parent-child relationships
- **`fillInTheBlank.ts`** - Interactive content with search and random utilities
- **`topic.ts`** - Topic organization with examples and quiz associations
- **`pointsUpdate.ts`** - Points tracking with aggregation and date range utilities

### `/app` - Next.js App Directory

Next.js 14 app router structure with pages and API routes.

```
app/
├── api/                   # API routes
│   ├── blocks/           # Block API endpoints
│   ├── users/            # User API endpoints
│   ├── quizzes/          # Quiz API endpoints
│   ├── folders/          # Folder API endpoints
│   └── ...
├── dashboard/            # Dashboard pages
│   ├── page.tsx          # Main dashboard
│   ├── blocks/           # Block management
│   ├── users/            # User management
│   └── ...
├── auth/                 # Authentication pages
├── globals.css           # Global styles
├── layout.tsx            # Root layout
└── page.tsx              # Home page
```

**Key Features:**
- **API Routes** - RESTful endpoints for data operations
- **Server Components** - React server components for better performance
- **Layout System** - Consistent UI structure across pages
- **Authentication** - Built-in auth handling

### `/components` - Reusable UI Components

React components organized by functionality and reusability.

```
components/
├── ui/                   # Base UI components
│   ├── Button.tsx        # Button component
│   ├── Input.tsx         # Input component
│   ├── Card.tsx          # Card component
│   └── ...
├── forms/                # Form components
│   ├── BlockForm.tsx     # Block creation/editing form
│   ├── QuizForm.tsx      # Quiz creation/editing form
│   └── ...
├── dashboard/            # Dashboard-specific components
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── Header.tsx        # Dashboard header
│   └── ...
├── blocks/               # Block-related components
├── quizzes/              # Quiz-related components
└── shared/               # Shared utility components
```

**Component Guidelines:**
- **TypeScript** - All components use TypeScript for type safety
- **Props Interface** - Clear prop definitions for each component
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Accessibility** - ARIA labels and keyboard navigation support

### `/hooks` - Custom React Hooks

Custom hooks for shared logic and state management.

```
hooks/
├── useAuth.ts            # Authentication state management
├── useBlocks.ts          # Block data fetching and mutations
├── useQuizzes.ts         # Quiz data operations
├── useUsers.ts           # User data operations
├── useLocalStorage.ts    # Local storage utilities
└── useDebounce.ts        # Debounce utility
```

**Hook Patterns:**
- **Data Fetching** - SWR or React Query for server state
- **Form Management** - React Hook Form for form state
- **Local State** - useState and useReducer for client state
- **Side Effects** - useEffect for lifecycle management

### `/prisma` - Database Schema & Migrations

Database configuration and schema management.

```
prisma/
├── schema.prisma         # Database schema definition
├── migrations/           # Database migration files
│   ├── 20240101000000_initial/
│   ├── 20240102000000_add_users/
│   └── ...
└── seed.ts              # Database seeding script
```

**Schema Features:**
- **Type Safety** - Full TypeScript integration
- **Relationships** - Foreign key relationships between models
- **Indexes** - Performance optimization with database indexes
- **Constraints** - Data integrity constraints

### `/scripts` - Development & Build Scripts

Custom scripts for development, building, and deployment.

```
scripts/
├── dev.sh                # Development server script (Linux/Mac)
├── dev.bat               # Development server script (Windows)
├── build.sh              # Production build script
├── deploy.sh             # Deployment script
└── setup.sh              # Initial setup script
```

**Script Purposes:**
- **Development** - Hot reloading and TypeScript compilation
- **Building** - Production optimization and bundling
- **Deployment** - Automated deployment processes
- **Setup** - Environment initialization

### `/public` - Static Assets

Static files served directly by the web server.

```
public/
├── images/               # Image assets
│   ├── logo.svg          # Application logo
│   ├── icons/            # Icon files
│   └── backgrounds/      # Background images
├── fonts/                # Custom fonts
├── favicon.ico           # Browser favicon
└── robots.txt            # Search engine configuration
```

## 🔧 Configuration Files

### Root Configuration

| File | Purpose | Key Features |
|------|---------|--------------|
| **`package.json`** | Dependencies and scripts | Bun scripts, dependencies, metadata |
| **`tsconfig.json`** | TypeScript configuration | Strict mode, path mapping, Next.js compatibility |
| **`.env.example`** | Environment template | Required variables, example values |
| **`next.config.js`** | Next.js configuration | Build optimization, plugins |
| **`tailwind.config.js`** | Tailwind CSS configuration | Custom colors, fonts, spacing |

### Development Configuration

| File | Purpose | Key Features |
|------|---------|--------------|
| **`.vscode/settings.json`** | VS Code settings | Editor configuration, extensions |
| **`.gitignore`** | Git ignore rules | Node modules, build files, environment files |
| **`eslint.config.js`** | ESLint configuration | Code quality rules, TypeScript support |
| **`prettier.config.js`** | Prettier configuration | Code formatting rules |

## 📊 Data Flow Architecture

### Frontend to Backend Flow

```
User Interface (React Components)
    ↓
Custom Hooks (Data Management)
    ↓
API Routes (Next.js API)
    ↓
Prisma Abstractions (Type-safe DB operations)
    ↓
Database (PostgreSQL)
```

### Component Hierarchy

```
Layout (Root Layout)
    ↓
Dashboard Layout
    ↓
Page Components
    ↓
Feature Components
    ↓
UI Components
```

## 🎯 Key Design Principles

### 1. **Separation of Concerns**
- **Data Layer** (`/lib`) - Pure database operations
- **API Layer** (`/app/api`) - HTTP endpoints
- **UI Layer** (`/components`) - Presentation logic
- **State Management** (`/hooks`) - Application state

### 2. **Type Safety**
- **TypeScript** throughout the codebase
- **Prisma-generated types** for database operations
- **Strict type checking** enabled
- **Interface definitions** for all components

### 3. **Modularity**
- **Reusable components** in `/components`
- **Custom hooks** for shared logic
- **Utility functions** in `/lib`
- **Clear file organization** by feature

### 4. **Performance**
- **Server components** for better initial load
- **Code splitting** with dynamic imports
- **Optimized database queries** with Prisma
- **Static asset optimization**

## 🔍 File Naming Conventions

### Components
- **PascalCase** for component files: `UserProfile.tsx`
- **kebab-case** for directories: `user-profile/`
- **Descriptive names** that indicate purpose

### Utilities
- **camelCase** for utility files: `formatDate.ts`
- **Verb-noun pattern** for functions: `getUserById()`
- **Clear, descriptive names**

### Database
- **snake_case** for database fields: `created_at`
- **PascalCase** for Prisma models: `User`
- **Consistent naming** across schema

## 📝 Code Organization Best Practices

### 1. **Import Organization**
```typescript
// External libraries
import React from 'react';
import { useRouter } from 'next/router';

// Internal utilities
import { formatDate } from '@/lib/utils';

// Components
import { Button } from '@/components/ui/Button';

// Types
import type { User } from '@/lib/generated/prisma';
```

### 2. **Component Structure**
```typescript
// 1. Imports
// 2. Type definitions
// 3. Component definition
// 4. Export
```

### 3. **File Size Guidelines**
- **Components**: Keep under 200 lines
- **Utilities**: Keep under 100 lines
- **API routes**: Keep under 150 lines
- **Split large files** into smaller, focused modules

## 🚀 Getting Started with Development

### 1. **Understanding the Structure**
Start by exploring:
- `/lib` - Understand the data layer
- `/app` - See how pages are organized
- `/components` - Review reusable components

### 2. **Making Changes**
- **New features**: Add to appropriate directories
- **Database changes**: Update Prisma schema
- **UI changes**: Modify or create components
- **API changes**: Update or add API routes

### 3. **Following Patterns**
- **Use existing abstractions** in `/lib`
- **Follow component patterns** in `/components`
- **Maintain type safety** throughout
- **Keep files focused** and modular

## 📚 Related Documentation

- **[Development Setup](./setup)** - Setting up your environment
- **[Database & Prisma](./database)** - Database operations
- **[UI Framework & Styling](./ui-framework)** - Frontend technologies
- **[API Documentation](./api)** - API routes and endpoints

---

**Understanding the project structure is key to effective development!** 🏗️ 