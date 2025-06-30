---
sidebar_position: 1
---

# Development Guide

Welcome to the Nuclear application development guide! This section provides comprehensive documentation for setting up, developing, and contributing to the Nuclear project.

## 🚀 Quick Navigation

### Getting Started
- **[Development Setup](./setup)** - Complete setup instructions and prerequisites
- **[Project Structure](./project-structure)** - Understanding the codebase organization
- **[Environment Configuration](./environment)** - Setting up environment variables

### Development Workflow
- **[Available Scripts](./scripts)** - All development and build scripts
- **[Database & Prisma](./database)** - Database setup and Prisma operations
- **[Development Workflow](./workflow)** - Code quality, testing, and Git workflow

### Technical Documentation
- **[UI Framework & Styling](./ui-framework)** - Next.js, Tailwind CSS, and Nyxb UI
- **[API Documentation](./api)** - REST API routes and server actions
- **[Debugging Guide](./debugging)** - Development tools and troubleshooting

### Deployment & Operations
- **[Deployment Guide](./deployment)** - Production build and deployment
- **[Common Issues](./troubleshooting)** - Solutions to frequent problems
- **[Contributing Guidelines](./contributing)** - Code standards and contribution process

## 🎯 Key Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with app router | 14.x |
| **TypeScript** | Type-safe JavaScript | Latest |
| **Prisma** | Database ORM and migrations | Latest |
| **PostgreSQL** | Primary database | Latest |
| **Tailwind CSS** | Utility-first CSS framework | Latest |
| **Nyxb UI** | Component library | Latest |
| **Bun** | JavaScript runtime and package manager | Latest |

## 📋 Prerequisites

Before you begin development, ensure you have the following installed:

- **[Bun](https://bun.sh/docs/installation)** - JavaScript runtime and package manager
- **[Node.js](https://nodejs.org/)** - For some tooling compatibility
- **[PostgreSQL](https://www.postgresql.org/)** - Database (or access to Supabase)
- **Git** - Version control

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd app

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
bunx prisma migrate dev

# Start development server
bun coolDev  # Linux/Mac
bun winDev   # Windows
```

Visit [http://localhost:3000](http://localhost:3000) to see your application running!

## 📁 Project Overview

The Nuclear application is a modern web application built with Next.js 14, featuring:

- **Type-safe database operations** with Prisma abstractions
- **Interactive learning components** (quizzes, fill-in-the-blanks)
- **Content management system** with hierarchical organization
- **Gamification features** with points tracking
- **Modern UI** with Tailwind CSS and Nyxb UI

## 🔧 Development Philosophy

### Type Safety First
All database operations use Prisma-generated types, ensuring compile-time safety and excellent IDE support.

### Abstraction Layer
Custom Prisma abstractions provide consistent, reusable database operations with built-in error handling.

### Modern Development
- Hot reloading for fast development
- TypeScript for type safety
- Modern JavaScript features
- Component-based architecture

### Performance Focused
- Optimized database queries
- Efficient React components
- Proper indexing and caching strategies

## 📚 Documentation Structure

This development guide is organized into logical sections:

1. **Setup & Configuration** - Getting your development environment ready
2. **Project Structure** - Understanding the codebase organization
3. **Development Workflow** - Daily development practices and tools
4. **Technical Details** - Deep dives into specific technologies
5. **Deployment & Operations** - Production deployment and maintenance

## 🤝 Getting Help

- **Documentation Issues**: [GitHub Issues](https://github.com/nuclear-app/doc/issues)
- **Development Questions**: [GitHub Discussions](https://github.com/nuclear-app/doc/discussions)
- **Code Reviews**: Submit pull requests for review

## 📖 Next Steps

Ready to dive in? Start with the **[Development Setup](./setup)** guide to get your environment configured, then explore the **[Project Structure](./project-structure)** to understand how the codebase is organized.

---

**Happy coding!** 🚀 