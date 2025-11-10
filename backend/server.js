import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import algorithmRoutes from "./routes/algorithmRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

import "./models/User.js";
import Algorithm from "./models/Algorithm.js";
import "./models/Note.js";
import "./models/UserProgress.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/algorithms", algorithmRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/progress", progressRoutes);

sequelize.sync({ alter: true }).then(async () => {
  console.log("Database connected ✅");

  const count = await Algorithm.count();
  if (count === 0) {
    await Algorithm.bulkCreate([
      { title: "Bubble Sort", category: "Sorting", description: "Simple comparison sort", complexity: "O(n^2)", slug: "bubble-sort" },
      { title: "Quick Sort", category: "Sorting", description: "Divide and conquer sort", complexity: "O(n log n)", slug: "quick-sort" },
      { title: "Merge Sort", category: "Sorting", description: "Divide and conquer merge", complexity: "O(n log n)", slug: "merge-sort" },
      { title: "Insertion Sort", category: "Sorting", description: "Builds sorted array one element at a time", complexity: "O(n^2)", slug: "insertion-sort" },
      { title: "Binary Search", category: "Searching", description: "Search in sorted array", complexity: "O(log n)", slug: "binary-search" },
      { title: "Linear Search", category: "Searching", description: "Sequential search in array", complexity: "O(n)", slug: "linear-search" },
      { title: "Breadth-First Search", category: "Graph", description: "Layer-by-layer traversal", complexity: "O(V+E)", slug: "bfs" },
      { title: "Depth-First Search", category: "Graph", description: "Depth traversal", complexity: "O(V+E)", slug: "dfs" },
      { title: "Dijkstra's Algorithm", category: "Graph", description: "Shortest path in weighted graph", complexity: "O((V+E) log V)", slug: "dijkstra" },
    ]);
    console.log("Algorithms seeded ✅");
  } else {

    const insertionSort = await Algorithm.findOne({ where: { slug: "insertion-sort" } });
    if (!insertionSort) {
      await Algorithm.create({
        title: "Insertion Sort",
        category: "Sorting",
        description: "Builds sorted array one element at a time",
        complexity: "O(n^2)",
        slug: "insertion-sort"
      });
      console.log("Insertion Sort added to database ✅");
    }

    const linearSearch = await Algorithm.findOne({ where: { slug: "linear-search" } });
    if (!linearSearch) {
      await Algorithm.create({
        title: "Linear Search",
        category: "Searching",
        description: "Sequential search in array",
        complexity: "O(n)",
        slug: "linear-search"
      });
      console.log("Linear Search added to database ✅");
    }
  }

  app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});
