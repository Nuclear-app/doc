---
sidebar_position: 4
---

# Folder Organization

The Folder module provides comprehensive type-safe CRUD operations and utility functions for managing hierarchical folder structures in the Nuclear application. This module handles folder creation, updates, deletion, and complex parent-child relationship queries.

## Overview

The Folder module is located in `lib/folder.ts` and provides functions for:
- **CRUD Operations**: Create, read, update, and delete folders
- **Hierarchical Management**: Handle parent-child folder relationships
- **Content Organization**: Manage blocks within folders
- **User Ownership**: Track folder ownership and permissions
- **Validation**: Input validation and existence checks

## API Reference

### Core CRUD Functions

#### `getFolderById(id: string): Promise<Folder | null>`
Get a folder by its unique ID.

```typescript
const folder = await getFolderById('folder-123');
if (folder) {
  console.log(`Found folder: ${folder.name}`);
}
```

#### `getAllFolders(): Promise<Folder[]>`
Get all folders in the system.

```typescript
const allFolders = await getAllFolders();
console.log(`Total folders: ${allFolders.length}`);
```

#### `createFolder(data: CreateFolderData): Promise<Folder>`
Create a new folder with validated input data.

**Parameters:**
- `data.name` (required): Folder name
- `data.authorId` (required): ID of the folder owner
- `data.parentId` (optional): ID of the parent folder
- `data.description` (optional): Folder description

```typescript
const newFolder = await createFolder({
  name: 'Nuclear Physics Course',
  authorId: 'user-123',
  parentId: 'folder-456',
  description: 'Complete course on nuclear physics'
});

console.log(`Created folder: ${newFolder.id}`);
```

#### `updateFolder(id: string, data: Partial<Folder>): Promise<Folder>`
Update an existing folder's information.

```typescript
const updatedFolder = await updateFolder('folder-123', {
  name: 'Advanced Nuclear Physics Course',
  description: 'Updated course description'
});

console.log(`Updated folder: ${updatedFolder.name}`);
```

#### `deleteFolder(id: string): Promise<Folder>`
Delete a folder by its ID.

```typescript
const deletedFolder = await deleteFolder('folder-123');
console.log(`Deleted folder: ${deletedFolder.name}`);
```

### Utility Functions

#### `folderExists(id: string): Promise<boolean>`
Check if a folder exists by its ID.

```typescript
if (await folderExists('folder-123')) {
  console.log('Folder exists');
} else {
  console.log('Folder not found');
}
```

### Relationship Queries

#### `getFolderBlocks(id: string): Promise<Block[]>`
Get all blocks contained in a folder.

```typescript
const folderBlocks = await getFolderBlocks('folder-123');
console.log(`Folder contains ${folderBlocks.length} blocks`);
```

#### `getFolderAuthor(id: string): Promise<User | null>`
Get the author/owner of a folder.

```typescript
const author = await getFolderAuthor('folder-123');
if (author) {
  console.log(`Folder author: ${author.name}`);
}
```

#### `getFolderParent(id: string): Promise<Folder | null>`
Get the parent folder of a folder.

```typescript
const parent = await getFolderParent('folder-123');
if (parent) {
  console.log(`Parent folder: ${parent.name}`);
}
```

#### `getFolderChildren(id: string): Promise<Folder[]>`
Get all child folders of a folder.

```typescript
const children = await getFolderChildren('folder-123');
console.log(`Folder has ${children.length} child folders`);
```

## Data Types

