# D3 Visualization Code Guide for Educators

## Important Notes

1. **DO NOT use `d3.select("svg")`** - The `svg` variable is already provided as a D3 selection
2. **DO NOT get width/height from SVG attributes** - Use the `width` and `height` variables that are provided
3. **DO NOT use import statements** - d3 is already available

## Corrected Code for Graph/Node Editor

Here's the corrected version of your graph visualization code:

```javascript
// Arrow marker
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
let links = [];
let creatingLink = null;
let undoStack = [];
let playing = false;

// Click to create nodes
svg.on("click", function (event) {
  const [x, y] = d3.pointer(event);
  const newId = String.fromCharCode(65 + nodes.length);
  const newNode = { id: newId, x, y };
  nodes.push(newNode);
  undoStack.push({ type: "addNode", node: newNode });
  render();
});

const drag = d3.drag()
  .on("drag", (event, d) => {
    d.x = event.x;
    d.y = event.y;
    render();
  })
  .on("end", (event, d) => {
    setTimeout(() => {
      if (creatingLink && creatingLink.id !== d.id) {
        const newLink = { source: creatingLink, target: d };
        links.push(newLink);
        undoStack.push({ type: "addLink", link: newLink });
        creatingLink = null;
        render();
      } else {
        creatingLink = d;
      }
    }, 10);
  });

function render(highlights = {}, message = "") {
  // Clear everything except defs (which contains the arrow marker)
  svg.selectAll("line, circle, text").remove();

  // Draw links
  svg.selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
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
    .attr("fill", "#cbd5e1")
    .attr("stroke", "#475569")
    .attr("stroke-width", 2.5)
    .call(drag);

  // Draw labels
  svg.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y + 6)
    .attr("text-anchor", "middle")
    .text(d => d.id)
    .attr("font-size", "18px")
    .attr("font-weight", "bold")
    .attr("fill", "#1e293b")
    .attr("pointer-events", "none");
}

// Initial render
render();
```

## Key Changes Made

1. **Removed** `const svg = d3.select("svg");` - svg is already provided
2. **Removed** `const width = +svg.attr("width");` - width is already provided
3. **Removed** `const height = +svg.attr("height");` - height is already provided
4. **Updated** `render()` function to use `svg.selectAll("line, circle, text").remove()` instead of `svg.selectAll("*:not(defs)").remove()` to preserve the defs element

## Available Variables

- `svg` - D3 selection of the SVG element (already selected, ready to use)
- `width` - Canvas width (default: 800)
- `height` - Canvas height (default: 400)
- `d3` - D3 library (use directly, e.g., `d3.select()`, `d3.scaleLinear()`)
- `index` - Current step index (0 for static visualizations)
- `actions` - Array of algorithm steps (empty for static visualizations)

## Common Patterns

### ❌ Wrong:
```javascript
const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");
```

### ✅ Correct:
```javascript
// svg, width, and height are already available - just use them!
svg.append("circle")...
```

