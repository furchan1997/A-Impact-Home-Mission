import { Router } from "express";
import { matchRules } from "../../data/matchRules.js";
import { buildReport } from "../../server/services/aiReport.js";
import { businessQuestionnaireSchema } from "../validation/businessQuestionnaireSchema.js";
const router = Router();

// ראוט יעודיי עבור שליחת בקשה לשרת
router.post("/", async (req, res, next) => {
  try {
    // ולידציה עם JOI, והחזרת כל השגיאות עם שם השדה יחד עם ההודעה התואמת לה
    const { error } = businessQuestionnaireSchema(req.body);
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));
      // נעצור את התסריט ונחזיר את השגיאה יחד עם הסטטוס במקרה הצורך
      res.status(400).json({ errors });
      return;
    }

    // שליפת הנתונים הלוונטיים מהבקשה
    const { bizName, bizSize, seats, alcohol, servingFood, gas } = req.body;
    // קבלת מערך ההתאמות ופירוק הארגומנטים למען עבודה נוחה יותר
    const matchedRules = matchRules({ seats, alcohol, servingFood, gas }) || [];
    // יצירת דו"ח מותאם עם AI, כולל נתוני העסק + חוקים מותאמים
    const aiReport = await buildReport({
      inputs: { bizName, bizSize, seats, alcohol, servingFood, gas },
      matchedRules,
    });
    // החזרת תשובה ללקוח עם סטטוס תקין ותוכן הדו"ח
    res.status(200).json({
      matchedRules,
      aiReport,
    });
  } catch (err) {
    next(err); // טיפול גלובלי בשגיאות
  }
});

export default router;
