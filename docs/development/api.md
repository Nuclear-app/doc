---
sidebar_position: 8
---

# API Documentation

Complete guide to building and consuming APIs in the Nuclear application using Next.js API routes.

## 🚀 API Overview

### Technology Stack
- **Next.js 14** - API routes with app router
- **TypeScript** - Type-safe API development
- **Prisma** - Database operations
- **NextAuth.js** - Authentication
- **Zod** - Request validation

### Key Features
- **Type Safety** - Full TypeScript integration
- **Automatic Validation** - Request/response validation
- **Error Handling** - Consistent error responses
- **Authentication** - Protected routes
- **Rate Limiting** - API protection

## 🏗️ API Route Structure

### File Organization
```
app/
├── api/
│   ├── auth/                 # Authentication endpoints
│   │   ├── [...nextauth]/
│   │   │   └── route.ts
│   │   └── login/
│   │       └── route.ts
│   ├── users/                # User management
│   │   ├── route.ts          # GET /api/users, POST /api/users
│   │   └── [id]/
│   │       └── route.ts      # GET /api/users/[id], PUT /api/users/[id], DELETE /api/users/[id]
│   ├── blocks/               # Block management
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   ├── quizzes/              # Quiz management
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   └── health/               # Health check
│       └── route.ts
```

### Route Naming Convention
```typescript
// ✅ Good - RESTful naming
/api/users          // GET, POST
/api/users/[id]     // GET, PUT, DELETE
/api/users/[id]/profile  // GET, PUT

// ✅ Good - Action-based naming
/api/auth/login     // POST
/api/auth/logout    // POST
/api/blocks/[id]/publish  // POST
/api/blocks/[id]/unpublish  // POST

// ❌ Avoid - Inconsistent naming
/api/getUsers
/api/createUser
/api/updateUserById
```

## 📝 Creating API Routes

### Basic API Route
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/generated/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Request validation schema
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  mode: z.enum(['STUDENT', 'TEACHER', 'ADMIN']).default('STUDENT'),
});

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Build query
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    } : {};

    // Fetch users with pagination
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        mode: true,
        createdAt: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // Get total count
    const total = await prisma.user.count({ where });

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        mode: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('POST /api/users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Dynamic Route with ID
```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/generated/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Validation schemas
const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  mode: z.enum(['STUDENT', 'TEACHER', 'ADMIN']).optional(),
});

// GET /api/users/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        mode: true,
        createdAt: true,
        updatedAt: true,
        blocks: {
          select: {
            id: true,
            title: true,
            published: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('GET /api/users/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        mode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('PUT /api/users/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/users/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 🔐 Authentication & Authorization

### Session Management
```typescript
// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/generated/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password || ''
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          mode: user.mode,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.mode = user.mode;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.mode = token.mode as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
};
```

### Protected Route Helper
```typescript
// lib/api-helpers.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
    email: string;
    name: string;
    mode: string;
  };
}

export async function requireAuth(request: NextRequest): Promise<AuthenticatedRequest> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return {
    ...request,
    user: session.user,
  };
}

export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}
```

### Role-Based Authorization
```typescript
// lib/permissions.ts
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
}

export function requireRole(allowedRoles: UserRole[]) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      const request = args[0];
      const user = request.user;

      if (!allowedRoles.includes(user.mode as UserRole)) {
        throw new Error('Insufficient permissions');
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

// Usage in API route
export class UserController {
  @requireRole([UserRole.ADMIN, UserRole.TEACHER])
  async createUser(request: AuthenticatedRequest) {
    // Only admins and teachers can create users
  }

  @requireRole([UserRole.ADMIN])
  async deleteUser(request: AuthenticatedRequest) {
    // Only admins can delete users
  }
}
```

## 📊 Request Validation

### Zod Schemas
```typescript
// lib/validations/user.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  mode: z.enum(['STUDENT', 'TEACHER', 'ADMIN']).default('STUDENT'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  mode: z.enum(['STUDENT', 'TEACHER', 'ADMIN']).optional(),
});

export const userQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
  search: z.string().optional(),
  mode: z.enum(['STUDENT', 'TEACHER', 'ADMIN']).optional(),
});

// lib/validations/block.ts
export const createBlockSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  folderId: z.string().optional(),
  published: z.boolean().default(false),
});

export const updateBlockSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  folderId: z.string().optional(),
  published: z.boolean().optional(),
});
```

### Validation Middleware
```typescript
// lib/middleware/validation.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export function validateRequest(schema: z.ZodSchema) {
  return async function(request: NextRequest) {
    try {
      const body = await request.json();
      const validatedData = schema.parse(body);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: NextResponse.json(
            { error: 'Validation error', details: error.errors },
            { status: 400 }
          ),
        };
      }
      return {
        success: false,
        error: NextResponse.json(
          { error: 'Invalid JSON' },
          { status: 400 }
        ),
      };
    }
  };
}

