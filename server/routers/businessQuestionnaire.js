import { Router } from "express";
import { matchRules } from "../../data/matchRules.js";
import { buildReport } from "../../server/services/aiReport.js";
import { businessQuestionnaireSchema } from "../validation/businessQuestionnaireSchema.js";
const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { error } = businessQuestionnaireSchema(req.body);
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));

      res.status(400).json({ errors });
      return;
    }
    const { fullName, bizSize, seats, alcohol, servingFood, gas } = req.body;
    const matchedRules = matchRules({ seats, alcohol, servingFood, gas }) || [];

    const aiReport = await buildReport({
      inputs: { fullName, bizSize, seats, alcohol, servingFood, gas },
      matchedRules,
    });

    res.status(200).json({
      matchedRules,
      aiReport,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
