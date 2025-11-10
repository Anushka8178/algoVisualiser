import * as d3 from "d3";
import { useEffect, useRef } from "react";

export function useArrayRenderer(containerId, width = 800, height = 350) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(`#${containerId}`);
    if (!svg.empty()) {
      svg.selectAll("*").remove();
      svg
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");
      svg.append("g").attr("class", "bars");
      svg.append("g").attr("class", "labels");
      svg.append("g").attr("class", "status");
    }
  }, [containerId, width, height]);

  function render(arr = [], highlights = {}, message = "") {
    if (!arr || arr.length === 0) return;

    const svg = d3.select(`#${containerId}`);
    if (svg.empty()) return;

    const barsGroup = svg.select(".bars");
    const labelsGroup = svg.select(".labels");

    const barWidth = width / arr.length;
    const maxVal = d3.max(arr);
    const scaleY = d3.scaleLinear().domain([0, maxVal]).range([0, height * 0.8]);

    const bars = barsGroup.selectAll("rect").data(arr, (_, i) => i);
    bars
      .enter()
      .append("rect")
      .attr("rx", 6)
      .attr("x", (_, i) => i * barWidth + 4)
      .attr("width", barWidth - 8)
      .attr("y", (d) => height - scaleY(d))
      .attr("height", (d) => scaleY(d))
      .attr("fill", "rgba(255,255,255,0.7)")
      .merge(bars)
      .transition()
      .duration(250)
      .attr("y", (d) => height - scaleY(d))
      .attr("height", (d) => scaleY(d))
      .attr("fill", (_, i) => {
        if (highlights.swap?.includes(i)) return "#f44336";
        if (highlights.compare?.includes(i)) return "#ff9800";
        if (highlights.sorted?.includes(i)) return "#4caf50";
        return "rgba(255,255,255,0.7)";
      });
    bars.exit().remove();

    const labels = labelsGroup.selectAll("text").data(arr, (_, i) => i);
    labels
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .merge(labels)
      .transition()
      .duration(250)
      .attr("x", (_, i) => i * barWidth + barWidth / 2)
      .attr("y", (d) => height - scaleY(d) - 10)
      .text((d) => d);
    labels.exit().remove();

    const statusGroup = svg.select(".status");
    const statusText = statusGroup.selectAll("text").data([message]);
    statusText
      .enter()
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "white")
      .merge(statusText)
      .text(message);
  }

  return { render };
}
