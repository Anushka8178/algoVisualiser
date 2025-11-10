export function dijkstraSteps(graph, startNode) {
  const steps = [];
  const distances = {};
  const previous = {};
  const visited = new Set();
  const unvisited = new Set();

  // Initialize distances
  Object.keys(graph).forEach(node => {
    distances[node] = node === startNode ? 0 : Infinity;
    previous[node] = null;
    unvisited.add(node);
  });

  steps.push({ 
    type: "start", 
    node: startNode, 
    distances: { ...distances },
    visited: [],
    unvisited: [...unvisited]
  });

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let current = null;
    let minDist = Infinity;
    
    for (const node of unvisited) {
      if (distances[node] < minDist) {
        minDist = distances[node];
        current = node;
      }
    }

    if (!current || distances[current] === Infinity) {
      break; // No reachable nodes left
    }

    // Remove from unvisited and mark as visited
    unvisited.delete(current);
    visited.add(current);

    steps.push({
      type: "select",
      node: current,
      distance: distances[current],
      distances: { ...distances },
      visited: [...visited],
      unvisited: [...unvisited]
    });

    // Explore neighbors
    const neighbors = graph[current] || [];
    for (const neighbor of neighbors) {
      if (visited.has(neighbor.node)) continue;

      const edgeWeight = neighbor.weight || 1;
      const newDist = distances[current] + edgeWeight;

      if (newDist < distances[neighbor.node]) {
        steps.push({
          type: "relax",
          from: current,
          to: neighbor.node,
          oldDistance: distances[neighbor.node],
          newDistance: newDist,
          weight: edgeWeight,
          distances: { ...distances }
        });

        distances[neighbor.node] = newDist;
        previous[neighbor.node] = current;

        steps.push({
          type: "update",
          node: neighbor.node,
          distance: newDist,
          distances: { ...distances },
          visited: [...visited],
          unvisited: [...unvisited]
        });
      }
    }
  }

  steps.push({
    type: "done",
    distances: { ...distances },
    visited: [...visited],
    previous: { ...previous }
  });

  return steps;
}
