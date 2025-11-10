export function bfsSteps(graph, startNode) {
  let steps = [];
  let visited = new Set();
  let queue = [startNode];

  steps.push({ type: "start", queue: [...queue], visited: [] });

  while (queue.length > 0) {
    let current = queue.shift();
    steps.push({ type: "dequeue", node: current, queue: [...queue], visited: [...visited] });

    if (!visited.has(current)) {
      visited.add(current);
      steps.push({ type: "visit", node: current, queue: [...queue], visited: [...visited] });

      for (let neighbor of graph[current] || []) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
          steps.push({ type: "enqueue", node: neighbor, queue: [...queue], visited: [...visited] });
        }
      }
    }
  }

  steps.push({ type: "done", visited: [...visited] });
  return steps;
}
