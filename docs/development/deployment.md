---
sidebar_position: 9
---

# Deployment Guide

Complete guide to deploying the Nuclear application to various platforms with production-ready configurations.

## 🚀 Deployment Overview

### Supported Platforms
- **Vercel** - Recommended for Next.js applications
- **Railway** - Full-stack deployment platform
- **Netlify** - Static site hosting
- **Docker** - Containerized deployment
- **Self-hosted** - Custom server deployment

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Build process tested
- [ ] Domain and SSL configured
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented

## 📦 Vercel Deployment

### Quick Deploy

#### 1. **Connect Repository**
```bash
# Install Vercel CLI
bun add -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel
```

#### 2. **Configure Environment Variables**
```bash
# Set environment variables
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

#### 3. **Vercel Configuration**
```json
// vercel.json
{
  "buildCommand": "bun run build",
  "devCommand": "bun coolDev",
  "installCommand": "bun install",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type" }
      ]
    }
  ]
}
```

### Production Deployment

#### 1. **Production Build**
```bash
# Build for production
bun run build

# Test production build locally
bun start
```

#### 2. **Deploy to Production**
```bash
# Deploy to production
vercel --prod

# Or set up automatic deployments
# Connect GitHub repository to Vercel
# Enable automatic deployments on push to main branch
```

#### 3. **Custom Domain Setup**
```bash
# Add custom domain
vercel domains add your-domain.com

# Configure DNS records
# A record: 76.76.19.19
# CNAME record: cname.vercel-dns.com
```

## 🚂 Railway Deployment

### Railway Setup

#### 1. **Create Railway Project**
```bash
# Install Railway CLI
bun add -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init
```

#### 2. **Railway Configuration**
```json
// railway.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "bun run build"
  },
  "deploy": {
    "startCommand": "bun start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 3. **Environment Variables**
```bash
# Set environment variables in Railway dashboard
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-app.railway.app
```

#### 4. **Deploy to Railway**
```bash
# Deploy application
railway up

# View logs
railway logs

# Open application
railway open
```

## 🐳 Docker Deployment

### Docker Configuration

#### 1. **Dockerfile**
```dockerfile
# Dockerfile
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN bunx prisma generate

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
COPY --from=base /app/lib/generated ./lib/generated

# Install production dependencies
RUN bun install --frozen-lockfile --production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["bun", "start"]
```

#### 2. **Docker Compose**
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
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=nuclear
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

#### 3. **Nginx Configuration**
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

#### 4. **Deploy with Docker**
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Update application
docker-compose pull
docker-compose up -d
```

## 🔄 CI/CD Pipeline

### GitHub Actions

#### 1. **CI/CD Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: nuclear_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Setup environment
        run: |
          echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/nuclear_test" >> .env
          echo "NEXTAUTH_SECRET=test-secret" >> .env
          echo "NEXTAUTH_URL=http://localhost:3000" >> .env
      
      - name: Generate Prisma client
        run: bunx prisma generate
      
      - name: Run database migrations
        run: bunx prisma migrate deploy
      
      - name: Run tests
        run: bun test
      
      - name: Build application
        run: bun run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Generate Prisma client
        run: bunx prisma generate
      
      - name: Build application
        run: bun run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

#### 2. **Environment Secrets**
```bash
# Set in GitHub repository settings
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
DATABASE_URL=your-production-database-url
NEXTAUTH_SECRET=your-production-secret
```

### GitLab CI/CD

#### 1. **GitLab Pipeline**
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: oven/bun:1
  services:
    - postgres:15
  variables:
    POSTGRES_DB: nuclear_test
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: password
    DATABASE_URL: postgresql://postgres:password@postgres:5432/nuclear_test
  script:
    - bun install
    - bunx prisma generate
    - bunx prisma migrate deploy
    - bun test
    - bun run build
  only:
    - merge_requests
    - main

build:
  stage: build
  image: oven/bun:1
  script:
    - bun install
    - bunx prisma generate
    - bun run build
  artifacts:
    paths:
      - .next/
      - public/
      - package.json
      - bun.lockb
      - next.config.js
      - lib/generated/
    expire_in: 1 hour
  only:
    - main

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - curl -X POST $DEPLOY_WEBHOOK_URL
  only:
    - main
```

## 🔒 Production Security

### Security Headers

#### 1. **Next.js Security Headers**
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

#### 2. **Content Security Policy**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add CSP header
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
    ].join('; ')
  );

  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
```

### Environment Security

#### 1. **Environment Variable Validation**
```typescript
// lib/env-validation.ts
import { z } from 'zod';

const productionEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  NODE_ENV: z.literal('production'),
});

