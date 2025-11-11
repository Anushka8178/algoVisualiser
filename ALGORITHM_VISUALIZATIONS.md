# Algorithm Visualization Codes for Educators

## 1. Timsort Visualization

```javascript
// Timsort Visualization - Hybrid sorting algorithm
svg.append("defs").append("marker")
  .attr("id", "arrow")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 20)
  .attr("refY", 0)
  .attr("markerWidth", 6)
  .attr("markerHeight", 6)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M0,-5L10,0L0,5")
  .attr("fill", "#94a3b8");

let array = [64, 34, 25, 12, 22, 11, 90, 5, 77, 88, 3, 45, 67, 89, 23];
let isRunning = false;
let currentStep = 0;
let history = [];
let minRun = 32;

// Initialize with random array
function initArray() {
  array = Array.from({length: 15}, () => Math.floor(Math.random() * 100));
  history = [];
  currentStep = 0;
  render();
}

// Timsort algorithm
function timsort() {
  if (isRunning) return;
  isRunning = true;
  history = [];
  currentStep = 0;
  
  const n = array.length;
  minRun = calculateMinRun(n);
  
  // Sort individual runs using insertion sort
  for (let i = 0; i < n; i += minRun) {
    insertionSort(i, Math.min(i + minRun - 1, n - 1));
  }
  
  // Merge runs
  let size = minRun;
  while (size < n) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = Math.min(left + size - 1, n - 1);
      const right = Math.min(left + 2 * size - 1, n - 1);
      if (mid < right) {
        merge(left, mid, right);
      }
    }
    size *= 2;
  }
  
  animateSteps();
}

function calculateMinRun(n) {
  let r = 0;
  while (n >= 32) {
    r |= n & 1;
    n >>= 1;
  }
  return n + r;
}

function insertionSort(left, right) {
  for (let i = left + 1; i <= right; i++) {
    const key = array[i];
    let j = i - 1;
    
    while (j >= left && array[j] > key) {
      array[j + 1] = array[j];
      history.push({type: 'compare', indices: [j, j+1], array: [...array]});
      j--;
    }
    array[j + 1] = key;
    history.push({type: 'insert', index: j + 1, value: key, array: [...array]});
  }
}

function merge(left, mid, right) {
  const len1 = mid - left + 1;
  const len2 = right - mid;
  const leftArr = array.slice(left, mid + 1);
  const rightArr = array.slice(mid + 1, right + 1);
  
  let i = 0, j = 0, k = left;
  
  while (i < len1 && j < len2) {
    if (leftArr[i] <= rightArr[j]) {
      array[k] = leftArr[i];
      history.push({type: 'merge', index: k, value: leftArr[i], array: [...array]});
      i++;
    } else {
      array[k] = rightArr[j];
      history.push({type: 'merge', index: k, value: rightArr[j], array: [...array]});
      j++;
    }
    k++;
  }
  
  while (i < len1) {
    array[k] = leftArr[i];
    history.push({type: 'merge', index: k, value: leftArr[i], array: [...array]});
    i++;
    k++;
  }
  
  while (j < len2) {
    array[k] = rightArr[j];
    history.push({type: 'merge', index: k, value: rightArr[j], array: [...array]});
    j++;
    k++;
  }
}

function animateSteps() {
  if (currentStep >= history.length) {
    isRunning = false;
    render();
    return;
  }
  
  const step = history[currentStep];
  if (step.array) {
    array = [...step.array];
  }
  
  render(step);
  currentStep++;
  
  setTimeout(() => animateSteps(), 300);
}

function reset() {
  isRunning = false;
  currentStep = 0;
  history = [];
  initArray();
}

function render(highlight = null) {
  svg.selectAll("*").remove();
  
  const barWidth = width / array.length;
  const maxVal = Math.max(...array);
  const scale = (height - 100) / maxVal;
  
  svg.selectAll("rect")
    .data(array)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * barWidth)
    .attr("y", d => height - 50 - d * scale)
    .attr("width", barWidth - 2)
    .attr("height", d => d * scale)
    .attr("fill", (d, i) => {
      if (highlight) {
        if (highlight.type === 'compare' && highlight.indices.includes(i)) return "#ef4444";
        if (highlight.type === 'insert' && highlight.index === i) return "#10b981";
        if (highlight.type === 'merge' && highlight.index === i) return "#3b82f6";
      }
      return "#cbd5e1";
    })
    .attr("stroke", "#475569")
    .attr("stroke-width", 1);
  
  svg.selectAll("text")
    .data(array)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * barWidth + barWidth / 2)
    .attr("y", height - 30)
    .attr("text-anchor", "middle")
    .text(d => d)
    .attr("font-size", "12px")
    .attr("fill", "#1e293b");
  
  if (array.length === 0) {
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .text("Click 'Randomize' to generate array, then 'Run Timsort'");
  }
}

// Buttons
const controls = svg.append("g").attr("class", "controls");
controls.append("rect").attr("x", 10).attr("y", 10).attr("width", 120).attr("height", 30).attr("rx", 5).attr("fill", "#3b82f6").attr("cursor", "pointer").on("click", timsort);
controls.append("text").attr("x", 70).attr("y", 30).attr("text-anchor", "middle").attr("fill", "white").attr("font-size", "14px").text("Run Timsort");
controls.append("rect").attr("x", 140).attr("y", 10).attr("width", 100).attr("height", 30).attr("rx", 5).attr("fill", "#64748b").attr("cursor", "pointer").on("click", reset);
controls.append("text").attr("x", 190).attr("y", 30).attr("text-anchor", "middle").attr("fill", "white").attr("font-size", "14px").text("Randomize");

initArray();
```

