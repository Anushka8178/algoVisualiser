import React, { useEffect, useState, useRef, useMemo } from "react";
import * as d3 from "d3";
import { dijkstraSteps } from "../algos/dijkstraSteps";
import { usePlayer } from "../hooks/usePlayer";
import Navbar from "../components/Navbar";
import AlgorithmNavigator from "../components/AlgorithmNavigator";

export default function DijkstraViz({ showNavbar = true, showNavigator = true }) {
  const svgRef = useRef();
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [startNode, setStartNode] = useState(null);
  const [creatingLink, setCreatingLink] = useState(null);
  const [pendingWeight, setPendingWeight] = useState(null);
  const [weightInput, setWeightInput] = useState("1");
  const [undoStack, setUndoStack] = useState([]);

  // Build weighted adjacency list
  const graph = useMemo(() => {
    const g = {};
    nodes.forEach((n) => (g[n.id] = []));
    links.forEach((l) => {
      g[l.source.id].push({ node: l.target.id, weight: l.weight || 1 });
    });
    return g;
  }, [nodes, links]);

  const actions = useMemo(() => {
    if (!startNode || !Object.keys(graph).length) return [];
    return dijkstraSteps(graph, startNode.id);
  }, [graph, startNode]);

  const { index, playing, play, pause, reset, stepForward, stepBackward, speed, setSpeed } =
    usePlayer(actions, 900);

  // Draw Graph
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const width = 800, height = 500;

    const colorSettled = "#10b981"; // emerald green - finalized
    const colorCurrent = "#f59e0b"; // amber orange - being processed
    const colorRelaxing = "#a855f7"; // purple - edge being relaxed
    const colorStart = "#eab308"; // yellow
    const colorDefault = "#cbd5e1"; // slate-300

    let highlights = {
      current: null,
      settled: new Set(),
      relaxing: null,
      distances: {},
      visited: new Set()
    };
    let message = "";

    for (let i = 0; i <= index && i < actions.length; i++) {
      const a = actions[i];
      if (a.type === "start") {
        message = `Starting Dijkstra from ${a.node}`;
        highlights.distances = a.distances || {};
      }
      if (a.type === "select") {
        highlights.current = a.node;
        highlights.settled = new Set(a.visited || []);
        highlights.distances = a.distances || {};
        message = `Selecting node ${a.node} (distance: ${a.distance === Infinity ? '∞' : a.distance})`;
      }
      if (a.type === "relax") {
        highlights.relaxing = { from: a.from, to: a.to };
        message = `Relaxing edge ${a.from} → ${a.to} (weight: ${a.weight}, new distance: ${a.newDistance})`;
      }
      if (a.type === "update") {
        highlights.distances = a.distances || {};
        highlights.visited = new Set(a.visited || []);
        message = `Updated distance to ${a.node}: ${a.distance}`;
      }
      if (a.type === "done") {
        highlights.current = null;
        highlights.relaxing = null;
        highlights.settled = new Set(a.visited || []);
        highlights.distances = a.distances || {};
        message = `🎉 Dijkstra Completed!`;
      }
    }

    // Draw edges (using merge to update on drag)
    const edges = svg
      .selectAll("line")
      .data(links);
    
    edges.enter()
      .append("line")
      .merge(edges)
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .attr("stroke", (d) => {
        if (highlights.relaxing && 
            highlights.relaxing.from === d.source.id && 
            highlights.relaxing.to === d.target.id) {
          return "#a855f7";
        }
        return "#94a3b8";
      })
      .attr("stroke-width", (d) => {
        if (highlights.relaxing && 
            highlights.relaxing.from === d.source.id && 
            highlights.relaxing.to === d.target.id) {
          return 4;
        }
        return 2;
      })
      .attr("opacity", 0.7)
      .attr("marker-end", "url(#arrow)");
    
    edges.exit().remove();

    // Edge weight labels (using merge to update on drag)
    const weightLabels = svg
      .selectAll(".weight-label")
      .data(links);
    
    weightLabels.enter()
      .append("text")
      .attr("class", "weight-label")
      .merge(weightLabels)
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2 - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "#e2e8f0")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("stroke", "#0f172a")
      .attr("stroke-width", "0.5px")
      .text((d) => d.weight || 1);
    
    weightLabels.exit().remove();

    // Arrowhead
    svg
      .append("defs")
      .append("marker")
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

    // Drag behavior - track if actual drag occurred
    let startX, startY;
    const drag = d3.drag()
      .on("start", function(event, d) {
        startX = event.x;
        startY = event.y;
        dragStartedRef.current = false;
        d3.select(this).raise().attr("stroke-width", 3.5);
      })
      .on("drag", function(event, d) {
        // Only consider it a drag if moved more than 3 pixels
        const dx = event.x - startX;
        const dy = event.y - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 3) {
          dragStartedRef.current = true;
        }
        
        if (dragStartedRef.current) {
          d.x = event.x;
          d.y = event.y;
          d3.select(this)
            .attr("cx", d.x)
            .attr("cy", d.y);
          
          // Update node label
          svg.selectAll("text.node-label")
            .filter((label) => label.id === d.id)
            .attr("x", d.x)
            .attr("y", d.y + 5);
          
          // Update distance labels
          const dist = highlights.distances[d.id];
          if (dist !== undefined) {
            const text = dist === Infinity ? "∞" : dist.toString();
            const textWidth = text.length * 9;
            svg.selectAll(".distance-bg")
              .filter((bg) => bg.id === d.id)
              .attr("x", d.x - Math.max(22, textWidth / 2 + 8))
              .attr("y", d.y - 58);
            svg.selectAll(".distance-label")
              .filter((label) => label.id === d.id)
              .attr("x", d.x)
              .attr("y", d.y - 45);
          }
          
          // Update links
          svg.selectAll("line")
            .attr("x1", (l) => l.source.x)
            .attr("y1", (l) => l.source.y)
            .attr("x2", (l) => l.target.x)
            .attr("y2", (l) => l.target.y);
          
          // Update weight labels
          svg.selectAll(".weight-label")
            .attr("x", (l) => (l.source.x + l.target.x) / 2)
            .attr("y", (l) => (l.source.y + l.target.y) / 2 - 10);
        }
      })
      .on("end", function(event, d) {
        d3.select(this).attr("stroke-width", 2.5);
        // Only update node position if there was actual dragging
        if (dragStartedRef.current) {
          setNodes((prev) => prev.map((n) => (n.id === d.id ? { ...n, x: d.x, y: d.y } : n)));
        } else {
          // If no drag occurred, treat it as a click
          if (pendingWeight && pendingWeight.source.id !== d.id) {
            const weight = parseFloat(weightInput) || 1;
            const newLink = { source: pendingWeight.source, target: d, weight };
            setUndoStack((prev) => [...prev, { type: "addLink", link: newLink }]);
            setLinks((prev) => [...prev, newLink]);
            setCreatingLink(null);
            setPendingWeight(null);
            setWeightInput("1");
          } else if (creatingLink && creatingLink.id !== d.id) {
            setPendingWeight({ source: creatingLink, target: d });
          } else if (!startNode) {
            setStartNode(d);
          } else {
            setCreatingLink(d);
          }
        }
        dragStartedRef.current = false;
      });

    // Draw nodes (using merge to update on re-render)
    const circles = svg
      .selectAll("circle")
      .data(nodes);
    
    circles.enter()
      .append("circle")
      .merge(circles)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 30)
      .attr("fill", (d) => {
        if (highlights.settled.has(d.id)) return colorSettled;
        if (d.id === highlights.current) return colorCurrent;
        if (startNode?.id === d.id) return colorStart;
        return colorDefault;
      })
      .attr("stroke", "#475569")
      .attr("stroke-width", 2.5)
      .style("cursor", "move")
      .call(drag)
    
    circles.exit().remove();

    // Node labels (ID) (with better contrast, using merge to update on drag)
    const nodeLabels = svg
      .selectAll(".node-label")
      .data(nodes, (d) => d.id);
    
    nodeLabels.enter()
      .append("text")
      .attr("class", "node-label")
      .merge(nodeLabels)
      .text((d) => d.id)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + 5)
      .attr("text-anchor", "middle")
      .attr("fill", (d) => {
        // Use white text for colored nodes, dark for default nodes
        if (highlights.settled.has(d.id) || d.id === highlights.current || startNode?.id === d.id) {
          return "#ffffff";
        }
        return "#1e293b";
      })
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("font-family", "system-ui, -apple-system, sans-serif")
      .attr("stroke", (d) => {
        // Add stroke for better visibility on colored nodes
        if (highlights.settled.has(d.id) || d.id === highlights.current || startNode?.id === d.id) {
          return "rgba(0, 0, 0, 0.4)";
        }
        return "none";
      })
      .attr("stroke-width", "0.5px")
      .style("pointer-events", "none");
    
    nodeLabels.exit().remove();

    // Distance label backgrounds (for better visibility)
    const nodesWithDistances = nodes.filter(d => {
      const dist = highlights.distances[d.id];
      return dist !== undefined;
    });
    
    const distanceBg = svg
      .selectAll(".distance-bg")
      .data(nodesWithDistances, d => d.id);
    
    distanceBg.enter()
      .append("rect")
      .attr("class", "distance-bg")
      .merge(distanceBg)
      .attr("x", (d) => {
        const dist = highlights.distances[d.id];
        const text = dist === Infinity ? "∞" : dist.toString();
        // Adjust width based on text length for better fit
        const textWidth = text.length * 9;
        return d.x - Math.max(22, textWidth / 2 + 8);
      })
      .attr("y", (d) => d.y - 58)
      .attr("width", (d) => {
        const dist = highlights.distances[d.id];
        const text = dist === Infinity ? "∞" : dist.toString();
        const textWidth = text.length * 9;
        return Math.max(44, textWidth + 16);
      })
      .attr("height", 26)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", "#FFD700")
      .attr("stroke", "#FF8C00")
      .attr("stroke-width", 2.5)
      .attr("opacity", 0.98)
      .style("pointer-events", "none");
    
    distanceBg.exit().remove();

    // Distance labels (improved visibility)
    const distanceLabels = svg
      .selectAll(".distance-label")
      .data(nodes, d => d.id);
    
    distanceLabels.enter()
      .append("text")
      .attr("class", "distance-label")
      .merge(distanceLabels)
      .text((d) => {
        const dist = highlights.distances[d.id];
        if (dist === undefined) return "";
        return dist === Infinity ? "∞" : dist.toString();
      })
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y - 45)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#000000")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("font-family", "Arial, Helvetica, sans-serif")
      .style("pointer-events", "none")
      .style("user-select", "none");
    
    distanceLabels.exit().remove();

    // Message background (moved to top for consistency)
    svg
      .append("rect")
      .attr("x", width / 2 - 240)
      .attr("y", 5)
      .attr("width", 480)
      .attr("height", 38)
      .attr("rx", 8)
      .attr("fill", "rgba(15, 23, 42, 0.95)")
      .attr("stroke", "rgba(34, 211, 238, 0.6)")
      .attr("stroke-width", 2)
      .attr("filter", "drop-shadow(0 2px 8px rgba(34, 211, 238, 0.3))");

    // Message (moved to top for consistency)
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 28)
      .attr("text-anchor", "middle")
      .attr("fill", "#67e8f9")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("font-family", "system-ui, -apple-system, sans-serif")
      .text(message);
  }, [nodes, links, index, startNode, creatingLink, actions, pendingWeight]);

  // Create node on click
  useEffect(() => {
    if (pendingWeight) return; // Don't create nodes when weight input is pending
    const svg = d3.select(svgRef.current);
    svg.on("click", function (event) {
      const [x, y] = d3.pointer(event);
      const newId = String.fromCharCode(65 + nodes.length);
      const newNode = { id: newId, x, y };
      setNodes((prev) => [...prev, newNode]);
      setUndoStack((prev) => [...prev, { type: "addNode", node: newNode }]);
    });
  }, [nodes, pendingWeight]);

  // Undo
  const handleUndo = () => {
    const last = undoStack[undoStack.length - 1];
    if (!last) return;
    
    if (last.type === "addNode") {
      setNodes((prev) => prev.filter((n) => n.id !== last.node.id));
    } else if (last.type === "addLink") {
      setLinks((prev) =>
        prev.filter(
          (l) =>
            !(
              l.source.id === last.link.source.id &&
              l.target.id === last.link.target.id
            )
        )
      );
    }
    setUndoStack(undoStack.slice(0, -1));
    setPendingWeight(null);
    setCreatingLink(null);
  };

  const handleWeightSubmit = () => {
    if (pendingWeight) {
      const weight = parseFloat(weightInput) || 1;
      const newLink = { source: pendingWeight.source, target: pendingWeight.target, weight };
      setUndoStack((prev) => [...prev, { type: "addLink", link: newLink }]);
      setLinks((prev) => [...prev, newLink]);
      setCreatingLink(null);
      setPendingWeight(null);
      setWeightInput("1");
    }
  };

  return (
    <div className={showNavbar ? "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "w-full"}>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "max-w-6xl mx-auto px-6 py-8" : "w-full"}>
        {showNavigator && <AlgorithmNavigator currentSlug="dijkstra" />}
        {showNavbar && (
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Dijkstra's Algorithm Visualizer
          </h1>
        )}

      {pendingWeight && (
        <div className="mb-4 bg-slate-800/40 backdrop-blur-md rounded-lg p-4 border border-cyan-500/20 shadow-xl shadow-cyan-900/20 max-w-md mx-auto">
          <p className="mb-2 text-cyan-100">Enter weight for edge {pendingWeight.source.id} → {pendingWeight.target.id}:</p>
          <div className="flex gap-2">
            <input
              type="number"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800/50 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
              min="0.1"
              step="0.1"
              autoFocus
            />
            <button
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all"
              onClick={handleWeightSubmit}
            >
              Add
            </button>
            <button
              className="px-4 py-2 rounded-xl bg-slate-700/50 border border-cyan-500/30 text-cyan-100 hover:bg-slate-700/70 hover:border-cyan-400/50 transition-all"
              onClick={() => {
                setPendingWeight(null);
                setCreatingLink(null);
                setWeightInput("1");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <button 
          className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all"
          onClick={() => (playing ? pause() : play())}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button 
          className="bg-slate-700/50 border border-cyan-500/30 text-cyan-100 hover:bg-slate-700/70 hover:border-cyan-400/50 px-3 py-2 rounded-xl transition-all"
          onClick={stepBackward}
        >
          ◀
        </button>
        <button 
          className="bg-slate-700/50 border border-cyan-500/30 text-cyan-100 hover:bg-slate-700/70 hover:border-cyan-400/50 px-3 py-2 rounded-xl transition-all"
          onClick={stepForward}
        >
          ▶
        </button>
        <button
          className="bg-slate-700/50 border border-cyan-500/30 text-cyan-100 hover:bg-slate-700/70 hover:border-cyan-400/50 px-4 py-2 rounded-xl transition-all"
          onClick={() => {
            reset();
            setNodes([]);
            setLinks([]);
            setStartNode(null);
            setUndoStack([]);
            setPendingWeight(null);
            setCreatingLink(null);
          }}
        >
          Reset
        </button>
        <button 
          className="bg-slate-700/50 border border-cyan-500/30 text-cyan-100 hover:bg-slate-700/70 hover:border-cyan-400/50 px-4 py-2 rounded-xl transition-all"
          onClick={handleUndo}
        >
          Undo
        </button>
        <div className="ml-4 flex items-center gap-2 text-cyan-100">
          <label>Speed:</label>
          <input
            type="range"
            min="100"
            max="1200"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="accent-cyan-500"
          />
        </div>
      </div>

      <svg
        ref={svgRef}
        width="800"
        height="500"
        className="mt-4 rounded-xl shadow-xl bg-slate-800/40 backdrop-blur-md border border-cyan-500/20 mx-auto block"
      ></svg>

      <div className="mt-6 w-full max-w-4xl mx-auto">
        <div className="bg-slate-800/40 backdrop-blur-md rounded-xl p-5 border border-cyan-500/20 shadow-xl shadow-cyan-900/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-sm font-semibold mb-1 text-cyan-300/70">Step Progress</div>
              <div className="text-2xl font-bold text-white">
                {index + 1} <span className="text-lg text-cyan-400/60">/ {actions.length || 0}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold mb-1 text-cyan-300/70">Time Complexity</div>
              <div className="text-xl font-mono font-bold text-cyan-400">O((V+E) log V)</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold mb-1 text-cyan-300/70">Space Complexity</div>
              <div className="text-xl font-mono font-bold text-cyan-400">O(V)</div>
            </div>
          </div>
          <div className="pt-4 border-t border-cyan-500/20">
            <div className="flex flex-wrap justify-center gap-4 text-sm mb-3 text-slate-200">
              <span><span className="text-emerald-400">🟩</span> Settled</span>
              <span><span className="text-amber-400">🟧</span> Current</span>
              <span><span className="text-yellow-400">🟡</span> Start</span>
              <span><span className="text-blue-400">🔵</span> Relaxing Edge</span>
            </div>
            <p className="text-xs text-center text-slate-300/70">
              🖱 Click to create nodes → Click one node then another to connect (enter weight) → Click a node to set start → Undo anytime.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
