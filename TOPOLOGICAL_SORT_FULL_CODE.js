// Full-featured Topological Sort visualization for educators
// Paste this entire snippet into the D3 Visualization Code editor

const state = {
  nodes: [],
  links: [],
  counter: 0,
  drawingEdge: null,
  history: [],
  future: [],
};

function pushHistory() {
  state.history.push({
    nodes: state.nodes.map((n) => ({ ...n })),
    links: state.links.map((l) => ({
      source: l.source.id,
      target: l.target.id,
    })),
  });
  state.future = [];
}

function restore(snapshot) {
  const nodeMap = new Map(snapshot.nodes.map((n) => [n.id, { ...n }]));
  state.nodes = snapshot.nodes.map((n) => nodeMap.get(n.id));
  state.links = snapshot.links.map((l) => ({
    source: nodeMap.get(l.source),
    target: nodeMap.get(l.target),
  }));
  state.counter = Math.max(0, ...state.nodes.map((n) => n.id));
}

svg.selectAll("*").remove();
svg.attr("viewBox", `0 0 ${width} ${height}`);

const defs = svg.append("defs");
const gradient = defs
  .append("linearGradient")
  .attr("id", "runGradient")
  .attr("x1", "0%")
  .attr("x2", "100%");
gradient.append("stop").attr("offset", "0%").attr("stop-color", "#0ea5e9");
gradient.append("stop").attr("offset", "100%").attr("stop-color", "#22d3ee");

defs
  .append("marker")
  .attr("id", "arrow")
  .attr("viewBox", "0 0 10 10")
  .attr("refX", 14)
  .attr("refY", 5)
  .attr("markerWidth", 6)
  .attr("markerHeight", 6)
  .attr("orient", "auto-start-reverse")
  .append("path")
  .attr("d", "M0 0 L10 5 L0 10")
  .attr("fill", "#38bdf8");

const background = svg
  .append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("fill", "rgba(15,23,42,0.94)")
  .on("click", addNode)
  .on("mousemove", dragEdgePreview)
  .on("mouseup", cancelEdge);

const previewLine = svg
  .append("path")
  .attr("stroke", "#38bdf8")
  .attr("stroke-width", 2)
  .attr("stroke-dasharray", "5 4")
  .attr("pointer-events", "none")
  .style("opacity", 0);

const linkLayer = svg.append("g");
const nodeLayer = svg.append("g");

const toolbar = svg
  .append("g")
  .attr("transform", `translate(${width / 2}, 50)`);

toolbar
  .append("rect")
  .attr("x", -260)
  .attr("y", -28)
  .attr("width", 520)
  .attr("height", 56)
  .attr("rx", 26)
  .attr("fill", "rgba(8,47,73,0.75)")
  .attr("stroke", "#38bdf8");

const buttonData = [
  { label: "Run Topo Sort", action: runTopoSort, main: true },
  { label: "Undo", action: undoChange },
  { label: "Clear", action: clearAll },
  { label: "Random DAG", action: randomDag },
  { label: "Reset Default", action: seedDefault },
];

const buttons = toolbar
  .selectAll("g.btn")
  .data(buttonData)
  .enter()
  .append("g")
  .attr("class", "btn")
  .attr("transform", (_d, i) => `translate(${(i - 2) * 105}, 0)`)
  .style("cursor", "pointer")
  .on("click", (d) => d.action());

buttons
  .append("rect")
  .attr("x", (d) => (d.main ? -70 : -48))
  .attr("y", -16)
  .attr("width", (d) => (d.main ? 140 : 96))
  .attr("height", 32)
  .attr("rx", 14)
  .attr("fill", (d) =>
    d.main ? "url(#runGradient)" : "rgba(15,118,110,0.4)"
  )
  .attr("stroke", (d) => (d.main ? "#0ea5e9" : "#0f766e"));

buttons
  .append("text")
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("fill", "#e0f2fe")
  .attr("font-size", 12)
  .attr("font-weight", 600)
  .text((d) => d.label);

const statusText = svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", height - 30)
  .attr("text-anchor", "middle")
  .attr("font-size", 16)
  .attr("font-weight", 600)
  .attr("fill", "#a5f3fc");

svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", height - 60)
  .attr("text-anchor", "middle")
  .attr("font-size", 12)
  .attr("fill", "#bae6fd")
  .text("Click = add node • Drag node into another = edge • Click node to delete");

function addNode(event) {
  if (event.target !== background.node()) return;
  pushHistory();
  const [x, y] = d3.pointer(event);
  state.nodes.push({ id: ++state.counter, label: `N${state.counter}`, x, y });
  redraw();
}

function dragNode(event, node) {
  node.x = event.x;
  node.y = event.y;
  redraw();
}

function startEdge(event, node) {
  event.stopPropagation();
  state.drawingEdge = { source: node };
  previewLine.style("opacity", 1);
}

function dragEdgePreview(event) {
  if (!state.drawingEdge) return;
  const [x, y] = d3.pointer(event);
  const { source } = state.drawingEdge;
  previewLine.attr("d", `M${source.x},${source.y} L${x},${y}`);
}

function finishEdge(event, target) {
  event.stopPropagation();
  if (!state.drawingEdge || state.drawingEdge.source === target) {
    cancelEdge();
    return;
  }
  const exists = state.links.some(
    (l) => l.source.id === state.drawingEdge.source.id && l.target.id === target.id
  );
  if (!exists) {
    pushHistory();
    state.links.push({ source: state.drawingEdge.source, target });
  }
  cancelEdge();
  redraw();
}

