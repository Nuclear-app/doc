---
sidebar_position: 2
---

# Development Setup

Complete guide to setting up your development environment for the Nuclear application.

## 📋 Prerequisites

Before you begin, ensure you have the following tools installed on your system:

### Required Tools

#### **Bun** - JavaScript Runtime & Package Manager
Bun is our primary JavaScript runtime and package manager. It's faster than npm and provides excellent TypeScript support.

```bash
# Install Bun (macOS/Linux)
curl -fsSL https://bun.sh/install | bash

# Install Bun (Windows)
# Download from https://bun.sh/docs/installation

# Verify installation
bun --version
```

#### **Node.js** - For Tooling Compatibility
Some development tools still require Node.js for compatibility.

```bash
# Install Node.js (recommended: use nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version
```


**Option 2: Supabase (Recommended)**
- Sign up at [supabase.com](https://supabase.com)
- Create a new project
- Use the provided database URL

#### **Git** - Version Control
```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt install git

# Windows
# Download from https://git-scm.com/download/win

# Verify installation
git --version
```

### Optional Tools

#### **VS Code** - Recommended Editor
```bash
# macOS
brew install --cask visual-studio-code

# Ubuntu/Debian
sudo snap install code --classic

# Windows
# Download from https://code.visualstudio.com/
```

**Recommended VS Code Extensions:**
- TypeScript and JavaScript Language Features
- Prisma (Prisma.io)
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- GitLens

#### **Docker** - Containerization (Optional)
```bash
# macOS
brew install --cask docker

# Ubuntu/Debian
sudo apt install docker.io
sudo systemctl start docker
sudo usermod -aG docker $USER

# Windows
# Download from https://www.docker.com/products/docker-desktop
```

## 🚀 Project Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd app

# Verify you're in the correct directory
ls -la
# Should see: package.json, prisma/, app/, etc.
```

### 2. Install Dependencies

```bash
# Install all dependencies using Bun
bun install

# Verify installation
bun --version
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit the environment file with your settings
code .env  # or use your preferred editor
```

**Required Environment Variables:**

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/nuclear_db"
DIRECT_URL="postgresql://username:password@localhost:5432/nuclear_db"

# For Supabase users:
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Authentication (if using NextAuth)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# External Services (if using)
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 4. Database Setup

```bash
# Generate Prisma client
bunx prisma generate

# Run database migrations
bunx prisma migrate dev

# (Optional) Seed the database with initial data
bunx prisma db seed
```

### 5. Verify Setup

```bash
# Start the development server
bun coolDev  # Linux/Mac
# or
bun winDev   # Windows

# The application should now be running at http://localhost:3000
```

## 🔧 Development Scripts

### Available Commands

| Command | Description | Platform |
|---------|-------------|----------|
| `bun coolDev` | Start development server (Linux/Mac) | Linux/Mac |
| `bun winDev` | Start development server (Windows) | Windows |
| `bun run build` | Build for production | All |
| `bun start` | Start production server | All |
| `bunx prisma generate` | Regenerate Prisma client | All |
| `bunx prisma migrate dev` | Run database migrations | All |
| `bunx prisma studio` | Open database GUI | All |

### Script Details

#### Development Server
```bash
# Linux/Mac
bun coolDev

# Windows
bun winDev
```

These commands:
- Start the Next.js development server
- Enable hot reloading
- Run TypeScript compilation
- Display compilation errors
- Serve the app at `http://localhost:3000`

#### Database Operations
```bash
# Generate Prisma client (required after schema changes)
bunx prisma generate

# Run migrations
bunx prisma migrate dev

# Open Prisma Studio (database GUI)
bunx prisma studio

# Reset database (⚠️ destructive - deletes all data)
bunx prisma migrate reset
```

## 🛠️ IDE Configuration

### VS Code Settings

Create `.vscode/settings.json` in your project root:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "prisma.format.enable": true
}
```

### TypeScript Configuration

The project includes a `tsconfig.json` with optimized settings for:
- Strict type checking
- Modern JavaScript features
- Path mapping for clean imports
- Next.js compatibility

## 🔍 Troubleshooting

### Common Setup Issues

#### Bun Installation Problems
```bash
# If Bun installation fails
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc  # or restart terminal

# Verify installation
bun --version
```

#### Database Connection Issues
```bash
# Test database connection
bunx prisma db pull

# If connection fails, check:
# 1. Database is running
# 2. DATABASE_URL is correct
# 3. Firewall settings
# 4. Database credentials
```

#### Prisma Client Issues
```bash
# Clear Prisma cache and regenerate
rm -rf node_modules/.prisma
bunx prisma generate

# If still having issues
bun install
bunx prisma generate
```

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Getting Help

If you encounter issues during setup:

1. **Check the logs** - Look for error messages in the terminal
2. **Verify prerequisites** - Ensure all required tools are installed
3. **Check environment variables** - Verify your `.env` file is correct
4. **Search issues** - Check [GitHub Issues](https://github.com/nuclear-app/doc/issues)
5. **Ask for help** - Create a new issue with detailed error information

## ✅ Setup Verification

After completing the setup, verify everything is working:

1. **Development server starts** - `bun coolDev` runs without errors
2. **Database connection** - `bunx prisma studio` opens successfully
3. **TypeScript compilation** - No type errors in the terminal
4. **Application loads** - Visit `http://localhost:3000` in your browser
5. **Hot reloading works** - Make a change to a file and see it update

## 🎉 Next Steps

Congratulations! Your development environment is now set up. Next, explore:

- **[Project Structure](./project-structure)** - Understand the codebase organization
- **[Development Workflow](./workflow)** - Learn about daily development practices
- **[Database & Prisma](./database)** - Deep dive into database operations

---

**Ready to start coding!** 🚀 