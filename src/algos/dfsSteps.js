export function dfsSteps(graph, startNode) {
  const steps = [];
  const visited = new Set();

  function dfs(node) {
    if (visited.has(node)) return;
    visited.add(node);
    steps.push({ type: "visit", node, visited: [...visited] });

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        steps.push({ type: "explore", from: node, to: neighbor });
        dfs(neighbor);
      }
    }
    steps.push({ type: "backtrack", node });
  }

  steps.push({ type: "start", node: startNode });
  dfs(startNode);
  steps.push({ type: "done", visited: [...visited] });
  return steps;
}
