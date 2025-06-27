---
sidebar_position: 9
---

# Points System

The Points Update module provides comprehensive type-safe CRUD operations and utility functions for managing points and progress tracking in the Nuclear application. This module handles points creation, updates, deletion, and advanced aggregation and analysis capabilities.

## Overview

The Points Update module is located in `lib/pointsUpdate.ts` and provides functions for:
- **CRUD Operations**: Create, read, update, and delete points updates
- **Block Associations**: Link points to specific content blocks
- **Aggregation Functions**: Calculate totals, averages, and progress metrics
- **Date Range Queries**: Filter points by time periods
- **Progress Tracking**: Monitor user advancement through content
- **Validation**: Input validation and existence checks

## API Reference

### Core CRUD Functions

#### `getPointsUpdateById(id: string): Promise<PointsUpdate | null>`
Get a points update by its unique ID.

```typescript
const pointsUpdate = await getPointsUpdateById('points-123');
if (pointsUpdate) {
  console.log(`Found points update: ${pointsUpdate.points} points`);
}
```

#### `getAllPointsUpdates(): Promise<PointsUpdate[]>`
Get all points updates in the system.

```typescript
const allPointsUpdates = await getAllPointsUpdates();
console.log(`Total points updates: ${allPointsUpdates.length}`);
```

#### `createPointsUpdate(data: CreatePointsUpdateData): Promise<PointsUpdate>`
Create a new points update with validated input data.

**Parameters:**
- `data.points` (required): Number of points earned
- `data.blockId` (optional): ID of the associated block
- `data.reason` (optional): Reason for earning points
- `data.userId` (optional): ID of the user who earned points

```typescript
const newPointsUpdate = await createPointsUpdate({
  points: 25,
  blockId: 'block-123',
  reason: 'Completed quiz successfully',
  userId: 'user-456'
});

console.log(`Created points update: ${newPointsUpdate.id}`);
```

#### `updatePointsUpdate(id: string, data: Partial<PointsUpdate>): Promise<PointsUpdate>`
Update an existing points update's information.

```typescript
const updatedPointsUpdate = await updatePointsUpdate('points-123', {
  points: 30,
  reason: 'Bonus points for perfect score'
});

console.log(`Updated points update: ${updatedPointsUpdate.points} points`);
```

#### `deletePointsUpdate(id: string): Promise<PointsUpdate>`
Delete a points update by its ID.

```typescript
const deletedPointsUpdate = await deletePointsUpdate('points-123');
console.log(`Deleted points update: ${deletedPointsUpdate.points} points`);
```

### Utility Functions

#### `pointsUpdateExists(id: string): Promise<boolean>`
Check if a points update exists by its ID.

```typescript
if (await pointsUpdateExists('points-123')) {
  console.log('Points update exists');
} else {
  console.log('Points update not found');
}
```

### Relationship Queries

#### `getPointsUpdateBlock(id: string): Promise<Block | null>`
Get the block associated with a points update.

```typescript
const block = await getPointsUpdateBlock('points-123');
if (block) {
  console.log(`Points update block: ${block.title}`);
}
```

#### `getPointsUpdatesByBlock(blockId: string): Promise<PointsUpdate[]>`
Get all points updates for a specific block.

```typescript
const blockPointsUpdates = await getPointsUpdatesByBlock('block-123');
console.log(`Block has ${blockPointsUpdates.length} points updates`);
```

### Advanced Functions

#### `getPointsUpdateWithRelations(id: string)`
Get a points update with all related data.

```typescript
const pointsUpdateWithRelations = await getPointsUpdateWithRelations('points-123');
console.log(`Points: ${pointsUpdateWithRelations.points}`);
console.log(`Block: ${pointsUpdateWithRelations.block?.title}`);
```

### Aggregation Functions

#### `getTotalPointsForBlock(blockId: string): Promise<number>`
Get the total points for a block.

```typescript
const totalPoints = await getTotalPointsForBlock('block-123');
console.log(`Total points for block: ${totalPoints}`);
```

#### `getPointsUpdatesByDateRange(startDate: Date, endDate: Date): Promise<PointsUpdate[]>`
Get all points updates in a date range.

```typescript
const startDate = new Date('2024-01-01');
const endDate = new Date('2024-01-31');
const monthlyPoints = await getPointsUpdatesByDateRange(startDate, endDate);
console.log(`Points updates in January: ${monthlyPoints.length}`);
```

