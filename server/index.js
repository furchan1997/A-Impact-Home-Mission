import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" }); // טעינת משתני סביבה מקובץ .env
import express from "express";
import questionnaireRoutes from "./routers/businessQuestionnaire.js";
import cors from "cors";
const app = express();

// MIDDLEWARE
app.use(cors()); // מאפשר בקשות ממקורות חיצוניים (CORS)
app.use(express.json()); // מאפשר קריאה ל־req.body בפורמט JSON

// ROUTES
app.use("/api/questionnaire", questionnaireRoutes); // ראוטר ייעודי לשאלון רישוי עסקים

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack); // לוג של השגיאה לשרת
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message || "Something went wrong",
  });
});

// START SERVER
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`); // הודעת שרת פעיל בקונסול
});
