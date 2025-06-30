---
sidebar_position: 7
---

# UI Framework & Styling

Complete guide to the UI technologies, styling approach, and component patterns used in the Nuclear application.

## 🎨 Technology Stack

### Core Technologies
- **Next.js 14** - React framework with app router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Nyxb UI** - Component library
- **React** - UI library

### Key Features
- **Server Components** - Better performance and SEO
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - Built-in theme support
- **Accessibility** - WCAG compliance
- **Type Safety** - Full TypeScript integration

## 🏗️ Next.js 14 Architecture

### App Router Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── globals.css             # Global styles
├── api/                    # API routes
├── dashboard/              # Dashboard pages
│   ├── layout.tsx          # Dashboard layout
│   ├── page.tsx            # Dashboard home
│   ├── blocks/             # Block management
│   └── users/              # User management
└── auth/                   # Authentication pages
```

### Server vs Client Components

#### Server Components (Default)
```typescript
// app/dashboard/page.tsx
import { getBlocks } from '@/lib/block';

export default async function DashboardPage() {
  const blocks = await getBlocks();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blocks.map(block => (
          <BlockCard key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}
```

#### Client Components
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4">
      <p className="text-lg mb-4">Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </div>
  );
}
```

### Layout System

#### Root Layout
```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nuclear Application',
  description: 'Modern learning platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

#### Dashboard Layout
```typescript
// app/dashboard/layout.tsx
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
```

## 🎨 Tailwind CSS

### Configuration

#### Tailwind Config
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
};
```

#### Global Styles
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: Inter, system-ui, sans-serif;
  }
  
  body {
    @apply bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700;
  }
  
  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white;
  }
}
```

### Utility Classes

#### Layout Utilities
```typescript
// Flexbox
<div className="flex items-center justify-between">
  <div>Left content</div>
  <div>Right content</div>
</div>

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Grid item 1</div>
  <div>Grid item 2</div>
  <div>Grid item 3</div>
</div>

// Spacing
<div className="p-4 m-2 space-y-4">
  <div>Item with spacing</div>
  <div>Another item</div>
</div>
```

#### Responsive Design
```typescript
// Mobile-first responsive design
<div className="
  w-full                    // Full width on mobile
  md:w-1/2                  // Half width on medium screens
  lg:w-1/3                  // One-third on large screens
  xl:w-1/4                  // One-quarter on extra large screens
">
  Responsive content
</div>

// Responsive text sizes
<h1 className="
  text-xl                   // Small on mobile
  md:text-2xl               // Medium on tablets
  lg:text-3xl               // Large on desktop
  xl:text-4xl               // Extra large on wide screens
">
  Responsive heading
</h1>
```

#### Dark Mode
```typescript
// Dark mode support
<div className="
  bg-white                  // Light background
  dark:bg-gray-900          // Dark background
  text-gray-900             // Light text
  dark:text-gray-100        // Dark text
  border-gray-200           // Light border
  dark:border-gray-700      // Dark border
">
  Dark mode compatible content
</div>
```

## 🧩 Component Library

### Base Components

#### Button Component
```typescript
// components/ui/Button.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
      outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500',
      ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    
    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

#### Input Component
```typescript
// components/ui/Input.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          className={cn(
            'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200',
            'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
            'dark:border-gray-600 dark:bg-gray-700 dark:text-white',
            'dark:focus:border-primary-400 dark:focus:ring-primary-400',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            error && 'dark:border-red-600 dark:focus:border-red-400 dark:focus:ring-red-400',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

#### Card Component
```typescript
// components/ui/Card.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components
Card.Header = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)} {...props}>
    {children}
  </div>
);

Card.Content = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-6 py-4', className)} {...props}>
    {children}
  </div>
);

Card.Footer = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-6 py-4 border-t border-gray-200 dark:border-gray-700', className)} {...props}>
    {children}
  </div>
);
```

### Form Components

#### Form Component
```typescript
// components/forms/BlockForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { createBlock } from '@/lib/block';

interface BlockFormProps {
  onSubmit?: (block: any) => void;
  initialData?: any;
}