#### `getPointsUpdatesByMinPoints(minPoints: number): Promise<PointsUpdate[]>`
Get all points updates with at least a certain number of points.

```typescript
const highValueUpdates = await getPointsUpdatesByMinPoints(50);
console.log(`Found ${highValueUpdates.length} updates with 50+ points`);
```

#### `getLatestPointsUpdateForBlock(blockId: string): Promise<PointsUpdate | null>`
Get the latest points update for a block.

```typescript
const latestUpdate = await getLatestPointsUpdateForBlock('block-123');
if (latestUpdate) {
  console.log(`Latest update: ${latestUpdate.points} points on ${latestUpdate.createdAt}`);
}
```

#### `getPointsUpdatesForBlockOrdered(blockId: string, order: 'asc' | 'desc'): Promise<PointsUpdate[]>`
Get all points updates for a block, ordered by date.

```typescript
const chronologicalUpdates = await getPointsUpdatesForBlockOrdered('block-123', 'asc');
console.log(`Chronological updates: ${chronologicalUpdates.length}`);
```

## Data Types

### PointsUpdate Model
```typescript
interface PointsUpdate {
  id: string;
  points: number;
  blockId?: string;
  reason?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### CreatePointsUpdateData
```typescript
interface CreatePointsUpdateData {
  points: number;
  blockId?: string;
  reason?: string;
  userId?: string;
}
```

## Error Handling

The Points Update module defines a custom error class for consistent error handling:

```typescript
class PointsUpdateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PointsUpdateError';
  }
}
```

### Common Error Scenarios

1. **Points Update Not Found**
```typescript
try {
  const pointsUpdate = await getPointsUpdateById('non-existent-id');
  if (!pointsUpdate) {
    throw new PointsUpdateError('Points update not found');
  }
} catch (error) {
  if (error instanceof PointsUpdateError) {
    console.error('Points update error:', error.message);
  }
}
```

2. **Invalid Points Value**
```typescript
try {
  const pointsUpdate = await createPointsUpdate({
    points: -10, // Negative points
    blockId: 'block-123'
  });
} catch (error) {
  if (error instanceof PointsUpdateError) {
    console.error('Points validation error:', error.message);
  }
}
```

3. **Invalid Block Association**
```typescript
try {
  const pointsUpdate = await createPointsUpdate({
    points: 25,
    blockId: 'non-existent-block'
  });
} catch (error) {
  if (error instanceof PointsUpdateError) {
    console.error('Block validation error:', error.message);
  }
}
```

## Usage Examples

### Complete Points Management Workflow

```typescript
async function managePoints() {
  try {
    // Create a new points update
    const newPointsUpdate = await createPointsUpdate({
      points: 50,
      blockId: 'block-123',
      reason: 'Completed advanced quiz with perfect score',
      userId: 'user-456'
    });

    // Update points information
    const updatedPointsUpdate = await updatePointsUpdate(newPointsUpdate.id, {
      points: 75,
      reason: 'Bonus points for perfect score and time bonus'
    });

    // Get points update relationships
    const block = await getPointsUpdateBlock(updatedPointsUpdate.id);

    console.log(`Points: ${updatedPointsUpdate.points}`);
    console.log(`Block: ${block?.title}, Reason: ${updatedPointsUpdate.reason}`);
    console.log(`User: ${updatedPointsUpdate.userId}`);

    // Check if points update exists before operations
    if (await pointsUpdateExists(updatedPointsUpdate.id)) {
      const pointsUpdate = await getPointsUpdateById(updatedPointsUpdate.id);
      console.log(`Points update created: ${pointsUpdate?.createdAt}`);
    }

  } catch (error) {
    if (error instanceof PointsUpdateError) {
      console.error('Points management error:', error.message);
    }
  }
}
```

### Progress Tracking System

```typescript
async function trackUserProgress(userId: string) {
  try {
    // Get all points updates for the user
    const allPointsUpdates = await getAllPointsUpdates();
    const userPointsUpdates = allPointsUpdates.filter(update => update.userId === userId);

    // Calculate progress metrics
    const progress = {
      totalPoints: userPointsUpdates.reduce((sum, update) => sum + update.points, 0),
      totalUpdates: userPointsUpdates.length,
      averagePoints: 0,
      recentActivity: 0,
      blocksCompleted: new Set()
    };

    // Calculate averages and recent activity
    if (userPointsUpdates.length > 0) {
      progress.averagePoints = progress.totalPoints / userPointsUpdates.length;
    }

    // Get recent activity (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentUpdates = userPointsUpdates.filter(update => 
      update.createdAt >= oneWeekAgo
    );
    progress.recentActivity = recentUpdates.reduce((sum, update) => sum + update.points, 0);

    // Count unique blocks
    userPointsUpdates.forEach(update => {
      if (update.blockId) {
        progress.blocksCompleted.add(update.blockId);
      }
    });

    console.log('User Progress Report:', {
      ...progress,
      blocksCompleted: progress.blocksCompleted.size
    });

    return progress;

  } catch (error) {
    if (error instanceof PointsUpdateError) {
      console.error('Progress tracking error:', error.message);
    }
    throw error;
  }
}
```

### Block Performance Analysis

```typescript
async function analyzeBlockPerformance(blockId: string) {
  try {
    // Get all points updates for the block
    const blockPointsUpdates = await getPointsUpdatesByBlock(blockId);
    
    // Calculate performance metrics
    const analysis = {
      totalPoints: blockPointsUpdates.reduce((sum, update) => sum + update.points, 0),
      totalUpdates: blockPointsUpdates.length,
      averagePoints: 0,
      highestPoints: 0,
      lowestPoints: Infinity,
      recentActivity: 0,
      uniqueUsers: new Set()
    };

    // Calculate statistics
    if (blockPointsUpdates.length > 0) {
      analysis.averagePoints = analysis.totalPoints / blockPointsUpdates.length;
      analysis.highestPoints = Math.max(...blockPointsUpdates.map(u => u.points));
      analysis.lowestPoints = Math.min(...blockPointsUpdates.map(u => u.points));
    }

    // Get recent activity (last 30 days)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const recentUpdates = blockPointsUpdates.filter(update => 
      update.createdAt >= oneMonthAgo
    );
    analysis.recentActivity = recentUpdates.reduce((sum, update) => sum + update.points, 0);

    // Count unique users
    blockPointsUpdates.forEach(update => {
      if (update.userId) {
        analysis.uniqueUsers.add(update.userId);
      }
    });

    console.log('Block Performance Analysis:', {
      ...analysis,
      uniqueUsers: analysis.uniqueUsers.size
    });

    // Get latest activity
    const latestUpdate = await getLatestPointsUpdateForBlock(blockId);
    if (latestUpdate) {
      console.log(`Latest activity: ${latestUpdate.points} points on ${latestUpdate.createdAt}`);
    }

    return analysis;

  } catch (error) {
    if (error instanceof PointsUpdateError) {
      console.error('Performance analysis error:', error.message);
    }
    throw error;
  }
}
```

### Time-Based Analytics

```typescript
async function timeBasedAnalytics() {
  try {
    // Get points updates for different time periods
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const [weeklyUpdates, monthlyUpdates, quarterlyUpdates] = await Promise.all([
      getPointsUpdatesByDateRange(oneWeekAgo, now),
      getPointsUpdatesByDateRange(oneMonthAgo, now),
      getPointsUpdatesByDateRange(threeMonthsAgo, now)
    ]);

    // Calculate totals for each period
    const analytics = {
      weekly: {
        totalPoints: weeklyUpdates.reduce((sum, update) => sum + update.points, 0),
        totalUpdates: weeklyUpdates.length
      },
      monthly: {
        totalPoints: monthlyUpdates.reduce((sum, update) => sum + update.points, 0),
        totalUpdates: monthlyUpdates.length
      },
      quarterly: {
        totalPoints: quarterlyUpdates.reduce((sum, update) => sum + update.points, 0),
        totalUpdates: quarterlyUpdates.length
      }
    };

    console.log('Time-Based Analytics:', analytics);

    // Find high-value updates
    const highValueUpdates = await getPointsUpdatesByMinPoints(100);
    console.log(`High-value updates (100+ points): ${highValueUpdates.length}`);

    // Analyze trends
    const weeklyAverage = analytics.weekly.totalPoints / 7;
    const monthlyAverage = analytics.monthly.totalPoints / 30;
    
    console.log(`Daily average (week): ${weeklyAverage.toFixed(2)} points`);
    console.log(`Daily average (month): ${monthlyAverage.toFixed(2)} points`);

    return analytics;

  } catch (error) {
    if (error instanceof PointsUpdateError) {
      console.error('Time-based analytics error:', error.message);
    }
    throw error;
  }
}
```

### Gamification System

```typescript
async function gamificationSystem() {
  try {
    // Get all points updates
    const allPointsUpdates = await getAllPointsUpdates();
    
    // Calculate leaderboard
    const userScores = {};
    allPointsUpdates.forEach(update => {
      if (update.userId) {
        userScores[update.userId] = (userScores[update.userId] || 0) + update.points;
      }
    });

    // Sort users by total points
    const leaderboard = Object.entries(userScores)
      .map(([userId, points]) => ({ userId, points }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);

    console.log('Top 10 Leaderboard:');
    leaderboard.forEach((entry, index) => {
      console.log(`${index + 1}. User ${entry.userId}: ${entry.points} points`);
    });

    // Award achievements
    const achievements = [];
    for (const [userId, totalPoints] of Object.entries(userScores)) {
      if (totalPoints >= 1000) {
        achievements.push({ userId, achievement: 'Master Learner', points: totalPoints });
      } else if (totalPoints >= 500) {
        achievements.push({ userId, achievement: 'Advanced Learner', points: totalPoints });
      } else if (totalPoints >= 100) {
        achievements.push({ userId, achievement: 'Beginner Learner', points: totalPoints });
      }
    }

    console.log('Achievements Awarded:', achievements);

    // Create bonus points for achievements
    for (const achievement of achievements) {
      const bonusPoints = achievement.points >= 1000 ? 100 : achievement.points >= 500 ? 50 : 25;
      
      await createPointsUpdate({
        points: bonusPoints,
        reason: `Achievement bonus: ${achievement.achievement}`,
        userId: achievement.userId
      });
      
      console.log(`Awarded ${bonusPoints} bonus points to user ${achievement.userId}`);
    }

  } catch (error) {
    if (error instanceof PointsUpdateError) {
      console.error('Gamification system error:', error.message);
    }
  }
}
```

## Best Practices

### 1. Validate Points Values
```typescript
// ✅ Good - Validate points are positive
if (data.points < 0) {
  throw new PointsUpdateError('Points cannot be negative');
}

if (data.points > 10000) {
  throw new PointsUpdateError('Points value too high');
}

// ✅ Good - Validate points are integers
if (!Number.isInteger(data.points)) {
  throw new PointsUpdateError('Points must be a whole number');
}
```

### 2. Handle Relationships Properly
```typescript
// ✅ Good - Check block exists before creating points update
if (blockId && !await blockExists(blockId)) {
  throw new PointsUpdateError('Block does not exist');
}

// ✅ Good - Check user exists before creating points update
if (userId && !await userExists(userId)) {
  throw new PointsUpdateError('User does not exist');
}
```

### 3. Use Efficient Queries
```typescript
// ✅ Good - Use Promise.all for parallel queries
const [block, totalPoints] = await Promise.all([
  getPointsUpdateBlock(pointsUpdateId),
  getTotalPointsForBlock(blockId)
]);

// ❌ Avoid - Sequential queries
const block = await getPointsUpdateBlock(pointsUpdateId);
const totalPoints = await getTotalPointsForBlock(blockId);
```

### 4. Implement Points Validation
```typescript
// ✅ Good - Validate points update completeness
async function validatePointsUpdate(pointsUpdateId: string) {
  const pointsUpdate = await getPointsUpdateById(pointsUpdateId);
  if (!pointsUpdate) {
    throw new PointsUpdateError('Points update not found');
  }

  if (pointsUpdate.points < 0) {
    throw new PointsUpdateError('Points cannot be negative');
  }

  if (!pointsUpdate.reason) {
    throw new PointsUpdateError('Points update must have a reason');
  }

  return true;
}
```

## Performance Considerations

- **Indexing**: Ensure blockId and userId fields are indexed
- **Date Indexing**: Index createdAt field for date range queries
- **Batch Operations**: Use `getAllPointsUpdates()` for bulk operations
- **Caching**: Consider caching aggregated points data
- **Pagination**: For large points lists, implement pagination

## Related Modules

- **[Block Management](./block)** - Associate points with content blocks
- **[User Management](./user)** - Track user points and progress
- **[Quiz System](./quiz)** - Award points for quiz completion
- **[Fill-in-the-Blank](./fill-in-the-blank)** - Award points for correct answers

---

This completes the comprehensive documentation for all Prisma abstraction modules. Each module provides type-safe, efficient, and well-documented functions for managing your Nuclear application's data layer. 