## 2. A* Pathfinding Algorithm

```javascript
// A* Pathfinding Visualization
svg.append("defs").append("marker")
  .attr("id", "arrow")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 20)
  .attr("refY", 0)
  .attr("markerWidth", 6)
  .attr("markerHeight", 6)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M0,-5L10,0L0,5")
  .attr("fill", "#94a3b8");

const gridSize = 15;
const cellSize = Math.min(width, height) / gridSize;
let grid = [];
let start = {x: 2, y: 2};
let end = {x: 12, y: 12};
let isRunning = false;
let path = [];

// Initialize grid
function initGrid() {
  grid = [];
  for (let y = 0; y < gridSize; y++) {
    grid[y] = [];
    for (let x = 0; x < gridSize; x++) {
      grid[y][x] = {
        x, y,
        walkable: Math.random() > 0.25,
        g: Infinity,
        h: 0,
        f: Infinity,
        parent: null
      };
    }
  }
  grid[start.y][start.x].walkable = true;
  grid[end.y][end.x].walkable = true;
  path = [];
  render();
}

// A* algorithm
function astar() {
  if (isRunning) return;
  isRunning = true;
  
  const openSet = [grid[start.y][start.x]];
  const closedSet = [];
  
  grid[start.y][start.x].g = 0;
  grid[start.y][start.x].h = heuristic(start, end);
  grid[start.y][start.x].f = grid[start.y][start.x].h;
  
  while (openSet.length > 0) {
    let current = openSet.reduce((min, node) => node.f < min.f ? node : min, openSet[0]);
    
    if (current.x === end.x && current.y === end.y) {
      // Reconstruct path
      path = [];
      let temp = current;
      while (temp) {
        path.push(temp);
        temp = temp.parent;
      }
      isRunning = false;
      render();
      return;
    }
    
    openSet.splice(openSet.indexOf(current), 1);
    closedSet.push(current);
    
    const neighbors = getNeighbors(current);
    neighbors.forEach(neighbor => {
      if (!neighbor.walkable || closedSet.includes(neighbor)) return;
      
      const tentativeG = current.g + 1;
      
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeG >= neighbor.g) {
        return;
      }
      
      neighbor.parent = current;
      neighbor.g = tentativeG;
      neighbor.h = heuristic(neighbor, end);
      neighbor.f = neighbor.g + neighbor.h;
    });
    
    render();
  }
  
  isRunning = false;
}

function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getNeighbors(node) {
  const neighbors = [];
  const directions = [[0,1], [1,0], [0,-1], [-1,0]];
  directions.forEach(([dx, dy]) => {
    const x = node.x + dx;
    const y = node.y + dy;
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      neighbors.push(grid[y][x]);
    }
  });
  return neighbors;
}

function reset() {
  isRunning = false;
  path = [];
  initGrid();
}

function render() {
  svg.selectAll("*").remove();
  
  // Draw grid
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = grid[y][x];
      let fill = cell.walkable ? "#ffffff" : "#1e293b";
      
      if (x === start.x && y === start.y) fill = "#10b981";
      if (x === end.x && y === end.y) fill = "#ef4444";
      if (path.some(p => p.x === x && p.y === y)) fill = "#3b82f6";
      
      svg.append("rect")
        .attr("x", x * cellSize)
        .attr("y", y * cellSize)
        .attr("width", cellSize - 1)
        .attr("height", cellSize - 1)
        .attr("fill", fill)
        .attr("stroke", "#94a3b8");
    }
  }
}

// Buttons
const controls = svg.append("g").attr("class", "controls");
controls.append("rect").attr("x", 10).attr("y", height - 50).attr("width", 100).attr("height", 30).attr("rx", 5).attr("fill", "#3b82f6").attr("cursor", "pointer").on("click", astar);
controls.append("text").attr("x", 60).attr("y", height - 32).attr("text-anchor", "middle").attr("fill", "white").attr("font-size", "14px").text("Run A*");
controls.append("rect").attr("x", 120).attr("y", height - 50).attr("width", 100).attr("height", 30).attr("rx", 5).attr("fill", "#64748b").attr("cursor", "pointer").on("click", reset);
controls.append("text").attr("x", 170).attr("y", height - 32).attr("text-anchor", "middle").attr("fill", "white").attr("font-size", "14px").text("Reset");

initGrid();
```

