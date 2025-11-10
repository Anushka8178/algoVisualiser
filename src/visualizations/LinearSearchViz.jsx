import React, { useEffect, useMemo, useState, useRef } from "react";
import * as d3 from "d3";
import { linearSearchSteps } from "../algos/linearSearchSteps";
import { usePlayer } from "../hooks/usePlayer";
import Navbar from "../components/Navbar";
import AlgorithmNavigator from "../components/AlgorithmNavigator";

export default function LinearSearchViz({ showNavbar = true, showNavigator = true }) {
  const [input, setInput] = useState("10, 25, 30, 45, 50, 60, 75");
  const [target, setTarget] = useState(50);
  const [array, setArray] = useState([]);
  const svgRef = useRef(null);

  const actions = useMemo(
    () => (array.length ? linearSearchSteps(array, target) : []),
    [array, target]
  );

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
  } = usePlayer(actions, 400);

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
    let message = "";
    let highlights = { current: null, found: null, checked: new Set() };

    for (let i = 0; i <= index && i < actions.length; i++) {
      const a = actions[i];

      if (a.type === "check") {
        highlights.current = a.index;
        highlights.checked.add(a.index);
        message = `Checking element at index ${a.index}: ${arr[a.index]}`;
      }

      if (a.type === "notFound") {
        highlights.checked.add(a.index);
        message = `${arr[a.index]} ≠ ${target}, moving to next element...`;
      }

      if (a.type === "found") {
        highlights.found = a.index;
        highlights.current = null;
        message = `🎯 Found target ${arr[a.index]} at index ${a.index}`;
      }

      if (a.type === "done" && highlights.found === null) {
        message = "❌ Target not found in array.";
        highlights.current = null;
      }
    }

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
        if (i === highlights.found) return "#10b981";
        if (highlights.found !== null) return "#64748b";
        if (i === highlights.current) return "#f59e0b";
        if (highlights.checked.has(i) && highlights.found === null) return "#ef4444";
        return "#94a3b8";
      })
      .transition()
      .duration(200)
      .ease(d3.easeCubicOut);

    svg
      .selectAll("text.value")
      .data(arr)
      .enter()
      .append("text")
      .attr("class", "value")
      .text((d) => d)
      .attr("x", (_, i) => i * barWidth + barWidth / 2)
      .attr("y", (d) => height - scaleY(d) - 10)
      .attr("fill", (_, i) => {
        if (i === highlights.found || i === highlights.current || (highlights.checked.has(i) && highlights.found === null)) {
          return "#ffffff";
        }
        return "#0f172a";
      })
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("stroke", (_, i) => {
        if (i === highlights.found || i === highlights.current || (highlights.checked.has(i) && highlights.found === null)) {
          return "rgba(0, 0, 0, 0.3)";
        }
        return "none";
      })
      .attr("stroke-width", "0.5px");

    const messageColor = highlights.found !== null ? "#00ff88" : highlights.current !== null ? "#67e8f9" : "#ef4444";
    svg
      .append("rect")
      .attr("x", width / 2 - 240)
      .attr("y", 5)
      .attr("width", 480)
      .attr("height", 38)
      .attr("rx", 8)
      .attr("fill", "rgba(15, 23, 42, 0.95)")
      .attr("stroke", highlights.found !== null ? "rgba(0, 255, 136, 0.6)" : highlights.current !== null ? "rgba(34, 211, 238, 0.6)" : "rgba(239, 68, 68, 0.6)")
      .attr("stroke-width", 2)
      .attr("filter", highlights.found !== null ? "drop-shadow(0 2px 8px rgba(0, 255, 136, 0.3))" : highlights.current !== null ? "drop-shadow(0 2px 8px rgba(34, 211, 238, 0.3))" : "drop-shadow(0 2px 8px rgba(239, 68, 68, 0.3))");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 28)
      .attr("text-anchor", "middle")
      .attr("fill", messageColor)
      .attr("font-size", highlights.found !== null ? "20px" : "18px")
      .attr("font-weight", "bold")
      .attr("font-family", "system-ui, -apple-system, sans-serif")
      .text(message);
  }, [index, array, actions, target]);

  const handleVisualize = () => {
    let parsed = input
      .split(",")
      .map((num) => Number(num.trim()))
      .filter((n) => !isNaN(n));

    if (parsed.length < 2) {
      alert("Please enter at least two valid numbers separated by commas.");
      return;
    }

    setArray(parsed);
    reset();
  };

  const generateRandomArray = () => {
    const randomArr = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 90) + 10
    );
    setInput(randomArr.join(", "));
    setArray(randomArr);
    reset();
  };

  const handleReplay = () => {
    reset();
    setTimeout(() => play(), 100);
  };

  return (
    <div className={showNavbar ? "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "w-full"}>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "max-w-6xl mx-auto px-6 py-8" : "w-full"}>
        {showNavigator && <AlgorithmNavigator currentSlug="linear-search" />}
        {showNavbar && (
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Linear Search Visualization
          </h1>
        )}

      <div className="mb-6 w-full max-w-2xl mx-auto text-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-3/4 md:w-1/2 px-4 py-3 rounded-xl bg-slate-800/50 border border-cyan-500/30 text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
          placeholder="Enter numbers (e.g., 10, 25, 30, 45)"
        />
        <input
          type="text"
          value={target}
          onChange={(e) => {
            const clean = e.target.value.replace(/^0+/, "");
            setTarget(Number(clean || 0));
          }}
          className="w-24 px-3 py-3 ml-3 rounded-xl bg-slate-800/50 border border-cyan-500/30 text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all text-center"
          placeholder="Target"
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
            <button
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all"
              onClick={handleReplay}
            >
              Replay
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

          <svg
            ref={svgRef}
            width="800"
            height="350"
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
                  <div className="text-xl font-mono font-bold text-cyan-400">O(n)</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold mb-1 text-cyan-300/70">Space Complexity</div>
                  <div className="text-xl font-mono font-bold text-cyan-400">O(1)</div>
                </div>
              </div>
              <div className="pt-4 border-t border-cyan-500/20">
                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-200">
                  <span><span className="text-amber-400">🟧</span> Current</span>
                  <span><span className="text-red-400">🔴</span> Checked</span>
                  <span><span className="text-emerald-400">🟩</span> Found</span>
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