export function validateProductionEnv() {
  try {
    return productionEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Production environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}
```

#### 2. **Runtime Security Checks**
```typescript
// lib/security.ts
export function validateSecurityConfig() {
  const issues: string[] = [];

  // Check for weak secrets
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    issues.push('NEXTAUTH_SECRET is too short (minimum 32 characters)');
  }

  // Check for development secrets in production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.NEXTAUTH_SECRET === 'dev-secret') {
      issues.push('Using development secret in production');
    }
    if (process.env.DATABASE_URL?.includes('localhost')) {
      issues.push('Using localhost database in production');
    }
  }

  if (issues.length > 0) {
    console.error('❌ Security issues detected:');
    issues.forEach(issue => console.error(`  - ${issue}`));
    process.exit(1);
  }
}
```

## 📊 Monitoring & Logging

### Application Monitoring

#### 1. **Health Check Endpoint**
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/generated/prisma';

export async function GET() {
  const startTime = Date.now();
  
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
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        },
        { status: 500 }
      );
    }
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: 'connected',
      responseTime: `${responseTime}ms`,
      uptime: process.uptime(),
      version: process.env.npm_package_version || 'unknown',
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        uptime: process.uptime(),
      },
      { status: 500 }
    );
  }
}
```

#### 2. **Structured Logging**
```typescript
// lib/logger.ts
export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private log(entry: LogEntry) {
    const logData = {
      ...entry,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    };

    if (process.env.NODE_ENV === 'production') {
      // In production, use structured logging
      console.log(JSON.stringify(logData));
    } else {
      // In development, use readable format
      console.log(`[${entry.level.toUpperCase()}] ${entry.message}`, entry.context || '');
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log({ level: 'info', message, context });
  }

  warn(message: string, context?: Record<string, any>) {
    this.log({ level: 'warn', message, context });
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log({ level: 'error', message, error, context });
  }

  debug(message: string, context?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      this.log({ level: 'debug', message, context });
    }
  }
}

export const logger = new Logger();
```

### Performance Monitoring

#### 1. **Performance Metrics**
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
      logger.info(`Performance: ${name}`, {
        duration: `${end - start}ms`,
        operation: name,
      });
    });
  } else {
    const end = performance.now();
    logger.info(`Performance: ${name}`, {
      duration: `${end - start}ms`,
      operation: name,
    });
    return result;
  }
}
```

#### 2. **Database Query Monitoring**
```typescript
// lib/database-monitor.ts
import { prisma } from '@/lib/generated/prisma';

// Monitor slow queries
prisma.$use(async (params, next) => {
  const start = performance.now();
  const result = await next(params);
  const end = performance.now();
  
  const duration = end - start;
  
  if (duration > 1000) { // Log queries slower than 1 second
    logger.warn('Slow database query detected', {
      model: params.model,
      action: params.action,
      duration: `${duration}ms`,
      args: params.args,
    });
  }
  
  return result;
});
```

## 🔄 Backup & Recovery

### Database Backup

#### 1. **Automated Backup Script**
```bash
#!/bin/bash
# scripts/backup-db.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="nuclear"
BACKUP_FILE="$BACKUP_DIR/nuclear_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "nuclear_*.sql.gz" -mtime +7 -delete

echo "Backup created: $BACKUP_FILE.gz"
```

#### 2. **Backup Cron Job**
```bash
# Add to crontab
# Daily backup at 2 AM
0 2 * * * /path/to/scripts/backup-db.sh

# Weekly backup on Sunday at 3 AM
0 3 * * 0 /path/to/scripts/backup-db.sh
```

### Recovery Procedures

#### 1. **Database Recovery**
```bash
#!/bin/bash
# scripts/restore-db.sh

BACKUP_FILE=$1
DB_NAME="nuclear"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup-file>"
  exit 1
fi

# Restore database
gunzip -c $BACKUP_FILE | psql $DATABASE_URL

echo "Database restored from: $BACKUP_FILE"
```

#### 2. **Application Recovery**
```bash
#!/bin/bash
# scripts/recover-app.sh

echo "Starting application recovery..."

# Stop application
docker-compose down

# Restore database
./scripts/restore-db.sh $1

# Start application
docker-compose up -d

# Health check
sleep 30
curl -f http://localhost:3000/api/health

echo "Application recovery completed"
```

## 📚 Related Documentation

- **[Environment Configuration](./environment)** - Environment setup
- **[Database & Prisma](./database)** - Database deployment
- **[Troubleshooting](./troubleshooting)** - Deployment issues
- **[Development Setup](./setup)** - Local development

---

**Deploy your application with confidence and security!** 🚀 