## 3. Kruskal's Minimum Spanning Tree

```javascript
// Kruskal's MST Visualization
svg.append("defs").append("marker")
  .attr("id", "arrow")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 20)
  .attr("refY", 0)
  .attr("markerWidth", 6)
  .attr("markerHeight", 6)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M0,-5L10,0L0,5")
  .attr("fill", "#94a3b8");

let nodes = [];
let edges = [];
let mstEdges = [];
let isRunning = false;
let parent = {};

// Initialize with sample graph
function initGraph() {
  nodes = [
    {id: 'A', x: width/4, y: height/4},
    {id: 'B', x: 3*width/4, y: height/4},
    {id: 'C', x: width/4, y: 3*height/4},
    {id: 'D', x: 3*width/4, y: 3*height/4},
    {id: 'E', x: width/2, y: height/2}
  ];
  
  edges = [
    {from: 'A', to: 'B', weight: 4},
    {from: 'A', to: 'C', weight: 2},
    {from: 'B', to: 'D', weight: 5},
    {from: 'C', to: 'D', weight: 1},
    {from: 'A', to: 'E', weight: 3},
    {from: 'E', to: 'D', weight: 2},
    {from: 'B', to: 'E', weight: 4}
  ];
  
  mstEdges = [];
  nodes.forEach(n => parent[n.id] = n.id);
  render();
}

// Find with path compression
function find(x) {
  if (parent[x] !== x) {
    parent[x] = find(parent[x]);
  }
  return parent[x];
}

// Union
function union(x, y) {
  const rootX = find(x);
  const rootY = find(y);
  if (rootX !== rootY) {
    parent[rootY] = rootX;
    return true;
  }
  return false;
}

// Kruskal's algorithm
function kruskal() {
  if (isRunning) return;
  isRunning = true;
  mstEdges = [];
  nodes.forEach(n => parent[n.id] = n.id);
  
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  let step = 0;
  
  function processNext() {
    if (step >= sortedEdges.length) {
      isRunning = false;
      render();
      return;
    }
    
    const edge = sortedEdges[step];
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    
    if (union(edge.from, edge.to)) {
      mstEdges.push(edge);
    }
    
    render();
    step++;
    setTimeout(processNext, 800);
  }
  
  processNext();
}

function reset() {
  isRunning = false;
  mstEdges = [];
  nodes.forEach(n => parent[n.id] = n.id);
  render();
}

function render() {
  svg.selectAll("*").remove();
  
  // Draw edges
  edges.forEach(edge => {
    const from = nodes.find(n => n.id === edge.from);
    const to = nodes.find(n => n.id === edge.to);
    const inMST = mstEdges.some(e => 
      (e.from === edge.from && e.to === edge.to) ||
      (e.from === edge.to && e.to === edge.from)
    );
    
    const line = svg.append("line")
      .attr("x1", from.x)
      .attr("y1", from.y)
      .attr("x2", to.x)
      .attr("y2", to.y)
      .attr("stroke", inMST ? "#10b981" : "#94a3b8")
      .attr("stroke-width", inMST ? 3 : 2);
    
    // Weight label
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    svg.append("text")
      .attr("x", midX)
      .attr("y", midY - 5)
      .attr("text-anchor", "middle")
      .attr("fill", inMST ? "#059669" : "#64748b")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text(edge.weight);
  });
  
  // Draw nodes
  nodes.forEach(node => {
    svg.append("circle")
      .attr("cx", node.x)
      .attr("cy", node.y)
      .attr("r", 20)
      .attr("fill", "#cbd5e1")
      .attr("stroke", "#475569")
      .attr("stroke-width", 2);
    
    svg.append("text")
      .attr("x", node.x)
      .attr("y", node.y + 6)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text(node.id);
  });
  
  // Show MST weight
  if (mstEdges.length > 0) {
    const totalWeight = mstEdges.reduce((sum, e) => sum + e.weight, 0);
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "#10b981")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .text(`MST Weight: ${totalWeight}`);
  }
}

// Buttons
const controls = svg.append("g").attr("class", "controls");
controls.append("rect").attr("x", 10).attr("y", height - 50).attr("width", 120).attr("height", 30).attr("rx", 5).attr("fill", "#3b82f6").attr("cursor", "pointer").on("click", kruskal);
controls.append("text").attr("x", 70).attr("y", height - 32).attr("text-anchor", "middle").attr("fill", "white").attr("font-size", "14px").text("Run Kruskal");
controls.append("rect").attr("x", 140).attr("y", height - 50).attr("width", 100).attr("height", 30).attr("rx", 5).attr("fill", "#64748b").attr("cursor", "pointer").on("click", reset);
controls.append("text").attr("x", 190).attr("y", height - 32).attr("text-anchor", "middle").attr("fill", "white").attr("font-size", "14px").text("Reset");

initGraph();
```

