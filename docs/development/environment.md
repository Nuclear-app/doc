---
sidebar_position: 4
---

# Environment Configuration

Complete guide to configuring environment variables, settings, and deployment configurations for the Nuclear application.

## 🔧 Environment Variables

### Core Environment Variables

#### Database Configuration
```bash
# .env
DATABASE_URL="postgresql://username:password@localhost:5432/nuclear_db"
DIRECT_URL="postgresql://username:password@localhost:5432/nuclear_db"
```

**Required for:**
- Prisma database connection
- Database migrations
- Application startup

**Format:**
- `postgresql://username:password@host:port/database`
- `postgresql://username:password@host:port/database?schema=public`

#### Authentication Configuration
```bash
# .env
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_URL_INTERNAL="http://localhost:3000"
```

**Required for:**
- NextAuth.js session management
- JWT token signing
- Authentication callbacks

**Security Notes:**
- Use a strong, random secret for `NEXTAUTH_SECRET`
- Generate with: `openssl rand -base64 32`
- Never commit secrets to version control

#### Supabase Configuration (Optional)
```bash
# .env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

**Used for:**
- Supabase database hosting
- Real-time subscriptions
- Storage services

### Development Environment

#### Development Settings
```bash
# .env.local (development only)
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Debug settings
DEBUG="*"
LOG_LEVEL="debug"
```

#### Development Database
```bash
# .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/nuclear_dev"
DIRECT_URL="postgresql://postgres:password@localhost:5432/nuclear_dev"

# Local PostgreSQL
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_DB="nuclear_dev"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="password"
```

### Production Environment

#### Production Settings
```bash
# .env.production
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_API_URL="https://your-domain.com/api"

# Security
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"

# Performance
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
NEXT_PUBLIC_ENABLE_DEBUG="false"
```

#### Production Database
```bash
# .env.production
DATABASE_URL="postgresql://username:password@production-host:5432/nuclear_prod"
DIRECT_URL="postgresql://username:password@production-host:5432/nuclear_prod"

# Connection pooling
DATABASE_POOL_MIN="2"
DATABASE_POOL_MAX="10"
```

## 📁 Configuration Files

### Environment File Structure

#### Development Environment
```bash
# .env.local (git ignored)
DATABASE_URL="postgresql://postgres:password@localhost:5432/nuclear_dev"
NEXTAUTH_SECRET="dev-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

#### Production Environment
```bash
# .env.production
DATABASE_URL="postgresql://username:password@host:5432/nuclear_prod"
NEXTAUTH_SECRET="production-secret-key"
NEXTAUTH_URL="https://your-domain.com"
NODE_ENV="production"
```

#### Example Environment File
```bash
# .env.example
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/nuclear_db"
DIRECT_URL="postgresql://username:password@localhost:5432/nuclear_db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Supabase (optional)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Debug
DEBUG="*"
LOG_LEVEL="debug"
```

### Next.js Configuration

#### Next.js Config
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  images: {
    domains: ['localhost', 'your-domain.com'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

#### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Prisma Configuration

#### Prisma Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../lib/generated/prisma"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// Models...
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  mode      UserMode @default(STUDENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  blocks    Block[]
  folders   Folder[]
  pointsUpdates PointsUpdate[]

  @@map("users")
}

// Other models...
```

#### Prisma Environment
```bash
# prisma/.env
DATABASE_URL="postgresql://username:password@localhost:5432/nuclear_db"
DIRECT_URL="postgresql://username:password@localhost:5432/nuclear_db"
```

## 🔒 Security Configuration

### Environment Variable Security

#### Sensitive Variables
```bash
# Never commit these to version control
NEXTAUTH_SECRET="super-secret-key"
DATABASE_URL="postgresql://username:password@host:5432/db"
SUPABASE_SERVICE_ROLE_KEY="service-role-key"
API_KEYS="external-api-keys"
```

#### Public Variables
```bash
# Safe to commit (client-side accessible)
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_API_URL="https://your-domain.com/api"
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
```

### Security Best Practices

#### Environment Variable Validation
```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);

// Usage
import { env } from '@/lib/env';

const databaseUrl = env.DATABASE_URL;
```

#### Environment Variable Types
```typescript
// types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      DIRECT_URL: string;
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;
      NEXTAUTH_URL_INTERNAL?: string;
      SUPABASE_URL?: string;
      SUPABASE_ANON_KEY?: string;
      SUPABASE_SERVICE_ROLE_KEY?: string;
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_ENABLE_ANALYTICS?: string;
      NEXT_PUBLIC_ENABLE_DEBUG?: string;
      DEBUG?: string;
      LOG_LEVEL?: string;
    }
  }
}