// Usage
export async function POST(request: NextRequest) {
  const validation = await validateRequest(createUserSchema)(request);
  
  if (!validation.success) {
    return validation.error;
  }

  const { data } = validation;
  // Process validated data
}
```

## 🔄 Error Handling

### Error Response Format
```typescript
// lib/api-helpers.ts
export interface ApiError {
  error: string;
  message?: string;
  details?: any;
  code?: string;
}

export function createErrorResponse(
  error: string,
  status: number = 400,
  details?: any,
  code?: string
) {
  const response: ApiError = { error };
  
  if (details) response.details = details;
  if (code) response.code = code;
  
  return NextResponse.json(response, { status });
}

// Common error responses
export const ErrorResponses = {
  unauthorized: () => createErrorResponse('Unauthorized', 401),
  forbidden: () => createErrorResponse('Forbidden', 403),
  notFound: (resource: string) => createErrorResponse(`${resource} not found`, 404),
  validationError: (details: any) => createErrorResponse('Validation error', 400, details),
  internalError: () => createErrorResponse('Internal server error', 500),
  conflict: (message: string) => createErrorResponse(message, 409),
};
```

### Global Error Handler
```typescript
// lib/error-handler.ts
import { NextRequest, NextResponse } from 'next/server';

export function withErrorHandler(handler: Function) {
  return async (request: NextRequest, context: any) => {
    try {
      return await handler(request, context);
    } catch (error: any) {
      console.error('API Error:', error);

      // Handle specific error types
      if (error.name === 'PrismaClientKnownRequestError') {
        switch (error.code) {
          case 'P2002':
            return createErrorResponse('Resource already exists', 409);
          case 'P2025':
            return createErrorResponse('Resource not found', 404);
          default:
            return createErrorResponse('Database error', 500);
        }
      }

      if (error.name === 'ZodError') {
        return createErrorResponse('Validation error', 400, error.errors);
      }

      // Default error response
      return createErrorResponse('Internal server error', 500);
    }
  };
}

// Usage
export const GET = withErrorHandler(async (request: NextRequest) => {
  // Your API logic here
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
});
```

## 📡 API Client

### Frontend API Client
```typescript
// lib/api-client.ts
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  // User endpoints
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ users: User[]; pagination: PaginationInfo }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return this.request(`/users${query ? `?${query}` : ''}`);
  }

  async getUser(id: string): Promise<User> {
    return this.request(`/users/${id}`);
  }

  async createUser(data: CreateUserData): Promise<User> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Block endpoints
  async getBlocks(params?: {
    page?: number;
    limit?: number;
    authorId?: string;
    published?: boolean;
  }): Promise<{ blocks: Block[]; pagination: PaginationInfo }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.authorId) searchParams.set('authorId', params.authorId);
    if (params?.published !== undefined) searchParams.set('published', params.published.toString());

    const query = searchParams.toString();
    return this.request(`/blocks${query ? `?${query}` : ''}`);
  }

  async createBlock(data: CreateBlockData): Promise<Block> {
    return this.request('/blocks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async publishBlock(id: string): Promise<Block> {
    return this.request(`/blocks/${id}/publish`, {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient();
```

### React Hooks for API
```typescript
// hooks/useApi.ts
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const [data, setData] = useState<{ users: User[]; pagination: PaginationInfo } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const result = await apiClient.getUsers(params);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [params?.page, params?.limit, params?.search]);

  return { data, loading, error };
}

export function useUser(id: string) {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);
        const result = await apiClient.getUser(id);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchUser();
    }
  }, [id]);

  return { data, loading, error };
}
```

## 🚀 Performance Optimization

### Caching Strategies
```typescript
// lib/cache.ts
import { NextRequest, NextResponse } from 'next/server';

export function withCache(handler: Function, maxAge: number = 60) {
  return async (request: NextRequest, context: any) => {
    const response = await handler(request, context);
    
    // Add cache headers
    response.headers.set('Cache-Control', `public, max-age=${maxAge}`);
    
    return response;
  };
}

// Usage
export const GET = withCache(async (request: NextRequest) => {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}, 300); // Cache for 5 minutes
```

### Rate Limiting
```typescript
// lib/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  handler: Function,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) {
  return async (request: NextRequest, context: any) => {
    const ip = request.ip || 'unknown';
    const now = Date.now();
    
    const rateLimit = rateLimitMap.get(ip);
    
    if (rateLimit && now < rateLimit.resetTime) {
      if (rateLimit.count >= limit) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        );
      }
      rateLimit.count++;
    } else {
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
    }
    
    return handler(request, context);
  };
}

// Usage
export const POST = withRateLimit(async (request: NextRequest) => {
  // Your API logic here
}, 10, 60 * 1000); // 10 requests per minute
```

## 📚 Related Documentation

- **[Development Setup](./setup)** - Environment setup
- **[Database & Prisma](./database)** - Database operations
- **[UI Framework](./ui-framework)** - Frontend integration
- **[Troubleshooting](./troubleshooting)** - Common API issues

---

**Build robust, type-safe APIs with Next.js!** 🚀 