### Folder Model
```typescript
interface Folder {
  id: string;
  name: string;
  description?: string;
  authorId: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### CreateFolderData
```typescript
interface CreateFolderData {
  name: string;
  authorId: string;
  parentId?: string;
  description?: string;
}
```

## Error Handling

The Folder module defines a custom error class for consistent error handling:

```typescript
class FolderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FolderError';
  }
}
```

### Common Error Scenarios

1. **Folder Not Found**
```typescript
try {
  const folder = await getFolderById('non-existent-id');
  if (!folder) {
    throw new FolderError('Folder not found');
  }
} catch (error) {
  if (error instanceof FolderError) {
    console.error('Folder error:', error.message);
  }
}
```

2. **Invalid Parent Folder**
```typescript
try {
  const folder = await createFolder({
    name: 'Test Folder',
    authorId: 'user-123',
    parentId: 'non-existent-parent'
  });
} catch (error) {
  if (error instanceof FolderError) {
    console.error('Parent folder error:', error.message);
  }
}
```

3. **Circular Reference**
```typescript
try {
  // Attempting to set a child as its own parent
  await updateFolder('folder-123', {
    parentId: 'folder-123'
  });
} catch (error) {
  if (error instanceof FolderError) {
    console.error('Circular reference error:', error.message);
  }
}
```

## Usage Examples

### Complete Folder Management Workflow

```typescript
async function manageFolder() {
  try {
    // Create a root folder
    const rootFolder = await createFolder({
      name: 'Nuclear Physics',
      authorId: 'user-123',
      description: 'Main course folder'
    });

    // Create a subfolder
    const subFolder = await createFolder({
      name: 'Basic Concepts',
      authorId: 'user-123',
      parentId: rootFolder.id,
      description: 'Introduction to nuclear physics'
    });

    // Update folder information
    const updatedFolder = await updateFolder(subFolder.id, {
      name: 'Fundamental Concepts',
      description: 'Updated description for fundamental concepts'
    });

    // Get folder relationships
    const author = await getFolderAuthor(updatedFolder.id);
    const parent = await getFolderParent(updatedFolder.id);
    const children = await getFolderChildren(updatedFolder.id);
    const blocks = await getFolderBlocks(updatedFolder.id);

    console.log(`Folder "${updatedFolder.name}" by ${author?.name}`);
    console.log(`Parent: ${parent?.name}, Children: ${children.length}, Blocks: ${blocks.length}`);

    // Check if folder exists before operations
    if (await folderExists(updatedFolder.id)) {
      const folder = await getFolderById(updatedFolder.id);
      console.log(`Folder created: ${folder?.createdAt}`);
    }

  } catch (error) {
    if (error instanceof FolderError) {
      console.error('Folder management error:', error.message);
    }
  }
}
```

### Hierarchical Folder Structure

```typescript
async function createHierarchicalStructure() {
  try {
    // Create main course folder
    const courseFolder = await createFolder({
      name: 'Nuclear Physics Course',
      authorId: 'user-123',
      description: 'Complete nuclear physics curriculum'
    });

    // Create module folders
    const modules = [
      { name: 'Module 1: Introduction', description: 'Basic concepts and history' },
      { name: 'Module 2: Atomic Structure', description: 'Understanding atomic nuclei' },
      { name: 'Module 3: Nuclear Reactions', description: 'Fusion and fission processes' },
      { name: 'Module 4: Applications', description: 'Real-world applications' }
    ];

    const moduleFolders = [];
    for (const module of modules) {
      const folder = await createFolder({
        name: module.name,
        authorId: 'user-123',
        parentId: courseFolder.id,
        description: module.description
      });
      moduleFolders.push(folder);
    }

    // Create sub-modules for each module
    for (const moduleFolder of moduleFolders) {
      const subModules = [
        { name: 'Theory', description: 'Theoretical foundations' },
        { name: 'Practice', description: 'Practical exercises' },
        { name: 'Assessment', description: 'Quizzes and tests' }
      ];

      for (const subModule of subModules) {
        await createFolder({
          name: subModule.name,
          authorId: 'user-123',
          parentId: moduleFolder.id,
          description: subModule.description
        });
      }
    }

    console.log(`Created hierarchical structure with ${moduleFolders.length} main modules`);

  } catch (error) {
    if (error instanceof FolderError) {
      console.error('Hierarchy creation error:', error.message);
    }
  }
}
```

### Folder Navigation and Analysis

```typescript
async function analyzeFolderStructure(folderId: string) {
  try {
    const folder = await getFolderById(folderId);
    if (!folder) {
      throw new FolderError('Folder not found');
    }

    // Get all related data
    const [author, parent, children, blocks] = await Promise.all([
      getFolderAuthor(folderId),
      getFolderParent(folderId),
      getFolderChildren(folderId),
      getFolderBlocks(folderId)
    ]);

    // Analyze structure
    const analysis = {
      folder: {
        id: folder.id,
        name: folder.name,
        description: folder.description,
        createdAt: folder.createdAt
      },
      relationships: {
        author: author?.name,
        parent: parent?.name,
        childrenCount: children.length,
        blocksCount: blocks.length
      },
      children: children.map(child => ({
        id: child.id,
        name: child.name,
        description: child.description
      })),
      blocks: blocks.map(block => ({
        id: block.id,
        title: block.title,
        published: block.published
      }))
    };

    console.log('Folder Analysis:', analysis);
    return analysis;

  } catch (error) {
    if (error instanceof FolderError) {
      console.error('Analysis error:', error.message);
    }
    throw error;
  }
}
```

### Bulk Folder Operations

```typescript
async function bulkFolderOperations() {
  try {
    // Get all folders
    const allFolders = await getAllFolders();
    
    // Analyze folder hierarchy
    const rootFolders = allFolders.filter(folder => !folder.parentId);
    const subFolders = allFolders.filter(folder => folder.parentId);
    
    console.log(`Total folders: ${allFolders.length}`);
    console.log(`Root folders: ${rootFolders.length}`);
    console.log(`Sub-folders: ${subFolders.length}`);

    // Analyze each root folder
    for (const rootFolder of rootFolders) {
      const children = await getFolderChildren(rootFolder.id);
      const blocks = await getFolderBlocks(rootFolder.id);
      
      console.log(`${rootFolder.name}: ${children.length} children, ${blocks.length} blocks`);
    }

    // Get folders by author
    const authorId = 'user-123';
    const authorFolders = allFolders.filter(folder => folder.authorId === authorId);
    console.log(`Author ${authorId} has ${authorFolders.length} folders`);

  } catch (error) {
    if (error instanceof FolderError) {
      console.error('Bulk operation error:', error.message);
    }
  }
}
```

### Folder Reorganization

```typescript
async function reorganizeFolders() {
  try {
    // Get all folders
    const allFolders = await getAllFolders();
    
    // Find folders that need reorganization
    const orphanedFolders = allFolders.filter(folder => 
      folder.parentId && !allFolders.find(f => f.id === folder.parentId)
    );

    console.log(`Found ${orphanedFolders.length} orphaned folders`);

    // Move orphaned folders to root level
    for (const orphanedFolder of orphanedFolders) {
      await updateFolder(orphanedFolder.id, {
        parentId: undefined
      });
      console.log(`Moved "${orphanedFolder.name}" to root level`);
    }

    // Consolidate empty folders
    for (const folder of allFolders) {
      const [children, blocks] = await Promise.all([
        getFolderChildren(folder.id),
        getFolderBlocks(folder.id)
      ]);

      if (children.length === 0 && blocks.length === 0) {
        console.log(`Empty folder found: ${folder.name}`);
        // Optionally delete empty folders
        // await deleteFolder(folder.id);
      }
    }

  } catch (error) {
    if (error instanceof FolderError) {
      console.error('Reorganization error:', error.message);
    }
  }
}
```

## Best Practices

### 1. Validate Folder Names
```typescript
// ✅ Good - Validate folder name quality
if (!data.name.trim()) {
  throw new FolderError('Folder name cannot be empty');
}

