import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function DynamicVisualization({ code, width = 800, height = 400, index = 0, actions = [] }) {
  const svgRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code || !svgRef.current) {
      if (!code) {
        console.warn('DynamicVisualization: No code provided');
      }
      return;
    }

    const svg = d3.select(svgRef.current);
    
    try {
      // Clear previous content (preserve defs for markers)
      const defsNode = svg.select("defs").node();
      const defsClone = defsNode ? defsNode.cloneNode(true) : null;
      svg.selectAll("*").remove();
      if (defsClone) {
        svg.node().appendChild(defsClone);
      }
      
      // Set SVG dimensions and viewBox for proper scaling
      svg.attr("width", width)
         .attr("height", height)
         .attr("viewBox", `0 0 ${width} ${height}`)
         .style("background-color", "transparent");

      // Clean the code: remove import/export statements and comments about them
      let cleanedCode = code;
      
      // Remove import statements (single-line and multi-line)
      cleanedCode = cleanedCode.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '');
      cleanedCode = cleanedCode.replace(/import\s+\([^)]*\)\s*from\s+['"].*?['"];?\s*/g, '');
      cleanedCode = cleanedCode.replace(/import\s+['"].*?['"];?\s*/g, '');
      
      // Remove export statements
      cleanedCode = cleanedCode.replace(/export\s+(default\s+)?(function|const|let|var|class)\s+/g, '$2 ');
      cleanedCode = cleanedCode.replace(/export\s+{.*?};?\s*/g, '');
      cleanedCode = cleanedCode.replace(/export\s+.*?;?\s*/g, '');

      // Replace common patterns that won't work in our context
      // Replace d3.select("svg") with the provided svg variable
      cleanedCode = cleanedCode.replace(/const\s+svg\s*=\s*d3\.select\(["']svg["']\)/g, '// svg is already provided');
      cleanedCode = cleanedCode.replace(/let\s+svg\s*=\s*d3\.select\(["']svg["']\)/g, '// svg is already provided');
      cleanedCode = cleanedCode.replace(/var\s+svg\s*=\s*d3\.select\(["']svg["']\)/g, '// svg is already provided');
      cleanedCode = cleanedCode.replace(/d3\.select\(["']svg["']\)/g, 'svg');
      cleanedCode = cleanedCode.replace(/d3\.select\(`svg`\)/g, 'svg');
      
      // Replace width/height from SVG attributes with provided parameters
      cleanedCode = cleanedCode.replace(/const\s+width\s*=\s*\+svg\.attr\(["']width["']\)/g, '// width is already provided');
      cleanedCode = cleanedCode.replace(/const\s+height\s*=\s*\+svg\.attr\(["']height["']\)/g, '// height is already provided');
      cleanedCode = cleanedCode.replace(/const\s+width\s*=\s*svg\.attr\(["']width["']\)/g, '// width is already provided');
      cleanedCode = cleanedCode.replace(/const\s+height\s*=\s*svg\.attr\(["']height["']\)/g, '// height is already provided');
      cleanedCode = cleanedCode.replace(/let\s+width\s*=\s*\+svg\.attr\(["']width["']\)/g, '// width is already provided');
      cleanedCode = cleanedCode.replace(/let\s+height\s*=\s*\+svg\.attr\(["']height["']\)/g, '// height is already provided');
      cleanedCode = cleanedCode.replace(/var\s+width\s*=\s*\+svg\.attr\(["']width["']\)/g, '// width is already provided');
      cleanedCode = cleanedCode.replace(/var\s+height\s*=\s*\+svg\.attr\(["']height["']\)/g, '// height is already provided');

      // Trim whitespace
      cleanedCode = cleanedCode.trim();

      if (!cleanedCode) {
        throw new Error('Code is empty after removing import/export statements. Please write D3 code without import statements - d3 is already available.');
      }

      console.log('Executing D3 code with dimensions:', { width, height });
      console.log('Cleaned code preview:', cleanedCode.substring(0, 200) + '...');

      // Create a safe execution context
      // Educators can use: d3, svg (D3 selection), width, height, index, actions
      const executeCode = new Function(
        'd3',
        'svg',
        'width',
        'height',
        'index',
        'actions',
        'console',
        `
        try {
          // Make console available in the code
          ${cleanedCode}
        } catch (error) {
          console.error('D3 visualization error:', error);
          console.error('Error stack:', error.stack);
          throw error;
        }
        `
      );

      executeCode(d3, svg, width, height, index, actions, console);
      
      // Immediately check what was rendered
      const elementCount = svg.selectAll("*").size();
      const visibleElements = svg.selectAll("circle, rect, line, path:not(defs path), text").size();
      console.log('Elements rendered immediately:', elementCount, 'Visible elements:', visibleElements);
      console.log('SVG children:', Array.from(svg.node().children).map(c => `${c.tagName} (${c.children.length} children)`));
      
      // Wait a bit for async operations, then check again
      setTimeout(() => {
        const hasContent = svg.selectAll("*").size() > 0;
        const finalCount = svg.selectAll("*").size();
        const finalVisible = svg.selectAll("circle, rect, line, path:not(defs path), text").size();
        console.log('Elements rendered after timeout:', hasContent, 'Total:', finalCount, 'Visible:', finalVisible);
        console.log('SVG dimensions:', { width: svg.attr('width'), height: svg.attr('height') });
        
        // Check if there are any visible elements (excluding defs)
        if (finalVisible === 0 && finalCount > 0) {
          console.log('Only defs elements found - graph is empty (this is normal for initial state)');
          // Add a helpful message for empty graph
          svg.append("text")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .attr("fill", "#94a3b8")
            .attr("font-size", "16px")
            .attr("opacity", 0.7)
            .text("Click to add nodes, drag to create edges");
        } else if (finalVisible === 0) {
          console.warn('DynamicVisualization: No visible elements rendered');
          // Try to render a test element to verify SVG is working
          svg.append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", 20)
            .attr("fill", "red")
            .attr("opacity", 0.8);
          console.log('Test circle added - if you see a red circle, SVG is working');
        }
      }, 200);
      
      setError(null);
    } catch (err) {
      console.error('Error executing visualization code:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      
      let errorMessage = err.message || 'Unknown error occurred';
      
      // Provide helpful error messages
      if (errorMessage.includes('import') || errorMessage.includes('Cannot use import')) {
        errorMessage = 'Import statements are not allowed. The d3 library is already available - just use d3 directly (e.g., d3.select(), d3.scaleLinear(), etc.).';
      }
      
      setError(errorMessage);
      
      // Show error in SVG
      svg.selectAll("*").remove();
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 - 20)
        .attr("text-anchor", "middle")
        .attr("fill", "#ef4444")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .text("Visualization Error");
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#ef4444")
        .attr("font-size", "12px")
        .attr("style", "max-width: 90%; word-wrap: break-word;")
        .text(errorMessage.length > 60 ? errorMessage.substring(0, 60) + '...' : errorMessage);
    }
  }, [code, width, height, index, actions]);

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          <strong>Visualization Error:</strong> {error}
        </div>
      )}
      <svg
        ref={svgRef}
        className="w-full border border-cyan-500/30 rounded-lg bg-slate-900/50"
        style={{ 
          minHeight: height,
          display: 'block',
          backgroundColor: 'rgba(15, 23, 42, 0.5)'
        }}
        width={width}
        height={height}
      />
    </div>
  );
}

