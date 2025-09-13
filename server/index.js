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

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
