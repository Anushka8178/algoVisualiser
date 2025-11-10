# Performance Testing Guide - Algorithm Visualizer

## 1. Visualization Rendering Performance Testing

### Objective
Verify that visualization rendering delay ≤ 100ms per step (as per SRS requirement).

### Method 1: Browser DevTools Performance Profiler

#### Steps:
1. Open Chrome DevTools (F12)
2. Go to **Performance** tab
3. Click **Record** (or press Ctrl+E)
4. Run a visualization (e.g., Bubble Sort)
5. Let it play for a few steps
6. Stop recording
7. Analyze the timeline

#### What to Look For:
- **Frame rate**: Should be ≥ 60 FPS (16.67ms per frame)
- **Rendering time**: Check `useEffect` execution time in visualization components
- **D3.js operations**: Time spent in `svg.selectAll()`, `attr()`, `append()` calls

#### Expected Results:
- Each step should complete rendering in ≤ 100ms
- No frame drops during animation
- Smooth transitions between steps

### Method 2: Custom Performance Measurement

Add performance markers to visualization components:

```javascript
// In visualization component (e.g., BubbleSortViz.jsx)
useEffect(() => {
  if (!array.length || !svgRef.current) return;

  const startTime = performance.now(); // Start measurement

  const svg = d3.select(svgRef.current);
  svg.selectAll("*").remove();
  
  // ... rendering code ...

  const endTime = performance.now(); // End measurement
  const renderTime = endTime - startTime;
  
  if (renderTime > 100) {
    console.warn(`Rendering took ${renderTime}ms (exceeds 100ms threshold)`);
  } else {
    console.log(`Rendering took ${renderTime}ms ✓`);
  }
}, [index, array, actions]);
```

### Method 3: Automated Performance Testing Script

Create a test script to measure rendering performance:

```javascript
// performance-test.js
// Run this in browser console while on a visualization page

async function testRenderingPerformance(iterations = 100) {
  const results = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    
    // Trigger a step forward
    // (You'll need to access the component's stepForward function)
    await new Promise(resolve => {
      setTimeout(() => {
        const end = performance.now();
        results.push(end - start);
        resolve();
      }, 0);
    });
  }
  
  const avg = results.reduce((a, b) => a + b, 0) / results.length;
  const max = Math.max(...results);
  const min = Math.min(...results);
  
  console.log('Performance Test Results:');
  console.log(`Average: ${avg.toFixed(2)}ms`);
  console.log(`Max: ${max.toFixed(2)}ms`);
  console.log(`Min: ${min.toFixed(2)}ms`);
  console.log(`Passed (≤100ms): ${max <= 100 ? '✅' : '❌'}`);
  
  return { avg, max, min, passed: max <= 100 };
}
```

## 2. Concurrent User Load Testing

### Objective
Verify support for at least 500 concurrent users.

### Tools:

#### Option 1: Apache JMeter
1. Download Apache JMeter
2. Create a test plan:
   - Thread Group: 500 users
   - HTTP Request: Login endpoint
   - HTTP Request: Fetch algorithms
   - HTTP Request: Fetch leaderboard
3. Run test and monitor:
   - Response times
   - Error rates
   - Throughput

#### Option 2: Artillery.io (Node.js)
```bash
npm install -g artillery
```

Create `load-test.yml`:
```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 500
      name: "Sustained load"
scenarios:
  - name: "User Flow"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password"
      - get:
          url: "/api/algorithms"
      - get:
          url: "/api/leaderboard"
```

Run:
```bash
artillery run load-test.yml
```

#### Option 3: k6 (Modern Load Testing)
```bash
# Install k6
# Windows: choco install k6
# Mac: brew install k6
# Linux: https://k6.io/docs/getting-started/installation/

# Create test script: load-test.js
```

```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 100 },  // Ramp up
    { duration: '3m', target: 500 }, // Stay at 500 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
};

export default function () {
  const baseUrl = 'http://localhost:5000';
  
  // Test login
  const loginRes = http.post(`${baseUrl}/api/auth/login`, JSON.stringify({
    email: 'test@example.com',
    password: 'password'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'login response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  // Test algorithms endpoint
  const algoRes = http.get(`${baseUrl}/api/algorithms`);
  check(algoRes, {
    'algorithms status 200': (r) => r.status === 200,
    'algorithms response time < 200ms': (r) => r.timings.duration < 200,
  });
  
  // Test leaderboard
  const leaderboardRes = http.get(`${baseUrl}/api/leaderboard`);
  check(leaderboardRes, {
    'leaderboard status 200': (r) => r.status === 200,
    'leaderboard response time < 300ms': (r) => r.timings.duration < 300,
  });
}
```

Run:
```bash
k6 run load-test.js
```

## 3. Database Performance Testing

