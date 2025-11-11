// Complete Topological Sort Visualization Code
// Paste this entire code into the "D3 Visualization Code" field

// Arrow marker for directed edges
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

// Data structures
let nodes = [];
let links = [];
let creatingLink = null;
let undoStack = [];
let isRunning = false;
let sortedOrder = [];
let currentStep = 0;
let inDegree = {};
let queue = [];
let visited = new Set();

// Click to create nodes
svg.on("click", function (event) {
  if (isRunning) return;
  const [x, y] = d3.pointer(event, svg.node());
  const newId = String.fromCharCode(65 + nodes.length);
  const newNode = { id: newId, x, y };
  nodes.push(newNode);
  undoStack.push({ type: "addNode", node: newNode });
  render();
});

// Drag behavior for nodes
const drag = d3.drag()
  .on("start", function(event, d) {
    if (isRunning) return;
    d3.select(this).raise().attr("stroke", "#3b82f6");
  })
  .on("drag", function(event, d) {
    if (isRunning) return;
    d.x = event.x;
    d.y = event.y;
    render();
  })
  .on("end", function(event, d) {
    if (isRunning) return;
    d3.select(this).attr("stroke", "#475569");
    
    setTimeout(() => {
      if (creatingLink && creatingLink.id !== d.id) {
        // Check if link already exists
        const linkExists = links.some(l => 
          (l.source.id === creatingLink.id && l.target.id === d.id) ||
          (l.source === creatingLink && l.target === d)
        );
        
        if (!linkExists) {
          const newLink = { 
            source: creatingLink, 
            target: d,
            id: `${creatingLink.id}-${d.id}`
          };
          links.push(newLink);
          undoStack.push({ type: "addLink", link: newLink });
          render();
        }
        creatingLink = null;
      } else {
        creatingLink = d;
      }
    }, 10);
  });

// Calculate in-degrees for topological sort
function calculateInDegrees() {
  inDegree = {};
  nodes.forEach(node => {
    inDegree[node.id] = 0;
  });
  
  links.forEach(link => {
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    if (inDegree[targetId] !== undefined) {
      inDegree[targetId]++;
    }
  });
}

// Topological Sort Algorithm (Kahn's Algorithm)
function topologicalSort() {
  if (isRunning) return;
  
  isRunning = true;
  sortedOrder = [];
  currentStep = 0;
  visited.clear();
  calculateInDegrees();
  
  // Find all nodes with in-degree 0
  queue = nodes.filter(node => inDegree[node.id] === 0);
  
  if (queue.length === 0 && nodes.length > 0) {
    // Cycle detected
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "#ef4444")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("id", "error-msg")
      .text("Cycle detected! Topological sort not possible.");
    isRunning = false;
    return;
  }
  
  processQueue();
}

function processQueue() {
  if (queue.length === 0) {
    if (sortedOrder.length < nodes.length) {
      // Cycle detected
      svg.select("#error-msg").remove();
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", "#ef4444")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .attr("id", "error-msg")
        .text("Cycle detected! Topological sort not possible.");
    } else {
      // Success
      svg.select("#error-msg").remove();
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", "#10b981")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .attr("id", "success-msg")
        .text("Topological Order: " + sortedOrder.join(" → "));
    }
    isRunning = false;
    return;
  }
  
  const current = queue.shift();
  sortedOrder.push(current.id);
  visited.add(current.id);
  
  // Update visualization
  render();
  
  // Highlight current node
  svg.selectAll("circle")
    .filter(d => d.id === current.id)
    .attr("fill", "#10b981")
    .attr("stroke", "#059669")
    .attr("stroke-width", 3);
  
  // Find neighbors and decrease their in-degree
  const neighbors = links
    .filter(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      return sourceId === current.id;
    })
    .map(link => {
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      return nodes.find(n => n.id === targetId);
    })
    .filter(n => n && !visited.has(n.id));
  
  neighbors.forEach(neighbor => {
    inDegree[neighbor.id]--;
    if (inDegree[neighbor.id] === 0) {
      queue.push(neighbor);
    }
  });
  
  // Continue after delay
  setTimeout(() => {
    processQueue();
  }, 1000);
}