## 4. Bellman-Ford Shortest Path

```javascript
// Bellman-Ford Algorithm Visualization
svg.append("defs").append("marker")
  .attr("id", "arrow")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 20)
  .attr("refY", 0)
  .attr("markerWidth", 6)
  .attr("markerHeight", 6)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M0,-5L10,0L0,5")
  .attr("fill", "#94a3b8");

let nodes = [];
let edges = [];
let distances = {};
let source = null;
let isRunning = false;
let step = 0;

function initGraph() {
  nodes = [
    {id: 'A', x: width/5, y: height/2},
    {id: 'B', x: 2*width/5, y: height/4},
    {id: 'C', x: 2*width/5, y: 3*height/4},
    {id: 'D', x: 3*width/5, y: height/2},
    {id: 'E', x: 4*width/5, y: height/2}
  ];
  
  edges = [
    {from: 'A', to: 'B', weight: 6},
    {from: 'A', to: 'C', weight: 5},
    {from: 'B', to: 'D', weight: -1},
    {from: 'C', to: 'B', weight: -2},
    {from: 'C', to: 'D', weight: 4},
    {from: 'D', to: 'E', weight: 3},
    {from: 'C', to: 'E', weight: 2}
  ];
  
  source = 'A';
  nodes.forEach(n => distances[n.id] = Infinity);
  distances[source] = 0;
  step = 0;
  render();
}

function bellmanFord() {
  if (isRunning) return;
  isRunning = true;
  step = 0;
  
  nodes.forEach(n => distances[n.id] = Infinity);
  distances[source] = 0;
  
  function relax() {
    if (step >= nodes.length - 1) {
      // Check for negative cycles
      let hasNegativeCycle = false;
      edges.forEach(edge => {
        if (distances[edge.from] + edge.weight < distances[edge.to]) {
          hasNegativeCycle = true;
        }
      });
      
      if (hasNegativeCycle) {
        svg.append("text")
          .attr("x", width / 2)
          .attr("y", 30)
          .attr("text-anchor", "middle")
          .attr("fill", "#ef4444")
          .attr("font-size", "18px")
          .text("Negative cycle detected!");
      }
      
      isRunning = false;
      render();
      return;
    }
    
    edges.forEach(edge => {
      if (distances[edge.from] !== Infinity) {
        const newDist = distances[edge.from] + edge.weight;
        if (newDist < distances[edge.to]) {
          distances[edge.to] = newDist;
        }
      }
    });
    
    step++;
    render();
    setTimeout(relax, 1000);
  }
  
  relax();
}

function reset() {
  isRunning = false;
  step = 0;
  initGraph();
}

function render() {
  svg.selectAll("*").remove();
  
  // Draw edges
  edges.forEach(edge => {
    const from = nodes.find(n => n.id === edge.from);
    const to = nodes.find(n => n.id === edge.to);
    
    svg.append("line")
      .attr("x1", from.x)
      .attr("y1", from.y)
      .attr("x2", to.x)
      .attr("y2", to.y)
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");
    
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    svg.append("text")
      .attr("x", midX)
      .attr("y", midY - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text(edge.weight);
  });
  
  // Draw nodes
  nodes.forEach(node => {
    const dist = distances[node.id] === Infinity ? "∞" : distances[node.id];
    const isSource = node.id === source;
    
    svg.append("circle")
      .attr("cx", node.x)
      .attr("cy", node.y)
      .attr("r", 25)
      .attr("fill", isSource ? "#10b981" : "#cbd5e1")
      .attr("stroke", isSource ? "#059669" : "#475569")
      .attr("stroke-width", 2);
    
    svg.append("text")
      .attr("x", node.x)
      .attr("y", node.y - 35)
      .attr("text-anchor", "middle")
      .attr("fill", "#3b82f6")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text(`d: ${dist}`);
    
    svg.append("text")
      .attr("x", node.x)
      .attr("y", node.y + 6)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text(node.id);
  });
  
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("fill", "#64748b")
    .attr("font-size", "16px")
    .text(`Iteration: ${step} / ${nodes.length - 1}`);
}

// Buttons
const controls = svg.append("g").attr("class", "controls");
controls.append("rect").attr("x", 10).attr("y", height - 50).attr("width", 120).attr("height", 30).attr("rx", 5).attr("fill", "#3b82f6").attr("cursor", "pointer").on("click", bellmanFord);
controls.append("text").attr("x", 70).attr("y", height - 32).attr("text-anchor", "middle").attr("fill", "white").attr("font-size", "14px").text("Run Bellman-Ford");
controls.append("rect").attr("x", 140).attr("y", height - 50).attr("width", 100).attr("height", 30).attr("rx", 5).attr("fill", "#64748b").attr("cursor", "pointer").on("click", reset);
controls.append("text").attr("x", 190).attr("y", height - 32).attr("text-anchor", "middle").attr("fill", "white").attr("font-size", "14px").text("Reset");

initGraph();
```

## Usage Instructions

1. **Timsort**: Click "Randomize" to generate array, then "Run Timsort" to visualize
2. **A* Pathfinding**: Click "Run A*" to find path from green (start) to red (end)
3. **Kruskal's MST**: Click "Run Kruskal" to find minimum spanning tree
4. **Bellman-Ford**: Click "Run Bellman-Ford" to find shortest paths from source node

All visualizations include:
- Color-coded states (processing, completed, etc.)
- Step-by-step animation
- Reset functionality
- Clear visual feedback

