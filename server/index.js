import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });
import express from "express";
import questionnaireRoutes from "./routers/businessQuestionnaire.js";
import cors from "cors";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use("/api/questionnaire", questionnaireRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message || "Something went wrong",
  });
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