// Reset visualization
function resetVisualization() {
  isRunning = false;
  sortedOrder = [];
  currentStep = 0;
  visited.clear();
  svg.selectAll("#error-msg, #success-msg").remove();
  render();
}

// Render function
function render(highlights = {}, message = "") {
  // Clear everything except defs and messages
  svg.selectAll("line, circle, text:not(#error-msg):not(#success-msg)").remove();
  
  // Draw links (edges)
  svg.selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("x1", d => {
      const source = typeof d.source === 'object' ? d.source : nodes.find(n => n.id === d.source);
      return source ? source.x : 0;
    })
    .attr("y1", d => {
      const source = typeof d.source === 'object' ? d.source : nodes.find(n => n.id === d.source);
      return source ? source.y : 0;
    })
    .attr("x2", d => {
      const target = typeof d.target === 'object' ? d.target : nodes.find(n => n.id === d.target);
      return target ? target.x : 0;
    })
    .attr("y2", d => {
      const target = typeof d.target === 'object' ? d.target : nodes.find(n => n.id === d.target);
      return target ? target.y : 0;
    })
    .attr("stroke", "#94a3b8")
    .attr("stroke-width", 2)
    .attr("marker-end", "url(#arrow)");
  
  // Draw nodes
  svg.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 25)
    .attr("fill", d => {
      if (sortedOrder.includes(d.id)) return "#10b981";
      if (queue.some(n => n.id === d.id)) return "#fbbf24";
      return "#cbd5e1";
    })
    .attr("stroke", d => {
      if (sortedOrder.includes(d.id)) return "#059669";
      if (queue.some(n => n.id === d.id)) return "#f59e0b";
      return "#475569";
    })
    .attr("stroke-width", d => {
      if (sortedOrder.includes(d.id) || queue.some(n => n.id === d.id)) return 3;
      return 2.5;
    })
    .call(drag);
  
  // Draw node labels
  svg.selectAll("text.node-label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "node-label")
    .attr("x", d => d.x)
    .attr("y", d => d.y + 6)
    .attr("text-anchor", "middle")
    .text(d => d.id)
    .attr("font-size", "18px")
    .attr("font-weight", "bold")
    .attr("fill", "#1e293b")
    .attr("pointer-events", "none");
  
  // Show in-degree on nodes
  if (Object.keys(inDegree).length > 0) {
    svg.selectAll("text.in-degree")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "in-degree")
      .attr("x", d => d.x + 20)
      .attr("y", d => d.y - 20)
      .attr("text-anchor", "middle")
      .text(d => `in: ${inDegree[d.id] || 0}`)
      .attr("font-size", "12px")
      .attr("fill", "#64748b")
      .attr("pointer-events", "none");
  }
  
  // Show control buttons
  if (!svg.select("g.controls").node()) {
    const controls = svg.append("g").attr("class", "controls");
    
    // Run button
    controls.append("rect")
      .attr("x", 10)
      .attr("y", height - 50)
      .attr("width", 120)
      .attr("height", 35)
      .attr("rx", 5)
      .attr("fill", "#3b82f6")
      .attr("cursor", "pointer")
      .on("click", topologicalSort);
    
    controls.append("text")
      .attr("x", 70)
      .attr("y", height - 28)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("pointer-events", "none")
      .text("Run Topo Sort");
    
    // Reset button
    controls.append("rect")
      .attr("x", 140)
      .attr("y", height - 50)
      .attr("width", 100)
      .attr("height", 35)
      .attr("rx", 5)
      .attr("fill", "#64748b")
      .attr("cursor", "pointer")
      .on("click", resetVisualization);
    
    controls.append("text")
      .attr("x", 190)
      .attr("y", height - 28)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("pointer-events", "none")
      .text("Reset");
  }
  
  // Show instructions
  if (nodes.length === 0 && !isRunning) {
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", "16px")
      .attr("opacity", 0.7)
      .text("Click to add nodes, drag from node to node to create edges");
  }
}

// Initial render
render();

