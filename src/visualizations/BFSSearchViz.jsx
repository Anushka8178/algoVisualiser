import React, { useEffect, useState, useRef, useMemo } from "react";
import * as d3 from "d3";
import { bfsSteps } from "../algos/bfsSteps";
import { usePlayer } from "../hooks/usePlayer";
import Navbar from "../components/Navbar";
import AlgorithmNavigator from "../components/AlgorithmNavigator";

export default function BFSInteractivePro({ showNavbar = true, showNavigator = true }) {
  const svgRef = useRef();
  const dragStartedRef = useRef(false);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [startNode, setStartNode] = useState(null);
  const [creatingLink, setCreatingLink] = useState(null);
  const [undoStack, setUndoStack] = useState([]);

  const graph = useMemo(() => {
    const g = {};
    nodes.forEach((n) => (g[n.id] = []));
    links.forEach((l) => g[l.source.id].push(l.target.id));
    return g;
  }, [nodes, links]);

  const actions = useMemo(() => {
    if (!startNode || !Object.keys(graph).length) return [];
    return bfsSteps(graph, startNode.id);
  }, [graph, startNode]);

  const { index, playing, play, pause, reset, stepForward, stepBackward, speed, setSpeed } =
    usePlayer(actions, 900);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const width = 800, height = 500;

    const colorVisited = "#10b981";
    const colorCurrent = "#f59e0b";
    const colorQueued = "#3b82f6";
    const colorStart = "#eab308";

    let highlights = { current: null, visited: new Set(), queue: [] };
    let message = "";

    for (let i = 0; i <= index && i < actions.length; i++) {
      const a = actions[i];
      if (a.type === "start") message = `Starting BFS from ${startNode?.id}`;
      if (a.type === "enqueue") {
        highlights.queue = a.queue;
        message = `Enqueued ${a.node}`;
      }
      if (a.type === "dequeue") {
        highlights.current = a.node;
        message = `Dequeued ${a.node}`;
      }
      if (a.type === "visit") {
        highlights.visited = new Set(a.visited);
        message = `Visiting ${a.node}`;
      }
      if (a.type === "done") message = `🎉 BFS Completed!`;
    }

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
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr("opacity", 0.7)
      .attr("marker-end", "url(#arrow)");

    edges.exit().remove();

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

    const drag = d3.drag()
      .clickDistance(8)
      .on("start", function(event, d) {
        dragStartedRef.current = false;
        d3.select(this).raise().attr("stroke-width", 3.5);
      })
      .on("drag", function(event, d) {
        dragStartedRef.current = true;
        d.x = event.x;
        d.y = event.y;
        d3.select(this)
          .attr("cx", d.x)
          .attr("cy", d.y);

        svg.selectAll("text.node-label")
          .filter((label) => label.id === d.id)
          .attr("x", d.x)
          .attr("y", d.y + 6);

        svg.selectAll("line")
          .attr("x1", (l) => l.source.x)
          .attr("y1", (l) => l.source.y)
          .attr("x2", (l) => l.target.x)
          .attr("y2", (l) => l.target.y);
      })
      .on("end", function(event, d) {
        d3.select(this).attr("stroke-width", 2.5);
        
        if (dragStartedRef.current) {
          setNodes((prev) => prev.map((n) => (n.id === d.id ? { ...n, x: d.x, y: d.y } : n)));
          dragStartedRef.current = false;
        } else {
          const nodeData = d;
          setTimeout(() => {
            if (creatingLink && creatingLink.id !== nodeData.id) {
              const newLink = { source: creatingLink, target: nodeData };
              setUndoStack((prev) => [...prev, { type: "addLink", link: newLink }]);
              setLinks((prev) => [...prev, newLink]);
              setCreatingLink(null);
            } else if (!startNode) {
              setStartNode(nodeData);
            } else {
              setCreatingLink(nodeData);
            }
          }, 10);
        }
      });

    const circles = svg
      .selectAll("circle")
      .data(nodes);

    circles.enter()
      .append("circle")
      .merge(circles)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 25)
      .attr("fill", (d) => {
        if (highlights.visited.has(d.id)) return colorVisited;
        if (d.id === highlights.current) return colorCurrent;
        if (highlights.queue.includes(d.id)) return colorQueued;
        if (startNode?.id === d.id) return colorStart;
        return "#cbd5e1";
      })
      .attr("stroke", "#475569")
      .attr("stroke-width", 2.5)
      .style("cursor", "move")
      .call(drag)

    circles.exit().remove();

    const labels = svg
      .selectAll("text.node-label")
      .data(nodes, (d) => d.id);

    labels.enter()
      .append("text")
      .attr("class", "node-label")
      .merge(labels)
      .text((d) => d.id)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + 6)
      .attr("text-anchor", "middle")
      .attr("fill", (d) => {

        if (highlights.visited.has(d.id) || d.id === highlights.current || highlights.queue.includes(d.id) || startNode?.id === d.id) {
          return "#ffffff";
        }
        return "#1e293b";
      })
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("font-family", "system-ui, -apple-system, sans-serif")
      .attr("stroke", (d) => {

        if (highlights.visited.has(d.id) || d.id === highlights.current || highlights.queue.includes(d.id) || startNode?.id === d.id) {
          return "rgba(0, 0, 0, 0.4)";
        }
        return "none";
      })
      .attr("stroke-width", "0.5px")
      .style("pointer-events", "none");

    labels.exit().remove();

    svg
      .append("rect")
      .attr("x", width / 2 - 220)
      .attr("y", 5)
      .attr("width", 440)
      .attr("height", 38)
      .attr("rx", 8)
      .attr("fill", "rgba(15, 23, 42, 0.95)")
      .attr("stroke", "rgba(34, 211, 238, 0.6)")
      .attr("stroke-width", 2)
      .attr("filter", "drop-shadow(0 2px 8px rgba(34, 211, 238, 0.3))");

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
  }, [nodes, links, index, startNode, creatingLink, actions]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.on("click", function (event) {
      const [x, y] = d3.pointer(event);
      const newId = String.fromCharCode(65 + nodes.length);
      const newNode = { id: newId, x, y };
      setNodes((prev) => [...prev, newNode]);
      setUndoStack((prev) => [...prev, { type: "addNode", node: newNode }]);
    });
  }, [nodes]);

  const handleUndo = () => {
    const last = undoStack.pop();
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
    setUndoStack([...undoStack]);
  };

  return (
    <div className={showNavbar ? "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "w-full"}>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "max-w-6xl mx-auto px-6 py-8" : "w-full"}>
        {showNavigator && <AlgorithmNavigator currentSlug="bfs" />}
        {showNavbar && (
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            BFS Visualizer
          </h1>
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
          className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all"
          onClick={() => {
            reset();
            setTimeout(() => play(), 100);
          }}
          disabled={actions.length === 0}
        >
          Replay
        </button>
        <button
          className="bg-slate-700/50 border border-cyan-500/30 text-cyan-100 hover:bg-slate-700/70 hover:border-cyan-400/50 px-4 py-2 rounded-xl transition-all"
          onClick={() => {
            reset();
            setNodes([]);
            setLinks([]);
            setStartNode(null);
            setUndoStack([]);
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
              <div className="text-xl font-mono font-bold text-cyan-400">O(V + E)</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold mb-1 text-cyan-300/70">Space Complexity</div>
              <div className="text-xl font-mono font-bold text-cyan-400">O(V)</div>
            </div>
          </div>
          <div className="pt-4 border-t border-cyan-500/20">
            <div className="flex flex-wrap justify-center gap-4 text-sm mb-3 text-slate-200">
              <span><span className="text-emerald-400">🟩</span> Visited</span>
              <span><span className="text-amber-400">🟧</span> Current</span>
              <span><span className="text-blue-400">🔵</span> Queue</span>
              <span><span className="text-yellow-400">🟡</span> Start</span>
            </div>
            <p className="text-xs text-center text-slate-300/70">
              🖱 Click to create nodes → Click one node then another to connect → Click a node to set start → Undo anytime.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
