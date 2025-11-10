import React, { useEffect, useMemo, useState, useRef } from "react";
import * as d3 from "d3";
import { insertionSortSteps } from "../algos/insertionSortSteps";
import { usePlayer } from "../hooks/usePlayer";
import Navbar from "../components/Navbar";
import AlgorithmNavigator from "../components/AlgorithmNavigator";

export default function InsertionSortViz({ showNavbar = true, showNavigator = true }) {
  const [input, setInput] = useState("28, 31, 35, 37, 40, 47, 48, 52");
  const [array, setArray] = useState([]);
  const svgRef = useRef(null);

  const actions = useMemo(() => (array.length ? insertionSortSteps(array) : []), [array]);

  const {
    index,
    playing,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    speed,
    setSpeed,
  } = usePlayer(actions, 300);

  useEffect(() => {
    if (!array.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 350;
    const barWidth = width / array.length;
    const maxVal = d3.max(array);
    const scaleY = d3.scaleLinear().domain([0, maxVal]).range([0, height * 0.8]);

    let arr = [...array];
    const highlights = { 
      select: null, 
      keyValue: null,
      compare: [], 
      shift: { from: null, to: null },
      insert: null,
      sorted: [] 
    };
    let message = "";
    let isDone = false;

    // ✅ persist sorted indices
    const sortedSet = new Set();

    for (let i = 0; i <= index && i < actions.length; i++) {
      const a = actions[i];

      if (a.type === "select") {
        highlights.select = a.index;
        highlights.keyValue = a.keyValue;
        highlights.compare = [];
        highlights.shift = { from: null, to: null };
        highlights.insert = null;
        message = a.message || `Selecting ${a.keyValue} to insert`;
      }
      if (a.type === "compare") {
        highlights.compare = a.indices;
        highlights.keyValue = a.keyValue;
        message = a.message || `Comparing ${arr[a.indices[0]]} with ${a.keyValue}`;
      }
      if (a.type === "shift") {
        arr = a.array;
        highlights.shift = { from: a.fromIndex, to: a.toIndex };
        highlights.keyValue = a.keyValue;
        highlights.compare = [];
        message = a.message || `Shifting ${arr[a.toIndex]} to position ${a.toIndex}`;
      }
      if (a.type === "insert") {
        arr = a.array;
        highlights.insert = a.index;
        highlights.keyValue = a.keyValue;
        highlights.shift = { from: null, to: null };
        highlights.compare = [];
        highlights.select = null;
        message = a.message || `Inserting ${a.keyValue} at position ${a.index}`;
      }
      if (a.type === "markSorted") {
        sortedSet.add(a.index);
      }
      if (a.type === "done") {
        arr = a.array;
        for (let k = 0; k < arr.length; k++) sortedSet.add(k);
        isDone = true;
        message = "🎉 Sorting completed!";
      }
    }

    highlights.sorted = Array.from(sortedSet);

    // Bars
    svg
      .selectAll("rect")
      .data(arr)
      .enter()
      .append("rect")
      .attr("x", (_, i) => i * barWidth + 5)
      .attr("y", (d) => height - scaleY(d))
      .attr("width", barWidth - 10)
      .attr("height", (d) => scaleY(d))
      .attr("rx", 6)
      .attr("fill", (_, i) => {
        if (isDone) return "#10b981"; // emerald green when done
        if (highlights.insert === i) return "#8b5cf6"; // purple for inserting
        if (highlights.shift?.to === i || highlights.shift?.from === i) return "#ef4444"; // red for shifting
        if (highlights.compare?.includes(i)) return "#f59e0b"; // amber orange for comparing
        if (highlights.select === i) return "#3b82f6"; // blue for selected key
        if (highlights.sorted?.includes(i)) return "#10b981"; // emerald green for sorted
        return "#94a3b8"; // slate-400 for default bars
      })
      .attr("stroke", (_, i) => {
        if (highlights.select === i) {
          return "#1d4ed8";
        }
        if (highlights.insert === i) {
          return "#7c3aed";
        }
        return "none";
      })
      .attr("stroke-width", (_, i) => {
        if (highlights.select === i || highlights.insert === i) {
          return 3;
        }
        return 0;
      });

    // Numbers inside bars (with better contrast)
    svg
      .selectAll("text")
      .data(arr)
      .enter()
      .append("text")
      .text((d) => d)
      .attr("x", (_, i) => i * barWidth + barWidth / 2)
      .attr("y", (d) => height - scaleY(d) - 10)
      .attr("fill", (_, i) => {
        // Use white text for colored bars, dark for default bars
        if (isDone || highlights.sorted?.includes(i) || highlights.insert === i || 
            highlights.shift?.to === i || highlights.shift?.from === i || 
            highlights.compare?.includes(i) || highlights.select === i) {
          return "#ffffff";
        }
        return "#0f172a";
      })
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("stroke", (_, i) => {
        // Add stroke for better visibility on colored bars
        if (isDone || highlights.sorted?.includes(i) || highlights.insert === i || 
            highlights.shift?.to === i || highlights.shift?.from === i || 
            highlights.compare?.includes(i) || highlights.select === i) {
          return "rgba(0, 0, 0, 0.3)";
        }
        return "none";
      })
      .attr("stroke-width", "0.5px");

    // Status message background (for better visibility)
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

    // Status text (moved to top)
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
  }, [index, array, actions]);

  // Input handling
  const handleVisualize = () => {
    try {
      const parsed = input
        .split(",")
        .map((num) => parseInt(num.trim()))
        .filter((n) => !isNaN(n));
      if (parsed.length < 2) {
        alert("Please enter at least two valid numbers separated by commas.");
        return;
      }
      setArray(parsed);
      reset();
    } catch {
      alert("Invalid input! Enter numbers separated by commas.");
    }
  };

  // Random array generation
  const generateRandomArray = () => {
    const randomArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 80) + 10);
    setInput(randomArr.join(", "));
    setArray(randomArr);
    reset();
  };

  return (
    <div className={showNavbar ? "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "w-full"}>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "max-w-6xl mx-auto px-6 py-8" : "w-full"}>
        {showNavigator && <AlgorithmNavigator currentSlug="insertion-sort" />}
        {showNavbar && (
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Insertion Sort Visualization
          </h1>
        )}

      {/* Input Section */}
      <div className="mb-6 w-full max-w-2xl mx-auto text-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-3/4 md:w-1/2 px-4 py-3 rounded-xl bg-slate-800/50 border border-cyan-500/30 text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
          placeholder="Enter numbers separated by commas (e.g., 5, 3, 9, 1)"
        />
        <button
          onClick={handleVisualize}
          className="ml-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          Visualize
        </button>
        <button
          onClick={generateRandomArray}
          className="ml-2 bg-slate-700/50 border border-cyan-500/30 text-cyan-100 hover:bg-slate-700/70 hover:border-cyan-400/50 font-semibold px-4 py-2 rounded-xl transition-all"
        >
          Random
        </button>
      </div>

      {/* Controls */}
      {array.length > 0 && (
        <>
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
              onClick={reset}
            >
              Reset
            </button>
            <div className="ml-4 flex items-center gap-2 text-cyan-100">
              <label>Speed:</label>
              <input
                type="range"
                min="50"
                max="1000"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="accent-cyan-500"
              />
            </div>
          </div>

          {/* Visualization Canvas */}
          <svg
            ref={svgRef}
            width="800"
            height="350"
            className="mt-4 rounded-xl shadow-xl bg-slate-800/40 backdrop-blur-md border border-cyan-500/20"
          ></svg>

          {/* Info */}
          <div className="mt-6 w-full max-w-4xl">
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
                  <div className="text-xl font-mono font-bold text-cyan-400">O(n²)</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold mb-1 text-cyan-300/70">Space Complexity</div>
                  <div className="text-xl font-mono font-bold text-cyan-400">O(1)</div>
                </div>
              </div>
              <div className="pt-4 border-t border-cyan-500/20">
                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-200">
                  <span><span className="text-blue-400">🔵</span> Selected</span>
                  <span><span className="text-amber-400">🟧</span> Compare</span>
                  <span><span className="text-red-400">🟥</span> Shift</span>
                  <span><span className="text-purple-400">🟣</span> Insert</span>
                  <span><span className="text-emerald-400">🟩</span> Sorted</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
}