export {};
```

## 🚀 Deployment Configuration

### Vercel Deployment

#### Vercel Configuration
```json
// vercel.json
{
  "buildCommand": "bun run build",
  "devCommand": "bun coolDev",
  "installCommand": "bun install",
  "framework": "nextjs",
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "@nextauth-url"
  }
}
```

#### Environment Variables in Vercel
```bash
# Set in Vercel dashboard or CLI
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

# Or use vercel.json
{
  "env": {
    "DATABASE_URL": "postgresql://...",
    "NEXTAUTH_SECRET": "your-secret",
    "NEXTAUTH_URL": "https://your-domain.vercel.app"
  }
}
```

### Docker Deployment

#### Dockerfile
```dockerfile
# Dockerfile
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN bun run build

# Production stage
FROM oven/bun:1-slim as production
WORKDIR /app

# Copy built application
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/bun.lockb ./bun.lockb
COPY --from=base /app/next.config.js ./next.config.js

# Install production dependencies
RUN bun install --frozen-lockfile --production

# Expose port
EXPOSE 3000

# Start application
CMD ["bun", "start"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/nuclear
      - NEXTAUTH_SECRET=your-secret
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=nuclear
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Environment-Specific Configurations

#### Development Environment
```typescript
// config/development.ts
export const developmentConfig = {
  database: {
    url: process.env.DATABASE_URL,
    logging: true,
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL,
  },
  app: {
    debug: true,
    logLevel: 'debug',
  },
};
```

#### Production Environment
```typescript
// config/production.ts
export const productionConfig = {
  database: {
    url: process.env.DATABASE_URL,
    logging: false,
    pool: {
      min: 2,
      max: 10,
    },
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL,
  },
  app: {
    debug: false,
    logLevel: 'error',
  },
};
```

#### Configuration Loader
```typescript
// config/index.ts
import { developmentConfig } from './development';
import { productionConfig } from './production';

const configs = {
  development: developmentConfig,
  production: productionConfig,
  test: developmentConfig,
};

export const config = configs[process.env.NODE_ENV || 'development'];
```

## 🔧 Environment Setup Scripts

### Setup Scripts

#### Development Setup
```bash
#!/bin/bash
# scripts/setup-dev.sh

echo "Setting up development environment..."

# Copy environment file
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example"
  echo "Please update .env.local with your configuration"
else
  echo ".env.local already exists"
fi

# Install dependencies
echo "Installing dependencies..."
bun install

# Generate Prisma client
echo "Generating Prisma client..."
bunx prisma generate

# Run database migrations
echo "Running database migrations..."
bunx prisma migrate dev

# Start development server
echo "Starting development server..."
bun coolDev
```

#### Production Setup
```bash
#!/bin/bash
# scripts/setup-prod.sh

echo "Setting up production environment..."

# Validate environment variables
required_vars=("DATABASE_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: $var is not set"
    exit 1
  fi
done

# Install dependencies
echo "Installing dependencies..."
bun install --frozen-lockfile

# Generate Prisma client
echo "Generating Prisma client..."
bunx prisma generate

# Run database migrations
echo "Running database migrations..."
bunx prisma migrate deploy

# Build application
echo "Building application..."
bun run build

echo "Production setup complete!"
```

### Environment Validation

#### Validation Script
```typescript
// scripts/validate-env.ts
import { z } from 'zod';
import { config } from 'dotenv';

// Load environment variables
config();

const envSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

try {
  envSchema.parse(process.env);
  console.log('✅ Environment variables are valid');
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment validation failed:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
}
```

#### Package.json Scripts
```json
{
  "scripts": {
    "validate-env": "bun run scripts/validate-env.ts",
    "setup-dev": "bash scripts/setup-dev.sh",
    "setup-prod": "bash scripts/setup-prod.sh",
    "prebuild": "bun run validate-env",
    "prestart": "bun run validate-env"
  }
}
```

## 📊 Environment Monitoring

### Environment Health Check
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/generated/prisma';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
    ];
    
    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );
    
    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing environment variables',
          missing: missingVars,
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: 'connected',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

### Environment Information
```typescript
// lib/env-info.ts
export function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
    authSecret: process.env.NEXTAUTH_SECRET ? 'configured' : 'missing',
    supabaseUrl: process.env.SUPABASE_URL ? 'configured' : 'missing',
    debug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  };
}
```

## 📚 Related Documentation

- **[Development Setup](./setup)** - Initial environment setup
- **[Available Scripts](./scripts)** - Environment-related scripts
- **[Database & Prisma](./database)** - Database configuration
- **[Troubleshooting](./troubleshooting)** - Environment issues

---

**Configure your environment for optimal development and deployment!** 🔧 