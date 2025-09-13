import { Router } from "express";
import { matchRules } from "../matchRules.js";
import { buildReport } from "../../server/services/aiReport.js";
const router = Router();

// יצירת אובייקט חדש אשר יביא את הנתונים של שאלון עוסק
router.post("/", async (req, res) => {
  const { fullName, bizSize, seats, alcohol, servingFood, gas } = req.body;
  const matchedRules = matchRules({ seats, alcohol, servingFood, gas }) || [];

  const aiReport = await buildReport({
    inputs: { fullName, bizSize, seats, alcohol, servingFood, gas },
    matchedRules,
  });

  res.status(201).json({
    matchedRules,
    aiReport,
  });
});

export default router;