function cancelEdge() {
  state.drawingEdge = null;
  previewLine.style("opacity", 0);
}

function deleteNode(event, node) {
  event.stopPropagation();
  pushHistory();
  state.nodes = state.nodes.filter((n) => n.id !== node.id);
  state.links = state.links.filter(
    (l) => l.source.id !== node.id && l.target.id !== node.id
  );
  redraw();
}

function clearAll() {
  if (!state.nodes.length && !state.links.length) return;
  pushHistory();
  state.nodes = [];
  state.links = [];
  redraw();
  showStatus("Cleared canvas", "#94a3b8");
}

function undoChange() {
  if (!state.history.length) return;
  const snapshot = state.history.pop();
  state.future.push({
    nodes: state.nodes.map((n) => ({ ...n })),
    links: state.links.map((l) => ({ source: l.source.id, target: l.target.id })),
  });
  restore(snapshot);
  redraw();
  showStatus("Undo successful", "#fde68a");
}

function randomDag() {
  pushHistory();
  const count = d3.randomInt(5, 8)();
  const newNodes = Array.from({ length: count }, (_, i) => ({
    id: ++state.counter,
    label: `R${state.counter}`,
    x: 160 + (i % 3) * 220 + Math.random() * 60,
    y: 140 + Math.floor(i / 3) * 180 + Math.random() * 40,
  }));
  state.nodes = newNodes;

  const edges = [];
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      if (Math.random() < 0.4) {
        edges.push({ source: newNodes[i], target: newNodes[j] });
      }
    }
  }
  state.links = edges;
  redraw();
  showStatus("Random DAG generated", "#facc15");
}

function seedDefault() {
  pushHistory();
  state.nodes = [
    { id: 1, label: "N1", x: 200, y: 180 },
    { id: 2, label: "N2", x: 420, y: 140 },
    { id: 3, label: "N3", x: 420, y: 280 },
    { id: 4, label: "N4", x: 640, y: 180 },
    { id: 5, label: "N5", x: 640, y: 320 },
  ];
  state.counter = 5;
  state.links = [
    { source: state.nodes[0], target: state.nodes[1] },
    { source: state.nodes[0], target: state.nodes[2] },
    { source: state.nodes[1], target: state.nodes[3] },
    { source: state.nodes[2], target: state.nodes[4] },
  ];
  redraw();
  showStatus("Default DAG loaded", "#38bdf8");
}

function redraw() {
  const links = linkLayer
    .selectAll("path")
    .data(state.links, (d) => `${d.source.id}-${d.target.id}`);
  links.exit().remove();
  links
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "#38bdf8")
    .attr("stroke-width", 2)
    .attr("marker-end", "url(#arrow)");

  linkLayer
    .selectAll("path")
    .attr("d", (d) => `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`);

  const nodes = nodeLayer.selectAll("g.node").data(state.nodes, (d) => d.id);
  nodes.exit().remove();

  const enter = nodes
    .enter()
    .append("g")
    .attr("class", "node")
    .call(d3.drag().on("start", cancelEdge).on("drag", dragNode))
    .on("mousedown", startEdge)
    .on("mouseup", finishEdge)
    .on("click", deleteNode);

  enter
    .append("circle")
    .attr("r", 26)
    .attr("fill", "#1d4ed8")
    .attr("stroke", "#93c5fd")
    .attr("stroke-width", 2);

  enter
    .append("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("fill", "#e0f2fe")
    .attr("font-weight", 600)
    .text((d) => d.label);

  nodeLayer.selectAll("g.node").attr("transform", (d) => `translate(${d.x},${d.y})`);
}

async function runTopoSort() {
  if (!state.nodes.length) return;
  resetColors();
  pushHistory();

  const inDegree = new Map(state.nodes.map((n) => [n.id, 0]));
  state.links.forEach((link) => {
    inDegree.set(link.target.id, (inDegree.get(link.target.id) || 0) + 1);
  });

  const queue = state.nodes.filter((n) => inDegree.get(n.id) === 0);
  const order = [];

  queue.forEach((n) => fillNode(n, "#22d3ee"));

  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    fillNode(node, "#22c55e");
    await wait(400);

    state.links
      .filter((link) => link.source.id === node.id)
      .forEach((link) => {
        strokeEdge(link, "#f97316");
        inDegree.set(link.target.id, inDegree.get(link.target.id) - 1);
        if (inDegree.get(link.target.id) === 0) {
          queue.push(link.target);
          fillNode(link.target, "#22d3ee");
        }
      });
  }

  if (order.length !== state.nodes.length) {
    showStatus("Cycle detected — no topological order", "#f87171");
  } else {
    showStatus(`Order: ${order.map((n) => n.label).join(" → ")}`, "#34d399");
  }
}

function resetColors() {
  nodeLayer.selectAll("circle").attr("fill", "#1d4ed8");
  linkLayer.selectAll("path").attr("stroke", "#38bdf8");
}

function fillNode(node, color) {
  nodeLayer
    .selectAll("g.node")
    .filter((d) => d.id === node.id)
    .select("circle")
    .transition()
    .duration(200)
    .attr("fill", color);
}

function strokeEdge(link, color) {
  linkLayer
    .selectAll("path")
    .filter((d) => d === link)
    .transition()
    .duration(200)
    .attr("stroke", color);
}

function showStatus(text, color = "#bae6fd") {
  statusText.attr("fill", color).text(text);
}

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

seedDefault();
redraw();