export function BlockForm({ onSubmit, initialData }: BlockFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const block = await createBlock({
        ...formData,
        authorId: 'current-user-id', // Get from auth context
      });
      
      onSubmit?.(block);
      setFormData({ title: '', content: '' });
    } catch (error: any) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h2 className="text-lg font-semibold">Create New Block</h2>
      </Card.Header>
      <form onSubmit={handleSubmit}>
        <Card.Content className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            required
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none"
              rows={6}
              required
            />
            {errors.content && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.content}</p>
            )}
          </div>
          {errors.submit && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
          )}
        </Card.Content>
        <Card.Footer>
          <Button type="submit" loading={loading}>
            Create Block
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
}
```

## 🎯 Styling Best Practices

### Component Organization

#### File Structure
```
components/
├── ui/                     # Base UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── index.ts           # Export all UI components
├── forms/                  # Form components
│   ├── BlockForm.tsx
│   ├── QuizForm.tsx
│   └── index.ts
├── dashboard/              # Dashboard-specific components
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── index.ts
└── shared/                 # Shared utility components
    ├── LoadingSpinner.tsx
    ├── ErrorBoundary.tsx
    └── index.ts
```

#### Component Patterns
```typescript
// ✅ Good - Forward refs for flexibility
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={cn(baseClasses, className)} {...props} />;
  }
);

// ✅ Good - Compound components for complex UIs
Card.Header = ({ children, ...props }) => (
  <div className="px-6 py-4 border-b" {...props}>{children}</div>
);

// ✅ Good - Custom hooks for logic
const useForm = (initialData: any) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  
  return { data, setData, errors, setErrors };
};
```

### Responsive Design

#### Mobile-First Approach
```typescript
// ✅ Good - Mobile-first responsive design
<div className="
  grid grid-cols-1          // Single column on mobile
  gap-4                     // Small gap on mobile
  md:grid-cols-2           // Two columns on tablets
  md:gap-6                 // Larger gap on tablets
  lg:grid-cols-3           // Three columns on desktop
  lg:gap-8                 // Largest gap on desktop
">
  {items.map(item => (
    <Card key={item.id}>{item.content}</Card>
  ))}
</div>
```

#### Responsive Typography
```typescript
// ✅ Good - Responsive text sizing
<h1 className="
  text-2xl                  // Small on mobile
  font-bold
  text-gray-900
  dark:text-gray-100
  md:text-3xl              // Medium on tablets
  lg:text-4xl              // Large on desktop
  xl:text-5xl              // Extra large on wide screens
">
  Responsive Heading
</h1>
```

### Accessibility

#### ARIA Labels
```typescript
// ✅ Good - Proper ARIA labels
<button
  aria-label="Close modal"
  className="p-2 rounded-full hover:bg-gray-100"
>
  <XIcon className="w-5 h-5" />
</button>

// ✅ Good - Form labels
<label htmlFor="email" className="block text-sm font-medium">
  Email Address
</label>
<input
  id="email"
  type="email"
  aria-describedby="email-help"
  className="mt-1 block w-full"
/>
<p id="email-help" className="text-sm text-gray-500">
  We'll never share your email with anyone else.
</p>
```

#### Keyboard Navigation
```typescript
// ✅ Good - Keyboard accessible
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  onClick={handleClick}
  className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
>
  Clickable content
</div>
```

### Performance Optimization

#### Code Splitting
```typescript
// ✅ Good - Dynamic imports for large components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // Disable SSR for client-only components
});

// ✅ Good - Lazy load images
import Image from 'next/image';

<Image
  src="/large-image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

#### Memoization
```typescript
// ✅ Good - Memoize expensive components
const ExpensiveList = React.memo(({ items }: { items: Item[] }) => {
  return (
    <div>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  );
});

// ✅ Good - Memoize expensive calculations
const ExpensiveComponent = ({ data }: { data: any[] }) => {
  const processedData = useMemo(() => {
    return data.map(item => heavyProcessing(item));
  }, [data]);

  return <div>{/* Use processedData */}</div>;
};
```

## 🎨 Theme System

### Color Palette
```typescript
// Design system colors
const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
};
```

### Typography Scale
```typescript
// Typography system
const typography = {
  h1: 'text-4xl font-bold tracking-tight',
  h2: 'text-3xl font-bold tracking-tight',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  h5: 'text-lg font-medium',
  h6: 'text-base font-medium',
  body: 'text-base',
  small: 'text-sm',
  caption: 'text-xs',
};
```

## 📚 Related Documentation

- **[Development Setup](./setup)** - Environment setup
- **[Project Structure](./project-structure)** - Codebase organization
- **[API Documentation](./api)** - Backend integration
- **[Troubleshooting](./troubleshooting)** - Common UI issues

---

**Build beautiful, accessible, and performant user interfaces!** 🎨 