if (data.name.length > 100) {
  throw new FolderError('Folder name too long');
}
```

### 2. Handle Parent-Child Relationships
```typescript
// ✅ Good - Check parent exists before creating child
if (parentId && !await folderExists(parentId)) {
  throw new FolderError('Parent folder does not exist');
}

// ✅ Good - Prevent circular references
async function validateParentChild(parentId: string, childId: string) {
  if (parentId === childId) {
    throw new FolderError('Folder cannot be its own parent');
  }
  
  // Check if child is ancestor of parent
  let current = parentId;
  while (current) {
    const parent = await getFolderById(current);
    if (parent?.parentId === childId) {
      throw new FolderError('Circular reference detected');
    }
    current = parent?.parentId;
  }
}
```

### 3. Use Efficient Queries
```typescript
// ✅ Good - Use Promise.all for parallel queries
const [author, parent, children, blocks] = await Promise.all([
  getFolderAuthor(folderId),
  getFolderParent(folderId),
  getFolderChildren(folderId),
  getFolderBlocks(folderId)
]);

// ❌ Avoid - Sequential queries
const author = await getFolderAuthor(folderId);
const parent = await getFolderParent(folderId);
const children = await getFolderChildren(folderId);
const blocks = await getFolderBlocks(folderId);
```

### 4. Implement Folder Validation
```typescript
// ✅ Good - Validate folder structure
async function validateFolderStructure(folderId: string) {
  const folder = await getFolderById(folderId);
  if (!folder) {
    throw new FolderError('Folder not found');
  }

  // Check for circular references
  if (folder.parentId) {
    await validateParentChild(folder.parentId, folderId);
  }

  return true;
}
```

## Performance Considerations

- **Indexing**: Ensure authorId and parentId fields are indexed
- **Batch Operations**: Use `getAllFolders()` for bulk operations
- **Caching**: Consider caching folder hierarchy data
- **Pagination**: For large folder lists, implement pagination
- **Lazy Loading**: Load child folders only when needed

## Related Modules

- **[User Management](./user)** - Manage folder owners
- **[Block Management](./block)** - Organize blocks in folders
- **[Quiz System](./quiz)** - Create quiz folders
- **[Topic Management](./topic)** - Organize topics in folders

---

Next: [Quiz System](./quiz) - Learn how to create and manage quizzes with topic associations. 