### Test Query Performance

```sql
-- Test algorithm fetching
EXPLAIN ANALYZE SELECT * FROM "Algorithms";

-- Test leaderboard query
EXPLAIN ANALYZE 
SELECT u.id, u.username, u.streak, u."totalEngagement"
FROM "Users" u
ORDER BY u.streak DESC, u."totalEngagement" DESC
LIMIT 100;

-- Test user progress history
EXPLAIN ANALYZE
SELECT * FROM "UserProgresses"
WHERE "userId" = 1
ORDER BY "completedAt" DESC
LIMIT 50;
```

### Add Indexes if Needed

```sql
-- Index for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_users_streak_engagement 
ON "Users" (streak DESC, "totalEngagement" DESC);

-- Index for user progress queries
CREATE INDEX IF NOT EXISTS idx_userprogress_userid_date 
ON "UserProgresses" ("userId", "completedAt" DESC);
```

## 4. Frontend Bundle Size Testing

### Check Bundle Size

```bash
# Build the app
npm run build

# Analyze bundle
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

### Optimize if Needed:
- Code splitting
- Lazy loading of visualization components
- Tree shaking unused code

## 5. Memory Leak Testing

### Chrome DevTools Memory Profiler

1. Open DevTools → **Memory** tab
2. Take **Heap Snapshot** before visualization
3. Run visualization for 100+ steps
4. Take another **Heap Snapshot**
5. Compare snapshots
6. Look for:
   - Increasing DOM nodes
   - Event listeners not cleaned up
   - D3.js selections not removed

### Common Issues to Check:
- `useEffect` cleanup functions
- Event listeners in visualization components
- D3.js selections properly removed

## 6. Network Performance Testing

### Test API Response Times

```javascript
// api-performance-test.js
const endpoints = [
  '/api/algorithms',
  '/api/leaderboard',
  '/api/progress/stats',
  '/api/progress/history',
];

async function testEndpoint(url) {
  const start = performance.now();
  try {
    const response = await fetch(`http://localhost:5000${url}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add your token
      }
    });
    const data = await response.json();
    const end = performance.now();
    return {
      url,
      status: response.status,
      time: end - start,
      size: JSON.stringify(data).length
    };
  } catch (error) {
    return { url, error: error.message };
  }
}

async function runTests() {
  const results = await Promise.all(endpoints.map(testEndpoint));
  console.table(results);
}
```

## 7. Performance Optimization Checklist

### If Rendering > 100ms:

1. **Optimize D3.js operations:**
   ```javascript
   // Use data joins efficiently
   const update = svg.selectAll("rect").data(arr);
   update.enter().append("rect").merge(update);
   update.exit().remove();
   ```

2. **Debounce/throttle rapid updates:**
   ```javascript
   import { useMemo } from 'react';
   const memoizedActions = useMemo(() => actions, [actions]);
   ```

3. **Use React.memo for components:**
   ```javascript
   export default React.memo(BubbleSortViz);
   ```

4. **Reduce DOM operations:**
   - Batch DOM updates
   - Use CSS transforms instead of position changes
   - Minimize reflows/repaints

### If Load Test Fails:

1. **Database optimization:**
   - Add indexes
   - Use connection pooling
   - Cache frequently accessed data

2. **API optimization:**
   - Implement response caching
   - Use pagination for large datasets
   - Compress responses (gzip)

3. **Server optimization:**
   - Enable clustering (PM2)
   - Use CDN for static assets
   - Implement rate limiting

## 8. Continuous Performance Monitoring

### Add Performance Monitoring

```javascript
// utils/performance.js
export function measurePerformance(name, fn) {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    const duration = end - start;
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production' && duration > 100) {
      // Send to monitoring service (e.g., Sentry, DataDog)
    }
    
    return result;
  };
}
```

## 9. Performance Testing Report Template

After running tests, document results:

```
Performance Test Report
Date: [Date]
Environment: [Development/Staging/Production]

1. Rendering Performance:
   - Average: X ms
   - Max: Y ms
   - Status: ✅/❌ (≤100ms requirement)

2. Load Testing (500 concurrent users):
   - Response Time (p95): X ms
   - Error Rate: Y%
   - Throughput: Z req/s
   - Status: ✅/❌

3. Database Performance:
   - Query Time: X ms
   - Status: ✅/❌

4. Recommendations:
   - [List any optimizations needed]
```

## Quick Start Commands

```bash
# 1. Install load testing tools
npm install -g artillery k6

# 2. Run load test
artillery run load-test.yml
# OR
k6 run load-test.js

# 3. Check bundle size
npm run build
npx webpack-bundle-analyzer build/static/js/*.js

# 4. Test in browser
# Open DevTools → Performance tab → Record → Run visualization
```

